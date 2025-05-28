import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"
import Image from "next/image"

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-[#0F172A] border-r border-white/5" data-tutorial="sidebar">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-yellow-400/20">
                        <Image 
                            src="/logo-sanpablo.jpg"
                            alt="Instituto San Pablo"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl">SanPablo</h1>
                        <p className="text-gray-500 text-xs">Plataforma Educativa</p>
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
            <div className="p-6 border-t border-white/5">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/10 to-green-400/10 p-4 border border-white/5">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-green-400/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-white font-semibold mb-1">Mejora tu plan</h3>
                        <p className="text-gray-400 text-sm mb-3">Accede a todos los cursos</p>
                        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-green-400 text-black font-medium text-sm hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                            Ver planes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}