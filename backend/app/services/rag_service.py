from typing import List
from app.core.gemini_embeddings import GoogleGenAIEmbeddings
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings
from app.schemas.chat import SourceDocument
import chromadb

class RAGService:
    def __init__(self):
        self.embeddings = GoogleGenAIEmbeddings(model="models/text-embedding-004")
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY,
            model_name="openai/gpt-oss-120b"
        )

    def format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

    def ask_question(self, query: str, user_id: int, collection_name: str = "documents"):
        # 1. Initialize Vector Store
        vectordb = Chroma(
            client=self.client,
            embedding_function=self.embeddings,
            collection_name=collection_name
        )
        
        # 2. Setup Retriever with user_id filter
        retriever = vectordb.as_retriever(
            search_kwargs={
                "k": 4,
                "filter": {"user_id": user_id}
            }
        )
        
        # 3. Define Prompt
        prompt = ChatPromptTemplate.from_template(
            """Answer the following question based only on the provided context.
            If you cannot answer from context, say "I don't have enough information."

            Context: {context}

            Question: {input}

            Answer:"""
        )
        
        # 4. Define LCEL Chain (Retrieval + Generation + Source Preservation)
        chain = (
            RunnableParallel({"context": retriever, "input": RunnablePassthrough()})
            | RunnableParallel({
                "answer": (
                    RunnablePassthrough.assign(context=lambda x: self.format_docs(x["context"]))
                    | prompt 
                    | self.llm 
                    | StrOutputParser()
                ),
                "context": lambda x: x["context"]
            })
        )
        
        # 5. Invoke
        try:
            print(f"Invoking RAG chain for query: {query}")
            result = chain.invoke(query)
            print("RAG chain invoked successfully.")
            
            # Debug: Print retrieved context
            retrieved_docs = result.get("context", [])
            print(f"DEBUG: Retrieved {len(retrieved_docs)} documents.")
            for i, doc in enumerate(retrieved_docs):
                print(f"DEBUG: Doc {i+1} Source: {doc.metadata.get('source', 'Unknown')}")
                print(f"DEBUG: Doc {i+1} Preamble: {doc.page_content[:100]}...")
        except Exception as e:
            print(f"Error invoking RAG chain: {e}")
            import traceback
            traceback.print_exc()
            raise e
        
        # 6. Format Output
        answer = result["answer"]
        source_docs = []
        for doc in result["context"]:
            source_docs.append(SourceDocument(
                page_content=doc.page_content,
                source=doc.metadata.get("source", "Unknown")
            ))
        
        return answer, source_docs

rag_service = RAGService()
