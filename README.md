# StudyAI - Intelligent Study Assistant

StudyAI is a premium, AI-powered study assistant designed to help students master their learning materials through intelligent RAG (Retrieval-Augmented Generation) chat and automated quiz generation.

![StudyDashboard](file:///d:/CIC_Project/frontend/src/assets/dashboard_preview.png)

## ✨ Features

- **📄 Smart Document Ingestion**: Upload PDF or TXT files. The system automatically chunks and embeds your material for intelligent retrieval.
- **💬 In-Depth Study (RAG Chat)**: Ask specific questions about your uploaded documents. The AI provides context-aware answers based *only* on your material.
- **🧠 Practice Quiz Generator**: Automatically generate multiple-choice quizzes from your study materials to test your knowledge.
- **🗑️ Complete Memory Cleanup**: Deleting a document removes its file and clears its "memory" from the AI's vector database.
- **💎 Premium UI**: A modern, glassmorphic interface with smooth animations, gradients, and a high-end feel.

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy, SQLite
- **AI/LLM**: Groq (Llama-3), Google Gemini Embeddings
- **Vector Database**: ChromaDB
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Icons**: Lucide React

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- API Keys: [Groq API Key](https://console.groq.com/), [Google AI Studio Key](https://aistudio.google.com/)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/scripts/activate  # Windows: .\env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   SECRET_KEY=your_super_secret_key
   DATABASE_URL=sqlite:///./data/sql_app.db
   GROQ_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage
1. **Sign Up/Login**: Create an account to start your session.
2. **Upload**: Drop your study PDFs/TXTs into the Dashboard.
3. **Study**: Go to "In-Depth Study" to chat with your document.
4. **Quiz**: Navigate to "Practice Quiz" to test yourself.

## 🛡️ Privacy & Cleanup
When you delete a document from your dashboard, the system:
1. Deletes the physical file from the server.
2. Purges all associated vector embeddings from ChromaDB.
3. Removes the record from the SQL database.
