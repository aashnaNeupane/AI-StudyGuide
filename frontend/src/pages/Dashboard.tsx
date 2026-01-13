import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import { client } from '../api/client';
import { FileText, MessageSquare, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Document {
    id: number;
    title: string;
    upload_date: string;
}

const Dashboard: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

    const fetchDocuments = async () => {
        try {
            const response = await client.get('/documents/');
            setDocuments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upload Section */}
                <div className="md:col-span-1">
                    <FileUpload onUploadSuccess={fetchDocuments} />
                </div>

                {/* Actions & Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/study" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="p-2 bg-indigo-100 rounded-full mr-4">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Start Chatting</h4>
                                    <p className="text-sm text-gray-500">Ask questions about your docs</p>
                                </div>
                            </Link>
                            <Link to="/quiz" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="p-2 bg-green-100 rounded-full mr-4">
                                    <BrainCircuit className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Take a Quiz</h4>
                                    <p className="text-sm text-gray-500">Test your knowledge</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Documents</h3>
                        {documents.length === 0 ? (
                            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {documents.map((doc) => (
                                    <li key={doc.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-sm font-medium text-gray-900">{doc.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(doc.upload_date).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
