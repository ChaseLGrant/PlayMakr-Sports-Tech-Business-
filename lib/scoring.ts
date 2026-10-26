import type { Application } from "./validation";

/**
 * Lead qualification score (0–100). Weighted toward the ideal customer:
 * established organizations with real budgets, multiple staff, recurring
 * customers, and a decision-maker filling out the form.
 *
 * Adjust weights here; the admin dashboard shows the breakdown for every lead.
 */

type ScoreInput = Pick<
  Application,
  | "annualRevenue"
  | "employees"
  | "locations"
  | "customers"
  | "monthlyTechSpend"
  | "jobTitle"
  | "organizationType"
  | "email"
  | "website"
> & { hasCalculator: boolean };

export type ScoreBreakdown = { factor: string; points: number; max: number; note?: string }[];
export type ScoreTier = "high" | "medium" | "low";
export type LeadScore = { score: number; tier: ScoreTier; breakdown: ScoreBreakdown; flags: string[] };

const revenuePoints: Record<string, number> = {
  under_250k: 2,
  "250k_1m": 9,
  "1m_3m": 17,
  "3m_10m": 23,
  "10m_plus": 25,
};
const employeePoints: Record<string, number> = { "1_5": 2, "6_15": 7, "16_50": 12, "51_200": 15, "200_plus": 15 };
const locationPoints: Record<string, number> = { "1": 3, "2_3": 7, "4_10": 10, "11_plus": 10 };
const customerPoints: Record<string, number> = { under_250: 2, "250_1000": 5, "1000_5000": 8, "5000_plus": 10 };
const spendPoints: Record<string, number> = {
  under_500: 2,
  "500_2000": 5,
  "2000_5000": 8,
  "5000_plus": 10,
  unsure: 4,
};
const coreTypes = new Set(["youth_club", "multi_facility", "academy", "tournament", "training", "club_sports"]);

const DECISION_MAKER =
  /\b(owner|co-?owner|founder|co-?founder|ceo|coo|cfo|cto|chief|president|executive director|managing director|director|general manager|gm|vp|vice president|partner|principal|head of)\b/i;
const MANAGER = /\b(manager|lead|coordinator|administrator|head coach)\b/i;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|aol|icloud|proton(mail)?|live|msn)\./i;

export function scoreLead(input: ScoreInput): LeadScore {
  const breakdown: ScoreBreakdown = [];
  const flags: string[] = [];

  breakdown.push({ factor: "Annual revenue", points: revenuePoints[input.annualRevenue] ?? 0, max: 25 });
  breakdown.push({ factor: "Employees", points: employeePoints[input.employees] ?? 0, max: 15 });
  breakdown.push({ factor: "Locations", points: locationPoints[input.locations] ?? 0, max: 10 });
  breakdown.push({ factor: "Customers / athletes", points: customerPoints[input.customers] ?? 0, max: 10 });
  breakdown.push({ factor: "Technology spend", points: spendPoints[input.monthlyTechSpend] ?? 0, max: 10 });

  let rolePoints = 3;
  let roleNote = "Not a listed decision-maker title";
  if (DECISION_MAKER.test(input.jobTitle)) {
    rolePoints = 15;
    roleNote = "Decision-maker title";
  } else if (MANAGER.test(input.jobTitle)) {
    rolePoints = 8;
    roleNote = "Manager-level title";
  }
  breakdown.push({ factor: "Decision-maker", points: rolePoints, max: 15, note: roleNote });

  breakdown.push({
    factor: "Organization fit",
    points: coreTypes.has(input.organizationType) ? 10 : input.organizationType === "other" ? 4 : 7,
    max: 10,
  });

  // Engagement & legitimacy signals (max 5)
  let signal = 0;
  if (input.hasCalculator) signal += 2;
  if (input.website) signal += 2;
  if (!FREE_MAIL.test(input.email)) signal += 1;
  breakdown.push({ factor: "Engagement signals", points: signal, max: 5, note: "Calculator, website, work email" });

  if (input.annualRevenue === "under_250k") flags.push("Revenue under $250K — may be below ideal fit.");
  if (FREE_MAIL.test(input.email)) flags.push("Personal email address.");
  if (rolePoints < 15) flags.push("Confirm decision-maker involvement.");

  const score = Math.min(100, breakdown.reduce((s, b) => s + b.points, 0));
  const tier: ScoreTier = score >= 70 ? "high" : score >= 45 ? "medium" : "low";
  return { score, tier, breakdown, flags };
}
