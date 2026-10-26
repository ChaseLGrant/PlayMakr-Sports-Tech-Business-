"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Info, RotateCcw } from "lucide-react";
import {
  calculateOpportunity,
  calculatorInputSchema,
  CALC_STORAGE_KEY,
  defaultCalculatorInputs,
  formatCurrency,
  formatNumber,
  type CalculatorInputs,
} from "@/lib/calculator";
import { track } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/section";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";



type Field = {
  key: keyof CalculatorInputs;
  label: string;
  help?: string;
  min: number;
  sliderMax: number;
  step: number;
  unit: "$" | "%" | "#" | "hrs" | "$/hr";
};

const groups: { title: string; fields: Field[] }[] = [
  {
    title: "Revenue & leads",
    fields: [
      { key: "annualRevenue", label: "Annual business revenue", min: 0, sliderMax: 20_000_000, step: 50_000, unit: "$", help: "Used to keep the estimate in proportion." },
      { key: "monthlyLeads", label: "Monthly lead volume", min: 0, sliderMax: 1_000, step: 5, unit: "#", help: "Inquiries, trial requests, tour requests, etc." },
      { key: "currentConversionPct", label: "Current lead conversion rate", min: 0, sliderMax: 100, step: 1, unit: "%" },
      { key: "targetConversionPct", label: "Estimated achievable conversion rate", min: 0, sliderMax: 100, step: 1, unit: "%", help: "Be conservative — a few points is meaningful." },
      { key: "avgCustomerValue", label: "Average first-year customer value", min: 0, sliderMax: 10_000, step: 50, unit: "$" },
    ],
  },
  {
    title: "Administrative time",
    fields: [
      { key: "weeklyAdminHours", label: "Weekly administrative hours (all staff)", min: 0, sliderMax: 400, step: 1, unit: "hrs" },
      { key: "hourlyLaborCost", label: "Estimated hourly labor cost", min: 0, sliderMax: 150, step: 1, unit: "$/hr", help: "Wages plus taxes and benefits." },
      { key: "automatablePct", label: "Admin time that could be eliminated", min: 0, sliderMax: 100, step: 1, unit: "%" },
    ],
  },
  {
    title: "Software",
    fields: [
      { key: "monthlyRedundantSoftware", label: "Monthly spend on potentially redundant software", min: 0, sliderMax: 10_000, step: 25, unit: "$" },
    ],
  },
  {
    title: "Assumption",
    fields: [
      {
        key: "cashRealizationPct",
        label: "Freed time that becomes actual cash savings",
        min: 0,
        sliderMax: 100,
        step: 5,
        unit: "%",
        help: "Freed hours usually go to higher-value work, not lower payroll. Only this share (e.g. reduced overtime or contractor hours) counts toward the total.",
      },
    ],
  },
];

const schemaMax = (k: keyof CalculatorInputs) => {
  const s = calculatorInputSchema.shape[k];
  return (s as unknown as { maxValue: number }).maxValue ?? Number.MAX_SAFE_INTEGER;
};

function formatField(unit: Field["unit"], v: number) {
  if (unit === "$" || unit === "$/hr") return formatCurrency(v);
  return formatNumber(v);
}

export function RevenueCalculator() {
  const router = useRouter();
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultCalculatorInputs);
  const touched = useRef(new Set<string>());
  const completed = useRef(false);

  const results = useMemo(() => calculateOpportunity(inputs), [inputs]);

  function update(key: keyof CalculatorInputs, raw: number) {
    const max = schemaMax(key);
    const v = Number.isFinite(raw) ? Math.min(max, Math.max(0, raw)) : 0;
    setInputs((prev) => ({ ...prev, [key]: v }));
    if (touched.current.size === 0) track("calculator_start");
    touched.current.add(key);
    if (!completed.current && touched.current.size >= 3) {
      completed.current = true;
      track("calculator_complete", { fields_changed: touched.current.size });
    }
  }

  function goToAudit() {
    try {
      sessionStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* storage unavailable: the form still works without calculator data */
    }
    if (!completed.current) {
      completed.current = true;
      track("calculator_complete", { fields_changed: touched.current.size, via: "cta" });
    }
    track("cta_click", { location: "calculator", label: "Get My Free Technology Audit" });
    router.push("/apply?ref=calculator");
  }

  const bars = [
    {
      label: "Additional revenue from improved conversion",
      value: results.additionalRevenue,
      formula: `${formatNumber(inputs.monthlyLeads)} leads × 12 × ${Math.max(0, inputs.targetConversionPct - inputs.currentConversionPct)} pts × ${formatCurrency(inputs.avgCustomerValue)}`,
    },
    {
      label: "Software cost reduction",
      value: results.softwareSavings,
      formula: `${formatCurrency(inputs.monthlyRedundantSoftware)} × 12 months`,
    },
    {
      label: "Labor cash savings",
      value: results.laborCashSavings,
      formula: `${formatCurrency(results.laborCapacityValue)} capacity × ${inputs.cashRealizationPct}% realized`,
    },
  ];
  const scaleMax = Math.max(1, ...bars.map((b) => b.value), results.laborCapacityValue);

  return (
    <Section id="calculator" tone="dark" labelledBy="calc-title" className="border-y border-white/[0.05]">
      <SectionHeading
        id="calc-title"
        eyebrow="Revenue leakage calculator"
        title="See How Much Your Current Systems Could Be Costing You."
        lede="Adjust the numbers to match your organization. Every formula is shown, and nothing is counted twice."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* Inputs */}
        <div className="rounded-2xl border border-white/[0.08] bg-navy-900/60 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Your numbers</p>
            <button
              type="button"
              onClick={() => setInputs(defaultCalculatorInputs)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={13} aria-hidden /> Reset
            </button>
          </div>
          <div className="mt-2 space-y-8">
            {groups.map((g) => (
              <fieldset key={g.title} className="space-y-5">
                <legend className="mb-4 mt-4 w-full border-b border-white/[0.06] pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-electric-300">
                  {g.title}
                </legend>
                {g.fields.map((f) => (
                  <InputRow key={f.key} field={f} value={inputs[f.key]} onChange={(v) => update(f.key, v)} />
                ))}
              </fieldset>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-electric-400/25 bg-gradient-to-b from-navy-800 to-navy-900 shadow-[0_30px_80px_-30px_rgb(47_124_246/0.45)]">
            <div className="p-6 sm:p-8" aria-live="polite">
              <p className="text-sm text-slate-400">Total illustrative annual opportunity</p>
              <p className="mt-2 text-[2.6rem] font-semibold leading-none tracking-tight text-white tabular-nums sm:text-6xl">
                <AnimatedNumber value={results.totalOpportunity} format={(n) => formatCurrency(n)} />
              </p>
              <p className="mt-3 text-sm text-slate-400">
                {results.opportunityPctOfRevenue !== null ? (
                  <>
                    About <span className="font-medium text-slate-200">{results.opportunityPctOfRevenue.toFixed(1)}%</span> of annual revenue ·{" "}
                  </>
                ) : null}
                estimate, not a guarantee
              </p>

              <ul className="mt-8 space-y-5">
                {bars.map((b) => (
                  <li key={b.label} className="group">
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="text-slate-300">{b.label}</span>
                      <span className="font-semibold tabular-nums text-white">
                        <AnimatedNumber value={b.value} format={(n) => formatCurrency(n)} />
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-series-1 transition-[width] duration-500"
                        style={{ width: `${(b.value / scaleMax) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-slate-500">{b.formula}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-slate-300">Labor capacity freed</span>
                  <span className="font-semibold tabular-nums text-white">
                    {formatNumber(results.hoursFreedPerYear)} hrs / yr
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                  <div className="hatch h-full rounded-full transition-[width] duration-500" style={{ width: `${(results.laborCapacityValue / scaleMax) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Valued at {formatCurrency(results.laborCapacityValue)} of staff time. This is capacity, not guaranteed
                  payroll savings. Only the {inputs.cashRealizationPct}% you marked as cash savings is included in the total.
                </p>
              </div>

              {results.warnings.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {results.warnings.map((w) => (
                    <li key={w} className="flex gap-2.5 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-relaxed text-amber-100">
                      <AlertTriangle size={15} className="mt-px shrink-0 text-amber-300" aria-hidden />
                      {w}
                    </li>
                  ))}
                </ul>
              )}

              <details className="group mt-5 text-sm">
                <summary className="inline-flex cursor-pointer items-center gap-1.5 text-slate-400 hover:text-white">
                  <Info size={14} aria-hidden /> How we calculate this
                </summary>
                <ul className="mt-3 space-y-2 rounded-lg bg-black/20 p-4 font-mono text-[11.5px] leading-relaxed text-slate-400">
                  <li>Revenue = monthly leads × 12 × (achievable % − current %) × first-year value</li>
                  <li>Hours freed = weekly admin hours × 52 × % eliminated</li>
                  <li>Capacity value = hours freed × hourly cost (reported, not totaled)</li>
                  <li>Labor cash savings = capacity value × % realized as cash</li>
                  <li>Software = monthly redundant spend × 12</li>
                  <li>Total = revenue + labor cash savings + software</li>
                </ul>
              </details>
            </div>

            <div className="border-t border-white/[0.07] bg-navy-950/60 p-6 sm:p-8">
              <p className="text-lg font-semibold text-white">Want to Know What These Numbers Look Like for Your Organization?</p>
              <p className="mt-1.5 text-sm text-slate-400">Your calculator inputs can be attached to your application so we start from your numbers.</p>
              <button type="button" onClick={goToAudit} className={buttonClass("primary", "lg", "mt-5 w-full")}>
                Get My Free Technology Audit <ArrowRight size={17} aria-hidden />
              </button>
            </div>
          </div>
          <p className="mt-4 px-1 text-xs leading-relaxed text-slate-500">
            Estimates are illustrative and based entirely on the values you enter. They are not a guarantee or
            prediction of results. Actual outcomes depend on your organization, market, execution and many other factors.
          </p>
        </div>
      </div>
    </Section>
  );
}

function InputRow({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) {
  const id = `calc-${field.key}`;
  const helpId = field.help ? `${id}-help` : undefined;
  const fill = Math.min(100, (value / field.sliderMax) * 100);
  const isMoney = field.unit === "$" || field.unit === "$/hr";
  const suffix = field.unit === "%" ? "%" : field.unit === "hrs" ? "hrs" : field.unit === "$/hr" ? "/hr" : "";
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-[14px] text-slate-300">
          {field.label}
        </label>
        <div className="flex h-9 shrink-0 items-center rounded-lg border border-white/10 bg-navy-950 px-2.5 focus-within:border-electric-400">
          {isMoney && <span className="text-sm text-slate-500">$</span>}
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={formatNumber(value)}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d.]/g, "");
              onChange(digits === "" ? 0 : Number(digits));
            }}
            onFocus={(e) => e.currentTarget.select()}
            aria-describedby={helpId}
            className={cn(
              "w-[6.5rem] bg-transparent text-right text-sm font-medium tabular-nums text-white outline-none",
              field.key === "annualRevenue" && "w-[7.5rem]",
            )}
          />
          {suffix && <span className="ml-1 text-sm text-slate-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        className="range mt-1.5"
        min={field.min}
        max={field.sliderMax}
        step={field.step}
        value={Math.min(value, field.sliderMax)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${field.label} slider`}
        aria-valuetext={`${formatField(field.unit, value)}${field.unit === "%" ? "%" : ""}`}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      {field.help && (
        <p id={helpId} className="text-xs leading-relaxed text-slate-500">
          {field.help}
        </p>
      )}
    </div>
  );
}

