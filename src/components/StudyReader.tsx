import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot, User, Download, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { getGeminiResponse } from '../lib/gemini';

interface Message {
    id: string;
    role: 'user' | 'gemini';
    text: string;
    timestamp: Date;
}

interface StudyReaderProps {
    note: any;
    onClose: () => void;
}

const suggestedPrompts = [
    "Summarize this page",
    "Explain the core concept",
    "Key takeaways",
    "Generate quiz questions"
];

export function StudyReader({ note, onClose }: StudyReaderProps) {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'gemini', text: `Hi! I'm Gemini. I've analyzed "${note.title}". How can I help you study today?`, timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Prepare history for API (map internal 'gemini' role to SDK 'model')
            // EXCLUDE the initial greeting (id='1') so history starts with User message
            const history = messages
                .filter(m => m.id !== '1')
                .map(m => ({
                    role: m.role === 'gemini' ? 'model' : 'user',
                    parts: m.text
                } as any));

            // Context from the note description/content
            const context = `Document Title: ${note.title}
Subject: ${note.subject}
Description: ${note.description}

Document Content:
${note.textContent ? note.textContent.substring(0, 30000) : "No text content extractable. Rely on description."}

You are a helpful AI study assistant. Answer the user's questions based primarily on the Document Content provided above.
IMPORTANT: Keep your responses in simple text (as markdown is not supported), super concise and to the point (under 3-4 sentences) unless the user explicitly asks for a response of certain number of words.`;

            const replyText = await getGeminiResponse(history, userMsg.text, context);

            const geminiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'gemini',
                text: replyText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, geminiMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'gemini',
                text: "Sorry, I encountered an error connecting to the AI service.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-background flex flex-col md:flex-row overflow-hidden"
        >
            {/* Document Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-500",
                isChatOpen ? "md:mr-[400px]" : "mr-0"
            )}>
                {/* Top Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="font-bold text-sm md:text-base">{note.title}</h2>
                            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{note.subject} • {note.pages} Pages</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={note.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-accent rounded-lg text-muted-foreground transition-colors"
                            title="Download Document"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                        {!isChatOpen && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Sparkles className="w-4 h-4" />
                                Ask Gemini
                            </button>
                        )}
                    </div>
                </header>

                {/* Viewer Content */}
                <div className="flex-1 bg-accent/20 p-4 md:p-8 overflow-y-auto flex justify-center">
                    {/* Mock PDF Viewer */}
                    {note.url ? (
                        <div className="w-full max-w-5xl h-full bg-white shadow-2xl rounded-sm overflow-hidden">
                            <iframe
                                src={`${note.url}#toolbar=0`}
                                className="w-full h-full border-none"
                                title={note.title}
                            />
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl bg-white text-black min-h-[1200px] shadow-2xl p-12 md:p-20 rounded-sm">
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-12">
                                <div className="p-4 rounded-full bg-accent/50">
                                    <FileText className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold">Preview Not Available</h3>
                                <p className="text-muted-foreground max-w-md">
                                    This document cannot be previewed directly. It might be a file type that doesn't support in-browser viewing, or the file is still processing.
                                </p>
                                <div className="p-4 border border-border rounded-xl bg-card max-w-md w-full text-left">
                                    <h4 className="font-bold">{note.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gemini Sidebar */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-card border-l border-border flex flex-col z-50 shadow-2xl shadow-black/50"
                    >
                        <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold">Gemini Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-2 hover:bg-accent rounded-lg text-muted-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-3",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                        msg.role === 'user' ? "bg-accent text-foreground" : "bg-primary text-primary-foreground"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user' ? "bg-accent/50 rounded-tr-none" : "bg-primary/10 text-foreground rounded-tl-none border border-primary/20"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tl-none border border-primary/20 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border space-y-4 bg-card/80 backdrop-blur-sm">
                            <div className="flex flex-wrap gap-2">
                                {suggestedPrompts.map(prompt => (
                                    <button
                                        key={prompt}
                                        onClick={() => {
                                            setInputText(prompt);
                                            handleSendMessage();
                                        }}
                                        className="text-xs px-3 py-1.5 bg-accent/50 hover:bg-primary/20 hover:text-primary border border-border rounded-full transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask a doubt about this file..."
                                    className="w-full bg-accent/30 border border-border rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                                <button
                                    disabled={!inputText.trim()}
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
