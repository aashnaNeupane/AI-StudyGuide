from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Document(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("user.id"))

    owner = relationship("User", backref="documents")
