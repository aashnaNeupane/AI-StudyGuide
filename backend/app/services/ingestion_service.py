import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.gemini_embeddings import GoogleGenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.core.config import settings
from dotenv import load_dotenv
load_dotenv()

import chromadb
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
class IngestionService:
    def __init__(self):
        self.embeddings = GoogleGenAIEmbeddings(model="models/text-embedding-004")
        self.client = chromadb.PersistentClient(path="./chroma_db")

    def process_document(self, file_path: str, document_id: int, collection_name: str = "documents"):
        # 1. Load Document
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path)
        
        documents = loader.load()

        # 2. Split Text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)

        # Add document_id to metadata
        for chunk in chunks:
            chunk.metadata["document_id"] = document_id

        # 3. Store in Chroma
        print(f"DEBUG: Ingesting {len(chunks)} chunks for document {document_id} into collection '{collection_name}'...")
        try:
            vectordb = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                client=self.client,
                collection_name=collection_name
            )
            print("DEBUG: Ingestion triggered via Chroma.from_documents")
            # Force a little check
            col = self.client.get_collection(collection_name)
            print(f"DEBUG: Collection '{collection_name}' count after ingestion: {col.count()}")
        except Exception as e:
            print(f"DEBUG: Ingestion error in Chroma: {e}")
            raise e
        
        return len(chunks)

    def delete_document_chunks(self, document_id: int, file_path: str = None, collection_name: str = "user_docs"):
        """Delete all chunks associated with a specific document_id or file_path."""
        print(f"DEBUG: Deleting chunks for document ID {document_id} (path: {file_path}) from collection '{collection_name}'...")
        try:
            col = self.client.get_collection(collection_name)
            
            # 1. Delete by document_id metadata (for new uploads)
            col.delete(where={"document_id": document_id})
            
            # 2. Delete by source metadata (fallback for older/all uploads)
            if file_path:
                # Standardize path for matching (Chroma often uses forward slashes internally)
                normalized_path = file_path.replace("\\", "/")
                col.delete(where={"source": file_path})
                if normalized_path != file_path:
                    col.delete(where={"source": normalized_path})
            
            print(f"DEBUG: Cleanup successful for {document_id}. Current collection count: {col.count()}")
        except Exception as e:
            print(f"DEBUG: Error during Chroma cleanup: {e}")
            # Non-blocking, but good to log

ingestion_service = IngestionService()
