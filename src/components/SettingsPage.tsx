import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsPage() {
    const { currentUser, userName, updateProfileName, changeUserPassword, deleteUserAccount } = useAuth();

    // Profile State
    const [name, setName] = useState(userName || '');
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeletePass, setShowDeletePass] = useState(false);

    // Feedback States
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 5000);
    };

    const handleUpdateName = async () => {
        setIsUpdatingName(true);
        try {
            await updateProfileName(name);
            showFeedback('success', 'Name updated successfully');
        } catch (error: any) {
            showFeedback('error', error.message || 'Failed to update name');
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPass(true);
        try {
            await changeUserPassword(oldPassword, newPassword);
            showFeedback('success', 'Password changed successfully');
            setOldPassword('');
            setNewPassword('');
        } catch (error: any) {
            showFeedback('error', error.message === 'auth/wrong-password' ? 'Incorrect existing password' : (error.message || 'Failed to change password'));
        } finally {
            setIsChangingPass(false);
        }
    };

    const handleDeleteAccount = async () => {
        const expected = `delete ${currentUser?.email}`;
        if (deleteConfirmation !== expected) return;

        setIsDeleting(true);
        try {
            await deleteUserAccount(deletePassword);
            // Redirection handled by AuthContext/App level
        } catch (error: any) {
            showFeedback('error', error.message || 'Failed to delete account');
            setIsDeleting(false);
        }
    };

    const deleteConfirmText = `delete ${currentUser?.email}`;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
            {/* Feedback Toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "fixed top-8 right-8 z-[100] p-4 rounded-2xl border shadow-xl flex items-center gap-3 min-w-[300px]",
                            feedback.type === 'success' ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-destructive/10 border-destructive text-destructive"
                        )}
                    >
                        {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <p className="font-medium text-sm">{feedback.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <header>
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your profile and security preferences.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <section className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Profile Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Full Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="flex-1 bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    onClick={handleUpdateName}
                                    disabled={isUpdatingName || name === userName}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:opacity-90 flex items-center gap-2"
                                >
                                    {isUpdatingName ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={currentUser?.email || ''}
                                    disabled
                                    className="w-full bg-accent/10 border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Password Section */}
                <section className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <Lock className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Security</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showOldPass ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPass(!showOldPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPass ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isChangingPass || !oldPassword || !newPassword}
                            className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
                        </button>
                    </form>
                </section>

                {/* Danger Zone */}
                <section className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-destructive/20">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        <h2 className="text-xl font-bold text-destructive">Danger Zone</h2>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="font-bold">Delete Account</h3>
                            <p className="text-sm text-muted-foreground mt-1">Permanently remove your account and all associated data.</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-destructive text-destructive-foreground font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-all text-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>

            {/* Account Deletion Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-3xl border-2 border-destructive shadow-2xl p-8 space-y-6"
                        >
                            <div className="flex items-center gap-3 text-destructive">
                                <AlertTriangle className="w-8 h-8" />
                                <h3 className="text-2xl font-black uppercase tracking-tight">Extremely Critical Action</h3>
                            </div>

                            <p className="text-muted-foreground font-medium leading-relaxed">
                                You are about to permanently delete your account. This action <span className="text-destructive font-bold underline">cannot be undone</span>.
                                All your notes, settings, and profile data will be purged forever.
                            </p>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Confirm your Password</label>
                                    <div className="relative">
                                        <input
                                            type={showDeletePass ? "text" : "password"}
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-destructive/50 outline-none"
                                        />
                                        <button
                                            onClick={() => setShowDeletePass(!showDeletePass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showDeletePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold">
                                        Type <span className="text-destructive bg-destructive/10 px-1.5 py-0.5 rounded ml-1">"{deleteConfirmText}"</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        placeholder={deleteConfirmText}
                                        className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-destructive/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 bg-accent hover:bg-accent/80 font-bold py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={deleteConfirmation !== deleteConfirmText || !deletePassword || isDeleting}
                                    onClick={handleDeleteAccount}
                                    className="flex-1 bg-destructive text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-destructive/20"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
