import json
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from app.core.config import settings

class QuizService:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0.7, openai_api_key=settings.OPENAI_API_KEY, model="gpt-3.5-turbo")

    def generate_quiz(self, topic: str, num_questions: int = 5):
        prompt = PromptTemplate(
            input_variables=["topic", "num_questions"],
            template="""
            You are an expert tutor. Generate a quiz with {num_questions} multiple choice questions about "{topic}".
            
            Return the result valid JSON format ONLY. 
            The structure should be a list of objects, where each object has:
            - "question": string
            - "options": list of 4 strings
            - "correct_answer": string (must be one of the options)
            
            Do not include any explanation or markdown formatting outside the JSON.
            """
        )
        
        chain = prompt | self.llm
        result = chain.invoke({"topic": topic, "num_questions": num_questions})
        
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
