import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        // Eliminadas todas las validaciones de campos (solo necesitamos despublicar)
        if (!chapter) {
            return new NextResponse("Capítulo no encontrado", { status: 404 });
        }

        // Despublicar el capítulo
        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false // Cambio clave aquí
            }
        });

        return NextResponse.json(unpublishedChapter);

    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error); // Log actualizado
        return new NextResponse("Internal error", { status: 500 });
    }
}