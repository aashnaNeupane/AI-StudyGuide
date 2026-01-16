from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router

from app.db.base import Base
from app.db.session import engine

app = FastAPI(
    title="AI Study Assistant API",
    openapi_url=f"/openapi.json",
)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

# Set all CORS enabled origins
# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to AI Study Assistant API"}

app.include_router(api_router, prefix="/api/v1")
