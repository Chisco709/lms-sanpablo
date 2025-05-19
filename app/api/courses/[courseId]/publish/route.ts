import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
      include: {
        chapters: true
      }
    });

    if (!course) {
      return new NextResponse("Curso no encontrado", { status: 404 });
    }

    // Validar campos requeridos
    const missingFields = [];
    if (!course.title) missingFields.push("título");
    if (!course.description) missingFields.push("descripción");
    if (!course.imageUrl) missingFields.push("imagen");
    if (!course.price) missingFields.push("precio");
    if (!course.categoryId) missingFields.push("categoría");

    if (missingFields.length > 0) {
      return new NextResponse(
        `Faltan los siguientes campos: ${missingFields.join(", ")}`,
        { status: 400 }
      );
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

    if (!hasPublishedChapters) {
      return new NextResponse(
        "Se requiere al menos un capítulo publicado. Por favor, publica al menos un capítulo antes de publicar el curso.",
        { status: 400 }
      );
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
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