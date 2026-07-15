import crypto from "crypto";
import { cookies } from "next/headers";
import type { Role } from "./db";

// ملاحظة: التوقيع أدناه مبني على HMAC-SHA256 بدون أي مكتبات خارجية،
// وهو كافٍ للتجربة والتطوير المحلي. لأي بيئة إنتاج حقيقية استخدم
// مكتبة جلسات معتمدة (NextAuth / iron-session) وتشفير كلمات مرور بـ bcrypt/argon2.

const SECRET = process.env.SESSION_SECRET || "matchflow-dev-secret-change-me";
export const SESSION_COOKIE = "mf_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع بالثواني

export interface SessionPayload {
  uid: string;
  role: Role;
  tenantId: string;
  name: string;
  email: string;
  iat: number;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createToken(payload: Omit<SessionPayload, "iat">): string {
  const full: SessionPayload = { ...payload, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = sign(data);
  return `${data}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  if (sign(data) !== sig) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    ) as SessionPayload;
    if (Date.now() - payload.iat > SESSION_MAX_AGE * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

/** يُستخدم داخل Server Components / Route Handlers لقراءة الجلسة الحالية. */
export function getSession(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
