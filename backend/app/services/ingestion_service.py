import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from app.core.config import settings

import chromadb
from app.core.config import settings

class IngestionService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        # Use HttpClient to connect to the standalone Chroma service
        self.client = chromadb.HttpClient(host=settings.CHROMA_DB_HOST, port=settings.CHROMA_DB_PORT)

    def process_document(self, file_path: str, collection_name: str = "documents"):
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

        # 3. Store in Chroma
        vectordb = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            client=self.client,
            collection_name=collection_name
        )
        # vectordb.persist() # Not needed for HttpClient
        
        return len(chunks)

    def delete_collection(self, collection_name: str):
        # TODO: Implement deletion logic if needed
        pass

ingestion_service = IngestionService()
