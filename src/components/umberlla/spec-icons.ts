import {
  ArrowsHorizontal,
  HandTap,
  Info,
  Ruler,
  Scales,
  Swatches,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";

/**
 * One line icon per spec, so a tile reads at a glance instead of as a wall of
 * small caps. Keys are the metafield keys from SPEC_FIELDS in lib/shopify;
 * anything new gets the neutral Info mark until it earns its own.
 *
 * Its own module because both the product page and the collection card use it,
 * and importing one from the other would close a cycle.
 */
const SPEC_ICONS: Record<string, Icon> = {
  fabric_type: Swatches,
  frame_material: Wrench,
  method_of_operation: HandTap,
  weight: Scales,
  closed_length: Ruler,
  open_diameter: ArrowsHorizontal,
};

export function specIcon(key: string): Icon {
  return SPEC_ICONS[key] ?? Info;
}
