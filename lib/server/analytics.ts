import { z } from "zod";
import type { Queryable } from "../db/core";
import { CLIENT_EVENTS } from "../analytics-events";

/** Events only the server may record (derived from real outcomes, not clicks). */
export const SERVER_EVENTS = [
  "application_complete",
  "qualified_application",
  "audit_booked",
  "customer_won",
] as const;

export const clientEventSchema = z.object({
  name: z.enum(CLIENT_EVENTS),
  sessionId: z.string().max(64).optional(),
  variant: z.enum(["A", "B"]).optional(),
  path: z.string().max(300).optional(),
  props: z
    .record(z.string().max(40), z.union([z.string().max(200), z.number(), z.boolean(), z.null()]))
    .optional()
    .refine((p) => !p || Object.keys(p).length <= 12, "Too many properties"),
});

type EventInput = {
  name: (typeof CLIENT_EVENTS)[number] | (typeof SERVER_EVENTS)[number];
  sessionId?: string;
  variant?: string;
  path?: string;
  props?: Record<string, unknown>;
};

export async function recordEvent(db: Queryable, e: EventInput) {
  await db.query(
    "insert into analytics_events (name, session_id, variant, path, props) values ($1, $2, $3, $4, $5)",
    [e.name, e.sessionId ?? null, e.variant ?? null, e.path ?? null, e.props ? JSON.stringify(e.props) : null],
  );
}
