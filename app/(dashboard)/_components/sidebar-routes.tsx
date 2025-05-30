"use client";

import { Layout, GraduationCap, BookOpen, Trophy, User, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { useUser } from "@clerk/nextjs";

const studentRoutes = [
  {
    icon: Layout,
    label: "Inicio",
    href: "/",
  },
  {
    icon: GraduationCap,
    label: "Mis Rutas",
    href: "/student",
  },
  {
    icon: User,
    label: "Mi progreso",
    href: "/progress",
  },
  {
    icon: BarChart3,
    label: "Mis certificados",
    href: "/certificates",
  },
];

const teacherRoutes = [
  {
    icon: BookOpen,
    label: "Mis Cursos",
    href: "/teacher/courses",
  },
  {
    icon: Trophy,
    label: "Estadísticas",
    href: "/teacher/analytics",
  },
];

const buttonClass = "flex items-center gap-2 px-3 py-1 border border-green-400 text-green-500 hover:bg-green-100/10 hover:text-green-700 rounded-md transition-colors text-sm font-medium";

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isChisco = user?.primaryEmailAddress?.emailAddress === "chiscojjcm@gmail.com";
  const routes = isTeacherPage && isChisco ? teacherRoutes : studentRoutes;

  return (
    <div className="flex flex-col w-full space-y-2">
      {routes.map((route) => {
        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            className={buttonClass}
            iconClassName="text-green-500"
          />
        );
      })}
    </div>
  );
};