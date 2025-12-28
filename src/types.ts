export interface Class {
    id: string;
    name: string;
    color: string;
}

export interface Note {
    id: string; // Changed to string for Firestore compatibility
    name: string;
    title: string;
    classId: string;
    subject: string;
    subjectCode?: string;
    description: string;
    pages: number;
    date: string;
    status: 'Processed' | 'Uploading' | 'Error';
    size: string;
    url?: string; // Cloud storage URL
    path?: string; // Cloud storage path
    textContent?: string; // Extracted text content
    uploadedBy?: string;
    session?: string;
}
