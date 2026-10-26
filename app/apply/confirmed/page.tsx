import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CalendarCta } from "@/components/apply/calendar-cta";
import { buttonClass } from "@/components/ui/button";
import { brand, calendarUrl } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative flex min-h-[80dvh] items-center overflow-hidden bg-navy-950 px-4 pb-20 pt-32">
        <div aria-hidden className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-electric-600/20 blur-[120px]" />
        <div className="relative mx-auto w-full max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 animate-fade-up items-center justify-center rounded-2xl bg-electric-500 shadow-[0_12px_40px_-8px_rgb(47_124_246/0.8)]">
            <Check size={30} className="text-white" aria-hidden />
          </div>
          <h1 className="mt-8 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your application has been received.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-lg text-slate-400">
            Thank you for applying to {brand.programName}. Our team personally reviews every application.
          </p>

          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-left sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Next steps</h2>
            <ol className="mt-4 space-y-3 text-[15px] text-slate-300">
              <li><span className="mr-2 font-mono text-electric-300">01</span>We review your organization and goals.</li>
              <li>
                <span className="mr-2 font-mono text-electric-300">02</span>
                {calendarUrl ? "Pick a time for your audit call below, or we'll reach out to schedule." : "We contact you to schedule your audit call."}
              </li>
              <li><span className="mr-2 font-mono text-electric-300">03</span>You receive prioritized recommendations, with no obligation.</li>
            </ol>
            {calendarUrl ? (
              <div className="mt-7 flex flex-col items-start gap-3 border-t border-white/[0.06] pt-7 sm:flex-row sm:items-center">
                <CalendarCta url={calendarUrl} />
                <p className="text-sm text-slate-500">Opens our scheduling page in a new tab.</p>
              </div>
            ) : null}
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Questions? Email <a className="text-slate-300 underline-offset-2 hover:underline" href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
          </p>
          <Link href="/" className={buttonClass("ghost", "md", "mt-4")}>Back to home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
