/**
 * ponytail: RECONSTRUCTED @higgsfield/app-landing. The real package validates
 * and normalizes a landing-content object (likely via zod). The app passes a
 * fully-formed object, so a typed identity passthrough is enough to build and
 * run. Upgrade path: swap in the real package if you need its schema
 * validation / defaults.
 */
export type LandingContent = Record<string, unknown>;

export function parseLandingContent<T extends LandingContent>(content: T): T {
  return content;
}
