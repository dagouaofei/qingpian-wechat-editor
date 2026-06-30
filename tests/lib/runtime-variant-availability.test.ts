import { describe, expect, it } from "vitest";

import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { getVariantById } from "@/core/styles/registry";
import {
  COPY_FIDELITY_FAILED_HEADING_IDS,
  getCodeBackedRuntimeAvailableVariantIds,
  USER_SELECTABLE_HTML_PASTE_HEADING_ID,
  USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS,
} from "@/lib/runtime-variant-seed-config";
import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";
import {
  isBlockingQualityStatus,
  isCodeBackedRuntimeVariantAvailable,
  isRuntimeVariantAvailable,
  isVariantDefinitionRuntimeAvailable,
  resolveRuntimeAvailableVariantId,
} from "@/lib/runtime-variant-availability";

describe("runtime variant availability gate", () => {
  it("blocks copy_fidelity_failed quality status", () => {
    expect(isBlockingQualityStatus("copy_fidelity_failed")).toBe(true);
    expect(
      isRuntimeVariantAvailable({
        runtimeVariantId: "heading_magazine_left_bar",
        distribution: {
          userSelectable: false,
          hidden: false,
          deprecated: false,
        },
        currentVersion: { qualityStatus: "copy_fidelity_failed" },
      }),
    ).toBe(false);
  });

  it("excludes copy fidelity failed heading seeds from code-backed pool", () => {
    for (const id of COPY_FIDELITY_FAILED_HEADING_IDS) {
      expect(isCodeBackedRuntimeVariantAvailable(id)).toBe(false);
    }
  });

  it("includes release1 publish headings but not html_paste user pool seed in code-backed id set", () => {
    const available = getCodeBackedRuntimeAvailableVariantIds();
    expect(available.size).toBe(HEADING_PUBLISH_VARIANT_IDS.length);
    for (const id of USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS) {
      expect(available.has(id)).toBe(true);
    }
    expect(available.has(USER_SELECTABLE_HTML_PASTE_HEADING_ID)).toBe(false);
  });

  it("rejects non-available explicit variant with fallback", () => {
    const available = [...USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS];
    const resolved = resolveRuntimeAvailableVariantId(
      "heading_magazine_left_bar",
      available,
      "heading_short_line",
    );
    expect(resolved.variantId).toBe("heading_short_line");
    expect(resolved.issue).toContain("variant_not_runtime_available");
  });

  it("limits AI heading candidates via code-backed availability gate", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    const cardCentered = getVariantById(registry, "heading_card_centered");
    const shortLine = getVariantById(registry, "heading_short_line");
    expect(isCodeBackedRuntimeVariantAvailable("heading_card_centered")).toBe(false);
    expect(getCodeBackedRuntimeAvailableVariantIds().has("heading_short_line")).toBe(true);
    expect(isVariantDefinitionRuntimeAvailable(shortLine)).toBe(true);
    expect(isVariantDefinitionRuntimeAvailable(cardCentered)).toBe(true);
  });
});
