import { TrendingUp, Workflow, Blocks, Check, Plug } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const pillars = [
  {
    icon: TrendingUp,
    name: "Revenue Growth Systems",
    summary: "Turn more of your existing demand into paying customers, and keep them longer.",
    items: ["Automated lead follow-up", "Customer reactivation", "Registration recovery", "Facility utilization optimization", "Sales pipeline management"],
  },
  {
    icon: Workflow,
    name: "Operational Automation",
    summary: "Remove the repetitive work that keeps your staff away from higher-value tasks.",
    items: ["Registration workflows", "Parent & athlete communication", "Staff administration", "Scheduling automation", "Payment reconciliation"],
  },
  {
    icon: Blocks,
    name: "Custom Software & Integrations",
    summary: "Tools built around how your organization actually runs, connected to what you already use.",
    items: ["Internal dashboards", "Custom portals", "CRM integrations", "Data synchronization", "Reporting platforms"],
  },
];

export function Solution() {
  return (
    <Section id="solutions" tone="light" labelledBy="solutions-title">
      <SectionHeading
        id="solutions-title"
        tone="light"
        eyebrow="The solution"
        title="Custom Technology. Built Around Your Business."
        lede="We design, build and connect the systems your organization needs, focused on the problems with the highest financial impact first."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-16px_rgb(15_23_42/0.12)] sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-electric-300">
              <p.icon size={20} aria-hidden />
            </span>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">Pillar {i + 1}</p>
            <h3 className="mt-1.5 text-xl font-semibold text-navy-900">{p.name}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.summary}</p>
            <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-electric-600" aria-hidden />
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6 flex flex-col gap-5 rounded-2xl bg-navy-900 p-7 text-slate-300 sm:flex-row sm:items-center sm:p-8">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-electric-500/15 text-electric-300">
          <Plug size={22} aria-hidden />
        </span>
        <div>
          <p className="text-lg font-semibold text-white">Improve what you have before replacing anything.</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-400">
            Many problems can be solved by connecting, automating or extending the platforms you already pay for. We
            recommend replacing a system only when the numbers clearly support it.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
