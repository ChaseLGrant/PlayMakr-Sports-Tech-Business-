import { cn } from "@/lib/utils";

export const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap",
  size: {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-[15px] sm:h-13 sm:px-7",
  },
  variant: {
    primary:
      "bg-electric-500 text-white shadow-[0_8px_30px_-8px_rgb(47_124_246/0.7)] hover:bg-electric-400 hover:shadow-[0_10px_36px_-8px_rgb(47_124_246/0.85)] active:translate-y-px",
    secondary:
      "border border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]",
    dark: "bg-navy-900 text-white hover:bg-navy-800",
    outlineDark: "border border-navy-900/15 text-navy-900 hover:border-navy-900/40 hover:bg-navy-900/[0.03]",
    ghost: "text-slate-300 hover:text-white",
  },
};

export type ButtonVariant = keyof typeof buttonStyles.variant;
export type ButtonSize = keyof typeof buttonStyles.size;

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(buttonStyles.base, buttonStyles.size[size], buttonStyles.variant[variant], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
