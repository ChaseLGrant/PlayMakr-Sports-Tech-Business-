"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button";

/** A CTA link that records a cta_click event with its label and placement. */
export function CtaLink({
  href,
  children,
  location,
  variant = "primary",
  size = "lg",
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  location: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className={buttonClass(variant, size, className)}
      onClick={() => {
        onClick?.();
        track("cta_click", { location, label: typeof children === "string" ? children : href });
      }}
    >
      {children}
    </Link>
  );
}
