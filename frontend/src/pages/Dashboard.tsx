import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import { client } from '../api/client';
import { FileText, MessageSquare, BrainCircuit, Trash2, ArrowRight, BookOpen } from 'lucide-react';
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

    const handleDelete = async (documentId: number, documentTitle: string) => {
        if (!window.confirm(`Are you sure you want to delete "${documentTitle}"?`)) {
            return;
        }

        try {
            await client.delete(`/documents/${documentId}`);
            fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document. Please try again.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back!
                </h1>
                <p className="mt-2 text-lg text-slate-500 font-medium">
                    Ready to master your next topic?
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Upload */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card rounded-3xl overflow-hidden p-6 ring-1 ring-slate-200/50 bg-white">
                        <FileUpload onUploadSuccess={fetchDocuments} />
                    </div>

                    <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 transition-transform active:scale-[0.98]">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <BrainCircuit className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Quick Start</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                            Jump straight into a personalized practice quiz based on your uploaded documents.
                        </p>
                        <Link to="/quiz" className="flex items-center justify-between bg-white text-indigo-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors group">
                            Take a quiz
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Right: Docs & Actions */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-100 rounded-xl">
                                    <BookOpen className="h-5 w-5 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Your Study Vault</h3>
                            </div>
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {documents.length} Files
                            </span>
                        </div>

                        {documents.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-2">
                                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No documents yet. Upload your first material!</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="group p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center min-w-0">
                                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mr-4">
                                                <FileText className="h-6 w-6 text-indigo-500" />
                                            </div>
                                            <div className="truncate">
                                                <h4 className="font-bold text-slate-800 truncate">{doc.title}</h4>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                    Uploaded on {new Date(doc.upload_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Link
                                                to="/study"
                                                className="p-2 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition-all"
                                                title="Study this"
                                            >
                                                <MessageSquare className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.title)}
                                                className="p-2 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-100 rounded-lg transition-all"
                                                title="Delete document"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
