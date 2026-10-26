import { Layers, Clock, PhoneOff, CalendarX, ClipboardList, EyeOff } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const problems = [
  {
    icon: Layers,
    title: "Too many disconnected subscriptions",
    body: "Registration, scheduling, payments, email, CRM, spreadsheets. Each tool bills monthly, and none of them share data. You end up paying for overlapping features and for the staff time spent moving information between them.",
    cost: "Cost: duplicate fees + manual data entry",
  },
  {
    icon: Clock,
    title: "Admin work consuming staff hours",
    body: "Directors and coaches spend their week reconciling rosters, chasing forms and answering the same questions. Those are paid hours that could go to athletes, sales or retention.",
    cost: "Cost: payroll spent on repeatable tasks",
  },
  {
    icon: PhoneOff,
    title: "Leads that never get proper follow-up",
    body: "A parent fills out an inquiry form and hears back days later, or not at all. Every slow or missed response gives a competitor the chance to win that family.",
    cost: "Cost: registrations you never see",
  },
  {
    icon: CalendarX,
    title: "Unused facility capacity",
    body: "Empty courts, fields and training slots earn nothing, and you can't sell them later. Without visibility and automated offers, open inventory sits unsold.",
    cost: "Cost: inventory that expires daily",
  },
  {
    icon: ClipboardList,
    title: "Manual registration and communication",
    body: "Abandoned checkouts go unrecovered, payment reminders are sent by hand and schedule changes go out one email at a time. Revenue slips and families get frustrated.",
    cost: "Cost: lost payments + churn",
  },
  {
    icon: EyeOff,
    title: "Limited visibility into performance",
    body: "When revenue, utilization and retention live in separate systems, leadership decides on instinct. Problems surface after the season ends, when it's too late to act.",
    cost: "Cost: slower, costlier decisions",
  },
];

export function Problems() {
  return (
    <Section id="problem" tone="dark" labelledBy="problem-title">
      <SectionHeading
        id="problem-title"
        eyebrow="The problem"
        title="Your Software Shouldn’t Be Slowing Your Business Down."
        lede="Most established sports organizations didn’t choose their technology stack. It accumulated one subscription and one workaround at a time, and every gap costs money."
      />
      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <Reveal as="li" key={p.title} className="group flex flex-col bg-navy-950 p-7 transition-colors hover:bg-navy-900 sm:p-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-electric-300">
              <p.icon size={19} aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-slate-400">{p.body}</p>
            <p className="mt-5 border-t border-white/[0.06] pt-4 font-mono text-[11.5px] uppercase tracking-wider text-amber-200/80">
              {p.cost}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
