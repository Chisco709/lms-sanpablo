import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseSidebarClient } from "./course-sidebar-client";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
    pensumTopics?: Array<{
      id: string;
      title: string;
      chapters?: (Chapter & { userProgress: UserProgress[] | null })[];
    }>;
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  const completedChapters = course.chapters.filter(
    (chapter) =>
      chapter.userProgress &&
      chapter.userProgress.length > 0 &&
      chapter.userProgress[0]?.isCompleted
  ).length;

  const totalDuration = course.chapters.length * 5; // 5 min por capítulo

  return (
    <CourseSidebarClient
      course={course}
      progressCount={progressCount}
      purchase={purchase}
      completedChapters={completedChapters}
      totalDuration={totalDuration}
    />
  );
};