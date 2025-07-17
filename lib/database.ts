// Sistema avanzado de base de datos con logging y cache
import { db } from './db';
import { dbLogger, LogContext } from './logger';
import { handleError, DatabaseError } from './error-handler';

// Extensión del cliente Prisma con logging automático
class DatabaseService {
  private queryCount = 0;
  private readonly slowQueryThreshold = 1000; // 1 segundo

  // Wrapper para queries con logging automático
  async executeQuery<T>(
    operation: () => Promise<T>,
    context: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    this.queryCount++;

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      // Log automático de queries
      dbLogger.databaseQuery(context.operation || 'unknown', duration);
      
      if (duration > this.slowQueryThreshold) {
        dbLogger.warn('Slow query detected', {
          ...context,
          duration,
          operation: context.operation
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      dbLogger.error('Database query failed', {
        ...context,
        duration,
        operation: context.operation
      }, error as Error);

      throw handleError(error, context);
    }
  }

  // Métodos específicos del negocio
  async getCourseWithChapters(courseId: string, userId?: string) {
    return this.executeQuery(
      () => db.course.findUnique({
        where: { id: courseId },
        include: {
          chapters: {
            where: { isPublished: true },
            orderBy: { position: 'asc' }
          },
          category: true,
          attachments: true
        }
      }),
      { courseId, userId, operation: 'getCourseWithChapters' }
    );
  }

  async getUserProgress(userId: string, courseId: string) {
    return this.executeQuery(
      () => db.userProgress.findMany({
        where: {
          userId,
          chapter: { courseId }
        },
        include: { chapter: true }
      }),
      { userId, courseId, operation: 'getUserProgress' }
    );
  }

  async getStudentEnrollments(userId: string) {
    return this.executeQuery(
      () => db.purchase.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              chapters: {
                where: { isPublished: true }
              }
            }
          }
        }
      }),
      { userId, operation: 'getStudentEnrollments' }
    );
  }

  async getTeacherCourses(userId: string) {
    return this.executeQuery(
      () => db.course.findMany({
        where: { userId },
        include: {
          chapters: true,
          category: true,
          _count: {
            select: {
              purchases: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      { userId, operation: 'getTeacherCourses' }
    );
  }

  async getCourseAnalytics(courseId: string, userId: string) {
    const course = await this.executeQuery(
      () => db.course.findFirst({
        where: { id: courseId, userId },
        include: {
          purchases: true,
          chapters: {
            include: {
              userProgress: true
            }
          }
        }
      }),
      { courseId, userId, operation: 'getCourseAnalytics' }
    );

    if (!course) {
      throw new DatabaseError('Course not found or access denied', { courseId, userId });
    }

    // Calcular estadísticas
    const totalStudents = course.purchases?.length || 0;
    const totalChapters = course.chapters?.length || 0;
    const completionData: Array<{
      chapterId: string;
      title: string;
      completedCount: number;
      completionRate: number;
    }> = [];

    course.chapters?.forEach((chapter: any) => {
      const completedCount = chapter.userProgress?.filter((p: any) => p.isCompleted).length || 0;
      const completionRate = totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0;
      
      completionData.push({
        chapterId: chapter.id,
        title: chapter.title,
        completedCount,
        completionRate: Math.round(completionRate)
      });
    });

    return {
      course: {
        id: course.id,
        title: course.title,
        totalStudents,
        totalChapters
      },
      students: course.purchases?.map((purchase: any) => ({
        id: purchase.userId,
        userId: purchase.userId,
        enrolledAt: purchase.createdAt
      })) || [],
      chapterCompletion: completionData
    };
  }

  async getDashboardData(userId: string) {
    const [courses, recentProgress] = await Promise.all([
      this.getTeacherCourses(userId),
      this.executeQuery(
        () => db.userProgress.findMany({
          where: {
            chapter: {
              course: { userId }
            }
          },
          include: {
            chapter: {
              include: { course: true }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: 10
        }),
        { userId, operation: 'getRecentProgress' }
      )
    ]);

    const totalStudents = await this.executeQuery(
      () => db.purchase.count({
        where: {
          course: { userId }
        }
      }),
      { userId, operation: 'getTotalStudents' }
    );

    const publishedCourses = courses.filter(course => course.isPublished).length;
    // No calculamos revenue por ahora ya que Purchase no tiene price
    const totalRevenue = { _sum: { price: 0 } };

    return {
      totalCourses: courses.length,
      publishedCourses,
      totalStudents,
      totalRevenue: totalRevenue._sum?.price || 0,
      recentActivity: recentProgress.map(progress => ({
        studentName: `Student ${progress.userId.slice(0, 8)}`,
        courseName: progress.chapter.course.title,
        chapterName: progress.chapter.title,
        completedAt: progress.updatedAt
      }))
    };
  }

  // Función para obtener estadísticas del sistema
  async getSystemStats() {
    const [totalCourses, totalStudents, totalChapters, recentActivity] = await Promise.all([
      this.executeQuery(() => db.course.count(), { operation: 'getTotalCourses' }),
      this.executeQuery(() => db.purchase.count(), { operation: 'getTotalPurchases' }),
      this.executeQuery(() => db.chapter.count(), { operation: 'getTotalChapters' }),
      this.executeQuery(
        () => db.userProgress.findMany({
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: {
            chapter: {
              include: { course: true }
            }
          }
        }),
        { operation: 'getRecentActivity' }
      )
    ]);

    return {
      totalCourses,
      totalStudents,
      totalChapters,
      recentActivity: recentActivity.map(activity => ({
        type: 'chapter_completed',
        courseName: activity.chapter.course.title,
        chapterName: activity.chapter.title,
        timestamp: activity.updatedAt
      }))
    };
  }

  // Health check de la base de datos
  async healthCheck() {
    try {
      const start = Date.now();
      
      // Test básico de conexión
      await db.$queryRaw`SELECT 1`;
      
      const latency = Date.now() - start;
      
      // Test de escritura/lectura
      const testData = await db.course.findFirst({
        select: { id: true }
      });

      return {
        status: 'healthy',
        latency,
        connection: 'ok',
        readTest: testData ? 'ok' : 'no_data',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      dbLogger.error('Database health check failed', {}, error as Error);
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Obtener estadísticas de performance
  getStats() {
    return {
      queryCount: this.queryCount,
      slowQueryThreshold: this.slowQueryThreshold
    };
  }
}

// Instancia singleton
export const database = new DatabaseService();

// Exportar también el cliente directo para casos específicos
export { db as prisma };

// Funciones de utilidad específicas
export async function checkCourseOwnership(courseId: string, userId: string): Promise<boolean> {
  try {
    const course = await database.executeQuery(
      () => db.course.findFirst({
        where: { id: courseId, userId },
        select: { id: true }
      }),
      { courseId, userId, operation: 'checkCourseOwnership' }
    );
    
    return !!course;
  } catch (error) {
    return false;
  }
}

export async function checkChapterOwnership(chapterId: string, userId: string): Promise<boolean> {
  try {
    const chapter = await database.executeQuery(
      () => db.chapter.findFirst({
        where: { 
          id: chapterId,
          course: { userId }
        },
        select: { id: true }
      }),
      { chapterId, userId, operation: 'checkChapterOwnership' }
    );
    
    return !!chapter;
  } catch (error) {
    return false;
  }
} 