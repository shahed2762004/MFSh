import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";

export default function AdminPage() {
  const session = getSession();
  if (!session || session.role !== "admin") redirect("/admin-login");

  const tenants = db.listTenants();
  const stats = db.stats();

  return (
    <main className="min-h-screen" data-theme="dark">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-[var(--border)] bg-[var(--bg)]/85">
        <div className="container flex items-center justify-between h-[76px]">
          <div>
            <div className="flex items-center gap-2.5 font-black text-lg">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
              لوحة إشراف ماتش‌فلو
            </div>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">مرحباً، {session.name} · مسؤول منصة</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle defaultTheme="dark" />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container py-10">
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">إجمالي الشركات</span>
            <b className="digits block text-3xl mt-1.5">{stats.tenants}</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">إجمالي المستخدمين</span>
            <b className="digits block text-3xl mt-1.5">{stats.users}</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">نسبة المطابقة الإجمالية</span>
            <b className="digits block text-3xl text-[var(--primary)] mt-1.5">{stats.matchRate}%</b>
          </div>
          <div className="card p-5">
            <span className="text-xs text-[var(--text-faint)]">استثناءات مفتوحة</span>
            <b className="digits block text-3xl text-[var(--danger)] mt-1.5">{stats.exceptions}</b>
          </div>
        </div>

        <h2 className="text-lg font-black mb-4">الشركات على المنصة (Multi-Tenant)</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-[var(--text-faint)] text-xs border-b border-[var(--border)]">
                <th className="p-4 font-semibold">الشركة</th>
                <th className="p-4 font-semibold">الباقة</th>
                <th className="p-4 font-semibold">عدد الفروع</th>
                <th className="p-4 font-semibold">نسبة المطابقة</th>
                <th className="p-4 font-semibold">استثناءات</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => {
                const ts = db.tenantStats(t.id);
                return (
                  <tr key={t.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-4 font-semibold">{t.name}</td>
                    <td className="p-4">
                      <span className="badge badge-ok">{t.plan}</span>
                    </td>
                    <td className="p-4 digits text-[var(--text-dim)]">{t.branches}</td>
                    <td className="p-4 digits font-semibold text-[var(--primary)]">{ts.matchRate}%</td>
                    <td className="p-4 digits text-[var(--danger)]">{ts.exceptions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-[var(--text-faint)] leading-relaxed max-w-2xl">
          هذه لوحة إدارة على مستوى المنصة (وصول محصور على المسؤولين)، منفصلة تماماً عن لوحة العملاء،
          وتُبنى فوق بنية معزولة متعددة المستأجرين (Multi-Tenant) بحيث لا يرى أي عميل بيانات عميل آخر.
        </p>
      </div>
    </main>
  );
}
