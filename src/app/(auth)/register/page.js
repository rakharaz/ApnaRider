import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser, dashboardFor } from '@/lib/auth';
import RegisterForm from './RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user && user.status === 'ACTIVE') redirect(dashboardFor(user.role));
  const cities = await prisma.city.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
  return (
    <div className="mx-auto max-w-xl">
      <div className="card">
        <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
        <p className="mb-5 text-sm text-slate-500">Join SmartRider as a customer or a rider.</p>
        <RegisterForm cities={cities} />
      </div>
    </div>
  );
}
