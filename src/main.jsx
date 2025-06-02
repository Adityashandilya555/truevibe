import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Create root and render the app
const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * Register service worker for PWA capabilities
 * Simplified version to avoid performance violations and errors
 * This enables offline functionality, caching, and installable app features
 */
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Handle when the service worker has new content available
    console.log('New content available for TrueVibe PWA')
    // Auto-update without user prompt for better UX
    updateSW(true)
  },
  onOfflineReady() {
    console.log('TrueVibe is ready to work offline! 🦊')
    // Optional: Show user notification that app works offline
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TrueVibe is now available offline!', {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
      })
    }
  },
  onRegistered(registration) {
    console.log('Service Worker registered successfully for TrueVibe:', registration?.scope)
    
    // Check for updates periodically (every 60 seconds)
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60000)
    }
  },
  onRegisterError(error) {
    console.warn('Service Worker registration failed, but app will still work:', error.message)
    // Don't throw error - let app continue working without SW
  }
})

/**
 * Enhanced error handling for unhandled Promise rejections
 * Prevents app crashes from async operations
 */
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection in TrueVibe:', event.reason)
  // Prevent the default browser error handling
  event.preventDefault()
})

/**
 * Global error handler for JavaScript errors
 * Provides graceful degradation for production
 */
window.addEventListener('error', (event) => {
  console.error('JavaScript error in TrueVibe:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
  
  // In production, you might want to send this to an error tracking service
  if (import.meta.env.PROD) {
    // Example: Send to error tracking service
    // sendErrorToService(event)
  }
})

/**
 * Performance monitoring for TrueVibe PWA
 * Tracks Core Web Vitals without causing violations
 */
if ('PerformanceObserver' in window) {
  try {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('TrueVibe LCP:', Math.round(entry.startTime))
        }
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    
    // Monitor Cumulative Layout Shift (CLS) - throttled
    let lastCLSLog = 0;
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      // Only log CLS every 10 seconds and only significant shifts
      const now = Date.now();
      if (clsValue > 0.25 && now - lastCLSLog > 10000) {
        console.log('TrueVibe CLS:', Math.round(clsValue * 1000) / 1000)
        lastCLSLog = now;
      }
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    
  } catch (error) {
    console.log('Performance monitoring not available:', error.message)
  }
}

// Log TrueVibe startup completion
console.log('🦊 TrueVibe PWA initialized successfully!')
