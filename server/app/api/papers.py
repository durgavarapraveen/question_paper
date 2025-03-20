from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, FastAPI, Query
from sqlalchemy.orm import Session
from datetime import datetime
import os
import shutil
import app.schemas.papers as PaperSchema
from database import get_db
from Model import Paper
from Model import Bookmark
from fastapi.staticfiles import StaticFiles
from app.utils.dependencies import get_current_user
from typing import Optional
from app.utils.paper import s3_upload, s3_delete


# Initialize FastAPI app
app = FastAPI()

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")  # ✅ Ensures correct path
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the static files directory to serve uploaded files
router.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Upload PDF File
@router.post("/upload")
async def upload_paper(
    examName: str = Form(...),
    examDescription: str = Form(...),
    examTerm: str = Form(...),
    examSemester: str = Form(...),
    examDate: str = Form(...),
    examProfessor: str = Form(...),
    examPdf: UploadFile = File(...),
    examSolution: UploadFile = File(None),
    department: str = Form(...),
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    # Ensure the file is a PDF
    if examPdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    

    questionPaper = await examPdf.read()
    questionPaperSize = len(questionPaper)
    
    if questionPaperSize > 5000000:
        raise HTTPException(status_code=400, detail="File size should not exceed 5MB")
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    
    questionPaper_url = await s3_upload(contents=questionPaper, key=f'question_papers/{timestamp}_{examPdf.filename}')   
    
    if(questionPaper_url == None):
        raise HTTPException(status_code=400, detail="Error uploading") 

    # Handle optional exam solution file
    solution_url = None
    if examSolution:
        if examSolution.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        solution = await examSolution.read()
        solutionSize = len(solution)
        
        if solutionSize > 5000000:
            raise HTTPException(status_code=400, detail="File size should not exceed 5MB")
        
        solution_url = await s3_upload(contents=solution, key=f'solutions/{timestamp}_{examSolution.filename}')
        
        if(solution_url == None):
            raise HTTPException(status_code=400, detail="Error in Uploading Url")


    # Store in database
    new_paper = Paper(
        examName=examName,
        examDescription=examDescription,
        examTerm=examTerm,
        examSemester=examSemester,
        examDate=examDate,
        examProfessor=examProfessor,
        examPdf=questionPaper_url,  # Save relative path
        examSolution=solution_url,
        createdBy=current_user.id,  # Replace with actual user ID
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
        department=department
    )

    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)

    return new_paper


# Endpoint to Get Latest 20 Papers
@router.get("/get-papers")
async def get_papers(
    department: Optional[str] = Query(None, description="department"),
    examTerm: Optional[str] = Query(None, description="Filter by term"),
    examSemester: Optional[str] = Query(None, description="Filter by semester"),
    search: Optional[str] = Query(None, description="Search query"),
    db: Session = Depends(get_db)):
    
    query = db.query(Paper)
    
    if search:
        query = query.filter(Paper.examName.ilike(f"%{search}%") | 
                             Paper.examDescription.ilike(f"%{search}%") |
                             Paper.examProfessor.ilike(f"%{search}%"))
    
    if department:
        query = query.filter(Paper.department == department)
        
    if examTerm:
        query = query.filter(Paper.examTerm == examTerm)
        
    if examSemester:
        query = query.filter(Paper.examSemester == examSemester)
        
        
    papers = query.order_by(Paper.createdAt.desc()).limit(20).all()
    
        
    return papers

# Endpoint to Get Paper by ID
@router.post("/get-paper/{paper_id}")
async def get_paper(
    paper_id: int, 
    accessToken: Optional[str] = None,
    db: Session = Depends(get_db), 
):

    # Fetch the paper
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Default to False for unauthenticated users
    is_bookmarked = False
    
    # Check if the user is authenticated
    current_user = None
    if accessToken:
        current_user = get_current_user(accessToken, db)

    # If user is authenticated, check if the paper is bookmarked
    if current_user:
        bookmark = db.query(Bookmark).filter(
            Bookmark.paper_id == paper_id,
            Bookmark.user_id == current_user.id
        ).first()
        is_bookmarked = bool(bookmark)  # Convert to boolean

    return {"paper": paper, "is_bookmarked": is_bookmarked}



# Endpoint to get user upload papers
@router.get("/get-user-papers")
async def get_user_papers(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Paper).filter(Paper.createdBy == current_user.id).order_by(Paper.createdAt.desc()).all()

#Endpoint to bookmark a paper
@router.post("/bookmark-paper/{paper_id}")
async def bookmark_paper(paper_id: int, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Check if the paper is already bookmarked
    bookmark = db.query(Bookmark).filter(
        Bookmark.paper_id == paper_id,
        Bookmark.user_id == current_user.id
    ).first()

    if bookmark:
        # Delete the bookmark
        db.delete(bookmark)
        db.commit()
        return {"message": "Bookmark removed"}  # Don't try to refresh a deleted object
    
    # Create a new bookmark
    new_bookmark = Bookmark(
        paper_id=paper_id, 
        user_id=current_user.id, 
        createdAt=datetime.utcnow()
    )
    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)  # Safe to refresh since it's still in the session

    return new_bookmark

# Endpoint to get user bookmarks
@router.get("/get-bookmarks")
async def get_bookmarks(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    bookmark = db.query(Bookmark).filter(Bookmark.user_id == current_user.id).order_by(Bookmark.createdAt.desc()).all()
    
    #fetch the paper details
    papers = []
    for b in bookmark:
        paper = db.query(Paper).filter(Paper.id == b.paper_id).first()
        papers.append(paper)
        
    return papers


#Edit Paper
@router.put("/edit-paper/{paper_id}")
async def edit_paper(
    paper_id: int,
    examName: str = Form(None),
    examDescription: str = Form(None),
    examTerm: str = Form(None),
    examSemester: str = Form(None),
    examDate: str = Form(None),
    examProfessor: str = Form(None),
    examPdf: UploadFile = File(None),
    examSolution: UploadFile = File(None),
    department: str = Form(None),
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):  
    # Fetch the paper
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Check if the user is the creator of the paper
    if paper.createdBy != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this paper")
    
    # Update the paper
    if examName:
        paper.examName = examName
    if examDescription:
        paper.examDescription = examDescription
    if examTerm:
        paper.examTerm = examTerm
    if examSemester:
        paper.examSemester = examSemester
    if examDate:
        paper.examDate = examDate
    if examProfessor:
        paper.examProfessor = examProfessor
    if department:
        paper.department = department
    if examPdf:
        if examPdf.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        pdf_filename = f"{datetime.utcnow().timestamp()}_{examPdf.filename}"
        file_path = os.path.join(UPLOAD_DIR, pdf_filename)
        file_url = f"/uploads/{pdf_filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(examPdf.file, buffer)
        
        paper.examPdf = file_url
        
    if examSolution:
        if examSolution.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        solution_filename = f"{datetime.utcnow().timestamp()}_{examSolution.filename}"
        file_path_solution = os.path.join(UPLOAD_DIR, solution_filename)
        file_url_solution = f"/uploads/{solution_filename}"
        
        with open(file_path_solution, "wb") as buffer:
            shutil.copyfileobj(examSolution.file, buffer)
        
        paper.examSolution = file_url_solution
        
    paper.updatedAt = datetime.utcnow()
    
    db.commit()
    db.refresh(paper)
    
    return

#Delete Paper
@router.delete("/delete-paper/{paper_id}")
async def delete_paper(paper_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Check if the user is the creator of the paper
    if paper.createdBy != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this paper")
    
    #delete bookmarks associated with the paper
    db.query(Bookmark).filter(Bookmark.paper_id == paper_id).delete()
    
    #delete paper from aws s3
    if paper.examPdf:
        await s3_delete(paper.examPdf)
    
    db.delete(paper)
    db.commit()
    
    return {"status": 200, "detail": "Paper deleted successfully"}