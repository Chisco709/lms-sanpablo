'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

// Variables de entorno para Google Analytics
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

interface GoogleAnalyticsProps {
  trackingId?: string
}

export default function GoogleAnalytics({ trackingId = GA_TRACKING_ID }: GoogleAnalyticsProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!trackingId || !isClient) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingId}', {
                page_title: typeof document !== 'undefined' ? document.title : '',
                page_location: typeof window !== 'undefined' ? window.location.href : '',
              });
            }
          `,
        }}
      />
    </>
  )
}

// Función para tracking de eventos con verificación de entorno
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Función para tracking de páginas con verificación de entorno
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
      page_location: url,
    });
  }
};

// Funciones avanzadas para eventos del LMS
export const trackLMSEvent = {
  // Eventos de cursos
  courseView: (courseId: string, courseName: string) => {
    trackEvent('view_course', 'course', `${courseId}:${courseName}`)
  },
  
  courseEnroll: (courseId: string, courseName: string) => {
    trackEvent('enroll_course', 'course', `${courseId}:${courseName}`)
  },
  
  chapterStart: (chapterId: string, chapterName: string, courseId: string) => {
    trackEvent('start_chapter', 'learning', `${courseId}:${chapterId}:${chapterName}`)
  },
  
  chapterComplete: (chapterId: string, chapterName: string, courseId: string) => {
    trackEvent('complete_chapter', 'learning', `${courseId}:${chapterId}:${chapterName}`)
  },
  
  videoPlay: (videoId: string, courseId: string) => {
    trackEvent('play_video', 'engagement', `${courseId}:${videoId}`)
  },
  
  videoComplete: (videoId: string, courseId: string, duration: number) => {
    trackEvent('complete_video', 'engagement', `${courseId}:${videoId}`, duration)
  },
  
  // Eventos de búsqueda
  search: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', 'discovery', searchTerm, resultsCount)
  },
  
  // Eventos de profesor
  courseCreate: (courseId: string, courseName: string) => {
    trackEvent('create_course', 'teacher', `${courseId}:${courseName}`)
  },
  
  chapterCreate: (chapterId: string, courseId: string) => {
    trackEvent('create_chapter', 'teacher', `${courseId}:${chapterId}`)
  },
  
  // Eventos de certificados
  certificateDownload: (courseId: string, studentId: string) => {
    trackEvent('download_certificate', 'achievement', `${courseId}:${studentId}`)
  },
}

// Función para tracking de interacciones específicas del curso
export const trackCourseInteraction = (
  action: 'click_resource' | 'download_pdf' | 'submit_form' | 'view_attachment',
  courseId: string,
  resourceType?: string
) => {
  if (typeof window !== 'undefined') {
    trackEvent(action, 'course_interaction', `${courseId}:${resourceType || 'unknown'}`)
  }
}

// Hook personalizado para tracking de tiempo
export const useTimeTracking = (pageTitle: string) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const startTime = Date.now()
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      trackEvent('time_on_page', 'engagement', pageTitle, timeSpent)
    }
  }, [pageTitle])
}

// Declaración de tipos para window.gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
} 