import {
  createBlockRendererRegistry,
  createDividerRenderer,
  createTextBlockRenderer,
  createTitleBlockRenderer,
  type BlockRendererRegistry,
} from "@/core/renderer";

export const SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES = [
  "title",
  "heading",
  "lead",
  "paragraph",
  "divider",
] as const;

export type Sprint4ATextFirstCopyBlockType =
  (typeof SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES)[number];

export function createSprint4ATextFirstCopyRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createTitleBlockRenderer("title", "copy"));
  registry.register(createTitleBlockRenderer("heading", "copy"));
  registry.register(createTextBlockRenderer("lead", "copy"));
  registry.register(createTextBlockRenderer("paragraph", "copy"));
  registry.register(createDividerRenderer("copy"));

  return registry;
}
