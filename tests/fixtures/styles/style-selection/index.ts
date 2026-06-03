/**
 * Style Selection validation fixtures — S3C-STORY-005
 * @see docs/architecture/style-system.md §11.8.3
 */

import type { ArticleStylePlan } from "@/core/styles/style-assignment";
import type {
  StyleAssignmentPatch,
  StyleSelectionRequest,
} from "@/core/styles/style-assignment";
import type { StyleSelectionValidationStage } from "@/core/styles/style-selection-validation";

import { minimalArticleFixture } from "../../articles/minimal-article";
import { fixtureBlockId } from "../../articles/shared";

export type StyleSelectionFixtureExpectation = {
  ok: boolean;
  mergeAllowed: boolean;
  validationStatus?: "valid" | "fallback_applied" | "invalid" | "pending";
  issueCodes: string[];
  fallbackBlockIds?: string[];
  finalVariantIds?: Record<string, string>;
  assetIssueCodes?: string[];
  stages?: StyleSelectionValidationStage[];
};

export type StyleSelectionFixture = {
  id: string;
  description: string;
  articleInput: Record<string, unknown>;
  input:
    | { kind: "style_selection_request"; request: StyleSelectionRequest }
    | { kind: "style_assignment_patch"; patch: StyleAssignmentPatch }
    | { kind: "article_style_plan"; plan: ArticleStylePlan };
  expected: StyleSelectionFixtureExpectation;
};

const GENERATED_AT = "2026-06-01T00:00:00.000Z";

function articleWithHeadings(
  overrides?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...minimalArticleFixture,
    ...overrides,
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      ...(overrides?.styleAssignment as object | undefined),
    },
    blocks: overrides?.blocks ?? [
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "文章标题" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节一", level: 2 },
      },
      {
        id: fixtureBlockId(3),
        type: "heading",
        content: { text: "章节二", level: 2 },
      },
    ],
  };
}

export const validBasicStyleRequestFixture: StyleSelectionFixture = {
  id: "valid-basic-style-request",
  description: "Legal StyleSelectionRequest with preset and block hints",
  articleInput: articleWithHeadings(),
  input: {
    kind: "style_selection_request",
    request: {
      articleId: minimalArticleFixture.id,
      preferredPresetId: "business",
      blockStyleHints: [
        {
          blockId: fixtureBlockId(1),
          blockType: "title",
          suggestedVariantId: "title_plain_minimal",
        },
        {
          blockId: fixtureBlockId(2),
          blockType: "heading",
          suggestedVariantId: "heading_numbered_section",
        },
      ],
      constraints: {
        mustUseRegisteredVariants: true,
        mustUseRegisteredAssets: true,
        mustPassWeChatCompatibility: true,
      },
    },
  },
  expected: {
    ok: true,
    mergeAllowed: true,
    validationStatus: "valid",
    issueCodes: [],
    stages: [
      "input_schema",
      "plan_conversion",
      "preset_theme_combination",
      "block_protocol",
      "orchestrator",
      "post_orchestrator_validation",
    ],
  },
};

export const validStyleAssignmentPatchFixture: StyleSelectionFixture = {
  id: "valid-style-assignment-patch",
  description: "Legal StyleAssignmentPatch modifying styleAssignment only",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "文章标题" },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title_left_bar_classic",
        },
      ],
      meta: {
        source: "user",
        validationStatus: "valid",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: true,
    mergeAllowed: true,
    validationStatus: "valid",
    issueCodes: [],
  },
};

export const invalidUnknownVariantFixture: StyleSelectionFixture = {
  id: "invalid-unknown-variant",
  description: "Patch references unknown variantId",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "heading_does_not_exist",
        },
      ],
      meta: {
        source: "ai_style_selection",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: false,
    mergeAllowed: false,
    validationStatus: "invalid",
    issueCodes: ["variant_not_registered"],
  },
};

export const invalidUnknownAssetFixture: StyleSelectionFixture = {
  id: "invalid-unknown-asset",
  description: "assetBindings reference unregistered assetId",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(2),
          variantId: "heading_top_badge_topic",
          assetBindings: { badge: "icon-not-registered" },
        },
      ],
      meta: {
        source: "ai_style_selection",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: false,
    mergeAllowed: false,
    validationStatus: "invalid",
    issueCodes: ["visual_asset_not_registered"],
    assetIssueCodes: ["visual_asset_not_registered"],
  },
};

export const invalidSlotOverrideFixture: StyleSelectionFixture = {
  id: "invalid-slot-override",
  description: "Block override writes to illegal slot key",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(2),
          variantId: "heading_top_badge_topic",
          slotOverrides: { unknown_slot: "01" },
        },
      ],
      meta: {
        source: "ai_style_selection",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: false,
    mergeAllowed: false,
    validationStatus: "invalid",
    issueCodes: ["slot_override_slot_not_allowed"],
  },
};

export const invalidBodySemanticFromSlotFixture: StyleSelectionFixture = {
  id: "invalid-body-semantic-from-slot",
  description: "Slot override targets body-content title slot",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "文章标题" },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title_plain_minimal",
          slotOverrides: { title: "Injected title" },
        },
      ],
      meta: {
        source: "ai_style_selection",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: false,
    mergeAllowed: false,
    validationStatus: "invalid",
    issueCodes: ["slot_override_body_semantics_forbidden"],
  },
};

export const orchestratorR1FallbackAppliedFixture: StyleSelectionFixture = {
  id: "orchestrator-r1-fallback-applied",
  description: "Adjacent headings share variant; unified (R1 disabled)",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节一", level: 2 },
      },
      {
        id: fixtureBlockId(3),
        type: "heading",
        content: { text: "章节二", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(2),
          variantId: "heading_plain_minimal",
        },
        {
          blockId: fixtureBlockId(3),
          variantId: "heading_plain_minimal",
        },
      ],
      meta: {
        source: "orchestrator",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: true,
    mergeAllowed: true,
    validationStatus: "valid",
    issueCodes: [],
  },
};

export const orchestratorR2AssetLimitFixture: StyleSelectionFixture = {
  id: "orchestrator-r2-asset-limit",
  description: "Same assetId exceeds reuse limit",
  articleInput: articleWithHeadings(),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          assetBindings: { a: "icon-star-minimal" },
        },
        {
          blockId: fixtureBlockId(2),
          assetBindings: { b: "icon-star-minimal" },
        },
        {
          blockId: fixtureBlockId(3),
          assetBindings: { c: "icon-star-minimal" },
        },
      ],
      meta: {
        source: "orchestrator",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: true,
    mergeAllowed: true,
    validationStatus: "fallback_applied",
    issueCodes: ["orchestrator_r2_asset_reuse_exceeded"],
    assetIssueCodes: ["orchestrator_r2_asset_reuse_exceeded"],
  },
};

export const orchestratorR8TitleHeadingConflictFixture: StyleSelectionFixture = {
  id: "orchestrator-r8-title-heading-conflict",
  description:
    "Title and first heading share family + layoutMode; R8 uses family+layoutMode not variantId equality",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "文章标题" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title_plain_minimal",
        },
        {
          blockId: fixtureBlockId(2),
          variantId: "heading_plain_minimal",
        },
      ],
      meta: {
        source: "orchestrator",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: true,
    mergeAllowed: true,
    validationStatus: "fallback_applied",
    issueCodes: ["orchestrator_r8_fallback"],
    fallbackBlockIds: [fixtureBlockId(2)],
  },
};

export const previewOnlyRejectedFixture: StyleSelectionFixture = {
  id: "preview-only-rejected",
  description: "preview_only variant rejected on required path",
  articleInput: articleWithHeadings({
    blocks: [
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ],
  }),
  input: {
    kind: "style_assignment_patch",
    patch: {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "heading_preview_only_fixture",
        },
      ],
      meta: {
        source: "ai_style_selection",
        generatedAt: GENERATED_AT,
      },
    },
  },
  expected: {
    ok: false,
    mergeAllowed: false,
    validationStatus: "invalid",
    issueCodes: [
      "variant_preview_only_on_required_path",
      "variant_status_not_required_path",
    ],
  },
};

export const STYLE_SELECTION_FIXTURES: StyleSelectionFixture[] = [
  validBasicStyleRequestFixture,
  validStyleAssignmentPatchFixture,
  invalidUnknownVariantFixture,
  invalidUnknownAssetFixture,
  invalidSlotOverrideFixture,
  invalidBodySemanticFromSlotFixture,
  orchestratorR1FallbackAppliedFixture,
  orchestratorR2AssetLimitFixture,
  orchestratorR8TitleHeadingConflictFixture,
  previewOnlyRejectedFixture,
];

export const STYLE_SELECTION_FIXTURES_BY_ID = Object.fromEntries(
  STYLE_SELECTION_FIXTURES.map((fixture) => [fixture.id, fixture]),
) as Record<string, StyleSelectionFixture>;
