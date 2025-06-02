'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect } from 'react'

export default function AnalyticsProvider() {
  useEffect(() => {
    // Verificar si estamos en producción
    if (process.env.NODE_ENV === 'production') {
      console.log('📊 Analytics de Instituto San Pablo activado')
    }
  }, [])

  return (
    <>
      {/* Vercel Analytics para métricas de tráfico */}
      <Analytics />
      
      {/* Speed Insights para Core Web Vitals */}
      <SpeedInsights />
      
      {/* Google Analytics 4 (opcional - reemplaza con tu ID) */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID', {
                  page_title: 'Instituto San Pablo LMS',
                  custom_map: {
                    'custom_parameter_name': 'colombia_education'
                  }
                });
              `,
            }}
          />
        </>
      )}
    </>
  )
} 