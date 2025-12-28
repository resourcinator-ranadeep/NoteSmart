import type { Class, Note } from '../types';

/**
 * Available UI Colors:
 * - red, indigo, blue, green, purple, orange, pink, cyan, amber, emerald, rose
 */

export const CLASSES: Class[] = [
    { id: 'cse-1st', name: 'CSE 1st Semester', color: 'rose' },
    { id: 'cse-2nd', name: 'CSE 2nd Semester', color: 'rose' },
    { id: 'cse-3rd', name: 'CSE 3rd Semester', color: 'rose' },
    { id: 'cse-4th', name: 'CSE 4th Semester', color: 'rose' },
    { id: 'cse-5th', name: 'CSE 5th Semester', color: 'rose' },
    { id: 'cse-6th', name: 'CSE 6th Semester', color: 'rose' },
    { id: 'cse-7th', name: 'CSE 7th Semester', color: 'rose' },
    { id: 'cse-8th', name: 'CSE 8th Semester', color: 'rose' },
    { id: 'it-1st', name: 'IT 1st Semester', color: 'emerald' },
    { id: 'it-2nd', name: 'IT 2nd Semester', color: 'emerald' },
    { id: 'it-3rd', name: 'IT 3rd Semester', color: 'emerald' },
    { id: 'it-4th', name: 'IT 4th Semester', color: 'emerald' },
    { id: 'it-5th', name: 'IT 5th Semester', color: 'emerald' },
    { id: 'it-6th', name: 'IT 6th Semester', color: 'emerald' },
    { id: 'it-7th', name: 'IT 7th Semester', color: 'emerald' },
    { id: 'it-8th', name: 'IT 8th Semester', color: 'emerald' },
    { id: 'ece-1st', name: 'ECE 1st Semester', color: 'cyan' },
    { id: 'ece-2nd', name: 'ECE 2nd Semester', color: 'cyan' },
    { id: 'ece-3rd', name: 'ECE 3rd Semester', color: 'cyan' },
    { id: 'ece-4th', name: 'ECE 4th Semester', color: 'cyan' },
    { id: 'ece-5th', name: 'ECE 5th Semester', color: 'cyan' },
    { id: 'ece-6th', name: 'ECE 6th Semester', color: 'cyan' },
    { id: 'ece-7th', name: 'ECE 7th Semester', color: 'cyan' },
    { id: 'ece-8th', name: 'ECE 8th Semester', color: 'cyan' },
    { id: 'ee-1st', name: 'EE 1st Semester', color: 'amber' },
    { id: 'ee-2nd', name: 'EE 2nd Semester', color: 'amber' },
    { id: 'ee-3rd', name: 'EE 3rd Semester', color: 'amber' },
    { id: 'ee-4th', name: 'EE 4th Semester', color: 'amber' },
    { id: 'ee-5th', name: 'EE 5th Semester', color: 'amber' },
    { id: 'ee-6th', name: 'EE 6th Semester', color: 'amber' },
    { id: 'ee-7th', name: 'EE 7th Semester', color: 'amber' },
    { id: 'ee-8th', name: 'EE 8th Semester', color: 'amber' },
    { id: 'math-101', name: 'Mathematics 101', color: 'blue' },
    { id: 'physics-202', name: 'Advanced Physics', color: 'purple' },
];

// Mock Subject Codes for Autocomplete
export const SUBJECT_CODES = [
    "PC-CS301",
    "ES-EC301",
    "ES-EE301"
];

export const INITIAL_NOTES: Note[] = [];
