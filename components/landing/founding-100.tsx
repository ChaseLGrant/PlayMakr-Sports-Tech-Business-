import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { CtaLink } from "@/components/ui/tracked-link";
import { brand } from "@/lib/brand";

const auditIncludes = [
  "Review of existing software and workflows",
  "Identification of redundant software subscriptions",
  "Preliminary administrative efficiency assessment",
  "Identification of missed revenue opportunities",
  "High-level automation opportunities",
  "Prioritized technology recommendations",
];

const benefits = [
  { t: "Free preliminary audit", d: "A structured review of your technology, workflows and revenue opportunities, at no cost." },
  { t: "Custom technology opportunity roadmap", d: "A prioritized plan showing what to fix first and why." },
  { t: "Preferred founding partner pricing", d: "Preferred implementation pricing, set out in a written proposal." },
  { t: "Priority project scheduling", d: "Founding partners are scheduled ahead of later clients." },
  { t: "30 days of post-launch optimization", d: "Complimentary tuning after launch for contracted projects." },
];

const criteria = [
  "An established sports organization",
  "Existing customers, members or athletes",
  "Real operational or technology inefficiencies",
  "Interest in investing in better systems",
  "A decision-maker involved in the process",
];

/**
 * `enrolled` is passed only when SHOW_FOUNDING_AVAILABILITY=true and comes from
 * the live database count. No count is shown otherwise.
 */
export function Founding100({ enrolled }: { enrolled: number | null }) {
  const cap = brand.foundingCap;
  return (
    <Section id="founding-100" tone="deep" labelledBy="founding-title" className="overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(47_124_246/0.22),transparent)]" />
      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{brand.programName}</Eyebrow>
          <h2 id="founding-title" className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-[2.75rem] sm:leading-[1.1]">
            We’re Looking for 100 Sports Organizations Ready to Operate Smarter.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-slate-400">
            The Founding 100 is our launch partner program. {`Enrollment is capped at ${cap} qualified organizations, and `}
            each one starts with a free Sports Technology &amp; Revenue Audit.
          </p>
          {enrolled !== null && (
            <div className="mx-auto mt-8 max-w-sm">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Founding partners enrolled</span>
                <span className="font-semibold tabular-nums text-white">
                  {enrolled} / {cap}
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={cap}
                aria-valuenow={enrolled}
                aria-label="Founding partners enrolled"
              >
                <div className="h-full rounded-full bg-electric-500" style={{ width: `${Math.min(100, (enrolled / cap) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 rounded-3xl bg-gradient-to-b from-electric-400/50 via-white/10 to-white/5 p-px">
          <div className="grid gap-px overflow-hidden rounded-[23px] bg-white/[0.06] lg:grid-cols-[1.15fr_1fr]">
            <div className="bg-navy-900 p-7 sm:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-electric-300">The primary offer</p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Free Sports Technology &amp; Revenue Audit</h3>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {auditIncludes.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-[15px] text-slate-300">
                    <Check size={16} className="mt-1 shrink-0 text-electric-400" aria-hidden /> {a}
                  </li>
                ))}
              </ul>

              <h4 className="mt-10 text-sm font-semibold uppercase tracking-wider text-slate-400">Founding partner benefits</h4>
              <ul className="mt-4 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {benefits.map((b) => (
                  <li key={b.t} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="shrink-0 font-medium text-white sm:w-72">{b.t}</span>
                    <span className="text-sm text-slate-400">{b.d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col bg-navy-850 p-7 sm:p-10">
              <h3 className="text-lg font-semibold text-white">Who qualifies</h3>
              <ul className="mt-5 space-y-3">
                {criteria.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15px] text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" aria-hidden /> {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck size={16} className="text-electric-300" aria-hidden /> Clear terms
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  The audit is free and comes with no obligation. Custom implementation is a separate, paid engagement. Its
                  scope, pricing and timeline are set out in a written proposal before any work begins.
                </p>
              </div>

              <div className="mt-auto pt-8">
                <CtaLink href="/apply" location="founding_100" className="w-full">
                  Apply for Your Free Audit <ArrowRight size={17} aria-hidden />
                </CtaLink>
                <p className="mt-3 text-center text-xs text-slate-500">Takes about 3 minutes. Every application is reviewed personally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
