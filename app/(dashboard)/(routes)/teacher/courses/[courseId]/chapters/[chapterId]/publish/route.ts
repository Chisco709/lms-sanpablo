import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = await params;
    
    // 1. Validación de autenticación
    if (!user) {
      return new NextResponse("Acceso no autorizado", { status: 401 });
    }

    // 2. Verificar propiedad del curso
    const course = await db.course.findFirst({
      where: { 
        id: courseId, 
        userId: user.id
      },
      select: { id: true }
    });

    if (!course) {
      return new NextResponse("Curso no encontrado", { status: 404 });
    }

    // 3. Obtener el capítulo con validación de ownership
    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
        course: { userId: user.id }
      }
    });

    // 4. Validar campos requeridos
    if (
      !chapter?.title || 
      !chapter?.description || 
      !chapter.videoUrl // <-- Aquí estaba el error TS2345
    ) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    // 5. Validar formato de YouTube (solo si videoUrl existe)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    if (!youtubeRegex.test(chapter.videoUrl)) {
      return new NextResponse("URL de YouTube inválida", { status: 400 });
    }

    // 6. Actualizar publicación
    const publishedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: { isPublished: true },
      select: { isPublished: true }
    });

    return NextResponse.json(publishedChapter, { status: 200 });

  } catch (error) {
    // 7. Manejo seguro de errores TS18046
    console.error("[CHAPTER_PUBLISH]", error instanceof Error ? error.message : "Error desconocido");
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}