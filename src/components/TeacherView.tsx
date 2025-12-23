import { Upload, FileText, CheckCircle2, Clock, Trash2, Send, User, UserPlus } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useClassroom } from '../context/ClassroomContext';

interface TeacherViewProps {
    innerTab: string;
}

export function TeacherView({ innerTab }: TeacherViewProps) {
    const {
        activeClassId,
        notes,
        announcements,
        members,
        addNote,
        deleteNote,
        addAnnouncement
    } = useClassroom();

    const [isDragging, setIsDragging] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        // Prepare the note data (id will be handled by the service/backend)
        const newNoteData = {
            name: file.name,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            date: new Date().toISOString().split('T')[0],
            status: 'Uploading' as const,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            classId: activeClassId,
            subject: 'General',
            description: `Uploaded material for ${activeClassId}`,
            pages: Math.floor(Math.random() * 20) + 1,
        };

        await addNote(newNoteData);
    };

    const handlePostAnnouncement = async () => {
        if (!newAnnouncement.trim()) return;

        await addAnnouncement({
            classId: activeClassId,
            author: 'You (Teacher)',
            date: new Date().toISOString().split('T')[0],
            content: newAnnouncement,
            comments: 0
        });

        setNewAnnouncement('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const currentClassNotes = notes.filter(n => n.classId === activeClassId);

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {innerTab === 'stream' && (
                <div className="space-y-6">
                    {/* Announcement Box */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea
                                    value={newAnnouncement}
                                    onChange={(e) => setNewAnnouncement(e.target.value)}
                                    placeholder="Announce something to your class"
                                    className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handlePostAnnouncement}
                                        className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <Send className="w-4 h-4" />
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stream Posts */}
                    <div className="space-y-4">
                        {announcements.filter(a => a.classId === activeClassId).map((post) => (
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
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                    />

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Class Materials</h2>
                        <button
                            onClick={triggerFileInput}
                            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Material
                        </button>
                    </div>

                    {/* Upload Zone */}
                    <motion.div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files[0];
                            if (file) processFile(file);
                        }}
                        onClick={triggerFileInput}
                        whileHover={{ scale: 1.005 }}
                        className={cn(
                            "relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300",
                            isDragging ? "border-primary bg-primary/5 scale-[1.02] shadow-xl" : "border-border hover:border-primary/50 hover:bg-accent/30"
                        )}
                    >
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Click or drag materials here</h3>
                                <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT up to 50MB</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Materials Table */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Size</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {currentClassNotes.map((upload) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            key={upload.id}
                                            className="border-b border-border/50 hover:bg-accent/10 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">{upload.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{upload.date}</td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{upload.size}</td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    upload.status === 'Processed' ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                                                )}>
                                                    {upload.status === 'Processed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-spin" />}
                                                    {upload.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteNote(upload.id)} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {currentClassNotes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm italic">
                                            No materials found in this classroom.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {innerTab === 'people' && (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-12">
                    {/* Teachers */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-primary pb-2">
                            <h2 className="text-2xl font-bold text-primary">Teachers</h2>
                            <button className="p-2 hover:bg-accent rounded-full text-primary transition-colors">
                                <UserPlus className="w-5 h-5" />
                            </button>
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
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">{members?.students?.length || 0} students</span>
                                <button className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                                    <UserPlus className="w-5 h-5" />
                                </button>
                            </div>
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
