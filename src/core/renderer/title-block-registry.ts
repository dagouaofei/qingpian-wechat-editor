import { createBlockRendererRegistry } from "./registry";
import {
  TITLE_BLOCK_SUPPORTED_VARIANT_IDS,
  createTitleBlockRenderer,
} from "./title-block-renderer";
import type { BlockRendererRegistry } from "./types";

export function createTitleBlockRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createTitleBlockRenderer("title", "preview"));
  registry.register(createTitleBlockRenderer("title", "copy"));
  registry.register(createTitleBlockRenderer("heading", "preview"));
  registry.register(createTitleBlockRenderer("heading", "copy"));

  return registry;
}

export { TITLE_BLOCK_SUPPORTED_VARIANT_IDS };
