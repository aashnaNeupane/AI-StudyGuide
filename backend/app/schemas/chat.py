from typing import List, Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    collection_name: Optional[str] = "documents" # default collection

class SourceDocument(BaseModel):
    page_content: str
    source: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDocument]
