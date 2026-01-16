import os
import shutil
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.services.ingestion_service import ingestion_service

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/", response_model=List[schemas.Document])
def read_documents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve documents.
    """
    documents = db.query(models.Document).filter(models.Document.owner_id == current_user.id).offset(skip).limit(limit).all()
    return documents

@router.post("/upload", response_model=schemas.Document)
async def upload_document(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    description: str = Form(None),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a document and ingest it.
    """
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")

    # Save file to disk
    file_location = f"{UPLOAD_DIR}/{current_user.id}_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Database Entry
    db_document = models.Document(
        title=file.filename,
        description=description,
        file_path=file_location,
        file_type=file.content_type or "text/plain",
        owner_id=current_user.id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    # Trigger Ingestion
    try:
        ingestion_service.process_document(
            file_location, 
            document_id=db_document.id, 
            user_id=current_user.id,
            collection_name="user_docs"
        ) 
    except Exception as e:
        print(f"Ingestion failed: {e}")

    return db_document

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document.
    """
    # Find document and verify ownership
    document = db.query(models.Document).filter(
        models.Document.id == document_id,
        models.Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found or you don't have permission to delete it"
        )
    
    # 1. Cleanup ChromaDB Vector Data
    try:
        ingestion_service.delete_document_chunks(
            document_id=document_id, 
            file_path=document.file_path,
            collection_name="user_docs"
        )
    except Exception as e:
        print(f"Vector cleanup failed: {e}")
    
    # 2. Delete file from disk
    try:
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
    except Exception as e:
        print(f"Error deleting file from disk: {e}")
    
    # 3. Delete from database
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}
