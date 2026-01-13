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

    # Trigger Ingestion (Async ideally, but blocking for MVP)
    try:
        ingestion_service.process_document(file_location, collection_name="user_docs") 
        # Note: We might want to metadata filter by user_id in retrieval, so storing all in one collection with metadata is better.
        # But for now, let's keep it simple. `ingestion_service` stores basics. 
        # Ideally, we add metadata={"user_id": user.id} to chunks.
    except Exception as e:
        print(f"Ingestion failed: {e}")
        # Optionally delete DB entry or mark as failed
        # raise HTTPException(status_code=500, detail="Ingestion failed")

    return db_document
