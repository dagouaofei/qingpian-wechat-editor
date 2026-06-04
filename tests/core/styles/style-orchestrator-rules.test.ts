import { describe, expect, it } from "vitest";

import {
  ORCHESTRATOR_RULE_R1,
  ORCHESTRATOR_RULE_R2,
  applyOrchestratorRuleR1,
  applyOrchestratorRuleR2,
  applyOrchestratorRuleR8,
  isOrchestratorCopySafeRequiredVariant,
  parseStyleRegistry,
  pickOrchestratorFallbackVariant,
  resolveOrchestratorBlockVariant,
} from "@/core/styles";
import { FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY } from "@/core/styles/variants/title-heading";

import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalStyleRegistryFixture } from "../../fixtures/styles/minimal-registry";

describe("style orchestrator rules", () => {
  const registry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);

  function headingState(
    blockId: string,
    variantId: string,
    familyId: string,
    layoutMode?: string,
  ) {
    return {
      blockId,
      blockType: "heading" as const,
      variantId,
      familyId,
      layoutMode,
      source: "explicit" as const,
    };
  }

  it("pickOrchestratorFallbackVariant excludes candidate and experimental variants", () => {
    const minimalRegistry = parseStyleRegistry(minimalStyleRegistryFixture);
    const fallback = pickOrchestratorFallbackVariant(minimalRegistry, "heading", {
      excludeVariantIds: ["heading-safe"],
    });

    expect(fallback).toBeUndefined();
    expect(
      isOrchestratorCopySafeRequiredVariant(
        minimalRegistry.variants.find((v) => v.id === "magazine_left_bar_title")!,
      ),
    ).toBe(false);
  });

  it("R1 passes when adjacent headings use different variants", () => {
    const blocks = [
      { id: fixtureBlockId(1), type: "heading" as const, content: { text: "H1", level: 2 as const } },
      { id: fixtureBlockId(2), type: "heading" as const, content: { text: "H2", level: 2 as const } },
    ];
    const states = new Map([
      [
        fixtureBlockId(1),
        headingState(
          fixtureBlockId(1),
          "heading_short_line",
          "simple",
          "short_line",
        ),
      ],
      [
        fixtureBlockId(2),
        headingState(
          fixtureBlockId(2),
          "heading_numbered_section",
          "badgeTitle",
          "numbered",
        ),
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR1>[3] = [];

    applyOrchestratorRuleR1(blocks, states, registry, issues);

    expect(issues).toHaveLength(0);
  });

  it("R1 applies fallback when adjacent headings share the same variant", () => {
    const blocks = [
      { id: fixtureBlockId(1), type: "heading" as const, content: { text: "H1", level: 2 as const } },
      { id: fixtureBlockId(2), type: "heading" as const, content: { text: "H2", level: 2 as const } },
    ];
    const states = new Map([
      [
        fixtureBlockId(1),
        headingState(
          fixtureBlockId(1),
          "heading_short_line",
          "simple",
          "short_line",
        ),
      ],
      [
        fixtureBlockId(2),
        headingState(
          fixtureBlockId(2),
          "heading_short_line",
          "simple",
          "short_line",
        ),
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR1>[3] = [];

    applyOrchestratorRuleR1(blocks, states, registry, issues);

    expect(states.get(fixtureBlockId(2))?.variantId).not.toBe(
      "heading_short_line",
    );
    expect(issues.some((issue) => issue.code === "orchestrator_r1_fallback")).toBe(
      true,
    );
    expect(issues[0]?.message).toContain(ORCHESTRATOR_RULE_R1);
  });

  it("R2 passes when assetId appears at most twice", () => {
    const states = new Map([
      [
        fixtureBlockId(1),
        {
          ...headingState(fixtureBlockId(1), "heading_short_line", "simple"),
          assetBindings: { icon: "asset-star" },
        },
      ],
      [
        fixtureBlockId(2),
        {
          ...headingState(fixtureBlockId(2), "heading_numbered_section", "badgeTitle"),
          assetBindings: { badge: "asset-star" },
        },
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR2>[1] = [];

    applyOrchestratorRuleR2(states, issues, 2);

    expect(issues).toHaveLength(0);
  });

  it("R2 removes excess asset bindings without VisualAssetRegistry", () => {
    const states = new Map([
      [
        fixtureBlockId(1),
        {
          ...headingState(fixtureBlockId(1), "heading_short_line", "simple"),
          assetBindings: { a: "asset-star" },
        },
      ],
      [
        fixtureBlockId(2),
        {
          ...headingState(fixtureBlockId(2), "heading_numbered_section", "badgeTitle"),
          assetBindings: { b: "asset-star" },
        },
      ],
      [
        fixtureBlockId(3),
        {
          ...headingState(fixtureBlockId(3), "heading_card_centered", "cardTitle"),
          assetBindings: { c: "asset-star" },
        },
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR2>[1] = [];

    applyOrchestratorRuleR2(states, issues, 2);

    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe("orchestrator_r2_asset_reuse_exceeded");
    expect(issues[0]?.message).toContain(ORCHESTRATOR_RULE_R2);
    expect(states.get(fixtureBlockId(3))?.assetBindings).toBeUndefined();
  });

  it("R8 passes when title and first heading differ in family or layout", () => {
    const blocks = [
      { id: fixtureBlockId(1), type: "title" as const, content: { text: "Title" } },
      { id: fixtureBlockId(2), type: "heading" as const, content: { text: "H1", level: 2 as const } },
    ];
    const states = new Map([
      [
        fixtureBlockId(1),
        {
          blockId: fixtureBlockId(1),
          blockType: "title" as const,
          variantId: "title_left_bar_classic",
          familyId: "iconDecor",
          layoutMode: "left_bar",
          source: "explicit" as const,
        },
      ],
      [
        fixtureBlockId(2),
        headingState(
          fixtureBlockId(2),
          "heading_short_line",
          "cardTitle",
          "plain",
        ),
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR8>[3] = [];

    applyOrchestratorRuleR8(blocks, states, registry, issues);

    expect(issues).toHaveLength(0);
  });

  it("R8 adjusts first heading when family and layout match title", () => {
    const blocks = [
      { id: fixtureBlockId(1), type: "title" as const, content: { text: "Title" } },
      { id: fixtureBlockId(2), type: "heading" as const, content: { text: "H1", level: 2 as const } },
    ];
    const states = new Map([
      [
        fixtureBlockId(1),
        {
          blockId: fixtureBlockId(1),
          blockType: "title" as const,
          variantId: "title_plain_minimal",
          familyId: "cardTitle",
          layoutMode: "plain",
          source: "explicit" as const,
        },
      ],
      [
        fixtureBlockId(2),
        headingState(
          fixtureBlockId(2),
          "heading_card_centered",
          "cardTitle",
          "plain",
        ),
      ],
    ]);
    const issues: Parameters<typeof applyOrchestratorRuleR8>[3] = [];

    applyOrchestratorRuleR8(blocks, states, registry, issues);

    expect(states.get(fixtureBlockId(2))?.variantId).toBe(
      "heading_numbered_section",
    );
    expect(issues.some((issue) => issue.code === "orchestrator_r8_fallback")).toBe(
      true,
    );
  });
});

describe("style orchestrator selection", () => {
  const registry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
  const preset = registry.presets[0]!;

  it("prefers block-level assignment over preset default", () => {
    const block = {
      id: fixtureBlockId(1),
      type: "heading" as const,
      content: { text: "Heading", level: 2 as const },
    };
    const issues: Parameters<typeof resolveOrchestratorBlockVariant>[4] = [];

    const state = resolveOrchestratorBlockVariant(
      block,
      registry,
      preset,
      { blockId: block.id, variantId: "heading_card_centered" },
      issues,
    );

    expect(state.variantId).toBe("heading_card_centered");
    expect(state.source).toBe("explicit");
  });

  it("uses preset default when block override is absent", () => {
    const block = {
      id: fixtureBlockId(1),
      type: "heading" as const,
      content: { text: "Heading", level: 2 as const },
    };
    const issues: Parameters<typeof resolveOrchestratorBlockVariant>[4] = [];

    const state = resolveOrchestratorBlockVariant(
      block,
      registry,
      preset,
      undefined,
      issues,
    );

    expect(state.variantId).toBe("heading_short_line");
    expect(state.source).toBe("preset_default");
  });

  it("returns explicit error when no fallback variant exists", () => {
    const emptyRegistry = parseStyleRegistry({
      ...minimalStyleRegistryFixture,
      variants: minimalStyleRegistryFixture.variants.filter(
        (variant) => variant.blockType !== "list",
      ),
    });
    const issues: Parameters<typeof resolveOrchestratorBlockVariant>[4] = [];

    expect(() =>
      resolveOrchestratorBlockVariant(
        {
          id: fixtureBlockId(9),
          type: "list",
          content: { items: [{ text: "item" }], ordered: false },
        },
        emptyRegistry,
        emptyRegistry.presets[0]!,
        undefined,
        issues,
      ),
    ).toThrow();

    expect(issues.some((issue) => issue.code === "orchestrator_no_fallback_variant")).toBe(
      true,
    );
  });
});
