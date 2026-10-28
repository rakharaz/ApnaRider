import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import ModuleCard from '@/components/ModuleCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await requireRole('ADMIN');
  const [customers, riders, pending, cities] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.riderProfile.count({ where: { verification: 'APPROVED' } }),
    prisma.riderProfile.count({ where: { verification: 'PENDING' } }),
    prisma.city.count({ where: { isActive: true } })
  ]);
  const stats = [['Customers', customers], ['Verified riders', riders], ['Riders awaiting approval', pending], ['Active cities', cities]];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin panel <span className="text-base font-normal text-slate-400">— {user.name}</span></h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="card"><p className="text-3xl font-extrabold text-brand-700">{v}</p><p className="text-sm text-slate-500">{l}</p></div>
        ))}
      </div>
      <Link href="/admin/riders" className="btn">Manage riders →</Link>
      <div className="grid gap-4 md:grid-cols-3">
        <ModuleCard phase={2} title="City-wise rates" text="Add items and official rates per city." />
        <ModuleCard phase={3} title="Orders & assignment" text="View, assign and reassign orders." />
        <ModuleCard phase={6} title="Reports" text="Sales, rider performance, price-difference reports." />
      </div>
    </div>
  );
}
