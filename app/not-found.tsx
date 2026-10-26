import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-navy-950 px-4 text-center">
      <p className="font-mono text-sm text-electric-300">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">This page doesn’t exist.</h1>
      <Link href="/" className={buttonClass("primary", "md", "mt-8")}>Back to home</Link>
    </main>
  );
}
