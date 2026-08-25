const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const SIZE: Record<string, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/** quanta Loader — a spinning ring. */
export function Loader({ size = "sm", className, ...rest }: any) {
  return (
    <span
      role="status"
      className={cx(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent opacity-70",
        SIZE[size] ?? SIZE.sm,
        className,
      )}
      {...rest}
    />
  );
}
