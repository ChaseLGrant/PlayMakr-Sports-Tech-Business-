/** Funnel events the browser is allowed to send to /api/events. */
export const CLIENT_EVENTS = [
  "page_view",
  "cta_click",
  "calculator_start",
  "calculator_complete",
  "application_start",
  "application_step",
  "calendar_click",
] as const;

export type ClientEventName = (typeof CLIENT_EVENTS)[number];
