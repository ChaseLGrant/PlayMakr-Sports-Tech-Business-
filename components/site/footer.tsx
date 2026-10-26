import Link from "next/link";
import { brand } from "@/lib/brand";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Custom technology, automation and integrations for established sports organizations.
          </p>
          <a href={`mailto:${brand.contactEmail}`} className="mt-4 inline-block text-sm text-slate-300 hover:text-white">
            {brand.contactEmail}
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/#solutions">Solutions</Link></li>
            <li><Link className="hover:text-white" href="/#calculator">Revenue Calculator</Link></li>
            <li><Link className="hover:text-white" href="/#founding-100">The Founding 100</Link></li>
            <li><Link className="hover:text-white" href="/apply">Apply for an Audit</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            Calculator outputs and interface examples are illustrative. They are not guarantees of results or
            representations of past client work.
          </p>
        </div>
      </div>
    </footer>
  );
}
