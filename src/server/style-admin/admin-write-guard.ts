export const STYLE_ADMIN_WRITE_PROTECTION_MESSAGE =
  "Production write actions require admin login and STYLE_ADMIN_WRITE_ENABLED=true. Development and test environments allow writes for authenticated admins by default.";

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
