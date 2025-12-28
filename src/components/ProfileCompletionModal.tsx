import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileCompletionModalProps {
    isOpen: boolean;
}

export function ProfileCompletionModal({ isOpen }: ProfileCompletionModalProps) {
    const { updateProfileName, currentUser } = useAuth();
    const [name, setName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsUpdating(true);
        try {
            await updateProfileName(name.trim());
            setIsSuccess(true);
        } catch (error) {
            console.error('Failed to update name:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-card w-full max-w-md rounded-[2.5rem] border border-primary/20 shadow-2xl overflow-hidden relative"
                    >
                        {/* Premium Gradient Background Effect */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent pointer-events-none" />

                        <div className="p-8 relative z-10 space-y-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-3xl bg-primary/10 text-primary relative">
                                    <User className="w-10 h-10" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute -top-1 -right-1 text-amber-400"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black tracking-tight text-foreground">
                                        Unlock Your Journey
                                    </h2>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                        Complete Profile section now to unlock all features.
                                        Let's start by adding your name!
                                    </p>
                                </div>
                            </div>

                            {!isSuccess ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            Display Name
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                                className="w-full bg-accent/30 border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all group-hover:bg-accent/50"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdating || !name.trim()}
                                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Unlocking...
                                            </>
                                        ) : (
                                            "Unlock Everything"
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center py-4 space-y-4 text-emerald-500"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                    <p className="font-bold">Welcome aboard, {name}!</p>
                                </motion.div>
                            )}

                            <div className="pt-2 text-center">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                                    Logged in as {currentUser?.email}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
