// middleware.ts (in your root directory)
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/user') || 
      request.nextUrl.pathname.startsWith('/api/game') ||
      request.nextUrl.pathname.startsWith('/api/store') ||
      request.nextUrl.pathname.startsWith('/api/referral')) {
    
    // Skip authentication for login endpoint
    if (request.nextUrl.pathname === '/api/auth/login') {
      return NextResponse.next()
    }

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/user/:path*', '/api/game/:path*', '/api/store/:path*', '/api/referral/:path*']
}
