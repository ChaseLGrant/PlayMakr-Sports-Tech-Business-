import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle, Check, Mail, Phone } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";
import { foundingCount, getLead } from "@/lib/server/leads";
import { brand } from "@/lib/brand";
import { calculatorInputLabels, formatCurrency, formatNumber, type CalculatorInputs, type CalculatorResults } from "@/lib/calculator";
import {
  customerOptions,
  employeeOptions,
  labelFor,
  leadStatuses,
  locationOptions,
  organizationTypes,
  outcomeOptions,
  revenueOptions,
  techSpendOptions,
} from "@/lib/options";
import type { ScoreBreakdown } from "@/lib/scoring";
import { Card, Dl, ScoreBadge, StatusBadge, fmtDate } from "@/components/admin/ui";
import { FoundingToggle } from "@/components/admin/founding-toggle";
import { addNoteAction, addTaskAction, toggleTaskAction, updateStatusAction } from "../../../actions";

const str = (v: unknown) => (v === null || v === undefined || v === "" ? null : String(v));

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const [data, count] = await Promise.all([getLead(db, id), foundingCount(db)]);
  if (!data) notFound();
  const { lead, notes, tasks, history } = data;

  const breakdown = (lead.score_breakdown ?? []) as ScoreBreakdown;
  const flags = (lead.score_flags ?? []) as string[];
  const calcIn = lead.calculator_inputs as CalculatorInputs | null;
  const calcOut = lead.calculator_results as CalculatorResults | null;
  const attribution = (lead.attribution ?? {}) as Record<string, string>;
  const website = str(lead.website);

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={14} aria-hidden /> All leads
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.organization_name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {labelFor(organizationTypes, str(lead.organization_type))} · Received {fmtDate(lead.created_at, true)}
            <StatusBadge status={lead.status} />
          </p>
        </div>
        <ScoreBadge score={Number(lead.score)} tier={String(lead.score_tier)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card title="Contact">
            <Dl
              items={[
                ["Name", str(lead.contact_name)],
                ["Job title", str(lead.job_title)],
                ["Email", <a key="e" href={`mailto:${str(lead.email)}`} className="inline-flex items-center gap-1 text-electric-600 hover:underline"><Mail size={13} aria-hidden />{str(lead.email)}</a>],
                ["Phone", str(lead.phone) ? <a key="p" href={`tel:${str(lead.phone)}`} className="inline-flex items-center gap-1 text-electric-600 hover:underline"><Phone size={13} aria-hidden />{str(lead.phone)}</a> : null],
                ["Contact consent", lead.consent_contact ? "Yes" : "No"],
                ["Marketing consent", lead.consent_marketing ? "Yes (opted in)" : "No — do not add to marketing"],
              ]}
            />
          </Card>

          <Card title="Organization">
            <Dl
              items={[
                ["Website", website ? <a key="w" href={website} target="_blank" rel="noopener noreferrer nofollow" className="text-electric-600 hover:underline">{website}</a> : null],
                ["Locations", labelFor(locationOptions, str(lead.locations))],
                ["Annual revenue", labelFor(revenueOptions, str(lead.annual_revenue))],
                ["Employees", labelFor(employeeOptions, str(lead.employees))],
                ["Customers / athletes", labelFor(customerOptions, str(lead.customers))],
                ["Monthly tech spend", labelFor(techSpendOptions, str(lead.monthly_tech_spend))],
                ["Primary outcome", labelFor(outcomeOptions, str(lead.desired_outcome))],
              ]}
            />
          </Card>

          <Card title="Challenges">
            <p className="text-xs text-slate-500">Biggest operational problem</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{str(lead.biggest_problem)}</p>
            <p className="mt-5 text-xs text-slate-500">Current software</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{str(lead.current_software) ?? "—"}</p>
          </Card>

          <Card title="Calculator results" right={calcOut ? <span className="text-xs text-slate-400">Recomputed on the server</span> : null}>
            {!calcIn || !calcOut ? (
              <p className="text-sm text-slate-500">The applicant did not include calculator inputs.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <table className="w-full text-sm">
                  <caption className="mb-2 text-left text-xs font-medium text-slate-500">Inputs</caption>
                  <tbody className="divide-y divide-slate-100">
                    {(Object.keys(calculatorInputLabels) as (keyof CalculatorInputs)[]).map((k) => (
                      <tr key={k}><td className="py-1.5 text-slate-600">{calculatorInputLabels[k]}</td><td className="py-1.5 text-right tabular-nums">{formatNumber(calcIn[k])}</td></tr>
                    ))}
                  </tbody>
                </table>
                <table className="w-full self-start text-sm">
                  <caption className="mb-2 text-left text-xs font-medium text-slate-500">Illustrative annual estimates</caption>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="py-1.5 text-slate-600">Revenue from conversion</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(calcOut.additionalRevenue)}</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Software reduction</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(calcOut.softwareSavings)}</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Labor cash savings</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(calcOut.laborCashSavings)}</td></tr>
                    <tr className="font-semibold"><td className="py-1.5">Total opportunity</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(calcOut.totalOpportunity)}</td></tr>
                    <tr><td className="py-1.5 text-slate-600">Hours freed (capacity)</td><td className="py-1.5 text-right tabular-nums">{formatNumber(calcOut.hoursFreedPerYear)} hrs · {formatCurrency(calcOut.laborCapacityValue)}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Source attribution">
            <Dl
              items={[
                ["UTM source", attribution.utm_source],
                ["UTM medium", attribution.utm_medium],
                ["UTM campaign", attribution.utm_campaign],
                ["UTM term / content", [attribution.utm_term, attribution.utm_content].filter(Boolean).join(" · ") || null],
                ["Referrer", attribution.referrer],
                ["Landing page", attribution.landingPath],
                ["First seen", attribution.firstSeenAt ? fmtDate(attribution.firstSeenAt, true) : null],
                ["Hero variant", str(lead.hero_variant)],
              ]}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Lead stage">
            <form key={lead.status} action={updateStatusAction} className="flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <select name="status" defaultValue={lead.status} aria-label="Lead stage" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {leadStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Update</button>
            </form>
            <ol className="mt-5 space-y-2 border-l border-slate-200 pl-4 text-xs">
              {history.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-slate-300" aria-hidden />
                  <span className="font-medium text-slate-700">{labelFor(leadStatuses, h.to_status)}</span>
                  <span className="text-slate-400"> · {fmtDate(h.created_at, true)} · {h.changed_by}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <FoundingToggle leadId={lead.id} enrolled={Boolean(lead.founding_partner)} count={count} cap={brand.foundingCap} />
          </Card>

          <Card title="Qualification score">
            <ul className="space-y-2.5 text-sm">
              {breakdown.map((b) => (
                <li key={b.factor}>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{b.factor}</span>
                    <span className="tabular-nums text-slate-900">{b.points}<span className="text-slate-400">/{b.max}</span></span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#2a78d6]" style={{ width: `${(b.points / b.max) * 100}%` }} />
                  </div>
                  {b.note && <p className="mt-0.5 text-xs text-slate-400">{b.note}</p>}
                </li>
              ))}
            </ul>
            {flags.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {flags.map((f) => (
                  <li key={f} className="flex gap-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
                    <AlertTriangle size={13} className="mt-px shrink-0" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Follow-up tasks">
            <form action={addTaskAction} className="space-y-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <input name="title" required maxLength={300} placeholder="e.g. Send audit prep questionnaire" aria-label="Task" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <input name="due" type="date" aria-label="Due date" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Add</button>
              </div>
            </form>
            <ul className="mt-4 divide-y divide-slate-100">
              {tasks.length === 0 && <li className="py-2 text-sm text-slate-500">No tasks yet.</li>}
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start gap-3 py-2.5">
                  <form action={toggleTaskAction}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <input type="hidden" name="taskId" value={t.id} />
                    <input type="hidden" name="done" value={String(!t.completed_at)} />
                    <button
                      aria-label={t.completed_at ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
                      className={`mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded border ${t.completed_at ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"}`}
                    >
                      {t.completed_at && <Check size={12} aria-hidden />}
                    </button>
                  </form>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className={t.completed_at ? "text-slate-400 line-through" : "text-slate-900"}>{t.title}</p>
                    <p className="text-xs text-slate-400">
                      {t.due_date ? `Due ${fmtDate(`${t.due_date}T12:00:00`)}` : "No due date"} · {t.author}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Notes">
            <form action={addNoteAction} className="space-y-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <textarea name="body" required rows={3} maxLength={5000} placeholder="Add a note…" aria-label="Note" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Save note</button>
            </form>
            <ul className="mt-4 space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="whitespace-pre-wrap text-sm text-slate-900">{n.body}</p>
                  <p className="mt-1.5 text-xs text-slate-400">{n.author} · {fmtDate(n.created_at, true)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
