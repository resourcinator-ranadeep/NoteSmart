import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type UserRole = 'teacher' | 'student';

interface AuthContextType {
    currentUser: User | null;
    userRole: UserRole | null;
    userName: string | null;
    loading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfileName: (newName: string) => Promise<void>;
    changeUserPassword: (currentPass: string, newPass: string) => Promise<void>;
    deleteUserAccount: (currentPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user role from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserRole(data.role as UserRole);
                    setUserName(data.name || null);
                } else {
                    setUserRole(null);
                    setUserName(null);
                }
            } else {
                setUserRole(null);
                setUserName(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signUp = async (email: string, pass: string, role: UserRole) => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, 'users', result.user.uid), {
            email,
            role,
            createdAt: new Date().toISOString()
        });
        setUserRole(role);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserRole(null);
        setUserName(null);
    };

    const updateProfileName = async (newName: string) => {
        if (!currentUser) return;
        await updateDoc(doc(db, 'users', currentUser.uid), {
            name: newName
        });
        setUserName(newName);
    };

    const reauthenticate = async (currentPass: string) => {
        if (!currentUser || !currentUser.email) return;
        const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
        await reauthenticateWithCredential(currentUser, credential);
    };

    const changeUserPassword = async (currentPass: string, newPass: string) => {
        if (!currentUser) return;
        await reauthenticate(currentPass);
        await updatePassword(currentUser, newPass);
    };

    const deleteUserAccount = async (currentPass: string) => {
        if (!currentUser) return;
        await reauthenticate(currentPass);
        const uid = currentUser.uid;
        await deleteDoc(doc(db, 'users', uid));
        await deleteUser(currentUser);
        setUserRole(null);
        setUserName(null);
    };

    const value = {
        currentUser,
        userRole,
        userName,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfileName,
        changeUserPassword,
        deleteUserAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
