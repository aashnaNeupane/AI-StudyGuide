from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class Question(BaseModel):
    id: int
    text: str
    options: List[str]
    # correct_answer should be hidden in frontend response typically, but for simplicity sending it or handling it in backend
    
class QuizGenerateRequest(BaseModel):
    topic: str
    num_questions: int = 5

class QuizCreate(BaseModel):
    topic: str
    questions: List[dict]

class Quiz(BaseModel):
    id: int
    topic: str
    questions: List[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuizAttemptCreate(BaseModel):
    quiz_id: int
    score: float
    total_questions: int

class QuizAttempt(QuizAttemptCreate):
    id: int
    completed_at: datetime
    
    class Config:
        from_attributes = True
