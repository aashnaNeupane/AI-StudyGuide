from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Quiz(Base):
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    questions = Column(JSON) # List of questions [{question, options, correct_answer}]
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("user.id"))
    
    owner = relationship("User", backref="quizzes")

class QuizAttempt(Base):
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quiz.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    score = Column(Float)
    total_questions = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", backref="attempts")
    quiz = relationship("Quiz", backref="attempts")
