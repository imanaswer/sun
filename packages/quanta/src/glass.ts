const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** quanta `glass()` class helper — translucent frosted surface. */
export function glass(extra = ""): string {
  return cx(
    "bg-q-transparent-light-05 backdrop-blur-md border border-q-border-subtle",
    extra,
  );
}
