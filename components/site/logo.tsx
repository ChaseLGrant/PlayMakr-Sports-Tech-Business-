import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Placeholder wordmark — replace with your logo file when ready. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${brand.name} home`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <rect width="32" height="32" rx="8" fill="#2f7cf6" />
        <path d="M9 23V9h7.5a5 5 0 0 1 0 10H13" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22.5" cy="22.5" r="2.2" fill="#b8d4ff" />
      </svg>
      <span className={cn("text-[17px] font-semibold tracking-tight", tone === "dark" ? "text-white" : "text-navy-900")}>
        {brand.name}
      </span>
    </Link>
  );
}
