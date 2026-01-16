import json
import chromadb
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from app.core.config import settings
from app.core.gemini_embeddings import GoogleGenAIEmbeddings

class QuizService:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0.7, 
            groq_api_key=settings.GROQ_API_KEY, 
            model_name="openai/gpt-oss-120b"
        )
        self.embeddings = GoogleGenAIEmbeddings(model="models/text-embedding-004")
        self.client = chromadb.PersistentClient(path="./chroma_db")

    def _retrieve_document_content(self, topic: str, collection_name: str = "user_docs", k: int = 5) -> str:
        """Retrieve relevant document chunks from ChromaDB based on the topic."""
        try:
            vectordb = Chroma(
                client=self.client,
                collection_name=collection_name,
                embedding_function=self.embeddings
            )
            
            # Retrieve relevant chunks
            docs = vectordb.similarity_search(topic, k=k)
            
            if not docs:
                return ""
            
            # Combine chunks into context
            context = "\n\n".join([doc.page_content for doc in docs])
            return context
        except Exception as e:
            print(f"Document retrieval error: {e}")
            return ""

    def generate_quiz(self, topic: str, num_questions: int = 5, document_id: int = None):
        # Retrieve document content if document_id is provided
        document_context = ""
        if document_id:
            document_context = self._retrieve_document_content(topic)
        
        if document_context:
            # Generate quiz from document content
            prompt = ChatPromptTemplate.from_template(
                """
                You are an expert tutor. Generate a quiz with {num_questions} multiple choice questions based on the following document content.
                
                Document Content:
                {context}
                
                Topic Focus: {topic}
                
                Generate questions that are directly based on the information in the document above.
                
                Return the result in valid JSON format ONLY. 
                The structure should be a list of objects, where each object has:
                - "question": string
                - "options": list of 4 strings
                - "correct_answer": string (must be one of the options)
                
                Do not include any explanation or markdown formatting outside the JSON.
                """
            )
            result = (prompt | self.llm).invoke({
                "topic": topic, 
                "num_questions": num_questions,
                "context": document_context
            })
        else:
            # Generate quiz from topic only (fallback)
            prompt = ChatPromptTemplate.from_template(
                """
                You are an expert tutor. Generate a quiz with {num_questions} multiple choice questions about "{topic}".
                
                Return the result in valid JSON format ONLY. 
                The structure should be a list of objects, where each object has:
                - "question": string
                - "options": list of 4 strings
                - "correct_answer": string (must be one of the options)
                
                Do not include any explanation or markdown formatting outside the JSON.
                """
            )
            result = (prompt | self.llm).invoke({"topic": topic, "num_questions": num_questions})
        
        try:
            content = result.content.strip()
            # Clean up potential markdown code blocks
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            questions = json.loads(content)
            return questions
        except Exception as e:
            print(f"Quiz generation error: {e}")
            return []

quiz_service = QuizService()
