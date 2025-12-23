export interface Class {
    id: string;
    name: string;
    color: string;
}

export interface Note {
    id: number;
    name: string;
    title: string;
    classId: string;
    subject: string;
    description: string;
    pages: number;
    date: string;
    status: 'Processed' | 'Uploading' | 'Error';
    size: string;
}

export interface Announcement {
    id: number;
    classId: string;
    author: string;
    date: string;
    content: string;
    comments: number;
}

export interface ClassMembers {
    classId: string;
    teachers: string[];
    students: string[];
}
