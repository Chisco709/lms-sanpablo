import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CourseLayoutClient } from "./_components/course-layout-client";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  // Calcular datos de acceso
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  });

  const isFreeCoure = !course.price || course.price === 0;
  const hasAccess = !!purchase || isFreeCoure;

  // Calcular capítulos completados
  const completedChapters = course.chapters.filter(chapter => 
    chapter.userProgress && 
    chapter.userProgress.length > 0 && 
    chapter.userProgress[0]?.isCompleted
  ).length;

  return (
    <CourseLayoutClient
      course={course}
      progressCount={progressCount}
      completedChapters={completedChapters}
      hasAccess={hasAccess}
      courseId={courseId}
    >
      {children}
    </CourseLayoutClient>
  );
};

export default CourseLayout; 