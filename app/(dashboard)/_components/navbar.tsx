"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from './mobile-sidebar';
import { NavbarRoutes } from "@/components/navbar-routes";
import { SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

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
            <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-[#0F172A]/80 border-b border-white/5">
                <div className="h-full px-4 md:px-6 flex items-center justify-between">
                    {/* Lado izquierdo */}
                    <div className="flex items-center gap-4">
                        <MobileSidebar />
                        
                        {/* Logo minimalista */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center">
                                <span className="text-black font-bold text-lg">S</span>
                            </div>
                            <span className="text-white font-semibold text-lg">SanPablo</span>
                        </div>
                    </div>

                    {/* Lado derecho */}
                    <div className="flex items-center gap-4">
                        <NavbarRoutes />
                    </div>
                </div>

                {/* Línea de gradiente decorativa */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
            </div>
            
            {/* Espaciador para el contenido */}
            <div className="h-16"></div>
        </div>
    )
}