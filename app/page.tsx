"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { plans } from "@/lib/plans";

const check = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="var(--ok)" className="w-4 h-4 mt-0.5 shrink-0">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const features = [
  {
    title: "استيراد ذكي",
    desc: "ارفع ملفات Excel أو اسحبها مباشرة، ويتعرّف النظام تلقائياً على نوع الملف والفرع المصدر.",
    icon: "M12 3v12m0 0l-4-4m4 4l4-4M5 21h14",
  },
  {
    title: "مطابقة آلية",
    desc: "محرّك يطابق الطلبات وبال باي وجوال باي مع دفتر الأستاذ بدقة عالية خلال ثوانٍ.",
    icon: "M17 2l4 4-4 4M3 12v-2a4 4 0 014-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 01-4 4H3",
  },
  {
    title: "مركز الاستثناءات",
    desc: "يُبرز العمليات المفقودة والمكرّرة وفروقات المبالغ، مع اقتراح خطوة المعالجة المناسبة.",
    icon: "M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z",
  },
  {
    title: "تحليلات حيّة",
    desc: "لوحات تنفيذية ورسوم بيانية لكل فرع ووسيلة دفع، تُحدَّث فور اكتمال المطابقة.",
    icon: "M3 3v18h18M7 15l4-5 3 3 5-7",
  },
  {
    title: "إدارة متعددة الفروع",
    desc: "أدِر فروعاً وأقساماً وفرقاً وصلاحيات مختلفة من مساحة عمل واحدة معزولة لكل عميل.",
    icon: "M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1",
  },
  {
    title: "سجلّ تدقيق كامل",
    desc: "كل إجراء يُسجَّل بشكل غير قابل للتعديل، جاهز لأي مراجعة داخلية أو خارجية.",
    icon: "M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z",
  },
];

const sources = [
  { emoji: "🏦", title: "بنك فلسطين والمحافظ", desc: "كشوف الحسابات والمحافظ الرقمية" },
  { emoji: "📱", title: "بال باي · جوال باي", desc: "تحصيلات الدفع الفوري لكل فرع" },
  { emoji: "🧾", title: "السجلات الداخلية", desc: "السجلات المالية الخاصة بكل عميل" },
  { emoji: "🗂️", title: "أنظمة ERP", desc: "تكامل مع أنظمة تخطيط موارد المؤسسات" },
  { emoji: "📊", title: "ملفات Excel", desc: "استيراد ومعالجة الجداول اليدوية" },
  { emoji: "🧮", title: "أنظمة المحاسبة", desc: "مزامنة القيود والحسابات المحاسبية" },
];

const faqs = [
  {
    q: "هل ماتش‌فلو مناسب لشركة بفرع واحد فقط؟",
    a: "نعم، باقة Starter المجانية مصمّمة تحديداً للفرع الواحد، ويمكنك الترقية بسهولة عند نمو عدد فروعك.",
  },
  {
    q: "هل يحتاج فريقي تدريباً تقنياً لاستخدام المنصة؟",
    a: "لا. الواجهة مصمّمة لفرق مالية غير تقنية، والإعداد الأولي يستغرق دقائق مع دعم عربي مباشر.",
  },
  {
    q: "ماذا يحدث للعمليات التي لا تُطابَق تلقائياً؟",
    a: "تظهر في مركز الاستثناءات مع سبب عدم المطابقة واقتراح للمعالجة، لتراجعها يدوياً بسرعة.",
  },
  {
    q: "هل يمكن ربط المنصة بنظام المحاسبة أو ERP الحالي؟",
    a: "باقتا Business وEnterprise تدعمان تكاملاً عبر API مع أنظمة ERP والمحاسبة الشائعة.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [yearly, setYearly] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-[var(--border)] bg-[var(--bg)]/80">
        <div className="container flex items-center justify-between h-[76px]">
          <div className="flex items-center gap-2.5 font-black text-xl">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
            ماتش‌فلو
          </div>
          <nav className="hidden md:flex gap-8 text-[15px] font-medium text-[var(--text-dim)]">
            <a href="#features" className="hover:text-[var(--primary)]">المزايا</a>
            <a href="#how" className="hover:text-[var(--primary)]">كيف يعمل</a>
            <a href="#pricing" className="hover:text-[var(--primary)]">الأسعار</a>
            <a href="#security" className="hover:text-[var(--primary)]">الأمان</a>
            <a href="#faq" className="hover:text-[var(--primary)]">الأسئلة</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/login" className="btn btn-ghost">
              تسجيل الدخول
            </Link>
            <Link href="/login" className="btn btn-primary">ابدأ مجاناً</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-[76px] pb-10">
        <div className="container grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="eyebrow mb-5"><span className="dot" /> منصة المطابقة المالية · عربية أولاً</div>
            <h1 className="text-[40px] md:text-[52px] leading-tight mb-5">
              مطابقة مالية <em className="not-italic text-[var(--primary)]">تُغلق يومك</em>
              <br />بدل أن تُتعبك
            </h1>
            <p className="text-lg text-[var(--text-dim)] leading-loose max-w-lg mb-7">
              اربط الطلبات، بال باي، جوال باي، وكشوف البنك بدفتر أستاذك — تُطابَق تلقائياً، ولا يبقى أمامك سوى الحالات القليلة التي تستحق نظرة فعلية.
            </p>
            <div className="flex gap-3.5 flex-wrap mb-5">
              <Link href="/login" className="btn btn-primary btn-lg">جرّب مجاناً الآن</Link>
              <a href="#pricing" className="btn btn-ghost btn-lg">شاهد الباقات</a>
            </div>
            <p className="text-xs text-[var(--text-faint)]">بدون بطاقة ائتمان · إعداد خلال دقائق · دعم عربي كامل</p>
          </div>

          <div className="relative">
            <div className="card shadow-[var(--shadow)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[var(--text-dim)]">لوحة المطابقة اللحظية</h4>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--ok)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" /> مباشر
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  ["جوال باي · فرع رام الله", "184.00 ₪"],
                  ["بال باي · فرع نابلس", "312.50 ₪"],
                  ["دفتر الأستاذ · فرع الخليل", "97.00 ₪"],
                  ["كشف بنك فلسطين", "1,240.00 ₪"],
                ].map(([src, amt]) => (
                  <div key={src} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center p-3 rounded-xl bg-[var(--bg-alt)] text-sm">
                    <span className="text-[var(--text-dim)] font-semibold">{src}</span>
                    <span className="digits font-semibold">{amt}</span>
                    <span className="w-5 h-5 rounded-full bg-[var(--ok)] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" stroke="#fff" className="w-2.5 h-2.5">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2.5 border-t border-dashed border-[var(--border)] pt-4">
                <div className="text-center">
                  <b className="digits block text-xl text-[var(--primary)]">97%</b>
                  <span className="text-[11px] text-[var(--text-faint)]">مطابقة آلياً</span>
                </div>
                <div className="text-center">
                  <b className="digits block text-xl text-[var(--primary)]">312</b>
                  <span className="text-[11px] text-[var(--text-faint)]">عمليات اليوم</span>
                </div>
                <div className="text-center">
                  <b className="digits block text-xl text-[var(--primary)]">9</b>
                  <span className="text-[11px] text-[var(--text-faint)]">بحاجة مراجعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="py-8 border-y border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="container">
          <p className="text-center text-xs text-[var(--text-faint)] mb-4">
            موثوقة من فرق مالية في مجموعات مطاعم وتجزئة متعددة الفروع
          </p>
          <div className="hidden md:flex justify-center gap-10 font-extrabold text-base text-[var(--text-faint)]">
            <span>مجموعات المطاعم</span><span>سلاسل التجزئة</span><span>شركات التوزيع</span><span>مزوّدو الخدمات</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="max-w-xl mb-12">
            <div className="eyebrow mb-3.5"><span className="dot" /> المزايا</div>
            <h2 className="text-3xl md:text-4xl mb-3.5">كل ما يحتاجه فريقك المالي في مكان واحد</h2>
            <p className="text-[var(--text-dim)] leading-loose">
              من استيراد الملفات إلى المطابقة الآلية وحتى التقارير التنفيذية — بدون تنقّل بين عشرة برامج.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:-translate-y-1 hover:shadow-[var(--shadow)] transition">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="var(--primary)" className="w-[22px] h-[22px]">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-[var(--bg-alt)] border-y border-[var(--border)]">
        <div className="container">
          <div className="max-w-xl mb-12">
            <div className="eyebrow mb-3.5"><span className="dot" /> الآلية</div>
            <h2 className="text-3xl md:text-4xl mb-3.5">ثلاث خطوات تفصلك عن يوم مالي مغلق</h2>
            <p className="text-[var(--text-dim)] leading-loose">لا حاجة لتغيير طريقة عملك — فقط أضِف ماتش‌فلو فوقها.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["01", "ارفع الملفات", "الطلبات، كشوف بال باي وجوال باي، وملفات دفتر الأستاذ — بأي صيغة تصلك بها."],
              ["02", "مطابقة تلقائية", "يطابق المحرّك العمليات بين المصادر فوراً، ويحدد ما يحتاج تدخّلاً بشرياً فقط."],
              ["03", "راجِع وصدّر", "عالِج الاستثناءات القليلة، أغلِق اليوم بضغطة، وصدّر التقارير لفريق المحاسبة."],
            ].map(([num, title, desc]) => (
              <div key={num}>
                <div className="digits w-[38px] h-[38px] rounded-full border-[1.5px] border-[var(--primary)] text-[var(--primary)] flex items-center justify-center mb-4 text-sm font-semibold">
                  {num}
                </div>
                <h3 className="text-lg font-bold mb-2.5">{title}</h3>
                <p className="text-[var(--text-dim)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-xl mb-12">
            <div className="eyebrow mb-3.5"><span className="dot" /> التكاملات</div>
            <h2 className="text-3xl md:text-4xl mb-3.5">يطابق كل مصادر بياناتك المالية</h2>
            <p className="text-[var(--text-dim)] leading-loose">مبني للتعامل مع الفوضى الواقعية لمصادر متعددة، لا بيانات مثالية فقط.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {sources.map((s) => (
              <div key={s.title} className="card p-4 flex items-center gap-3.5">
                <div className="w-[38px] h-[38px] rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-lg shrink-0">{s.emoji}</div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">{s.title}</h4>
                  <p className="text-xs text-[var(--text-faint)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container">
          <div className="max-w-xl mx-auto text-center mb-12">
            <div className="eyebrow mb-3.5"><span className="dot" /> الأسعار</div>
            <h2 className="text-3xl md:text-4xl mb-3.5">باقات واضحة تناسب حجم فريقك</h2>
            <p className="text-[var(--text-dim)] leading-loose">
              ابدأ مجاناً، وارتقِ مع نمو عدد فروعك وحجم عملياتك. كل الأسعار بالشيكل ولا تتضمن مفاجآت.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3.5 mb-11">
            <span className="text-sm font-bold">شهري</span>
            <button
              onClick={() => setYearly((v) => !v)}
              className={`w-[52px] h-7 rounded-full border border-[var(--border)] bg-[var(--bg-alt)] relative transition`}
            >
              <span
                className={`absolute top-0.5 w-[22px] h-[22px] rounded-full bg-[var(--primary)] transition-transform ${
                  yearly ? "-translate-x-6" : "-translate-x-0.5"
                }`}
                style={{ right: 0 }}
              />
            </button>
            <span className="text-sm font-bold">سنوي</span>
            <span className="text-xs bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-1 rounded-full font-bold">وفّر شهرين</span>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`card p-8 flex flex-col relative ${p.featured ? "border-[var(--primary)] shadow-[var(--shadow)] md:scale-105" : ""}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 right-7 bg-[var(--primary)] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                    الأكثر شيوعاً
                  </div>
                )}
                <div className="text-sm font-extrabold text-[var(--text-dim)] mb-1.5">{p.name}</div>
                <div className="text-xs text-[var(--text-faint)] mb-5 min-h-[34px]">{p.description}</div>
                <div className="flex items-baseline gap-1.5 mb-6">
                  {p.monthly === null ? (
                    <span className="text-[26px] font-extrabold">تواصل معنا</span>
                  ) : (
                    <>
                      <span className="digits text-4xl font-extrabold">{yearly ? p.yearly : p.monthly}</span>
                      <span className="text-base font-bold text-[var(--text-dim)]">₪</span>
                      <span className="text-xs text-[var(--text-faint)]">/شهرياً</span>
                    </>
                  )}
                </div>
                <ul className="flex flex-col gap-3 mb-7 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-dim)]">
                      {check} {f}
                    </li>
                  ))}
                </ul>
                <Link href={p.ctaHref} className={`btn w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 bg-[var(--bg-alt)] border-y border-[var(--border)]">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-3.5"><span className="dot" /> الأمان</div>
            <h2 className="text-[32px] mb-4">بياناتك معزولة ومحمية على مستوى المؤسسات</h2>
            <ul className="flex flex-col gap-4.5">
              {[
                ["عزل كامل بين المستأجرين", "كل شركة في مساحة بيانات معزولة تماماً عبر صلاحيات على مستوى الصف.", "M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z"],
                ["صلاحيات دقيقة حسب الدور", "تحكّم كامل بمن يرى ومن يعدّل، لكل فرع وكل قسم.", "M17 11V7a5 5 0 00-10 0v4M5 11h14v9H5z"],
                ["إخفاء البيانات الحسّاسة", "أرقام الهواتف والبيانات الشخصية تُعالَج بشكل آمن ومشفّر.", "M9 12l2 2 4-4M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7z"],
              ].map(([title, desc, icon]) => (
                <li key={title} className="flex gap-3.5 items-start">
                  <div className="w-[38px] h-[38px] rounded-lg bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="var(--primary)" className="w-[18px] h-[18px]">
                      <path d={icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold mb-1">{title}</h4>
                    <p className="text-sm text-[var(--text-dim)]">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl p-10 text-white relative overflow-hidden min-h-[320px] flex flex-col justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3.5 py-2 rounded-full text-xs font-bold mb-4 w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="#fff"><path d="M5 13l4 4L19 7" /></svg>
              سجلّ تدقيق غير قابل للتعديل
            </div>
            <h3 className="text-xl font-black mb-3">كل عملية موثّقة، لكل مراجع</h3>
            <p className="text-sm opacity-90 leading-loose max-w-xs">
              من لحظة رفع الملف إلى إغلاق اليوم المالي — أثر كامل جاهز لأي تدقيق داخلي أو خارجي، بدون إعداد إضافي.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container">
          <div className="max-w-xl mb-12">
            <div className="eyebrow mb-3.5"><span className="dot" /> الأسئلة الشائعة</div>
            <h2 className="text-3xl md:text-4xl">أسئلة يتكرر سؤالها</h2>
          </div>
          <div className="flex flex-col gap-3 max-w-3xl">
            {faqs.map((item, i) => (
              <div key={item.q} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 font-bold text-[15px] text-right"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    stroke="var(--text-dim)"
                    className={`w-[18px] h-[18px] shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-sm text-[var(--text-dim)] leading-loose">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24">
        <div className="container">
          <div className="rounded-[28px] py-16 px-12 text-center text-white relative overflow-hidden bg-[var(--primary)]">
            <h2 className="text-3xl font-black mb-3.5">جاهز تُغلق يومك المالي خلال دقائق؟</h2>
            <p className="opacity-90 mb-7">ابدأ مجاناً اليوم، أو تحدّث معنا لباقة Enterprise مخصّصة لمجموعتك.</p>
            <div className="flex gap-3.5 flex-wrap justify-center">
              <Link href="/login" className="btn btn-accent btn-lg">ابدأ مجاناً</Link>
              <a href="#" className="btn btn-lg bg-white/10 border border-white/35 text-white">تواصل معنا</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-9 mb-11">
            <div>
              <div className="flex items-center gap-2.5 font-black text-xl mb-3.5">
                <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
                ماتش‌فلو
              </div>
              <p className="text-[var(--text-dim)] text-sm leading-loose max-w-xs">
                منصة المطابقة المالية للفرق متعددة الفروع — عربية أولاً، ومبنية لتعقيد بياناتك الحقيقي.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[var(--text-faint)] mb-4">المنتج</h5>
              <a href="#features" className="block text-sm text-[var(--text-dim)] mb-2.5 hover:text-[var(--primary)]">المزايا</a>
              <a href="#pricing" className="block text-sm text-[var(--text-dim)] mb-2.5 hover:text-[var(--primary)]">الأسعار</a>
              <a href="#security" className="block text-sm text-[var(--text-dim)] mb-2.5 hover:text-[var(--primary)]">الأمان</a>
              <a href="#faq" className="block text-sm text-[var(--text-dim)] hover:text-[var(--primary)]">الأسئلة</a>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[var(--text-faint)] mb-4">الحساب</h5>
              <Link href="/login" className="block text-sm text-[var(--text-dim)] hover:text-[var(--primary)]">تسجيل الدخول</Link>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[var(--text-faint)] mb-4">قانوني</h5>
              <a href="#" className="block text-sm text-[var(--text-dim)] mb-2.5">الخصوصية</a>
              <a href="#" className="block text-sm text-[var(--text-dim)]">الشروط</a>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-[var(--border)] text-xs text-[var(--text-faint)] flex-wrap gap-3">
            <span>© 2026 ماتش‌فلو. جميع الحقوق محفوظة.</span>
            <span>صُنع لفرق مالية عربية</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
