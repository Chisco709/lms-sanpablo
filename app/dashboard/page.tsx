import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Redirige a la sección principal real del dashboard
  redirect("/teacher/courses");
  return null;
}
