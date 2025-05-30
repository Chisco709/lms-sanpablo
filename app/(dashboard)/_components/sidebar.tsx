import { SidebarRoutes } from "./sidebar-routes"
import Image from "next/image"

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-black bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900/40 via-black to-black border-r border-green-400/30 shadow-[0_0_32px_0_rgba(34,197,94,0.10)]" data-tutorial="sidebar">
            {/* Logo Section */}
            <div className="p-6 border-b border-yellow-400/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center">
                        <span className="inline-block w-12 h-12 rounded-full bg-white shadow-lg border-2 border-green-400 relative">
                            <span className="absolute inset-0 rounded-full border-2 border-yellow-400 pointer-events-none"></span>
                            <Image 
                                src="/logo-sanpablo.jpg" 
                                alt="Instituto San Pablo" 
                                width={32} 
                                height={32}
                                className="rounded-full object-cover w-10 h-10 mx-auto my-auto"
                            />
                        </span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">Instituto San Pablo</h1>
                        <p className="text-green-300 text-xs font-bold tracking-wide uppercase">Pereira, Colombia</p>
                    </div>
                </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <SidebarRoutes />
                </div>
            </div>

            {/* Bottom Section - Minimalist */}
            <div className="p-6 border-t border-yellow-400/30">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/20 via-black/80 to-green-400/20 p-4 border-2 border-yellow-400/40 shadow-[0_0_32px_0_rgba(250,204,21,0.10)]">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-white font-bold mb-1 text-lg drop-shadow">Mejora tu plan</h3>
                        <p className="text-yellow-200 text-sm mb-3 font-semibold">Accede a todos los cursos</p>
                        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 text-black font-bold text-base shadow-lg hover:shadow-yellow-400/40 hover:scale-105 transition-all duration-300">
                            Ver planes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}