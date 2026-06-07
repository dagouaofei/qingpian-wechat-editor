import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createHtmlHarvestCandidate,
  previewHtmlHarvestCandidate,
} from "@/server/style-admin/harvest/create-html-harvest-candidate";
import type { StyleAdminPrismaClient } from "@/server/style-admin/prisma";

const HEADING_HTML = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个测试小标题</span>
</section>`;

function createMockDb(options?: {
  existingRuntimeVariantId?: string | null;
}) {
  const created: Record<string, unknown> = {};
  const findUnique = vi.fn().mockResolvedValue(
    options?.existingRuntimeVariantId
      ? { id: "variant-existing", runtimeVariantId: options.existingRuntimeVariantId }
      : null,
  );

  const tx = {
    styleVariant: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.variant = data;
        return { id: "variant-new", ...data };
      }),
      update: vi.fn(),
    },
    styleVariantVersion: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.version = data;
        return { id: "version-1", ...data };
      }),
    },
    styleVariantDistribution: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.distribution = data;
        return { id: "dist-1", ...data };
      }),
    },
    styleVariantSource: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.source = data;
        return { id: "source-1", ...data };
      }),
    },
    styleVariantLifecycleEvent: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.lifecycleEvent = data;
        return { id: "event-1", ...data };
      }),
    },
    adminAuditLog: {
      create: vi.fn().mockImplementation(async ({ data }) => {
        created.audit = data;
        return { id: "audit-1", ...data };
      }),
    },
  };

  const db = {
    styleVariant: { findUnique },
    $transaction: vi.fn(async (callback: (tx: typeof tx) => Promise<void>) => {
      await callback(tx);
      return created;
    }),
  } as unknown as StyleAdminPrismaClient & { __created: typeof created };

  (db as { __created: typeof created }).__created = created;
  return db as StyleAdminPrismaClient & { __created: typeof created };
}

describe("createHtmlHarvestCandidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates heading candidate with html_paste source and not_checked quality", async () => {
    const db = createMockDb();
    const result = await createHtmlHarvestCandidate(db, {
      sourceLabel: "135 paste",
      rawHtml: HEADING_HTML,
      actor: "admin:ops",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.action).toBe("created");
    expect(result.runtimeVariantId).toMatch(/^heading_html_paste_/);
    expect(db.__created.version).toMatchObject({
      qualityStatus: "not_checked",
      createdBy: "admin:ops",
    });
    expect(db.__created.source).toMatchObject({
      sourceType: "html_paste",
      sourceCohort: "s10_html_harvest_v1",
    });
    expect(db.__created.distribution).toMatchObject({
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
    });
    expect(db.__created.audit).toMatchObject({
      action: "create_html_harvest_candidate",
      actor: "admin:ops",
    });
    expect(db.__created.lifecycleEvent).toMatchObject({
      toLifecycle: "candidate",
      actor: "admin:ops",
    });
  });

  it("reuses existing candidate for duplicate rawHtml and blockType", async () => {
    const first = await createHtmlHarvestCandidate(createMockDb(), {
      sourceLabel: "first",
      rawHtml: HEADING_HTML,
      actor: "admin:ops",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const db = createMockDb({ existingRuntimeVariantId: first.runtimeVariantId });
    const second = await createHtmlHarvestCandidate(db, {
      sourceLabel: "second",
      rawHtml: HEADING_HTML,
      actor: "admin:ops",
    });

    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.action).toBe("reused");
    expect(second.runtimeVariantId).toBe(first.runtimeVariantId);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("preview returns detected blockType", () => {
    const preview = previewHtmlHarvestCandidate({ rawHtml: HEADING_HTML });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    expect(preview.detectedBlockType).toBe("heading");
    expect(preview.effectiveBlockType).toBe("heading");
  });
});
