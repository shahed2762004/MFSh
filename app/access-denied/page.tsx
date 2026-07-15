import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
      <div className="w-full max-w-[420px] card p-9 text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
        <div className="w-[52px] h-[52px] rounded-2xl mx-auto mb-5 flex items-center justify-center bg-[var(--danger)]/10">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke="var(--danger)" className="w-6 h-6">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6m0-6l-6 6" />
          </svg>
        </div>
        <h1 className="text-xl font-black mb-2">لا تملك صلاحية الوصول</h1>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-7">
          هذه المنطقة مخصّصة لفريق إشراف منصة ماتش‌فلو فقط. إذا كنت تعتقد أن هذا خطأ، تواصل مع مسؤول حسابك.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link href="/dashboard" className="btn btn-primary w-full py-3">
            العودة إلى لوحتي
          </Link>
          <Link href="/" className="btn btn-ghost w-full py-3">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
