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
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: [
          '/api/',
          '/teacher/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://institutosanpablo.edu.co/sitemap.xml',
    host: 'https://institutosanpablo.edu.co',
  }
}