import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow public access to the home page, login, signup, and NextAuth endpoints
  if (
    path === "/" || 
    path === "/login" || 
    path === "/signup" || 
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check for session/token on protected routes (like /dashboard, /builder, etc.)
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and favicons
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};