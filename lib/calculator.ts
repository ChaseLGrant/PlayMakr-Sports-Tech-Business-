import { z } from "zod";

/**
 * Revenue Leakage Calculator.
 *
 * Every output is an illustrative estimate built from the visitor's own inputs.
 * Formulas are intentionally simple so they can be shown on the page verbatim.
 *
 * Avoiding double counting:
 *  - Revenue uplift only counts NEW customers from the same lead volume.
 *  - Labor is split into "capacity" (hours freed, valued at cost) and
 *    "cash savings" (only the share the visitor says would actually reduce
 *    payroll, overtime or contractor spend). Only cash savings go into the total.
 *  - Software savings use only the spend the visitor marks as redundant.
 */

export const calculatorInputSchema = z.object({
  annualRevenue: z.number().min(0).max(1_000_000_000),
  monthlyLeads: z.number().min(0).max(1_000_000),
  currentConversionPct: z.number().min(0).max(100),
  targetConversionPct: z.number().min(0).max(100),
  avgCustomerValue: z.number().min(0).max(10_000_000),
  weeklyAdminHours: z.number().min(0).max(10_000),
  hourlyLaborCost: z.number().min(0).max(1_000),
  automatablePct: z.number().min(0).max(100),
  cashRealizationPct: z.number().min(0).max(100),
  monthlyRedundantSoftware: z.number().min(0).max(10_000_000),
});

export type CalculatorInputs = z.infer<typeof calculatorInputSchema>;

export const defaultCalculatorInputs: CalculatorInputs = {
  annualRevenue: 2_500_000,
  monthlyLeads: 120,
  currentConversionPct: 18,
  targetConversionPct: 24,
  avgCustomerValue: 1_400,
  weeklyAdminHours: 60,
  hourlyLaborCost: 28,
  automatablePct: 30,
  cashRealizationPct: 25,
  monthlyRedundantSoftware: 600,
};

export type CalculatorResults = {
  additionalCustomersPerYear: number;
  additionalRevenue: number;
  hoursFreedPerYear: number;
  laborCapacityValue: number;
  laborCashSavings: number;
  softwareSavings: number;
  totalOpportunity: number;
  /** Total as a share of annual revenue, or null when revenue is 0. */
  opportunityPctOfRevenue: number | null;
  warnings: string[];
};

const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

export function calculateOpportunity(raw: CalculatorInputs): CalculatorResults {
  const i = calculatorInputSchema.parse(raw);
  const warnings: string[] = [];

  // 1. Revenue from improved conversion. Never negative.
  const conversionLift = Math.max(0, i.targetConversionPct - i.currentConversionPct) / 100;
  const additionalCustomersPerYear = i.monthlyLeads * MONTHS_PER_YEAR * conversionLift;
  const additionalRevenue = additionalCustomersPerYear * i.avgCustomerValue;

  if (i.targetConversionPct < i.currentConversionPct) {
    warnings.push("Achievable conversion is below current conversion, so revenue uplift is set to $0.");
  }

  // 2. Labor capacity (hours freed) vs. cash actually saved.
  const hoursFreedPerYear = i.weeklyAdminHours * WEEKS_PER_YEAR * (i.automatablePct / 100);
  const laborCapacityValue = hoursFreedPerYear * i.hourlyLaborCost;
  const laborCashSavings = laborCapacityValue * (i.cashRealizationPct / 100);

  // 3. Software subscriptions that could be removed.
  const softwareSavings = i.monthlyRedundantSoftware * MONTHS_PER_YEAR;

  // 4. Total — cash-relevant items only (capacity value is reported separately).
  const totalOpportunity = additionalRevenue + laborCashSavings + softwareSavings;

  const opportunityPctOfRevenue =
    i.annualRevenue > 0 ? (totalOpportunity / i.annualRevenue) * 100 : null;

  if (opportunityPctOfRevenue !== null && opportunityPctOfRevenue > 30) {
    warnings.push(
      "This estimate is more than 30% of annual revenue. Double-check your assumptions — they may be optimistic.",
    );
  }
  if (i.weeklyAdminHours > 0 && i.automatablePct > 60) {
    warnings.push("Automating more than 60% of admin time is uncommon. Consider a more conservative percentage.");
  }

  return {
    additionalCustomersPerYear,
    additionalRevenue,
    hoursFreedPerYear,
    laborCapacityValue,
    laborCashSavings,
    softwareSavings,
    totalOpportunity,
    opportunityPctOfRevenue,
    warnings,
  };
}

export function formatCurrency(n: number, compact = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact && Math.abs(n) >= 1000 ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export const calculatorInputLabels: Record<keyof CalculatorInputs, string> = {
  annualRevenue: "Annual business revenue ($)",
  monthlyLeads: "Monthly lead volume",
  currentConversionPct: "Current conversion rate (%)",
  targetConversionPct: "Achievable conversion rate (%)",
  avgCustomerValue: "Avg. first-year customer value ($)",
  weeklyAdminHours: "Weekly admin hours",
  hourlyLaborCost: "Hourly labor cost ($)",
  automatablePct: "Admin time eliminated (%)",
  cashRealizationPct: "Freed time realized as cash (%)",
  monthlyRedundantSoftware: "Monthly redundant software ($)",
};

/** sessionStorage key used to carry calculator inputs into the application. */
export const CALC_STORAGE_KEY = "pm_calc";
