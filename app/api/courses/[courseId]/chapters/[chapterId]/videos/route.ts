import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const videoSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  url: z.string().url("URL inválida").refine(
    (url) => {
      // Acepta tanto youtu.be como youtube.com
      return (
        url.includes('youtube.com/watch') || 
        url.includes('youtu.be/') ||
        url.includes('youtube.com/embed/')
      );
    },
    {
      message: "Solo se permiten enlaces de YouTube (formato: youtube.com/watch?v=ID o youtu.be/ID)"
    }
  ),
  position: z.number().int().min(0),
  isPrimary: z.boolean().optional().default(false)
});

// Obtener todos los videos de un capítulo
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("No autorizado", { status: 401 });

    const { courseId, chapterId } = params;

    // Verificar que el usuario es propietario del curso
    const course = await db.course.findUnique({
      where: { id: courseId, userId: user.id }
    });
    if (!course) return new NextResponse("No autorizado", { status: 401 });

    const videos = await db.chapterVideo.findMany({
      where: { 
        chapter: {
          id: chapterId,
          courseId: courseId
        }
      },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("[VIDEOS_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// Agregar un nuevo video
export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("No autorizado", { status: 401 });

    const { courseId, chapterId } = params;
    const json = await req.json();
    const body = videoSchema.parse(json);

    // Verificar que el usuario es propietario del curso
    const course = await db.course.findUnique({
      where: { id: courseId, userId: user.id }
    });
    if (!course) return new NextResponse("No autorizado", { status: 401 });

    // Verificar que el capítulo existe y pertenece al curso
    const chapter = await db.chapter.findFirst({
      where: { 
        id: chapterId, 
        courseId: courseId 
      }
    });
    if (!chapter) {
      return new NextResponse("Capítulo no encontrado", { status: 404 });
    }

    // Si se marca como primario, quitar la marca a los demás
    if (body.isPrimary) {
      await db.chapterVideo.updateMany({
        where: { 
          chapterId,
          isPrimary: true 
        },
        data: { isPrimary: false }
      });
    }

    // Obtener el número actual de videos para establecer la posición
    const videoCount = await db.chapterVideo.count({ where: { chapterId } });
    
    try {
      const video = await db.chapterVideo.create({
        data: {
          title: body.title,
          url: body.url,
          position: body.position ?? videoCount,
          isPrimary: body.isPrimary || false,
          chapterId
        }
      });

      return NextResponse.json(video, { status: 201 });
    } catch (dbError) {
      console.error("[VIDEO_CREATE_DB_ERROR]", dbError);
      return new NextResponse("Error al guardar el video en la base de datos", { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("[VIDEO_CREATE]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Datos de entrada inválidos",
          errors: error.errors 
        }), 
        { 
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    return new NextResponse(
      JSON.stringify({ 
        message: "Error interno del servidor al procesar la solicitud" 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
