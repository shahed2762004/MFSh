"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResolveButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resolve() {
    setLoading(true);
    try {
      await fetch(`/api/reconciliation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={resolve}
      disabled={loading}
      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      {loading ? "..." : "طابِق يدوياً"}
    </button>
  );
}
