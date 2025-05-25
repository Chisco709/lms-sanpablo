"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps { 
    icon: LucideIcon;
    label: string;
    href: string;
};

export const SidebarItem = ({
    icon: Icon,
    label,
    href,
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    
    const isActive = ( pathname === "/" && href === "/") || 
    pathname === href || pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                    ? "text-white bg-green-400/10 border-l-4 border-green-400" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
        >
            <div className="flex items-center space-x-3">
                <Icon 
                    size={20} 
                    className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-green-400" : "text-slate-400"
                    )} 
                />
                <span className="font-medium">
                    {label}
                </span>
            </div>
        </button>
    )
}