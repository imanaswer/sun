import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Ctx = React.createContext<{ value?: any; onValueChange?: (v: any) => void; variant?: string }>(
  {},
);

function Root({ value, onValueChange, variant = "pill", className, children, ...rest }: any) {
  return (
    <Ctx.Provider value={{ value, onValueChange, variant }}>
      <div className={cx(className)} {...rest}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

/** Tabs.List renders from an `items` array of { value, label }. */
function List({ items = [], className, ...rest }: any) {
  const { value, onValueChange, variant } = React.useContext(Ctx);
  const seg = variant === "segmented";
  return (
    <div
      role="tablist"
      className={cx(
        "inline-flex gap-1 rounded-lg p-1",
        seg ? "bg-q-transparent-light-05" : "",
        className,
      )}
      {...rest}
    >
      {items.map((it: any) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange?.(it.value)}
            className={cx(
              "rounded-md px-3 py-1 text-sm transition",
              active
                ? "bg-q-brand-primary text-q-text-inverse"
                : "text-q-text-secondary hover:text-q-text-primary",
            )}
          >
            {it.label ?? it.value}
          </button>
        );
      })}
    </div>
  );
}

export const Tabs = { Root, List };
