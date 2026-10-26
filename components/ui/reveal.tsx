import { cn } from "@/lib/utils";

/**
 * Fades content up as it scrolls into view using CSS scroll-driven animations.
 * Browsers without support (and visitors who prefer reduced motion) simply see
 * the content immediately. Content is never hidden waiting on JavaScript.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
