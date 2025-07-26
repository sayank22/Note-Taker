import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <h1 class="text-3xl font-bold underline text-amber-600">
    Hello world!
  </h1>

  </StrictMode>,
)
