import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const user = await currentUser();
    const { isCompleted } = await req.json();
    const { courseId, chapterId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ NOTIFICAR AL PROFESOR CUANDO ESTUDIANTE COMPLETE UN CAPÍTULO
    if (isCompleted) {
      // Obtener información del capítulo y curso
      const chapter = await db.chapter.findUnique({
        where: { id: chapterId },
        include: {
          course: {
            include: {
              chapters: {
                where: { isPublished: true },
                include: {
                  userProgress: {
                    where: { userId: user.id }
                  }
                }
              }
            }
          }
        }
      });

      if (chapter) {
        // Verificar si es el último capítulo del curso
        const completedChapters = chapter.course.chapters.filter(ch => 
          ch.userProgress.some(up => up.isCompleted)
        ).length + 1; // +1 por el capítulo actual

        const isLastChapter = completedChapters === chapter.course.chapters.length;

        // Crear notificación para el profesor
        await db.notification.create({
          data: {
            userId: chapter.course.userId, // El profesor del curso
            title: isLastChapter 
              ? `🎉 ¡Estudiante completó todo el curso!`
              : `✅ Estudiante completó una clase`,
            message: isLastChapter
              ? `Un estudiante ha completado TODO el curso "${chapter.course.title}". ¡Felicítalo!`
              : `Un estudiante completó la clase "${chapter.title}" del curso "${chapter.course.title}".`,
            type: isLastChapter ? "course_completion" : "chapter_completion",
            relatedCourseId: courseId,
            relatedChapterId: chapterId
          }
        });
      }
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: chapterId,
        }
      },
      update: {
        isCompleted
      },
      create: {
        userId: user.id,
        chapterId: chapterId,
        isCompleted,
      }
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 