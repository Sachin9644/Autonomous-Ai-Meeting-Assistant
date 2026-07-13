import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { X, PlayCircle, Loader2 } from 'lucide-react';

export default function AudioModal({ meeting, onClose }) {
    const { user } = useAuthStore();
    const token = localStorage.getItem('token');
    const audioUrl = `http://localhost:3001/api/v1/meetings/${meeting._id}/audio`;

    const [audioSrc, setAudioSrc] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(audioUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Audio file missing or still processing');
            return res.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            setAudioSrc(url);
        })
        .catch(err => {
            setError(err.message);
        });

        return () => {
            if (audioSrc) URL.revokeObjectURL(audioSrc);
        };
    }, [audioUrl, token]);

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
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-auto flex flex-col overflow-hidden border border-slate-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <PlayCircle className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 truncate pr-4">
                                Meeting Recording
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
                <div className="p-8 flex flex-col items-center justify-center bg-slate-50/50 min-h-[160px]">
                    {error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 w-full text-center text-sm font-medium shadow-sm">
                            {error}
                        </div>
                    ) : audioSrc ? (
                        <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <audio controls className="w-full" src={audioSrc} autoPlay>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-3 text-indigo-400" />
                            <p className="text-sm font-medium">Fetching secure audio stream...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="inline-flex justify-center rounded-lg bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
