import { NextResponse } from 'next/server';
import { COOKIE, verifyToken } from '@/lib/jwt';

const PREFIX_ROLE = { '/customer': 'CUSTOMER', '/rider': 'RIDER', '/admin': 'ADMIN' };
const HOME = { CUSTOMER: '/customer', RIDER: '/rider', ADMIN: '/admin' };

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const prefix = Object.keys(PREFIX_ROLE).find((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!prefix) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) return NextResponse.redirect(new URL('/login', req.url));
  if (session.role !== PREFIX_ROLE[prefix]) return NextResponse.redirect(new URL(HOME[session.role] || '/', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/customer/:path*', '/rider/:path*', '/admin/:path*'] };
