import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const COLOR: Record<string, string> = {
  primary: "text-q-text-primary",
  secondary: "text-q-text-secondary",
  tertiary: "text-q-text-tertiary",
  inverse: "text-q-text-inverse",
  brand: "text-q-brand-primary",
  danger: "text-red-500",
};

/**
 * quanta Typography: `variant` maps to the `text-q-<variant>` utility (defined
 * in tailwind.css), `color` to a semantic text color. `as` picks the element.
 */
export function Typography({
  as: As = "span",
  variant = "body-md-regular",
  color = "primary",
  truncate,
  className,
  children,
  ...rest
}: any) {
  const cls = cx(
    variant && `text-q-${variant}`,
    color && (COLOR[color] ?? `text-q-text-${color}`),
    truncate && "truncate",
    className,
  );
  return (
    <As className={cls} {...rest}>
      {children}
    </As>
  );
}
