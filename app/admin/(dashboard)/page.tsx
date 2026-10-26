import Link from "next/link";
import { Award, Search } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";
import { funnelMetrics, listLeads } from "@/lib/server/leads";
import { brand } from "@/lib/brand";
import { formatCurrency } from "@/lib/calculator";
import { labelFor, leadStatuses, organizationTypes, revenueOptions } from "@/lib/options";
import { Card, ScoreBadge, StatusBadge, fmtDate } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : "—");

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const days = [7, 30, 90, 365].includes(Number(one(sp.days))) ? Number(one(sp.days)) : 30;
  const filters = { status: one(sp.status), tier: one(sp.tier), q: one(sp.q)?.slice(0, 100) };

  const db = await getDb();
  const [m, leads] = await Promise.all([funnelMetrics(db, days), listLeads(db, filters)]);

  const funnel = [
    { label: "Landing visits", value: m.visits, note: `${m.uniqueSessions} sessions` },
    { label: "Primary CTA clicks", value: m.ctaClicks },
    { label: "Calculator starts", value: m.calculatorStarts },
    { label: "Calculator completions", value: m.calculatorCompletions },
    { label: "Application starts", value: m.applicationStarts },
    { label: "Applications completed", value: m.applicationCompletions },
    { label: "Qualified applications", value: m.qualifiedApplications },
    { label: "Audit bookings", value: m.auditBookings },
    { label: "Closed customers", value: m.closedCustomers },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads &amp; funnel</h1>
          <p className="mt-1 text-sm text-slate-500">Funnel metrics for the last {days} days.</p>
        </div>
        <nav className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm" aria-label="Date range">
          {[7, 30, 90, 365].map((d) => (
            <Link key={d} href={`/admin?days=${d}`} aria-current={d === days ? "page" : undefined}
              className={cn("rounded-md px-3 py-1.5", d === days ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900")}>
              {d === 365 ? "1y" : `${d}d`}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New leads (to review)" value={String(m.newLeads)} />
        <Stat label="Applications" value={String(m.applicationCompletions)} sub={`${pct(m.applicationCompletions, m.uniqueSessions)} of sessions`} />
        <Stat label="Qualified" value={String(m.qualifiedApplications)} sub={`${pct(m.qualifiedApplications, m.applicationCompletions)} of applications`} />
        <div className="rounded-xl border border-electric-500/30 bg-gradient-to-br from-white to-blue-50 p-5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><Award size={14} className="text-electric-600" aria-hidden /> Founding partners (all time)</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{m.foundingPartners}<span className="text-lg text-slate-400"> / {brand.foundingCap}</span></p>
          <div className="mt-3 h-1.5 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-electric-600" style={{ width: `${Math.min(100, (m.foundingPartners / brand.foundingCap) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Conversion funnel">
          <ul className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.label} className="grid grid-cols-[10rem_1fr_4.5rem] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_5rem]">
                <span className="truncate text-slate-600">{f.label}</span>
                <span className="h-2 rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-[#2a78d6]" style={{ width: `${(f.value / funnelMax) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">
                  <span className="font-semibold">{f.value}</span>
                  {i > 0 && <span className="ml-1.5 text-xs text-slate-400">{pct(f.value, funnel[i - 1]!.value)}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            Percentages compare each step to the previous one. Starts and completions count unique browser sessions.
            Audit bookings and customers come from lead status changes.
          </p>
        </Card>
        <div className="space-y-6">
          <Card title="Hero A/B test">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500"><tr><th className="pb-2 text-left font-medium">Variant</th><th className="pb-2 text-right font-medium">Visits</th><th className="pb-2 text-right font-medium">Applications</th><th className="pb-2 text-right font-medium">Rate</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {(m.byVariant.length ? m.byVariant : [{ variant: "A", visits: 0, completions: 0 }]).map((v) => (
                  <tr key={v.variant}><td className="py-2 font-medium">{v.variant}</td><td className="py-2 text-right tabular-nums">{v.visits}</td><td className="py-2 text-right tabular-nums">{v.completions}</td><td className="py-2 text-right tabular-nums">{pct(v.completions, v.visits)}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-400">Set HERO_SPLIT_TEST=true to split traffic. Wait for a meaningful sample before choosing a winner.</p>
          </Card>
          <Card title="Lead sources">
            {m.bySource.length === 0 ? <p className="text-sm text-slate-500">No leads in this period.</p> : (
              <ul className="space-y-2 text-sm">
                {m.bySource.map((s) => (
                  <li key={s.source} className="flex justify-between"><span className="text-slate-600">{s.source}</span><span className="font-semibold tabular-nums">{s.leads}</span></li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card title={`Applications (${leads.length})`}>
        <form className="mb-4 flex flex-col gap-2 sm:flex-row" role="search">
          <input type="hidden" name="days" value={days} />
          <label className="relative flex-1">
            <span className="sr-only">Search</span>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input name="q" defaultValue={filters.q} placeholder="Search organization, contact or email"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-electric-500" />
          </label>
          <select name="status" defaultValue={filters.status ?? ""} aria-label="Status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {leadStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select name="tier" defaultValue={filters.tier ?? ""} aria-label="Score tier" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All scores</option>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Filter</button>
        </form>

        {leads.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No applications match. When someone applies, they’ll appear here.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Organization</th>
                  <th className="px-3 py-2.5 font-medium">Contact</th>
                  <th className="px-3 py-2.5 font-medium">Revenue</th>
                  <th className="px-3 py-2.5 font-medium">Score</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Est. opportunity</th>
                  <th className="px-3 py-2.5 font-medium">Source</th>
                  <th className="px-5 py-2.5 text-right font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-medium text-slate-900 hover:text-electric-600">
                        {l.organization_name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {labelFor(organizationTypes, l.organization_type)}
                        {l.founding_partner && <span className="ml-1.5 text-electric-600">· Founding partner</span>}
                        {l.open_tasks > 0 && <span className="ml-1.5 text-amber-700">· {l.open_tasks} open task{l.open_tasks > 1 ? "s" : ""}</span>}
                      </p>
                    </td>
                    <td className="px-3 py-3"><p>{l.contact_name}</p><p className="text-xs text-slate-500">{l.job_title}</p></td>
                    <td className="px-3 py-3 text-slate-600">{labelFor(revenueOptions, l.annual_revenue)}</td>
                    <td className="px-3 py-3"><ScoreBadge score={l.score} tier={l.score_tier} /></td>
                    <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-3 py-3 tabular-nums text-slate-600">{l.total_opportunity ? formatCurrency(l.total_opportunity, true) : "—"}</td>
                    <td className="max-w-[10rem] truncate px-3 py-3 text-slate-600">{l.source ?? "direct"}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{fmtDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
