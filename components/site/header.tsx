"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { audiences } from "@/lib/audiences";
import { Logo } from "./logo";
import { CtaLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#solutions", label: "What We Do" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#founding-100", label: "Free Audit" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-white/[0.06] bg-navy-950/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-navy-900">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <Link href="/#who-we-serve" className="inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white group-focus-within:text-white group-hover:text-white">
              Who We Serve <ChevronDown size={14} aria-hidden className="transition-transform group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl">
                {audiences.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/for/${a.slug}`} className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white">
                      {a.nav}
                      <span className="block text-xs text-electric-300/80">{a.offerName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-slate-400 transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink href="/apply" location="header" size="md" className="hidden sm:inline-flex">
            Claim My Free Build
          </CtaLink>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/[0.06] px-4 pb-6 pt-2 lg:hidden">
          <p className="pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-electric-300">Who we serve</p>
          <ul className="mt-1 grid grid-cols-2 gap-x-4">
            {audiences.map((a) => (
              <li key={a.slug}>
                <Link href={`/for/${a.slug}`} onClick={() => setOpen(false)} className="block py-2.5 text-[14px] text-slate-200">
                  {a.nav}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex flex-col border-t border-white/[0.05]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/[0.05] py-3.5 text-[15px] text-slate-200"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <CtaLink href="/apply" location="mobile_nav" className="mt-5 w-full" onClick={() => setOpen(false)}>
            Claim My Free Build
          </CtaLink>
        </nav>
      )}
    </header>
  );
}
