import { createBlockRendererRegistry } from "./registry";
import {
  TEXT_BLOCK_SUPPORTED_VARIANT_IDS,
  createTextBlockRenderer,
} from "./text-block-renderer";
import type { BlockRendererRegistry } from "./types";

export function createTextBlockRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createTextBlockRenderer("lead", "preview"));
  registry.register(createTextBlockRenderer("lead", "copy"));
  registry.register(createTextBlockRenderer("paragraph", "preview"));
  registry.register(createTextBlockRenderer("paragraph", "copy"));

  return registry;
}

export { TEXT_BLOCK_SUPPORTED_VARIANT_IDS };
