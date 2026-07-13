import { useState, useEffect } from 'react';
import api from '../services/api';

export default function TranscriptModal({ meeting, onClose }) {
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const res = await api.get(`/meetings/${meeting._id}/transcript`);
                setTranscript(res.data.content);
            } catch (err) {
                setError('Failed to load transcript. The meeting might still be processing or the file is missing.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTranscript();
    }, [meeting._id]);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-800 rounded-t-lg">
                    <h3 className="text-lg font-medium text-white truncate">
                        Raw Transcript: {meeting.title}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-gray-300 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50 whitespace-pre-wrap font-mono text-sm text-gray-800">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-500 animate-pulse">Loading transcript...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        transcript || "Transcript is completely empty."
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
