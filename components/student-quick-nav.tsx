"use client";

import Link from "next/link";
import { BookOpen, Compass, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    title: "Mis Cursos",
    icon: BookOpen,
    href: "/student/courses",
    color: "from-yellow-400/20 to-yellow-400/10",
    iconColor: "text-yellow-400",
    borderColor: "border-yellow-400/20 hover:border-yellow-400/40"
  },
  {
    title: "Explorar",
    icon: Compass,
    href: "/student/browse",
    color: "from-green-400/20 to-green-400/10",
    iconColor: "text-green-400",
    borderColor: "border-green-400/20 hover:border-green-400/40"
  },
  {
    title: "Progreso",
    icon: TrendingUp,
    href: "/student/progress",
    color: "from-blue-400/20 to-blue-400/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-400/20 hover:border-blue-400/40"
  },
  {
    title: "Certificados",
    icon: Trophy,
    href: "/student/achievements",
    color: "from-purple-400/20 to-purple-400/10",
    iconColor: "text-purple-400",
    borderColor: "border-purple-400/20 hover:border-purple-400/40"
  },
];

export const StudentQuickNav = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300",
              "bg-gradient-to-br border-2 backdrop-blur-sm cursor-pointer select-none",
              link.color,
              link.borderColor,
              "hover:scale-105 hover:shadow-xl"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-3xl",
              link.iconColor,
              "bg-black/20 group-hover:bg-black/30 transition-all duration-300"
            )}>
              <link.icon className="w-10 h-10" />
            </div>
            <span className="text-lg font-bold text-white text-center">
              {link.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}; 