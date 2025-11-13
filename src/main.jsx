import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DramaProvider } from './context/dramaContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <DramaProvider>
      <App />
    </DramaProvider>
  //</StrictMode>,
)
