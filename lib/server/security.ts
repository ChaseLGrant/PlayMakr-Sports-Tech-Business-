import { createHash } from "node:crypto";
import type { Queryable } from "../db/core";

/** Best-effort client IP from proxy headers (Vercel, Netlify, Cloudflare set these). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "unknown";
}

/** We never store raw IPs — only a salted hash, for rate limiting and abuse review. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || process.env.SESSION_SECRET || "playmakr-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Database-backed sliding-window rate limit, so it works across serverless
 * instances. Returns true when the request is allowed.
 */
export async function rateLimit(
  db: Queryable,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const { rows } = await db.query<{ n: number }>(
    "select count(*)::int as n from rate_limit_hits where key = $1 and created_at > now() - make_interval(secs => $2)",
    [key, windowSeconds],
  );
  if ((rows[0]?.n ?? 0) >= limit) return false;
  await db.query("insert into rate_limit_hits (key) values ($1)", [key]);
  // Opportunistic cleanup of old rows (roughly 1% of calls).
  if (Math.random() < 0.01) {
    await db.query("delete from rate_limit_hits where created_at < now() - interval '1 day'");
  }
  return true;
}

/** Cloudflare Turnstile verification. Only enforced when TURNSTILE_SECRET_KEY is set. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification request failed", err);
    return false;
  }
}

/** Minimum seconds between opening the form and submitting it. Faster = bot. */
export const MIN_FILL_SECONDS = 4;
