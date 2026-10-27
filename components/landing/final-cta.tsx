import { ArrowRight } from "lucide-react";
import { CtaLink } from "@/components/ui/tracked-link";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="final-title" className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
          Free to Build. Free if It Doesn’t Work. What’s Stopping You?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-400">
          We build your registration and revenue engine at no cost, and only earn a small cut of the new players it brings
          you. Founding spots are limited to one per sport, per area.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href="/apply?offer=free-build" location="final_cta">
            Claim My Free Build <ArrowRight size={17} aria-hidden />
          </CtaLink>
          <CtaLink href="/#calculator" location="final_cta_secondary" variant="secondary">
            See How Much You Could Be Losing
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
