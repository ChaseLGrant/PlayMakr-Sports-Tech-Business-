import type { Db, Queryable } from "../db/core";
import { brand } from "../brand";
import { leadStatuses, type LeadStatus } from "../options";
import { recordEvent } from "./analytics";

export type LeadListItem = {
  id: string;
  created_at: string;
  status: LeadStatus;
  organization_name: string;
  organization_type: string;
  annual_revenue: string;
  contact_name: string;
  job_title: string;
  score: number;
  score_tier: string;
  founding_partner: boolean;
  total_opportunity: number | null;
  source: string | null;
  open_tasks: number;
};

export type LeadFilters = { status?: string; tier?: string; q?: string };

export async function listLeads(db: Queryable, f: LeadFilters = {}, limit = 200): Promise<LeadListItem[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (f.status && leadStatuses.some((s) => s.value === f.status)) {
    params.push(f.status);
    where.push(`l.status = $${params.length}`);
  }
  if (f.tier && ["high", "medium", "low"].includes(f.tier)) {
    params.push(f.tier);
    where.push(`l.score_tier = $${params.length}`);
  }
  if (f.q) {
    params.push(`%${f.q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`);
    where.push(`(l.organization_name ilike $${params.length} or l.contact_name ilike $${params.length} or l.email ilike $${params.length})`);
  }
  params.push(limit);
  const { rows } = await db.query<LeadListItem>(
    `select l.id, l.created_at, l.status, l.organization_name, l.organization_type, l.annual_revenue,
            l.contact_name, l.job_title, l.score, l.score_tier, l.founding_partner,
            (l.calculator_results->>'totalOpportunity')::float8 as total_opportunity,
            coalesce(l.attribution->>'utm_source', nullif(l.attribution->>'referrer', '')) as source,
            (select count(*)::int from lead_tasks t where t.lead_id = l.id and t.completed_at is null) as open_tasks
     from leads l
     ${where.length ? `where ${where.join(" and ")}` : ""}
     order by l.created_at desc
     limit $${params.length}`,
    params,
  );
  return rows;
}

export type LeadDetail = Record<string, unknown> & {
  id: string;
  status: LeadStatus;
  organization_name: string;
  founding_partner: boolean;
};

export async function getLead(db: Queryable, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { rows } = await db.query<LeadDetail>("select * from leads where id = $1", [id]);
  const lead = rows[0];
  if (!lead) return null;
  const [notes, tasks, history] = await Promise.all([
    db.query<{ id: string; author: string; body: string; created_at: string }>(
      "select id, author, body, created_at from lead_notes where lead_id = $1 order by created_at desc",
      [id],
    ),
    db.query<{ id: string; title: string; due_date: string | null; completed_at: string | null; author: string }>(
      "select id, title, due_date::text, completed_at, author from lead_tasks where lead_id = $1 order by completed_at nulls first, due_date nulls last, created_at",
      [id],
    ),
    db.query<{ from_status: string | null; to_status: string; changed_by: string; created_at: string }>(
      "select from_status, to_status, changed_by, created_at from lead_status_history where lead_id = $1 order by created_at",
      [id],
    ),
  ]);
  return { lead, notes: notes.rows, tasks: tasks.rows, history: history.rows };
}

export async function updateLeadStatus(db: Db, id: string, status: LeadStatus, by: string) {
  if (!leadStatuses.some((s) => s.value === status)) throw new Error("Invalid status");
  await db.transaction(async (tx) => {
    const { rows } = await tx.query<{ status: string }>("select status from leads where id = $1 for update", [id]);
    const from = rows[0]?.status;
    if (!from) throw new Error("Lead not found");
    if (from === status) return;
    await tx.query("update leads set status = $2, updated_at = now() where id = $1", [id, status]);
    await tx.query(
      "insert into lead_status_history (lead_id, from_status, to_status, changed_by) values ($1, $2, $3, $4)",
      [id, from, status, by],
    );
    if (status === "audit_scheduled") await recordEvent(tx, { name: "audit_booked", props: { lead: id } });
    if (status === "won") await recordEvent(tx, { name: "customer_won", props: { lead: id } });
  });
}

export async function addNote(db: Queryable, leadId: string, body: string, author: string) {
  const text = body.trim().slice(0, 5000);
  if (!text) return;
  await db.query("insert into lead_notes (lead_id, author, body) values ($1, $2, $3)", [leadId, author, text]);
}

export async function addTask(db: Queryable, leadId: string, title: string, due: string | null, author: string) {
  const t = title.trim().slice(0, 300);
  if (!t) return;
  const dueDate = due && /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : null;
  await db.query("insert into lead_tasks (lead_id, title, due_date, author) values ($1, $2, $3, $4)", [
    leadId,
    t,
    dueDate,
    author,
  ]);
}

export async function toggleTask(db: Queryable, taskId: string, done: boolean) {
  await db.query("update lead_tasks set completed_at = case when $2 then now() else null end where id = $1", [
    taskId,
    done,
  ]);
}

export async function foundingCount(db: Queryable): Promise<number> {
  const { rows } = await db.query<{ n: number }>("select count(*)::int as n from leads where founding_partner");
  return rows[0]?.n ?? 0;
}

/**
 * Enrolls a lead as a Founding Partner. The cap is enforced inside a
 * transaction with an advisory lock so it can never exceed brand.foundingCap.
 */
export async function setFoundingPartner(
  db: Db,
  leadId: string,
  enroll: boolean,
  cap = brand.foundingCap,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return db.transaction(async (tx) => {
    await tx.query("select pg_advisory_xact_lock(100100)");
    if (enroll) {
      const n = await foundingCount(tx);
      if (n >= cap) return { ok: false as const, error: `All ${cap} founding partner spots are filled.` };
      await tx.query(
        "update leads set founding_partner = true, founding_enrolled_at = coalesce(founding_enrolled_at, now()), updated_at = now() where id = $1",
        [leadId],
      );
    } else {
      await tx.query(
        "update leads set founding_partner = false, founding_enrolled_at = null, updated_at = now() where id = $1",
        [leadId],
      );
    }
    return { ok: true as const };
  });
}

export type FunnelMetrics = {
  visits: number;
  uniqueSessions: number;
  ctaClicks: number;
  calculatorStarts: number;
  calculatorCompletions: number;
  applicationStarts: number;
  applicationCompletions: number;
  qualifiedApplications: number;
  auditBookings: number;
  closedCustomers: number;
  foundingPartners: number;
  totalLeads: number;
  newLeads: number;
  byVariant: { variant: string; visits: number; completions: number }[];
  bySource: { source: string; leads: number }[];
};

export async function funnelMetrics(db: Queryable, days = 30): Promise<FunnelMetrics> {
  const ev = await db.query<{ name: string; n: number; s: number }>(
    `select name, count(*)::int as n, count(distinct session_id)::int as s
     from analytics_events where created_at > now() - make_interval(days => $1) group by name`,
    [days],
  );
  const count = (name: string) => ev.rows.find((r) => r.name === name)?.n ?? 0;
  const sessions = (name: string) => ev.rows.find((r) => r.name === name)?.s ?? 0;

  const leadStats = await db.query<{ total: number; new_leads: number; qualified: number; booked: number; won: number }>(
    `select count(*)::int as total,
            count(*) filter (where status = 'new')::int as new_leads,
            count(*) filter (where score_tier = 'high' or status in ('qualified','audit_scheduled','audit_completed','proposal_sent','won'))::int as qualified,
            count(*) filter (where exists (select 1 from lead_status_history h where h.lead_id = leads.id and h.to_status = 'audit_scheduled'))::int as booked,
            count(*) filter (where status = 'won')::int as won
     from leads where created_at > now() - make_interval(days => $1)`,
    [days],
  );
  const variants = await db.query<{ variant: string; visits: number; completions: number }>(
    `select coalesce(variant, 'A') as variant,
            count(*) filter (where name = 'page_view')::int as visits,
            count(*) filter (where name = 'application_complete')::int as completions
     from analytics_events where created_at > now() - make_interval(days => $1)
     group by 1 order by 1`,
    [days],
  );
  const sources = await db.query<{ source: string; leads: number }>(
    `select coalesce(attribution->>'utm_source', case when attribution->>'referrer' <> '' then 'referral' end, 'direct') as source,
            count(*)::int as leads
     from leads where created_at > now() - make_interval(days => $1) group by 1 order by 2 desc limit 8`,
    [days],
  );
  const ls = leadStats.rows[0]!;
  return {
    visits: count("page_view"),
    uniqueSessions: sessions("page_view"),
    ctaClicks: count("cta_click"),
    calculatorStarts: sessions("calculator_start"),
    calculatorCompletions: sessions("calculator_complete"),
    applicationStarts: sessions("application_start"),
    applicationCompletions: ls.total,
    qualifiedApplications: ls.qualified,
    auditBookings: ls.booked,
    closedCustomers: ls.won,
    foundingPartners: await foundingCount(db),
    totalLeads: ls.total,
    newLeads: ls.new_leads,
    byVariant: variants.rows,
    bySource: sources.rows,
  };
}
