'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackEvent, trackLMSEvent } from '@/components/google-analytics'

// Hook para tracking automático de páginas
export function usePageTracking() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (pathname && isClient && typeof window !== 'undefined') {
      trackPageView(window.location.href, document.title)
    }
  }, [pathname, isClient])
}

// Hook para tracking de tiempo en página
export function useTimeTracking(pageTitle: string) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return
    
    const startTime = Date.now()
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      trackEvent('time_on_page', 'engagement', pageTitle, timeSpent)
    }
  }, [pageTitle, isClient])
}

// Hook para tracking de scroll
export function useScrollTracking() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    let maxScroll = 0
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        // Debounce para evitar demasiados eventos
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          if (maxScroll >= 25 && maxScroll < 50) {
            trackEvent('scroll_25', 'engagement', 'page_scroll', 25)
          } else if (maxScroll >= 50 && maxScroll < 75) {
            trackEvent('scroll_50', 'engagement', 'page_scroll', 50)
          } else if (maxScroll >= 75 && maxScroll < 90) {
            trackEvent('scroll_75', 'engagement', 'page_scroll', 75)
          } else if (maxScroll >= 90) {
            trackEvent('scroll_90', 'engagement', 'page_scroll', 90)
          }
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isClient])
}

// Hook principal de analytics que combina todas las funcionalidades
export function useAnalytics() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return {
    trackLMSEvent: isClient ? trackLMSEvent : {
      courseView: () => {},
      courseEnroll: () => {},
      chapterStart: () => {},
      chapterComplete: () => {},
      videoPlay: () => {},
      videoComplete: () => {},
      search: () => {},
      courseCreate: () => {},
      chapterCreate: () => {},
      certificateDownload: () => {},
    },
    trackCourseInteraction: isClient ? 
      (action: string, courseId: string, resourceType?: string) => {
        if (typeof window !== 'undefined') {
          trackEvent(action, 'course_interaction', `${courseId}:${resourceType || 'unknown'}`)
        }
      } : 
      () => {},
    trackEvent: isClient ? trackEvent : () => {},
    isClient,
  }
} 