import { cookies } from "next/headers";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PageTracker } from "@/components/site/page-tracker";
import { Hero } from "@/components/landing/hero";
import { Problems } from "@/components/landing/problems";
import { Features } from "@/components/landing/features";
import { WhoWeServe } from "@/components/landing/who-we-serve";
import { Solution } from "@/components/landing/solution";
import { RevenueCalculator } from "@/components/landing/calculator";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Founding100 } from "@/components/landing/founding-100";
import { Examples } from "@/components/landing/examples";
import { Faq, faqs } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { audiences } from "@/lib/audiences";
import { brand, siteUrl } from "@/lib/brand";
import { getDb } from "@/lib/db";
import { foundingCount } from "@/lib/server/leads";

type Variant = "A" | "B";

async function resolveVariant(searchParams: Promise<Record<string, string | string[] | undefined>>): Promise<Variant> {
  const q = (await searchParams).variant;
  if (q === "A" || q === "B") return q; // preview override: /?variant=B
  if (process.env.HERO_SPLIT_TEST === "true") {
    const c = (await cookies()).get("pm_hero")?.value;
    if (c === "A" || c === "B") return c;
  }
  return process.env.HERO_VARIANT === "B" ? "B" : "A";
}

/** Live enrollment is shown only when explicitly enabled and the database answers. */
async function enrolledCount(): Promise<number | null> {
  if (process.env.SHOW_FOUNDING_AVAILABILITY !== "true") return null;
  try {
    return await foundingCount(await getDb());
  } catch (err) {
    console.error("[founding] could not load enrollment count", err);
    return null;
  }
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const [variant, enrolled] = await Promise.all([resolveVariant(searchParams), enrolledCount()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#org`,
        name: brand.name,
        url: siteUrl,
        logo: `${siteUrl}/brand/icon.png`,
        image: `${siteUrl}/brand/lockup-dark.png`,
        description: brand.description,
        email: brand.contactEmail,
        areaServed: "US",
        knowsAbout: ["sports business technology", "registration automation", "sports marketing automation", "sports facility utilization"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand.name,
        publisher: { "@id": `${siteUrl}/#org` },
      },
      {
        "@type": "ProfessionalService",
        name: `${brand.name} Custom Sports Systems`,
        url: siteUrl,
        provider: { "@id": `${siteUrl}/#org` },
        areaServed: "US",
        serviceType: "Custom technology, automation and integrations for sports businesses",
        audience: audiences.map((a) => ({ "@type": "BusinessAudience", name: a.nav })),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", name: "First month free", url: `${siteUrl}/apply` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Header />
      <PageTracker variant={variant} />
      <main id="main">
        <Hero variant={variant} />
        <Features />
        <WhoWeServe />
        <Problems />
        <Solution />
        <RevenueCalculator />
        <HowItWorks />
        <Founding100 enrolled={enrolled} />
        <Examples />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
