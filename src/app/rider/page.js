import { requireRole } from '@/lib/auth';
import ModuleCard from '@/components/ModuleCard';

export const dynamic = 'force-dynamic';

const BANNER = {
  PENDING: ['bg-amber-50 text-amber-800', 'Your account is awaiting Admin verification. You can receive orders once approved.'],
  APPROVED: ['bg-emerald-50 text-emerald-800', 'Your account is verified. You will be able to go online and receive orders soon.'],
  SUSPENDED: ['bg-red-50 text-red-800', 'Your rider account is suspended. Please contact support.']
};

export default async function RiderDashboard() {
  const user = await requireRole('RIDER');
  const rp = user.riderProfile;
  const [cls, msg] = BANNER[rp.verification];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rider dashboard</h1>
        <p className="text-sm text-slate-500">{user.name} • {user.city?.name} • {rp.vehicleType} ({rp.vehicleNo})</p>
      </div>
      <p className={`rounded-lg px-4 py-3 text-sm ${cls}`}>{msg}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <ModuleCard phase={3} title="Availability" text="Go Available / Busy / Offline." />
        <ModuleCard phase={3} title="Assigned orders" text="Accept orders, view shopping list and navigate." />
        <ModuleCard phase={4} title="Enter market prices" text="Record actual prices and upload shop slips." />
      </div>
    </div>
  );
}
