import os
from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Study Assistant"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGEME_SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/sql_app.db")
    
    # Chroma
    CHROMA_DB_HOST: str = os.getenv("CHROMA_DB_HOST", "chromadb")
    CHROMA_DB_PORT: int = int(os.getenv("CHROMA_DB_PORT", 8000))
    
    # OTHERS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # OPENAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # GROQ
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # GEMINI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
