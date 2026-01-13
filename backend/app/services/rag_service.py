from typing import List
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from app.core.config import settings
from app.schemas.chat import SourceDocument

import chromadb

class RAGService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        self.client = chromadb.HttpClient(host=settings.CHROMA_DB_HOST, port=settings.CHROMA_DB_PORT)
        self.llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY, model="gpt-3.5-turbo")

    def ask_question(self, query: str, collection_name: str = "documents"):
        # 1. Initialize Vector Store
        vectordb = Chroma(
            client=self.client,
            embedding_function=self.embeddings,
            collection_name=collection_name
        )
        
        # 2. Setup Retriever
        retriever = vectordb.as_retriever(search_kwargs={"k": 4})
        
        # 3. Setup QA Chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
        
        # 4. Invoke
        result = qa_chain.invoke({"query": query})
        
        # 5. Format Output
        answer = result["result"]
        source_docs = []
        for doc in result["source_documents"]:
            source_docs.append(SourceDocument(
                page_content=doc.page_content,
                source=doc.metadata.get("source", "Unknown")
            ))
            
        return answer, source_docs

rag_service = RAGService()
