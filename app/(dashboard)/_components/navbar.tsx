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
            <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-black/90 border-b-2 border-green-400/30 shadow-[0_4px_32px_0_rgba(34,197,94,0.15)]">
                <div className="h-full px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/student" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg border-2 border-green-400 overflow-hidden">
                            <Image 
                                src="/logo-sanpablo.jpg" 
                                alt="Instituto San Pablo" 
                                width={32} 
                                height={32}
                                className="rounded-lg object-cover"
                                priority
                            />
                        </div>
                        <span className="text-white font-extrabold text-base leading-none drop-shadow-lg hidden sm:block">San Pablo</span>
                    </Link>
                    {/* Navegación rápida */}
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/student" 
                            className={`p-2 rounded-lg transition-all ${pathname === '/student' ? 'bg-green-400/20 text-green-400 shadow' : 'text-white/70 hover:text-green-400 hover:bg-green-400/10'}`}
                        >
                            <Home className="h-5 w-5" />
                        </Link>
                        <Link 
                            href="/progress" 
                            className={`p-2 rounded-lg transition-all ${pathname === '/progress' ? 'bg-yellow-400/20 text-yellow-400 shadow' : 'text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
                        >
                            <GraduationCap className="h-5 w-5" />
                        </Link>
                    </div>
                    {/* Acciones principales */}
                    <div className="flex items-center gap-2">
                        <NavbarRoutes />
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    )
}