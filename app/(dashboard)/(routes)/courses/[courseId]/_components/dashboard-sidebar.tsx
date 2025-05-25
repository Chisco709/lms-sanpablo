"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavbarRoutes } from "@/components/navbar-routes";

export const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
        aria-label="Abrir menú principal"
      >
        <Menu className="h-5 w-5 text-slate-400" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer del navbar principal */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-slate-950 border-r border-slate-800/30 z-[101]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header del drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
            <span className="text-white font-semibold text-lg">SanPablo</span>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido del drawer */}
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <NavbarRoutes />
          </div>
        </div>
      </div>
    </>
  );
}; 