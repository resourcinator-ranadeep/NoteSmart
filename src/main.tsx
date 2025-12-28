import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ClassroomProvider } from './context/ClassroomContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClassroomProvider>
        <App />
      </ClassroomProvider>
    </BrowserRouter>
  </StrictMode>,
)
