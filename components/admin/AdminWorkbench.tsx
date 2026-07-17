"use client";

import { useEffect, useState } from "react";
import type { LedgerEntry, BankEntry, Tenant } from "@/lib/db";
import ReconciliationTab from "./ReconciliationTab";
import UploadTab from "./UploadTab";
import RulesTab from "./RulesTab";
import AnalyticsTab from "./AnalyticsTab";

type TenantRow = { tenant: Tenant; matchRate: number; exceptions: number };

interface Props {
  tenants: Tenant[];
  initialTenantId: string;
  platformStats: { tenants: number; users: number; matchRate: number; exceptions: number };
  tenantRows: TenantRow[];
}

type ReconStats = {
  ledgerCount: number;
  bankCount: number;
  unmatchedLedgerCount: number;
  unmatchedBankCount: number;
  differenceValue: number;
  matchedValue: number;
  successRate: number;
  matchedPairs: number;
  totalPairs: number;
};

const TABS = [
  { id: "workbench", label: "لوحة المطابقة التفاعلية", icon: "☰" },
  { id: "upload", label: "رفع واستيراد كشوفات الحساب", icon: "⇪" },
  { id: "rules", label: "قواعد المطابقة الذكية", icon: "⚙" },
  { id: "analytics", label: "الإحصائيات والتحليلات", icon: "▤" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminWorkbench({ tenants, initialTenantId, platformStats, tenantRows }: Props) {
  const [tenantId, setTenantId] = useState(initialTenantId);
  const [activeTab, setActiveTab] = useState<TabId>("workbench");
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [bank, setBank] = useState<BankEntry[]>([]);
  const [stats, setStats] = useState<ReconStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function load(tid: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reconciliation?tenantId=${tid}`);
      const data = await res.json();
      setLedger(data.ledger || []);
      setBank(data.bank || []);
      setStats(data.stats || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(tenantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  async function runAction(body: Record<string, any>) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, ...body }),
      });
      const data = await res.json();
      await load(tenantId);
      return data;
    } finally {
      setBusy(false);
    }
  }

  const currentTenant = tenants.find((t) => t.id === tenantId);

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 card px-5 py-3 text-sm font-bold shadow-lg border-[var(--primary)]">
          {toast}
        </div>
      )}

      {/* شريط أدوات علوي: اسم النظام + تبديل الشركة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            نظام المطابقة والربط المالي
          </h1>
          <p className="text-xs text-[var(--text-faint)] mt-1">
            مطابقة ذكية وسريعة لكشوفات الحسابات البنكية مع سجلات المعاملات الداخلية في ثوانٍ معدودة.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-faint)]">
          الشركة:
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="search-input !w-auto py-2"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)]">الفروقات والمستحقات العالقة</span>
          <div className="flex items-center gap-5 mt-2.5">
            <div>
              <b className="digits block text-2xl">{stats?.unmatchedLedgerCount ?? "—"}</b>
              <span className="text-[11px] text-[var(--text-faint)]">غير مطابق في الدفتر</span>
            </div>
            <div className="w-px h-9 bg-[var(--border)]" />
            <div>
              <b className="digits block text-2xl text-[var(--accent)]">{stats?.unmatchedBankCount ?? "—"}</b>
              <span className="text-[11px] text-[var(--text-faint)]">غير مطابق في البنك</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)] flex items-center gap-1.5">
            <span className="text-[var(--accent)]">⚠</span> قيمة الفروقات والرسوم البنكية
          </span>
          <b className="digits block text-2xl mt-1.5 text-[var(--accent)]">
            {(stats?.differenceValue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} ₪
          </b>
          <span className="text-[11px] text-[var(--text-faint)]">فروقات مطلوب مراجعتها</span>
        </div>

        <div className="card p-5">
          <span className="text-xs text-[var(--text-faint)] flex items-center gap-1.5">
            <span className="text-[var(--primary)]">↗</span> إجمالي القيمة المطابقة
          </span>
          <b className="digits block text-2xl mt-1.5 text-[var(--primary)]">
            {(stats?.matchedValue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} ₪
          </b>
          <span className="text-[11px] text-[var(--text-faint)]">تمت تسويتها تلقائياً</span>
        </div>

        <div className="card p-5 border-[var(--danger)]/40" style={{ borderColor: "color-mix(in srgb, var(--danger) 40%, transparent)" }}>
          <span className="text-xs text-[var(--text-faint)]">نسبة المطابقة الناجحة</span>
          <b className="digits block text-2xl mt-1.5 text-[var(--danger)]">{stats?.successRate ?? 0}%</b>
          <span className="text-[11px] text-[var(--text-faint)]">
            {stats?.matchedPairs ?? 0} / {stats?.totalPairs ?? 0} حركات مطابقة
          </span>
        </div>
      </div>

      {/* التبويبات */}
      <div className="tabs mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="ml-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "workbench" && (
        <ReconciliationTab
          ledger={ledger}
          bank={bank}
          loading={loading}
          busy={busy}
          onAutoMatch={async () => {
            const r = await runAction({ action: "auto-match" });
            notify(r?.matched ? `تمت مطابقة ${r.matched} حركة تلقائياً ✓` : "لا توجد حركات جديدة قابلة للمطابقة التلقائية");
          }}
          onReset={async () => {
            await runAction({ action: "reset" });
            notify("تم إلغاء جميع التطابقات");
          }}
          onManualMatch={async (ledgerId, bankId) => {
            const r = await runAction({ action: "manual-match", ledgerId, bankId });
            notify(r?.ok ? "تم الربط اليدوي بنجاح ✓" : r?.error || "تعذّرت المطابقة");
          }}
        />
      )}

      {activeTab === "upload" && (
        <UploadTab
          busy={busy}
          onImportSample={async (key) => {
            const r = await runAction({ action: "import-sample", sampleKey: key });
            notify(r?.imported ? `تم استيراد ${r.imported} حركة بنكية جديدة ✓` : "تعذّر الاستيراد");
          }}
        />
      )}

      {activeTab === "rules" && <RulesTab onSaved={() => notify("تم حفظ إعدادات قواعد المطابقة ✓")} />}

      {activeTab === "analytics" && (
        <AnalyticsTab
          platformStats={platformStats}
          tenantRows={tenantRows}
          currentTenantName={currentTenant?.name || ""}
          reconStats={stats}
        />
      )}
    </div>
  );
}
