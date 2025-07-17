import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que es el usuario autorizado como profesor
    if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    // Calcular fecha de inicio según el período
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Obtener todos los cursos del profesor
    const courses = await db.course.findMany({
      where: {
        userId: user.id,
      },
      include: {
        category: true,
        chapters: {
          include: {
            userProgress: {
              where: {
                createdAt: {
                  gte: startDate
                }
              }
            }
          }
        },
        purchases: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        },
        _count: {
          select: {
            chapters: true,
            purchases: true
          }
        }
      }
    });

    // Calcular estadísticas generales REALES
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    // Contar estudiantes únicos reales
    const allPurchases = await db.purchase.findMany({
      where: {
        course: {
          userId: user.id
        },
        createdAt: {
          gte: startDate
        }
      },
      select: {
        userId: true
      }
    });
    
    const totalStudents = new Set(allPurchases.map(p => p.userId)).size;

    // Calcular ingresos reales (los cursos no tienen precio real, así que será 0)
    const totalRevenue = 0; // Datos reales: no hay sistema de pagos implementado

    // Calcular tasa de completado real
    let totalCompletedChapters = 0;
    let totalChapters = 0;

    courses.forEach(course => {
      const publishedChapters = course.chapters.filter(ch => ch.isPublished);
      totalChapters += publishedChapters.length;
      
      publishedChapters.forEach(chapter => {
        const completedCount = chapter.userProgress.filter(up => up.isCompleted).length;
        totalCompletedChapters += completedCount;
      });
    });

    const averageCompletionRate = totalChapters > 0 ? (totalCompletedChapters / totalChapters) * 100 : 0;

    // Estadísticas reales por curso
    const courseStats = courses.map(course => {
      const studentsEnrolled = course._count.purchases;
      const publishedChapters = course.chapters.filter(ch => ch.isPublished);
      const totalChapters = publishedChapters.length;
      
      let completedChapters = 0;
      publishedChapters.forEach(chapter => {
        completedChapters += chapter.userProgress.filter(up => up.isCompleted).length;
      });

      const completionRate = totalChapters > 0 && studentsEnrolled > 0 ? 
        (completedChapters / (totalChapters * studentsEnrolled)) * 100 : 0;

      return {
        id: course.id,
        title: course.title,
        imageUrl: course.imageUrl,
        studentsEnrolled,
        completionRate: Math.round(completionRate),
        revenue: 0, // No hay sistema de pagos real
        isPublished: course.isPublished,
        createdAt: course.createdAt.toISOString(),
        category: course.category,
        _count: course._count
      };
    });

    // Actividad reciente REAL desde la base de datos
    const recentUserProgress = await db.userProgress.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
        },
        chapter: {
          course: {
            userId: user.id
          }
        }
      },
      include: {
        chapter: {
          include: {
            course: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const recentActivity = recentUserProgress.map((progress, index) => ({
      id: (index + 1).toString(),
      type: progress.isCompleted ? "completion" as const : "video_watched" as const,
      studentName: `Estudiante ${progress.userId.slice(-4)}`, // Por privacidad
      courseName: progress.chapter.course.title,
      timestamp: progress.createdAt.toISOString(),
      details: progress.isCompleted ? "Completó un capítulo" : "Vio un video"
    }));

    // SOLO datos reales, sin simulaciones
    const analyticsData = {
      overview: {
        totalCourses,
        publishedCourses,
        totalStudents,
        totalRevenue, // 0 - datos reales
        averageCompletionRate: Math.round(averageCompletionRate)
      },
      courseStats: courseStats.filter(c => c.isPublished),
      recentActivity, // Solo actividad real
      // Sin métricas de crecimiento simuladas
      topPerformingCourses: courseStats
        .filter(c => c.isPublished && c.studentsEnrolled > 0)
        .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        .slice(0, 3)
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error("[TEACHER_ANALYTICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 