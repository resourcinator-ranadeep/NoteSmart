import type { Class, Note, Announcement, ClassMembers } from '../types';

export const CLASSES: Class[] = [
    { id: 'math-101', name: 'Mathematics 101', color: 'blue' },
    { id: 'physics-202', name: 'Advanced Physics', color: 'purple' },
    { id: 'history-101', name: 'World History', color: 'orange' },
];

export const INITIAL_NOTES: Note[] = [
    { id: 1, name: 'Calculus_Limits.pdf', title: 'Calculus Limits', classId: 'math-101', subject: 'Mathematics', description: 'Introduction to limit notation and basic rules.', pages: 8, date: '2023-12-15', status: 'Processed', size: '1.2 MB' },
    { id: 2, name: 'Newton_Laws.pdf', title: 'Newton\'s Laws', classId: 'physics-202', subject: 'Physics', description: 'Foundational principles of classical mechanics.', pages: 12, date: '2023-12-18', status: 'Processed', size: '2.4 MB' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, classId: 'math-101', author: 'Prof. Aris Totle', date: '2023-12-22', content: 'Welcome to Math 101! Please check the resources tab for the first set of notes.', comments: 2 },
    { id: 2, classId: 'physics-202', author: 'Dr. G. Newton', date: '2023-12-21', content: 'The lecture for Monday has been moved to Room 402.', comments: 0 },
];

export const MOCK_MEMBERS: ClassMembers[] = [
    { classId: 'math-101', teachers: ['Prof. Aris Totle'], students: ['Alice Smith', 'Bob Jones', 'Charlie Brown'] },
    { classId: 'physics-202', teachers: ['Dr. G. Newton'], students: ['Charlie Brown', 'David Lee'] },
    { classId: 'history-101', teachers: ['Ms. H. Story'], students: ['Alice Smith', 'David Lee'] },
];
