const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

export type AvatarColor =
  | "mint"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "slate"
  | string;

const SIZE: Record<string, string> = {
  xxs: "size-4 text-[8px]",
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

const BG: Record<string, string> = {
  mint: "bg-emerald-500/30 text-emerald-200",
  blue: "bg-sky-500/30 text-sky-200",
  violet: "bg-violet-500/30 text-violet-200",
  amber: "bg-amber-500/30 text-amber-100",
  rose: "bg-rose-500/30 text-rose-200",
  slate: "bg-slate-500/30 text-slate-200",
};

/** quanta Avatar — image or initial fallback. */
export function Avatar({ size = "sm", color = "slate", src, alt, className, ...rest }: any) {
  const initial = (alt ?? "").trim().charAt(0).toUpperCase() || "•";
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium",
        SIZE[size] ?? SIZE.sm,
        BG[color] ?? BG.slate,
        className,
      )}
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
