import type { ApplicationInput } from "@/lib/validation";

export const validApplication = (over: Partial<ApplicationInput> = {}): ApplicationInput => ({
  organizationName: "Riverside Youth Soccer Club",
  website: "riversidesoccer.org",
  organizationType: "youth_club",
  locations: "2_3",
  annualRevenue: "3m_10m",
  employees: "16_50",
  customers: "1000_5000",
  biggestProblem: "Registration and parent communication take our staff hours every week.",
  currentSoftware: "Spreadsheets, an online registration platform, email marketing tool",
  desiredOutcome: "admin",
  monthlyTechSpend: "2000_5000",
  contactName: "Jordan Lee",
  email: "jordan@riversidesoccer.org",
  phone: "(555) 010-2030",
  jobTitle: "Executive Director",
  consentContact: true,
  consentMarketing: false,
  startedAt: Date.now() - 60_000,
  ...over,
});
