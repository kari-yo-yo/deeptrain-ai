from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import settings
import os
import shutil

router = APIRouter()

@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    upload_dir = settings.TOS_PATH
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "path": file_path, "size": os.path.getsize(file_path)}

@router.get("/{filename}")
def get_file(filename: str):
    file_path = os.path.join(settings.TOS_PATH, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return {"filename": filename, "path": file_path, "size": os.path.getsize(file_path)}
