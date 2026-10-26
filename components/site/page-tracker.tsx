"use client";

import { useEffect } from "react";
import { captureAttribution, setVariant, track } from "@/lib/analytics";

/** Records a page view and first-touch attribution once per page load. */
export function PageTracker({ variant }: { variant?: "A" | "B" }) {
  useEffect(() => {
    if (variant) setVariant(variant);
    captureAttribution();
    track("page_view", variant ? { variant } : undefined);
  }, [variant]);
  return null;
}
