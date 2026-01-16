import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { Sparkles } from 'lucide-react';

const Study: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Sparkles className="h-3 w-3" />
                        <span>Adaptive Learning</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Focus Session</h1>
                    <p className="text-slate-500 font-medium">Deep dive into your materials with AI guidance.</p>
                </div>
            </header>

            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 blur-3xl rounded-[3rem] -z-10 opacity-50" />
                <ChatInterface />
            </div>
        </div>
    );
};

export default Study;
