import chromadb
from app.core.config import settings
import sys
import os

# Ensure we can import app modules
sys.path.append(os.getcwd())

def verify_chroma():
    print("Connecting to local ChromaDB at ./chroma_db ...")
    try:
        client = chromadb.PersistentClient(path="./chroma_db")
        print("Connected successfully.")
        
        collections = client.list_collections()
        print(f"Found {len(collections)} collections.")
        
        for col in collections:
            print(f"\nCollection Name: {col.name}")
            count = col.count()
            print(f"Document Count: {count}")
            
            if count > 0:
                peek = col.peek(limit=3)
                print(f"Top 3 Documents Metadata: {peek['metadatas']}")
                # print(f"Top 3 Documents Content: {peek['documents']}")
            else:
                print("Collection is empty.")
                
    except Exception as e:
        print(f"Error connecting to ChromaDB: {e}")

if __name__ == "__main__":
    verify_chroma()
