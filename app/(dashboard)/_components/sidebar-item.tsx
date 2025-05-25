"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({
    icon: Icon,
    label,
    href,
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "group relative flex items-center gap-x-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300",
                isActive 
                    ? "bg-gradient-to-r from-yellow-400/20 to-green-400/20 text-white border border-yellow-400/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            {/* Indicador activo */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-green-400 rounded-r-full"></div>
            )}

            {/* Icono con efecto */}
            <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                isActive 
                    ? "bg-gradient-to-br from-yellow-400/20 to-green-400/20" 
                    : "group-hover:bg-white/10"
            )}>
                <Icon 
                    size={18} 
                    className={cn(
                        "transition-all duration-300",
                        isActive 
                            ? "text-yellow-400" 
                            : "text-gray-400 group-hover:text-white"
                    )}
                />
                
                {/* Efecto glow en hover */}
                {!isActive && (
                    <div className="absolute inset-0 rounded-lg bg-yellow-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                )}
            </div>

            {/* Label */}
            <span className={cn(
                "text-sm transition-all duration-300",
                isActive ? "font-semibold" : "font-medium"
            )}>
                {label}
            </span>

            {/* Flecha decorativa en hover */}
            {!isActive && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                </div>
            )}
        </button>
    )
}