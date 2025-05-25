"use client";

import { Layout, GraduationCap, BookOpen, Trophy, User, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

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
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const routes = isTeacherPage ? teacherRoutes : studentRoutes;

  return (
    <div className="flex flex-col w-full space-y-2">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};