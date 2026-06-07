export type StyleAdminDbAvailability =
  | { configured: true }
  | { configured: false; reason: "missing_database_url" };

export function getStyleAdminDbAvailability(): StyleAdminDbAvailability {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return { configured: false, reason: "missing_database_url" };
  }
  return { configured: true };
}

export function isStyleAdminDbConfigured(): boolean {
  return getStyleAdminDbAvailability().configured;
}
