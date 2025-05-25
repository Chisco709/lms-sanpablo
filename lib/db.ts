import { PrismaClient } from '@prisma/client'
    
// Extensión de tipos para globalThis sin usar 'var'
declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined
}

// Creamos un alias para evitar el warning de ESLint
const prismaGlobal = globalThis as typeof globalThis & {
  _prisma?: PrismaClient
}

// Inicialización de PrismaClient
export const db = prismaGlobal._prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal._prisma = db
}