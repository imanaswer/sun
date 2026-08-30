const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** quanta `card({ surface, ... })` class helper. */
export function card(
  opts: { surface?: "solid" | "glass" | "subtle"; [key: string]: unknown } = {},
  ...extra: (string | false | undefined)[]
): string {
  const surface = (opts.surface as string) ?? "solid";
  const surf: Record<string, string> = {
    solid: "bg-q-background-secondary border border-q-border-subtle",
    subtle: "bg-q-transparent-light-05 border border-q-border-subtle",
    glass: "bg-q-transparent-light-05 backdrop-blur border border-q-border-subtle",
  };
  return cx("rounded-xl", surf[surface] ?? surf.solid, ...extra);
}
