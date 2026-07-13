import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatModal({ meeting, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await api.post(`/meetings/${meeting._id}/chat`, { query: userMsg });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error answering your question. Make sure the AI backend is running.' }]);
        } finally {
            setIsLoading(false);
        }
    };

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
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] sm:h-[700px] max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Bot className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 truncate pr-4">
                                Meeting Intelligence
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

                {/* Chat History */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                                <Bot className="h-8 w-8 text-indigo-300" />
                            </div>
                            <p className="text-sm font-medium text-center">
                                Ask me anything about this meeting.<br/>
                                <span className="text-slate-400 text-xs mt-1 block">e.g., "Summarize the key decisions"</span>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx} 
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                                        {msg.role === 'user' ? <User className="h-4 w-4 text-indigo-700" /> : <Bot className="h-4 w-4 text-slate-700" />}
                                    </div>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 flex-row"
                                >
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-slate-700" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center">
                                        <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                                        <span className="ml-2 text-sm text-slate-500 font-medium">Processing context...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="flex gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-slate-900 placeholder:text-slate-400 px-3 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors focus:outline-none"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
