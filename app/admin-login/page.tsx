"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
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
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        return;
      }
      router.push(data.redirect || "/admin/dashboard");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--bg)]">
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black, transparent 72%)",
        }}
      />
      <div className="absolute top-6 left-6 z-10">
        <ThemeToggle defaultTheme="dark" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-2 mb-5 mx-auto w-fit card px-4 py-1.5 text-xs font-bold text-[var(--accent)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          Administrator Access
        </div>

        <div className="card p-9 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)]">
          <div className="text-center mb-7">
            <div className="w-[52px] h-[52px] rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="#fff" className="w-6 h-6">
                <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" />
              </svg>
            </div>
            <h1 className="text-xl font-black mb-1.5"> لوحة تحكم النظام </h1>
            <p className="text-sm text-[var(--text-dim)]">
             يرجى تسجيل الدخول باستخدام حساب المسؤول للوصول إلى لوحة التحكم.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[var(--text-dim)]"> البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text)] text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[var(--text-dim)]">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text)] text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>

            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

            <button type="submit" disabled={loading} className="btn w-full py-3.5 mt-1.5 bg-[var(--primary)] text-[#04140f] font-extrabold hover:bg-[var(--primary-2)]">
              {loading ? "جارٍ التحقق..." : "دخول إلى لوحة الإشراف"}
            </button>
          </form>

          <div className="mt-5 flex gap-2.5 items-start card !bg-[var(--bg-alt)] p-3.5 text-xs text-[var(--text-dim)] leading-relaxed">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke="var(--accent)" className="w-4 h-4 mt-0.5 shrink-0">
              <path d="M12 9v4m0 4h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span>هذه الصفحة مخصصة للمسؤولين المعتمدين فقط.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
