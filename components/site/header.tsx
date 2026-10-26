"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { CtaLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#solutions", label: "Solutions" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#founding-100", label: "Founding 100" },
  { href: "/#examples", label: "What We Build" },
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
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-slate-400 transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink href="/apply" location="header" size="md" className="hidden sm:inline-flex">
            Apply for Your Free Audit
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
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/[0.06] px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
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
            Apply for Your Free Audit
          </CtaLink>
        </nav>
      )}
    </header>
  );
}
