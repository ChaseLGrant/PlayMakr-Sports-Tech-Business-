import { BarChart3, Bell, CalendarClock, CreditCard, Link2, ListChecks, Users, Zap } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaLink } from "@/components/ui/tracked-link";

const features = [
  { icon: Zap, f: "Registration that actually works", b: "Families sign up in minutes on any phone. No more lost forms or abandoned checkouts." },
  { icon: CreditCard, f: "Payments, balances & reminders", b: "Unpaid fees get chased automatically, so you stop playing bill collector." },
  { icon: CalendarClock, f: "Scheduling & facility booking", b: "Practices, games, fields and coaches in one place. No double-bookings." },
  { icon: Bell, f: "Parent & athlete communication", b: "The right message to the right team, automatically. No more group-text chaos." },
  { icon: Users, f: "Rosters, tryouts & recruiting", b: "Track every player and prospect from interest to signed, without spreadsheets." },
  { icon: Link2, f: "Connects your existing tools", b: "We patch the holes between the software you already pay for, so nothing gets re-typed." },
  { icon: ListChecks, f: "Staff & admin automation", b: "Hours of manual busywork gone every week, so staff can coach and sell." },
  { icon: BarChart3, f: "One dashboard for everything", b: "Revenue, sign-ups and operations at a glance. Finally know your real numbers." },
];

export function Features() {
  return (
    <Section id="features" tone="light" labelledBy="features-title">
      <SectionHeading
        id="features-title"
        tone="light"
        eyebrow="Custom fixes, built for sports"
        title="Every Gap Your Old Software Leaves, Fixed."
        lede="We don't sell you another platform. We build the exact pieces you're missing, for universities, leagues, travel teams, camps and clinics. Pick one fix or all of them."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((x) => (
          <Reveal key={x.f} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-16px_rgb(15_23_42/0.12)]">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-electric-300">
              <x.icon size={20} aria-hidden />
            </span>
            <h3 className="mt-5 text-[17px] font-semibold text-navy-900">{x.f}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              <span className="font-semibold text-electric-700">Benefit: </span>
              {x.b}
            </p>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-4 rounded-2xl bg-navy-900 p-7 text-center sm:grid-cols-3 sm:p-8">
        <div><p className="text-2xl font-semibold text-white">Custom</p><p className="text-sm text-slate-400">built around how you run</p></div>
        <div><p className="text-2xl font-semibold text-white">30 days</p><p className="text-sm text-slate-400">free to use, start to finish</p></div>
        <div><p className="text-2xl font-semibold text-white">$0</p><p className="text-sm text-slate-400">if you decide it’s not for you</p></div>
      </div>
      <div className="mt-8 flex justify-center">
        <CtaLink href="/apply?offer=free-month" location="features">Start My Free Month</CtaLink>
      </div>
    </Section>
  );
}
