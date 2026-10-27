/** Answer choices for the application form. Values are stored in the database. */

type Option<V extends string = string> = { value: V; label: string };

const opts = <const T extends readonly Option[]>(o: T) => o;

export const organizationTypes = opts([
  { value: "youth_club", label: "Youth sports club or organization" },
  { value: "multi_facility", label: "Multi-location sports facility" },
  { value: "single_facility", label: "Single-location sports facility" },
  { value: "academy", label: "Sports academy" },
  { value: "tournament", label: "Tournament or showcase operator" },
  { value: "training", label: "Sports training company" },
  { value: "club_sports", label: "Club sports organization" },
  { value: "league", label: "League or association" },
  { value: "camp_clinic", label: "Camp or clinic" },
  { value: "university", label: "University or college athletics" },
  { value: "other", label: "Other sports business" },
] as const);

export const locationOptions = opts([
  { value: "1", label: "1 location" },
  { value: "2_3", label: "2–3 locations" },
  { value: "4_10", label: "4–10 locations" },
  { value: "11_plus", label: "11+ locations" },
] as const);

export const revenueOptions = opts([
  { value: "under_250k", label: "Under $250K" },
  { value: "250k_1m", label: "$250K – $1M" },
  { value: "1m_3m", label: "$1M – $3M" },
  { value: "3m_10m", label: "$3M – $10M" },
  { value: "10m_plus", label: "$10M+" },
] as const);

export const employeeOptions = opts([
  { value: "1_5", label: "1–5" },
  { value: "6_15", label: "6–15" },
  { value: "16_50", label: "16–50" },
  { value: "51_200", label: "51–200" },
  { value: "200_plus", label: "200+" },
] as const);

export const customerOptions = opts([
  { value: "under_250", label: "Under 250" },
  { value: "250_1000", label: "250 – 1,000" },
  { value: "1000_5000", label: "1,000 – 5,000" },
  { value: "5000_plus", label: "5,000+" },
] as const);

export const techSpendOptions = opts([
  { value: "under_500", label: "Under $500 / month" },
  { value: "500_2000", label: "$500 – $2,000 / month" },
  { value: "2000_5000", label: "$2,000 – $5,000 / month" },
  { value: "5000_plus", label: "$5,000+ / month" },
  { value: "unsure", label: "Not sure" },
] as const);

export const outcomeOptions = opts([
  { value: "revenue", label: "Increase revenue" },
  { value: "admin", label: "Reduce administrative workload" },
  { value: "consolidate", label: "Consolidate or reduce software" },
  { value: "experience", label: "Improve the customer / parent experience" },
  { value: "visibility", label: "Better reporting and visibility" },
  { value: "other", label: "Something else" },
] as const);

export const leadStatuses = opts([
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "audit_scheduled", label: "Audit Scheduled" },
  { value: "audit_completed", label: "Audit Completed" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const);

export type LeadStatus = (typeof leadStatuses)[number]["value"];

export const valuesOf = <T extends readonly Option[]>(o: T) =>
  o.map((x) => x.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export function labelFor(o: readonly Option[], value: string | null | undefined): string {
  return o.find((x) => x.value === value)?.label ?? value ?? "—";
}
