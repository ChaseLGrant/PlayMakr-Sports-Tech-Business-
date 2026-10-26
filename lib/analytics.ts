"use client";

import type { ClientEventName } from "./analytics-events";

/**
 * Browser-side analytics. Sends anonymous funnel events to /api/events
 * (stored in your database) and, if present, mirrors them to Google Analytics
 * (gtag), Google Tag Manager (dataLayer) or Plausible — no extra code needed.
 */

type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (name: string, opts?: { props?: Props }) => void;
  }
}

const SESSION_KEY = "pm_sid";
const VARIANT_KEY = "pm_variant";
const ATTR_KEY = "pm_attr";

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function getSessionId(): string {
  return safe(() => {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }, "anonymous");
}

export function setVariant(v: "A" | "B") {
  safe(() => sessionStorage.setItem(VARIANT_KEY, v), undefined);
}

export function getVariant(): "A" | "B" | undefined {
  return safe(() => (sessionStorage.getItem(VARIANT_KEY) as "A" | "B" | null) ?? undefined, undefined);
}

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landingPath?: string;
  firstSeenAt?: string;
};

/** First-touch attribution, kept for 30 days in this browser only. */
export function captureAttribution() {
  safe(() => {
    const existing = localStorage.getItem(ATTR_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as Attribution;
      if (parsed.firstSeenAt && Date.now() - Date.parse(parsed.firstSeenAt) < 30 * 86400_000) return;
    }
    const params = new URLSearchParams(window.location.search);
    const attr: Attribution = { landingPath: window.location.pathname, firstSeenAt: new Date().toISOString() };
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
      const v = params.get(k);
      if (v) attr[k] = v.slice(0, 200);
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      attr.referrer = document.referrer.slice(0, 500);
    }
    localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  }, undefined);
}

export function getAttribution(): Attribution | undefined {
  return safe(() => {
    const raw = localStorage.getItem(ATTR_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  }, undefined);
}

export function track(name: ClientEventName, props?: Props) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    name,
    sessionId: getSessionId(),
    variant: getVariant(),
    path: window.location.pathname,
    props,
  });
  safe(() => {
    const blob = new Blob([payload], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/events", blob)) {
      void fetch("/api/events", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  }, undefined);

  safe(() => window.gtag?.("event", name, props), undefined);
  safe(() => window.dataLayer?.push({ event: name, ...props }), undefined);
  safe(() => window.plausible?.(name, props ? { props } : undefined), undefined);
}
