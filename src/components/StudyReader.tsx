import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, MessageSquare, ChevronRight, ChevronLeft, Bot, User, Share2, Download } from 'lucide-react';
import { cn } from '../lib/utils';

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

    const handleSendMessage = () => {
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

        // Mock Gemini Response
        setTimeout(() => {
            const responses = [
                "Based on the document, this section emphasizes the importance of understanding the fundamental principles before moving to complex applications.",
                "That's a great question! In context of this study pack, it refers to the process where individual components interact to form a complex whole.",
                "I've summarized that for you: 1. Main point A, 2. Secondary impact B, 3. Future implications C.",
                "Sure! Here are 3 practice questions: 1. Define the main term. 2. Compare X and Y. 3. Apply Z to a new scenario."
            ];
            const geminiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'gemini',
                text: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            };
            setMessages(prev => [...prev, geminiMsg]);
            setIsTyping(false);
        }, 1500);
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
                        <button className="p-2 hover:bg-accent rounded-lg text-muted-foreground"><Download className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-accent rounded-lg text-muted-foreground"><Share2 className="w-4 h-4" /></button>
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
                    <div className="w-full max-w-4xl bg-white text-black min-h-[1200px] shadow-2xl p-12 md:p-20 rounded-sm">
                        <h1 className="text-4xl font-serif font-bold mb-8 border-b-2 border-black pb-4">{note.title}</h1>
                        <div className="space-y-6 font-serif leading-relaxed text-lg text-neutral-800">
                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                                {note.description} This foundational document explores the intricacies of {note.subject.toLowerCase()} and its impact on modern theoretical frameworks.
                                As we delve into the core tenets, we observe a significant shift in perspective that has redefined the field over the last decade.
                            </p>
                            <h2 className="text-2xl font-bold pt-4">Introduction</h2>
                            <p>
                                The primary objective of this chapter is to provide a comprehensive overview of the mechanisms involved.
                                Historical context suggests that early pioneers struggled with the initial data sets, yet through rigorous
                                experimentation and iterative refinement, the current paradigm emerged.
                            </p>
                            <div className="bg-neutral-100 p-6 border-l-4 border-black my-8 italic">
                                "The pursuit of knowledge is not a destination, but a continuous journey of discovery and refinement."
                            </div>
                            <h2 className="text-2xl font-bold pt-4">Methodology</h2>
                            <p>
                                Our approach utilizes a multi-disciplinary framework, combining quantitative analysis with qualitative observations.
                                By synthesizing these disparate data streams, we can form a more holistic understanding of the phenomena under investigation.
                            </p>
                            <p>
                                Key variables identified include (a) initial velocity vectors, (b) thermal variance thresholds, and (c) isotopic
                                stability coefficients. Each of these plays a critical role in the final outcome.
                            </p>
                        </div>
                    </div>
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
