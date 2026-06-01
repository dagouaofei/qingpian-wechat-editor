import { createBlockRendererRegistry } from "./registry";
import {
  IMAGE_PLACEHOLDER_SUPPORTED_VARIANT_IDS,
  createImagePlaceholderRenderer,
} from "./image-placeholder-renderer";
import type { BlockRendererRegistry } from "./types";

export function createImagePlaceholderRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createImagePlaceholderRenderer("preview"));
  registry.register(createImagePlaceholderRenderer("copy"));

  return registry;
}

export { IMAGE_PLACEHOLDER_SUPPORTED_VARIANT_IDS };
