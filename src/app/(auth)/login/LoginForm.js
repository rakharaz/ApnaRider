'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const f = new FormData(e.target);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: f.get('identifier'), password: f.get('password') })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
      router.push(data.redirect); router.refresh();
    } catch { setError('Network error. Please try again.'); setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><label className="label">Mobile or email</label><input name="identifier" className="input" placeholder="03001234567" required /></div>
      <div><label className="label">Password</label><input name="password" type="password" className="input" required /></div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button className="btn w-full" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      <p className="text-center text-sm text-slate-500">New here? <Link href="/register" className="font-medium text-brand-700">Create an account</Link></p>
    </form>
  );
}
