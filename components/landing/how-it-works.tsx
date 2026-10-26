import { Search, Hammer, LineChart } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  { icon: Search, name: "Audit", body: "We examine your current technology, workflows, and revenue opportunities." },
  { icon: Hammer, name: "Build", body: "We design and implement custom systems that solve your highest-value problems." },
  { icon: LineChart, name: "Optimize", body: "We measure performance, improve workflows, and help your technology scale." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="light" labelledBy="how-title">
      <SectionHeading id="how-title" tone="light" eyebrow="How it works" title="A simple, three-step process." align="center" />
      <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
        <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-gradient-to-r from-electric-500/0 via-electric-500/40 to-electric-500/0 md:block" />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.name} className="relative text-center">
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-electric-300 shadow-lg shadow-navy-900/20">
              <s.icon size={22} aria-hidden />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-electric-500 font-mono text-[11px] font-semibold text-white ring-4 ring-paper">
                {i + 1}
              </span>
            </span>
            <h3 className="mt-6 text-xl font-semibold text-navy-900">{s.name}</h3>
            <p className="mx-auto mt-2.5 max-w-xs text-[15px] leading-relaxed text-slate-600">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
