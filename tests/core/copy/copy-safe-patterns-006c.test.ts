import { describe, expect, it } from "vitest";

import {
  HARVEST_CANDIDATE_METADATA,
  HARVEST_CANDIDATE_SOURCE_EVIDENCE_ID,
  HARVEST_CANDIDATE_VARIANT_IDS,
} from "@/core/copy/harvest-candidate-copy";
import { validateWechatCopyHtml } from "@/core/wechat-compat";
import {
  S8_FIDELITY_PRESET_ID,
  S8_FIDELITY_STYLE_REGISTRY,
} from "../../fixtures/fidelity/s8-wechat-fidelity-registry";
import { S8_WECHAT_FIDELITY_FIXTURE_SPECS } from "../../fixtures/fidelity/s8-wechat-fidelity-spec";
import {
  buildWechatFidelityMatrix,
  renderCopyHtmlForFidelityFixture,
} from "../../support/wechat-fidelity-matrix-builder";

describe("S8-STORY-006C copy-safe patterns", () => {
  it("includes harvest candidate rows in matrix", () => {
    const rows = buildWechatFidelityMatrix();
    const harvest = rows.filter((r) => r.matrixRowId.startsWith("S8M-HARVEST-"));
    expect(harvest).toHaveLength(2);
    expect(harvest.map((r) => r.variantId).sort()).toEqual(
      [...HARVEST_CANDIDATE_VARIANT_IDS].sort(),
    );
    for (const row of harvest) {
      expect(row.variantType).toBe("candidate");
      expect(row.pasteStatus).toBe("PASS");
      expect(row.contractAction).toContain("candidate-paste-pass");
      expect(row.notes).toContain(HARVEST_CANDIDATE_SOURCE_EVIDENCE_ID);
    }
  });

  it("harvest candidates pass validateWechatCopyHtml without Red errors", () => {
    for (const variantId of HARVEST_CANDIDATE_VARIANT_IDS) {
      const spec = S8_WECHAT_FIDELITY_FIXTURE_SPECS.find((s) => s.variantId === variantId);
      expect(spec).toBeDefined();
      const html = renderCopyHtmlForFidelityFixture(spec!);
      const validation = validateWechatCopyHtml({
        html,
        blockType: spec!.blockType,
        variantId,
      });
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    }
  });

  it("harvest candidates are not in fidelity preset defaults", () => {
    const preset = S8_FIDELITY_STYLE_REGISTRY.presets.find(
      (p) => p.id === S8_FIDELITY_PRESET_ID,
    );
    const defaults = Object.values(preset!.defaultVariantByBlockType);
    for (const id of HARVEST_CANDIDATE_VARIANT_IDS) {
      expect(defaults).not.toContain(id);
      const variant = S8_FIDELITY_STYLE_REGISTRY.variants.find((v) => v.id === id);
      expect(variant?.status).toBe("experimental");
    }
  });

  it("exposes harvest candidate metadata contract", () => {
    expect(HARVEST_CANDIDATE_METADATA.sourceEvidenceId).toBe(
      HARVEST_CANDIDATE_SOURCE_EVIDENCE_ID,
    );
    expect(HARVEST_CANDIDATE_METADATA.release1Eligible).toBe(false);
    expect(HARVEST_CANDIDATE_METADATA.requiresPasteQa).toBe(true);
  });

  it("sinks card background onto p for info_card_key_takeaway", () => {
    const spec = S8_WECHAT_FIDELITY_FIXTURE_SPECS.find(
      (s) => s.matrixRowId === "S8M-CARD-001",
    )!;
    const html = renderCopyHtmlForFidelityFixture(spec);
    expect(html).toMatch(/<p[^>]*background-color:[^>]*>/i);
    expect(html).not.toMatch(/<section[^>]*background-color/i);
  });

  it("sinks border-left onto p for lead_quote_intro", () => {
    const spec = S8_WECHAT_FIDELITY_FIXTURE_SPECS.find(
      (s) => s.matrixRowId === "S8M-LEAD-003",
    )!;
    const html = renderCopyHtmlForFidelityFixture(spec);
    expect(html).toMatch(/<p[^>]*border-left:[^>]*>/i);
    expect(html).not.toMatch(/<section[^>]*border-left/i);
  });
});
