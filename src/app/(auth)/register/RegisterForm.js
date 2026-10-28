'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const VEHICLES = ['Motorcycle', 'Bicycle', 'Car', 'Rickshaw / Loader'];

export default function RegisterForm({ cities }) {
  const router = useRouter();
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const body = Object.fromEntries(new FormData(e.target));
    body.role = role;
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
      router.push(data.redirect); router.refresh();
    } catch { setError('Network error. Please try again.'); setLoading(false); }
  }

  const tab = (r, label) => (
    <button type="button" onClick={() => setRole(r)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${role === r ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{label}</button>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-2">{tab('CUSTOMER', "I'm a Customer")}{tab('RIDER', "I'm a Rider")}</div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Full name</label><input name="name" className="input" required /></div>
        <div><label className="label">Mobile number</label><input name="mobile" className="input" placeholder="03001234567" required /></div>
        <div><label className="label">Email <span className="text-slate-400">(optional)</span></label><input name="email" type="email" className="input" /></div>
        <div><label className="label">Password</label><input name="password" type="password" minLength={8} className="input" placeholder="Min 8 characters" required /></div>
        <div className="sm:col-span-2">
          <label className="label">City</label>
          <select name="cityId" className="input" required defaultValue="">
            <option value="" disabled>Select your city</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {role === 'CUSTOMER' ? (
        <div><label className="label">Delivery address</label><textarea name="address" rows={2} className="input" placeholder="House #, street, area" required /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label">CNIC (13 digits)</label><input name="cnic" className="input" placeholder="3520212345671" required /></div>
          <div>
            <label className="label">Vehicle type</label>
            <select name="vehicleType" className="input" required defaultValue="">
              <option value="" disabled>Select</option>
              {VEHICLES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div><label className="label">Vehicle number</label><input name="vehicleNo" className="input" placeholder="LEA-1234" required /></div>
          <p className="sm:col-span-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Rider accounts are activated after Admin verification.</p>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button className="btn w-full" disabled={loading}>{loading ? 'Creating account…' : 'Register'}</button>
      <p className="text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-medium text-brand-700">Login</Link></p>
    </form>
  );
}
