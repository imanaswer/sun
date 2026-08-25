import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Ctx = React.createContext<{ open: boolean; setOpen: (o: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

function Root({ children, open: c, onOpenChange }: any) {
  const [u, setU] = React.useState(false);
  const open = c ?? u;
  const setOpen = onOpenChange ?? setU;
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, setOpen]);
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </Ctx.Provider>
  );
}

function Trigger({ children, className, ...rest }: any) {
  const { open, setOpen } = React.useContext(Ctx);
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cx(className)}
      {...rest}
    >
      {children}
    </button>
  );
}

function Content({ children, className, align = "start", ...rest }: any) {
  const { open } = React.useContext(Ctx);
  if (!open) return null;
  return (
    <div
      role="menu"
      className={cx(
        "absolute z-50 mt-1 min-w-40 rounded-lg border border-q-border-subtle bg-q-background-secondary p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function Item({ children, className, onSelect, onClick, ...rest }: any) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={(e) => {
        onClick?.(e);
        onSelect?.(e);
        setOpen(false);
      }}
      className={cx(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-q-text-primary hover:bg-q-transparent-light-05",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export const Dropdown = { Root, Trigger, Content, Item };
