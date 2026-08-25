const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/**
 * quanta Slider — native range input. Supports either `steps` (array of allowed
 * values, index-driven) or plain min/max/step, with an `onChange(value)`.
 */
export function Slider({ steps, value, onChange, className, min, max, step, ...rest }: any) {
  if (Array.isArray(steps) && steps.length > 0) {
    const idx = Math.max(0, steps.indexOf(value));
    return (
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={idx < 0 ? 0 : idx}
        onChange={(e) => onChange?.(steps[Number(e.target.value)])}
        className={cx("accent-q-brand-primary", className)}
        {...rest}
      />
    );
  }
  return (
    <input
      type="range"
      min={min ?? 0}
      max={max ?? 100}
      step={step ?? 1}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className={cx("accent-q-brand-primary", className)}
      {...rest}
    />
  );
}
