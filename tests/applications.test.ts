import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type Db } from "@/lib/db/core";
import { submitApplication, APPLICATION_RATE_LIMIT } from "@/lib/server/applications";
import { funnelMetrics, getLead, setFoundingPartner, updateLeadStatus, listLeads, foundingCount } from "@/lib/server/leads";
import { authenticate, createSession, userForToken } from "@/lib/server/auth-core";
import { hashPassword } from "@/lib/server/password";
import { defaultCalculatorInputs } from "@/lib/calculator";
import { validApplication } from "./fixtures";

let db: Db;
let ipCounter = 0;
const ctx = () => ({ ip: `10.0.0.${++ipCounter}`, userAgent: "vitest" });

beforeAll(async () => {
  db = await createDb({ memory: true });
});
afterAll(async () => db.close());

describe("submitApplication", () => {
  it("stores a valid lead with a score and server-computed calculator results", async () => {
    const r = await submitApplication(
      db,
      validApplication({ calculator: { ...defaultCalculatorInputs }, attribution: { utm_source: "linkedin" } }),
      ctx(),
    );
    expect(r.ok).toBe(true);
    if (!r.ok || !r.lead) throw new Error("expected lead");
    const detail = await getLead(db, r.lead.id);
    expect(detail?.lead.organization_name).toBe("Riverside Youth Soccer Club");
    expect(detail?.lead.status).toBe("new");
    expect(detail?.lead.consent_marketing).toBe(false);
    expect(detail?.lead.score).toBe(r.lead.score);
    expect((detail?.lead.calculator_results as { totalOpportunity: number }).totalOpportunity).toBeGreaterThan(0);
    expect(detail?.lead.ip_hash).not.toContain("10.0.0");
    expect(detail?.history[0]?.to_status).toBe("new");
  });

  it("returns field errors for invalid input and stores nothing", async () => {
    const before = (await listLeads(db)).length;
    const r = await submitApplication(db, validApplication({ email: "bad" }), ctx());
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.status).toBe(400);
    expect(r.fieldErrors?.email).toBeDefined();
    expect((await listLeads(db)).length).toBe(before);
  });

  it("silently discards honeypot and too-fast submissions", async () => {
    const before = (await listLeads(db)).length;
    const hp = await submitApplication(db, validApplication({ company_fax: "spam" }), ctx());
    const fast = await submitApplication(db, validApplication({ startedAt: Date.now() }), ctx());
    expect(hp).toEqual({ ok: true, lead: null });
    expect(fast).toEqual({ ok: true, lead: null });
    expect((await listLeads(db)).length).toBe(before);
  });

  it("rate limits repeated submissions from one network", async () => {
    const c = ctx();
    for (let i = 0; i < APPLICATION_RATE_LIMIT.limit; i++) {
      expect((await submitApplication(db, validApplication(), c)).ok).toBe(true);
    }
    const blocked = await submitApplication(db, validApplication(), c);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.status).toBe(429);
  });
});

describe("lead pipeline", () => {
  it("records status history and funnel metrics", async () => {
    const r = await submitApplication(db, validApplication(), ctx());
    if (!r.ok || !r.lead) throw new Error("expected lead");
    await updateLeadStatus(db, r.lead.id, "audit_scheduled", "admin@test");
    await updateLeadStatus(db, r.lead.id, "won", "admin@test");
    const detail = await getLead(db, r.lead.id);
    expect(detail?.history.map((h) => h.to_status)).toEqual(["new", "audit_scheduled", "won"]);
    const m = await funnelMetrics(db);
    expect(m.auditBookings).toBeGreaterThanOrEqual(1);
    expect(m.closedCustomers).toBeGreaterThanOrEqual(1);
    expect(m.applicationCompletions).toBeGreaterThanOrEqual(1);
  });

  it("enforces the founding partner cap", async () => {
    const leads = await listLeads(db);
    expect(leads.length).toBeGreaterThanOrEqual(3);
    expect(await setFoundingPartner(db, leads[0]!.id, true, 2)).toEqual({ ok: true });
    expect(await setFoundingPartner(db, leads[1]!.id, true, 2)).toEqual({ ok: true });
    const third = await setFoundingPartner(db, leads[2]!.id, true, 2);
    expect(third.ok).toBe(false);
    expect(await foundingCount(db)).toBe(2);
    await setFoundingPartner(db, leads[0]!.id, false, 2);
    expect(await foundingCount(db)).toBe(1);
  });
});

describe("admin authentication", () => {
  it("accepts correct credentials, rejects wrong ones, and validates sessions", async () => {
    await db.query("insert into admin_users (email, name, password_hash) values ($1, $2, $3)", [
      "owner@playmakr.test",
      "Owner",
      await hashPassword("correct horse battery"),
    ]);
    const bad = await authenticate(db, "owner@playmakr.test", "wrong password!", "1.1.1.1");
    expect(bad.ok).toBe(false);
    const good = await authenticate(db, "Owner@PlayMakr.test", "correct horse battery", "1.1.1.1");
    expect(good.ok).toBe(true);
    if (!good.ok) return;
    const { token } = await createSession(db, good.user.id);
    expect((await userForToken(db, token))?.email).toBe("owner@playmakr.test");
    expect(await userForToken(db, "forged-token")).toBeNull();
    expect(await userForToken(db, undefined)).toBeNull();
  });
});
