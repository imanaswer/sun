/**
 * Spec icons drawn as umbrellas rather than pulled from a generic set: a wrench
 * says "tool", not "umbrella frame". Each is one line drawing on a 24×24 grid,
 * stroked in currentColor so it takes the accent colour and any size.
 *
 * Shared by the product page's spec tiles and the related-umbrella cards, so a
 * parameter looks the same wherever it appears.
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

/** The canopy every icon is built from: dome plus its scalloped hem. */
const CANOPY_DOME = "M3.2 12.2a8.8 8.8 0 0 1 17.6 0";
const CANOPY_HEM = "M3.2 12.2q2.2 2.8 4.4 0 2.2 2.8 4.4 0 2.2 2.8 4.4 0 2.2 2.8 4.4 0";

/** Fabric: the canopy with its panel seams — the cloth, not the skeleton. */
export function FabricIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d={CANOPY_DOME} />
      <path d={CANOPY_HEM} />
      <path d="M12 3.4v8.8" />
      <path d="M7.6 12.2c0-3.4 1.7-6.9 4.4-8.8" />
      <path d="M16.4 12.2c0-3.4-1.7-6.9-4.4-8.8" />
      <path d="M12 15.6v3.2a2.1 2.1 0 0 1-4.2 0" />
    </Svg>
  );
}

/** Frame: the skeleton — ribs and shaft, the canopy only implied. */
export function FrameIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d={CANOPY_DOME} strokeDasharray="1.6 2.2" />
      <path d="M12 3.6 3.6 12" />
      <path d="M12 3.6 7.8 12" />
      <path d="M12 3.6 16.2 12" />
      <path d="M12 3.6 20.4 12" />
      <path d="M12 3.6v15.2a2.1 2.1 0 0 1-4.2 0" />
      <circle cx="12" cy="2.6" r="1" />
    </Svg>
  );
}

/** Operation: the canopy, and the up-and-down of opening and closing it. */
export function OperationIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d={CANOPY_DOME} />
      <path d={CANOPY_HEM} />
      <path d="M12 3.4v15.4a2.1 2.1 0 0 1-4.2 0" />
      <path d="M16.8 14.6v6.6" />
      <path d="m15.2 16.2 1.6-1.6 1.6 1.6" />
      <path d="m15.2 19.6 1.6 1.6 1.6-1.6" />
    </Svg>
  );
}

/** Weight: the umbrella, on a scale. */
export function WeightIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M4.4 9.6a7.6 7.6 0 0 1 15.2 0" />
      <path d="M4.4 9.6q1.9 2.5 3.8 0 1.9 2.5 3.8 0 1.9 2.5 3.8 0 1.9 2.5 3.8 0" />
      <path d="M12 2v13.4" />
      <path d="M6.6 15.4h10.8l1.4 5.4H5.2z" />
      <path d="M10.6 18.6a1.4 1.4 0 0 1 2.8 0" />
    </Svg>
  );
}

/** Closed length: the folded umbrella, measured end to end. */
export function ClosedLengthIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M7.4 10.4c0-4.1 1.4-7.2 3-8.1 1.6.9 3 4 3 8.1z" />
      <path d="M10.4 2.3v13.9" />
      <path d="M10.4 16.2v2.9a1.9 1.9 0 0 1-3.8 0" />
      <path d="M18.4 2.6v18.8" />
      <path d="M16.8 2.6h3.2M16.8 21.4h3.2" />
      <path d="m17.2 4.6 1.2-1.4 1.2 1.4" />
      <path d="m17.2 19.4 1.2 1.4 1.2-1.4" />
    </Svg>
  );
}

/** Open diameter: the canopy, measured rim to rim. */
export function OpenDiameterIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d="M3.2 10.2a8.8 8.8 0 0 1 17.6 0" />
      <path d="M3.2 10.2q2.2 2.8 4.4 0 2.2 2.8 4.4 0 2.2 2.8 4.4 0 2.2 2.8 4.4 0" />
      <path d="M12 1.6v15" />
      <path d="M3.4 20.6h17.2" />
      <path d="M3.4 19.2v2.8M20.6 19.2v2.8" />
      <path d="m5 19.1-1.6 1.5 1.6 1.5" />
      <path d="m19 19.1 1.6 1.5-1.6 1.5" />
    </Svg>
  );
}

/** Anything without a drawing of its own: a plain umbrella. */
export function SpecFallbackIcon(props: SpecIconProps) {
  return (
    <Svg {...props}>
      <path d={CANOPY_DOME} />
      <path d={CANOPY_HEM} />
      <path d="M12 3.4v15.4a2.1 2.1 0 0 1-4.2 0" />
    </Svg>
  );
}

const SPEC_ICONS: Record<string, (props: SpecIconProps) => React.ReactElement> = {
  fabric_type: FabricIcon,
  frame_material: FrameIcon,
  method_of_operation: OperationIcon,
  weight: WeightIcon,
  closed_length: ClosedLengthIcon,
  open_diameter: OpenDiameterIcon,
};

export function specIcon(key: string) {
  return SPEC_ICONS[key] ?? SpecFallbackIcon;
}
