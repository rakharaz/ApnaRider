import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE, signToken, verifyToken } from './jwt';
import { prisma } from './db';

export function dashboardFor(role) {
  return { CUSTOMER: '/customer', RIDER: '/rider', ADMIN: '/admin' }[role] || '/';
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: Number(s.uid) },
    include: { city: true, riderProfile: true, addresses: true }
  });
}

export async function requireRole(role) {
  const user = await getCurrentUser();
  if (!user || user.status !== 'ACTIVE') redirect('/login');
  if (user.role !== role) redirect(dashboardFor(user.role));
  return user;
}

export async function setSessionCookie(user) {
  const token = await signToken({ uid: user.id, role: user.role, name: user.name });
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}
