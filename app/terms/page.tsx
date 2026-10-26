import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Website Terms" updated="October 2026">
      <h2>Estimates are illustrative</h2>
      <p>
        The Revenue Leakage Calculator produces estimates based only on the values you enter. Its results are not a
        guarantee, forecast, or professional financial advice, and actual results will vary.
      </p>
      <h2>Example interfaces</h2>
      <p>
        Interface examples on this website are conceptual demonstrations using sample data. They do not represent
        completed client projects or actual client results.
      </p>
      <h2>The Founding 100 program</h2>
      <ul>
        <li>Enrollment is limited to 100 organizations that {brand.name} accepts as founding partners. Submitting an application does not guarantee acceptance.</li>
        <li>The preliminary audit is provided free of charge with no obligation.</li>
        <li>Custom implementation is a separate paid service. Scope, pricing (including any preferred founding partner pricing), timelines, ownership and support terms are defined in a written proposal and agreement.</li>
        <li>30 days of complimentary post-launch optimization applies only to contracted implementation projects, as described in the applicable agreement.</li>
      </ul>
      <h2>Contact</h2>
      <p>{brand.contactEmail}</p>
    </LegalPage>
  );
}
