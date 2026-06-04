/**
 * BlockVisualProtocol / ComponentProtocol — derived from StyleRegistry first-wave variants
 * @see docs/architecture/style-system.md §11.1
 */

import type { BlockType } from "@/core/blocks";

import { getVariantById, getVariantsForBlockType } from "./registry";
import { TITLE_BLOCK_COMPONENT_ID } from "./types";
import type { StyleRegistry, TitleBlockLayoutMode } from "./types";
import { VISUAL_ASSET_KINDS, type VisualAssetKind } from "./visual-assets";

export type ComponentProtocol = {
  componentId: string;
  allowedFamilies: string[];
  allowedLayoutModes: TitleBlockLayoutMode[];
  version: string;
};

export type BlockVisualProtocol = {
  blockType: BlockType;
  componentId: string;
  allowedFamilies: string[];
  allowedVariants: string[];
  allowedSlots: string[];
  requiredSlots: string[];
  allowedAssetKinds: VisualAssetKind[];
  fallbackVariant: string;
  version: string;
};

export const TITLE_BLOCK_COMPONENT_PROTOCOL: ComponentProtocol = {
  componentId: TITLE_BLOCK_COMPONENT_ID,
  allowedFamilies: [
    "simple",
    "badgeTitle",
    "iconDecor",
    "cardTitle",
    "magazine",
    "numbered",
    "underline",
    "pill",
    "editorial",
    "keynote",
  ],
  allowedLayoutModes: [
    "plain",
    "left_bar",
    "bottom_line",
    "top_badge",
    "numbered",
    "underline",
    "pill",
    "keynote_bar",
    "highlight_marker",
    "short_line",
    "minimal_number",
    "magazine_offset",
    "card",
    "quote_mark",
    "icon_prefix",
    "magazine_left_bar",
    "overlay",
    "offset_background",
  ],
  version: "1",
};

function resolveComponentId(blockType: BlockType): string {
  if (blockType === "title" || blockType === "heading") {
    return TITLE_BLOCK_COMPONENT_ID;
  }
  return blockType;
}

function collectRequiredSlots(variants: ReturnType<typeof getVariantsForBlockType>): string[] {
  const required = new Set<string>();

  for (const variant of variants) {
    if (!variant.slots) {
      continue;
    }
    for (const [slotKey, slot] of Object.entries(variant.slots)) {
      if (slot.binding.required || slot.role === "title") {
        required.add(slotKey);
      }
    }
  }

  return [...required];
}

export function buildBlockVisualProtocol(
  registry: StyleRegistry,
  blockType: BlockType,
): BlockVisualProtocol {
  const variants = getVariantsForBlockType(registry, blockType);
  const allowedFamilies = [...new Set(variants.map((variant) => variant.family))];
  const allowedVariants = variants.map((variant) => variant.id);
  const allowedSlots = [
    ...new Set(
      variants.flatMap((variant) => Object.keys(variant.slots ?? {})),
    ),
  ];
  const requiredSlots = collectRequiredSlots(variants);
  const fallbackVariant =
    variants.find((variant) => variant.status === "release1_required")?.id ??
    allowedVariants[0] ??
    "";

  return {
    blockType,
    componentId: resolveComponentId(blockType),
    allowedFamilies,
    allowedVariants,
    allowedSlots,
    requiredSlots,
    allowedAssetKinds: [...VISUAL_ASSET_KINDS],
    fallbackVariant,
    version: "1",
  };
}

export function buildComponentProtocolForBlockType(
  blockType: BlockType,
): ComponentProtocol {
  if (blockType === "title" || blockType === "heading") {
    return TITLE_BLOCK_COMPONENT_PROTOCOL;
  }

  return {
    componentId: blockType,
    allowedFamilies: [],
    allowedLayoutModes: [],
    version: "1",
  };
}

export function isRegisteredFamilyInRegistry(
  registry: StyleRegistry,
  familyId: string,
): boolean {
  return registry.variants.some((variant) => variant.family === familyId);
}

export function isRegisteredVariantInRegistry(
  registry: StyleRegistry,
  variantId: string,
): boolean {
  return getVariantById(registry, variantId) !== undefined;
}

export function getRegisteredFamilies(registry: StyleRegistry): string[] {
  return [...new Set(registry.variants.map((variant) => variant.family))];
}
