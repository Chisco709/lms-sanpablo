import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Redirige a la sección principal de profesores
  redirect("/teacher/courses");
  return null;
}
