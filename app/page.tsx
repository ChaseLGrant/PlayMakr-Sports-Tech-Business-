import { cookies } from "next/headers";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PageTracker } from "@/components/site/page-tracker";
import { Hero } from "@/components/landing/hero";
import { Problems } from "@/components/landing/problems";
import { Solution } from "@/components/landing/solution";
import { RevenueCalculator } from "@/components/landing/calculator";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Founding100 } from "@/components/landing/founding-100";
import { Examples } from "@/components/landing/examples";
import { Faq, faqs } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
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
        name: brand.name,
        url: siteUrl,
        description: brand.description,
        email: brand.contactEmail,
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
