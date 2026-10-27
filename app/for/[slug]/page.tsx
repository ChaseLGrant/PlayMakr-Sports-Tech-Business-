import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Gift, Clock3, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PageTracker } from "@/components/site/page-tracker";
import { CtaLink } from "@/components/ui/tracked-link";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { RevenueCalculator } from "@/components/landing/calculator";
import { audiences, getAudience } from "@/lib/audiences";
import { brand, siteUrl } from "@/lib/brand";

export const dynamicParams = false;

export function generateStaticParams() {
  return audiences.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAudience((await params).slug);
  if (!a) return {};
  return {
    title: `${a.offerName} · ${a.nav}`,
    description: a.metaDescription,
    alternates: { canonical: `/for/${a.slug}` },
    keywords: [a.nav.toLowerCase(), `${a.nav.toLowerCase()} software`, `${a.nav.toLowerCase()} revenue`, `${a.nav.toLowerCase()} automation`, "sports business technology"],
    openGraph: { title: `${a.hook} ${a.hookAccent}`, description: a.offerLine, url: `/for/${a.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title: `${a.hook} ${a.hookAccent}`, description: a.offerLine },
  };
}

export default async function AudiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAudience((await params).slug);
  if (!a) notFound();
  const applyHref = `/apply?type=${a.orgType}&offer=${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${a.offerName} for ${a.nav}`,
        description: a.offerLine,
        url: `${siteUrl}/for/${a.slug}`,
        provider: { "@type": "Organization", name: brand.name, url: siteUrl },
        audience: { "@type": "BusinessAudience", name: a.nav },
        areaServed: "US",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: `${siteUrl}${applyHref}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: brand.name, item: siteUrl },
          { "@type": "ListItem", position: 2, name: a.nav, item: `${siteUrl}/for/${a.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <PageTracker />
      <main id="main">
        {/* Hero + offer */}
        <section className="relative overflow-hidden bg-navy-950 pb-20 pt-28 sm:pt-36">
          <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div aria-hidden className="absolute left-1/2 top-[-280px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-electric-600/25 blur-[120px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
            <div className="animate-fade-up">
              <Eyebrow>{a.eyebrow}</Eyebrow>
              <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.6rem]">
                {a.hook} <span className="text-gradient">{a.hookAccent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-400">{a.sub}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <CtaLink href={applyHref} location={`lp_${a.slug}_hero`}>
                  Claim My Free Report <ArrowRight size={17} aria-hidden />
                </CtaLink>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-400">
                <li className="flex items-center gap-2"><Check size={14} className="text-electric-300" aria-hidden /> 100% free, no obligation</li>
                <li className="flex items-center gap-2"><Clock3 size={14} className="text-electric-300" aria-hidden /> Takes 3 minutes to apply</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-electric-300" aria-hidden /> Only 100 founding spots</li>
              </ul>
            </div>

            <div className="animate-fade-up rounded-3xl border border-electric-400/30 bg-gradient-to-b from-electric-500/15 to-white/[0.02] p-7 shadow-[0_30px_80px_-30px_rgb(47_124_246/0.6)] [animation-delay:150ms] sm:p-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-electric-200">The offer</p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{a.offerName}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{a.offerLine}</p>
              <ul className="mt-6 space-y-3">
                {a.stack.map((s) => (
                  <li key={s} className="flex gap-3 text-[15px] text-slate-200">
                    <Check size={18} className="mt-0.5 shrink-0 text-electric-300" aria-hidden /> {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-[14px] text-amber-100">
                <Gift size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                <span><strong className="font-semibold text-amber-200">Founding bonus:</strong> {a.bonus}</span>
              </div>
              <CtaLink href={applyHref} location={`lp_${a.slug}_offer_card`} className="mt-7 w-full">
                Claim My Free Report <ArrowRight size={17} aria-hidden />
              </CtaLink>
              <p className="mt-3 text-center text-xs text-slate-500">{brand.programName} enrollment is capped at 100 organizations.</p>
            </div>
          </div>
        </section>

        {/* Leaks */}
        <Section tone="light" labelledBy="leaks-title">
          <SectionHeading
            id="leaks-title"
            tone="light"
            eyebrow="Where the money goes"
            title="Three Leaks We Find Almost Every Time."
            lede="None of these show up on a P&L, which is exactly why they keep costing you."
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {a.leaks.map((l, i) => (
              <li key={l.title} className="rounded-2xl border border-navy-900/10 bg-white p-7 shadow-sm">
                <span className="font-mono text-sm text-electric-600">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{l.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{l.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <RevenueCalculator />

        {/* Close */}
        <section className="relative overflow-hidden bg-navy-950 py-24">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-600/20 blur-[120px]" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
              Find Out What You&apos;re Losing. It&apos;s Free.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-400">
              Apply in three minutes. If we can&apos;t find real money for you, we&apos;ll tell you straight, and the report is still yours to keep.
            </p>
            <div className="mt-10 flex justify-center">
              <CtaLink href={applyHref} location={`lp_${a.slug}_final`}>
                Claim My Free Report <ArrowRight size={17} aria-hidden />
              </CtaLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <div aria-hidden className="h-16 sm:hidden" />
      <MobileCta href={applyHref} slug={a.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}

function MobileCta({ href, slug }: { href: string; slug: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 p-3 backdrop-blur sm:hidden">
      <CtaLink href={href} location={`lp_${slug}_mobile_bar`} size="md" className="w-full">
        Claim My Free Report <ArrowRight size={16} aria-hidden />
      </CtaLink>
    </div>
  );
}
