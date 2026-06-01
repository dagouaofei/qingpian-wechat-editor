import { describe, expect, it } from "vitest";

import {
  RELEASE1_VISUAL_ASSET_COUNT,
  RELEASE1_VISUAL_ASSET_REGISTRY,
  VISUAL_ASSET_KINDS,
  getFallbackVisualAsset,
  getVisualAssetById,
  isVisualAssetCopySafe,
  parseVisualAssetRegistry,
  validateAssetBindingReferences,
  validateVisualAssetReference,
  validateVisualAssetRegistry,
  visualAssetDefinitionSchema,
} from "@/core/styles";

describe("VisualAssetRegistry", () => {
  it("registers between 15 and 30 Release 1 builtin assets", () => {
    expect(RELEASE1_VISUAL_ASSET_COUNT).toBeGreaterThanOrEqual(15);
    expect(RELEASE1_VISUAL_ASSET_COUNT).toBeLessThanOrEqual(30);
    expect(RELEASE1_VISUAL_ASSET_REGISTRY.assets).toHaveLength(
      RELEASE1_VISUAL_ASSET_COUNT,
    );
  });

  it("covers icon, shape, mark, and divider kinds", () => {
    const kinds = new Set(
      RELEASE1_VISUAL_ASSET_REGISTRY.assets.map((asset) => asset.kind),
    );
    expect(kinds.has("icon")).toBe(true);
    expect(kinds.has("shape")).toBe(true);
    expect(kinds.has("mark")).toBe(true);
    expect(kinds.has("divider")).toBe(true);
    expect(VISUAL_ASSET_KINDS).toContain("icon");
  });

  it("includes assetId, kind, copySafe, and fallbackAssetId where applicable", () => {
    for (const asset of RELEASE1_VISUAL_ASSET_REGISTRY.assets) {
      expect(asset.assetId).toBeTruthy();
      expect(asset.kind).toBeTruthy();
      expect(typeof asset.copySafe).toBe("boolean");
      if (asset.fallbackAssetId) {
        expect(asset.fallbackAssetId).not.toBe(asset.assetId);
        expect(getVisualAssetById(RELEASE1_VISUAL_ASSET_REGISTRY, asset.fallbackAssetId)).toBeDefined();
      }
    }
  });

  it("rejects asset schema fields html / css / className / style", () => {
    expect(() =>
      visualAssetDefinitionSchema.parse({
        assetId: "icon-test",
        kind: "icon",
        name: "test",
        label: "Test",
        copySafe: true,
        html: "<b>x</b>",
      }),
    ).toThrow();

    expect(() =>
      visualAssetDefinitionSchema.parse({
        assetId: "icon-test",
        kind: "icon",
        name: "test",
        label: "Test",
        copySafe: true,
        css: ".foo { color: red; }",
      }),
    ).toThrow();
  });

  it("getVisualAssetById returns registered assets", () => {
    const asset = getVisualAssetById(
      RELEASE1_VISUAL_ASSET_REGISTRY,
      "icon-star-minimal",
    );
    expect(asset?.kind).toBe("icon");
    expect(asset?.copySafe).toBe(true);
  });

  it("validateVisualAssetReference reports unregistered assetId", () => {
    const issues = validateVisualAssetReference(
      "icon-not-registered",
      RELEASE1_VISUAL_ASSET_REGISTRY,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe("visual_asset_not_registered");
  });

  it("validateVisualAssetRegistry rejects fallback self-reference", () => {
    const broken = parseVisualAssetRegistry({
      ...RELEASE1_VISUAL_ASSET_REGISTRY,
      assets: [
        {
          assetId: "icon-loop",
          kind: "icon",
          name: "loop",
          label: "Loop",
          copySafe: true,
          fallbackAssetId: "icon-loop",
        },
      ],
    });
    const result = validateVisualAssetRegistry(broken);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "visual_asset_fallback_self_reference")).toBe(true);
  });

  it("validateVisualAssetRegistry rejects fallback to unregistered asset", () => {
    const broken = parseVisualAssetRegistry({
      ...RELEASE1_VISUAL_ASSET_REGISTRY,
      assets: [
        {
          assetId: "icon-missing-fallback",
          kind: "icon",
          name: "missing",
          label: "Missing",
          copySafe: true,
          fallbackAssetId: "icon-does-not-exist",
        },
      ],
    });
    const result = validateVisualAssetRegistry(broken);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "visual_asset_fallback_not_found")).toBe(true);
  });

  it("copySafe=false assets fail requireCopySafe validation", () => {
    const issues = validateVisualAssetReference(
      "icon-warning-triangle",
      RELEASE1_VISUAL_ASSET_REGISTRY,
      { requireCopySafe: true },
    );
    expect(issues.some((issue) => issue.code === "visual_asset_not_copy_safe")).toBe(true);
    expect(isVisualAssetCopySafe(RELEASE1_VISUAL_ASSET_REGISTRY, "icon-warning-triangle")).toBe(false);
  });

  it("getFallbackVisualAsset resolves registered fallback chain", () => {
    const fallback = getFallbackVisualAsset(
      RELEASE1_VISUAL_ASSET_REGISTRY,
      "icon-warning-triangle",
    );
    expect(fallback?.assetId).toBe("icon-info-outline");
  });

  it("validateAssetBindingReferences validates all bindings", () => {
    const issues = validateAssetBindingReferences(
      { icon: "icon-star-minimal", badge: "icon-unknown" },
      RELEASE1_VISUAL_ASSET_REGISTRY,
    );
    expect(issues.some((issue) => issue.code === "visual_asset_not_registered")).toBe(true);
  });
});
