import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/teacher/',
          '/admin/',
          '/_next/',
          '/private/',
          // '/sign-in/', // Solo desindexa rutas privadas
          // '/sign-up/',
          // '/student/',
          // '/dashboard/',
          // '/courses/*/chapters/*',
          // '/progress/',
          // '/certificates/',
          // '/goals/',
          // '/community/',
          // '/search/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: [
          '/api/',
          '/teacher/',
          '/admin/',
          // '/sign-in/',
          // '/sign-up/',
          // '/student/',
          // '/dashboard/',
          // '/courses/*/chapters/*',
          // '/progress/',
          // '/certificates/',
          // '/goals/',
          // '/community/',
          // '/search/',
        ],
      },
    ],
    sitemap: 'https://institutosanpablo.edu.co/sitemap.xml',
    host: 'https://institutosanpablo.edu.co',
  }
}