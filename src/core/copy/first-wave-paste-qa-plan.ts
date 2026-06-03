import type { BlockType } from "@/core/blocks";
import {
  CTA_EXPANSION_VARIANTS,
  CTA_FIRST_WAVE_VARIANTS,
  DIVIDER_EXPANSION_VARIANTS,
  DIVIDER_FIRST_WAVE_VARIANTS,
  HEADING_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_EXPANSION_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_EXPANSION_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  INFO_CARD_EXPANSION_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  LEAD_EXPANSION_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_EXPANSION_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_EXPANSION_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  QUOTE_EXPANSION_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  TITLE_FIRST_WAVE_VARIANTS,
  type CopySafety,
  type VariantDefinition,
} from "@/core/styles";

export type FirstWavePasteQaStatus = "not_run";
export type RendererCoverageStatus = "copy_renderer_covered";
export type PasteQaScope = "text_first" | "structured";

export type FirstWavePasteQaPlanEntry = {
  blockType: BlockType;
  variantId: string;
  copySafety: CopySafety;
  rendererCoverage: RendererCoverageStatus;
  pasteQaStatus: FirstWavePasteQaStatus;
  scope: PasteQaScope;
  requiresRealWechatPasteQa: boolean;
  notes: string[];
};

export const RELEASE1_FIRST_WAVE_VARIANT_GROUPS = [
  { blockType: "title", scope: "text_first", variants: TITLE_FIRST_WAVE_VARIANTS },
  { blockType: "heading", scope: "text_first", variants: HEADING_FIRST_WAVE_VARIANTS },
  {
    blockType: "lead",
    scope: "text_first",
    variants: [...LEAD_FIRST_WAVE_VARIANTS, ...LEAD_EXPANSION_VARIANTS],
  },
  {
    blockType: "paragraph",
    scope: "text_first",
    variants: [...PARAGRAPH_FIRST_WAVE_VARIANTS, ...PARAGRAPH_EXPANSION_VARIANTS],
  },
  {
    blockType: "divider",
    scope: "text_first",
    variants: [...DIVIDER_FIRST_WAVE_VARIANTS, ...DIVIDER_EXPANSION_VARIANTS],
  },
  {
    blockType: "list",
    scope: "structured",
    variants: [...LIST_FIRST_WAVE_VARIANTS, ...LIST_EXPANSION_VARIANTS],
  },
  {
    blockType: "quote",
    scope: "structured",
    variants: [...QUOTE_FIRST_WAVE_VARIANTS, ...QUOTE_EXPANSION_VARIANTS],
  },
  {
    blockType: "highlight",
    scope: "structured",
    variants: [...HIGHLIGHT_FIRST_WAVE_VARIANTS, ...HIGHLIGHT_EXPANSION_VARIANTS],
  },
  {
    blockType: "info_card",
    scope: "structured",
    variants: [...INFO_CARD_FIRST_WAVE_VARIANTS, ...INFO_CARD_EXPANSION_VARIANTS],
  },
  {
    blockType: "cta",
    scope: "structured",
    variants: [...CTA_FIRST_WAVE_VARIANTS, ...CTA_EXPANSION_VARIANTS],
  },
  {
    blockType: "image_placeholder",
    scope: "structured",
    variants: [
      ...IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
      ...IMAGE_PLACEHOLDER_EXPANSION_VARIANTS,
    ],
  },
] as const satisfies readonly {
  blockType: BlockType;
  scope: PasteQaScope;
  variants: readonly VariantDefinition[];
}[];

function notesForVariant(
  blockType: BlockType,
  copySafety: CopySafety,
): string[] {
  const notes = [
    copySafety === "balanced"
      ? "balanced copySafety: requires real WeChat paste fidelity verification"
      : "strict copySafety: snapshot covered, paste verification still not run",
  ];

  if (blockType === "cta") {
    notes.push(
      "Release 1 placeholder scope only: no real QR, link navigation, or mini-program card test",
    );
  }

  if (blockType === "image_placeholder") {
    notes.push(
      "Release 1 placeholder scope only: no image upload, hosting, AI image, gallery, or real img test",
    );
  }

  return notes;
}

function requireCopySafety(variant: VariantDefinition): CopySafety {
  const copySafety = variant.compatibility?.copySafety;
  if (copySafety == null) {
    throw new Error(`first-wave variant "${variant.id}" is missing copySafety`);
  }
  return copySafety;
}

export function buildRelease1FirstWavePasteQaPlan(): FirstWavePasteQaPlanEntry[] {
  return RELEASE1_FIRST_WAVE_VARIANT_GROUPS.flatMap((group) =>
    group.variants.map((variant) => {
      const copySafety = requireCopySafety(variant);

      return {
        blockType: group.blockType,
        variantId: variant.id,
        copySafety,
        rendererCoverage: "copy_renderer_covered" as const,
        pasteQaStatus: "not_run" as const,
        scope: group.scope,
        requiresRealWechatPasteQa: true,
        notes: notesForVariant(group.blockType, copySafety),
      };
    }),
  );
}
