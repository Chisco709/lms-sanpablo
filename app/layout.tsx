import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastProvider } from "@/components/providers/toaster-providers"
import AnalyticsProvider from "@/components/analytics-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lms-sanpablo.vercel.app'),
  title: {
    default: "Instituto San Pablo | Plataforma LMS #1 en Pereira, Colombia",
    template: "%s | Instituto San Pablo"
  },
  description: "🎓 Plataforma LMS líder en Pereira con 15+ años formando profesionales técnicos. Cursos certificados SENA en Primera Infancia, Inglés y más. ✨ Tecnología educativa avanzada para estudiantes colombianos.",
  keywords: [
    "instituto san pablo",
    "LMS colombia", 
    "plataforma educativa pereira",
    "cursos online colombia",
    "formación técnica pereira",
    "SENA certificado",
    "primera infancia colombia",
    "inglés técnico pereira",
    "educación virtual risaralda",
    "capacitación profesional colombia",
    "instituto tecnológico pereira",
    "cursos certificados colombia",
    "formación laboral pereira",
    "educación continua colombia"
  ],
  authors: [{ name: "Instituto San Pablo", url: "https://lms-sanpablo.vercel.app" }],
  creator: "Instituto San Pablo",
  publisher: "Instituto San Pablo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://lms-sanpablo.vercel.app",
    siteName: "Instituto San Pablo LMS",
    title: "Instituto San Pablo | Plataforma LMS #1 en Pereira, Colombia",
    description: "🎓 Plataforma educativa líder con 15+ años transformando vidas en Pereira. Cursos técnicos certificados, tecnología avanzada y educación de calidad.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Instituto San Pablo - Plataforma LMS Pereira Colombia",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instituto San Pablo | LMS #1 en Pereira 🇨🇴",
    description: "🎓 15+ años formando profesionales. Cursos certificados SENA. Tecnología educativa avanzada.",
    images: ["/twitter-image.jpg"],
    creator: "@InstitutoSanPablo",
    site: "@InstitutoSanPablo",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://lms-sanpablo.vercel.app',
    languages: {
      'es-CO': 'https://lms-sanpablo.vercel.app',
      'es': 'https://lms-sanpablo.vercel.app',
    },
  },
  category: 'education',
  verification: {
    google: 'google-site-verification-code',
    other: {
      'facebook-domain-verification': 'facebook-verification-code',
    }
  },
  other: {
    'geo.region': 'CO-63',
    'geo.placename': 'Pereira, Risaralda',
    'geo.position': '4.8133;-75.6961',
    'ICBM': '4.8133, -75.6961',
    'application-name': 'Instituto San Pablo LMS',
    'apple-mobile-web-app-title': 'San Pablo LMS',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#0f172a',
    'msapplication-TileColor': '#0f172a',
    'msapplication-TileImage': '/mstile-144x144.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          avatarBox: {
            width: "2rem",
            height: "2rem"
          }
        }
      }}
    >
      <html lang="es-CO" className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
        <head>
          {/* Structured Data para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Instituto San Pablo",
                "alternateName": "Instituto San Pablo LMS",
                "url": "https://lms-sanpablo.vercel.app",
                "logo": "https://lms-sanpablo.vercel.app/logo.png",
                "image": "https://lms-sanpablo.vercel.app/og-image.jpg",
                "description": "Instituto líder en formación técnica en Pereira, Colombia. 15+ años transformando vidas con cursos certificados SENA.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Pereira",
                  "addressLocality": "Pereira",
                  "addressRegion": "Risaralda", 
                  "addressCountry": "CO"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 4.8133,
                  "longitude": -75.6961
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "admissions",
                  "areaServed": "CO",
                  "availableLanguage": "Spanish"
                },
                "sameAs": [
                  "https://facebook.com/institutosanpablo",
                  "https://instagram.com/institutosanpablo", 
                  "https://linkedin.com/company/instituto-san-pablo"
                ],
                "hasCredential": {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "certificate",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "SENA Colombia"
                  }
                }
              })
            }}
          />
          
          {/* Preconexiones para rendimiento */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="preconnect" href="https://utfs.io" />
          <link rel="dns-prefetch" href="https://api.clerk.com" />
          
          {/* Critical CSS inlined */}
          <style>{`
            html { scroll-behavior: smooth; }
            body { font-display: swap; }
            .loading { opacity: 0; transition: opacity 0.3s; }
            .loaded { opacity: 1; }
          `}</style>
        </head>
        <body className="bg-slate-950 text-white loading">
          <ToastProvider />
          {children}
          
          {/* Analytics y Speed Insights */}
          <AnalyticsProvider />
          
          {/* Script para marcar como cargado */}
          <script dangerouslySetInnerHTML={{
            __html: `document.body.classList.remove('loading'); document.body.classList.add('loaded');`
          }} />
        </body>
      </html>
    </ClerkProvider>
  )
}
