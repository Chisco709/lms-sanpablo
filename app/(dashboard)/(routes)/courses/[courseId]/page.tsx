import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { CoursePageClient } from "./_components/course-page-client";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
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
      }
    }
  });

  if (!course) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  });

  const progressCount = await getProgress(userId, course.id);
  const isFreeCoure = !course.price || course.price === 0;
  const hasAccess = purchase || isFreeCoure;

  // Si no hay capítulos, redirigir al dashboard
  if (course.chapters.length === 0) {
    return redirect("/student");
  }

  const completedChapters = course.chapters.filter(ch => ch.userProgress?.[0]?.isCompleted).length;

  return (
    <CoursePageClient 
      course={course}
      progressCount={progressCount}
      completedChapters={completedChapters}
      hasAccess={hasAccess}
      isFreeCoure={isFreeCoure}
      courseId={courseId}
    />
  );
}

export default CourseIdPage;