import { Trophy, Tent, Target, GraduationCap, Building2, Medal, Dumbbell, Briefcase } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const audiences = [
  {
    icon: Trophy,
    title: "Leagues & associations",
    body: "Fill divisions faster, collect fees on time and stop chasing rosters, waivers and referee schedules by hand.",
  },
  {
    icon: Tent,
    title: "Camps",
    body: "Sell out sessions, recover abandoned registrations and bring last summer's families back automatically.",
  },
  {
    icon: Target,
    title: "Clinics & private training",
    body: "Turn inquiries into booked sessions in minutes and fill open coach hours before they go to waste.",
  },
  {
    icon: GraduationCap,
    title: "Universities & college athletics",
    body: "Grow camp, ticketing, sponsorship and donor revenue with systems your staff actually has time to run.",
  },
  {
    icon: Building2,
    title: "Facilities & complexes",
    body: "Book every court, field and cage hour, and offer open slots to waitlisted teams automatically.",
  },
  {
    icon: Medal,
    title: "Clubs & academies",
    body: "Win more tryout families, cut admin time for directors and keep players re-enrolling season after season.",
  },
  {
    icon: Dumbbell,
    title: "Tournaments & showcases",
    body: "Fill brackets earlier, sell more team entries and handle check-in, payments and schedules in one place.",
  },
  {
    icon: Briefcase,
    title: "Any sports business",
    body: "Recruiting services, performance centers, sports retail and more. If it runs on athletes and families, we can grow it.",
  },
];

export function WhoWeServe() {
  return (
    <Section id="who-we-serve" tone="deep" labelledBy="who-title">
      <SectionHeading
        id="who-title"
        eyebrow="Built only for sports"
        title="If Your Business Runs on Athletes, We Build Systems That Grow It."
        lede="PlayMakr works exclusively with sports organizations. We know registration seasons, tryouts, camp waitlists and facility hours, so we start where your revenue is leaking."
      />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <Reveal
            as="li"
            key={a.title}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-electric-400/40 hover:bg-white/[0.04]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-electric-500/10 text-electric-300">
              <a.icon size={19} aria-hidden />
            </span>
            <h3 className="mt-5 text-base font-semibold text-white">{a.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-400">{a.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
