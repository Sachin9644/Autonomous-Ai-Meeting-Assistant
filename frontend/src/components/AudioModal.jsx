import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export default function AudioModal({ meeting, onClose }) {
    const { user } = useAuthStore();
    const token = localStorage.getItem('token');
    // Using the token directly in the URL to allow the <audio> tag to fetch it
    const audioUrl = `http://localhost:3001/api/v1/meetings/${meeting._id}/audio`;

    const [audioSrc, setAudioSrc] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the audio blob with auth headers since <audio src> doesn't send Bearer tokens
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

        // Cleanup blob URL
        return () => {
            if (audioSrc) URL.revokeObjectURL(audioSrc);
        };
    }, [audioUrl, token]);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-64 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-blue-600 rounded-t-lg">
                    <h3 className="text-lg font-medium text-white truncate">
                        Listen to Recording: {meeting.title}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50">
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : audioSrc ? (
                        <audio controls className="w-full" src={audioSrc} autoPlay>
                            Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <p className="text-gray-500 animate-pulse">Loading audio file...</p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg flex justify-end">
                    <button onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
