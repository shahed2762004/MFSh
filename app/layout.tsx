import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ماتش‌فلو — المطابقة المالية التي تعمل نيابة عنك",
  description:
    "منصة MatchFlow لإدارة المطابقة المالية للشركات متعددة الفروع. طابِق الطلبات، بال باي، جوال باي، وكشوف البنك مع دفاترك تلقائياً.",
};

const themeInitScript = `
(function(){
  try {
    var saved = localStorage.getItem('matchflow-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
