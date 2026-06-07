export type StyleAdminIdentity = {
  username: string;
  actor: string;
};

export type StyleAdminSessionPayload = {
  username: string;
  iat: number;
  exp: number;
};

export type StyleAdminAuthConfig = {
  username: string;
  passwordHash: string;
  sessionSecret: string;
  sessionTtlSeconds: number;
};
