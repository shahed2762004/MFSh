
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import AdminWorkbench from "@/components/admin/AdminWorkbench";

export default function AdminPage() {
  const session = getSession();
  if (!session || session.role !== "admin") redirect("/admin-login");

  const tenants = db.listTenants();
  const platformStats = db.stats();
  const tenantRows = tenants.map((t) => {
    const ts = db.tenantStats(t.id);
    return { tenant: t, matchRate: ts.matchRate, exceptions: ts.exceptions };
  });
  const defaultTenantId = tenants[0]?.id ?? "";

  return (
    <main className="min-h-screen" data-theme="dark">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-[var(--border)] bg-[var(--bg)]/85">
        <div className="container flex items-center justify-between h-[76px] gap-4">
          <button className="pill-group !py-0" aria-label="تبديل اللغة">
            <span className="pill active">English</span>
          </button>

          <div className="flex items-center gap-3 text-center">
            <div>
              <p className="font-black text-sm">{session.name}</p>
              <p className="text-[11px] text-[var(--text-faint)]">مسؤول النظام (Admin)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle defaultTheme="dark" />
            <LogoutButton />
          </div>

          <div className="hidden md:flex items-center gap-2.5 mr-auto">
            <span className="badge badge-ok">v2.1 SaaS</span>
            <div className="text-right">
              <div className="flex items-center gap-2 font-black text-lg">
                MatchFlow
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
              </div>
              <p className="text-[11px] text-[var(--text-faint)]">نظام SaaS للمطابقة المالية والتدقيق التلقائي</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <AdminWorkbench
          tenants={tenants}
          initialTenantId={defaultTenantId}
          platformStats={platformStats}
          tenantRows={tenantRows}
        />
      </div>
    </main>
  );
}
