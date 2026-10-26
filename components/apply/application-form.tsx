"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator, Check, Loader2, Lock } from "lucide-react";
import { stepOrder, stepSchemas, fieldErrors as toFieldErrors, type StepKey } from "@/lib/validation";
import {
  customerOptions,
  employeeOptions,
  locationOptions,
  organizationTypes,
  outcomeOptions,
  revenueOptions,
  techSpendOptions,
} from "@/lib/options";
import { CALC_STORAGE_KEY, calculateOpportunity, calculatorInputSchema, formatCurrency, type CalculatorInputs } from "@/lib/calculator";
import { getAttribution, getSessionId, getVariant, track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Values = {
  organizationName: string;
  website: string;
  organizationType: string;
  locations: string;
  annualRevenue: string;
  employees: string;
  customers: string;
  biggestProblem: string;
  currentSoftware: string;
  desiredOutcome: string;
  monthlyTechSpend: string;
  contactName: string;
  email: string;
  phone: string;
  jobTitle: string;
  consentContact: boolean;
  consentMarketing: boolean;
};

const empty: Values = {
  organizationName: "",
  website: "",
  organizationType: "",
  locations: "",
  annualRevenue: "",
  employees: "",
  customers: "",
  biggestProblem: "",
  currentSoftware: "",
  desiredOutcome: "",
  monthlyTechSpend: "",
  contactName: "",
  email: "",
  phone: "",
  jobTitle: "",
  consentContact: false,
  consentMarketing: false,
};

const stepMeta: Record<StepKey, { title: string; sub: string; fields: (keyof Values)[] }> = {
  organization: { title: "Your organization", sub: "Tell us who you are.", fields: ["organizationName", "website", "organizationType", "locations"] },
  size: { title: "Business size", sub: "This helps us prepare a relevant audit.", fields: ["annualRevenue", "employees", "customers"] },
  challenges: { title: "Challenges & goals", sub: "Where would better systems help most?", fields: ["biggestProblem", "currentSoftware", "desiredOutcome", "monthlyTechSpend"] },
  contact: { title: "Contact details", sub: "Who should we follow up with?", fields: ["contactName", "email", "phone", "jobTitle", "consentContact", "consentMarketing"] },
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ApplicationForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const calc = useStoredCalculator();
  const [includeCalc, setIncludeCalc] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef<number>(0);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const key = stepOrder[step]!;
  const meta = stepMeta[key];
  const isLast = step === stepOrder.length - 1;

  function set<K extends keyof Values>(k: K, v: Values[K]) {
    setValues((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
    if (!started.current) {
      started.current = true;
      track("application_start", { from_calculator: Boolean(calc) });
    }
  }

  function focusFirstError(errs: Record<string, string>) {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
    });
  }

  function validateStep(k: StepKey): boolean {
    const r = stepSchemas[k].safeParse(values);
    if (r.success) return true;
    const errs = toFieldErrors(r.error);
    setErrors(errs);
    focusFirstError(errs);
    return false;
  }

  function goTo(i: number) {
    setStep(i);
    setServerError(null);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(key)) return;
    if (!isLast) {
      track("application_step", { step: step + 1, name: key });
      goTo(step + 1);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    const turnstileToken =
      formRef.current?.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value || undefined;
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          calculator: includeCalc ? calc : null,
          attribution: getAttribution(),
          heroVariant: getVariant(),
          sessionId: getSessionId(),
          company_fax: honeypot || undefined,
          startedAt: startedAt.current,
          turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
          const badStep = stepOrder.findIndex((s) => stepMeta[s].fields.some((f) => data.fieldErrors?.[f]));
          if (badStep >= 0 && badStep !== step) goTo(badStep);
          else focusFirstError(data.fieldErrors);
        }
        setServerError(data.error || "We couldn't submit your application. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.removeItem(CALC_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      router.push("/apply/confirmed");
    } catch {
      setServerError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  const calcTotal = calc ? calculateOpportunity(calc).totalOpportunity : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-2xl border border-white/[0.08] bg-navy-900/70 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)]">
      {/* Progress */}
      <div className="border-b border-white/[0.06] px-5 pb-5 pt-6 sm:px-8">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-[0.16em] text-electric-300">
            Step {step + 1} of {stepOrder.length}
          </span>
          <span className="text-slate-500">About 3 minutes</span>
        </div>
        <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Application progress">
          {stepOrder.map((s, i) => (
            <li key={s} className="min-w-0">
              <div className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-electric-500" : "bg-white/10")} />
              <p className={cn("mt-2 hidden truncate text-[11px] sm:block", i === step ? "text-white" : "text-slate-500")}>
                {i < step && <Check size={11} className="mr-1 inline text-electric-400" aria-hidden />}
                {stepMeta[s].title}
              </p>
              <span className="sr-only">{i < step ? "Completed" : i === step ? "Current step" : "Not started"}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 py-7 sm:px-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-white outline-none">
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{meta.sub}</p>

        <div className="mt-7 space-y-6">
          {key === "organization" && (
            <>
              <TextField name="organizationName" label="Organization name" value={values.organizationName} error={errors.organizationName} onChange={(v) => set("organizationName", v)} autoComplete="organization" required />
              <TextField name="website" label="Website" optional placeholder="yourclub.com" value={values.website} error={errors.website} onChange={(v) => set("website", v)} autoComplete="url" inputMode="url" />
              <SelectField name="organizationType" label="Type of sports organization" value={values.organizationType} error={errors.organizationType} onChange={(v) => set("organizationType", v)} options={organizationTypes} />
              <ChoiceGroup name="locations" label="Number of locations" value={values.locations} error={errors.locations} onChange={(v) => set("locations", v)} options={locationOptions} cols={4} />
            </>
          )}

          {key === "size" && (
            <>
              <ChoiceGroup name="annualRevenue" label="Annual revenue" value={values.annualRevenue} error={errors.annualRevenue} onChange={(v) => set("annualRevenue", v)} options={revenueOptions} cols={3} />
              <ChoiceGroup name="employees" label="Number of employees" hint="Full-time, part-time and regular contractors" value={values.employees} error={errors.employees} onChange={(v) => set("employees", v)} options={employeeOptions} cols={5} />
              <ChoiceGroup name="customers" label="Approximate number of customers or athletes" value={values.customers} error={errors.customers} onChange={(v) => set("customers", v)} options={customerOptions} cols={4} />
            </>
          )}

          {key === "challenges" && (
            <>
              <TextArea name="biggestProblem" label="Biggest operational problem" placeholder="e.g. Registration and parent communication take our staff hours every week, and inquiries slip through the cracks." value={values.biggestProblem} error={errors.biggestProblem} onChange={(v) => set("biggestProblem", v)} />
              <TextArea name="currentSoftware" label="Current software platforms" optional rows={3} placeholder="Registration, scheduling, payments, CRM, email, spreadsheets…" value={values.currentSoftware} error={errors.currentSoftware} onChange={(v) => set("currentSoftware", v)} />
              <SelectField name="desiredOutcome" label="Primary desired outcome" value={values.desiredOutcome} error={errors.desiredOutcome} onChange={(v) => set("desiredOutcome", v)} options={outcomeOptions} />
              <ChoiceGroup name="monthlyTechSpend" label="Estimated monthly technology spending" value={values.monthlyTechSpend} error={errors.monthlyTechSpend} onChange={(v) => set("monthlyTechSpend", v)} options={techSpendOptions} cols={3} />
            </>
          )}

          {key === "contact" && (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField name="contactName" label="Your name" value={values.contactName} error={errors.contactName} onChange={(v) => set("contactName", v)} autoComplete="name" required />
                <TextField name="jobTitle" label="Job title" value={values.jobTitle} error={errors.jobTitle} onChange={(v) => set("jobTitle", v)} autoComplete="organization-title" required />
                <TextField name="email" type="email" label="Work email" value={values.email} error={errors.email} onChange={(v) => set("email", v)} autoComplete="email" inputMode="email" required />
                <TextField name="phone" type="tel" label="Phone number" optional value={values.phone} error={errors.phone} onChange={(v) => set("phone", v)} autoComplete="tel" inputMode="tel" />
              </div>

              {calc && calcTotal !== null && (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-electric-400/25 bg-electric-500/[0.07] p-4">
                  <input type="checkbox" checked={includeCalc} onChange={(e) => setIncludeCalc(e.target.checked)} className="mt-0.5 h-4 w-4 accent-electric-500" />
                  <span className="text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-white">
                      <Calculator size={14} aria-hidden /> Include my calculator estimates
                    </span>
                    <span className="mt-0.5 block text-slate-400">
                      Your inputs (illustrative total {formatCurrency(calcTotal)}/yr) will be shared with our team to prepare your audit.
                    </span>
                  </span>
                </label>
              )}

              <fieldset className="space-y-3">
                <legend className="sr-only">Consent</legend>
                <CheckField
                  name="consentContact"
                  checked={values.consentContact}
                  error={errors.consentContact}
                  onChange={(v) => set("consentContact", v)}
                >
                  I agree that PlayMakr may contact me about this application and my audit, and I have read the{" "}
                  <Link href="/privacy" target="_blank" className="text-electric-300 underline underline-offset-2 hover:text-electric-200">
                    Privacy Policy
                  </Link>
                  . <span className="text-slate-500">(Required)</span>
                </CheckField>
                <CheckField name="consentMarketing" checked={values.consentMarketing} onChange={(v) => set("consentMarketing", v)}>
                  Send me occasional insights and updates by email. You can unsubscribe anytime. <span className="text-slate-500">(Optional)</span>
                </CheckField>
              </fieldset>

              {turnstileSiteKey && (
                <>
                  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                  <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" />
                </>
              )}
            </>
          )}

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label htmlFor="company_fax">Company fax</label>
            <input id="company_fax" name="company_fax" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>
        </div>

        {serverError && (
          <p role="alert" className="mt-6 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {serverError}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-5 sm:px-8">
        {step > 0 ? (
          <button type="button" onClick={() => goTo(step - 1)} className={buttonClass("ghost", "md", "px-2")}>
            <ArrowLeft size={16} aria-hidden /> Back
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} aria-hidden /> Your information stays private
          </span>
        )}
        <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "min-w-[11rem]")}>
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden /> Submitting…
            </>
          ) : isLast ? (
            <>Submit Application <ArrowRight size={17} aria-hidden /></>
          ) : (
            <>Continue <ArrowRight size={17} aria-hidden /></>
          )}
        </button>
      </div>
    </form>
  );
}

/** Calculator inputs saved by the landing-page calculator (browser only). */
function useStoredCalculator(): CalculatorInputs | null {
  const raw = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(CALC_STORAGE_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const parsed = calculatorInputSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }, [raw]);
}

/* ---------- Fields ---------- */

const inputBase =
  "mt-2 block w-full rounded-xl border bg-navy-950 px-4 py-3 text-[15px] text-white placeholder:text-slate-600 outline-none transition-colors focus:border-electric-400 focus:ring-4 focus:ring-electric-500/15";

function FieldLabel({ htmlFor, label, optional }: { htmlFor: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-medium text-slate-200">
      {label}
      {optional && <span className="text-xs font-normal text-slate-500">Optional</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-sm text-rose-300">
      {error}
    </p>
  );
}

function TextField({
  name,
  label,
  value,
  error,
  onChange,
  optional,
  type = "text",
  ...rest
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  optional?: boolean;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  const id = `f-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputBase, error ? "border-rose-400/60" : "border-white/10")}
        {...rest}
      />
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

function TextArea({
  name,
  label,
  value,
  error,
  onChange,
  optional,
  rows = 4,
  placeholder,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  optional?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputBase, "resize-y", error ? "border-rose-400/60" : "border-white/10")}
      />
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  error,
  onChange,
  options,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const id = `f-${name}`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} />
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          inputBase,
          "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
          !value && "text-slate-500",
          error ? "border-rose-400/60" : "border-white/10",
        )}
      >
        <option value="" disabled>
          Select one…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-navy-900 text-white">
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

function ChoiceGroup({
  name,
  label,
  hint,
  value,
  error,
  onChange,
  options,
  cols = 3,
}: {
  name: string;
  label: string;
  hint?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  cols?: 3 | 4 | 5;
}) {
  const errId = `f-${name}-err`;
  return (
    <fieldset aria-describedby={error ? errId : undefined} aria-invalid={Boolean(error)}>
      <legend className="text-sm font-medium text-slate-200">{label}</legend>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div
        className={cn(
          "mt-2.5 grid grid-cols-2 gap-2",
          cols === 3 && "sm:grid-cols-3",
          cols === 4 && "sm:grid-cols-4",
          cols === 5 && "sm:grid-cols-5",
        )}
      >
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-electric-400",
                checked
                  ? "border-electric-400 bg-electric-500/15 text-white"
                  : error
                    ? "border-rose-400/40 text-slate-300 hover:border-white/25"
                    : "border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/[0.03]",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
                // only the first radio receives focus from focusFirstError
                tabIndex={value ? (checked ? 0 : -1) : i === 0 ? 0 : -1}
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <ErrorText id={errId} error={error} />
    </fieldset>
  );
}

function CheckField({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-electric-500"
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-slate-300">
          {children}
        </label>
      </div>
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}
