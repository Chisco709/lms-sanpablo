/**
 * Página del Estudiante - DISEÑO MOBILE-FIRST OPTIMIZADO
 * Instituto San Pablo - Pereira, Risaralda
 */

import { StudentQuickNav } from "@/components/student-quick-nav";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const user = await currentUser();
  if (!user) return redirect("/");

  return (
    <div className="relative min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-green-500/30 rounded-full blur-[60px] sm:blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute right-[-10%] bottom-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/20 rounded-full blur-[80px] sm:blur-[120px] opacity-60" />
        <div className="absolute top-1/2 left-1/3 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-green-400/15 rounded-full blur-[50px] sm:blur-[90px] opacity-40" />
      </div>
      {/* Accesos rápidos antibobos */}
      <div className="relative z-10 w-full max-w-2xl px-2 sm:px-0">
        <StudentQuickNav />
      </div>
    </div>
  );
};

export default StudentPage; 