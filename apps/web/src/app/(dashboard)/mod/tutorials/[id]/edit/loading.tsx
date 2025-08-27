export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="mb-4 h-8 w-56 rounded-xl bg-white/5 animate-pulse" />
      <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-6">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-white/10" />
          <div className="h-11 w-full rounded-2xl bg-white/5 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="h-[420px] w-full rounded-2xl bg-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-11 w-28 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-11 w-24 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
