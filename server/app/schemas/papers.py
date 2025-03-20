from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class PaperSchema(BaseModel):
    id: int
    examName: str
    examDescription: str
    examTerm: str
    examSemester: str
    examDate: str
    examProfessor: str
    examPdf: str  # File path or URL
    examSolution: Optional[str] = None 
    createdBy: int
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)
