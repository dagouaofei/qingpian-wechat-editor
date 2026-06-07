/**
 * Dev-only HTTP APIs under `/api/dev/*` are enabled in local development and test runs only.
 * They are not part of the formal user-facing product surface.
 */
export function isDevApiEnabled(): boolean {
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv === "development" || nodeEnv === "test";
}
