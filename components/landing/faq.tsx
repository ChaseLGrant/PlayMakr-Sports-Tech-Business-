import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

export const faqs = [
  {
    q: "Do we need to replace our existing software?",
    a: "Usually not. We start by finding where your current platforms can be connected, automated or extended. When replacing a tool would clearly save money or remove real friction, we'll show you the reasoning and let you decide.",
  },
  {
    q: "What types of sports organizations do you work with?",
    a: "Only sports. We work with leagues and associations, camps, clinics and private training companies, universities and college athletic departments, facilities and multi-sport complexes, clubs and academies, tournament and showcase operators, and other sports businesses that serve athletes and families. If it is sports and it has revenue to grow, it is a fit.",
  },
  {
    q: "How much does custom development cost?",
    a: "It depends on scope. A focused automation costs far less than a custom portal or a multi-system integration. After the audit, we provide a written proposal with defined scope and pricing, so you know the investment before committing. Founding partners receive preferred pricing, which is set out in that proposal.",
  },
  {
    q: "How long does implementation take?",
    a: "Timelines depend on the scope, the number of systems involved and how quickly we can get access and feedback. Smaller automations can move quickly; larger platforms are delivered in phases. Every proposal includes an estimated timeline.",
  },
  {
    q: "Can you integrate with our current systems?",
    a: "Often, yes. Most modern registration, payment, scheduling, CRM and communication platforms offer APIs or export options we can work with. Some vendors restrict access, so we confirm what's possible for your specific platforms during the audit, before any commitment.",
  },
  {
    q: "Who owns the software?",
    a: "Ownership of custom code, data and intellectual property is defined in the written agreement for each project. We'll explain the ownership and licensing terms clearly in your proposal so there are no surprises.",
  },
  {
    q: "How do you handle customer data and security?",
    a: "We request only the access we need, use secure credential handling, and follow the least-privilege principle. Data handling, confidentiality and any compliance requirements are documented in the agreement. If you serve minors, we take extra care with athlete and family information.",
  },
  {
    q: "What happens after implementation?",
    a: "We measure results against the goals set at the start, then tune workflows as your team uses the system. Contracted founding partner projects include 30 days of complimentary post-launch optimization. Ongoing support and improvement plans are available and defined in writing.",
  },
  {
    q: "What is included in the free audit?",
    a: "A review of your existing software and workflows, identification of redundant subscriptions, a preliminary administrative efficiency assessment, missed revenue opportunities, high-level automation opportunities and prioritized technology recommendations. The audit is free with no obligation; implementation is a separate paid service.",
  },
];

export function Faq() {
  return (
    <Section id="faq" tone="light" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading
          id="faq-title"
          tone="light"
          eyebrow="FAQ"
          title="Questions executives ask us."
          lede="Pricing, ownership, timelines and integrations are always defined in a written agreement. These are the general answers."
        />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-[16.5px] font-medium text-navy-900 hover:text-electric-700">
                {f.q}
                <Plus size={18} className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="-mt-1 pb-6 pr-10 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
