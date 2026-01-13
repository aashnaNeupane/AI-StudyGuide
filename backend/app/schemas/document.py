from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    file_path: str
    file_type: str
    upload_date: datetime
    owner_id: int

    class Config:
        from_attributes = True
