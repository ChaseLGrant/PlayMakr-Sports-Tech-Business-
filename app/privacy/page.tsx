import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        This policy explains how {brand.legalName} (“{brand.name}”, “we”) collects and uses information when you visit
        our website or apply for an audit.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Application details you provide: organization information, business size ranges, challenges, and contact details (name, work email, phone, job title).</li>
        <li>Calculator inputs, if you choose to include them with your application.</li>
        <li>Marketing attribution, such as the campaign parameters (UTM tags) and referring website that brought you here.</li>
        <li>Anonymous usage events (for example page views and button clicks), linked to a random identifier that resets when you close your browser tab.</li>
        <li>A one-way hashed version of your IP address, used for rate limiting and abuse prevention. We do not store your raw IP address with your application.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To review your application, contact you about your audit and prepare recommendations.</li>
        <li>To send marketing emails, but only if you opted in. You can unsubscribe at any time.</li>
        <li>To understand which pages and campaigns are useful, and to improve the website.</li>
        <li>To protect the website from spam and abuse.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We use service providers to host our website and database and to send
        email. They process data on our behalf under their own security and privacy commitments.
      </p>
      <h2>Retention</h2>
      <p>
        We keep application information for as long as needed to evaluate and serve your organization, or until you ask us
        to delete it.
      </p>
      <h2>Your choices</h2>
      <p>
        You may request access to, correction of, or deletion of your information by emailing{" "}
        <a className="text-electric-700 underline" href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>.
      </p>
      <h2>Children’s information</h2>
      <p>
        This website is intended for adult business decision-makers. Please do not submit personal information about
        athletes or minors through the application form.
      </p>
      <h2>Contact</h2>
      <p>Questions about this policy: {brand.contactEmail}</p>
    </LegalPage>
  );
}
