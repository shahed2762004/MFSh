import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// نقطة دخول قصيرة لمنطقة الإدارة: توجّه المسؤول المصادَق عليه مباشرة
// إلى لوحة تحكّمه، وأي شخص آخر إلى صفحة دخول الإدارة.
export default function AdminIndexPage() {
  const session = getSession();
  if (session?.role === "admin") {
    redirect("/admin/dashboard");
  }
  redirect("/admin-login");
}
