import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth({ providers: [], session: { strategy: 'jwt' } })

export default auth((req) => {
  const url = req.nextUrl

  if (url.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/signin', req.url))
  }

  const isLoggedIn = !!req.auth
  console.log('ROUTE:', req.nextUrl.pathname)
  console.log('IS LOGGED IN', isLoggedIn)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
