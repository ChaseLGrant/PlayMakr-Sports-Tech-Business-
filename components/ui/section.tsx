import { cn } from "@/lib/utils";

export function Section({
  id,
  tone = "dark",
  className,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: "dark" | "light" | "deep";
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative py-20 sm:py-28",
        tone === "dark" && "bg-navy-950 text-slate-200",
        tone === "deep" && "bg-ink-950 text-slate-200",
        tone === "light" && "bg-paper text-slate-700",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={cn(
        "mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-electric-300" : "text-electric-600",
      )}
    >
      <span className="h-px w-6 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  tone = "dark",
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p className={cn("mt-5 text-pretty text-lg leading-relaxed", tone === "dark" ? "text-slate-400" : "text-slate-600")}>
          {lede}
        </p>
      )}
    </div>
  );
}
