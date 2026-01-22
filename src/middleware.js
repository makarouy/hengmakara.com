import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-change-in-production-please'
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect API routes
  if (pathname.startsWith('/api')) {
    
    // 1. Always Allow Login
    if (pathname.startsWith('/api/auth/login')) {
      return NextResponse.next();
    }

    // 2. Allow Public GET (Reading Data)
    if (req.method === 'GET') {
      return NextResponse.next();
    }

    // 3. Allow Public Feedback Submission (POST only)
    if (pathname.startsWith('/api/feedback') && req.method === 'POST') {
      return NextResponse.next();
    }

    // 4. Allow Public Contact Form (POST only)
    if (pathname.startsWith('/api/contact') && req.method === 'POST') {
      return NextResponse.next();
    }

    // 5. Verify Token for everything else (Admin writes: POST/PUT/DELETE)
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
