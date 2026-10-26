"use client";

import { useEffect, useRef, useState } from "react";

/** Smoothly tweens to a new value. Formatting is supplied by the caller. */
export function AnimatedNumber({
  value,
  format,
  duration = 700,
  className,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const initial = from.current;
    if (reduce || initial === value) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = initial + (value - initial) * eased;
      from.current = v;
      setDisplay(v);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return <span className={className}>{format(display)}</span>;
}
