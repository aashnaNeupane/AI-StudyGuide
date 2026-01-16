from app.api.v1.endpoints import auth, users, documents, chat, quizzes
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(auth.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
