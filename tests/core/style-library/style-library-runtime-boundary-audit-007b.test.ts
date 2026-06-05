import { describe, expect, it } from "vitest";

import { buildMiaopianPresetDefinitions } from "@/config/miaopian-preset-bundles";
import {
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  RELEASE1_REQUIRED_VARIANT_COUNT_BY_BLOCK,
  RELEASE1_REQUIRED_VARIANT_IDS,
  createFirstWaveRequiredVariantRegistry,
} from "@/core/styles";
import { TITLE_BLOCK_SUPPORTED_VARIANT_IDS } from "@/core/renderer/title-block-renderer";
import { variantPoolForPresetBlock } from "@/lib/gallery-block-variants";
import {
  HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
  STYLE_LIBRARY_INSPECTION_PRESET_ID,
  createStyleLibraryInspectionStyleRegistry,
  renderStyleLibraryCandidateCopyHtml,
  renderStyleLibraryCandidatePreview,
} from "@/core/style-library";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";
import { S9_STORY_007B_VARIANT_ID } from "../../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";

describe("S9-STORY-007B-AUDIT-A runtime boundary", () => {
  it("does not add html paste variant to createFirstWaveRequiredVariantRegistry", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    expect(registry.variants.map((variant) => variant.id)).not.toContain(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(FIRST_WAVE_REQUIRED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
  });

  it("keeps RELEASE1 required variant count unchanged", () => {
    expect(RELEASE1_REQUIRED_VARIANT_IDS.length).toBe(92);
    expect(RELEASE1_REQUIRED_VARIANT_COUNT_BY_BLOCK.heading).toBe(8);
  });

  it("keeps business and warm default heading variants unchanged", () => {
    const presets = buildMiaopianPresetDefinitions();
    const business = presets.find((preset) => preset.id === "business");
    const warm = presets.find((preset) => preset.id === "warm");
    expect(business?.defaultVariantByBlockType?.heading).toBe("heading_short_line");
    expect(warm?.defaultVariantByBlockType?.heading).toBe("heading_highlight_marker");
  });

  it("does not expose html paste variant in Gallery preset pools", () => {
    for (const presetId of ["business", "warm"]) {
      const pool = variantPoolForPresetBlock(presetId, "heading");
      expect(pool).not.toContain(S9_STORY_007B_VARIANT_ID);
    }
  });

  it("does not register html paste variant on shared TITLE_BLOCK_SUPPORTED_VARIANT_IDS", () => {
    expect(TITLE_BLOCK_SUPPORTED_VARIANT_IDS).not.toContain(
      HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
    );
  });

  it("registers html paste variant only on inspection-only style registry preset", () => {
    const inspectionRegistry = createStyleLibraryInspectionStyleRegistry();
    const inspectionVariantIds = inspectionRegistry.variants.map((variant) => variant.id);
    expect(inspectionVariantIds).toContain(S9_STORY_007B_VARIANT_ID);
    expect(inspectionRegistry.presets[0]?.id).toBe(STYLE_LIBRARY_INSPECTION_PRESET_ID);
    expect(
      createFirstWaveRequiredVariantRegistry().presets.some(
        (preset) => preset.id === STYLE_LIBRARY_INSPECTION_PRESET_ID,
      ),
    ).toBe(false);
  });

  it("renders html paste user_selectable asset via inspection adapter only", () => {
    const preview = renderStyleLibraryCandidatePreview(HTML_PASTE_TEAL_SECTION_LABEL_ASSET);
    const copy = renderStyleLibraryCandidateCopyHtml(HTML_PASTE_TEAL_SECTION_LABEL_ASSET);
    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
    expect(copy.html).toContain("#0d9488");
    expect(copy.html).toContain("SECTION 02");
  });
});
