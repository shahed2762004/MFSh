import type { Tenant } from "@/lib/db";

type TenantRow = { tenant: Tenant; matchRate: number; exceptions: number };

interface Props {
  platformStats: { tenants: number; users: number; matchRate: number; exceptions: number };
  tenantRows: TenantRow[];
  currentTenantName: string;
  reconStats: {
    ledgerCount: number;
    bankCount: number;
    unmatchedLedgerCount: number;
    unmatchedBankCount: number;
    successRate: number;
  } | null;
}

export default function AnalyticsTab({ platformStats, tenantRows, currentTenantName, reconStats }: Props) {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)]">إجمالي الشركات على المنصة</span>
          <b className="digits block text-3xl mt-1.5">{platformStats.tenants}</b>
        </div>
        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)]">إجمالي المستخدمين</span>
          <b className="digits block text-3xl mt-1.5">{platformStats.users}</b>
        </div>
        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)]">نسبة المطابقة الإجمالية (المنصة)</span>
          <b className="digits block text-3xl text-[var(--primary)] mt-1.5">{platformStats.matchRate}%</b>
        </div>
        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)]">استثناءات مفتوحة (المنصة)</span>
          <b className="digits block text-3xl text-[var(--danger)] mt-1.5">{platformStats.exceptions}</b>
        </div>
      </div>

      {reconStats && (
        <div className="card p-6">
          <h3 className="font-black text-sm mb-5">
            تفصيل مطابقة الحسابات — {currentTenantName}
          </h3>
          <div className="grid gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold">نسبة المطابقة الناجحة</span>
                <span className="digits font-bold text-[var(--primary)]">{reconStats.successRate}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${reconStats.successRate}%` }} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-2">
              <div className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--text-faint)] block">إجمالي قيود دفتر ERP</span>
                <b className="digits text-lg">{reconStats.ledgerCount}</b>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--text-faint)] block">إجمالي حركات الكشف البنكي</span>
                <b className="digits text-lg">{reconStats.bankCount}</b>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[11px] text-[var(--text-faint)] block">حركات معلّقة (الطرفين)</span>
                <b className="digits text-lg text-[var(--danger)]">
                  {reconStats.unmatchedLedgerCount + reconStats.unmatchedBankCount}
                </b>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-black text-sm mb-4">أداء الشركات على المنصة (Multi-Tenant)</h3>
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
              {tenantRows.map(({ tenant, matchRate, exceptions }) => (
                <tr key={tenant.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4 font-semibold">{tenant.name}</td>
                  <td className="p-4">
                    <span className="badge badge-ok">{tenant.plan}</span>
                  </td>
                  <td className="p-4 digits text-[var(--text-dim)]">{tenant.branches}</td>
                  <td className="p-4 digits font-semibold text-[var(--primary)]">{matchRate}%</td>
                  <td className="p-4 digits text-[var(--danger)]">{exceptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-[var(--text-faint)] leading-relaxed max-w-2xl">
          هذه لوحة إدارة على مستوى المنصة (وصول محصور على المسؤولين)، منفصلة تماماً عن لوحة العملاء، وتُبنى فوق بنية
          معزولة متعددة المستأجرين (Multi-Tenant) بحيث لا يرى أي عميل بيانات عميل آخر.
        </p>
      </div>
    </div>
  );
}
