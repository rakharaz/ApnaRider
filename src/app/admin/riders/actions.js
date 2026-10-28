'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function setRiderVerification(formData) {
  await requireRole('ADMIN');
  const id = Number(formData.get('riderId'));
  const verification = String(formData.get('verification'));
  if (!id || !['PENDING', 'APPROVED', 'SUSPENDED'].includes(verification)) return;
  await prisma.riderProfile.update({ where: { id }, data: { verification } });
  revalidatePath('/admin/riders');
  revalidatePath('/admin');
}
