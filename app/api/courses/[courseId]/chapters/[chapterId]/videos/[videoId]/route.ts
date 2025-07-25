import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateVideoSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  url: z.string().url("URL inválida")
    .startsWith("https://www.youtube.com/", {
      message: "Solo se permiten videos de YouTube"
    })
    .optional(),
  position: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional()
});

// Actualizar un video
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; videoId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("No autorizado", { status: 401 });

    const { courseId, chapterId, videoId } = params;
    const json = await req.json();
    const data = updateVideoSchema.parse(json);

    // Verificar que el usuario es propietario del curso
    const course = await db.course.findUnique({
      where: { id: courseId, userId: user.id }
    });
    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Verificar que el video existe y pertenece al capítulo y curso
    const existingVideo = await db.chapterVideo.findFirst({
      where: { 
        id: videoId,
        chapter: {
          id: chapterId,
          courseId: courseId
        }
      }
    });

    if (!existingVideo) {
      return new NextResponse("Video no encontrado", { status: 404 });
    }

    // Si se marca como primario, quitar la marca a los demás
    if (data.isPrimary) {
      await db.chapterVideo.updateMany({
        where: { 
          chapterId,
          isPrimary: true,
          id: { not: videoId } // Excluir el video actual
        },
        data: { isPrimary: false }
      });
    }

    // Actualizar el video
    const updatedVideo = await db.chapterVideo.update({
      where: { id: videoId },
      data: {
        title: data.title,
        url: data.url,
        position: data.position,
        isPrimary: data.isPrimary
      }
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("[VIDEO_UPDATE]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }
    return new NextResponse("Error al actualizar el video", { status: 500 });
  }
}

// Eliminar un video
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; videoId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("No autorizado", { status: 401 });

    const { courseId, chapterId, videoId } = params;

    // Verificar que el usuario es propietario del curso
    const course = await db.course.findUnique({
      where: { id: courseId, userId: user.id }
    });
    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Verificar que el video existe y pertenece al capítulo y curso
    const existingVideo = await db.chapterVideo.findFirst({
      where: { 
        id: videoId,
        chapter: {
          id: chapterId,
          courseId: courseId
        }
      }
    });

    if (!existingVideo) {
      return new NextResponse("Video no encontrado", { status: 404 });
    }

    // Verificar si es el único video
    const videoCount = await db.chapterVideo.count({ 
      where: { chapterId }
    });

    if (videoCount <= 1) {
      return new NextResponse(
        "No se puede eliminar el único video del capítulo. Agrega otro video primero o elimina el capítulo completo.", 
        { status: 400 }
      );
    }

    // Eliminar el video
    await db.chapterVideo.delete({
      where: { id: videoId }
    });

    // Si el video eliminado era el principal, marcar otro como principal
    if (existingVideo.isPrimary) {
      const firstVideo = await db.chapterVideo.findFirst({
        where: { 
          chapterId,
          id: { not: videoId }
        },
        orderBy: { position: 'asc' }
      });

      if (firstVideo) {
        await db.chapterVideo.update({
          where: { id: firstVideo.id },
          data: { isPrimary: true }
        });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[VIDEO_DELETE]", error);
    return new NextResponse("Error al eliminar el video", { status: 500 });
  }
}
