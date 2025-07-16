'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackEvent, trackLMSEvent } from '@/components/google-analytics'

// Hook para tracking automático de páginas
export function usePageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      trackPageView(window.location.href, document.title)
    }
  }, [pathname])
}

// Hook principal de Analytics
export function useAnalytics() {
  return {
    trackEvent,
    trackLMSEvent,
    trackPageView,
    
    // Funciones específicas del LMS
    trackCourseInteraction: (action: string, courseId: string, courseName: string) => {
      trackEvent(action, 'course_interaction', `${courseName} (${courseId})`)
    },
    
    trackStudentProgress: (courseId: string, courseName: string, progress: number) => {
      trackEvent('progress_update', 'learning', `${courseName} (${courseId})`, progress)
    },
    
    trackTeacherAction: (action: string, details: string) => {
      trackEvent(action, 'teacher_actions', details)
    },
    
    trackSearchQuery: (query: string, category?: string) => {
      trackEvent('search', 'discovery', `${category || 'general'}: ${query}`)
    },
    
    trackFormSubmission: (formType: string, formName: string) => {
      trackEvent('form_submit', 'forms', `${formType}: ${formName}`)
    },
    
    trackError: (errorType: string, errorMessage: string, page?: string) => {
      trackEvent('error', 'technical', `${errorType} - ${page || 'unknown'}: ${errorMessage}`)
    },
    
    trackUserRegistration: (method: string) => {
      trackEvent('sign_up', 'user_actions', method)
    },
    
    trackUserLogin: (method: string) => {
      trackEvent('login', 'user_actions', method)
    }
  }
}

// Hook para tracking de tiempo en página
export function useTimeTracking(pageName: string) {
  useEffect(() => {
    const startTime = Date.now()
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000) // en segundos
      trackEvent('time_on_page', 'engagement', pageName, timeSpent)
    }
  }, [pageName])
}

// Hook para tracking de scrolling
export function useScrollTracking(pageName: string) {
  useEffect(() => {
    let maxScroll = 0
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        // Track milestone scrolls
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll < 50) {
          trackEvent('scroll_25', 'engagement', pageName)
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll < 75) {
          trackEvent('scroll_50', 'engagement', pageName)
        } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScroll < 100) {
          trackEvent('scroll_75', 'engagement', pageName)
        } else if (scrollPercent >= 100) {
          trackEvent('scroll_100', 'engagement', pageName)
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pageName])
} 