"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

interface DocumentVerificationProps {
  onVerificationSuccess: (documentData: any) => void;
  onVerificationFailed: () => void;
}

export const DocumentVerification = ({ 
  onVerificationSuccess, 
  onVerificationFailed 
}: DocumentVerificationProps) => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState<"CC" | "TI">("CC");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDocumentNumber, setShowDocumentNumber] = useState(false);

  const handleVerification = async () => {
    if (!documentNumber.trim()) {
      toast.error("Por favor ingresa tu número de documento");
      return;
    }

    // Validar formato básico
    const documentRegex = /^\d{8,11}$/;
    if (!documentRegex.test(documentNumber)) {
      toast.error("El número de documento debe tener entre 8 y 11 dígitos");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/verify-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentNumber: documentNumber.trim(),
          documentType
        }),
      });

      const data = await response.json();

      if (response.ok && data.authorized) {
        toast.success("✅ Documento verificado exitosamente");
        onVerificationSuccess(data.document);
      } else {
        toast.error("❌ Documento no autorizado");
        onVerificationFailed();
      }
    } catch (error) {
      console.error("Error verificando documento:", error);
      toast.error("❌ Error al verificar el documento");
      onVerificationFailed();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerification();
    }
  };

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
          {/* Borde animado superior como en sign-in */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500"></div>
          {/* Efecto de luz interna */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-yellow-400/5 rounded-2xl"></div>
          <CardHeader className="text-center pb-6 relative z-10">
            <div className="mx-auto w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-400/30">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Verificación de Identidad
            </CardTitle>
            <p className="text-white/70 mt-2">
              Ingresa tu documento de identidad para acceder a los cursos
            </p>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {/* Tipo de Documento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Tipo de Documento
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={documentType === "CC" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${
                    documentType === "CC" 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-black/60 border-green-400/30 text-white hover:bg-green-400/10"
                  }`}
                  onClick={() => setDocumentType("CC")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cédula de Ciudadanía
                </Button>
                <Button
                  type="button"
                  variant={documentType === "TI" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${
                    documentType === "TI" 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-black/60 border-green-400/30 text-white hover:bg-green-400/10"
                  }`}
                  onClick={() => setDocumentType("TI")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Tarjeta de Identidad
                </Button>
              </div>
            </div>

            {/* Número de Documento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Número de Documento
              </label>
              <div className="relative">
                <Input
                  type={showDocumentNumber ? "text" : "password"}
                  placeholder={documentType === "CC" ? "Ej: 1234567890" : "Ej: 123456789"}
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-black/60 border-green-400/30 text-white placeholder:text-white/50 focus:border-green-400 focus:ring-green-400/20 pr-12"
                  maxLength={11}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-green-400/10"
                  onClick={() => setShowDocumentNumber(!showDocumentNumber)}
                >
                  {showDocumentNumber ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/50">
                {documentType === "CC" 
                  ? "Ingresa tu número de cédula de ciudadanía" 
                  : "Ingresa tu número de tarjeta de identidad"
                }
              </p>
            </div>

            {/* Botón de Verificación */}
            <Button
              onClick={handleVerification}
              disabled={isVerifying || !documentNumber.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl border border-green-400/30 shadow-lg"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verificar Documento
                </>
              )}
            </Button>

            {/* Información de Seguridad */}
            <Alert className="bg-green-400/10 border-green-400/30">
              <AlertTriangle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400 text-sm">
                <strong>Seguridad:</strong> Tu documento solo se usa para verificar tu identidad. 
                No se almacena información personal adicional.
              </AlertDescription>
            </Alert>

            {/* Badge de Tipo de Documento */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-white/70 border-green-400/30 bg-black/40">
                {documentType === "CC" ? "Cédula de Ciudadanía" : "Tarjeta de Identidad"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentVerification;