"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from './mobile-sidebar';
import { NavbarRoutes } from "@/components/navbar-routes";
import { SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
    const pathname = usePathname();
    
    // Ocultar navbar en páginas de curso
    const isCoursePage = pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses');
    
    if (isCoursePage) {
        return null;
    }

    return (
        <div className="relative z-50">
            {/* Navbar principal con glassmorphism */}
            <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-gradient-to-r from-black via-green-950/80 to-black border-b-2 border-yellow-400/30 shadow-[0_2px_24px_0_rgba(250,204,21,0.10)]">
                <div className="h-full px-4 md:px-6 flex items-center justify-between">
                    {/* Lado izquierdo */}
                    <div className="flex items-center gap-4">
                        <MobileSidebar />
                        {/* Logo del Instituto San Pablo */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-lg border-2 border-green-400/40">
                                <Image 
                                    src="/instituto-sanpablo-logo.svg" 
                                    alt="Instituto San Pablo" 
                                    width={24} 
                                    height={24}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-extrabold text-lg leading-none drop-shadow">Instituto San Pablo</span>
                                <span className="text-green-300 text-xs font-bold leading-none uppercase tracking-wide">Pereira, Colombia</span>
                            </div>
                        </div>
                    </div>
                    {/* Lado derecho */}
                    <div className="flex items-center gap-4">
                        <NavbarRoutes />
                    </div>
                </div>
                {/* Línea de gradiente decorativa */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/20 via-yellow-400/40 to-green-400/20"></div>
            </div>
            {/* Espaciador para el contenido */}
            <div className="h-16"></div>
        </div>
    )
}