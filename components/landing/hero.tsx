import { ArrowRight, Calculator } from "lucide-react";
import { CtaLink } from "@/components/ui/tracked-link";
import { HeroDashboard } from "./hero-dashboard";

export const heroVariants = {
  A: {
    headline: (
      <>
        Less Software.
        <br />
        Better Systems.
        <br />
        <span className="text-gradient">More Revenue.</span>
      </>
    ),
    sub: "We replace complicated workflows and disconnected technology with custom systems that help sports organizations grow revenue, save time, and operate smarter.",
  },
  B: {
    headline: (
      <>
        How Much Money Is Your Sports Organization{" "}
        <span className="text-gradient">Losing to Outdated Systems?</span>
      </>
    ),
    sub: "Missed follow-ups, manual registration and overlapping subscriptions add up. We find where revenue and staff time are leaking — then build the systems that stop it.",
  },
} as const;

export function Hero({ variant }: { variant: "A" | "B" }) {
  const v = heroVariants[variant];
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-navy-950 pb-20 pt-28 sm:pt-36 lg:pb-28">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute left-1/2 top-[-280px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8">
        <div className="animate-fade-up">
          <a
            href="#founding-100"
            className="group inline-flex items-center gap-2.5 rounded-full border border-electric-400/30 bg-electric-500/10 py-1.5 pl-1.5 pr-3.5 text-[13px] text-electric-200 transition-colors hover:border-electric-400/60"
          >
            <span className="whitespace-nowrap rounded-full bg-electric-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Now enrolling
            </span>
            <span className="whitespace-nowrap">
              The Founding 100<span className="hidden sm:inline"> partner program</span>
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>

          <h1
            id="hero-title"
            className={`mt-7 text-balance font-semibold tracking-[-0.035em] text-white ${
              variant === "A" ? "text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]" : "text-[2.35rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem]"
            }`}
          >
            {v.headline}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-400 sm:text-xl">{v.sub}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/apply" location={`hero_${variant}_primary`}>
              Apply for Your Free Audit <ArrowRight size={17} aria-hidden />
            </CtaLink>
            <CtaLink href="/#calculator" location={`hero_${variant}_secondary`} variant="secondary">
              <Calculator size={17} aria-hidden /> See How Much You Could Be Losing
            </CtaLink>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500">
            <li className="flex items-center gap-2"><Dot /> Free technology &amp; revenue audit</li>
            <li className="flex items-center gap-2"><Dot /> Works with your existing software</li>
            <li className="flex items-center gap-2"><Dot /> Built for established sports organizations</li>
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-electric-400" />;
}
