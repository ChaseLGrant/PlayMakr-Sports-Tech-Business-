"use client";

import { useId, useRef, useState } from "react";
import {
  BarChart3,
  Users,
  CalendarRange,
  ClipboardCheck,
  LayoutGrid,
  PieChart,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/* All figures below are invented for demonstration. */

const tabs = [
  { key: "revenue", label: "Revenue Dashboard", icon: BarChart3, blurb: "One view of revenue by program, location and season, updated automatically from your registration and payment systems.", View: RevenueMock },
  { key: "leads", label: "Lead Management", icon: Users, blurb: "Every inquiry captured, routed and followed up automatically, with nothing left sitting in an inbox.", View: LeadsMock },
  { key: "facility", label: "Facility Optimization", icon: CalendarRange, blurb: "See utilization by space and hour, then fill open slots with automated offers to waitlists and past customers.", View: FacilityMock },
  { key: "registration", label: "Registration Management", icon: ClipboardCheck, blurb: "Track every registration from start to payment, recover abandoned checkouts and automate reminders.", View: RegistrationMock },
  { key: "portal", label: "Operations Portal", icon: LayoutGrid, blurb: "A custom internal portal giving staff their schedule, tasks and approvals in one place.", View: PortalMock },
  { key: "executive", label: "Executive Reporting", icon: PieChart, blurb: "Board-ready reporting across locations, compared season over season.", View: ExecutiveMock },
] as const;

export function Examples() {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = tabs[active]!;

  function onKey(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section id="examples" tone="dark" labelledBy="examples-title">
      <SectionHeading
        id="examples-title"
        eyebrow="Examples of what we build"
        title="Enterprise-grade tools, designed for sports operations."
        lede="Concept demonstrations of the kinds of systems we design. These are illustrative examples with sample data, not completed client projects."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div role="tablist" aria-label="Example interfaces" aria-orientation="vertical" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${base}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                active === i
                  ? "border-electric-400/40 bg-electric-500/10 text-white"
                  : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:text-slate-200",
              )}
            >
              <t.icon size={17} aria-hidden className={active === i ? "text-electric-300" : ""} />
              <span className="whitespace-nowrap font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${active}`} tabIndex={0}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[15px] text-slate-400">{current.blurb}</p>
            <span className="shrink-0 self-start rounded-md border border-amber-200/20 bg-amber-200/[0.06] px-2 py-1 font-mono text-[10.5px] uppercase tracking-wider text-amber-100/90 sm:self-auto">
              Concept example · sample data
            </span>
          </div>
          <div key={current.key} className="mt-4 animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-[0_30px_90px_-30px_rgb(0_0_0/0.9)]">
            <Chrome title={current.label} />
            <div className="p-4 sm:p-6">
              <current.View />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Chrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-navy-950/60 px-4 py-2.5">
      <div className="flex gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <span className="truncate text-[11.5px] text-slate-400">{title}</span>
    </div>
  );
}

function Kpi({ label, value, sub, good = true }: { label: string; value: string; sub?: string; good?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <p className="truncate text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-xl">{value}</p>
      {sub && <p className={cn("text-[11px] font-medium", good ? "text-emerald-300/90" : "text-amber-200/90")}>{sub}</p>}
    </div>
  );
}

function Panel({ title, children, className, right }: { title: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.015] p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[12px] font-medium text-slate-300">{title}</p>
        {right}
      </div>
      {children}
    </div>
  );
}

/* 1 — Revenue dashboard */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthly = [148, 162, 210, 236, 228, 190, 172, 244, 262, 231, 198, 176];
function RevenueMock() {
  const max = Math.max(...monthly);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="YTD revenue" value="$2.46M" sub="+11.2% vs last year" />
        <Kpi label="Active registrations" value="3,912" sub="+6.4%" />
        <Kpi label="Avg. revenue / family" value="$628" sub="+$41" />
        <Kpi label="Outstanding balances" value="$38.2K" sub="142 accounts" good={false} />
      </div>
      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Panel title="Monthly revenue ($K)" right={<span className="font-mono text-[10px] text-slate-500">{hover !== null ? `${months[hover]}: $${monthly[hover]}K` : "Hover a bar"}</span>}>
          <div className="flex h-44 items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
            {monthly.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end" onMouseEnter={() => setHover(i)}>
                <div
                  className={cn("rounded-t-[4px] transition-colors", hover === null || hover === i ? "bg-series-1" : "bg-series-1/40")}
                  style={{ height: `${(v / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-[2px] font-mono text-[9.5px] text-slate-500">
            {months.map((m) => (
              <span key={m} className="flex-1 text-center">{m[0]}</span>
            ))}
          </div>
        </Panel>
        <Panel title="Revenue by program">
          <ul className="space-y-3">
            {[
              ["Club teams", 1.12],
              ["Camps & clinics", 0.54],
              ["Private training", 0.38],
              ["Facility rentals", 0.27],
              ["Tournaments", 0.15],
            ].map(([n, v]) => (
              <li key={n as string}>
                <div className="flex justify-between text-[12px]">
                  <span className="text-slate-300">{n}</span>
                  <span className="tabular-nums text-slate-400">${(v as number).toFixed(2)}M</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-series-1" style={{ width: `${((v as number) / 1.12) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* 2 — Lead management */
const pipeline = [
  { stage: "New inquiry", count: 18, cards: [["Martinez family", "U10 Boys · 2m ago", "Auto-reply sent"], ["Chen family", "Summer camp · 14m", "Auto-reply sent"]] },
  { stage: "Contacted", count: 11, cards: [["Okafor family", "Private training", "Follow-up #2 tomorrow"], ["Brooks family", "U14 Girls", "Call scheduled"]] },
  { stage: "Trial / tour", count: 7, cards: [["Patel family", "Tour Sat 10:00", "Reminder queued"], ["Nguyen family", "Trial session", "Coach assigned"]] },
  { stage: "Registered", count: 23, cards: [["Rivera family", "Fall season", "Welcome sequence"], ["Kim family", "Academy", "Paid in full"]] },
];
function LeadsMock() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Median first response" value="3 min" sub="automated" />
        <Kpi label="Open inquiries" value="36" sub="0 unassigned" />
        <Kpi label="Inquiry → registration" value="31%" sub="last 90 days" />
        <Kpi label="Follow-ups due today" value="9" sub="4 automated" />
      </div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="grid min-w-[640px] grid-cols-4 gap-3">
          {pipeline.map((col) => (
            <div key={col.stage} className="rounded-xl bg-white/[0.02] p-2.5">
              <div className="flex items-center justify-between px-1 pb-2.5">
                <span className="text-[11.5px] font-medium text-slate-300">{col.stage}</span>
                <span className="rounded bg-white/[0.06] px-1.5 font-mono text-[10px] text-slate-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map(([n, d, s]) => (
                  <div key={n} className="rounded-lg border border-white/[0.07] bg-navy-850 p-2.5">
                    <p className="text-[12px] font-medium text-white">{n}</p>
                    <p className="text-[10.5px] text-slate-500">{d}</p>
                    <p className="mt-2 inline-flex items-center gap-1 rounded bg-electric-500/10 px-1.5 py-0.5 text-[10px] text-electric-200">
                      <Mail size={10} aria-hidden /> {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3 — Facility booking optimization (sequential single-hue heatmap) */
const spaces = ["Court 1", "Court 2", "Court 3", "Field A", "Field B", "Turf Room"];
const hours = ["7a", "9a", "11a", "1p", "3p", "5p", "7p", "9p"];
const util = [
  [0.2, 0.35, 0.3, 0.25, 0.6, 0.95, 1, 0.7],
  [0.1, 0.3, 0.25, 0.2, 0.55, 0.9, 0.95, 0.5],
  [0.05, 0.15, 0.1, 0.1, 0.4, 0.8, 0.85, 0.3],
  [0.3, 0.6, 0.55, 0.4, 0.7, 1, 1, 0.6],
  [0.1, 0.4, 0.35, 0.2, 0.5, 0.85, 0.9, 0.35],
  [0.15, 0.45, 0.5, 0.35, 0.65, 0.9, 0.75, 0.25],
];
function FacilityMock() {
  const [tip, setTip] = useState<string>("Hover a cell for utilization");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Weekly utilization" value="54%" sub="+7 pts after offers" />
        <Kpi label="Open prime-time slots" value="11" sub="this week" good={false} />
        <Kpi label="Offers sent" value="212" sub="to waitlists" />
        <Kpi label="Slots filled via offers" value="38" sub="this month" />
      </div>
      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Panel title="Utilization by space & hour" right={<span className="font-mono text-[10px] text-slate-500">{tip}</span>}>
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[380px] table-fixed border-separate border-spacing-[2px] text-[10px]">
              <thead>
                <tr>
                  <th className="w-16" />
                  {hours.map((h) => (
                    <th key={h} scope="col" className="pb-1 font-mono font-normal text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spaces.map((s, r) => (
                  <tr key={s}>
                    <th scope="row" className="pr-2 text-left font-normal text-slate-400">{s}</th>
                    {util[r]!.map((u, c) => (
                      <td
                        key={c}
                        onMouseEnter={() => setTip(`${s} · ${hours[c]}: ${Math.round(u * 100)}%`)}
                        className="h-7 rounded-[4px]"
                        style={{ background: `color-mix(in oklab, #3987e5 ${Math.round(12 + u * 88)}%, #0d162a)` }}
                      >
                        <span className="sr-only">{Math.round(u * 100)}%</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
            Low
            <span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-[color-mix(in_oklab,#3987e5_12%,#0d162a)] to-[#3987e5]" />
            High
          </div>
        </Panel>
        <Panel title="Suggested actions">
          <ul className="space-y-2.5 text-[12px]">
            {[
              ["Court 3 · weekdays 9a–1p", "Offer to homeschool & adult leagues"],
              ["Field B · 9p", "Discounted late slot to waitlist (14 teams)"],
              ["All courts · 7a", "Early-bird private training package"],
            ].map(([a, b]) => (
              <li key={a} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <p className="font-medium text-white">{a}</p>
                <p className="mt-0.5 text-slate-400">{b}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* 4 — Registration management */
const regs = [
  ["A. Thompson", "U12 Girls · Fall", "Paid", "$640"],
  ["J. Alvarez", "Winter Academy", "Payment plan", "$220 / mo"],
  ["M. Robinson", "U9 Boys · Fall", "Abandoned", "$595"],
  ["S. Ahmed", "Goalkeeper Clinic", "Paid", "$180"],
  ["L. Foster", "U14 Boys · Fall", "Pending waiver", "$640"],
  ["D. Wright", "Summer Camp", "Recovered", "$325"],
];
const statusStyle: Record<string, { cls: string; icon: React.ReactNode }> = {
  Paid: { cls: "bg-emerald-400/10 text-emerald-200", icon: <CheckCircle2 size={11} aria-hidden /> },
  "Payment plan": { cls: "bg-electric-500/10 text-electric-200", icon: <Clock size={11} aria-hidden /> },
  Abandoned: { cls: "bg-amber-300/10 text-amber-100", icon: <AlertCircle size={11} aria-hidden /> },
  "Pending waiver": { cls: "bg-amber-300/10 text-amber-100", icon: <AlertCircle size={11} aria-hidden /> },
  Recovered: { cls: "bg-emerald-400/10 text-emerald-200", icon: <RefreshCcw size={11} aria-hidden /> },
};
function RegistrationMock() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Registrations this season" value="1,846" sub="92% of target" />
        <Kpi label="Abandoned checkouts" value="64" sub="recovery running" good={false} />
        <Kpi label="Recovered this month" value="$11.7K" sub="27 registrations" />
        <Kpi label="Missing waivers" value="18" sub="auto-reminders on" good={false} />
      </div>
      <Panel title="Recent registrations">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[520px] text-left text-[12px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-slate-500">
              <tr className="border-b border-white/[0.06]">
                <th className="py-2 font-medium">Athlete</th>
                <th className="py-2 font-medium">Program</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {regs.map(([n, p, s, a]) => (
                <tr key={n}>
                  <td className="py-2.5 font-medium text-white">{n}</td>
                  <td className="py-2.5 text-slate-400">{p}</td>
                  <td className="py-2.5">
                    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px]", statusStyle[s!]!.cls)}>
                      {statusStyle[s!]!.icon} {s}
                    </span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-slate-300">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* 5 — Custom operations portal */
function PortalMock() {
  return (
    <div className="grid gap-4 md:grid-cols-[170px_1fr]">
      <nav aria-hidden className="hidden flex-col gap-1 rounded-xl bg-white/[0.02] p-2 text-[12px] md:flex">
        {["Today", "Schedule", "Teams & rosters", "Staff", "Approvals", "Documents", "Reports"].map((n, i) => (
          <span key={n} className={cn("rounded-lg px-3 py-2", i === 0 ? "bg-electric-500/15 text-white" : "text-slate-400")}>{n}</span>
        ))}
      </nav>
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-base font-semibold text-white">Good morning, Coach Taylor</p>
          <p className="text-[11px] text-slate-500">North Campus · Tuesday</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Today’s schedule">
            <ul className="space-y-2 text-[12px]">
              {[["4:00 PM", "U11 Girls practice", "Field A"], ["5:30 PM", "Private session · R. Diaz", "Turf Room"], ["7:00 PM", "U15 Boys practice", "Field B"]].map(([t, e, l]) => (
                <li key={t} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2">
                  <span className="w-14 shrink-0 font-mono text-[10.5px] text-electric-300">{t}</span>
                  <span className="flex-1 text-slate-200">{e}</span>
                  <span className="text-[10.5px] text-slate-500">{l}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Needs your attention">
            <ul className="space-y-2 text-[12px]">
              {[["3 athletes missing medical forms", "Reminders sent automatically"], ["Field change request · Thu", "Approve or decline"], ["Timesheet due Friday", "12.5 hrs logged"]].map(([a, b]) => (
                <li key={a} className="rounded-lg bg-white/[0.02] px-3 py-2">
                  <p className="text-slate-200">{a}</p>
                  <p className="text-[10.5px] text-slate-500">{b}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Roster attendance" value="94%" />
          <Kpi label="Forms complete" value="97%" />
          <Kpi label="Open tasks" value="4" />
        </div>
      </div>
    </div>
  );
}

/* 6 — Executive reporting (two series, one axis, legend + endpoint labels) */
const thisSeason = [210, 236, 228, 262, 281, 274, 298, 312];
const lastSeason = [198, 205, 219, 226, 238, 233, 249, 256];
function linePath(vals: number[], w: number, h: number, min: number, max: number) {
  return vals
    .map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)},${(h - ((v - min) / (max - min)) * h).toFixed(1)}`)
    .join(" ");
}
function ExecutiveMock() {
  const W = 460, H = 150, min = 180, max = 330;
  const yOf = (v: number) => H - ((v - min) / (max - min)) * H;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Revenue (8 wks)" value="$2.10M" sub="+13.8% YoY" />
        <Kpi label="Retention" value="81%" sub="+4 pts" />
        <Kpi label="Cost per registration" value="$37" sub="−$9" />
        <Kpi label="Software spend" value="$4.1K/mo" sub="−$1.6K/mo" />
      </div>
      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Weekly revenue, all locations ($K)"
          right={
            <span className="flex items-center gap-3 text-[10.5px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[#3987e5]" /> This season</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[#d95926]" /> Last season</span>
            </span>
          }
        >
          <svg viewBox={`-4 -8 ${W + 60} ${H + 16}`} className="h-auto w-full" role="img" aria-label="Line chart comparing weekly revenue this season and last season; this season ends at 312 thousand versus 256 thousand.">
            {[200, 250, 300].map((v) => (
              <g key={v}>
                <line x1="0" x2={W} y1={yOf(v)} y2={yOf(v)} stroke="rgb(148 163 184 / 0.1)" />
                <text x={W + 8} y={yOf(v) + 3} fill="#64748b" fontSize="9" fontFamily="monospace">{v}</text>
              </g>
            ))}
            <path d={linePath(lastSeason, W, H, min, max)} fill="none" stroke="#d95926" strokeWidth="2" strokeLinejoin="round" />
            <path d={linePath(thisSeason, W, H, min, max)} fill="none" stroke="#3987e5" strokeWidth="2" strokeLinejoin="round" />
            <circle cx={W} cy={yOf(312)} r="4" fill="#3987e5" stroke="#0a1121" strokeWidth="2" />
            <circle cx={W} cy={yOf(256)} r="4" fill="#d95926" stroke="#0a1121" strokeWidth="2" />
            <text x={W - 6} y={yOf(312) - 9} fill="#e2e8f0" fontSize="10" textAnchor="end">$312K</text>
            <text x={W - 6} y={yOf(256) + 16} fill="#cbd5e1" fontSize="10" textAnchor="end">$256K</text>
          </svg>
        </Panel>
        <Panel title="By location">
          <table className="w-full text-[12px]">
            <thead className="text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="pb-2 text-left font-medium">Location</th><th className="pb-2 text-right font-medium">Rev.</th><th className="pb-2 text-right font-medium">YoY</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[["North Campus", "$842K", "+16%"], ["Westside", "$611K", "+12%"], ["Lakeview", "$402K", "+9%"], ["Downtown", "$245K", "+18%"]].map(([l, r, y]) => (
                <tr key={l}>
                  <td className="py-2 text-slate-300">{l}</td>
                  <td className="py-2 text-right tabular-nums text-white">{r}</td>
                  <td className="py-2 text-right tabular-nums text-emerald-300/90">{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
