import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 px-8 py-14 text-white">
        <h1 className="text-4xl font-extrabold">SmartRider <span className="text-brand-100">(Apna Rider)</span></h1>
        <p className="mt-3 max-w-2xl text-lg text-brand-100">
          Make a shopping list, a nearby rider buys it for you, and you see every rupee — official rate vs. market price —
          before you pay.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/register" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand-700 hover:bg-brand-50">Get started</Link>
          <Link href="/login" className="rounded-lg border border-white/60 px-5 py-2.5 font-semibold hover:bg-white/10">Login</Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ['Customers', 'Create a shopping list, approve price differences, get a transparent bill.'],
          ['Riders', 'Receive orders, shop at the market, enter prices and deliver.'],
          ['Admins', 'Manage riders, city-wise rates, orders and reports.']
        ].map(([t, d]) => (
          <div key={t} className="card"><h3 className="font-semibold text-brand-700">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>
        ))}
      </section>
    </div>
  );
}
