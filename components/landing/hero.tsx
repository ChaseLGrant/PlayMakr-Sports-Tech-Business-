import { ArrowRight, BadgeDollarSign, Hammer, ShieldCheck, Timer } from "lucide-react";
import { CtaLink } from "@/components/ui/tracked-link";
import { HeroDashboard } from "./hero-dashboard";

export const heroVariants = {
  A: {
    headline: (
      <>
        We Build It Free.
        <br />
        <span className="text-gradient">You Only Pay When It Fills Your Roster.</span>
      </>
    ),
    sub: "A complete registration and revenue engine for your camp, league, clinic or club — built and run by us at zero cost. We only earn a small cut of the new sign-ups we bring you. No new players, no bill.",
  },
  B: {
    headline: (
      <>
        More Players. More Revenue.{" "}
        <span className="text-gradient">Zero Risk. Zero Upfront.</span>
      </>
    ),
    sub: "We build your registration pages, ads and automated follow-ups for free, then take a small cut only of the new registrations they produce. If it doesn't work, you've lost nothing.",
  },
} as const;

const promises = [
  { icon: BadgeDollarSign, t: "$0 upfront", d: "No setup fee. No contract." },
  { icon: Hammer, t: "We do the work", d: "Built and run for you." },
  { icon: ShieldCheck, t: "Pay on results", d: "Only on new sign-ups." },
  { icon: Timer, t: "Live in 7 days", d: "Or your first month is on us." },
];

export function Hero({ variant }: { variant: "A" | "B" }) {
  const v = heroVariants[variant];
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-navy-950 pb-20 pt-28 sm:pt-36 lg:pb-28">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute left-1/2 top-[-280px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-8">
        <div className="animate-fade-up">
          <a
            href="#founding-100"
            className="group inline-flex items-center gap-2.5 rounded-full border border-electric-400/30 bg-electric-500/10 py-1.5 pl-1.5 pr-3.5 text-[13px] text-electric-200 transition-colors hover:border-electric-400/60"
          >
            <span className="whitespace-nowrap rounded-full bg-electric-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Zero-risk offer
            </span>
            <span className="whitespace-nowrap">
              Limited founding spots<span className="hidden sm:inline"> — one per sport, per area</span>
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>

          <h1
            id="hero-title"
            className="mt-7 text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-[3.4rem] lg:text-[4rem]"
          >
            {v.headline}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-300 sm:text-xl">{v.sub}</p>

          <ul className="mt-8 grid max-w-xl grid-cols-2 gap-3">
            {promises.map((p) => (
              <li key={p.t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric-500/15 text-electric-300">
                  <p.icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-white">{p.t}</span>
                  <span className="block text-[13px] text-slate-400">{p.d}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/apply?offer=free-build" location={`hero_${variant}_primary`}>
              Claim My Free Build <ArrowRight size={17} aria-hidden />
            </CtaLink>
            <CtaLink href="/#features" location={`hero_${variant}_secondary`} variant="secondary">
              See What You Get
            </CtaLink>
          </div>
          <p className="mt-4 text-[13px] text-slate-500">
            If it doesn’t bring you new registrations, you pay nothing. Ever.
          </p>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
