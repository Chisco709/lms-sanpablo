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

    // Actualizar capítulo
    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId
      },
      data: {
        // Solo actualiza pdfUrl si se envía
        pdfUrl: typeof values.pdfUrl === "string" && values.pdfUrl.trim() !== "" ? values.pdfUrl : undefined,
        // Mantener los demás campos si se envían
        title: values.title,
        description: values.description,
        videoUrl: values.videoUrl,
        googleFormUrl: values.googleFormUrl,
        isFree: values.isFree,
      }
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