import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { setSessionCookie, dashboardFor } from '@/lib/auth';
import { normalizeMobile } from '@/lib/validators';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad('Invalid request'); }

  const id = String(b.identifier || '').trim();
  const password = String(b.password || '');
  if (!id || !password) return bad('Enter your mobile/email and password.');

  const user = await prisma.user.findFirst({
    where: { OR: [{ mobile: normalizeMobile(id) }, { email: id.toLowerCase() }] }
  });
  if (!user) return bad('Invalid mobile/email or password.', 401);

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil - new Date()) / 60000);
    return bad(`Account locked after too many failed attempts. Try again in ${mins} minute(s).`, 423);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const attempts = user.failedAttempts + 1;
    const lock = attempts >= MAX_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: lock ? 0 : attempts, lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 60000) : null }
    });
    return bad('Invalid mobile/email or password.', 401);
  }

  if (user.status === 'BLOCKED') return bad('Your account has been blocked. Please contact support.', 403);

  await prisma.user.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null } });
  await setSessionCookie(user);
  return NextResponse.json({ redirect: dashboardFor(user.role) });
}
