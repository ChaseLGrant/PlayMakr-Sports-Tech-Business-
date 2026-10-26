import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { clientEventSchema, recordEvent } from "@/lib/server/analytics";
import { clientIp, hashIp, rateLimit } from "@/lib/server/security";

/** First-party funnel analytics. Anonymous: a random per-tab session id, no PII. */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 4000) return new NextResponse(null, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = clientEventSchema.safeParse(json);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  try {
    const db = await getDb();
    if (!(await rateLimit(db, `events:${hashIp(clientIp(request.headers))}`, 300, 600))) {
      return new NextResponse(null, { status: 429 });
    }
    await recordEvent(db, parsed.data);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[events] failed to record event", err);
    return new NextResponse(null, { status: 500 });
  }
}
