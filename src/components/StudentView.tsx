import { Search, Folder, ArrowUpRight, Filter, User, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useClassroom } from '../context/ClassroomContext';

interface StudentViewProps {
    onOpenNote: (note: any) => void;
    innerTab: string;
}

export function StudentView({ onOpenNote, innerTab }: StudentViewProps) {
    const { activeClassId, notes, announcements, members } = useClassroom();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');

    const classNotes = notes.filter(n => n.classId === activeClassId);
    const classAnnouncements = announcements.filter(a => a.classId === activeClassId);

    const filteredNotes = classNotes.filter(note =>
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedSubject === 'All' || note.subject === selectedSubject)
    );

    const subjects = ['All', ...Array.from(new Set(classNotes.map(n => n.subject)))];

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {innerTab === 'stream' && (
                <div className="space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Class Stream</h3>
                            <p className="text-muted-foreground text-sm">Stay updated with the latest announcements from your teachers.</p>
                        </div>
                    </div>

                    {/* Stream Posts */}
                    <div className="space-y-4">
                        {classAnnouncements.map((post) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={post.id}
                                className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">{post.author}</h4>
                                        <p className="text-xs text-muted-foreground">{post.date}</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed mb-4">{post.content}</p>
                                <div className="border-t border-border pt-4">
                                    <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                                        {post.comments} class comments
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {innerTab === 'classwork' && (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold">Class Materials</h2>
                            <p className="text-muted-foreground text-sm">Access notes and files assigned to this class.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search classroom..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                />
                            </div>
                            <button className="p-2.5 border border-border rounded-xl hover:bg-accent text-muted-foreground transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Subject Filter Bar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                    selectedSubject === subject
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={note.id}
                                className="group relative bg-card border border-border rounded-3xl p-6 hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <Folder className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-accent/50 rounded-lg">
                                        {note.pages} Pages
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{note.title}</h3>
                                <p className="text-muted-foreground text-xs line-clamp-2 mb-6">
                                    {note.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{note.subject}</span>
                                    </div>

                                    <button
                                        onClick={() => onOpenNote(note)}
                                        className="flex items-center gap-2 text-xs font-bold text-primary hover:underline group/btn"
                                    >
                                        Open & Discuss
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredNotes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-4 rounded-full bg-accent/50 mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No materials found</h3>
                            <p className="text-muted-foreground">This classroom's library is currently empty.</p>
                        </div>
                    )}
                </div>
            )}

            {innerTab === 'people' && (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-12">
                    {/* Teachers */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-primary pb-2">
                            <h2 className="text-2xl font-bold text-primary">Teachers</h2>
                        </div>
                        <div className="space-y-4">
                            {members?.teachers?.map((teacher: string) => (
                                <div key={teacher} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <span className="font-semibold">{teacher}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Students */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <h2 className="text-2xl font-bold">Students</h2>
                            <span className="text-sm font-medium text-muted-foreground">{members?.students?.length || 0} students</span>
                        </div>
                        <div className="space-y-4">
                            {members?.students?.map((student: string) => (
                                <div key={student} className="flex items-center gap-4 pt-1">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium">{student}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
