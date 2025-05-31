import { clerkMiddleware } from '@clerk/nextjs/server'
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default clerkMiddleware({})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

export default authMiddleware({
  publicRoutes: ["/", "/login", "/register", "/about", "/contact"],
  afterAuth(auth, req) {
    if (auth.userId && ["/", "/login", "/register", "/about", "/contact"].includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/student", req.url));
    }
    return NextResponse.next();
  },
});