import { requireRole } from '@/lib/auth';
import ModuleCard from '@/components/ModuleCard';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
  const user = await requireRole('CUSTOMER');
  const addr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hello, {user.name} 👋</h1>
        <p className="text-sm text-slate-500">City: {user.city?.name} • Delivery: {addr?.fullAddress || '—'}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ModuleCard phase={2} title="Shopping list" text="Create a list and see the estimated total from official rates." />
        <ModuleCard phase={4} title="Price approvals" text="Approve or reject price differences during shopping." />
        <ModuleCard phase={5} title="Order tracking & ETA" text="Live status timeline, rider location and ETA." />
        <ModuleCard phase={4} title="Bills & receipts" text="Transparent itemized bills with PDF download." />
      </div>
    </div>
  );
}
