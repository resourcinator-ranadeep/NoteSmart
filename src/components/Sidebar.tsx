import { BookOpen, Settings, GraduationCap, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    // No longer needs props heavily, maybe just none or className
}

export function Sidebar({ }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole, signOut } = useAuth();

    // Determine active tab based on path
    const activeTab = location.pathname.includes('/student') ? 'student'
        : location.pathname.includes('/settings') ? 'settings'
            : 'teacher'; // Default to teacher if at /teacher or root

    const navItems = [
        ...(userRole === 'teacher' ? [{ id: 'teacher', label: 'Teacher Dashboard', icon: GraduationCap, path: '/teacher' }] : []),
        { id: 'student', label: 'Student Library', icon: BookOpen, path: '/student' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? '80px' : '260px' }}
            className="relative z-50 flex flex-col h-screen border-r border-border bg-[#020617] transition-all duration-300"
        >
            <div className="p-6 flex items-center gap-3">
                <img
                    src="/notesmart_logo.png"
                    alt="NoteSmart Logo"
                    className="w-16 h-16 object-contain shrink-0"
                />
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-xl tracking-tight"
                    >
                        NoteSmart
                    </motion.span>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
                <button
                    onClick={handleSignOut}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-destructive hover:bg-destructive/10",
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-medium"
                        >
                            Sign Out
                        </motion.span>
                    )}
                </button>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-accent text-muted-foreground"
                >
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>
        </motion.div>
    );
}
