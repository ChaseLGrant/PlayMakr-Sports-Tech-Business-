import type { Db } from "../db/core";
import { calculateOpportunity } from "../calculator";
import { scoreLead } from "../scoring";
import { applicationSchema, CONSENT_VERSION, fieldErrors } from "../validation";
import { hashIp, MIN_FILL_SECONDS, rateLimit, verifyTurnstile } from "./security";
import { recordEvent } from "./analytics";
import type { LeadSummary } from "./notify";

export type SubmitResult =
  | { ok: true; lead: LeadSummary | null }
  | { ok: false; status: number; error: string; fieldErrors?: Record<string, string> };

export type SubmitContext = { ip: string; userAgent?: string | null; now?: number };

export const APPLICATION_RATE_LIMIT = { limit: 5, windowSeconds: 3600 };

/**
 * Validates, scores and stores an application. Pure of HTTP concerns so it can
 * be tested directly. Returns `lead: null` when a submission is silently
 * discarded as spam (bots get a normal-looking success response).
 */
export async function submitApplication(db: Db, body: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;
  const ipHash = hashIp(ctx.ip);

  const allowed = await rateLimit(db, `apply:${ipHash}`, APPLICATION_RATE_LIMIT.limit, APPLICATION_RATE_LIMIT.windowSeconds);
  if (!allowed) {
    return { ok: false, status: 429, error: "Too many applications from this network. Please try again later or email us." };
  }

  // Honeypot or impossibly fast submissions: pretend success, store nothing.
  const now = ctx.now ?? Date.now();
  const tooFast = typeof data.startedAt === "number" && now - data.startedAt < MIN_FILL_SECONDS * 1000;
  if (data.company_fax || tooFast) return { ok: true, lead: null };

  if (!(await verifyTurnstile(data.turnstileToken, ctx.ip))) {
    return { ok: false, status: 400, error: "We couldn't verify you're human. Please refresh and try again." };
  }

  // Recompute calculator results server-side; never trust client numbers.
  const calcResults = data.calculator ? calculateOpportunity(data.calculator) : null;
  const score = scoreLead({ ...data, hasCalculator: Boolean(data.calculator) });

  const { rows } = await db.query<{ id: string }>(
    `insert into leads (
      organization_name, website, organization_type, locations,
      annual_revenue, employees, customers,
      biggest_problem, current_software, desired_outcome, monthly_tech_spend,
      contact_name, email, phone, job_title,
      consent_contact, consent_marketing, consent_version,
      score, score_tier, score_breakdown, score_flags,
      calculator_inputs, calculator_results, attribution, hero_variant,
      ip_hash, user_agent
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
    returning id`,
    [
      data.organizationName, data.website ?? null, data.organizationType, data.locations,
      data.annualRevenue, data.employees, data.customers,
      data.biggestProblem, data.currentSoftware ?? null, data.desiredOutcome, data.monthlyTechSpend,
      data.contactName, data.email, data.phone ?? null, data.jobTitle,
      data.consentContact, data.consentMarketing, CONSENT_VERSION,
      score.score, score.tier, JSON.stringify(score.breakdown), JSON.stringify(score.flags),
      data.calculator ? JSON.stringify(data.calculator) : null,
      calcResults ? JSON.stringify(calcResults) : null,
      data.attribution ? JSON.stringify(data.attribution) : null,
      data.heroVariant ?? null,
      ipHash, ctx.userAgent?.slice(0, 300) ?? null,
    ],
  );
  const id = rows[0]!.id;

  await db.query(
    "insert into lead_status_history (lead_id, from_status, to_status, changed_by) values ($1, null, 'new', 'system')",
    [id],
  );
  await recordEvent(db, {
    name: "application_complete",
    sessionId: data.sessionId,
    variant: data.heroVariant,
    path: "/apply",
    props: { tier: score.tier, source: data.attribution?.utm_source ?? null },
  });
  if (score.tier === "high") {
    await recordEvent(db, { name: "qualified_application", sessionId: data.sessionId, variant: data.heroVariant });
  }

  return {
    ok: true,
    lead: {
      id,
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      annualRevenue: data.annualRevenue,
      contactName: data.contactName,
      email: data.email,
      jobTitle: data.jobTitle,
      score: score.score,
      tier: score.tier,
      totalOpportunity: calcResults?.totalOpportunity ?? null,
    },
  };
}
