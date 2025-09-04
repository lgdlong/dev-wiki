export default function AdminDashboardSkeleton() {
    return (
      <div className="min-h-screen bg-[#0b0e13] text-white">
        {/* Shell */}
        <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 md:px-6">
          {/* Sidebar */}
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[260px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 md:block">
            <div className="flex items-center gap-2 px-2 py-3 text-xl font-semibold">
              <div className="h-6 w-6 rounded-md bg-white/20" />
              Admin Panel
            </div>
            <nav className="mt-2 flex flex-col gap-1">
              {[
                { label: "Dashboard" },
                { label: "Account Management" },
                { label: "User Management" },
                { label: "Settings" },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-white/10 ${
                    i === 0 ? "bg-white/10" : ""
                  }`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/15" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
  
            <div className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                <div className="h-4 w-4 rounded-full bg-white/30" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Admin User</div>
                <div className="truncate text-xs text-white/60">admin@company.com</div>
              </div>
            </div>
          </aside>
  
          {/* Main column */}
          <main className="flex-1 space-y-6">
            {/* Header */}
            <header className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
              <p className="mt-1 text-sm text-white/70">
                Welcome back! Here\'s what\'s happening with your platform today.
              </p>
            </header>
  
            {/* KPI cards */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Users" },
                { label: "Active Sessions" },
                { label: "Revenue" },
                { label: "Support Tickets" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/70">{c.label}</div>
                    <div className="h-8 w-8 rounded-xl bg-white/15" />
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">—</div>
                  <div className="mt-1 text-xs text-emerald-400/80">+0.0% from last month</div>
                </div>
              ))}
            </section>
  
            {/* Charts row */}
            <section className="grid gap-4 lg:grid-cols-2">
              {/* User Growth chart placeholder */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 text-base font-medium">User Growth</div>
                <div className="h-[280px] rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent" />
              </div>
  
              {/* Revenue Overview chart placeholder */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 text-base font-medium">Revenue Overview</div>
                <div className="h-[280px] rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <span className="text-xs text-white/50">Designed by</span>
                  <div className="h-5 w-16 rounded-md bg-white/15" />
                </div>
              </div>
            </section>
  
            {/* Recent activities */}
            <section className="rounded-2xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-5 py-4 text-base font-medium">
                Recent Activities
              </div>
              <ul className="divide-y divide-white/10">
                {["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "Alex Brown"].map(
                  (name, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                          <div className="h-4 w-4 rounded-full bg-white/30" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{name}</div>
                          <div className="truncate text-xs text-white/60">Short activity text</div>
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-white/50">just now</div>
                    </li>
                  )
                )}
              </ul>
              <div className="flex items-center justify-end gap-2 px-5 py-3">
                <span className="text-xs text-white/50">Designed by</span>
                <div className="h-5 w-16 rounded-md bg-white/15" />
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }
  