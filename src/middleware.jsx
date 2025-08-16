import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get("flodiary-token")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "");
  
  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/calendar", "/cycle-history", "/periods", "/profile"];
  const authRoutes = ["/login", "/register"];
  const setupRoutes = ["/cycle-setup"];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isSetupRoute = setupRoutes.some(route => pathname.startsWith(route));
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // If accessing auth routes with token, redirect appropriately
  if (isAuthRoute && token) {
    // We can't easily check cycle status in middleware, so redirect to dashboard
    // The dashboard will handle checking if cycle setup is needed
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // If accessing setup route without token, redirect to login
  if (isSetupRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*.png$|.*.svg$|.*.ico$).*)"],
};
