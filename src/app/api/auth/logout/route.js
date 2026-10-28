import { NextResponse } from 'next/server';
import { COOKIE } from '@/lib/jwt';

export async function POST(req) {
  const res = NextResponse.redirect(new URL('/login', req.url), 303);
  res.cookies.delete(COOKIE);
  return res;
}
