import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  // المسؤول يمكنه تمرير tenantId لعرض بيانات شركة محددة، والمستخدم العادي
  // يرى بيانات شركته فقط بغض النظر عمّا يُرسله.
  const requestedTenant = req.nextUrl.searchParams.get("tenantId");
  const tenantId =
    session.role === "admin" && requestedTenant ? requestedTenant : session.tenantId;

  const transactions = db.listTransactions(tenantId);
  const stats = db.tenantStats(tenantId);
  return NextResponse.json({ transactions, stats, tenantId });
}
