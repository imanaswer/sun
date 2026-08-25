const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** quanta Sidebar — styled passthrough compound. */
function Root({ className, children, ...rest }: any) {
  return (
    <aside
      className={cx(
        "flex w-60 flex-col gap-2 rounded-xl border border-q-border-subtle bg-q-background-secondary p-2",
        className,
      )}
      {...rest}
    >
      {children}
    </aside>
  );
}

const Header = ({ className, children, ...p }: any) => (
  <div className={cx("flex items-center justify-between gap-2 px-2 py-1", className)} {...p}>
    {children}
  </div>
);
const Body = ({ className, children, ...p }: any) => (
  <div className={cx("flex flex-1 flex-col gap-1 overflow-auto", className)} {...p}>
    {children}
  </div>
);
const Footer = ({ className, children, ...p }: any) => (
  <div className={cx("mt-auto border-t border-q-border-subtle pt-2", className)} {...p}>
    {children}
  </div>
);
const Section = ({ className, children, ...p }: any) => (
  <div className={cx("flex flex-col gap-0.5", className)} {...p}>
    {children}
  </div>
);
const SectionItems = ({ className, children, ...p }: any) => (
  <div className={cx("flex flex-col gap-0.5", className)} {...p}>
    {children}
  </div>
);
const Switcher = ({ className, children, ...p }: any) => (
  <div className={cx("flex items-center gap-2", className)} {...p}>
    {children}
  </div>
);
const Logo = ({ className, children, ...p }: any) => (
  <span className={cx("flex items-center", className)} {...p}>
    {children}
  </span>
);
const Title = ({ className, children, ...p }: any) => (
  <span className={cx("text-q-label-md-semi-bold text-q-text-primary", className)} {...p}>
    {children}
  </span>
);
const Toggle = ({ className, children, ...p }: any) => (
  <button
    type="button"
    className={cx(
      "grid size-8 place-items-center rounded-lg text-q-text-secondary hover:bg-q-transparent-light-05",
      className,
    )}
    {...p}
  >
    {children}
  </button>
);
const Item = ({ selected, className, children, ...p }: any) => (
  <button
    type="button"
    aria-current={selected ? "page" : undefined}
    className={cx(
      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
      selected
        ? "bg-q-transparent-light-10 text-q-text-primary"
        : "text-q-text-secondary hover:bg-q-transparent-light-05 hover:text-q-text-primary",
      className,
    )}
    {...p}
  >
    {children}
  </button>
);

export const Sidebar = {
  Root,
  Header,
  Body,
  Footer,
  Section,
  SectionItems,
  Switcher,
  Logo,
  Title,
  Toggle,
  Item,
};
