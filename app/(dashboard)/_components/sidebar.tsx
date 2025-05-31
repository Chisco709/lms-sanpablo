import { SidebarRoutes } from "./sidebar-routes"
import Image from "next/image"

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-black bg-gradient-to-b from-green-900/20 via-black to-black border-r-2 border-green-400/30 shadow-[4px_0_32px_0_rgba(34,197,94,0.15)]">
            {/* Header compacto */}
            <div className="p-4 sm:p-6 border-b-2 border-yellow-400/30 flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border-2 border-green-400 overflow-hidden flex items-center justify-center">
                    <Image 
                        src="/logo-sanpablo.jpg" 
                        alt="Instituto San Pablo" 
                        width={48} 
                        height={48}
                        className="rounded-full object-cover w-full h-full"
                        priority
                    />
                </div>
                <h1 className="text-white font-bold text-base sm:text-lg leading-tight">San Pablo</h1>
            </div>
            {/* Navegación principal */}
            <div className="flex-1 overflow-y-auto py-6 px-2">
                <SidebarRoutes />
            </div>
        </div>
    )
}