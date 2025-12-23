import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Class, Note, Announcement, ClassMembers } from '../types';
import { CLASSES, INITIAL_NOTES, MOCK_ANNOUNCEMENTS, MOCK_MEMBERS } from '../data/mockData';

interface ClassroomContextType {
    // State
    activeClassId: string;
    setActiveClassId: (id: string) => void;
    notes: Note[];
    announcements: Announcement[];
    members: ClassMembers | undefined;
    classes: Class[];

    // Actions (These will be replaced with API calls later)
    addNote: (note: Omit<Note, 'id'>) => Promise<void>;
    deleteNote: (id: number) => Promise<void>;
    addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
    deleteAnnouncement: (id: number) => Promise<void>;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

export function ClassroomProvider({ children }: { children: ReactNode }) {
    const [activeClassId, setActiveClassId] = useState(CLASSES[0].id);
    const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
    const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

    const activeClassMembers = MOCK_MEMBERS.find(m => m.classId === activeClassId);

    // Note Smart Service Methods
    // ---------------------------------------------------------
    // 💡 FIREBASE INTEGRATION GUIDE:
    // To use Firebase, uncomment the stubs below and remove the mock logic.
    // Make sure you've installed 'firebase' and configured 'src/lib/firebase.ts'.

    const addNote = async (newNoteData: Omit<Note, 'id'>) => {
        /* 
        // FIREBASE STUB:
        const docRef = await addDoc(collection(db, "notes"), newNoteData);
        setNotes(prev => [{ ...newNoteData, id: docRef.id }, ...prev]);
        */

        // CURRENT MOCK LOGIC:
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newNote = {
            ...newNoteData,
            id: Math.max(0, ...notes.map(n => n.id)) + 1,
        } as Note;

        setNotes(prev => [newNote, ...prev]);
    };

    const deleteNote = async (id: number) => {
        /*
        // FIREBASE STUB:
        await deleteDoc(doc(db, "notes", id.toString()));
        */

        // CURRENT MOCK LOGIC:
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const addAnnouncement = async (newAnnData: Omit<Announcement, 'id'>) => {
        /*
        // FIREBASE STUB:
        await addDoc(collection(db, "announcements"), newAnnData);
        */

        // CURRENT MOCK LOGIC:
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));

        const newAnn = {
            ...newAnnData,
            id: Math.max(0, ...announcements.map(a => a.id)) + 1,
        } as Announcement;

        setAnnouncements(prev => [newAnn, ...prev]);
    };

    const deleteAnnouncement = async (id: number) => {
        /*
        // FIREBASE STUB:
        await deleteDoc(doc(db, "announcements", id.toString()));
        */
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    const value = {
        activeClassId,
        setActiveClassId,
        notes,
        announcements,
        members: activeClassMembers,
        classes: CLASSES,
        addNote,
        deleteNote,
        addAnnouncement,
        deleteAnnouncement
    };

    return (
        <ClassroomContext.Provider value={value}>
            {children}
        </ClassroomContext.Provider>
    );
}

export function useClassroom() {
    const context = useContext(ClassroomContext);
    if (context === undefined) {
        throw new Error('useClassroom must be used within a ClassroomProvider');
    }
    return context;
}
