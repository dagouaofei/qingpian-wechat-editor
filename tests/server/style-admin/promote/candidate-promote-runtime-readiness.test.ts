import { describe, expect, it } from "vitest";

import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import {
  buildCandidatePromoteRuntimeReadiness,
  mergePromoteEligibilityWithRuntimeReadiness,
} from "@/server/style-admin/promote";
import { buildPromoteHeadingVariantDsl } from "../../../fixtures/dsl/promote-heading-variant-dsl";

describe("candidate promote runtime readiness", () => {
  it("returns ok for valid harvest-encoded heading DSL", () => {
    const definitionJson = buildPromoteHeadingVariantDsl(
      "heading_html_paste_abcdef01_candidate",
    );
    const readiness = buildCandidatePromoteRuntimeReadiness({
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      blockType: "heading",
      definitionJson,
    });
    expect(readiness?.ok).toBe(true);
    expect(readiness?.previewReady).toBe(true);
    expect(readiness?.copyReady).toBe(true);
    expect(readiness?.trace.runtimeSource).toBe("database_dsl");
  });

  it("blocks promote when preview is not renderable", () => {
    const definitionJson = {
      version: VARIANT_DSL_VERSION,
      id: "broken_heading",
      blockType: "heading",
      copySafety: "strict",
    };
    const readiness = buildCandidatePromoteRuntimeReadiness({
      runtimeVariantId: "broken_heading",
      blockType: "heading",
      definitionJson,
    });
    const gate = mergePromoteEligibilityWithRuntimeReadiness([], readiness);
    expect(gate.eligible).toBe(false);
    expect(
      gate.blockedReasons.some(
        (reason) => reason.includes("DSL preview") || reason.includes("schema invalid"),
      ),
    ).toBe(true);
  });

  it("blocks promote when copy output is empty", () => {
    const definitionJson = {
      version: VARIANT_DSL_VERSION,
      id: "empty_copy_heading",
      blockType: "heading",
      copySafety: "strict",
      tree: { type: "element", tag: "section", children: [] },
    };
    const readiness = buildCandidatePromoteRuntimeReadiness({
      runtimeVariantId: "empty_copy_heading",
      blockType: "heading",
      definitionJson,
    });
    const gate = mergePromoteEligibilityWithRuntimeReadiness([], readiness);
    expect(gate.eligible).toBe(false);
    expect(
      gate.blockedReasons.some((reason) => reason.includes("copy_wechat output is empty")),
    ).toBe(true);
  });
});
