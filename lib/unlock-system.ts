import { db } from "@/lib/db";

/**
 * Sistema de desbloqueo automático para programas técnicos
 * Desbloquea cursos mensualmente según el cronograma establecido
 */

export interface UnlockSchedule {
  programId: string;
  courseId: string;
  unlockDate: Date;
  month: number; // Mes del programa (1-18)
}

/**
 * Verifica y desbloquea cursos que deben estar disponibles
 */
export async function checkAndUnlockCourses() {
  try {
    const now = new Date();
    
    // Buscar cursos que deben desbloquearse
    const coursesToUnlock = await db.course.findMany({
      where: {
        unlockDate: {
          lte: now
        },
        isPublished: false,
        programId: {
          not: null
        }
      },
      include: {
        program: true
      }
    });

    const unlockResults = [];

    for (const course of coursesToUnlock) {
      // Verificar si el estudiante cumple con los prerequisitos
      const prerequisitesMet = await checkPrerequisites(course.id);
      
      if (prerequisitesMet) {
        // Desbloquear el curso
        await db.course.update({
          where: { id: course.id },
          data: { isPublished: true }
        });

        // Crear notificaciones para estudiantes inscritos
        await createUnlockNotifications(course.id, course.programId!);
        
        unlockResults.push({
          courseId: course.id,
          title: course.title,
          unlocked: true
        });
      }
    }

    return unlockResults;
  } catch (error) {
    console.error("Error en sistema de desbloqueo:", error);
    throw error;
  }
}

/**
 * Verifica si se cumplen los prerequisitos para un curso
 */
async function checkPrerequisites(courseId: string): Promise<boolean> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      prerequisiteCourse: true
    }
  });

  if (!course?.prerequisiteCourseId) {
    return true; // No hay prerequisitos
  }

  // Verificar si el curso prerequisito está publicado
  const prerequisite = await db.course.findUnique({
    where: { id: course.prerequisiteCourseId }
  });

  return prerequisite?.isPublished || false;
}

/**
 * Crea notificaciones para estudiantes cuando se desbloquea un curso
 */
async function createUnlockNotifications(courseId: string, programId: string) {
  // Obtener estudiantes inscritos en el programa
  const enrollments = await db.programEnrollment.findMany({
    where: {
      programId: programId,
      status: "active"
    }
  });

  const course = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!course) return;

  // Crear notificaciones para cada estudiante
  const notifications = enrollments.map(enrollment => ({
    userId: enrollment.userId,
    title: "¡Nuevo curso disponible!",
    message: `El curso "${course.title}" ya está disponible en tu programa técnico.`,
    type: "course_unlock",
    relatedCourseId: courseId,
    relatedProgramId: programId
  }));

  await db.notification.createMany({
    data: notifications
  });
}

/**
 * Programa el desbloqueo de cursos para un programa técnico
 */
export async function scheduleProgramUnlocks(
  programId: string, 
  startDate: Date,
  courses: Array<{ courseId: string; month: number }>
) {
  const unlockSchedule: UnlockSchedule[] = [];

  for (const courseInfo of courses) {
    // Calcular fecha de desbloqueo (primer día del mes correspondiente)
    const unlockDate = new Date(startDate);
    unlockDate.setMonth(unlockDate.getMonth() + courseInfo.month - 1);
    unlockDate.setDate(1);
    unlockDate.setHours(0, 0, 0, 0);

    // Actualizar curso con fecha de desbloqueo
    await db.course.update({
      where: { id: courseInfo.courseId },
      data: {
        unlockDate: unlockDate,
        isPublished: courseInfo.month === 1 // Solo el primer mes se publica inmediatamente
      }
    });

    unlockSchedule.push({
      programId,
      courseId: courseInfo.courseId,
      unlockDate,
      month: courseInfo.month
    });
  }

  return unlockSchedule;
}

/**
 * Obtiene el cronograma de desbloqueo para un programa
 */
export async function getProgramUnlockSchedule(programId: string) {
  const courses = await db.course.findMany({
    where: { programId },
    orderBy: { unlockDate: 'asc' },
    select: {
      id: true,
      title: true,
      unlockDate: true,
      isPublished: true,
      position: true
    }
  });

  return courses.map((course, index) => ({
    ...course,
    month: index + 1,
    status: course.isPublished ? 'unlocked' : 'locked',
    daysUntilUnlock: course.unlockDate ? 
      Math.ceil((course.unlockDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
  }));
}

/**
 * Verifica el progreso de un estudiante en un programa
 */
export async function getStudentProgramProgress(userId: string, programId: string) {
  const enrollment = await db.programEnrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId
      }
    }
  });

  if (!enrollment) {
    throw new Error("Estudiante no inscrito en el programa");
  }

  const courses = await db.course.findMany({
    where: { programId },
    include: {
      chapters: {
        include: {
          userProgress: {
            where: { userId }
          }
        }
      }
    },
    orderBy: { unlockDate: 'asc' }
  });

  const progress = courses.map(course => {
    const totalChapters = course.chapters.length;
    const completedChapters = course.chapters.filter(
      chapter => chapter.userProgress.some(progress => progress.isCompleted)
    ).length;

    const completionPercentage = totalChapters > 0 ? 
      (completedChapters / totalChapters) * 100 : 0;

    return {
      courseId: course.id,
      title: course.title,
      isUnlocked: course.isPublished,
      unlockDate: course.unlockDate,
      totalChapters,
      completedChapters,
      completionPercentage: Math.round(completionPercentage)
    };
  });

  const overallProgress = progress.length > 0 ?
    progress.reduce((sum, course) => sum + course.completionPercentage, 0) / progress.length : 0;

  return {
    enrollment,
    courses: progress,
    overallProgress: Math.round(overallProgress),
    currentMonth: Math.floor((Date.now() - enrollment.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1
  };
}

/**
 * Función para ejecutar como cron job - verifica desbloqueos diariamente
 */
export async function dailyUnlockCheck() {
  console.log("Ejecutando verificación diaria de desbloqueos...");
  
  try {
    const results = await checkAndUnlockCourses();
    
    if (results.length > 0) {
      console.log(`Se desbloquearon ${results.length} cursos:`, results);
    } else {
      console.log("No hay cursos para desbloquear hoy");
    }
    
    return results;
  } catch (error) {
    console.error("Error en verificación diaria:", error);
    throw error;
  }
} 