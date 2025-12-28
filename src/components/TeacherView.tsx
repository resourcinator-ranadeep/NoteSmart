import { Upload, FileText, CheckCircle2, Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useClassroom } from '../context/ClassroomContext';
import { useAuth } from '../context/AuthContext';
import type { Class, Note } from '../types';
import { extractPdfData } from '../lib/pdfUtils';
import { SUBJECT_CODES } from '../data/mockData';

export function TeacherView() {
    const { activeClassId, notes, addNote, deleteNote, classes, setActiveClassId } = useClassroom();

    // We get the teacher name from AuthContext
    const { currentUser, userName } = useAuth();
    const teacherName = userName || currentUser?.email?.split('@')[0] || "Teacher";

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Delete Confirmation State
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Upload Form State
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [uploadClassId, setUploadClassId] = useState(activeClassId || (classes[0]?.id || ''));
    const [subject, setSubject] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [session, setSession] = useState('2024-2025');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate File Type (PDF only)
            if (selectedFile.type !== 'application/pdf') {
                setValidationError("Only PDF files are allowed.");
                e.target.value = ''; // Reset input
                setFile(null);
                return;
            }

            // Validate File Size (Max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setValidationError("File size exceeds 10MB limit.");
                e.target.value = ''; // Reset input
                setFile(null);
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleSubjectCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSubjectCode(value);

        if (value.length >= 2) {
            const filtered = SUBJECT_CODES.filter(code =>
                code.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (code: string) => {
        setSubjectCode(code);
        setSuggestions([]);
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all compulsory fields
        if (!file || !uploadClassId || !subject || !subjectCode || !session || !description) {
            setValidationError("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            let extractedData = { text: '', pageCount: 0 };
            if (file.type === 'application/pdf') {
                try {
                    extractedData = await extractPdfData(file);
                } catch (e) {
                    console.error("PDF Parsing failed", e);
                    setValidationError("Failed to extract text from PDF. AI features will be limited for this file.");
                    // Fallback to defaults if parsing fails
                    extractedData = { text: '', pageCount: 1 };
                }
            }

            const newNoteData = {
                name: file.name,
                title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                date: new Date().toISOString().split('T')[0],
                status: 'Processed' as const,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                classId: uploadClassId,
                subject: subject,
                subjectCode: subjectCode,
                description: description,
                pages: extractedData.pageCount || 1,
                textContent: extractedData.text,
                session: session,
                uploadedBy: teacherName
            };

            await addNote(newNoteData, file);

            // Reset form
            setFile(null);
            setDescription('');
            setSubject('');
            setSubjectCode('');
            setIsUploadModalOpen(false);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentClassNotes = notes.filter((n: Note) => n.classId === activeClassId);

    return (
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Class Materials Manager</h2>
                    <p className="text-muted-foreground">Upload and manage documents for your students.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Upload className="w-5 h-5" />
                    Upload Material
                </button>
            </div>

            {/* Main Materials Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-lg">Your Uploads</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filter by Class:</span>
                        <select
                            value={activeClassId}
                            onChange={(e) => setActiveClassId(e.target.value)}
                            className="bg-accent/50 border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {classes.map((c: Class) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-accent/30 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold">Document Name</th>
                            <th className="px-6 py-4 text-sm font-semibold">Subject</th>
                            <th className="px-6 py-4 text-sm font-semibold">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold">Size</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {currentClassNotes.map((upload: Note) => (
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
                                            <div>
                                                <span className="text-sm font-medium block">{upload.name}</span>
                                                <span className="text-xs text-muted-foreground">{upload.description?.substring(0, 30)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{upload.subject}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{upload.date}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{upload.size}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setDeleteConfirmationId(upload.id)}
                                            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                            title="Delete Material"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {currentClassNotes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm italic">
                                    No materials uploaded for this class yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                                <h3 className="text-xl font-bold">Upload New Material</h3>
                                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5 overflow-y-auto">
                                {/* File Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Document File</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all",
                                            file ? "border-primary/50 bg-primary/5" : ""
                                        )}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf"
                                        />
                                        {file ? (
                                            <>
                                                <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
                                                <span className="font-semibold text-sm">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                <span className="font-medium text-sm">Click to browse</span>
                                                <span className="text-xs text-muted-foreground">PDF only, max 10MB</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Class & Subject Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Class</label>
                                        <select
                                            value={uploadClassId}
                                            onChange={(e) => setUploadClassId(e.target.value)}
                                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            {classes.map((c: Class) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Subject</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Mathematics"
                                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-bold">Subject Code</label>
                                    <input
                                        type="text"
                                        value={subjectCode}
                                        onChange={handleSubjectCodeChange}
                                        placeholder="e.g. CS101"
                                        className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        required
                                    />
                                    {suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-xl shadow-lg mt-1 z-50 max-h-40 overflow-y-auto">
                                            {suggestions.map(code => (
                                                <div
                                                    key={code}
                                                    onClick={() => selectSuggestion(code)}
                                                    className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                                                >
                                                    {code}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Session & Teacher Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Session</label>
                                        <input
                                            type="text"
                                            value={session}
                                            onChange={(e) => setSession(e.target.value)}
                                            placeholder="e.g. 2024-2025"
                                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Teacher</label>
                                        <input
                                            type="text"
                                            value={teacherName}
                                            disabled
                                            className="w-full bg-accent/10 border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Briefly describe the contents of this document..."
                                        rows={3}
                                        className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !file}
                                        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Upload Material
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmationId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-md rounded-3xl border border-destructive/20 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 text-center space-y-4">
                                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold">Delete Material?</h3>
                                <p className="text-muted-foreground text-sm">
                                    This action cannot be undone. This document will be permanently removed for all students.
                                </p>
                            </div>
                            <div className="p-6 bg-accent/30 flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmationId(null)}
                                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl font-bold hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (deleteConfirmationId) {
                                            deleteNote(deleteConfirmationId);
                                            setDeleteConfirmationId(null);
                                        }
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Validation Error Modal */}
            <AnimatePresence>
                {validationError && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-sm rounded-3xl border border-destructive/20 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                    <AlertTriangle className="w-10 h-10 text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-red-500">Attention Needed</h3>
                                    <p className="text-foreground text-base leading-relaxed px-2">
                                        {validationError}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 bg-accent/30">
                                <button
                                    onClick={() => setValidationError(null)}
                                    className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
