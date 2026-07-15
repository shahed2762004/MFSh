import { NextRequest, NextResponse } from "next/server";

// حارس مسارات على مستوى Edge لمنطقة الإدارة (/admin/*).
// يمنع أي مستخدم غير مصادَق عليه كمسؤول من الوصول لأي مسار إداري،
// حتى قبل أن تُنفَّذ أي مكوّنات خادم. التحقق النهائي والكامل من الجلسة
// ما زال يتم أيضاً داخل الصفحات نفسها عبر getSession() كطبقة حماية إضافية.

const SESSION_COOKIE = "mf_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "matchflow-dev-secret-change-me";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع بالثواني

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

async function hmacHex(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getRoleFromToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expectedSig = await hmacHex(data);
  if (expectedSig !== sig) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(data)) as { role?: string; iat?: number };
    if (!payload.iat || Date.now() - payload.iat > SESSION_MAX_AGE * 1000) return null;
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const role = await getRoleFromToken(token);

  if (!token) {
    // لا توجد جلسة على الإطلاق: التوجيه لصفحة دخول الإدارة.
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  if (role !== "admin") {
    // مستخدم مسجَّل دخول لكنه ليس مسؤولاً: ممنوع من الدخول لمنطقة الإدارة.
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
