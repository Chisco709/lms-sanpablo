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
      include: {
        category: true,
        chapters: {
          include: {
            userProgress: {
              include: {
                user: true
              }
            }
          }
        },
        purchases: {
          where: {
            createdAt: {
              gte: startDate
            }
          },
          include: {
            user: true
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

    // Calcular estadísticas generales
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    const totalStudents = await db.purchase.count({
      where: {
        course: {
          id: {
            in: courses.map(c => c.id)
          }
        }
      }
    });

    const totalRevenue = await db.purchase.aggregate({
      where: {
        course: {
          id: {
            in: courses.map(c => c.id)
          }
        },
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        price: true
      }
    });

    // Calcular tasa de completado promedio
    let totalProgress = 0;
    let courseCount = 0;

    for (const course of courses) {
      if (course.chapters.length > 0) {
        const publishedChapters = course.chapters.filter(ch => ch.isPublished);
        if (publishedChapters.length > 0) {
          const completedChapters = publishedChapters.filter(ch => 
            ch.userProgress.some(up => up.isCompleted)
          );
          totalProgress += (completedChapters.length / publishedChapters.length) * 100;
          courseCount++;
        }
      }
    }

    const averageCompletionRate = courseCount > 0 ? totalProgress / courseCount : 0;

    // Estadísticas por curso
    const courseStats = courses.map(course => {
      const studentsEnrolled = course._count.purchases;
      const publishedChapters = course.chapters.filter(ch => ch.isPublished);
      const totalChapters = publishedChapters.length;
      
      let completedStudents = 0;
      let totalProgressSum = 0;
      let videoWatchedCount = 0;

      // Calcular progreso por estudiante
      const students = new Set(course.purchases.map(p => p.userId));
      
      students.forEach(studentId => {
        const completedChapters = publishedChapters.filter(ch =>
          ch.userProgress.some(up => up.userId === studentId && up.isCompleted)
        );
        
        const studentProgress = totalChapters > 0 ? (completedChapters.length / totalChapters) * 100 : 0;
        totalProgressSum += studentProgress;
        
        if (studentProgress === 100) {
          completedStudents++;
        }
        
        videoWatchedCount += completedChapters.length;
      });

      const averageProgress = students.size > 0 ? totalProgressSum / students.size : 0;
      const completionRate = students.size > 0 ? (completedStudents / students.size) * 100 : 0;
      
      // Calcular ingresos del curso
      const courseRevenue = course.purchases.reduce((sum, purchase) => {
        return sum + (purchase.price || course.price || 0);
      }, 0);

      return {
        id: course.id,
        title: course.title,
        imageUrl: course.imageUrl,
        studentsEnrolled,
        completionRate: Math.round(completionRate),
        averageProgress: Math.round(averageProgress),
        revenue: courseRevenue,
        totalVideosWatched: videoWatchedCount,
        averageRating: 4.5 + Math.random() * 0.5, // Simulado por ahora
        isPublished: course.isPublished,
        createdAt: course.createdAt.toISOString(),
        category: course.category,
        _count: course._count
      };
    });

    // Actividad reciente (simulada)
    const recentActivity = [
      {
        id: "1",
        type: "enrollment" as const,
        studentName: "María González",
        courseName: "Técnico en Primera Infancia",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        details: "Nueva inscripción"
      },
      {
        id: "2", 
        type: "completion" as const,
        studentName: "Carlos Rodríguez",
        courseName: "Inglés Técnico Avanzado",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        details: "Completó el curso"
      },
      {
        id: "3",
        type: "video_watched" as const,
        studentName: "Ana Martínez", 
        courseName: "Pedagogía Infantil",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        details: "Vió 3 videos"
      }
    ];

    // Métricas de crecimiento (simuladas)
    const growthMetrics = {
      studentsGrowth: 15.5,
      revenueGrowth: 23.2,
      coursesGrowth: 8.7,
      engagementGrowth: 12.1
    };

    // Estadísticas mensuales (últimos 4 meses)
    const monthlyStats = [
      { month: "Oct", enrollments: 45, completions: 32, revenue: 2250000 },
      { month: "Nov", enrollments: 52, completions: 38, revenue: 2600000 },
      { month: "Dic", enrollments: 68, completions: 49, revenue: 3400000 },
      { month: "Ene", enrollments: 78, completions: 58, revenue: 3900000 }
    ];

    const analyticsData = {
      overview: {
        totalCourses,
        publishedCourses,
        totalStudents,
        totalRevenue: totalRevenue._sum.price || 0,
        averageCompletionRate: Math.round(averageCompletionRate),
        totalVideoHours: 156 // Simulado
      },
      courseStats: courseStats.filter(c => c.isPublished),
      recentActivity,
      growthMetrics,
      topPerformingCourses: courseStats
        .filter(c => c.isPublished)
        .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        .slice(0, 3),
      monthlyStats
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error("[TEACHER_ANALYTICS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 