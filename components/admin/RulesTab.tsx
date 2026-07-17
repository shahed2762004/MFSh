"use client";

import { useEffect, useState } from "react";

interface Rule {
  id: string;
  title: string;
  description: string;
  default: boolean;
}

const RULES: Rule[] = [
  {
    id: "amount_ref",
    title: "تطابق المبلغ المالي والمرجع البنكي بدقة",
    description: "يطابق المعاملات عندما يتطابق المبلغ (Reference) والمبلغ بدقة.",
    default: true,
  },
  {
    id: "amount_date",
    title: "تطابق المبلغ المالي والتاريخ بدقة",
    description: "يطابق المعاملات عندما يتطابق المبلغ مع تاريخ دفتر الأستاذ بدقة.",
    default: true,
  },
  {
    id: "fuzzy_description",
    title: "المطابقة الضبابية للوصف (بالذكاء الاصطناعي)",
    description: "يستخدم نموذج لغوي لمقارنة الوصف/البيان حتى مع اختلاف الصياغة بين الطرفين.",
    default: false,
  },
  {
    id: "ignore_small_fees",
    title: "تجاهل الرسوم البنكية الصغيرة تلقائياً",
    description: "يستثني رسوم أقل من 50 ₪ من قائمة الفروقات المطلوب مراجعتها يدوياً.",
    default: false,
  },
  {
    id: "date_tolerance",
    title: "هامش سماح ± يومين على التاريخ",
    description: "يسمح بفارق يوم أو يومين بين تاريخ القيد وتاريخ الحركة البنكية عند المطابقة.",
    default: true,
  },
];

const STORAGE_KEY = "matchflow-admin-rules";

export default function RulesTab({ onSaved }: { onSaved: () => void }) {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RULES.map((r) => [r.id, r.default]))
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setValues(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  function toggle(id: string) {
    setValues((v) => ({ ...v, [id]: !v[id] }));
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    onSaved();
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-base">إعداد قواعد المطابقة الأوتوماتيكية</h3>
          <p className="text-xs text-[var(--text-faint)] mt-1">
            حدد معايير الربط التي يعتمد عليها محرك الذكاء الاصطناعي والتدقيق لربط الحركات المالية في توانٍ.
          </p>
        </div>
        <button className="btn btn-primary" onClick={save}>
          💾 حفظ إعدادات القواعد
        </button>
      </div>

      <div className="grid gap-3">
        {RULES.map((rule) => (
          <div key={rule.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)]">
            <div className="flex-1">
              <p className="font-bold text-sm">{rule.title}</p>
              <p className="text-xs text-[var(--text-faint)] mt-1 leading-relaxed">{rule.description}</p>
            </div>
            <label className="switch mt-1">
              <input type="checkbox" checked={!!values[rule.id]} onChange={() => toggle(rule.id)} />
              <span className="switch-track" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
