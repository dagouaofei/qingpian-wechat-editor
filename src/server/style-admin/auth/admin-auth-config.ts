import type { StyleAdminAuthConfig } from "./admin-auth-types";

export function getStyleAdminAuthConfig(): StyleAdminAuthConfig {
  const sessionTtlRaw = process.env.STYLE_ADMIN_SESSION_TTL_SECONDS ?? "86400";
  const parsedTtl = Number.parseInt(sessionTtlRaw, 10);

  return {
    username: process.env.STYLE_ADMIN_USERNAME?.trim() ?? "",
    passwordHash: process.env.STYLE_ADMIN_PASSWORD_HASH?.trim() ?? "",
    sessionSecret: process.env.STYLE_ADMIN_SESSION_SECRET?.trim() ?? "",
    sessionTtlSeconds:
      Number.isFinite(parsedTtl) && parsedTtl > 0 ? parsedTtl : 86_400,
  };
}

export function isStyleAdminAuthConfigured(): boolean {
  const config = getStyleAdminAuthConfig();
  return Boolean(config.username && config.passwordHash && config.sessionSecret);
}
