import { isStyleAdminDbConfigured } from "@/server/style-admin/db-availability";
import { prisma } from "@/server/style-admin/prisma";

export type DatabaseHealthStatus = "ok" | "unavailable" | "not_configured";

export type HealthCheckResult = {
  ok: boolean;
  service: "qingpian-wechat-editor";
  database: DatabaseHealthStatus;
  time: string;
};

export async function getHealthCheckResult(): Promise<HealthCheckResult> {
  const time = new Date().toISOString();

  if (!isStyleAdminDbConfigured()) {
    return {
      ok: true,
      service: "qingpian-wechat-editor",
      database: "not_configured",
      time,
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      ok: true,
      service: "qingpian-wechat-editor",
      database: "ok",
      time,
    };
  } catch {
    return {
      ok: false,
      service: "qingpian-wechat-editor",
      database: "unavailable",
      time,
    };
  }
}
