"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleOtpChange(i: number, val: string) {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && inputsRef.current[i + 1]) inputsRef.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && inputsRef.current[i - 1]) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp: otp.join("") }),
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
          منطقة وصول مقيّد — لطاقم ماتش‌فلو فقط
        </div>

        <div className="card p-9 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)]">
          <div className="text-center mb-7">
            <div className="w-[52px] h-[52px] rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="#fff" className="w-6 h-6">
                <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" />
              </svg>
            </div>
            <h1 className="text-xl font-black mb-1.5">بوابة الإدارة — ماتش‌فلو</h1>
            <p className="text-sm text-[var(--text-dim)]">
              وصول مخصّص لفريق إشراف المنصة فقط، ويتطلّب تحققاً ثنائياً.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[var(--text-dim)]">البريد الإداري</label>
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
            <div>
              <label className="flex justify-between text-xs font-bold mb-1.5 text-[var(--text-dim)]">
                <span>رمز التحقق الثنائي</span>
                <span className="digits font-normal text-[var(--text-faint)]">أُرسل إلى بريدك الإداري</span>
              </label>
              <div className="grid grid-cols-6 gap-2 direction-ltr" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="digits text-center py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text)] text-base outline-none focus:border-[var(--primary)]"
                  />
                ))}
              </div>
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
            <span>كل محاولة دخول تُسجَّل في سجلّ التدقيق. الوصول غير المصرّح به يخضع للمساءلة.</span>
          </div>

          <p className="text-center mt-6 text-sm text-[var(--text-faint)]">
            لست مسؤولاً؟ <Link href="/login" className="text-[var(--text-dim)] font-bold underline">الدخول كعميل عادي</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
