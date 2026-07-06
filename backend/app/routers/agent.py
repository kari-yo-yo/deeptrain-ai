from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ParsedLog, TrainingMetric, CodeSnippet
from app.schemas import LogParseRequest, LogParseResponse, ParsedLogResponse, ParsedLogCreate
from app.services.log_parser import parser

router = APIRouter()

@router.post("/parse", response_model=LogParseResponse)
def parse_log(request: LogParseRequest):
    if not request.raw_log or len(request.raw_log.strip()) == 0:
        raise HTTPException(status_code=400, detail="Log content is required")
    result = parser.parse(request.raw_log)
    return LogParseResponse(
        meta=result['meta'],
        epochs=result['epochs'],
        code_blocks=result['code_blocks'],
        errors=result['errors'],
    )

@router.post("/save", response_model=ParsedLogResponse)
def save_parsed_log(
    project_name: str = "未命名项目",
    dataset: str = "",
    model_arch: str = "",
    raw_log: str = "",
    db: Session = Depends(get_db)
):
    if not raw_log:
        raise HTTPException(status_code=400, detail="Raw log is required")
    
    result = parser.parse(raw_log)
    
    log = ParsedLog(
        project_name=project_name,
        dataset=dataset,
        model_arch=model_arch,
        status=result['status'],
        raw_log=raw_log,
        parsed_meta=result['meta'],
    )
    db.add(log)
    db.flush()
    
    for epoch_data in result['epochs']:
        metric = TrainingMetric(
            log_id=log.id,
            epoch=epoch_data.get('epoch'),
            train_loss=epoch_data.get('train_loss'),
            accuracy=epoch_data.get('accuracy'),
            learning_rate=epoch_data.get('learning_rate'),
        )
        db.add(metric)
    
    for i, block in enumerate(result['code_blocks']):
        snippet = CodeSnippet(
            log_id=log.id,
            title=f"代码片段 {i+1}",
            language=block['language'],
            code=block['code'],
        )
        db.add(snippet)
    
    db.commit()
    db.refresh(log)
    return log

@router.get("/logs", response_model=List[ParsedLogResponse])
def list_logs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(ParsedLog).order_by(ParsedLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/logs/{log_id}", response_model=ParsedLogResponse)
def get_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(ParsedLog).filter(ParsedLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@router.delete("/logs/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(ParsedLog).filter(ParsedLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}
