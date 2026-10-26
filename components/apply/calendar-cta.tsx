"use client";

import { CalendarDays } from "lucide-react";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";

export function CalendarCta({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("calendar_click")}
      className={buttonClass("primary", "lg")}
    >
      <CalendarDays size={18} aria-hidden /> Schedule Your Audit Call
    </a>
  );
}
