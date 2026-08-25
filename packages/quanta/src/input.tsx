import * as React from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** quanta Input — optional `label`, styled text field. */
export const Input = React.forwardRef<HTMLInputElement, any>(function Input(
  { label, className, id, ...rest },
  ref,
) {
  const field = (
    <input
      ref={ref}
      id={id}
      className={cx(
        "h-9 w-full rounded-lg border border-q-border-default bg-q-transparent-light-05 px-3 text-sm text-q-text-primary outline-none placeholder:text-q-text-tertiary focus:border-q-brand-primary",
        className,
      )}
      {...rest}
    />
  );
  if (!label) return field;
  return (
    <label className="flex flex-col gap-1">
      <span className="text-q-caption-sm-medium text-q-text-secondary">{label}</span>
      {field}
    </label>
  );
});
