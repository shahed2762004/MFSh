"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ defaultTheme = "light" as "light" | "dark" }) {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem("matchflow-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : defaultTheme);
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("matchflow-theme", next);
  }

  return (
    <button className="theme-btn" onClick={toggle} aria-label="تبديل المظهر">
      {theme === "dark" ? (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        >
          <path d="M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7" />
          <circle cx="12" cy="12" r="4.5" />
        </svg>
      )}
    </button>
  );
}
