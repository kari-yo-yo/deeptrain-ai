from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Term
from app.schemas import TermResponse

router = APIRouter()

@router.get("", response_model=List[TermResponse])
def list_terms(
    q: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Term)
    if category and category != 'all':
        query = query.filter(Term.category == category)
    if q:
        query = query.filter(Term.name.contains(q) | Term.short_desc.contains(q))
    terms = query.offset(skip).limit(limit).all()
    return terms

@router.get("/{term_id}", response_model=TermResponse)
def get_term(term_id: int, db: Session = Depends(get_db)):
    term = db.query(Term).filter(Term.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    return term
