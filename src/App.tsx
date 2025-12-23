import { useState } from 'react'
import { MainLayout } from './components/MainLayout'
import { TeacherView } from './components/TeacherView'
import { StudentView } from './components/StudentView'
import { StudyReader } from './components/StudyReader'
import { AnimatePresence } from 'framer-motion'
import { cn } from './lib/utils'
import { useClassroom } from './context/ClassroomContext'

function App() {
  const [activeTab, setActiveTab] = useState('teacher')
  const [innerTab, setInnerTab] = useState('stream') // stream, classwork, people
  const [selectedNote, setSelectedNote] = useState<any>(null)

  const {
    activeClassId,
    setActiveClassId,
    classes
  } = useClassroom();

  const activeClass = classes.find(c => c.id === activeClassId);

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mb-8 overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
        {/* Class Header Banner */}
        <div className={cn(
          "h-32 px-8 py-6 flex flex-col justify-end gap-1 relative overflow-hidden",
          activeClass?.color === 'blue' ? "bg-blue-600" : activeClass?.color === 'purple' ? "bg-purple-600" : "bg-orange-600"
        )}>
          {/* Abstract decorative circles */}
          <div className="absolute top-[-20%] right-[-5%] w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-10%] right-[10%] w-32 h-32 bg-white/5 rounded-full" />

          <h1 className="text-3xl font-bold text-white z-10">{activeClass?.name}</h1>
          <p className="text-white/80 font-medium z-10">Section 1A • Semester 1</p>
        </div>

        {/* Inner Classroom Nav */}
        <div className="px-8 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-8">
            {['stream', 'classwork', 'people'].map((tab) => (
              <button
                key={tab}
                onClick={() => setInnerTab(tab)}
                className={cn(
                  "py-4 px-2 text-sm font-semibold capitalize transition-all relative",
                  innerTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 py-2">
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

      <AnimatePresence mode="wait">
        {activeTab === 'teacher' && (
          <TeacherView
            key={`${activeClassId}-${innerTab}-teacher`}
            innerTab={innerTab}
          />
        )}
        {activeTab === 'student' && (
          <StudentView
            key={`${activeClassId}-${innerTab}-student`}
            onOpenNote={(note) => setSelectedNote(note)}
            innerTab={innerTab}
          />
        )}
        {activeTab === 'settings' && (
          <div key="settings" className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
              <span className="text-4xl">⚙️</span>
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">User preferences and account configuration.</p>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNote && (
          <StudyReader note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      </AnimatePresence>
    </MainLayout>
  )
}

export default App
