"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from './mobile-sidebar';
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const pathname = usePathname();
    const isCoursePage = pathname?.includes('/courses/') && !pathname?.includes('/teacher/courses');
    if (isCoursePage) return null;

    return (
        <div className="relative z-50">
            <div className="fixed top-0 left-0 right-0 h-16 sm:h-18 backdrop-blur-xl bg-black/90 border-b-2 border-green-400/30 shadow-[0_4px_32px_0_rgba(34,197,94,0.15)]">
                <div className="h-full px-4 sm:px-6 flex items-center justify-between">
                    {/* Lado izquierdo: logo y sidebar móvil */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <MobileSidebar />
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
                            <div className="hidden sm:flex flex-col">
                                <span className="text-white font-extrabold text-base sm:text-lg leading-none drop-shadow-lg">
                                    San Pablo
                                </span>
                            </div>
                        </Link>
                    </div>
                    {/* Lado derecho: solo perfil */}
                    <div className="flex items-center gap-2">
                        <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 border border-green-400 transition-all duration-200",
                                    userButtonPopoverCard: "bg-black border border-green-400/30 shadow-xl",
                                    userButtonPopoverActionButton: "text-black hover:text-green-700 hover:bg-green-400/10 transition-all duration-200",
                                    userButtonPopoverActionButtonText: "text-black",
                                    userButtonPopoverFooter: "bg-black border-t border-green-400/20"
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"></div>
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
            </div>
            <div className="h-16 sm:h-18"></div>
        </div>
    )
}