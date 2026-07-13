import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { X, FileText, Loader2 } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-slate-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 truncate pr-4">
                                Raw Transcript
                            </h3>
                            <p className="text-xs font-medium text-slate-500 truncate">
                                Context: {meeting.title}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-400" />
                            <p className="text-sm font-medium">Loading transcript...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md text-center text-sm font-medium shadow-sm">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-700 leading-relaxed max-w-full overflow-x-hidden">
                                {transcript || "Transcript is completely empty."}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="inline-flex justify-center rounded-lg bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                        Close Transcript
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
