import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { setRiderVerification } from './actions';

export const dynamic = 'force-dynamic';

const COLORS = { PENDING: 'bg-amber-100 text-amber-800', APPROVED: 'bg-emerald-100 text-emerald-800', SUSPENDED: 'bg-red-100 text-red-800' };

function ActionBtn({ riderId, to, label, outline }) {
  return (
    <form action={setRiderVerification}>
      <input type="hidden" name="riderId" value={riderId} />
      <input type="hidden" name="verification" value={to} />
      <button className={outline ? 'btn-outline !px-3 !py-1' : 'btn !px-3 !py-1'}>{label}</button>
    </form>
  );
}

export default async function AdminRiders() {
  await requireRole('ADMIN');
  const riders = await prisma.riderProfile.findMany({
    include: { user: true, city: true },
    orderBy: [{ verification: 'asc' }, { createdAt: 'desc' }]
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Riders</h1>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>{['Name', 'Mobile', 'City', 'CNIC', 'Vehicle', 'Status', 'Action'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {riders.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No riders registered yet.</td></tr>}
            {riders.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{r.user.name}</td>
                <td className="px-4 py-3">{r.user.mobile}</td>
                <td className="px-4 py-3">{r.city.name}</td>
                <td className="px-4 py-3">{r.cnic}</td>
                <td className="px-4 py-3">{r.vehicleType} • {r.vehicleNo}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${COLORS[r.verification]}`}>{r.verification}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.verification !== 'APPROVED' && <ActionBtn riderId={r.id} to="APPROVED" label="Approve" />}
                    {r.verification !== 'SUSPENDED' && <ActionBtn riderId={r.id} to="SUSPENDED" label="Suspend" outline />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
