from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from database import Base

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    is_verified = Column(Boolean, default=False)
    department = Column(String, nullable=False)
    createdAt = Column(DateTime, nullable=False)
    

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    examName = Column(String, nullable=False)
    examDescription = Column(String, nullable=True) 
    examTerm = Column(String, nullable=False)
    examSemester = Column(String, nullable=False)
    examDate = Column(String, nullable=False)
    examProfessor = Column(String, nullable=False)
    examPdf = Column(String, nullable=False)  # File path
    examSolution = Column(String, nullable=True)
    createdBy = Column(Integer, ForeignKey("users.id"), nullable=False)
    createdAt = Column(DateTime, nullable=False)
    updatedAt = Column(DateTime, nullable=False)
    department = Column(String, nullable=False)
    
class Bookmark(Base):
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    createdAt = Column(DateTime, nullable=False)