'use client'

import Head from 'next/head'
import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'course'
  courseData?: {
    instructor?: string
    duration?: string
    level?: string
    category?: string
    price?: string
    rating?: number
    reviewCount?: number
  }
  noIndex?: boolean
  children?: React.ReactNode
}

export default function SEOOptimizer({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  courseData,
  noIndex = false,
  children
}: SEOProps) {
  const baseUrl = 'https://lms-sanpablo.vercel.app'
  
  const seoTitle = title 
    ? `${title} | Instituto San Pablo`
    : "Instituto San Pablo | Plataforma LMS #1 en Pereira, Colombia"
    
  const seoDescription = description || 
    "🎓 Plataforma LMS líder en Pereira con 15+ años formando profesionales técnicos. Cursos certificados SENA en Primera Infancia, Inglés y más."

  const allKeywords = [
    ...keywords,
    'instituto san pablo',
    'LMS colombia',
    'cursos online pereira',
    'formación técnica',
    'SENA certificado'
  ]

  const canonical = canonicalUrl || baseUrl

  // Structured Data para cursos
  const courseStructuredData = courseData ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Instituto San Pablo",
      "sameAs": baseUrl
    },
    ...(courseData.instructor && {
      "instructor": {
        "@type": "Person", 
        "name": courseData.instructor
      }
    }),
    ...(courseData.duration && {
      "timeRequired": courseData.duration
    }),
    ...(courseData.level && {
      "educationalLevel": courseData.level
    }),
    ...(courseData.category && {
      "courseCategory": courseData.category
    }),
    ...(courseData.price && {
      "offers": {
        "@type": "Offer",
        "price": courseData.price,
        "priceCurrency": "COP"
      }
    }),
    ...(courseData.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": courseData.rating,
        "reviewCount": courseData.reviewCount || 1
      }
    })
  } : null

  // Tracking de Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Lazy load del tracking de Web Vitals (v5+ API)
      import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS(console.log)
        onFCP(console.log)
        onINP(console.log)
        onLCP(console.log)
        onTTFB(console.log)
      }).catch(() => {
        // Web vitals no disponible
      })
    }
  }, [])

  return (
    <>
      <Head>
        {/* Título y descripción */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        
        {/* Keywords */}
        {allKeywords.length > 0 && (
          <meta name="keywords" content={allKeywords.join(', ')} />
        )}
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonical} />
        
        {/* No Index si se especifica */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${baseUrl}${ogImage}`} />
        <meta property="og:site_name" content="Instituto San Pablo LMS" />
        <meta property="og:locale" content="es_CO" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
        
        {/* Metadatos adicionales para educación */}
        <meta name="author" content="Instituto San Pablo" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="CO-63" />
        <meta name="geo.placename" content="Pereira, Risaralda" />
        <meta name="geo.position" content="4.8133;-75.6961" />
        
        {/* Preconnections para rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.clerk.com" />
        <link rel="dns-prefetch" href="https://utfs.io" />
        
        {/* Structured Data para cursos */}
        {courseStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(courseStructuredData)
            }}
          />
        )}
        
        {/* Breadcrumb Schema si está disponible */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Instituto San Pablo",
                  "item": baseUrl
                },
                ...(title ? [{
                  "@type": "ListItem", 
                  "position": 2,
                  "name": title,
                  "item": canonical
                }] : [])
              ]
            })
          }}
        />
      </Head>
      {children}
    </>
  )
}