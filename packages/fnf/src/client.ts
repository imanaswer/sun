/**
 * ponytail: RECONSTRUCTED @higgsfield/fnf/client. The real fnf package (the
 * Higgsfield generation feed client) was missing from the export. The app uses
 * these types + helpers only in src/lib/higgsfield-generation-results.ts, which
 * drives the /app dashboard against placeholder data. Types are loose and the
 * helpers are best-effort over the fields the app actually reads. Replace with
 * the real package to wire a live feed.
 */

export type OutputType = "image" | "video" | string;
export type JobPhase = "pending" | "running" | "completed" | "failed" | string;

export interface GenerationResults {
  thumbnailUrl?: string;
  url?: string;
  previewUrl?: string;
  rawUrl?: string;
  [key: string]: unknown;
}

export interface Generation {
  id?: string;
  type: OutputType;
  status: string;
  createdAt?: number;
  failReason?: string;
  input: { prompt?: { instruction?: string } };
  results?: GenerationResults;
  [key: string]: unknown;
}

const TERMINAL = new Set(["completed", "failed", "canceled", "cancelled", "error"]);

export function isTerminalJobStatus(status: string | undefined): boolean {
  return status != null && TERMINAL.has(status);
}

export function getJobPhase(gen: Generation): JobPhase {
  const s = gen.status;
  if (s === "failed" || s === "error" || s === "canceled" || s === "cancelled") return "failed";
  if (s === "completed") return "completed";
  if (s === "running" || s === "processing" || s === "in_progress") return "running";
  return "pending";
}

/** Accepts a Generation or a plain URL string; infers image vs video. */
export function getMediaType(input: Generation | string | undefined): OutputType | undefined {
  if (input == null) return undefined;
  if (typeof input === "string") {
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(input) ? "video" : "image";
  }
  return input.type;
}

export function hasResult(gen: Generation): boolean {
  const r = gen.results;
  return !!r && (!!r.url || !!r.rawUrl || !!r.previewUrl || !!r.thumbnailUrl);
}

export function getRawUrl(gen: Generation): string | undefined {
  return gen.results?.rawUrl ?? gen.results?.url ?? undefined;
}

export function getPreviewUrl(gen: Generation): string | undefined {
  return gen.results?.previewUrl ?? gen.results?.thumbnailUrl ?? getRawUrl(gen);
}
