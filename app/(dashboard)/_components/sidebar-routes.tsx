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
  {
    icon: User,
    label: "Estudiantes",
    href: "/teacher/students",
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
    <div className="flex flex-col w-full gap-2">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm border border-transparent hover:border-green-400/40 hover:bg-green-400/10 focus:outline-none focus:ring-2 focus:ring-green-400/40"
          iconClassName="text-green-400"
        />
      ))}
    </div>
  );
};