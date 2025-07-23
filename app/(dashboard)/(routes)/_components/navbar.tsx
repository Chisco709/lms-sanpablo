// Simple Navbar placeholder
export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-green-400 via-black to-yellow-400 p-4 flex items-center justify-between shadow-lg border-b border-green-400/30">
      <div className="flex items-center gap-3">
        <img src="/logo-sanpablo.jpg" alt="San Pablo" className="h-8 w-8 rounded-full" />
        <span className="font-bold text-white text-lg tracking-wide">Instituto San Pablo</span>
      </div>
      <div className="flex gap-6">
        <a href="/student" className="text-green-400 hover:text-yellow-400 font-medium transition-colors">Modo Estudiante</a>
        <a href="/teacher/courses" className="text-yellow-400 hover:text-green-400 font-medium transition-colors">Modo Profesor</a>
      </div>
    </nav>
  );
}
