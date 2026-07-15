"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        return;
      }
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between p-14 text-white relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]">
        <div className="flex items-center gap-2.5 font-black text-[19px] relative z-10">
          <span className="w-8 h-8 rounded-lg bg-white/20" />
          ماتش‌فلو
        </div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex gap-2 items-center text-xs font-bold bg-white/15 px-3.5 py-1.5 rounded-full mb-5">
            🔒 مساحة عمل خاصة بشركتك
          </div>
          <h1 className="text-[32px] font-black leading-snug mb-4">يومك المالي، مُطابَقاً قبل أن تبدأ قهوتك</h1>
          <p className="text-sm opacity-90 leading-loose">
            سجّل الدخول لمتابعة عمليات المطابقة، مراجعة الاستثناءات، وإغلاق حسابات فروعك.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4.5 mt-7 backdrop-blur">
            {["جوال باي · فرع رام الله", "بال باي · فرع نابلس", "دفتر الأستاذ · فرع الخليل"].map((row, i) => (
              <div
                key={row}
                className={`flex justify-between items-center text-sm py-2 ${i < 2 ? "border-b border-dashed border-white/20" : ""}`}
              >
                <span>{row}</span>
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="3.5" stroke="var(--primary)" className="w-2.5 h-2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex gap-6 text-xs opacity-85">
          <div><b className="digits block text-xl font-extrabold">97%</b>مطابقة آلياً</div>
          <div><b className="digits block text-xl font-extrabold">+180</b>فريق مالي</div>
          <div><b className="digits block text-xl font-extrabold">24/7</b>دعم عربي</div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-8 relative bg-[var(--bg)]">
        <div className="absolute top-7 left-7">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <Link href="/" className="text-sm text-[var(--text-dim)] mb-7 inline-flex gap-1.5">
            ← <span>العودة للصفحة الرئيسية</span>
          </Link>

          <div className="card p-8 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl font-black mb-2">مرحباً بعودتك</h2>
            <p className="text-sm text-[var(--text-dim)] mb-7">سجّل الدخول إلى مساحة عمل شركتك في ماتش‌فلو.</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[var(--text-dim)]">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text)] text-sm outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[var(--text-dim)]">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text)] text-sm outline-none focus:border-[var(--primary)]"
                />
              </div>

              {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 mt-1">
                {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 justify-center text-xs text-[var(--text-faint)]">
              <span>🔒 اتصالك مشفّر بالكامل، وبياناتك محمية وفق أعلى معايير الأمان.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
