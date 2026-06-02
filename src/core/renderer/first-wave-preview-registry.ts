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

export const RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES = [
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

export type Release1FirstWavePreviewBlockType =
  (typeof RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES)[number];

export function createRelease1FirstWavePreviewRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createTitleBlockRenderer("title", "preview"));
  registry.register(createTitleBlockRenderer("heading", "preview"));
  registry.register(createTextBlockRenderer("lead", "preview"));
  registry.register(createTextBlockRenderer("paragraph", "preview"));
  registry.register(createDividerRenderer("preview"));
  registry.register(createListRenderer("preview"));
  registry.register(createQuoteRenderer("preview"));
  registry.register(createHighlightRenderer("preview"));
  registry.register(createInfoCardRenderer("preview"));
  registry.register(createCtaRenderer("preview"));
  registry.register(createImagePlaceholderRenderer("preview"));

  return registry;
}
