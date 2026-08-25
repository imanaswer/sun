import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

type ButtonVariant = "primary" | "outline" | "ghost" | "secondary";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANT: Record<string, string> = {
  primary: "bg-q-brand-primary text-q-text-inverse hover:opacity-90",
  secondary: "bg-q-background-secondary text-q-text-primary hover:opacity-90",
  outline:
    "border border-q-border-default text-q-text-primary hover:bg-q-transparent-light-05",
  ghost: "text-q-text-primary hover:bg-q-transparent-light-05",
};

const SIZE: Record<string, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6",
  icon: "h-9 w-9 p-0",
};

/** Class-name helper mirroring quanta's `button({ variant, size })` cva. */
export function button(
  opts: { variant?: ButtonVariant; size?: ButtonSize } = {},
  extra = "",
): string {
  const { variant = "primary", size = "md" } = opts;
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition select-none disabled:pointer-events-none disabled:opacity-50",
    VARIANT[variant] ?? VARIANT.primary,
    SIZE[size] ?? SIZE.md,
    extra,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, any>(function Button(
  { variant, size, className, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={button({ variant, size }, className)} {...rest}>
      {children}
    </button>
  );
});
