import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

/**
 * GET - Obtener todos los programas técnicos
 */
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const programs = await db.technicalProgram.findMany({
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            unlockDate: true
          }
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            department: true
          }
        },
        _count: {
          select: {
            courses: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calcular estadísticas para cada programa
    const programsWithStats = programs.map(program => {
      const activeEnrollments = program.enrollments.filter(e => e.status === 'active').length;
      const departments = [...new Set(program.enrollments.map(e => e.department).filter(Boolean))];
      const publishedCourses = program.courses.filter(c => c.isPublished).length;
      
      // Calcular próximo desbloqueo
      const nextUnlock = program.courses
        .filter(c => !c.isPublished && c.unlockDate)
        .sort((a, b) => new Date(a.unlockDate!).getTime() - new Date(b.unlockDate!).getTime())[0];

      return {
        ...program,
        stats: {
          activeEnrollments,
          departments: departments.length,
          departmentsList: departments,
          publishedCourses,
          totalCourses: program._count.courses,
          nextUnlock: nextUnlock?.unlockDate || null
        }
      };
    });

    return NextResponse.json(programsWithStats);
  } catch (error) {
    console.error("Error obteniendo programas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear nuevo programa técnico
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      duration = 18,
      senaCode,
      qualification,
      modality,
      price,
      imageUrl
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    const program = await db.technicalProgram.create({
      data: {
        title,
        description,
        duration,
        senaCode,
        qualification,
        modality,
        price: price ? parseFloat(price) : null,
        imageUrl
      }
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creando programa:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 