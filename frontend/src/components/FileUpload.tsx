import React, { useState } from 'react';
import { client } from '../api/client';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Study Material</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
                <Upload className="h-10 w-10 text-gray-400" />
                <div className="text-center">
                    <label htmlFor="file-upload" className="cursor-pointer font-medium text-primary hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt" />
                    </label>
                    <p className="text-xs text-gray-500">PDF or TXT up to 10MB</p>
                </div>
                {file && <p className="text-sm text-gray-700 flex items-center"><FileText className="h-4 w-4 mr-1" /> {file.name}</p>}
            </div>

            {status === 'success' && <div className="mt-4 p-2 bg-green-50 text-green-700 rounded text-sm flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> {message}</div>}
            {status === 'error' && <div className="mt-4 p-2 bg-red-50 text-red-700 rounded text-sm flex items-center"><AlertCircle className="h-4 w-4 mr-2" /> {message}</div>}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
        </div>
    );
};

export default FileUpload;
