import React, { useState, useRef, useEffect } from 'react';
import { client } from '../api/client';
import { Send, Bot, Loader2, User, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await client.post('/chat', { question: input });
            const assistantMessage: Message = { role: 'assistant', content: response.data.answer };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[700px] bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-none">Study Companion</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">AI Powered Assistant</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-700">
                        <div className="p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-2">
                            <Bot className="h-12 w-12 text-indigo-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">Your Personal Study AI</h4>
                            <p className="text-slate-500 max-w-[280px] mt-2 font-medium">Ask questions about your uploaded documents to get deep insights.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex items-end space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
                        )}
                    >
                        <div className={clsx(
                            "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm",
                            msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-slate-100"
                        )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div className={clsx(
                            "max-w-[85%] px-4 py-3 shadow-sm",
                            msg.role === 'user'
                                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none font-medium"
                                : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none font-medium leading-relaxed"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex items-end space-x-3 animate-pulse">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your study material..."
                        className="w-full pl-5 pr-14 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all font-medium placeholder:text-slate-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-0 disabled:scale-90 transition-all active:scale-95"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
