import { brand, calendarUrl, siteUrl } from "../brand";
import { labelFor, organizationTypes, revenueOptions } from "../options";
import { formatCurrency } from "../calculator";

/**
 * Notification channels. Each is OFF until its environment variables are set,
 * and a failure in one never blocks saving the lead.
 *
 * Email: Resend (https://resend.com) — RESEND_API_KEY + EMAIL_FROM.
 *   Swap sendEmail() for another provider (Postmark, SES, SendGrid) if preferred.
 * Owner alerts: LEAD_NOTIFICATION_EMAIL and/or SLACK_WEBHOOK_URL.
 */

export type LeadSummary = {
  id: string;
  organizationName: string;
  organizationType: string;
  annualRevenue: string;
  contactName: string;
  email: string;
  jobTitle: string;
  score: number;
  tier: string;
  totalOpportunity?: number | null;
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(msg: { to: string; subject: string; text: string; html: string; replyTo?: string }) {
  if (!emailConfigured()) return { sent: false as const, reason: "not_configured" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      reply_to: msg.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}: ${await res.text()}`);
  return { sent: true as const };
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function notifyNewLead(lead: LeadSummary): Promise<void> {
  const adminUrl = `${siteUrl}/admin/leads/${lead.id}`;
  const lines = [
    `${lead.organizationName} (${labelFor(organizationTypes, lead.organizationType)})`,
    `Revenue: ${labelFor(revenueOptions, lead.annualRevenue)}`,
    `Score: ${lead.score}/100 (${lead.tier})`,
    lead.totalOpportunity ? `Calculator estimate: ${formatCurrency(lead.totalOpportunity)}/yr` : null,
    `Contact: ${lead.contactName}, ${lead.jobTitle}`,
  ].filter(Boolean) as string[];

  const tasks: Promise<unknown>[] = [];

  const ownerEmail = process.env.LEAD_NOTIFICATION_EMAIL;
  if (ownerEmail && emailConfigured()) {
    tasks.push(
      sendEmail({
        to: ownerEmail,
        subject: `New audit application: ${lead.organizationName} (score ${lead.score})`,
        replyTo: lead.email,
        text: `${lines.join("\n")}\nEmail: ${lead.email}\n\nReview: ${adminUrl}`,
        html: `<p>${lines.map(esc).join("<br>")}<br>Email: ${esc(lead.email)}</p><p><a href="${adminUrl}">Open in admin</a></p>`,
      }),
    );
  }

  const slack = process.env.SLACK_WEBHOOK_URL;
  if (slack) {
    // Keep Slack free of contact details; the link requires an admin login.
    tasks.push(
      fetch(slack, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New audit application — ${lead.organizationName} · score ${lead.score} (${lead.tier})\n${adminUrl}`,
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Slack webhook responded ${r.status}`);
      }),
    );
  }

  if (emailConfigured()) {
    const first = lead.contactName.split(" ")[0] || lead.contactName;
    const schedule = calendarUrl
      ? `If you'd like to skip the back-and-forth, you can pick a time for your audit call here: ${calendarUrl}`
      : "We'll reach out within two business days to schedule your audit call.";
    tasks.push(
      sendEmail({
        to: lead.email,
        subject: `We received your ${brand.programName} audit application`,
        replyTo: brand.contactEmail,
        text: `Hi ${first},\n\nThanks for applying for a free Sports Technology & Revenue Audit for ${lead.organizationName}. Our team reviews every application personally.\n\n${schedule}\n\n— The ${brand.name} team`,
        html: `<p>Hi ${esc(first)},</p><p>Thanks for applying for a free Sports Technology &amp; Revenue Audit for ${esc(lead.organizationName)}. Our team reviews every application personally.</p><p>${
          calendarUrl
            ? `If you'd like to skip the back-and-forth, you can <a href="${esc(calendarUrl)}">pick a time for your audit call</a>.`
            : "We'll reach out within two business days to schedule your audit call."
        }</p><p>— The ${esc(brand.name)} team</p>`,
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error("[notify] delivery failed", r.reason);
  }
  if (tasks.length === 0) {
    console.info(`[notify] New lead ${lead.id} saved. No notification channels configured.`);
  }
}
