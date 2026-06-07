export const STYLE_ADMIN_WRITE_PROTECTION_MESSAGE =
  "Write actions are temporarily protected until S10-STORY-008 admin login. Do not deploy public admin writes without S10-STORY-008.";

export class StyleAdminWriteDisabledError extends Error {
  readonly code = "style_admin_write_disabled";

  constructor(message = STYLE_ADMIN_WRITE_PROTECTION_MESSAGE) {
    super(message);
    this.name = "StyleAdminWriteDisabledError";
  }
}

export function isStyleAdminWriteEnabled(): boolean {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "development" || nodeEnv === "test") {
    return true;
  }
  return process.env.STYLE_ADMIN_WRITE_ENABLED === "true";
}

export function assertStyleAdminWriteAllowed(): void {
  if (!isStyleAdminWriteEnabled()) {
    throw new StyleAdminWriteDisabledError();
  }
}
