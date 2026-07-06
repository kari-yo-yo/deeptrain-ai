from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Tutorial
from app.schemas import TutorialResponse

router = APIRouter()

@router.get("", response_model=List[TutorialResponse])
def list_tutorials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tutorials = db.query(Tutorial).order_by(Tutorial.order_index).offset(skip).limit(limit).all()
    return tutorials

@router.get("/{tutorial_id}", response_model=TutorialResponse)
def get_tutorial(tutorial_id: int, db: Session = Depends(get_db)):
    tutorial = db.query(Tutorial).filter(Tutorial.id == tutorial_id).first()
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return tutorial
