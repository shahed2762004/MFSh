import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  const txns = db.listTransactions(session.tenantId);
  const target = txns.find((t) => t.id === params.id);
  if (!target && session.role !== "admin") {
    return NextResponse.json({ error: "العملية غير موجودة ضمن شركتك" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const updated = db.updateTransaction(params.id, {
    status: "matched",
    matchedWith: body.matchedWith || "تمت المطابقة يدوياً",
    note: undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "العملية غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, transaction: updated });
}
