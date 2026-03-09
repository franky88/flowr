import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/api/auth']

// export function proxy(req: NextRequest) {
//   const token = req.cookies.get('access_token')
//   const isPublic = PUBLIC_PATHS.some(p => req.nextUrl.pathname.startsWith(p))

//   if (!token && !isPublic) {
//     return NextResponse.redirect(new URL('/sign-in', req.url))
//   }
//   return NextResponse.next()
// }

// export const config = { matcher: ['/((?!_next|favicon.ico).*)'] }