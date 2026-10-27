import { BarChart3, Bell, CreditCard, Gift, LayoutTemplate, ListChecks, Megaphone, Repeat } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaLink } from "@/components/ui/tracked-link";

const features = [
  { icon: LayoutTemplate, f: "Branded registration page", b: "Parents sign up in under 2 minutes, on any phone." },
  { icon: Megaphone, f: "Ads & lead capture done for you", b: "New families find you without you posting a thing." },
  { icon: Bell, f: "Automated text & email follow-up", b: "Every inquiry gets chased until they register. No lead slips." },
  { icon: CreditCard, f: "Abandoned sign-up recovery", b: "Win back parents who started checkout and never finished." },
  { icon: Gift, f: "Early-bird, sibling & referral offers", b: "Families bring families, and you fill spots faster." },
  { icon: ListChecks, f: "Waitlists & sold-out capture", b: "Turn “we're full” into next session's first sign-ups." },
  { icon: Repeat, f: "Next-season re-enrollment", b: "Past players get invited back automatically, before they leave." },
  { icon: BarChart3, f: "Live revenue dashboard", b: "See every lead, sign-up and dollar the system made you." },
];

export function Features() {
  return (
    <Section id="features" tone="light" labelledBy="features-title">
      <SectionHeading
        id="features-title"
        tone="light"
        eyebrow="Everything you get — free to build"
        title="Features That Fill Rosters. Benefits You'll See in Your Bank Account."
        lede="We build and run all of it. You pay only a small cut of the new registrations it brings in."
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
        <div><p className="text-2xl font-semibold text-white">$0</p><p className="text-sm text-slate-400">to build and launch</p></div>
        <div><p className="text-2xl font-semibold text-white">7 days</p><p className="text-sm text-slate-400">to go live, or your first month is free</p></div>
        <div><p className="text-2xl font-semibold text-white">$0</p><p className="text-sm text-slate-400">if it brings you no new sign-ups</p></div>
      </div>
      <div className="mt-8 flex justify-center">
        <CtaLink href="/apply?offer=free-build" location="features">Claim My Free Build</CtaLink>
      </div>
    </Section>
  );
}
