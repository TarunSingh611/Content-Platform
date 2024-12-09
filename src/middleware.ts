import { withAuth } from 'next-auth/middleware';  
import { NextResponse } from 'next/server';  
  
export default withAuth(  
  function middleware(req) {  
    // If the user is authenticated and trying to access login/signup, redirect to dashboard  
    if (req.nextauth.token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {  
      return NextResponse.redirect(new URL('/dashboard', req.url));  
    }  
    return NextResponse.next();  
  },  
  {  
    callbacks: {  
      authorized: ({ req, token }) => {  
        // Public paths that don't require authentication  
        const publicPaths = ['/', '/login', '/signup'];  
        const isPublicPath = publicPaths.includes(req.nextUrl.pathname);  
  
        // Allow public paths without authentication  
        if (isPublicPath) return true;  
  
        // Require authentication for all other paths  
        return !!token;  
      },  
    },  
  }  
);  
  
export const config = {  
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],  
};  