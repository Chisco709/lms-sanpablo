import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { scheduleProgramUnlocks } from "@/lib/unlock-system";

/**
 * POST - Inscribir estudiante en programa técnico
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { programId  } = await params;
    const body = await request.json();
    
    const {
      studentId,
      phone,
      city,
      department,
      startDate
    } = body;

    // Verificar que el programa existe
    const program = await db.technicalProgram.findUnique({
      where: {
        id: programId
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya está inscrito
    const existingEnrollment = await db.programEnrollment.findUnique({
      where: {
        userId_programId: { userId: user.id,
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

    // Calcular fecha de finalización esperada (duración en meses)
    const start = new Date(startDate);
    const expectedEndDate = new Date(start);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + program.duration);

    // Crear inscripción
    const enrollment = await db.programEnrollment.create({
      data: { userId: user.id,
        programId,
        studentId,
        phone,
        city,
        department,
        startDate: start,
        expectedEndDate,
        status: 'active'
      },
      include: {
        program: {
          select: {
            title: true,
            duration: true,
            qualification: true
          }
        }
      }
    });

    // Programar desbloqueos de cursos si hay cursos en el programa
    if (program.courses.length > 0) {
      const courseSchedule = program.courses.map((course, index) => ({
        courseId: course.id,
        month: index + 1
      }));

      await scheduleProgramUnlocks(programId, start, courseSchedule);
    }

    // Crear notificación de bienvenida
    await db.notification.create({
      data: { userId: user.id,
        title: "¡Bienvenido a tu programa técnico!",
        message: `Te has inscrito exitosamente en ${program.title}. Tu programa comenzará el ${start.toLocaleDateString('es-CO')}.`,
        type: "program_enrollment",
        relatedProgramId: programId
      }
    });

    return NextResponse.json(enrollment, { status: 201 });
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
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const user = await currentUser();
  const userId = user?.id;
  
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { programId  } = await params;

    const enrollment = await db.programEnrollment.findUnique({
      where: {
        userId_programId: { userId: user.id,
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
                      where: { userId: user.id }
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