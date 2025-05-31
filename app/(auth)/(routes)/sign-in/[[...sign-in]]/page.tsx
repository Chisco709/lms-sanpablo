"use client";
import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Efectos de fondo móvil optimizados */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-yellow-400/20 rounded-full blur-[60px] sm:blur-[80px] animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-green-500/15 rounded-full blur-[80px] sm:blur-[120px] animate-float" />
        <div className="absolute top-1/2 left-1/4 w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] bg-green-400/10 rounded-full blur-[50px] sm:blur-[70px] animate-pulse" />
      </div>

      {/* DISEÑO MOBILE-FIRST */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header móvil del Instituto */}
        <div className="w-full px-4 pt-8 pb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-green-400/80 shadow-2xl flex items-center justify-center bg-white overflow-hidden">
              <Image src="/logo-sanpablo.jpg" alt="Logo San Pablo" width={48} height={48} className="rounded-full object-cover" priority />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-green-400">Instituto</h1>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 -mt-1">San Pablo</h2>
            </div>
          </div>
          <p className="text-white/70 text-sm sm:text-base">Pereira, Risaralda • Formación técnica desde 2008</p>
        </div>

        {/* Contenedor principal responsive */}
        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Panel de autenticación - MÓVIL OPTIMIZADO */}
          <div className="flex-1 flex items-center justify-center px-4 py-6 lg:py-12">
            <div className="w-full max-w-md">
              
              {/* Tarjeta de login móvil */}
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-green-400/30 p-6 sm:p-8 relative overflow-hidden">
                
                {/* Borde animado superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500"></div>
                
                {/* Efecto de luz interna */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-yellow-400/5 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Encabezado */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">¡Bienvenido!</h3>
                    <p className="text-green-400 text-sm sm:text-base font-medium">Accede a tu plataforma educativa</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-xs sm:text-sm text-white/60">📚 Técnico en Primera Infancia</span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs sm:text-sm text-white/60">🌍 Inglés Certificado</span>
                    </div>
                  </div>

                  {/* Componente Clerk con estilos móviles */}
                  <SignIn
                    appearance={{
                      elements: {
                        card: "bg-transparent shadow-none border-none p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden", 
                        formButtonPrimary: "w-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 py-3 sm:py-4 text-base sm:text-lg hover:scale-105",
                        formFieldInput: "w-full bg-black/60 border-2 border-green-400/30 text-white placeholder-gray-400 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-base sm:text-lg py-3 sm:py-4 px-4",
                        formFieldLabel: "text-green-400 font-semibold mb-2 text-sm sm:text-base",
                        socialButtonsBlockButton: "w-full bg-black/60 text-white border-2 border-green-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 text-base sm:text-lg py-3 sm:py-4 rounded-xl",
                        socialButtonsBlockButtonText: "!text-white font-semibold",
                        'socialButtonsBlockButtonText__google': '!text-white',
                        'socialButtonsBlockButtonText__facebook': '!text-white',
                        footerAction: "text-white/70 mt-6 text-sm sm:text-base text-center",
                        footerActionLink: "text-yellow-400 hover:text-green-400 font-semibold transition-colors",
                        formFieldErrorText: "text-red-400 text-xs sm:text-sm mt-2",
                        dividerLine: "bg-green-400/30",
                        dividerText: "text-white/60 text-sm",
                        formFieldSuccessText: "text-green-400 text-xs sm:text-sm mt-2",
                      },
                      variables: {
                        colorPrimary: '#22C55E',
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

                  {/* Footer motivacional móvil */}
                  <div className="mt-6 sm:mt-8 text-center">
                    <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-3 sm:p-4">
                      <p className="text-white/80 text-xs sm:text-sm">
                        🎯 <span className="font-semibold text-green-400">95% empleabilidad</span> • 
                        🏆 <span className="font-semibold text-yellow-400">500+ egresados</span> • 
                        📜 <span className="font-semibold text-green-400">Certificación SENA</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen decorativa - Solo visible en desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative">
            <div className="w-full max-w-xl px-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400/30">
                
                {/* Imagen principal */}
                <div className="relative h-[500px] xl:h-[600px]">
                  <Image
                    src="/imagen-principio.jpg"
                    alt="Estudiantes Instituto San Pablo"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 0px, 500px"
                    priority
                  />
                  
                  {/* Overlay con información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 w-full p-6 xl:p-8">
                      <h3 className="text-2xl xl:text-3xl font-bold text-yellow-400 mb-3">¡Tu futuro comienza aquí!</h3>
                      <p className="text-white/90 text-base xl:text-lg leading-relaxed max-w-md">
                        Únete a más de 500 egresados exitosos. Programas técnicos certificados por el SENA en Pereira, Risaralda.
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm xl:text-base">🎓</span>
                          <span className="text-white/80 text-sm xl:text-base">Primera Infancia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm xl:text-base">🌍</span>
                          <span className="text-white/80 text-sm xl:text-base">Inglés Certificado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer móvil */}
        <div className="lg:hidden w-full px-4 py-6 text-center">
          <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-green-400/20 p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-green-400 font-bold text-lg sm:text-xl">15+</span>
                <p className="text-white/70 text-xs sm:text-sm">Años</p>
              </div>
              <div>
                <span className="text-yellow-400 font-bold text-lg sm:text-xl">500+</span>
                <p className="text-white/70 text-xs sm:text-sm">Graduados</p>
              </div>
              <div>
                <span className="text-green-400 font-bold text-lg sm:text-xl">95%</span>
                <p className="text-white/70 text-xs sm:text-sm">Empleabilidad</p>
              </div>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-3">
              Instituto San Pablo • Pereira, Risaralda • Certificación SENA
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