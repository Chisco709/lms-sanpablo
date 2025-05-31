import { PrismaClient } from '@prisma/client'
    
// Extensión de tipos para globalThis sin usar 'var'
declare global {
  var prisma: PrismaClient | undefined
}

// Configuración condicional para diferentes entornos
const getDatabaseConfig = () => {
  const baseConfig: any = {
    errorFormat: "minimal",
  };

  // Solo agregar logs en desarrollo
  if (process.env.NODE_ENV === "development") {
    baseConfig.log = ["query", "error", "warn"];
  }

  return baseConfig;
};

// Inicialización de PrismaClient
export const db = globalThis.prisma ?? new PrismaClient(getDatabaseConfig());

// Optimización específica para Vercel y desarrollo
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Manejo de conexión para Vercel
if (typeof window === "undefined") {
  // Solo en el servidor
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    db.$connect().catch((error: Error) => {
      console.warn("Database connection warning:", error.message);
    });
  }
}