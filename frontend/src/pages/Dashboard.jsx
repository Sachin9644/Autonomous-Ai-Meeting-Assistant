import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    
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

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">Meeting Intelligence</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule New Meeting</h2>
                        <form onSubmit={handleSchedule} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Meeting Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Meeting Link (Meet/Zoom)</label>
                                <input type="url" required value={meetingLink} onChange={e => setMeetingLink(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time</label>
                                <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                            <div className="sm:col-span-2">
                                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                                    Schedule Meeting
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Meetings</h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {meetings.length === 0 ? (
                                <li className="p-6 text-center text-gray-500">No meetings scheduled yet.</li>
                            ) : meetings.map((meeting) => (
                                <li key={meeting._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 truncate">{meeting.title}</p>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {meeting.date} at {meeting.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${meeting.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                                              meeting.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                              'bg-blue-100 text-blue-800'}`}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
