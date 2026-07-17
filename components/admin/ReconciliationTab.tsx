"use client";

import { useMemo, useState } from "react";
import type { LedgerEntry, BankEntry } from "@/lib/db";

type Filter = "all" | "matched" | "unmatched";

interface Props {
  ledger: LedgerEntry[];
  bank: BankEntry[];
  loading: boolean;
  busy: boolean;
  onAutoMatch: () => Promise<void>;
  onReset: () => Promise<void>;
  onManualMatch: (ledgerId: string, bankId: string) => Promise<void>;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export default function ReconciliationTab({ ledger, bank, loading, busy, onAutoMatch, onReset, onManualMatch }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [qLedger, setQLedger] = useState("");
  const [qBank, setQBank] = useState("");
  const [selLedger, setSelLedger] = useState<string | null>(null);
  const [selBank, setSelBank] = useState<string | null>(null);

  const filteredLedger = useMemo(
    () =>
      ledger.filter(
        (e) =>
          (filter === "all" || e.status === filter) &&
          (e.ref.toLowerCase().includes(qLedger.toLowerCase()) ||
            e.description.toLowerCase().includes(qLedger.toLowerCase()))
      ),
    [ledger, filter, qLedger]
  );

  const filteredBank = useMemo(
    () =>
      bank.filter(
        (e) =>
          (filter === "all" || e.status === filter) &&
          (e.ref.toLowerCase().includes(qBank.toLowerCase()) ||
            e.description.toLowerCase().includes(qBank.toLowerCase()))
      ),
    [bank, filter, qBank]
  );

  async function handleManualMatch() {
    if (!selLedger || !selBank) return;
    await onManualMatch(selLedger, selBank);
    setSelLedger(null);
    setSelBank(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <button className="btn btn-primary" disabled={busy} onClick={onAutoMatch}>
            ✨ تشغيل المطابقة التلقائية
          </button>
          <button className="btn btn-ghost" disabled={busy} onClick={onReset}>
            ↻ إلغاء جميع التطابقات
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-[var(--text-faint)]">تصنيف العرض:</span>
          <div className="pill-group">
            <button className={`pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              الكل
            </button>
            <button className={`pill ${filter === "matched" ? "active" : ""}`} onClick={() => setFilter("matched")}>
              المطابقة فقط
            </button>
            <button className={`pill ${filter === "unmatched" ? "active" : ""}`} onClick={() => setFilter("unmatched")}>
              المعلقة فقط
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* الجدول الأيسر: ERP / Ledger */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-black text-sm flex items-center gap-2">
              سجل المقيوضات والمدفوعات ERP (Ledger)
              <span className="badge badge-ok">{ledger.length}</span>
            </h3>
          </div>
          <div className="p-3 border-b border-[var(--border)]">
            <input
              className="search-input"
              placeholder="بحث في القيود والمرجع..."
              value={qLedger}
              onChange={(e) => setQLedger(e.target.value)}
            />
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-sm text-[var(--text-dim)]">جارِ التحميل...</p>
            ) : filteredLedger.length === 0 ? (
              <p className="p-6 text-sm text-[var(--text-dim)] text-center">لا توجد قيود مضافة تتطابق مع التصفية</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-[var(--text-faint)] text-[11px] border-b border-[var(--border)] sticky top-0 bg-[var(--bg-raised)]">
                    <th className="p-3 font-semibold">حالة المطابقة</th>
                    <th className="p-3 font-semibold">التاريخ</th>
                    <th className="p-3 font-semibold">الوصف / البيان</th>
                    <th className="p-3 font-semibold">المبلغ مالي</th>
                    <th className="p-3 font-semibold">الرقم المرجعي</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => e.status === "unmatched" && setSelLedger(selLedger === e.id ? null : e.id)}
                      className={`recon-row border-b border-[var(--border)] last:border-0 ${
                        e.status === "matched" ? "matched" : ""
                      } ${selLedger === e.id ? "selected" : ""}`}
                    >
                      <td className="p-3">
                        <span className={`badge ${e.status === "matched" ? "badge-ok" : "badge-danger"}`}>
                          {e.status === "matched" ? "مطابق" : "غير مطابق"}
                        </span>
                      </td>
                      <td className="p-3 digits text-[var(--text-faint)] whitespace-nowrap">{e.date}</td>
                      <td className="p-3 text-[var(--text-dim)] max-w-[160px] truncate" title={e.description}>
                        {e.description}
                      </td>
                      <td className="p-3 digits font-semibold text-[var(--danger)] whitespace-nowrap">{fmt(e.amount)}</td>
                      <td className="p-3 digits text-[var(--text-faint)] whitespace-nowrap">{e.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* الجدول الأيمن: كشف بنكي مستورد */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-black text-sm flex items-center gap-2">
              كشف الحساب البنكي المستورد
              <span className="badge badge-ok">{bank.length}</span>
            </h3>
          </div>
          <div className="p-3 border-b border-[var(--border)]">
            <input
              className="search-input"
              placeholder="بحث في البيان والوصف..."
              value={qBank}
              onChange={(e) => setQBank(e.target.value)}
            />
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-sm text-[var(--text-dim)]">جارِ التحميل...</p>
            ) : filteredBank.length === 0 ? (
              <p className="p-6 text-sm text-[var(--text-dim)] text-center">لا توجد معاملات بنكية تتطابق مع التصفية</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-[var(--text-faint)] text-[11px] border-b border-[var(--border)] sticky top-0 bg-[var(--bg-raised)]">
                    <th className="p-3 font-semibold">حالة المطابقة</th>
                    <th className="p-3 font-semibold">التاريخ</th>
                    <th className="p-3 font-semibold">الوصف / البيان البنكي</th>
                    <th className="p-3 font-semibold">المبلغ مالي</th>
                    <th className="p-3 font-semibold">الرقم المرجعي</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBank.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => e.status === "unmatched" && setSelBank(selBank === e.id ? null : e.id)}
                      className={`recon-row border-b border-[var(--border)] last:border-0 ${
                        e.status === "matched" ? "matched" : ""
                      } ${selBank === e.id ? "selected" : ""}`}
                    >
                      <td className="p-3">
                        <span className={`badge ${e.status === "matched" ? "badge-ok" : "badge-danger"}`}>
                          {e.status === "matched" ? "مطابق" : "غير مطابق"}
                        </span>
                      </td>
                      <td className="p-3 digits text-[var(--text-faint)] whitespace-nowrap">{e.date}</td>
                      <td className="p-3 text-[var(--text-dim)] max-w-[160px] truncate" title={e.description}>
                        {e.description}
                      </td>
                      <td className="p-3 digits font-semibold text-[var(--primary)] whitespace-nowrap">{fmt(e.amount)}</td>
                      <td className="p-3 digits text-[var(--text-faint)] whitespace-nowrap">{e.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 card p-4">
        <p className="text-xs text-[var(--text-dim)] leading-relaxed flex items-center gap-2">
          <span className="text-[var(--accent)]">⚠</span>
          حدد حركة بنكية من الجدول الأيمن، وحركة مقابلة من جدول القيود الأيسر، ثم اضغط على "مطابقة يدوية" لربطهما.
        </p>
        <button
          className="btn btn-accent"
          disabled={!selLedger || !selBank || busy}
          onClick={handleManualMatch}
        >
          🔗 مطابقة يدوية {selLedger && selBank ? "" : `(${selLedger ? 1 : 0}/2)`}
        </button>
      </div>
    </div>
  );
}
