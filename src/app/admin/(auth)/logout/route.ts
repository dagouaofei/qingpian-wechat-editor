import { redirect } from "next/navigation";

import { clearAdminSession } from "@/server/style-admin/auth";

export async function GET() {
  await clearAdminSession();
  redirect("/admin/login");
}
