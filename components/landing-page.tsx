// components/landing-page.tsx

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full px-6 py-12 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <img src="/logo.svg" alt="LMS San Pablo" className="w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-900">Bienvenido a LMS San Pablo</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Plataforma moderna para la gestión de cursos, recursos y aprendizaje en línea.
        </p>
        <a
          href="/sign-in"
          className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-800 transition"
        >
          Iniciar sesión
        </a>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">&copy; {new Date().getFullYear()} LMS San Pablo</footer>
    </main>
  );
}
