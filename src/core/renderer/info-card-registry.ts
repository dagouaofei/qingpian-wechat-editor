import { createBlockRendererRegistry } from "./registry";
import {
  INFO_CARD_SUPPORTED_VARIANT_IDS,
  createInfoCardRenderer,
} from "./info-card-renderer";
import type { BlockRendererRegistry } from "./types";

export function createInfoCardRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createInfoCardRenderer("preview"));
  registry.register(createInfoCardRenderer("copy"));

  return registry;
}

export { INFO_CARD_SUPPORTED_VARIANT_IDS };
