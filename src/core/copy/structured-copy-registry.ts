import {
  createBlockRendererRegistry,
  createCtaRenderer,
  createHighlightRenderer,
  createImagePlaceholderRenderer,
  createInfoCardRenderer,
  createListRenderer,
  createQuoteRenderer,
  type BlockRendererRegistry,
} from "@/core/renderer";

export const SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES = [
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "image_placeholder",
] as const;

export type Sprint4BStructuredCopyBlockType =
  (typeof SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES)[number];

export function createSprint4BStructuredCopyRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createListRenderer("copy"));
  registry.register(createQuoteRenderer("copy"));
  registry.register(createHighlightRenderer("copy"));
  registry.register(createInfoCardRenderer("copy"));
  registry.register(createCtaRenderer("copy"));
  registry.register(createImagePlaceholderRenderer("copy"));

  return registry;
}
