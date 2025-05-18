import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { videoUrl } = await req.json();

    if (!userId) return new NextResponse("No autorizado", { status: 401 });

    // Verificar propiedad del curso
    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId }
    });

    if (!ownCourse) return new NextResponse("No autorizado", { status: 401 });

    // Actualizar solo el videoUrl
    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { videoUrl }
    });

    return NextResponse.json(chapter);
    
  } catch (error) {
    console.error("[CHAPTER_VIDEO]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}