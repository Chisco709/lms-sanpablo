import { MobileSidebar } from './mobile-sidebar';
import { NavbarRoutes } from "@/components/navbar-routes";
import { SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

export const Navbar = () => {
    return (
        <div className="p-4 border-b border-slate-700/50 h-full flex items-center bg-slate-900 shadow-sm">
            {/* Logo y mobile sidebar */}
            <div className="flex items-center">
                <MobileSidebar />
                <div className="hidden md:flex items-center space-x-2 ml-4">
                    <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                        <span className="text-slate-900 font-bold text-lg">P</span>
                    </div>
                    <span className="text-white font-bold text-xl">Platzi</span>
                </div>
            </div>
            
            {/* Barra de búsqueda central */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="¿Qué quieres aprender?"
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                </div>
            </div>
            
            {/* Elementos del usuario */}
            <div className="flex items-center space-x-4">
                <NavbarRoutes />
                <SignedOut>
                    <Button className="bg-green-400 text-slate-900 hover:bg-green-300 font-semibold" asChild>
                        <SignInButton>Iniciar Sesión</SignInButton>
                    </Button>
                </SignedOut>
            </div>
        </div>
    )
}