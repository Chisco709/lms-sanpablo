import { SidebarRoutes } from "./sidebar-routes"
import Image from "next/image"
import { GraduationCap, MapPin, Phone } from "lucide-react"

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-black bg-gradient-to-b from-green-900/20 via-black to-black border-r-2 border-green-400/30 shadow-[4px_0_32px_0_rgba(34,197,94,0.15)]">
            
            {/* Header Section - Mobile Optimizado */}
            <div className="p-4 sm:p-6 border-b-2 border-yellow-400/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border-2 border-green-400 relative overflow-hidden">
                            <div className="absolute inset-0 rounded-full border-2 border-yellow-400/60 pointer-events-none"></div>
                            <Image 
                                src="/logo-sanpablo.jpg" 
                                alt="Instituto San Pablo" 
                                width={48} 
                                height={48}
                                className="rounded-full object-cover w-full h-full"
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-white font-bold text-base sm:text-lg leading-tight">Instituto San Pablo</h1>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-green-400" />
                            <p className="text-green-400 text-xs font-semibold">Pereira, Risaralda</p>
                        </div>
                    </div>
                </div>
                
                {/* Stats rápidas */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-green-400/10 rounded-lg p-2 text-center border border-green-400/30">
                        <div className="text-green-400 font-bold text-sm">15+</div>
                        <div className="text-white/60 text-xs">Años</div>
                    </div>
                    <div className="bg-yellow-400/10 rounded-lg p-2 text-center border border-yellow-400/30">
                        <div className="text-yellow-400 font-bold text-sm">500+</div>
                        <div className="text-white/60 text-xs">Egresados</div>
                    </div>
                    <div className="bg-green-400/10 rounded-lg p-2 text-center border border-green-400/30">
                        <div className="text-green-400 font-bold text-sm">95%</div>
                        <div className="text-white/60 text-xs">Empleo</div>
                    </div>
                </div>
            </div>
            
            {/* Navegación - Mobile Optimizada */}
            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                    <div className="mb-4">
                        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-green-400" />
                            Navegación
                        </h2>
                        <SidebarRoutes />
                    </div>
                </div>
            </div>

            {/* Información de contacto - Mobile */}
            <div className="p-4 border-t-2 border-yellow-400/30">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-green-400/30 p-3 mb-3">
                    <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contáctanos
                    </h3>
                    <div className="space-y-1 text-xs">
                        <p className="text-white/80">📞 (606) 335-2847</p>
                        <p className="text-white/80">📱 +57 314 567-8910</p>
                        <p className="text-white/80">📧 info@sanpablo.edu.co</p>
                    </div>
                </div>
                
                {/* CTA Section - Mobile Optimizado */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400/10 via-black/80 to-green-400/10 p-4 border-2 border-yellow-400/40">
                    {/* Efectos de fondo */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10 text-center">
                        <h3 className="text-white font-bold text-base mb-1">¡Inscríbete ahora!</h3>
                        <p className="text-yellow-400 text-sm mb-3 font-medium">Cupos limitados disponibles</p>
                        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 text-black font-bold text-sm shadow-lg hover:shadow-green-400/25 hover:scale-105 transition-all duration-300 border border-green-400/40">
                            Solicitar Información
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}