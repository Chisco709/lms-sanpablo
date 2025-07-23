// Simple Sidebar placeholder
export default function Sidebar() {
  return (
    <aside className="bg-slate-800/90 p-6 h-full min-h-screen text-white flex flex-col gap-6 border-r border-green-400/20 shadow-lg">
      <div className="mb-6">
        <span className="font-bold text-green-400 text-xl">Panel</span>
      </div>
      <nav className="flex flex-col gap-4">
        <a href="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</a>
        <a href="/student" className="hover:text-yellow-400 transition-colors">Estudiante</a>
        <a href="/teacher/courses" className="hover:text-green-400 transition-colors">Profesor</a>
        <a href="/search" className="hover:text-yellow-400 transition-colors">Buscar Cursos</a>
      </nav>
      <div className="mt-auto text-xs text-slate-400">© 2025 San Pablo Academy</div>
    </aside>
  );
}
