import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Solo el subset latin: cubre á/é/í/ó/ú/ñ y evita ~450 KB de devanagari y latin-ext.
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-800.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWA / APK-ready: registrar service worker (offline + assets)
if ('serviceWorker' in navigator) {
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => { /* noop */ })
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(register, { timeout: 3000 })
    else window.setTimeout(register, 1500)
  })
}
