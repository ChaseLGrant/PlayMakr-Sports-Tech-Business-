import { z } from "zod";
import { calculatorInputSchema } from "./calculator";
import {
  customerOptions,
  employeeOptions,
  locationOptions,
  organizationTypes,
  outcomeOptions,
  revenueOptions,
  techSpendOptions,
  valuesOf,
} from "./options";

/** Bump when consent wording changes so each lead records what they agreed to. */
export const CONSENT_VERSION = "2026-10-v1";

const trimmed = (min: number, max: number, msg: string) =>
  z.string().trim().min(min, msg).max(max, `Please keep this under ${max} characters.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

const websiteSchema = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine(
    (v) => {
      if (!v) return true;
      try {
        const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
        return u.hostname.includes(".");
      } catch {
        return false;
      }
    },
    { message: "Enter a valid website, like yourclub.com." },
  )
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v));

const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^[+()\-.\s\d]{7,30}$/.test(v), "Enter a valid phone number.")
  .refine((v) => !v || (v.match(/\d/g)?.length ?? 0) >= 7, "Enter a valid phone number.");

export const stepSchemas = {
  organization: z.object({
    organizationName: trimmed(2, 120, "Enter your organization's name."),
    website: websiteSchema,
    organizationType: z.enum(valuesOf(organizationTypes), { message: "Choose an organization type." }),
    locations: z.enum(valuesOf(locationOptions), { message: "Choose the number of locations." }),
  }),
  size: z.object({
    annualRevenue: z.enum(valuesOf(revenueOptions), { message: "Choose a revenue range." }),
    employees: z.enum(valuesOf(employeeOptions), { message: "Choose the number of employees." }),
    customers: z.enum(valuesOf(customerOptions), { message: "Choose an approximate number." }),
  }),
  challenges: z.object({
    biggestProblem: trimmed(10, 2000, "Tell us a little more (at least 10 characters)."),
    currentSoftware: optionalText(1000),
    desiredOutcome: z.enum(valuesOf(outcomeOptions), { message: "Choose a primary outcome." }),
    monthlyTechSpend: z.enum(valuesOf(techSpendOptions), { message: "Choose an estimate." }),
  }),
  contact: z.object({
    contactName: trimmed(2, 120, "Enter your name."),
    email: z.string().trim().toLowerCase().max(200).email("Enter a valid work email."),
    phone: phoneSchema,
    jobTitle: trimmed(2, 120, "Enter your job title."),
    consentContact: z.literal(true, { message: "Please agree so we can contact you about your audit." }),
    consentMarketing: z.boolean().default(false),
  }),
} as const;

export type StepKey = keyof typeof stepSchemas;
export const stepOrder: StepKey[] = ["organization", "size", "challenges", "contact"];

const attributionSchema = z
  .object({
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    referrer: z.string().max(500).optional(),
    landingPath: z.string().max(500).optional(),
    firstSeenAt: z.string().max(40).optional(),
  })
  .partial()
  .optional();

export const applicationSchema = z.object({
    ...stepSchemas.organization.shape,
    ...stepSchemas.size.shape,
    ...stepSchemas.challenges.shape,
    ...stepSchemas.contact.shape,
    calculator: calculatorInputSchema.nullable().optional(),
    attribution: attributionSchema,
    heroVariant: z.enum(["A", "B"]).optional(),
    sessionId: z.string().max(64).optional(),
    // Spam signals
    company_fax: z.string().max(200).optional(), // honeypot: must be empty
    startedAt: z.number().optional(),
    turnstileToken: z.string().max(4096).optional(),
  });

export type ApplicationInput = z.input<typeof applicationSchema>;
export type Application = z.output<typeof applicationSchema>;

/** Flattens zod issues into { fieldName: "message" } for display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
