from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.services.quiz_service import quiz_service

router = APIRouter()

@router.post("/generate", response_model=schemas.Quiz)
def generate_quiz(
    request: schemas.QuizGenerateRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a quiz based on a topic.
    """
    questions = quiz_service.generate_quiz(request.topic, request.num_questions)
    
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate quiz")
    
    # Save Quiz to DB
    db_quiz = models.Quiz(
        topic=request.topic,
        questions=questions,
        owner_id=current_user.id
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    
    return db_quiz

@router.post("/attempt", response_model=schemas.QuizAttempt)
def submit_attempt(
    result: schemas.QuizAttemptCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit a quiz attempt.
    """
    db_attempt = models.QuizAttempt(
        quiz_id=result.quiz_id,
        user_id=current_user.id,
        score=result.score,
        total_questions=result.total_questions
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

@router.get("/attempts", response_model=List[schemas.QuizAttempt])
def get_attempts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get user's quiz attempts.
    """
    attempts = db.query(models.QuizAttempt).filter(models.QuizAttempt.user_id == current_user.id).offset(skip).limit(limit).all()
    return attempts
