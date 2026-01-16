import React, { useState } from 'react';
import { client } from '../api/client';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const FileUpload: React.FC<{ onUploadSuccess?: () => void }> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setStatus('idle');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await client.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('success');
            setMessage('File uploaded successfully!');
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error: any) {
            setStatus('error');
            setMessage('Failed to upload file.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Add Material</h3>

            <div className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}>
                {!file ? (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">Select Document</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt" />
                            <p className="text-xs text-slate-500 mt-1 font-medium">PDF or TXT up to 10MB</p>
                        </div>
                    </label>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-2">
                            <FileText className="h-6 w-6 text-indigo-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 text-center truncate max-w-[200px] mb-1">{file.name}</span>
                        <button
                            onClick={() => setFile(null)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center"
                        >
                            <X className="h-3 w-3 mr-1" /> Remove
                        </button>
                    </div>
                )}
            </div>

            {status === 'success' && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center animate-in fade-in zoom-in-95">
                    <CheckCircle className="h-4 w-4 mr-2 shrink-0" /> {message}
                </div>
            )}
            {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex items-center animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-4 w-4 mr-2 shrink-0" /> {message}
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-2xl shadow-lg shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all active:scale-[0.98]"
            >
                {uploading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
                        Processing...
                    </>
                ) : 'Upload Document'}
            </button>
        </div>
    );
};

export default FileUpload;
