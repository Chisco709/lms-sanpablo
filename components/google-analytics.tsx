'use client'

import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

interface GoogleAnalyticsProps {
  trackingId?: string;
}

export default function GoogleAnalytics({ trackingId = GA_TRACKING_ID }: GoogleAnalyticsProps) {
  if (!trackingId) {
    return null;
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
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Función para tracking de eventos
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Función para tracking de páginas
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Eventos específicos para el LMS
export const trackLMSEvent = {
  // Eventos de cursos
  courseView: (courseId: string, courseName: string) => {
    trackEvent('view_course', 'courses', `${courseName} (${courseId})`);
  },
  
  courseEnroll: (courseId: string, courseName: string) => {
    trackEvent('enroll_course', 'courses', `${courseName} (${courseId})`);
  },
  
  courseComplete: (courseId: string, courseName: string) => {
    trackEvent('complete_course', 'courses', `${courseName} (${courseId})`);
  },

  // Eventos de capítulos
  chapterStart: (chapterId: string, chapterName: string, courseId: string) => {
    trackEvent('start_chapter', 'learning', `${chapterName} - ${courseId}`);
  },
  
  chapterComplete: (chapterId: string, chapterName: string, courseId: string) => {
    trackEvent('complete_chapter', 'learning', `${chapterName} - ${courseId}`);
  },

  // Eventos de video
  videoPlay: (videoId: string, courseId: string) => {
    trackEvent('play_video', 'engagement', `Video ${videoId} - Course ${courseId}`);
  },
  
  videoComplete: (videoId: string, courseId: string, watchTime: number) => {
    trackEvent('complete_video', 'engagement', `Video ${videoId} - Course ${courseId}`, watchTime);
  },

  // Eventos de teacher
  teacherCourseCreate: (courseId: string, courseName: string) => {
    trackEvent('create_course', 'teacher', `${courseName} (${courseId})`);
  },
  
  teacherCoursePublish: (courseId: string, courseName: string) => {
    trackEvent('publish_course', 'teacher', `${courseName} (${courseId})`);
  },

  // Eventos de búsqueda
  searchCourse: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', 'discovery', searchTerm, resultsCount);
  },

  // Eventos de programa técnico
  programEnroll: (programId: string, programName: string) => {
    trackEvent('enroll_program', 'programs', `${programName} (${programId})`);
  },

  // Eventos de certificación
  certificateDownload: (courseId: string, courseName: string) => {
    trackEvent('download_certificate', 'achievement', `${courseName} (${courseId})`);
  }
};

// Declaración de tipos para window.gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
} 