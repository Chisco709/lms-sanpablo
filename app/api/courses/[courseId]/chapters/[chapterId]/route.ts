// app/api/courses/[courseId]/chapters/[chapterId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Obtener capítulo con todas sus relaciones
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId
      },
      include: {
        course: {
          select: {
            title: true
          }
        },
        pensumTopic: {
          select: {
            title: true
          }
        }
      }
    });

    if (!chapter) return new NextResponse("Capítulo no encontrado", { status: 404 });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTER_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId  } = await params;
    const values = await req.json();

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Obtener el capítulo actual primero
    const currentChapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId
      },
      select: {
        videoUrl: true,
        videoUrls: true,
        pdfUrl: true,
        pdfUrls: true
      }
    });

    if (!currentChapter) {
      return new NextResponse("Capítulo no encontrado", { status: 404 });
    }

    // Preparar datos para actualización
    const updateData: any = {
      title: values.title,
      description: values.description,
      isFree: values.isFree,
      googleFormUrl: values.googleFormUrl,
    };

    // Manejar videos
    if (values.videoUrl !== undefined) {
      // Si se envía un videoUrl individual, lo convertimos a formato de array
      updateData.videoUrl = values.videoUrl;
      updateData.videoUrls = [values.videoUrl];
    } else if (values.videoUrls !== undefined) {
      // Si se envían múltiples videos
      const existingVideos = Array.isArray(currentChapter.videoUrls) ? currentChapter.videoUrls : [];
      updateData.videoUrls = Array.isArray(values.videoUrls) ? values.videoUrls : existingVideos;
      
      // Mantener el videoUrl actualizado con el primer video
      if (updateData.videoUrls.length > 0) {
        updateData.videoUrl = updateData.videoUrls[0];
      } else {
        updateData.videoUrl = null;
      }
    } else if (currentChapter.videoUrl) {
      // Si no se envían videos, mantener los existentes
      updateData.videoUrl = currentChapter.videoUrl;
      updateData.videoUrls = Array.isArray(currentChapter.videoUrls) ? 
        currentChapter.videoUrls : 
        currentChapter.videoUrl ? [currentChapter.videoUrl] : [];
    }

    // Manejar PDFs
    if (values.pdfUrl !== undefined) {
      // Si se envía un pdfUrl individual, lo convertimos a formato de array
      updateData.pdfUrl = values.pdfUrl;
      updateData.pdfUrls = [values.pdfUrl];
    } else if (values.pdfUrls !== undefined) {
      // Si se envían múltiples PDFs
      const existingPdfs = Array.isArray(currentChapter.pdfUrls) ? currentChapter.pdfUrls : [];
      updateData.pdfUrls = Array.isArray(values.pdfUrls) ? values.pdfUrls : existingPdfs;
      
      // Mantener el pdfUrl actualizado con el primer PDF
      if (updateData.pdfUrls.length > 0) {
        updateData.pdfUrl = updateData.pdfUrls[0];
      } else {
        updateData.pdfUrl = null;
      }
    } else if (currentChapter.pdfUrl) {
      // Si no se envían PDFs, mantener los existentes
      updateData.pdfUrl = currentChapter.pdfUrl;
      updateData.pdfUrls = Array.isArray(currentChapter.pdfUrls) ? 
        currentChapter.pdfUrls : 
        currentChapter.pdfUrl ? [currentChapter.pdfUrl] : [];
    }

    // Actualizar capítulo
    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId
      },
      data: updateData
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[CHAPTER_UPDATE]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!user) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Eliminar capítulo
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId
      }
    });

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[CHAPTER_DELETE]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}