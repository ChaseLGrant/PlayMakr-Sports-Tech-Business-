import { describe, expect, it } from "vitest";
import { calculateOpportunity, defaultCalculatorInputs, type CalculatorInputs } from "@/lib/calculator";

const base: CalculatorInputs = {
  annualRevenue: 1_000_000,
  monthlyLeads: 100,
  currentConversionPct: 10,
  targetConversionPct: 15,
  avgCustomerValue: 1000,
  weeklyAdminHours: 40,
  hourlyLaborCost: 25,
  automatablePct: 50,
  cashRealizationPct: 20,
  monthlyRedundantSoftware: 500,
};

describe("calculateOpportunity", () => {
  it("computes each component with transparent formulas", () => {
    const r = calculateOpportunity(base);
    // 100 leads * 12 months * 5 points = 60 extra customers
    expect(r.additionalCustomersPerYear).toBeCloseTo(60);
    expect(r.additionalRevenue).toBeCloseTo(60_000);
    // 40 h * 52 wk * 50% = 1,040 h
    expect(r.hoursFreedPerYear).toBeCloseTo(1040);
    expect(r.laborCapacityValue).toBeCloseTo(26_000);
    // only 20% of capacity counts as cash
    expect(r.laborCashSavings).toBeCloseTo(5_200);
    expect(r.softwareSavings).toBe(6_000);
  });

  it("does not double count labor capacity in the total", () => {
    const r = calculateOpportunity(base);
    expect(r.totalOpportunity).toBeCloseTo(60_000 + 5_200 + 6_000);
    expect(r.totalOpportunity).toBeLessThan(r.additionalRevenue + r.laborCapacityValue + r.softwareSavings);
  });

  it("never produces negative revenue when target is below current", () => {
    const r = calculateOpportunity({ ...base, targetConversionPct: 5 });
    expect(r.additionalRevenue).toBe(0);
    expect(r.warnings.join(" ")).toMatch(/below current/);
  });

  it("reports percentage of revenue and handles zero revenue", () => {
    expect(calculateOpportunity(base).opportunityPctOfRevenue).toBeCloseTo(7.12);
    expect(calculateOpportunity({ ...base, annualRevenue: 0 }).opportunityPctOfRevenue).toBeNull();
  });

  it("warns when the estimate looks aggressive", () => {
    const r = calculateOpportunity({ ...base, annualRevenue: 100_000 });
    expect(r.warnings.some((w) => w.includes("30%"))).toBe(true);
  });

  it("zero cash realization means labor adds nothing to the total", () => {
    const r = calculateOpportunity({ ...base, cashRealizationPct: 0 });
    expect(r.laborCashSavings).toBe(0);
    expect(r.laborCapacityValue).toBeGreaterThan(0);
  });

  it("rejects out-of-range inputs", () => {
    expect(() => calculateOpportunity({ ...base, currentConversionPct: 140 })).toThrow();
    expect(() => calculateOpportunity({ ...base, monthlyLeads: -1 })).toThrow();
  });

  it("defaults produce a sane, positive estimate", () => {
    const r = calculateOpportunity(defaultCalculatorInputs);
    expect(r.totalOpportunity).toBeGreaterThan(0);
    expect(r.warnings).toHaveLength(0);
  });
});
