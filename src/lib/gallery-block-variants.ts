import type { BlockType } from "@/core/blocks";
import type { Article, BlockStyleOverride } from "@/core/article";
import {
  buildMiaopianPresetDefinitions,
  resolveMiaopianPresetId,
} from "@/config/miaopian-preset-bundles";
import { getVariantsForBlockType } from "@/core/styles/registry";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles/variants";
import { isOrchestratorCopySafeRequiredVariant } from "@/core/styles/style-orchestrator-selection";

import type { GalleryStyleControlState } from "./gallery-style-controls";
import {
  galleryTitleHeadingOverridesForArticle,
  type GalleryHeadingVariantId,
  type GalleryTitleVariantId,
} from "./gallery-title-heading";
import type { ArticleSampleId } from "@/fixtures/article-samples";

const REGISTRY = createFirstWaveRequiredVariantRegistry();
const PRESETS = buildMiaopianPresetDefinitions();

export function variantPoolForPresetBlock(
  presetId: string,
  blockType: BlockType,
): string[] {
  const preset = PRESETS.find((entry) => entry.id === presetId);
  const pool = preset?.variantPoolsByBlockType?.[blockType];
  if (pool?.length) {
    return pool;
  }
  return getVariantsForBlockType(REGISTRY, blockType)
    .filter(isOrchestratorCopySafeRequiredVariant)
    .map((variant) => variant.id);
}

export function variantLabelForId(variantId: string): string {
  const variant = REGISTRY.variants.find((entry) => entry.id === variantId);
  return variant?.label ?? variantId;
}

export function blockTypesInArticle(article: Article): BlockType[] {
  const seen = new Set<BlockType>();
  for (const block of article.blocks) {
    seen.add(block.type);
  }
  return [...seen];
}

export function galleryBlockOverridesForArticle(
  article: Article,
  sampleId: ArticleSampleId,
  control: GalleryStyleControlState,
): BlockStyleOverride[] {
  const presetId = resolveMiaopianPresetId(control.articleStyle);
  const overrides: BlockStyleOverride[] = [];

  const titleVariant =
    control.blockVariantOverrides.title ??
    (control.titleVariantId || undefined);
  const headingVariant =
    control.blockVariantOverrides.heading ??
    (control.headingVariantId || undefined);

  overrides.push(
    ...galleryTitleHeadingOverridesForArticle(
      article,
      sampleId,
      titleVariant as GalleryTitleVariantId | undefined,
      headingVariant as GalleryHeadingVariantId | undefined,
    ),
  );

  const titleBlock = article.blocks.find((block) => block.type === "title");
  const headingBlocks = article.blocks.filter((block) => block.type === "heading");

  if (titleVariant && titleBlock) {
    const existing = overrides.find((entry) => entry.blockId === titleBlock.id);
    if (existing) {
      existing.variantId = titleVariant;
    }
  }

  if (headingVariant && headingBlocks.length > 0) {
    for (const block of headingBlocks) {
      const existing = overrides.find((entry) => entry.blockId === block.id);
      if (existing) {
        existing.variantId = headingVariant;
      }
    }
  }

  for (const blockType of blockTypesInArticle(article)) {
    if (blockType === "title" || blockType === "heading") {
      continue;
    }
    const variantId = control.blockVariantOverrides[blockType];
    if (!variantId) {
      continue;
    }
    for (const block of article.blocks) {
      if (block.type !== blockType) {
        continue;
      }
      const prior = overrides.find((entry) => entry.blockId === block.id);
      if (prior) {
        prior.variantId = variantId;
      } else {
        overrides.push({ blockId: block.id, variantId });
      }
    }
  }

  if (Object.keys(control.blockVariantOverrides).length === 0 && !titleVariant && !headingVariant) {
    return overrides;
  }

  return overrides;
}

export function defaultVariantForBlock(
  presetId: string,
  blockType: BlockType,
): string | undefined {
  const preset = PRESETS.find((entry) => entry.id === presetId);
  return preset?.defaultVariantByBlockType?.[blockType];
}
