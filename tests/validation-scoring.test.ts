import { describe, expect, it } from "vitest";
import { applicationSchema, stepSchemas } from "@/lib/validation";
import { scoreLead } from "@/lib/scoring";
import { validApplication } from "./fixtures";

describe("application validation", () => {
  it("accepts a complete application and normalizes the website and email", () => {
    const r = applicationSchema.parse(validApplication({ email: " Jordan@RiversideSoccer.org " }));
    expect(r.website).toBe("https://riversidesoccer.org");
    expect(r.email).toBe("jordan@riversidesoccer.org");
    expect(r.consentMarketing).toBe(false);
  });

  it("requires contact consent (never pre-assumed)", () => {
    const r = applicationSchema.safeParse(validApplication({ consentContact: false as unknown as true }));
    expect(r.success).toBe(false);
  });

  it("defaults marketing consent to false when omitted", () => {
    const { consentMarketing: _omit, ...rest } = validApplication();
    void _omit;
    expect(applicationSchema.parse(rest).consentMarketing).toBe(false);
  });

  it("rejects invalid emails, phones, websites and enum values", () => {
    expect(stepSchemas.contact.safeParse({ ...validApplication(), email: "nope" }).success).toBe(false);
    expect(stepSchemas.contact.safeParse({ ...validApplication(), phone: "abc" }).success).toBe(false);
    expect(stepSchemas.organization.safeParse({ ...validApplication(), website: "not a site" }).success).toBe(false);
    expect(stepSchemas.size.safeParse({ ...validApplication(), annualRevenue: "a_lot" }).success).toBe(false);
  });

  it("validates each step independently", () => {
    expect(stepSchemas.organization.safeParse(validApplication()).success).toBe(true);
    expect(stepSchemas.challenges.safeParse({ ...validApplication(), biggestProblem: "short" }).success).toBe(false);
  });
});

describe("lead scoring", () => {
  const input = (o = {}) => ({ ...applicationSchema.parse(validApplication(o)), hasCalculator: true });

  it("scores an ideal-fit organization as high", () => {
    const s = scoreLead(input());
    expect(s.tier).toBe("high");
    expect(s.score).toBeGreaterThanOrEqual(70);
    expect(s.score).toBeLessThanOrEqual(100);
  });

  it("scores a very small organization with a non-decision-maker as low", () => {
    const s = scoreLead({
      ...input({ annualRevenue: "under_250k", employees: "1_5", locations: "1", customers: "under_250", monthlyTechSpend: "under_500", jobTitle: "Volunteer", email: "x@gmail.com", website: "" }),
      hasCalculator: false,
    });
    expect(s.tier).toBe("low");
    expect(s.flags.length).toBeGreaterThanOrEqual(2);
  });

  it("recognizes decision-maker titles", () => {
    const owner = scoreLead(input({ jobTitle: "Owner" })).breakdown.find((b) => b.factor === "Decision-maker");
    const coach = scoreLead(input({ jobTitle: "Assistant Coach" })).breakdown.find((b) => b.factor === "Decision-maker");
    expect(owner!.points).toBe(15);
    expect(coach!.points).toBeLessThan(15);
  });

  it("breakdown maxes sum to 100", () => {
    expect(scoreLead(input()).breakdown.reduce((s, b) => s + b.max, 0)).toBe(100);
  });
});

import { clientEventSchema } from "@/lib/server/analytics";

describe("analytics events", () => {
  it("accepts funnel events from the browser", () => {
    expect(clientEventSchema.safeParse({ name: "calculator_start", sessionId: "abc" }).success).toBe(true);
  });
  it("rejects outcome events the browser must not be able to fake", () => {
    for (const name of ["application_complete", "qualified_application", "audit_booked", "customer_won"]) {
      expect(clientEventSchema.safeParse({ name }).success).toBe(false);
    }
  });
  it("limits property count", () => {
    const props = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`k${i}`, i]));
    expect(clientEventSchema.safeParse({ name: "cta_click", props }).success).toBe(false);
  });
});
