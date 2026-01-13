import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Study: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Mode</h1>
            <ChatInterface />
        </div>
    );
};

export default Study;
