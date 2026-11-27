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

// El splash inline cubre el primer frame (incluso antes de que React arranque)
// y se funde cuando la app ya tiene contenido propio, sin bloquear el arranque.
const splash = document.getElementById('app-splash')
if (splash) {
  window.setTimeout(() => {
    splash.style.transition = 'opacity 260ms ease'
    splash.style.opacity = '0'
    window.setTimeout(() => splash.remove(), 280)
  }, 420)
}

// En la APK todo ya está dentro del paquete: registrar el service worker solo
// añadiría copias de cada asset a CacheStorage. En PWA sí lo necesitamos.
const cap = window.Capacitor
const isNative = Boolean(cap && (cap.isNativePlatform?.() || cap.platform === 'android'))
if ('serviceWorker' in navigator && !isNative) {
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => { /* noop */ })
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(register, { timeout: 3000 })
    else window.setTimeout(register, 1500)
  })
}
