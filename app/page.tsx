import { auth } from "@clerk/nextjs/server";
import LandingPage from "../components/landing-page";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  // Dashboard estilizado y creativo según la landing page
  return (
    <main className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Círculos de fondo animados */}
      <div className="pointer-events-none select-none">
        <div className="hidden md:block absolute top-0 left-0 w-80 h-80 rounded-full bg-yellow-400/10 animate-float-slow -translate-x-1/3 -translate-y-1/3 z-0"></div>
        <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-500/10 animate-float -translate-y-1/4 translate-x-1/4 z-0"></div>
        <div className="absolute top-1/2 left-1/2 w-[120vw] h-[120vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,222,0,0.04)_0%,rgba(0,0,0,0)_70%)] z-0"></div>
      </div>

      {/* Destello animado detrás del título */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 h-24 bg-gradient-to-r from-yellow-400/20 via-green-500/10 to-transparent blur-2xl opacity-60 animate-pulse z-10" />

      <div className="w-full max-w-2xl mx-auto text-center mb-12 relative z-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white relative inline-block">
          Instituto <span className="text-yellow-400">San Pablo</span>
          <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full opacity-70" />
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-gray-300 text-lg">Bienvenido a tu plataforma de aprendizaje</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl relative z-20">
        <Link href="/student" className="group">
          <div className="w-full h-36 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400/10 to-green-500/10 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:scale-105 hover:border-yellow-400/60 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] cursor-pointer relative overflow-hidden">
            {/* Icono decorativo */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-float-slow z-0" />
            <span className="text-2xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition relative z-10">Estudiante</span>
            <span className="text-green-400 text-sm font-medium group-hover:text-yellow-300 transition relative z-10">Accede a tus cursos y explora nuevos</span>
          </div>
        </Link>
        <Link href="/teacher/courses" className="group">
          <div className="w-full h-36 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/10 to-yellow-400/10 border border-green-500/30 shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-500/60 hover:shadow-[0_8px_32px_rgba(250,204,21,0.15)] cursor-pointer relative overflow-hidden">
            {/* Icono decorativo */}
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-float z-0" />
            <span className="text-2xl font-semibold text-white mb-2 group-hover:text-green-400 transition relative z-10">Soy Profesor</span>
            <span className="text-yellow-400 text-sm font-medium group-hover:text-green-300 transition relative z-10">Gestiona tus cursos y capítulos</span>
          </div>
        </Link>
      </div>

      {/* Animaciones globales movidas a globals.css */}
    </main>
  );
}
