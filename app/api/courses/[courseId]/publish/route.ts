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

    // Debug: Verificar los capítulos publicados
    const allPublishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        pdfUrl: true,
        pdfUrls: true
      }
    });

    console.log('Todos los capítulos publicados:', JSON.stringify(allPublishedChapters, null, 2));

    // Verificar que el curso tenga al menos un capítulo con PDF (en pdfUrl o pdfUrls)
    const chapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
        OR: [
          {
            pdfUrl: {
              not: null
            }
          },
          {
            pdfUrls: {
              isEmpty: false
            }
          },
          {
            pdfUrls: {
              hasSome: [""] // This will match any non-empty array or non-null value
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        pdfUrl: true,
        pdfUrls: true
      }
    });

    console.log('Capítulos con PDF encontrados:', JSON.stringify(chapters, null, 2));

    // Verificar si hay al menos un capítulo con PDF
    const hasPdfChapter = chapters.some(chapter => {
      return (
        chapter.pdfUrl || 
        (Array.isArray(chapter.pdfUrls) && chapter.pdfUrls.length > 0)
      );
    });

    if (!hasPdfChapter) {
      // Agregar más detalles sobre el error para depuración
      const errorDetails = {
        message: "No se encontraron capítulos con PDF",
        courseId,
        publishedChaptersCount: allPublishedChapters.length,
        publishedChapters: allPublishedChapters.map(c => ({
          id: c.id,
          title: c.title,
          hasPdfUrl: !!c.pdfUrl,
          hasPdfUrls: Array.isArray(c.pdfUrls) ? c.pdfUrls.length > 0 : false,
          pdfUrl: c.pdfUrl,
          pdfUrls: c.pdfUrls
        }))
      };
      
      console.error('Error de validación de PDF:', JSON.stringify(errorDetails, null, 2));
      
      return new NextResponse(
        JSON.stringify({
          error: "Se requiere al menos un capítulo publicado con PDF para publicar el curso",
          details: errorDetails
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
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