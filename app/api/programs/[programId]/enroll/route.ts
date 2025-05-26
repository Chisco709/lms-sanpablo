import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { scheduleProgramUnlocks } from "@/lib/unlock-system";

/**
 * POST - Inscribir estudiante en programa técnico
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { programId } = params;
    const body = await request.json();
    const {
      studentId, // Cédula
      phone,
      city,
      department,
      startDate
    } = body;

    // Verificar que el programa existe
    const program = await db.technicalProgram.findUnique({
      where: { id: programId },
      include: {
        courses: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si ya está inscrito
    const existingEnrollment = await db.programEnrollment.findUnique({
      where: {
        userId_programId: {
          userId,
          programId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Ya estás inscrito en este programa" },
        { status: 400 }
      );
    }

    const enrollmentStartDate = startDate ? new Date(startDate) : new Date();
    const expectedEndDate = new Date(enrollmentStartDate);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + program.duration);

    // Crear inscripción
    const enrollment = await db.programEnrollment.create({
      data: {
        userId,
        programId,
        startDate: enrollmentStartDate,
        expectedEndDate,
        studentId,
        phone,
        city,
        department
      }
    });

    // Programar desbloqueos de cursos si hay cursos en el programa
    if (program.courses.length > 0) {
      const courseSchedule = program.courses.map((course, index) => ({
        courseId: course.id,
        month: index + 1
      }));

      await scheduleProgramUnlocks(programId, enrollmentStartDate, courseSchedule);
    }

    // Crear notificación de bienvenida
    await db.notification.create({
      data: {
        userId,
        title: "¡Bienvenido a tu programa técnico!",
        message: `Te has inscrito exitosamente en ${program.title}. Tu programa comenzará el ${enrollmentStartDate.toLocaleDateString('es-CO')}.`,
        type: "program_enrollment",
        relatedProgramId: programId
      }
    });

    return NextResponse.json({
      enrollment,
      message: "Inscripción exitosa",
      programTitle: program.title,
      startDate: enrollmentStartDate,
      expectedEndDate
    }, { status: 201 });

  } catch (error) {
    console.error("Error en inscripción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET - Obtener información de inscripción
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { programId } = params;

    const enrollment = await db.programEnrollment.findUnique({
      where: {
        userId_programId: {
          userId,
          programId
        }
      },
      include: {
        program: {
          include: {
            courses: {
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
            }
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "No estás inscrito en este programa" },
        { status: 404 }
      );
    }

    // Calcular progreso
    const coursesProgress = enrollment.program.courses.map(course => {
      const totalChapters = course.chapters.length;
      const completedChapters = course.chapters.filter(
        chapter => chapter.userProgress.some(progress => progress.isCompleted)
      ).length;

      return {
        courseId: course.id,
        title: course.title,
        isUnlocked: course.isPublished,
        unlockDate: course.unlockDate,
        totalChapters,
        completedChapters,
        completionPercentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
      };
    });

    const overallProgress = coursesProgress.length > 0 ?
      Math.round(coursesProgress.reduce((sum, course) => sum + course.completionPercentage, 0) / coursesProgress.length) : 0;

    const currentMonth = Math.floor((Date.now() - enrollment.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1;

    return NextResponse.json({
      enrollment,
      progress: {
        courses: coursesProgress,
        overallProgress,
        currentMonth: Math.min(currentMonth, enrollment.program.duration)
      }
    });

  } catch (error) {
    console.error("Error obteniendo inscripción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 