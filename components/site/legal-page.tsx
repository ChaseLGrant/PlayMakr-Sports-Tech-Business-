import { Header } from "./header";
import { Footer } from "./footer";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="bg-paper pb-24 pt-32">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated {updated}</p>
          <div className="mt-6 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
            Template notice: this document is a starting point and has not been reviewed by a lawyer. Have it reviewed
            for your business and jurisdiction before launch.
          </div>
          <div className="mt-10 space-y-6 text-[15.5px] leading-relaxed text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
