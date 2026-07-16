import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createToken,
  hashPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "الرجاء تعبئة البريد الإلكتروني وكلمة المرور" },
      { status: 400 }
    );
  }

  const user = db.getUserByEmail(email);

  if (
    !user ||
    user.role !== "admin" ||
    user.passwordHash !== hashPassword(password)
  ) {
    return NextResponse.json(
      { error: "بيانات الدخول غير صحيحة" },
      { status: 401 }
    );
  }

  const token = createToken({
    uid: user.id,
    role: user.role,
    tenantId: user.tenantId,
    name: user.name,
    email: user.email,
  });

  const res = NextResponse.json({
    ok: true,
    redirect: "/admin/dashboard",
  });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return res;
}
