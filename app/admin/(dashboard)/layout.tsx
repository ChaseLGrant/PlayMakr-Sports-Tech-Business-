import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "../actions";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 [color-scheme:light]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo tone="light" />
            <nav className="hidden gap-4 text-sm sm:flex">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">Leads & metrics</Link>
              <Link href="/" className="text-slate-600 hover:text-slate-900" target="_blank">View site ↗</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">{admin.email}</span>
            <form action={logoutAction}>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
                <LogOut size={14} aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
