import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exportar rutas para Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
  // Aplicar configuración opcional
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
}); 