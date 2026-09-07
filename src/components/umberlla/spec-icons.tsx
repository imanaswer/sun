/**
 * Spec icons, drawn only where a picture actually says something.
 *
 * Fabric, frame and operation are described by their words — "Premium Black
 * Silver Ponjee" needs no drawing, and the earlier umbrella glyphs for those
 * three were near-identical at tile size, which made the grid read as one
 * repeated shape. The three measurements keep a diagram, because a dimension
 * line tells you *which* measurement it is at a glance: rim to rim, end to end,
 * or on a scale.
 *
 * Each is one line drawing on a 24×24 grid, stroked in currentColor so it takes
 * the accent colour and any size. Shared by the product page's spec tiles (34px)
 * and the collection cards (14px), so a measurement looks the same wherever it
 * appears — every drawing has to survive both sizes.
 */

export interface SpecIconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 24, className, children }: SpecIconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/**
 * Open diameter: the canopy seen head-on, measured rim to rim.
 *
 * Three scallops, not four — at 14px a four-scallop hem closes up into a
 * grey band. The arrows point outward into the end ticks so the line reads as
 * a measurement rather than as the ground.
 */
export function OpenDiameterIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M2.8 10.2a9.2 9.2 0 0 1 18.4 0" />
      <path d="M2.8 10.2q3.07 3 6.13 0 3.07 3 6.14 0 3.07 3 6.13 0" />
      <path d="M12 1.6v13.8" />
      <path d="M2.8 20.4h18.4" />
      <path d="M2.8 18.4v4M21.2 18.4v4" />
      <path d="m5.4 18.8-2.6 1.6 2.6 1.6" />
      <path d="m18.6 18.8 2.6 1.6-2.6 1.6" />
    </Svg>
  );
}

/**
 * Closed length: the furled umbrella beside its measure, end to end.
 * Vertical, because that is how a folded umbrella is held and measured.
 */
export function ClosedLengthIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M6.2 10.6c0-4.4 1.5-7.7 3.2-8.7 1.7 1 3.2 4.3 3.2 8.7z" />
      <path d="M9.4 1.9v14.6" />
      <path d="M9.4 16.5v2.6a2 2 0 0 1-4 0" />
      <path d="M18.6 2.4v19.2" />
      <path d="M16.8 2.4h3.6M16.8 21.6h3.6" />
      <path d="m17 5 1.6-2.6L20.2 5" />
      <path d="m17 19 1.6 2.6L20.2 19" />
    </Svg>
  );
}

/**
 * Weight: a platform scale with its dial.
 *
 * The umbrella-on-a-wedge this replaced read as a table at tile size. A scale
 * is the one object in the set that is not an umbrella, which is the point —
 * it is the only tile whose value is a mass.
 */
export function WeightIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.4v16.2" />
      <path d="M8.6 19.6h6.8" />
      <path d="M3.4 7.6h17.2" />
      <path d="M6 7.6v1.3M18 7.6v1.3" />
      <path d="M2.6 8.9h6.8L6 13.9z" />
      <path d="M14.6 8.9h6.8L18 13.9z" />
    </Svg>
  );
}

/**
 * Measurements get a diagram; the descriptive specs deliberately do not.
 * Returns undefined for those, and callers skip the icon slot entirely.
 */
const SPEC_ICONS: Record<string, (props: SpecIconProps) => React.ReactElement> = {
  open_diameter: OpenDiameterIcon,
  closed_length: ClosedLengthIcon,
  weight: WeightIcon,
};

// The explicit `| undefined` matters: without it an index read is typed as
// always-defined and the callers' `SpecIcon && ...` guard becomes a type error.
export function specIcon(key: string): ((props: SpecIconProps) => React.ReactElement) | undefined {
  return SPEC_ICONS[key];
}
