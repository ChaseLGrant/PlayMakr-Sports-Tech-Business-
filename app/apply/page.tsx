import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PageTracker } from "@/components/site/page-tracker";
import { ApplicationForm } from "@/components/apply/application-form";
import { Eyebrow } from "@/components/ui/section";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Start Your Free Month",
  description: `Apply for a free Sports Technology & Revenue Audit and join ${brand.programName} founding partner program.`,
  alternates: { canonical: "/apply" },
};

const next = [
  { t: "We review your application", d: "A member of our team reads every application personally." },
  { t: "We schedule your audit call", d: "A focused conversation about your systems, workflows and goals." },
  { t: "You receive your roadmap", d: "Prioritized recommendations, with no obligation to proceed." },
];

export default function ApplyPage() {
  return (
    <>
      <Header />
      <PageTracker />
      <main id="main" className="relative overflow-hidden bg-navy-950 pb-24 pt-28 sm:pt-32">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.45fr_1fr] lg:px-8">
          <div>
            <Eyebrow>{brand.programName}</Eyebrow>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Apply for Your Free Sports Technology &amp; Revenue Audit
            </h1>
            <p className="mt-3 max-w-xl text-slate-400">
              Four short steps. Your answers help us prepare an audit that focuses on what matters most to your organization.
            </p>
            <div className="mt-8">
              <ApplicationForm />
            </div>
          </div>

          <aside className="space-y-6 lg:pt-[7.5rem]">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {next.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric-500/15 font-mono text-xs text-electric-300">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{n.t}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Your audit includes</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                {[
                  "Software & workflow review",
                  "Redundant subscription check",
                  "Admin efficiency assessment",
                  "Missed revenue opportunities",
                  "Automation opportunities",
                  "Prioritized recommendations",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="shrink-0 text-electric-400" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-slate-500">
                The audit is free. Custom implementation is a separate paid service, scoped and priced in a written proposal.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
