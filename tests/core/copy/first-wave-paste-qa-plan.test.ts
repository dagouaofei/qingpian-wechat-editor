import { describe, expect, it } from "vitest";

import {
  buildRelease1FirstWavePasteQaPlan,
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  RELEASE1_FIRST_WAVE_VARIANT_GROUPS,
} from "@/core/copy";

describe("release 1 first-wave paste qa plan", () => {
  const plan = buildRelease1FirstWavePasteQaPlan();

  it("contains 92 release1 variants across 11 blocks", () => {
    expect(plan).toHaveLength(92);
    expect(RELEASE1_FIRST_WAVE_VARIANT_GROUPS).toHaveLength(11);

    const distribution = new Map<string, number>();
    for (const entry of plan) {
      distribution.set(entry.blockType, (distribution.get(entry.blockType) ?? 0) + 1);
    }

    const expectedCounts: Record<string, number> = {
      title: 3,
      heading: 8,
      lead: 9,
      paragraph: 9,
      divider: 9,
      list: 9,
      quote: 9,
      highlight: 9,
      info_card: 9,
      cta: 9,
      image_placeholder: 9,
    };
    expect([...distribution.entries()].sort()).toEqual(
      RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES.map((blockType) => [
        blockType,
        expectedCounts[blockType] ?? 0,
      ]).sort(),
    );
  });

  it("provides required fields for every plan entry", () => {
    for (const entry of plan) {
      expect(entry).toEqual(
        expect.objectContaining({
          blockType: expect.any(String),
          variantId: expect.any(String),
          copySafety: expect.stringMatching(/^(strict|balanced|preview_only)$/),
          rendererCoverage: "copy_renderer_covered",
          pasteQaStatus: "not_run",
          requiresRealWechatPasteQa: true,
        }),
      );
      expect(entry.notes.length).toBeGreaterThan(0);
    }
  });

  it("keeps all paste QA status values as not_run", () => {
    expect(new Set(plan.map((entry) => entry.pasteQaStatus))).toEqual(
      new Set(["not_run"]),
    );
    expect(JSON.stringify(plan)).not.toMatch(/\b(Passed|Failed|passed|failed)\b/);
  });

  it("matches copySafety values from the first-wave variant registry groups", () => {
    const expected = new Map(
      RELEASE1_FIRST_WAVE_VARIANT_GROUPS.flatMap((group) =>
        group.variants.map((variant) => [
          variant.id,
          variant.compatibility.copySafety,
        ]),
      ),
    );

    for (const entry of plan) {
      expect(entry.copySafety).toBe(expected.get(entry.variantId));
    }
  });

  it("marks balanced variants as requiring real WeChat paste verification", () => {
    const balanced = plan.filter((entry) => entry.copySafety === "balanced");
    const strict = plan.filter((entry) => entry.copySafety === "strict");

    expect(balanced.length).toBeGreaterThan(0);
    expect(strict.length).toBeGreaterThan(0);
    for (const entry of balanced) {
      expect(entry.notes.join(" ")).toContain(
        "requires real WeChat paste fidelity verification",
      );
    }
    for (const entry of strict) {
      expect(entry.notes.join(" ")).toContain(
        "snapshot covered, paste verification still not run",
      );
    }
  });

  it("includes text-first and structured scopes without candidates or preview-only variants", () => {
    expect(plan.some((entry) => entry.scope === "text_first")).toBe(true);
    expect(plan.some((entry) => entry.scope === "structured")).toBe(true);
    expect(plan).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ copySafety: "preview_only" }),
      ]),
    );
    expect(plan.map((entry) => entry.variantId)).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining("candidate"),
        expect.stringContaining("experimental"),
      ]),
    );
  });

  it("marks cta and image_placeholder as Release 1 placeholder scope", () => {
    const placeholderEntries = plan.filter(
      (entry) =>
        entry.blockType === "cta" || entry.blockType === "image_placeholder",
    );

    expect(placeholderEntries).toHaveLength(18);
    for (const entry of placeholderEntries) {
      expect(entry.notes.join(" ")).toContain("Release 1 placeholder scope only");
    }
  });

  it("builds a copy registry covering all 11 first-wave block types", () => {
    const registry = createRelease1FirstWaveCopyRendererRegistry();

    for (const blockType of RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES) {
      expect(registry.has(blockType, "copy")).toBe(true);
    }
    expect(registry.list()).toHaveLength(11);
  });
});
