import { useState } from 'react'
import { MainLayout } from './components/MainLayout'
import { TeacherView } from './components/TeacherView'
import { StudentView } from './components/StudentView'
import { StudyReader } from './components/StudyReader'
import { AnimatePresence } from 'framer-motion'
import { cn } from './lib/utils'
import { useClassroom } from './context/ClassroomContext'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SettingsPage } from './components/SettingsPage'

interface DashboardHeaderProps {
  // No props needed for simple header
}

function DashboardHeader({ }: DashboardHeaderProps) {
  const {
    activeClassId,
    setActiveClassId,
    classes
  } = useClassroom();

  const activeClass = classes.find(c => c.id === activeClassId);

  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
      {/* Class Header Banner */}
      <div className={cn(
        "h-32 px-8 py-6 flex flex-col justify-end gap-1 relative overflow-hidden",
        activeClass?.color === 'blue' ? "bg-blue-600" :
          activeClass?.color === 'purple' ? "bg-purple-600" :
            activeClass?.color === 'red' ? "bg-red-600" :
              activeClass?.color === 'green' ? "bg-green-600" :
                activeClass?.color === 'indigo' ? "bg-indigo-600" :
                  activeClass?.color === 'orange' ? "bg-orange-600" :
                    activeClass?.color === 'pink' ? "bg-pink-600" :
                      activeClass?.color === 'cyan' ? "bg-cyan-600" :
                        activeClass?.color === 'amber' ? "bg-amber-600" :
                          activeClass?.color === 'emerald' ? "bg-emerald-600" :
                            activeClass?.color === 'rose' ? "bg-rose-600" :
                              "bg-slate-600"
      )}>
        {/* Abstract decorative circles */}
        <div className="absolute top-[-20%] right-[-5%] w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-32 h-32 bg-white/5 rounded-full" />

        <h1 className="text-3xl font-bold text-white z-10">{activeClass?.name}</h1>
      </div>

      {/* Inner Classroom Nav */}
      <div className="px-8 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Tabs removed */}
        </div>
        <div className="flex items-center gap-4 py-2">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Quick Select:</span>
          <select
            value={activeClassId}
            onChange={(e) => setActiveClassId(e.target.value)}
            className="bg-accent/50 border border-border rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react'

import { ProfileCompletionModal } from './components/ProfileCompletionModal'

function RoleRedirect() {
  const { userRole, currentUser, userName } = useAuth();

  if (currentUser && !userRole) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // If user has no name yet, redirect to settings by default
  if (currentUser && !userName) {
    return <Navigate to="/settings" replace />;
  }

  if (userRole === 'student') return <Navigate to="/student" replace />;
  return <Navigate to="/teacher" replace />;
}

function AuthenticatedApp() {
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const { userName } = useAuth();
  const location = useLocation();

  // Only show banner on teacher routes
  const showBanner = location.pathname.startsWith('/teacher');

  // Check if we need to show the profile completion modal
  // Triggered when trying to access student or teacher views without a name
  const isFeatureRoute = location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher');
  const showProfileModal = isFeatureRoute && !userName;

  return (
    <MainLayout>
      {showBanner && <DashboardHeader />}

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<RoleRedirect />} />

          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher']}>
                <StudentView
                  onOpenNote={(note) => setSelectedNote(note)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      <ProfileCompletionModal isOpen={showProfileModal} />

      <AnimatePresence>
        {selectedNote && (
          <StudyReader note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      </AnimatePresence>
    </MainLayout>
  )
}

import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  return (
    <AuthProvider>
      <OfflineIndicator />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
