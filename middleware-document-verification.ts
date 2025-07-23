import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren verificación de documento
const PROTECTED_ROUTES = [
  "/student",
  "/courses",
  "/search",
  "/certificates",
  "/progress",
  "/goals",
  "/community"
];

// Rutas que NO requieren verificación
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/verify-document",
  "/api/auth",
  "/_next",
  "/favicon.ico"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Verificar si es una ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Si no es una ruta protegida, permitir acceso
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verificar si el usuario ya está verificado
  const isVerified = request.cookies.get("document-verified");
  
  if (isVerified?.value === "true") {
    return NextResponse.next();
  }

  // Si no está verificado, redirigir a la página de verificación
  const verificationUrl = new URL("/verify-document", request.url);
  verificationUrl.searchParams.set("redirect", pathname);
  
  return NextResponse.redirect(verificationUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 