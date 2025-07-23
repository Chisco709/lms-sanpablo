import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://institutosanpablo.edu.co'

  // Obtener cursos publicados para el sitemap
  const courses = await db.course.findMany({
    where: {
      isPublished: true
    },
    select: {
      id: true,
      updatedAt: true
    }
  }).catch(() => [])

  // URLs estáticas principales - SOLO PÁGINAS PÚBLICAS
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Removidas las URLs privadas del dashboard
    // /student, /search, /certificates, /progress son áreas privadas
  ]

  // URLs dinámicas de cursos - SOLO PÁGINAS PÚBLICAS DE CURSOS
  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: course.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticUrls, ...courseUrls]
}