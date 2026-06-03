/**
 * `/dev/style-fidelity` is disabled on production deploys by default.
 * Local `npm start` after build: set STYLE_FIDELITY_DEBUG=1 to enable.
 */
export function isStyleFidelityDebugEnabled(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return process.env.STYLE_FIDELITY_DEBUG === "1";
}
