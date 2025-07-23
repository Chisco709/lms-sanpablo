"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DocumentVerification } from "@/components/document-verification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Lock } from "lucide-react";
import toast from "react-hot-toast";

const VerifyDocumentPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [documentData, setDocumentData] = useState<any>(null);
  const [redirectPath, setRedirectPath] = useState("/student");

  useEffect(() => {
    // Obtener la ruta de redirección desde los parámetros de URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }

    // Verificar si ya está verificado (cookie)
    const checkVerification = () => {
      const cookies = document.cookie.split(";");
      const verifiedCookie = cookies.find(cookie => 
        cookie.trim().startsWith("document-verified=")
      );
      
      if (verifiedCookie && verifiedCookie.includes("true")) {
        setIsVerified(true);
        // Redirigir automáticamente si ya está verificado
        router.push(redirectPath);
      }
    };

    checkVerification();
  }, [searchParams, router, redirectPath]);

  const handleVerificationSuccess = (data: any) => {
    setDocumentData(data);
    setIsVerified(true);
    
    // Establecer cookie de verificación (expira en 24 horas)
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `document-verified=true; expires=${expires.toUTCString()}; path=/`;
    
    toast.success(`¡Bienvenido, ${data.fullName}!`);
    
    // Redirigir después de un breve delay
    setTimeout(() => {
      router.push(redirectPath);
    }, 1500);
  };

  const handleVerificationFailed = () => {
    // No hacer nada, el usuario puede intentar de nuevo
  };

  const handleLogout = () => {
    // Limpiar cookie de verificación
    document.cookie = "document-verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsVerified(false);
    setDocumentData(null);
    toast.success("Sesión cerrada");
  };

  if (isVerified && documentData) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Efectos de fondo como en el resto de la web */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute left-[-10%] top-[-10%] w-[300px] h-[300px] bg-green-500/30 rounded-full blur-[80px] opacity-60 animate-pulse" />
          <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-[100px] opacity-60" />
          <div className="absolute left-[30%] top-[60%] w-[200px] h-[200px] bg-green-400/15 rounded-full blur-[60px] opacity-40 animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border-2 border-green-400/30 shadow-2xl rounded-2xl">
            {/* Borde animado superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500"></div>
            {/* Efecto de luz interna */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-yellow-400/5 rounded-2xl"></div>
            <CardHeader className="text-center pb-6 relative z-10">
              <div className="mx-auto w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-400/30">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                ¡Verificación Exitosa!
              </CardTitle>
              <p className="text-white/70 mt-2">
                Redirigiendo a tu dashboard...
              </p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="font-semibold text-green-400">Documento Verificado</span>
                </div>
                <p className="text-white text-sm">
                  <strong>Nombre:</strong> {documentData.fullName}
                </p>
                <p className="text-white text-sm">
                  <strong>Documento:</strong> {documentData.documentType} {documentData.documentNumber}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push(redirectPath)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl border border-green-400/30"
                >
                  Continuar
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1 bg-black/60 border-green-400/30 text-white hover:bg-green-400/10 rounded-xl"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Efectos de fondo como en el resto de la web */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[-10%] w-[300px] h-[300px] bg-green-500/30 rounded-full blur-[80px] opacity-60 animate-pulse" />
        <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-[100px] opacity-60" />
        <div className="absolute left-[30%] top-[60%] w-[200px] h-[200px] bg-green-400/15 rounded-full blur-[60px] opacity-40 animate-float-slow" />
      </div>

      {/* Header con información */}
      <div className="relative z-10 p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lock className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">
            Instituto San Pablo
          </h1>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto">
          Para acceder a los cursos y recursos educativos, necesitamos verificar tu identidad. 
          Solo los estudiantes autorizados pueden acceder a la plataforma.
        </p>
      </div>

      {/* Componente de verificación */}
      <div className="relative z-10">
        <DocumentVerification
          onVerificationSuccess={handleVerificationSuccess}
          onVerificationFailed={handleVerificationFailed}
        />
      </div>

      {/* Footer con información adicional */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-white/50 text-sm">
          ¿Tienes problemas para acceder? Contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
};

export default function VerifyDocumentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>}>
      <VerifyDocumentPageInner />
    </Suspense>
  );
}