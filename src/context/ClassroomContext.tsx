import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Class, Note } from '../types';
import { CLASSES } from '../data/mockData';
import { db, storage } from '../lib/firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';

interface ClassroomContextType {
    // State
    activeClassId: string;
    setActiveClassId: (id: string) => void;
    notes: Note[];
    classes: Class[];

    // Actions
    addNote: (noteData: Omit<Note, 'id'>, file: File) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

export function ClassroomProvider({ children }: { children: ReactNode }) {
    const [activeClassId, setActiveClassId] = useState(CLASSES[0].id);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'notes'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Note));
            setNotes(fetchedNotes);
        });

        return () => unsubscribe();
    }, []);

    const addNote = async (newNoteData: Omit<Note, 'id'>, file: File) => {
        try {
            // 1. Upload file to Storage
            const storagePath = `notes/${newNoteData.classId}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const uploadResult = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(uploadResult.ref);

            // 2. Save metadata to Firestore
            const noteDataWithUrl = {
                ...newNoteData,
                url: downloadUrl,
                path: storagePath,
                status: 'Processed' as const
            };

            const docRef = await addDoc(collection(db, 'notes'), noteDataWithUrl);

            // 3. Update local state (Optimistic or wait for snapshot)
            const newNote = {
                ...noteDataWithUrl,
                id: docRef.id,
            } as Note;

            setNotes(prev => [newNote, ...prev]);
        } catch (error) {
            console.error("Error uploading note:", error);
            throw error;
        }
    };

    const deleteNote = async (id: string) => {
        try {
            const noteToDelete = notes.find(n => n.id === id);

            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'notes', id));

            // 2. Delete from Storage if path exists
            if (noteToDelete?.path) {
                const storageRef = ref(storage, noteToDelete.path);
                await deleteObject(storageRef).catch(err => console.warn("Storage deletion failed or file not found", err));
            }

            // 3. Update local state
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
            throw error;
        }
    };

    const value = {
        activeClassId,
        setActiveClassId,
        notes,
        classes: CLASSES,
        addNote,
        deleteNote
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
