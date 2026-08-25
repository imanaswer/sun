const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** quanta Media — a framed media container with Image/Video/Overlay/Fallback. */
export function Media({ className, children, ...rest }: any) {
  return (
    <div
      className={cx("relative overflow-hidden bg-q-background-secondary", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

Media.Image = ({ className, ...p }: any) => (
  <img className={cx("h-full w-full object-cover", className)} {...p} />
);

Media.Video = ({ className, ...p }: any) => (
  <video className={cx("h-full w-full object-cover", className)} {...p} />
);

Media.Overlay = ({ className, children, ...p }: any) => (
  <div className={cx("absolute inset-0", className)} {...p}>
    {children}
  </div>
);

Media.Fallback = ({ className, children, ...p }: any) => (
  <div
    className={cx(
      "flex h-full w-full items-center justify-center bg-q-background-secondary text-q-text-tertiary",
      className,
    )}
    {...p}
  >
    {children}
  </div>
);
