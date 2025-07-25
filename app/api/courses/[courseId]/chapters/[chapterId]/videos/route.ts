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
    if (!user) {
      console.log("[VIDEOS_GET] Usuario no autenticado");
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { courseId, chapterId } = params;
    console.log(`[VIDEOS_GET] Obteniendo videos para curso ${courseId}, capítulo ${chapterId}`);

    try {
      // Verificar que el usuario es propietario del curso
      const course = await db.course.findUnique({
        where: { id: courseId, userId: user.id },
        select: { id: true }
      });
      
      if (!course) {
        console.log(`[VIDEOS_GET] Curso no encontrado o usuario no autorizado`);
        return new NextResponse("No autorizado", { status: 401 });
      }

      const videos = await db.chapterVideo.findMany({
        where: { 
          chapterId: chapterId,
          chapter: {
            courseId: courseId
          }
        },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
          isPrimary: true,
          chapterId: true,
          createdAt: true,
          updatedAt: true
        }
      });

      console.log(`[VIDEOS_GET] ${videos.length} videos encontrados`);
      return NextResponse.json(videos);
    } catch (dbError) {
      console.error("[VIDEOS_GET_DB_ERROR]", dbError);
      return new NextResponse("Error al obtener los videos", { status: 500 });
    }
  } catch (error) {
    console.error("[VIDEOS_GET_ERROR]", error);
    return new NextResponse("Error interno del servidor", { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Agregar un nuevo video
export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("[VIDEO_CREATE] Usuario no autenticado");
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { courseId, chapterId } = params;
    console.log(`[VIDEO_CREATE] Intentando agregar video al capítulo ${chapterId} del curso ${courseId}`);
    
    let json;
    try {
      json = await req.json();
      console.log("[VIDEO_CREATE] Datos recibidos:", json);
    } catch (parseError) {
      console.error("[VIDEO_CREATE] Error al analizar JSON:", parseError);
      return new NextResponse(
        JSON.stringify({ message: "Formato de solicitud inválido" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar los datos de entrada
    let body;
    try {
      body = videoSchema.parse(json);
      console.log("[VIDEO_CREATE] Datos validados:", body);
    } catch (validationError) {
      console.error("[VIDEO_CREATE] Error de validación:", validationError);
      if (validationError instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ 
            message: "Datos de entrada inválidos",
            errors: validationError.errors 
          }), 
          { 
            status: 422,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      throw validationError;
    }

    try {
      // Verificar que el usuario es propietario del curso
      const course = await db.course.findUnique({
        where: { id: courseId, userId: user.id },
        select: { id: true }
      });
      
      if (!course) {
        console.log(`[VIDEO_CREATE] Curso no encontrado o usuario no autorizado`);
        return new NextResponse("No autorizado", { status: 401 });
      }

      // Verificar que el capítulo existe y pertenece al curso
      const chapter = await db.chapter.findFirst({
        where: { 
          id: chapterId, 
          courseId: courseId 
        },
        select: { id: true }
      });
      
      if (!chapter) {
        console.log(`[VIDEO_CREATE] Capítulo ${chapterId} no encontrado en el curso ${courseId}`);
        return new NextResponse("Capítulo no encontrado", { status: 404 });
      }

      // Si se marca como primario, quitar la marca a los demás
      if (body.isPrimary) {
        console.log("[VIDEO_CREATE] Actualizando videos existentes para quitar marca de primario");
        await db.chapterVideo.updateMany({
          where: { 
            chapterId,
            isPrimary: true 
          },
          data: { isPrimary: false }
        });
      }

      // Obtener el número actual de videos para establecer la posición
      const videoCount = await db.chapterVideo.count({ 
        where: { chapterId } 
      });
      
      console.log(`[VIDEO_CREATE] Creando nuevo video en posición ${body.position ?? videoCount}`);
      
      const video = await db.chapterVideo.create({
        data: {
          title: body.title.trim(),
          url: body.url.trim(),
          position: body.position ?? videoCount,
          isPrimary: body.isPrimary || false,
          chapterId: chapterId
        },
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
          isPrimary: true,
          chapterId: true,
          createdAt: true,
          updatedAt: true
        }
      });

      console.log("[VIDEO_CREATE] Video creado exitosamente:", video);
      return NextResponse.json(video, { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (dbError) {
      console.error("[VIDEO_CREATE_DB_ERROR]", dbError);
      return new NextResponse(
        JSON.stringify({ 
          message: "Error al guardar el video en la base de datos",
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error("[VIDEO_CREATE_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Error interno del servidor al procesar la solicitud",
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          stack: error.stack 
        })
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
