import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();

    // Verificación de autenticación
    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    // Validar propiedad del curso
    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId }
    });

    if (!ownCourse) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    // Buscar el capítulo
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId }
    });

    if (!chapter) {
      return new NextResponse("No encontrado", { status: 404 });
    }

    // Eliminar datos relacionados (si existen)
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId }
      });

      if (existingMuxData) {
        await db.muxData.delete({
          where: { id: existingMuxData.id } // Corrección clave aquí
        });
      }
    }

    // Eliminar el capítulo
    const deletedChapter = await db.chapter.delete({
      where: { id: params.chapterId }
    });

    // Despublicar el curso si no hay capítulos publicados
    const publishedChapters = await db.chapter.findMany({
      where: { courseId: params.courseId, isPublished: true }
    });

    if (publishedChapters.length === 0) {
      await db.course.update({
        where: { id: params.courseId },
        data: { isPublished: false }
      });
    }

    return NextResponse.json(deletedChapter);

  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { videoUrl } = await req.json();

    // Validación de autenticación y propiedad
    if (!userId) return new NextResponse("No autorizado", { status: 401 });
    
    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId }
    });

    if (!ownCourse) return new NextResponse("No autorizado", { status: 401 });

    // Actualizar solo el videoUrl
    const updatedChapter = await db.chapter.update({
      where: { 
        id: params.chapterId,
        courseId: params.courseId // Added security layer
      },
      data: { videoUrl }
    });

    return NextResponse.json(updatedChapter);
    
  } catch (error) {
    console.error("[CHAPTER_VIDEO]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}