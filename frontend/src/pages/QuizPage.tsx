import React, { useState, useEffect } from 'react';
import { client } from '../api/client';
import { BrainCircuit, CheckCircle, XCircle, Sparkles, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import clsx from 'clsx';

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
}

interface Quiz {
    id: number;
    topic: string;
    questions: Question[];
}

interface Document {
    id: number;
    title: string;
    upload_date: string;
}

const QuizPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await client.get('/documents/');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || !selectedDocumentId) return;
        setLoading(true);
        setQuiz(null);
        setSubmitted(false);
        setAnswers({});

        try {
            const response = await client.post('/quizzes/generate', {
                topic,
                num_questions: 3,
                document_id: selectedDocumentId
            });
            setQuiz(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIdx: number, option: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmitQuiz = async () => {
        if (!quiz) return;
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_answer) correctCount++;
        });
        setScore(correctCount);
        setSubmitted(true);

        try {
            await client.post('/quizzes/attempt', {
                quiz_id: quiz.id,
                score: correctCount,
                total_questions: quiz.questions.length
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <header className="text-center space-y-2">
                <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-2">
                    <BrainCircuit className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Quiz Generator</h1>
                <p className="text-slate-500 font-medium">Test your mastery of any uploaded material.</p>
            </header>

            {!quiz ? (
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-200/60 max-w-2xl mx-auto">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="document" className="block text-sm font-bold text-slate-700 mb-2">
                                    Step 1: Select Your Document
                                </label>
                                <select
                                    id="document"
                                    value={selectedDocumentId || ''}
                                    onChange={(e) => setSelectedDocumentId(Number(e.target.value))}
                                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-medium text-slate-900"
                                    required
                                >
                                    <option value="">Choose a document...</option>
                                    {documents.map((doc) => (
                                        <option key={doc.id} value={doc.id}>{doc.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="topic" className="block text-sm font-bold text-slate-700 mb-2">
                                    Step 2: Focus Area
                                </label>
                                <input
                                    id="topic"
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., 'Core Concepts', 'Summary', 'Key definitions'"
                                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !topic || !selectedDocumentId}
                            className="w-full premium-button group flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3" />
                                    Creating personalized quiz...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                                    Generate Practice Quiz
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="space-y-8 pb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Topic / Focus</span>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{quiz.topic}</h2>
                        </div>
                        <button
                            onClick={() => setQuiz(null)}
                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Start New Quiz</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {quiz.questions.map((q, idx) => (
                            <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="p-8">
                                    <p className="flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                                        Question {idx + 1}
                                    </p>
                                    <h3 className="text-xl font-bold text-slate-900 leading-relaxed mb-8">{q.question}</h3>

                                    <div className="grid gap-4">
                                        {q.options.map((option) => {
                                            const isSelected = answers[idx] === option;
                                            const isCorrect = submitted && option === q.correct_answer;
                                            const isWrong = submitted && isSelected && option !== q.correct_answer;

                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionSelect(idx, option)}
                                                    className={clsx(
                                                        "w-full text-left p-5 rounded-2xl border-2 transition-all group relative overflow-hidden",
                                                        !submitted && (isSelected ? "bg-indigo-50 border-indigo-600" : "bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white"),
                                                        submitted && isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-800",
                                                        submitted && isWrong && "bg-red-50 border-red-500 text-red-800",
                                                        submitted && !isCorrect && !isWrong && "opacity-50 border-slate-100 bg-slate-50"
                                                    )}
                                                    disabled={submitted}
                                                >
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className="font-bold">{option}</span>
                                                        {isCorrect && <CheckCircle className="h-6 w-6 text-emerald-600" />}
                                                        {isWrong && <XCircle className="h-6 w-6 text-red-600" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky bottom-8 max-w-lg mx-auto bg-white p-4 rounded-3xl shadow-2xl border border-slate-100">
                        {!submitted ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(answers).length < quiz.questions.length}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all"
                            >
                                Finish Practice Session
                            </button>
                        ) : (
                            <div className="flex items-center justify-between px-4 py-2">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-amber-50 rounded-2xl">
                                        <Trophy className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Score</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900">{score} / {quiz.questions.length}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setQuiz(null)}
                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
