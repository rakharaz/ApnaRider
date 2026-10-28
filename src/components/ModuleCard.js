export default function ModuleCard({ title, text, phase }) {
  return (
    <div className="card opacity-80">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Phase {phase}</span>
      </div>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
