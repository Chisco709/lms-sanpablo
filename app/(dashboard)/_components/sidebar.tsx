import { SidebarRoutes } from "./sidebar-routes"
import Image from "next/image"
import { GraduationCap, MapPin, Phone } from "lucide-react"

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-black bg-gradient-to-b from-green-900/20 via-black to-black border-r-2 border-green-400/30 shadow-[4px_0_32px_0_rgba(34,197,94,0.15)]">
            {/* Header compacto */}
            <div className="p-3 sm:p-4 border-b-2 border-yellow-400/30 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border-2 border-green-400 overflow-hidden flex items-center justify-center">
                    <Image 
                        src="/logo-sanpablo.jpg" 
                        alt="Instituto San Pablo" 
                        width={48} 
                        height={48}
                        className="rounded-full object-cover w-full h-full"
                        priority
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-white font-bold text-sm sm:text-base leading-tight">San Pablo</h1>
                    <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <p className="text-green-400 text-xs font-semibold truncate">Pereira</p>
                    </div>
                </div>
            </div>
            {/* Navegación */}
            <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-2">
                <SidebarRoutes />
            </div>
            {/* Contacto compacto */}
            <div className="p-3 sm:p-4 border-t-2 border-yellow-400/30">
                <div className="bg-black/60 rounded-xl border border-green-400/30 p-2.5 sm:p-3 mb-2 text-xs text-white/80">
                    <div className="flex items-center gap-2 mb-1 text-green-400 font-semibold">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                        <span className="text-xs">Contáctanos</span>
                    </div>
                    <div className="space-y-0.5 text-xs">
                        <p>📞 (606) 335-2847</p>
                        <p>📱 +57 314 567-8910</p>
                        <p className="truncate">📧 info@sanpablo.edu.co</p>
                    </div>
                </div>
                <div className="mt-2">
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 text-black font-bold text-xs shadow hover:scale-105 transition-all border border-green-400/40">
                        Solicitar Información
                    </button>
                </div>
            </div>
        </div>
    )
}