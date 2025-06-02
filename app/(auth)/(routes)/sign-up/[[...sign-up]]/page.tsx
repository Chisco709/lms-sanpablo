"use client";
import { SignUp } from "@clerk/nextjs"
import Image from "next/image"

// Este archivo debe ser un Client Component para usar Clerk y styled-jsx
export default function Page() {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Efectos de fondo móvil optimizados */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-yellow-400/25 rounded-full blur-[60px] sm:blur-[90px] animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-green-500/20 rounded-full blur-[80px] sm:blur-[130px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-green-400/15 rounded-full blur-[50px] sm:blur-[80px] animate-pulse" />
      </div>

      {/* DISEÑO MOBILE-FIRST */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header móvil del Instituto */}
        <div className="w-full px-4 pt-6 pb-3 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-400/80 shadow-2xl flex items-center justify-center bg-white overflow-hidden">
              <Image src="/logo-sanpablo.jpg" alt="Logo San Pablo" width={48} height={48} className="rounded-full object-cover" priority />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">Instituto</h1>
              <h2 className="text-xl sm:text-2xl font-bold text-green-400 -mt-1">San Pablo</h2>
            </div>
          </div>
          <p className="text-white/70 text-sm sm:text-base">Pereira, Risaralda • Tu futuro profesional comienza aquí</p>
        </div>

        {/* Contenedor principal responsive */}
        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Panel de registro - MÓVIL OPTIMIZADO */}
          <div className="flex-1 flex items-center justify-center px-4 py-4 lg:py-8">
            <div className="w-full max-w-md">
              
              {/* Tarjeta de registro móvil */}
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-yellow-400/30 p-5 sm:p-7 relative overflow-hidden">
                
                {/* Borde animado superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-green-400 to-yellow-500"></div>
                
                {/* Efecto de luz interna */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-green-400/5 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Encabezado */}
                  <div className="text-center mb-5 sm:mb-7">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">¡Únete a San Pablo!</h3>
                    <p className="text-yellow-400 text-sm sm:text-base font-medium">Crea tu cuenta y transforma tu futuro</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-xs sm:text-sm text-white/60">🎓 15+ años de experiencia</span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs sm:text-sm text-white/60">📜 Certificación SENA</span>
                    </div>
                  </div>

                  {/* Componente Clerk con estilos móviles */}
                  <SignUp
                    appearance={{
                      elements: {
                        card: "bg-transparent shadow-none border-none p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden", 
                        formButtonPrimary: "w-full bg-gradient-to-r from-yellow-500 via-green-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 py-3 sm:py-4 text-base sm:text-lg hover:scale-105",
                        formFieldInput: "w-full bg-black/60 border-2 border-yellow-400/30 text-white placeholder-gray-400 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-400/20 text-base sm:text-lg py-3 sm:py-4 px-4",
                        formFieldLabel: "text-yellow-400 font-semibold mb-2 text-sm sm:text-base",
                        socialButtonsBlockButton: "w-full bg-black/60 text-white border-2 border-yellow-400/30 hover:border-green-400 hover:bg-green-400/10 transition-all duration-300 text-base sm:text-lg py-3 sm:py-4 rounded-xl",
                        socialButtonsBlockButtonText: "!text-white font-semibold",
                        'socialButtonsBlockButtonText__google': '!text-white',
                        'socialButtonsBlockButtonText__facebook': '!text-white',
                        footerAction: "text-white/70 mt-6 text-sm sm:text-base text-center",
                        footerActionLink: "text-green-400 hover:text-yellow-400 font-semibold transition-colors",
                        formFieldErrorText: "text-red-400 text-xs sm:text-sm mt-2",
                        dividerLine: "bg-yellow-400/30",
                        dividerText: "text-white/60 text-sm",
                        formFieldSuccessText: "text-green-400 text-xs sm:text-sm mt-2",
                        verificationLinkStatusBox: "bg-yellow-400/10 border border-yellow-400/30 text-white rounded-xl p-3",
                        verificationLinkStatusText: "text-white/90 text-sm",
                      },
                      variables: {
                        colorPrimary: '#FACC15',
                        colorText: '#fff',
                        colorBackground: 'transparent',
                        colorInputBackground: 'rgba(0,0,0,0.6)',
                        colorInputText: '#fff',
                        colorDanger: '#EF4444',
                        spacingUnit: '1rem',
                        borderRadius: '0.75rem',
                      },
                    }}
                  />

                  {/* Ventajas del registro móvil */}
                  <div className="mt-5 sm:mt-7 space-y-3">
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 sm:p-4">
                      <h4 className="text-yellow-400 font-semibold text-sm sm:text-base mb-2">🚀 ¿Por qué elegir San Pablo?</h4>
                      <div className="space-y-2 text-xs sm:text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Certificación SENA reconocida nacionalmente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>95% de empleabilidad en nuestros egresados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Plataforma LMS moderna y fácil de usar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Profesores expertos en el sector</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen decorativa - Solo visible en desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative">
            <div className="w-full max-w-xl px-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-green-400/30">
                
                {/* Imagen principal */}
                <div className="relative h-[500px] xl:h-[600px]">
                  <Image
                    src="/registro-estudiantes.jpg"
                    alt="Nuevos estudiantes Instituto San Pablo"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 0px, 500px"
                    priority
                  />
                  
                  {/* Overlay con información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 w-full p-6 xl:p-8">
                      <h3 className="text-2xl xl:text-3xl font-bold text-green-400 mb-3">¡Forma parte de la familia San Pablo!</h3>
                      <p className="text-white/90 text-base xl:text-lg leading-relaxed max-w-md">
                        Más de 500 estudiantes han cumplido sus sueños profesionales. Ahora es tu turno de brillar.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-yellow-400 font-bold text-lg xl:text-xl block">15+</span>
                          <span className="text-white/80 text-sm xl:text-base">Años formando</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-green-400 font-bold text-lg xl:text-xl block">500+</span>
                          <span className="text-white/80 text-sm xl:text-base">Egresados exitosos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer móvil con programas */}
        <div className="lg:hidden w-full px-4 py-5 text-center">
          <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-yellow-400/20 p-4">
            <h4 className="text-yellow-400 font-semibold text-sm sm:text-base mb-3">🎓 Programas Disponibles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-green-400/10 rounded-lg p-3 border border-green-400/20">
                <span className="text-green-400 font-semibold text-sm">👶 Primera Infancia</span>
                <p className="text-white/70 text-xs mt-1">Técnico SENA certificado</p>
              </div>
              <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20">
                <span className="text-yellow-400 font-semibold text-sm">🌍 Inglés Certificado</span>
                <p className="text-white/70 text-xs mt-1">Nivel internacional</p>
              </div>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-4">
              🏆 Instituto San Pablo • Pereira, Risaralda • Excelencia educativa desde 2008
            </p>
          </div>
        </div>
      </div>

      {/* Animaciones CSS embebidas */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
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