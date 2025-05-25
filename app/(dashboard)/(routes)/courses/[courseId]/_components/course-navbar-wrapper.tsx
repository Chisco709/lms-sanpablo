"use client";

import { Chapter, Course, UserProgress, Category } from "@prisma/client";
import { CourseNavbar } from "./course-navbar";
import { usePathname } from "next/navigation";

interface CourseNavbarWrapperProps {
  course: Course & {
    category: Category | null;
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  hasAccess: boolean;
  isFreeCoure: boolean;
}

export const CourseNavbarWrapper = ({
  course,
  progressCount,
  hasAccess,
  isFreeCoure,
}: CourseNavbarWrapperProps) => {
  const pathname = usePathname();
  
  // Obtener el capítulo actual desde la URL
  const currentChapterId = pathname?.split('/chapters/')[1];
  const currentChapterIndex = course.chapters.findIndex(chapter => chapter.id === currentChapterId);
  const currentChapterNumber = currentChapterIndex >= 0 ? currentChapterIndex + 1 : 1;

  return (
    <CourseNavbar
      course={course}
      progressCount={progressCount}
      currentChapterNumber={currentChapterNumber}
      hasAccess={hasAccess}
      isFreeCoure={isFreeCoure}
    />
  );
}; 