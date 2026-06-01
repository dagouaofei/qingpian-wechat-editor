import {
  createBlockRendererRegistry,
  createCtaRenderer,
  createDividerRenderer,
  createHighlightRenderer,
  createImagePlaceholderRenderer,
  createInfoCardRenderer,
  createListRenderer,
  createQuoteRenderer,
  createTextBlockRenderer,
  createTitleBlockRenderer,
  type BlockRendererRegistry,
} from "@/core/renderer";

export const RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES = [
  "title",
  "heading",
  "lead",
  "paragraph",
  "divider",
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "image_placeholder",
] as const;

export type Release1FirstWaveCopyBlockType =
  (typeof RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES)[number];

export function createRelease1FirstWaveCopyRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createTitleBlockRenderer("title", "copy"));
  registry.register(createTitleBlockRenderer("heading", "copy"));
  registry.register(createTextBlockRenderer("lead", "copy"));
  registry.register(createTextBlockRenderer("paragraph", "copy"));
  registry.register(createDividerRenderer("copy"));
  registry.register(createListRenderer("copy"));
  registry.register(createQuoteRenderer("copy"));
  registry.register(createHighlightRenderer("copy"));
  registry.register(createInfoCardRenderer("copy"));
  registry.register(createCtaRenderer("copy"));
  registry.register(createImagePlaceholderRenderer("copy"));

  return registry;
}
