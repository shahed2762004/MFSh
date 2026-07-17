"use client";

import { useRef, useState } from "react";

interface Props {
  busy: boolean;
  onImportSample: (key: string) => Promise<void>;
}

export default function UploadTab({ busy, onImportSample }: Props) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setFileName(files[0].name);
    await onImportSample("upload");
  }

  return (
    <div>
      <div className="card p-6 mb-6">
        <h3 className="font-black text-base mb-1">
          رفع كشف الحساب البنكي بصيغة PDF / TXT / CSV
        </h3>
        <p className="text-xs text-[var(--text-faint)] mb-5">
          يدعم الملفات الصادرة من: مصرف الراجحي، البنك الأهلي السعودي، بنك الرياض وباقي البنوك.
        </p>

        <div
          className={`dropzone ${dragging ? "dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className="w-11 h-11 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-3 text-lg">
            ⇪
          </div>
          <p className="font-bold text-sm mb-1">
            {fileName ? `تم استلام: ${fileName}` : "قم بسحب وإفلات ملف كشف الحساب هنا، أو اضغط للتصفح من جهازك"}
          </p>
          <p className="text-[11px] text-[var(--text-faint)]">الملفات المتاحة: PDF, TXT, CSV (بحد أقصى 10MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.csv"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <p className="text-xs font-bold text-[var(--text-faint)] mt-6 mb-3">
          ✦ أو اختر أحد الكشوفات الجاهزة لمحاكاة المعالجة والتحليل بالذكاء الاصطناعي فوراً:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            disabled={busy}
            onClick={() => onImportSample("ahli")}
            className="card p-4 text-right hover:border-[var(--primary)] transition-colors"
          >
            <span className="badge badge-ok mb-2">الأهلي</span>
            <p className="font-bold text-sm">كشف حساب تجريبي - البنك الأهلي السعودي</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">
              كشف حساب بالإنجليزية يضم حوالات ومدفوعات روتينية
            </p>
          </button>
          <button
            disabled={busy}
            onClick={() => onImportSample("rajhi")}
            className="card p-4 text-right hover:border-[var(--primary)] transition-colors"
          >
            <span className="badge badge-warn mb-2">الراجحي</span>
            <p className="font-bold text-sm">كشف حساب تجريبي - مصرف الراجحي (تمويل ومبيعات)</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">
              كشف حساب عربي مع رقم مبيعات INV
            </p>
          </button>
        </div>

        <p className="text-xs text-[var(--text-faint)] mt-6">
          أو قم بلصق بيانات المعاملات مباشرةً:
        </p>
        <textarea
          className="search-input mt-2 h-24 resize-none"
          placeholder="الصق نص كشف الحساب هنا (سطر لكل معاملة)..."
        />
      </div>
    </div>
  );
}
