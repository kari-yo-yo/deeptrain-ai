from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import ParsedLog, CodeSnippet
from app.schemas import ParsedLogResponse

router = APIRouter()

@router.get("", response_model=List[ParsedLogResponse])
def list_codes(
    project_name: Optional[str] = None,
    dataset: Optional[str] = None,
    model_arch: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(ParsedLog)
    if project_name:
        query = query.filter(ParsedLog.project_name.contains(project_name))
    if dataset:
        query = query.filter(ParsedLog.dataset.contains(dataset))
    if model_arch:
        query = query.filter(ParsedLog.model_arch.contains(model_arch))
    if status:
        query = query.filter(ParsedLog.status == status)
    
    codes = query.order_by(ParsedLog.created_at.desc()).offset(skip).limit(limit).all()
    return codes

@router.get("/{code_id}", response_model=ParsedLogResponse)
def get_code(code_id: int, db: Session = Depends(get_db)):
    code = db.query(ParsedLog).filter(ParsedLog.id == code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Code not found")
    return code

@router.get("/{code_id}/diff")
def diff_codes(code_id: int, target_id: int, db: Session = Depends(get_db)):
    source = db.query(ParsedLog).filter(ParsedLog.id == code_id).first()
    target = db.query(ParsedLog).filter(ParsedLog.id == target_id).first()
    if not source or not target:
        raise HTTPException(status_code=404, detail="Code not found")
    
    source_codes = db.query(CodeSnippet).filter(CodeSnippet.log_id == code_id).all()
    target_codes = db.query(CodeSnippet).filter(CodeSnippet.log_id == target_id).all()
    
    return {
        "source": {
            "project_name": source.project_name,
            "created_at": source.created_at,
            "code_snippets": [{"title": s.title, "code": s.code} for s in source_codes],
        },
        "target": {
            "project_name": target.project_name,
            "created_at": target.created_at,
            "code_snippets": [{"title": t.title, "code": t.code} for t in target_codes],
        },
    }
