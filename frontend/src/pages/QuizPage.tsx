import React, { useState } from 'react';
import { client } from '../api/client';
import { BrainCircuit, CheckCircle, XCircle } from 'lucide-react';

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

const QuizPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;
        setLoading(true);
        setQuiz(null);
        setSubmitted(false);
        setAnswers({});

        try {
            const response = await client.post('/quizzes/generate', { topic, num_questions: 3 });
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

        // Save attempt
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
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz Generator</h1>

            {!quiz ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleGenerate} className="flex gap-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter a topic (e.g., 'React Hooks', 'Photosynthesis')"
                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !topic}
                            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
                        >
                            <BrainCircuit className="h-4 w-4 mr-2" />
                            {loading ? 'Generating...' : 'Generate Quiz'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Topic: {quiz.topic}</h2>
                        <button onClick={() => setQuiz(null)} className="text-sm text-gray-500 hover:text-gray-700">Generate New</button>
                    </div>

                    {quiz.questions.map((q, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <p className="font-medium text-lg mb-4">{idx + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((option) => {
                                    const isSelected = answers[idx] === option;
                                    const isCorrect = submitted && option === q.correct_answer;
                                    const isWrong = submitted && isSelected && option !== q.correct_answer;

                                    let btnClass = "w-full text-left p-3 rounded-md border ";
                                    if (submitted) {
                                        if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-700";
                                        else if (isWrong) btnClass += "bg-red-50 border-red-500 text-red-700";
                                        else btnClass += "border-gray-200 opacity-50";
                                    } else {
                                        btnClass += isSelected ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200 hover:bg-gray-50";
                                    }

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(idx, option)}
                                            className={btnClass}
                                            disabled={submitted}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                {isWrong && <XCircle className="h-5 w-5 text-red-600" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {!submitted && (
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(answers).length < quiz.questions.length}
                            className="w-full py-3 bg-primary text-white rounded-md text-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300"
                        >
                            Submit Quiz
                        </button>
                    )}

                    {submitted && (
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <h3 className="text-xl font-bold">Score: {score} / {quiz.questions.length}</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizPage;
