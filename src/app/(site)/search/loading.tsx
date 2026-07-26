export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}