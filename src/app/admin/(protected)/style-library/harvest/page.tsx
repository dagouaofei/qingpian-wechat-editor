import Link from "next/link";

import {
  isStyleAdminWriteEnabled,
  STYLE_ADMIN_WRITE_PROTECTION_MESSAGE,
} from "@/server/style-admin/admin-write-guard";
import { STYLE_ADMIN_AUTH_ENABLED_MESSAGE } from "@/server/style-admin/auth";

import { describeHarvestWechatCompatibilityMode } from "@/server/style-admin/harvest/harvest-compatibility-mode";

import { HarvestForm } from "./harvest-form";

export default function AdminStyleLibraryHarvestPage() {
  const writeEnabled = isStyleAdminWriteEnabled();
  const compatibilityMode = describeHarvestWechatCompatibilityMode();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8" data-testid="admin-style-library-harvest-page">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Sprint 10 · S10-STORY-009
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Harvest from HTML</h1>
        <p className="text-base text-slate-600">
          Paste WeChat / 135 / Xiumi / DOM HTML to create a candidate variant in the database.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/admin/style-library" className="text-indigo-700 hover:text-indigo-900">
            ← Back to style library
          </Link>
        </div>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {STYLE_ADMIN_AUTH_ENABLED_MESSAGE}
        </p>
      </header>

      <HarvestForm
        writeEnabled={writeEnabled}
        writeProtectionMessage={STYLE_ADMIN_WRITE_PROTECTION_MESSAGE}
        compatibilityMode={compatibilityMode}
      />
    </main>
  );
}
