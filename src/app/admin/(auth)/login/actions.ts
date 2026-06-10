"use server";

import {
  isStyleAdminAuthConfigured,
  sanitizeAdminNextPath,
  setAdminSessionCookie,
  verifyAdminPasswordForConfig,
} from "@/server/style-admin/auth";
import { getStyleAdminAuthConfig } from "@/server/style-admin/auth/admin-auth-config";

export type AdminLoginState =
  | { ok: true; redirectTo: string }
  | { ok: false; message: string };

export async function loginAdminAction(input: {
  username: string;
  password: string;
  next?: string;
}): Promise<AdminLoginState> {
  if (!isStyleAdminAuthConfigured()) {
    return { ok: false, message: "Admin authentication is not configured." };
  }

  const config = getStyleAdminAuthConfig();
  const username = input.username.trim();
  const password = input.password;

  if (!username || !password) {
    return { ok: false, message: "Username and password are required." };
  }

  if (username !== config.username || !verifyAdminPasswordForConfig(password, config)) {
    return { ok: false, message: "Invalid username or password." };
  }

  await setAdminSessionCookie(username);
  return { ok: true, redirectTo: sanitizeAdminNextPath(input.next) };
}
