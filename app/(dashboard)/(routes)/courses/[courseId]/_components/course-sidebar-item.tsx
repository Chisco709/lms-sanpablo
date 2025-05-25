"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-300 hover:bg-slate-800/50",
        isActive && "text-slate-200 bg-slate-800/80 hover:bg-slate-800/80 hover:text-slate-200",
        isCompleted && "text-emerald-400 hover:text-emerald-300",
        isCompleted && isActive && "bg-emerald-900/20",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-400",
            isActive && "text-slate-200",
            isCompleted && "text-emerald-400"
          )}
        />
        {label}
      </div>
      <div className={cn(
        "ml-auto opacity-0 border-2 border-slate-200 h-full transition-all",
        isActive && "opacity-100",
        isCompleted && "border-emerald-400"
      )} />
    </button>
  )
} 