import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId  } = await params;

    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
      // ✅ Ya no necesitamos incluir capítulos para la validación
    });

    if (!course) {
      return new NextResponse("Curso no encontrado", { status: 404 });
    }

    // Solo título es requerido para publicar
    if (!course.title) {
      return new NextResponse(
        "El título del curso es requerido para publicar",
        { status: 400 }
      );
    }

    // Verificar que el curso tenga al menos un capítulo con PDF
    const chapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
        pdfUrl: {
          not: null
        }
      },
      select: {
        id: true,
        pdfUrl: true
      }
    });

    if (chapters.length === 0) {
      return new NextResponse(
        "Se requiere al menos un capítulo publicado con PDF para publicar el curso",
        { status: 400 }
      );
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId
      },
      data: {
        isPublished: true
      }
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_PUBLISH]", error);
    return new NextResponse(
      "Error interno del servidor al publicar el curso",
      { status: 500 }
    );
  }
} 