import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Obtener todos los cursos publicados con sus categorías, capítulos y progreso
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
      purchases: {
        where: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Formatear los cursos con información adicional
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const publishedChapters = course.chapters.filter(
        (chapter) => chapter.id
      );

      // Calcular el progreso si el usuario ha comprado el curso
      let progressPercentage = null;
      if (course.purchases.length > 0) {
        const validCompletedChapters = await db.userProgress.count({
          where: {
            userId,
            chapterId: {
              in: publishedChapters.map((chapter) => chapter.id),
            },
            isCompleted: true,
          },
        });

        progressPercentage = publishedChapters.length > 0
          ? (validCompletedChapters / publishedChapters.length) * 100
          : 0;
      }

      return {
        ...course,
        chaptersLength: publishedChapters.length,
        progress: progressPercentage,
        isPurchased: course.purchases.length > 0,
      };
    })
  );

  return NextResponse.json(coursesWithProgress);
} 