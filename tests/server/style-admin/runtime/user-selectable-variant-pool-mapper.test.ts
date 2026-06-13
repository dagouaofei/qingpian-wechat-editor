import { describe, expect, it } from "vitest";

import { mapDbPoolRowToVariantDefinition } from "@/server/style-admin/runtime/user-selectable-variant-pool-mapper";

describe("mapDbPoolRowToVariantDefinition", () => {
  it("maps current version json into VariantDefinition", () => {
    const mapped = mapDbPoolRowToVariantDefinition({
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      blockType: "heading",
      styleFamily: "htmlPasteCandidate",
      label: "Teal section",
      description: null,
      lifecycle: "user_selectable",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: {
        definitionJson: {
          id: "heading_teal_section_label_html_paste_candidate",
          schemaVersion: 1,
          blockType: "heading",
          family: "htmlPasteCandidate",
          name: "heading-teal",
          label: "Teal section",
          status: "experimental",
        },
        componentProtocolJson: {
          componentId: "titleBlock",
          familyId: "htmlPasteCandidate",
          layoutMode: "pill",
        },
        compatibilityJson: { copySafety: "strict" },
        copySafety: "strict",
      },
    } as never);

    expect(mapped.variant?.id).toBe("heading_teal_section_label_html_paste_candidate");
    expect(mapped.issue).toBeUndefined();
  });

  it("uses admin row label and runtimeVariantId instead of definitionJson overrides", () => {
    const mapped = mapDbPoolRowToVariantDefinition({
      runtimeVariantId: "heading_html_paste_section_label",
      blockType: "heading",
      styleFamily: "htmlPaste",
      label: "Section Label Heading",
      description: null,
      lifecycle: "user_selectable",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: {
        definitionJson: {
          id: "legacy_definition_id",
          blockType: "heading",
          label: "Section Label Heading (HTML Paste · User Selectable)",
        },
        copySafety: "strict",
      },
    } as never);

    expect(mapped.variant?.id).toBe("heading_html_paste_section_label");
    expect(mapped.variant?.label).toBe("Section Label Heading");
  });

  it("excludes release1Required-only rows", () => {
    const mapped = mapDbPoolRowToVariantDefinition({
      runtimeVariantId: "heading_short_line",
      blockType: "heading",
      styleFamily: "editorial",
      label: "Short line",
      lifecycle: "release1_required",
      distribution: {
        userSelectable: false,
        defaultEligible: false,
        release1Required: true,
        hidden: false,
        deprecated: false,
      },
      currentVersion: {
        definitionJson: { id: "heading_short_line", blockType: "heading" },
        copySafety: "strict",
      },
    } as never);

    expect(mapped.variant).toBeNull();
    expect(mapped.issue?.code).toBe("ineligible_distribution");
  });

  it("skips hidden and deprecated distribution", () => {
    for (const distribution of [
      { userSelectable: true, hidden: true, deprecated: false },
      { userSelectable: true, hidden: false, deprecated: true },
    ]) {
      const mapped = mapDbPoolRowToVariantDefinition({
        runtimeVariantId: "heading_hidden",
        blockType: "heading",
        styleFamily: "x",
        label: "x",
        lifecycle: "user_selectable",
        distribution: {
          defaultEligible: false,
          release1Required: false,
          ...distribution,
        },
        currentVersion: {
          definitionJson: { id: "heading_hidden", blockType: "heading" },
          copySafety: "strict",
        },
      } as never);
      expect(mapped.variant).toBeNull();
    }
  });
});
