// Función simplificada para reportar web vitals sin dependencias externas
export function reportWebVitals() {
  if (typeof window === 'undefined') return
  
  // Solo registrar métricas básicas
  if ('PerformanceObserver' in window) {
    try {
      // Observar LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Observar CLS (Cumulative Layout Shift)
      new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })

    } catch (error) {
      console.log('Web Vitals monitoring not available')
    }
  }
}

// Función para optimizar imágenes lazy loading
export function optimizeImageLoading() {
  if (typeof window !== 'undefined') {
    // Preload de imágenes críticas
    const preloadImages = ['/logo-sanpablo.jpg']
    
    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }
}

// Función para optimizar CLS (Cumulative Layout Shift)
export function preventLayoutShift() {
  if (typeof window !== 'undefined') {
    // Reservar espacio para elementos que cargan async
    const style = document.createElement('style')
    style.textContent = `
      .course-card-skeleton {
        aspect-ratio: 16/9;
        background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `
    document.head.appendChild(style)
  }
}