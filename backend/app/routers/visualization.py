from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import ParsedLog, TrainingMetric

router = APIRouter()

@router.get("/metrics/{log_id}")
def get_metrics(log_id: int, db: Session = Depends(get_db)):
    log = db.query(ParsedLog).filter(ParsedLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    metrics = db.query(TrainingMetric).filter(TrainingMetric.log_id == log_id).order_by(TrainingMetric.epoch).all()
    
    return {
        "project_name": log.project_name,
        "dataset": log.dataset,
        "model_arch": log.model_arch,
        "data": [
            {
                "epoch": m.epoch,
                "train_loss": m.train_loss,
                "val_loss": m.val_loss,
                "accuracy": m.accuracy,
                "learning_rate": m.learning_rate,
            }
            for m in metrics if m.epoch is not None
        ]
    }

@router.get("/histogram")
def get_histogram(dataset: str = "", db: Session = Depends(get_db)):
    return {
        "dataset": dataset or "all",
        "categories": [
            {"name": "训练集", "count": 50000},
            {"name": "验证集", "count": 10000},
            {"name": "测试集", "count": 10000},
        ]
    }
