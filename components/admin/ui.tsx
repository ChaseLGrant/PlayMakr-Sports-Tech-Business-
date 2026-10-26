import { cn } from "@/lib/utils";
import { labelFor, leadStatuses } from "@/lib/options";

export function Card({ title, children, className, right }: { title?: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
  return (
    <section className={cn("rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]", className)}>
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

const tierStyle: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  medium: "bg-amber-50 text-amber-800 ring-amber-600/20",
  low: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function ScoreBadge({ score, tier }: { score: number; tier: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset tabular-nums", tierStyle[tier] ?? tierStyle.low)}>
      {score} <span className="font-normal capitalize">· {tier}</span>
    </span>
  );
}

const statusStyle: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  qualified: "bg-indigo-50 text-indigo-700",
  audit_scheduled: "bg-violet-50 text-violet-700",
  audit_completed: "bg-sky-50 text-sky-700",
  proposal_sent: "bg-amber-50 text-amber-800",
  won: "bg-emerald-50 text-emerald-700",
  lost: "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium", statusStyle[status] ?? statusStyle.new)}>
      {labelFor(leadStatuses, status)}
    </span>
  );
}

export function fmtDate(d: unknown, withTime = false): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(String(d));
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleString("en-US", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" });
}

export function Dl({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-slate-500">{k}</dt>
          <dd className="mt-0.5 text-sm text-slate-900 [overflow-wrap:anywhere]">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
