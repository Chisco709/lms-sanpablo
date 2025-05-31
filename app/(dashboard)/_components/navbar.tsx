"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from './mobile-sidebar';
import { NavbarRoutes } from "@/components/navbar-routes";
import { SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs";
import { Search, GraduationCap, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const pathname = usePathname();
    
    // Ocultar navbar en páginas de curso
    const isCoursePage = pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses');
    
    if (isCoursePage) {
        return null;
    }

    return (
        <div className="relative z-50">
            {/* Navbar principal optimizado para móvil */}
            <div className="fixed top-0 left-0 right-0 h-16 sm:h-18 backdrop-blur-xl bg-black/90 border-b-2 border-green-400/30 shadow-[0_4px_32px_0_rgba(34,197,94,0.15)]">
                <div className="h-full px-4 sm:px-6 flex items-center justify-between">
                    
                    {/* Lado izquierdo - Mobile optimizado */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <MobileSidebar />
                        
                        {/* Logo móvil compacto */}
                        <Link href="/student" className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/95 flex items-center justify-center shadow-lg border-2 border-green-400/80 overflow-hidden">
                                <Image 
                                    src="/logo-sanpablo.jpg" 
                                    alt="Instituto San Pablo" 
                                    width={32} 
                                    height={32}
                                    className="rounded-lg object-cover"
                                    priority
                                />
                            </div>
                            
                            {/* Texto responsive */}
                            <div className="hidden sm:flex flex-col">
                                <span className="text-white font-extrabold text-base sm:text-lg leading-none drop-shadow-lg">
                                    Instituto San Pablo
                                </span>
                                <span className="text-green-400 text-xs font-bold leading-none uppercase tracking-wide">
                                    Pereira • Risaralda
                                </span>
                            </div>
                            
                            {/* Solo icono en móvil muy pequeño */}
                            <div className="sm:hidden">
                                <span className="text-green-400 font-bold text-sm">San Pablo</span>
                            </div>
                        </Link>
                    </div>

                    {/* Centro - Navegación rápida móvil */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Link 
                            href="/student" 
                            className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                                pathname === '/student' 
                                    ? 'bg-green-400/20 text-green-400 shadow-lg' 
                                    : 'text-white/70 hover:text-green-400 hover:bg-green-400/10'
                            }`}
                        >
                            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        
                        <Link 
                            href="/progress" 
                            className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                                pathname === '/progress' 
                                    ? 'bg-yellow-400/20 text-yellow-400 shadow-lg' 
                                    : 'text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10'
                            }`}
                        >
                            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                    </div>
                    
                    {/* Lado derecho - Acciones principales */}
                    <div className="flex items-center gap-2">
                        <NavbarRoutes />
                    </div>
                </div>
                
                {/* Línea de gradiente decorativa */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"></div>
                
                {/* Efecto de luz sutil */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
            </div>
            
            {/* Espaciador para el contenido */}
            <div className="h-16 sm:h-18"></div>
        </div>
    )
}