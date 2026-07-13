import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../components/ChatModal';
import TranscriptModal from '../components/TranscriptModal';
import AudioModal from '../components/AudioModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, LogOut, MessageSquare, FileText, PlayCircle, Clock, Calendar as CalendarIcon, Video } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [viewTranscriptMeeting, setViewTranscriptMeeting] = useState(null);
    const [playAudioMeeting, setPlayAudioMeeting] = useState(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const res = await api.get('/meetings');
            setMeetings(res.data);
        } catch (error) {
            console.error('Failed to fetch meetings', error);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await api.post('/meetings', { title, meetingLink, date, time });
            setTitle('');
            setMeetingLink('');
            setDate('');
            setTime('');
            fetchMeetings();
        } catch (error) {
            alert('Failed to schedule meeting');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Minimalist Topbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Video className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Meeting Intelligence</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-slate-600 font-medium">{user?.name}</span>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Schedule Form */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 sticky top-24"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <CalendarPlus className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h2 className="text-base font-semibold text-slate-900">Schedule Meeting</h2>
                            </div>

                            <form onSubmit={handleSchedule} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Title</label>
                                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all" placeholder="e.g. Q3 Sync" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Link</label>
                                    <input type="url" required value={meetingLink} onChange={e => setMeetingLink(e.target.value)} className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all" placeholder="https://meet.google.com/..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Date</label>
                                        <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Time</label>
                                        <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                                        Schedule Automator
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Column: Meetings List */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Your Meetings</h3>
                        </div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {meetings.length === 0 ? (
                                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                                    <CalendarIcon className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                                    <p className="text-sm font-medium text-slate-500">No meetings scheduled yet.</p>
                                </motion.div>
                            ) : meetings.map((meeting) => (
                                <motion.div 
                                    variants={itemVariants}
                                    key={meeting._id} 
                                    className="group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        
                                        {/* Meeting Info */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-base font-semibold text-slate-900">{meeting.title}</h4>
                                                <span className={`px-2.5 py-0.5 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full 
                                                    ${meeting.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 
                                                    meeting.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                                                    'bg-blue-100 text-blue-700'}`}>
                                                    {meeting.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> {meeting.date}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {meeting.time}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <button 
                                                onClick={() => setViewTranscriptMeeting(meeting)}
                                                className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-md transition-colors"
                                            >
                                                <FileText className="h-3.5 w-3.5" /> Transcript
                                            </button>
                                            <button 
                                                onClick={() => setPlayAudioMeeting(meeting)}
                                                className="flex items-center gap-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-md transition-colors"
                                            >
                                                <PlayCircle className="h-3.5 w-3.5" /> Audio
                                            </button>
                                            <button 
                                                onClick={() => setSelectedMeeting(meeting)}
                                                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3 rounded-md shadow-sm transition-all"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" /> Ask AI
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </main>

            <AnimatePresence>
                {selectedMeeting && (
                    <ChatModal 
                        meeting={selectedMeeting} 
                        onClose={() => setSelectedMeeting(null)} 
                    />
                )}
                {viewTranscriptMeeting && (
                    <TranscriptModal 
                        meeting={viewTranscriptMeeting} 
                        onClose={() => setViewTranscriptMeeting(null)} 
                    />
                )}
                {playAudioMeeting && (
                    <AudioModal 
                        meeting={playAudioMeeting} 
                        onClose={() => setPlayAudioMeeting(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
