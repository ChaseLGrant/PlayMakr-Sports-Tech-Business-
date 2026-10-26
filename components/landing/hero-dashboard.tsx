/**
 * Decorative product visual for the hero. Illustrative data only.
 * Pure SVG + CSS so it renders instantly and costs no JavaScript.
 */
const weeks = [42, 45, 44, 49, 52, 50, 56, 61, 59, 66, 71, 76];

function areaPath(values: number[], w: number, h: number, pad = 6) {
  const max = Math.max(...values) * 1.08;
  const min = Math.min(...values) * 0.8;
  const pts = values.map((v, i) => [
    pad + (i * (w - pad * 2)) / (values.length - 1),
    h - pad - ((v - min) / (max - min)) * (h - pad * 2),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x!.toFixed(1)},${y!.toFixed(1)}`).join(" ");
  const area = `${line} L${pts.at(-1)![0]!.toFixed(1)},${h} L${pts[0]![0]!.toFixed(1)},${h} Z`;
  return { line, area, last: pts.at(-1)! };
}

const kpis = [
  { label: "Registrations · 30d", value: "1,284", delta: "+12%" },
  { label: "Facility utilization", value: "78%", delta: "+9 pts" },
  { label: "Lead response time", value: "4 min", delta: "−3.6 hrs" },
  { label: "Recovered revenue", value: "$18.4K", delta: "this month" },
];

const feed = [
  { t: "Abandoned registration", a: "Reminder sent · checkout link restored", tone: "text-electric-300" },
  { t: "New inquiry · U12 Girls", a: "Routed to director · follow-up booked", tone: "text-emerald-300" },
  { t: "Field 3 open · 6–8 PM", a: "Offered to 14 waitlisted teams", tone: "text-amber-200" },
];

export function HeroDashboard() {
  const { line, area, last } = areaPath(weeks, 520, 190);
  return (
    <div
      role="img"
      aria-label="Example operations dashboard showing registrations, facility utilization, lead response time and recovered revenue. Illustrative data."
      className="relative"
    >
      <div aria-hidden className="absolute -inset-10 rounded-[40px] bg-electric-500/20 blur-3xl" />
      <div
        aria-hidden
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/90 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] ring-1 ring-inset ring-white/[0.04] backdrop-blur"
      >
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 text-[11px] font-medium text-slate-400">Operations Overview · All locations</span>
          </div>
          <span className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            Example
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-navy-900 px-4 py-3.5">
              <p className="truncate text-[10.5px] text-slate-500">{k.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">{k.value}</p>
              <p className="text-[10.5px] font-medium text-emerald-300/90">{k.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-px bg-white/[0.05] md:grid-cols-[1.55fr_1fr]">
          <div className="flex flex-col bg-navy-900 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-medium text-slate-300">Weekly program revenue</p>
              <p className="font-mono text-[10px] text-slate-500">12 WKS</p>
            </div>
            <svg viewBox="0 0 520 190" className="mt-3 h-auto w-full flex-1">
              <defs>
                <linearGradient id="heroArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3987e5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3987e5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 90, 140].map((y) => (
                <line key={y} x1="0" x2="520" y1={y} y2={y} stroke="rgb(148 163 184 / 0.08)" strokeWidth="1" />
              ))}
              <path d={area} fill="url(#heroArea)" className="animate-fade-up" />
              <path
                d={line}
                fill="none"
                stroke="#3987e5"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                className="animate-draw"
              />
              <circle cx={last[0]} cy={last[1]} r="4" fill="#fff" stroke="#3987e5" strokeWidth="2" />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[9.5px] text-slate-600">
              <span>W1</span><span>W4</span><span>W8</span><span>W12</span>
            </div>
          </div>
          <div className="bg-navy-900 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-300">Automations</p>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" /> running
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {feed.map((f) => (
                <li key={f.t} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className={`text-[11px] font-medium ${f.tone}`}>{f.t}</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-slate-400">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="relative mt-3 text-center text-[11px] text-slate-500 lg:text-right">
        Concept interface with illustrative data.
      </p>
    </div>
  );
}
