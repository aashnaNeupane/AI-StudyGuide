from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.api import deps
from app.services.rag_service import rag_service

router = APIRouter()

@router.post("/", response_model=schemas.ChatResponse)
def chat(
    request: schemas.ChatRequest,
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Ask a question to the AI assistant based on uploaded documents.
    """
    try:
        # We could use user-specific collection names here provided by the frontend or derived from user ID
        # For now, sticking to "user_docs" as used in ingestion or request.collection_name
        collection = "user_docs" 
        answer, sources = rag_service.ask_question(request.question, collection_name=collection)
        
        return {
            "answer": answer,
            "sources": sources
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
