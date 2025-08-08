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
    
    if (!user) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const course = await db.course.findFirst({
      where: { 
        id: courseId, 
        userId: user.id
      }
    });

    if (!course) {
      return new NextResponse("Curso no encontrado", { status: 404 });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId
      }
    });

    if (!chapter) {
      return new NextResponse("Capítulo no encontrado", { status: 404 });
    }

    // 4. Validar campos requeridos
    const missingFields = [];
    if (!chapter?.title) missingFields.push("título");
    if (!chapter?.description) missingFields.push("descripción");
    
    // Check for video URLs (support both videoUrl and videoUrls)
    const videoUrls = Array.isArray(chapter.videoUrls) ? chapter.videoUrls : [];
    const hasVideoUrl = chapter.videoUrl || videoUrls.length > 0;
    
    if (!hasVideoUrl) {
        missingFields.push("al menos un video");
    }

    if (missingFields.length > 0) {
        return new NextResponse(
            `Faltan los siguientes campos: ${missingFields.join(", ")}`,
            { status: 400 }
        );
    }

    // 5. Validar formato de YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}/;
    
    // Check single video URL if it exists
    if (chapter.videoUrl && !youtubeRegex.test(chapter.videoUrl)) {
        return new NextResponse(
            "La URL del video debe ser una URL válida de YouTube (formatos aceptados: youtube.com/watch?v=ID, youtu.be/ID o youtube.com/embed/ID)",
            { status: 400 }
        );
    }
    
    // Check all videos in videoUrls array
    for (const url of videoUrls) {
        if (!youtubeRegex.test(url)) {
            return new NextResponse(
                `La siguiente URL de video no es válida: ${url}. Formatos aceptados: youtube.com/watch?v=ID, youtu.be/ID o youtube.com/embed/ID`,
                { status: 400 }
            );
        }
    }

    const publishedChapter = await db.chapter.update({
      where: { 
        id: chapterId,
        courseId: courseId
      },
      data: { 
        isPublished: true 
      }
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH]", error);
    return new NextResponse(
      "Error interno del servidor al publicar el capítulo",
      { status: 500 }
    );
  }
} 