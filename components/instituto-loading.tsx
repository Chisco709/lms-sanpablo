"use client"

import Image from "next/image"

interface InstitutoLoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export const InstitutoLoading = ({ 
  message = "Cargando...", 
  size = "md" 
}: InstitutoLoadingProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        {/* Logo del Instituto San Pablo con animación */}
        <div className={`${sizeClasses[size]} bg-white/10 rounded-full flex items-center justify-center border border-yellow-400/30 animate-pulse`}>
          <Image
            src="/instituto-sanpablo-logo.svg"
            alt="Instituto San Pablo"
            width={size === "sm" ? 20 : size === "md" ? 32 : 44}
            height={size === "sm" ? 20 : size === "md" ? 32 : 44}
            className="animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>
        
        {/* Anillo de carga */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin`}></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className={`${textSizeClasses[size]} text-white font-medium`}>
          {message}
        </p>
        <p className="text-xs text-yellow-400">Instituto San Pablo - Pereira, Colombia</p>
      </div>
    </div>
  )
} 