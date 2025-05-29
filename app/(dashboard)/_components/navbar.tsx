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
            <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-[#0F172A]/80 border-b border-white/5">
                <div className="h-full px-4 md:px-6 flex items-center justify-between">
                    {/* Lado izquierdo */}
                    <div className="flex items-center gap-4">
                        <MobileSidebar />
                        
                        {/* Logo del Instituto San Pablo */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shadow-lg border border-white/10">
                                <Image 
                                    src="/instituto-sanpablo-logo.svg" 
                                    alt="Instituto San Pablo" 
                                    width={24} 
                                    height={24}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-lg leading-none">Instituto San Pablo</span>
                                <span className="text-yellow-400 text-xs font-medium leading-none">Pereira, Colombia</span>
                            </div>
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