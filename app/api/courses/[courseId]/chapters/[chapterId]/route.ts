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
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        videoUrls: true,
        pdfUrl: true,
        pdfUrls: true,
        position: true,
        isPublished: true,
        isFree: true,
        googleFormUrl: true,
        course: {
          select: {
            title: true,
            id: true
          }
        },
        pensumTopic: {
          select: {
            title: true
          }
        }
      }
    });
    
    console.log('Chapter data from DB:', {
      chapterId: chapterId,
      videoUrl: chapter?.videoUrl,
      videoUrls: chapter?.videoUrls,
      pdfUrl: chapter?.pdfUrl,
      pdfUrls: chapter?.pdfUrls
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

    // Handle PDFs
    if (values.pdfUrls !== undefined) {
      // If we're receiving pdfUrls in the request
      if (Array.isArray(values.pdfUrls)) {
        // Process each PDF item to ensure it has the correct structure
        updateData.pdfUrls = values.pdfUrls.map((item: string | { url: string; name?: string }, index: number) => {
          // If it's a string, convert to object with default name
          if (typeof item === 'string') {
            return {
              url: item,
              name: `Documento ${index + 1}`
            };
          }
          // If it's an object, ensure it has required fields
          return {
            url: item.url,
            name: item.name || `Documento ${index + 1}`
          };
        });
        
        // Update the legacy pdfUrl field with the first PDF URL for backward compatibility
        if (updateData.pdfUrls.length > 0) {
          updateData.pdfUrl = updateData.pdfUrls[0].url;
        } else {
          updateData.pdfUrl = null;
        }
      }
    } else if (values.pdfUrl !== undefined) {
      // Handle legacy single PDF URL
      updateData.pdfUrl = values.pdfUrl;
      updateData.pdfUrls = [{
        url: values.pdfUrl,
        name: 'Documento 1'
      }];
    } else if (currentChapter.pdfUrl || currentChapter.pdfUrls) {
      // If no PDF data in request, keep existing data
      updateData.pdfUrl = currentChapter.pdfUrl;
      updateData.pdfUrls = Array.isArray(currentChapter.pdfUrls) && currentChapter.pdfUrls.length > 0
        ? currentChapter.pdfUrls
        : currentChapter.pdfUrl 
          ? [{ url: currentChapter.pdfUrl, name: 'Documento 1' }] 
          : [];
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