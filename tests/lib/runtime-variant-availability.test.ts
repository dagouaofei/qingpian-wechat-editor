import { describe, expect, it } from "vitest";

import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { getVariantById } from "@/core/styles/registry";
import {
  COPY_FIDELITY_FAILED_HEADING_IDS,
  getCodeBackedRuntimeAvailableVariantIds,
  USER_SELECTABLE_HTML_PASTE_HEADING_ID,
  USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS,
} from "@/lib/runtime-variant-seed-config";
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

  it("includes 6 release1 heading seeds and html_paste in code-backed pool", () => {
    const available = getCodeBackedRuntimeAvailableVariantIds();
    expect(available.size).toBe(7);
    for (const id of USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS) {
      expect(available.has(id)).toBe(true);
    }
    expect(available.has(USER_SELECTABLE_HTML_PASTE_HEADING_ID)).toBe(true);
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

  it("limits AI heading candidates to runtime-available variants", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    const cardCentered = getVariantById(registry, "heading_card_centered");
    const shortLine = getVariantById(registry, "heading_short_line");
    expect(isVariantDefinitionRuntimeAvailable(cardCentered)).toBe(false);
    expect(isVariantDefinitionRuntimeAvailable(shortLine)).toBe(true);
  });
});
