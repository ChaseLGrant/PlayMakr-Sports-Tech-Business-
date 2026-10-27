/**
 * Placeholder branding. Change these values to rebrand the whole site.
 * Anything secret or environment-specific lives in .env, not here.
 */
export const brand = {
  name: "PlayMakr",
  legalName: "PlayMakr Technologies (placeholder legal entity)",
  tagline: "We Build Your Custom System. Try It Free for 30 Days.",
  description:
    "PlayMakr builds custom revenue and automation systems for sports businesses: leagues, camps, clinics, universities, facilities, clubs and tournaments.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  programName: "The Founding 100",
  foundingCap: 100,
};

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** Optional scheduling link (Calendly, Cal.com, HubSpot, etc.). */
export const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || "";
