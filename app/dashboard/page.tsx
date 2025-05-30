import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 overflow-hidden font-sans antialiased">
      {/* Fondo global con luces */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-15%] top-[-15%] w-[500px] h-[500px] bg-green-500/40 rounded-full blur-[120px] opacity-80" />
        <div className="absolute right-[-15%] bottom-[-15%] w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-[140px] opacity-80" />
      </div>
      {/* Contenido principal */}
      <div className="w-full max-w-2xl mx-auto text-center mb-12 relative z-20 animate-fadein-slideup">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-green-400/80 shadow-2xl flex items-center justify-center bg-white overflow-hidden">
            <Image src="/logo-sanpablo.jpg" alt="Logo" width={72} height={72} className="rounded-full object-cover" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white relative inline-block">
            Bienvenido al <span className="text-yellow-400">Dashboard</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto mb-2 rounded-full"></div>
          <p className="text-gray-300 text-lg max-w-xl">Accede a tus cursos, gestiona tu perfil y explora todo lo que el <span className="text-green-400 font-semibold">Instituto San Pablo</span> tiene para ti.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-2xl mx-auto mt-8">
          <Link href="/student" className="group">
            <div className="w-full h-36 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400/10 to-green-500/10 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:scale-105 hover:border-yellow-400/60 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] cursor-pointer relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-float-slow z-0" />
              <span className="text-2xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition relative z-10">Estudiante</span>
              <span className="text-green-400 text-sm font-medium group-hover:text-yellow-300 transition relative z-10">Accede a tus cursos y explora nuevos</span>
            </div>
          </Link>
          <Link href="/teacher/courses" className="group">
            <div className="w-full h-36 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/10 to-yellow-400/10 border border-green-500/30 shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-500/60 hover:shadow-[0_8px_32px_rgba(250,204,21,0.15)] cursor-pointer relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-float z-0" />
              <span className="text-2xl font-semibold text-white mb-2 group-hover:text-green-400 transition relative z-10">Soy Profesor</span>
              <span className="text-yellow-400 text-sm font-medium group-hover:text-green-300 transition relative z-10">Gestiona tus cursos y capítulos</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
