import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import ResolveButton from "@/components/ResolveButton";

export default function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const tenant = db.getTenant(session.tenantId);
  const transactions = db.listTransactions(session.tenantId);
  const stats = db.tenantStats(session.tenantId);
  const exceptions = transactions.filter((t) => t.status === "exception");
  const matched = transactions.filter((t) => t.status === "matched");

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-[var(--border)] bg-[var(--bg)]/85">
        <div className="container flex items-center justify-between h-[76px]">
          <div>
            <div className="flex items-center gap-2.5 font-black text-lg">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
              ماتش‌فلو
            </div>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">{tenant?.name} · {tenant?.plan}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-dim)] hidden md:inline">مرحباً، {session.name}</span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container py-10">
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">نسبة المطابقة الآلية</span>
            <b className="digits block text-3xl text-[var(--primary)] mt-1.5">{stats.matchRate}%</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">إجمالي العمليات</span>
            <b className="digits block text-3xl mt-1.5">{stats.total}</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">مطابَقة</span>
            <b className="digits block text-3xl mt-1.5">{stats.matched}</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">بحاجة مراجعة</span>
            <b className="digits block text-3xl text-[var(--danger)] mt-1.5">{stats.exceptions}</b>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <span className="badge badge-warn">استثناءات</span> بحاجة إلى مراجعتك
          </h2>
          <div className="card overflow-hidden">
            {exceptions.length === 0 ? (
              <p className="p-6 text-sm text-[var(--text-dim)]">لا توجد استثناءات حالياً — كل شيء مُطابَق. 🎉</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-[var(--text-faint)] text-xs border-b border-[var(--border)]">
                    <th className="p-4 font-semibold">المصدر</th>
                    <th className="p-4 font-semibold">الفرع</th>
                    <th className="p-4 font-semibold">المبلغ</th>
                    <th className="p-4 font-semibold">السبب</th>
                    <th className="p-4 font-semibold">التاريخ</th>
                    <th className="p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {exceptions.map((t) => (
                    <tr key={t.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-4 font-semibold">{t.source}</td>
                      <td className="p-4 text-[var(--text-dim)]">{t.branch}</td>
                      <td className="p-4 digits font-semibold">{t.amount.toFixed(2)} ₪</td>
                      <td className="p-4 text-[var(--text-dim)]">{t.note}</td>
                      <td className="p-4 digits text-[var(--text-faint)]">{t.date}</td>
                      <td className="p-4"><ResolveButton id={t.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <span className="badge badge-ok">مطابَقة</span> آخر العمليات المطابَقة تلقائياً
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-[var(--text-faint)] text-xs border-b border-[var(--border)]">
                  <th className="p-4 font-semibold">المصدر</th>
                  <th className="p-4 font-semibold">الفرع</th>
                  <th className="p-4 font-semibold">المبلغ</th>
                  <th className="p-4 font-semibold">طابَقَت مع</th>
                  <th className="p-4 font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {matched.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-4 font-semibold">{t.source}</td>
                    <td className="p-4 text-[var(--text-dim)]">{t.branch}</td>
                    <td className="p-4 digits font-semibold">{t.amount.toFixed(2)} ₪</td>
                    <td className="p-4 text-[var(--text-dim)]">{t.matchedWith}</td>
                    <td className="p-4 digits text-[var(--text-faint)]">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
