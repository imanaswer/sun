import * as React from "react";
import { X } from "lucide-react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Ctx = React.createContext<{ open: boolean; setOpen: (o: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

function Root({ children, open: c, onOpenChange }: any) {
  const [u, setU] = React.useState(false);
  const open = c ?? u;
  const setOpen = onOpenChange ?? setU;
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

function Trigger({ children, className, ...rest }: any) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <button type="button" onClick={() => setOpen(true)} className={cx(className)} {...rest}>
      {children}
    </button>
  );
}

function Content({ children, className, ...rest }: any) {
  const { open, setOpen } = React.useContext(Ctx);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-q-transparent-dark-80 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          "flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-q-border-subtle bg-q-background-primary text-q-text-primary shadow-2xl",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}

const Header = ({ className, children, ...p }: any) => (
  <div className={cx("flex items-center justify-between gap-3 border-b border-q-border-subtle p-4", className)} {...p}>
    {children}
  </div>
);
const Title = ({ className, children, ...p }: any) => (
  <h2 className={cx("text-q-title-md-semi-bold text-q-text-primary", className)} {...p}>
    {children}
  </h2>
);
const Body = ({ className, children, ...p }: any) => (
  <div className={cx("flex-1 overflow-auto p-4", className)} {...p}>
    {children}
  </div>
);
const Footer = ({ className, children, ...p }: any) => (
  <div className={cx("flex items-center justify-between gap-3 border-t border-q-border-subtle p-4", className)} {...p}>
    {children}
  </div>
);
const FooterActions = ({ className, children, ...p }: any) => (
  <div className={cx("flex items-center gap-2", className)} {...p}>
    {children}
  </div>
);
const FooterCaption = ({ className, children, ...p }: any) => (
  <span className={cx("text-q-caption-sm-regular text-q-text-tertiary", className)} {...p}>
    {children}
  </span>
);

function Close({ children, className, ...rest }: any) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <button type="button" onClick={() => setOpen(false)} className={cx(className)} {...rest}>
      {children}
    </button>
  );
}

function CloseButton({ className, ...rest }: any) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={() => setOpen(false)}
      className={cx(
        "grid size-8 place-items-center rounded-lg text-q-text-secondary hover:bg-q-transparent-light-05 hover:text-q-text-primary",
        className,
      )}
      {...rest}
    >
      <X className="size-4" />
    </button>
  );
}

export const Modal = {
  Root,
  Trigger,
  Content,
  Header,
  Title,
  Body,
  Footer,
  FooterActions,
  FooterCaption,
  Close,
  CloseButton,
};
