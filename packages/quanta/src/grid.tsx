const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/**
 * quanta VirtualGrid — the real one virtualizes; this renders every item in a
 * CSS grid. Fine for template-sized lists.
 * ponytail: no virtualization; add windowing if a real feed pushes 1000s of items.
 */
export function VirtualGrid({
  items = [],
  cols = 4,
  rowHeight,
  gap = 3,
  renderItem,
  getKey,
  className,
  viewportClassName,
  height,
  overscan: _overscan,
  ...rest
}: any) {
  return (
    <div
      className={cx("h-full overflow-auto", className, viewportClassName)}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
      {...rest}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: `calc(var(--spacing) * ${gap})`,
          gridAutoRows: rowHeight ? `${rowHeight}px` : undefined,
        }}
      >
        {items.map((entry: any, index: number) => (
          <div key={getKey ? getKey(entry, index) : index}>
            {renderItem ? renderItem(entry, index) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
