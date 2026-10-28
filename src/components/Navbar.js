import Link from 'next/link';
import { getSession, dashboardFor } from '@/lib/auth';

export default async function Navbar() {
  const s = await getSession();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-brand-700">
          Smart<span className="text-slate-800">Rider</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {s ? (
            <>
              <Link href={dashboardFor(s.role)} className="font-medium text-slate-700 hover:text-brand-700">
                {s.name} <span className="text-xs text-slate-400">({String(s.role).toLowerCase()})</span>
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="btn-outline" type="submit">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline">Login</Link>
              <Link href="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
