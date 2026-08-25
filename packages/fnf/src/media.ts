/**
 * ponytail: RECONSTRUCTED @higgsfield/fnf/media type. The real fnf package was
 * missing from the export; the app only imports MediaRef as a type, so a loose
 * shape is enough to build. Replace with the real package when available.
 */
export interface MediaRef {
  id: string;
  url?: string;
  src?: string;
  type?: string;
  [key: string]: unknown;
}
