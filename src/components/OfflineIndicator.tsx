import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Function to manually check connection (sometimes events fire before actual connectivity)
    const checkConnection = async () => {
        try {
            await fetch('//google.com', {
                mode: 'no-cors',
            });
            setIsOnline(true);
        } catch (error) {
            setIsOnline(false);
        }
    };

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card w-full max-w-md p-8 rounded-3xl border border-destructive/30 shadow-2xl flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <WifiOff className="w-10 h-10 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">No Internet Connection</h2>
                            <p className="text-muted-foreground">
                                You are currently offline. Please check your internet connection to continue using NoteSmart.
                            </p>
                        </div>

                        <button
                            onClick={checkConnection}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Connection
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
