import { describe, expect, it } from "vitest";

import {
  STYLE_LIBRARY_MANIFEST,
  STYLE_LIBRARY_SCHEMA_VERSION,
  parseStyleLibraryManifest,
  styleLibraryManifestSchema,
  validateStyleLibraryManifest,
} from "@/core/style-library";

describe("style library schema", () => {
  it("parses the canonical manifest", () => {
    const manifest = parseStyleLibraryManifest(STYLE_LIBRARY_MANIFEST);
    expect(manifest.libraryId).toBe("qingpian-style-library-v0");
    expect(manifest.assets).toHaveLength(8);
  });

  it("rejects invalid schemaVersion", () => {
    const invalid = {
      ...STYLE_LIBRARY_MANIFEST,
      schemaVersion: 99,
    };

    expect(() => parseStyleLibraryManifest(invalid)).toThrow();
    const result = validateStyleLibraryManifest(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects duplicate assetId with explicit issue", () => {
    const duplicateAsset = STYLE_LIBRARY_MANIFEST.assets[0];
    const invalid = {
      ...STYLE_LIBRARY_MANIFEST,
      assets: [duplicateAsset, duplicateAsset],
    };

    const schemaResult = styleLibraryManifestSchema.safeParse(invalid);
    expect(schemaResult.success).toBe(true);

    const result = validateStyleLibraryManifest(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.code === "duplicate_asset_id"),
      ).toBe(true);
    }
  });

  it("validates canonical manifest through helper", () => {
    const result = validateStyleLibraryManifest(STYLE_LIBRARY_MANIFEST);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.schemaVersion).toBe(STYLE_LIBRARY_SCHEMA_VERSION);
    }
  });
});
