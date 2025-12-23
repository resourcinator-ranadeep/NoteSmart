import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClassroomProvider } from './context/ClassroomContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClassroomProvider>
      <App />
    </ClassroomProvider>
  </StrictMode>,
)
