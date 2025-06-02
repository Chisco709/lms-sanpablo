import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lms-sanpablo.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/student',
          '/search',
          '/courses/*',
          '/sign-in',
          '/sign-up',
          '/api/webhooks/*', // Para webhooks públicos
        ],
        disallow: [
          '/api/*/private',
          '/teacher/*',
          '/dashboard/private/*',
          '/admin/*',
          '/_next/*',
          '/api/auth/*',
          '/*.json$',
          '/tmp/*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/student', 
          '/search',
          '/courses/*',
          '/sign-in',
          '/sign-up',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/student',
          '/search', 
          '/courses/*',
        ],
        crawlDelay: 2,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 