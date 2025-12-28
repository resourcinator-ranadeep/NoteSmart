import { Search, Folder, ArrowUpRight, Filter, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useClassroom } from '../context/ClassroomContext';

interface StudentViewProps {
    onOpenNote: (note: any) => void;
}

export function StudentView({ onOpenNote }: StudentViewProps) {
    const { notes, classes } = useClassroom();
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedSession, setSelectedSession] = useState('All');
    const [teacherSearch, setTeacherSearch] = useState('');
    const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);

    // Derived Lists for Filters
    const classNames = useMemo(() => ['All', ...Array.from(new Set(classes.map(c => c.name)))], [classes]);
    const subjects = useMemo(() => ['All', ...Array.from(new Set(notes.map(n => n.subject)))], [notes]);
    const sessions = ['All', '2024-2025', '2023-2024'];

    // Get unique teachers from notes
    const availableTeachers = useMemo(() => {
        const teachers = notes
            .map(n => n.uploadedBy)
            .filter((t): t is string => !!t);
        return Array.from(new Set(teachers));
    }, [notes]);

    // Teacher suggestions logic (5+ characters)
    const suggestions = useMemo(() => {
        if (teacherSearch.length < 5) return [];
        return availableTeachers.filter(t =>
            t.toLowerCase().includes(teacherSearch.toLowerCase())
        );
    }, [teacherSearch, availableTeachers]);

    const filteredNotes = notes.filter(note => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchQuery.toLowerCase());

        const noteClassName = classes.find(c => c.id === note.classId)?.name || '';

        const matchesClass = selectedClass === 'All' || noteClassName === selectedClass;
        const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
        const matchesSession = selectedSession === 'All' || true; // Placeholder

        const matchesTeacher = !teacherSearch ||
            (note.uploadedBy?.toLowerCase().includes(teacherSearch.toLowerCase()));

        return matchesSearch && matchesClass && matchesSubject && matchesSession && matchesTeacher;
    });

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.4]"
                style={{
                    backgroundImage: "url('/fantastic-mountains-digital-art_2560x1440.jpg')"
                }}
            />
            <div className="relative z-10 max-w-6xl mx-auto pb-12 space-y-8">
                {/* Header & Filters */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Student Library</h2>
                            <p className="text-muted-foreground">Access all study materials across your classes.</p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by title, subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-accent/30 border border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Class Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {classNames.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Subject Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Teacher Search with Autocomplete */}
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Teacher</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={teacherSearch}
                                    onChange={(e) => {
                                        setTeacherSearch(e.target.value);
                                        setShowTeacherSuggestions(true);
                                    }}
                                    onFocus={() => setShowTeacherSuggestions(true)}
                                    placeholder="Teacher name..."
                                    className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <AnimatePresence>
                                    {showTeacherSuggestions && suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-50 left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                                        >
                                            {suggestions.map((teacher) => (
                                                <button
                                                    key={teacher}
                                                    onClick={() => {
                                                        setTeacherSearch(teacher);
                                                        setShowTeacherSuggestions(false);
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent flex items-center gap-2 transition-colors"
                                                >
                                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {teacher}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Session Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Session</label>
                            <select
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedClass('All');
                                    setSelectedSubject('All');
                                    setSelectedSession('All');
                                    setTeacherSearch('');
                                    setSearchQuery('');
                                }}
                                className="w-full bg-accent hover:bg-accent/80 text-foreground font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note, index) => {
                        const noteClass = classes.find(c => c.id === note.classId);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={note.id}
                                className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                {/* Card Header / Thumbnail Area */}
                                <div className={cn(
                                    "h-32 p-6 flex flex-col justify-between relative overflow-hidden transition-colors",
                                    noteClass?.color === 'blue' ? "bg-blue-600/10" :
                                        noteClass?.color === 'purple' ? "bg-purple-600/10" :
                                            noteClass?.color === 'red' ? "bg-red-600/10" :
                                                noteClass?.color === 'green' ? "bg-green-600/10" :
                                                    noteClass?.color === 'indigo' ? "bg-indigo-600/10" :
                                                        noteClass?.color === 'orange' ? "bg-orange-600/10" :
                                                            noteClass?.color === 'pink' ? "bg-pink-600/10" :
                                                                noteClass?.color === 'cyan' ? "bg-cyan-600/10" :
                                                                    noteClass?.color === 'amber' ? "bg-amber-600/10" :
                                                                        noteClass?.color === 'emerald' ? "bg-emerald-600/10" :
                                                                            noteClass?.color === 'rose' ? "bg-rose-600/10" :
                                                                                "bg-slate-600/10"
                                )}>
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <Folder className={cn(
                                            "w-16 h-16",
                                            noteClass?.color === 'blue' ? "text-blue-600" :
                                                noteClass?.color === 'purple' ? "text-purple-600" :
                                                    noteClass?.color === 'red' ? "text-red-600" :
                                                        noteClass?.color === 'green' ? "text-green-600" :
                                                            noteClass?.color === 'indigo' ? "text-indigo-600" :
                                                                noteClass?.color === 'orange' ? "text-orange-600" :
                                                                    noteClass?.color === 'pink' ? "text-pink-600" :
                                                                        noteClass?.color === 'cyan' ? "text-cyan-600" :
                                                                            noteClass?.color === 'amber' ? "text-amber-600" :
                                                                                noteClass?.color === 'emerald' ? "text-emerald-600" :
                                                                                    noteClass?.color === 'rose' ? "text-rose-600" :
                                                                                        "text-slate-600"
                                        )} />
                                    </div>
                                    <div className="relative z-10">
                                        <span className={cn(
                                            "inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2",
                                            noteClass?.color === 'blue' ? "bg-blue-600 text-white" :
                                                noteClass?.color === 'purple' ? "bg-purple-600 text-white" :
                                                    noteClass?.color === 'red' ? "bg-red-600 text-white" :
                                                        noteClass?.color === 'green' ? "bg-green-600 text-white" :
                                                            noteClass?.color === 'indigo' ? "bg-indigo-600 text-white" :
                                                                noteClass?.color === 'orange' ? "bg-orange-600 text-white" :
                                                                    noteClass?.color === 'pink' ? "bg-pink-600 text-white" :
                                                                        noteClass?.color === 'cyan' ? "bg-cyan-600 text-white" :
                                                                            noteClass?.color === 'amber' ? "bg-amber-600 text-white" :
                                                                                noteClass?.color === 'emerald' ? "bg-emerald-600 text-white" :
                                                                                    noteClass?.color === 'rose' ? "bg-rose-600 text-white" :
                                                                                        "bg-slate-600 text-white"
                                        )}>
                                            {note.subject}
                                        </span>
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{note.title}</h3>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <span className="font-semibold text-foreground">{noteClass?.name}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {note.uploadedBy || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                            <span>{note.pages} Pages</span>
                                            <span>•</span>
                                            <span>{note.size}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {note.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                        <div className="text-xs font-medium text-muted-foreground">
                                            Posted {note.date}
                                        </div>
                                        <button
                                            onClick={() => onOpenNote(note)}
                                            className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group/btn"
                                        >
                                            Open
                                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-6 rounded-full bg-accent/30 mb-4">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No documents found</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Try adjusting your filters or search query to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedClass('All');
                                setSelectedSubject('All');
                                setSelectedSession('All');
                                setTeacherSearch('');
                                setSearchQuery('');
                            }}
                            className="mt-6 text-primary font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
