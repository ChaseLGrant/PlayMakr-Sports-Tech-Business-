import { after, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { submitApplication } from "@/lib/server/applications";
import { notifyNewLead } from "@/lib/server/notify";
import { clientIp } from "@/lib/server/security";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await submitApplication(db, body, {
      ip: clientIp(request.headers),
      userAgent: request.headers.get("user-agent"),
    });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, fieldErrors: result.fieldErrors },
        { status: result.status },
      );
    }
    const lead = result.lead;
    if (lead) {
      // Send notifications after responding so the applicant isn't kept waiting.
      after(() => notifyNewLead(lead));
    }
    // Never echo stored data back to the browser.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[applications] failed to save application", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Please try again in a moment." },
      { status: 500 },
    );
  }
}
