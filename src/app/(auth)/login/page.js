import { redirect } from 'next/navigation';
import { getCurrentUser, dashboardFor } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user && user.status === 'ACTIVE') redirect(dashboardFor(user.role));
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="mb-5 text-sm text-slate-500">Login with your mobile number or email.</p>
        <LoginForm />
      </div>
    </div>
  );
}
