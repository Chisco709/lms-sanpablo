"use client";

import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress, Category } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CourseSidebarClient } from "./course-sidebar-client";

interface CourseMobileSidebarProps {
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

export const CourseMobileSidebar = ({ 
  course,
  progressCount,
  hasAccess,
  isFreeCoure,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-slate-900 w-72">
        <CourseSidebarClient
          course={course}
          progressCount={progressCount}
          hasAccess={hasAccess}
          isFreeCoure={isFreeCoure}
        />
      </SheetContent>
    </Sheet>
  )
} 