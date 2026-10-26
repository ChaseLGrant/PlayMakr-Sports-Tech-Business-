import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { getAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdmin().catch(() => null)) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo tone="light" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Admin sign in</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">Authorized team members only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
