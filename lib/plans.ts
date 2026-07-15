export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly: number | null; // null = "تواصل معنا"
  yearly: number | null;
  featured?: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "لتجربة المطابقة الآلية على فرع واحد",
    monthly: 0,
    yearly: 0,
    features: [
      "حتى 3 مستخدمين",
      "فرع واحد",
      "50 عملية استيراد شهرياً",
      "تحليلات وتصدير أساسي",
    ],
    cta: "ابدأ مجاناً",
    ctaHref: "/login",
  },
  {
    id: "business",
    name: "Business",
    description: "لفِرق مالية تدير عدة فروع بنشاط",
    monthly: 349,
    yearly: 291,
    featured: true,
    features: [
      "حتى 15 مستخدماً",
      "حتى 5 فروع",
      "1,000 عملية استيراد شهرياً",
      "قواعد مطابقة مخصّصة + API",
      "سجلّ تدقيق كامل",
    ],
    cta: "ابدأ الآن",
    ctaHref: "/login",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "لمجموعات الشركات وسلاسل الفروع الكبيرة",
    monthly: null,
    yearly: null,
    features: [
      "مستخدمون وفروع غير محدودة",
      "نطاق وعلامة تجارية خاصة",
      "تكامل ERP مخصّص",
      "مدير حساب ودعم مخصّص",
    ],
    cta: "تواصل معنا",
    ctaHref: "#contact",
  },
];
