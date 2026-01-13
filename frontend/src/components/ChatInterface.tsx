import React, { useState, useRef, useEffect } from 'react';
import { client } from '../api/client';
import { Send, Bot, Loader2 } from 'lucide-react';
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
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await client.post('/chat', { question: input });
            const assistantMessage: Message = { role: 'assistant', content: response.data.answer };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">AI Study Assistant</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>Ask me anything about your documents!</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={clsx(
                            "max-w-[80%] rounded-lg px-4 py-2",
                            msg.role === 'user' ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
