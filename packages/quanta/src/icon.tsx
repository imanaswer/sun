import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** A glyph is any component that renders an svg driven by `currentColor`. */
export type IconGlyph = React.ComponentType<{ className?: string }>;

const SIZE: Record<string, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
};

const COLOR: Record<string, string> = {
  primary: "text-q-icon-primary",
  secondary: "text-q-text-secondary",
  tertiary: "text-q-text-tertiary",
  inverse: "text-q-icon-inverse",
  brand: "text-q-brand-primary",
  danger: "text-red-500",
  neutral: "",
};

/** Class-name helper mirroring quanta's `icon({ size, color })`. */
export function icon(
  opts: { size?: string; color?: string } = {},
  extra = "",
): string {
  const { size = "md", color } = opts;
  return cx(SIZE[size] ?? SIZE.md, color ? (COLOR[color] ?? "") : "", extra);
}

export function Icon({ as: As, size = "md", color, className, ...rest }: any) {
  if (!As) return null;
  return <As className={icon({ size, color }, className)} {...rest} />;
}
