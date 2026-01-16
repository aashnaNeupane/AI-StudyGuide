from typing import List
from langchain_core.embeddings import Embeddings
from google import genai
from app.core.config import settings

class GoogleGenAIEmbeddings(Embeddings):
    """
    Custom wrapper for the new google-genai SDK to be compatible with LangChain.
    """
    def __init__(self, model: str = "models/text-embedding-004"):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = model


    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed search docs."""
        results = []
        print(f"DEBUG: embed_documents called with {len(texts)} texts")
        for i, text in enumerate(texts):
            try:
                # print(f"DEBUG: Embedding text {i}: {text[:50]}...")
                response = self.client.models.embed_content(
                    model=self.model,
                    contents=text
                )
                if hasattr(response, 'embeddings'):
                    embedding_obj = response.embeddings[0]
                    if hasattr(embedding_obj, 'values'):
                        results.append(embedding_obj.values)
                    else:
                        print(f"DEBUG: No values in embedding object: {embedding_obj}")
                        results.append(embedding_obj) # Attempt fallback
                else:
                     print(f"DEBUG: Unexpected embedding response structure: {response}")
                     results.append([])
            except Exception as e:
                print(f"DEBUG: Embedding error for text {i}: {e}")
                results.append([])
        print(f"DEBUG: Generated {len(results)} embeddings")
        return results

    def embed_query(self, text: str) -> List[float]:
        """Embed query text."""
        try:
            response = self.client.models.embed_content(
                model=self.model,
                contents=text
            )
            if hasattr(response, 'embeddings'):
                # Same logic as above
                embedding_obj = response.embeddings[0]
                if hasattr(embedding_obj, 'values'):
                    return embedding_obj.values
                return embedding_obj
            return []
        except Exception as e:
            print(f"Embedding query error: {e}")
            return []
