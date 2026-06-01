import { createBlockRendererRegistry } from "./registry";
import {
  HIGHLIGHT_SUPPORTED_VARIANT_IDS,
  createHighlightRenderer,
} from "./highlight-renderer";
import type { BlockRendererRegistry } from "./types";

export function createHighlightRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createHighlightRenderer("preview"));
  registry.register(createHighlightRenderer("copy"));

  return registry;
}

export { HIGHLIGHT_SUPPORTED_VARIANT_IDS };
