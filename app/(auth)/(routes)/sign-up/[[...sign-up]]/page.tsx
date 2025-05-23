
"use client";
import { SignUp } from "@clerk/nextjs"

// Este archivo debe ser un Client Component para usar Clerk y styled-jsx
export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-stretch bg-gradient-to-br from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Fondo decorativo auténtico */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.08)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      {/* Panel de autenticación a la izquierda */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32">
        <div className="w-full max-w-md bg-zinc-950/90 rounded-xl shadow-xl border border-white/10 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500"></div>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-yellow-400 mb-1">SanPablo</h1>
            <p className="text-gray-400 text-sm">Crea tu cuenta para comenzar</p>
          </div>
          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-yellow-400 font-bold text-xl mb-2",
                headerSubtitle: "text-gray-400 mb-4 text-sm",
                formButtonPrimary: "bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 py-2 mt-4 text-base",
                formFieldInput: "bg-black/80 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:border-yellow-400 focus:ring-yellow-400 text-base",
                formFieldLabel: "text-gray-300 font-medium mb-1 text-sm",
                socialButtonsBlockButton: "bg-zinc-900 text-white border border-white/10 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-base",
                socialButtonsBlockButtonText: "!text-white font-semibold text-base",
                'socialButtonsBlockButtonText__google': '!text-white',
                'socialButtonsBlockButtonText__facebook': '!text-white',
                footerAction: "text-gray-400 mt-6 text-sm",
                footerActionLink: "text-yellow-400 hover:underline text-sm",
                formFieldErrorText: "text-red-500 text-xs mt-1",
              },
              variables: {
                colorPrimary: '#FACC15',
                colorText: '#fff',
                colorBackground: '#111',
                colorInputBackground: '#18181b',
                colorInputText: '#fff',
                colorInputBorder: '#fff',
                colorDanger: '#ef4444',
              },
            }}
          />
        </div>
      </div>

      {/* Imagen decorativa a la derecha */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 bg-transparent">
        <div className="w-full max-w-xl px-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-400/20 bg-black/60 backdrop-blur-xl">
            <img
              src="/imagen-principio.jpg"
              alt="Bienvenido a SanPablo LMS"
              className="w-full h-[500px] object-cover object-center"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <h2 className="text-2xl font-bold text-yellow-400 drop-shadow mb-2">¡Bienvenido!</h2>
              <p className="text-gray-300 text-base max-w-md">Únete a la comunidad SanPablo y accede a programas educativos de calidad, clases en vivo y recursos exclusivos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}