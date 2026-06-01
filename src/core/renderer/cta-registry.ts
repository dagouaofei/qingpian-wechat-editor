import { createBlockRendererRegistry } from "./registry";
import { CTA_SUPPORTED_VARIANT_IDS, createCtaRenderer } from "./cta-renderer";
import type { BlockRendererRegistry } from "./types";

export function createCtaRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createCtaRenderer("preview"));
  registry.register(createCtaRenderer("copy"));

  return registry;
}

export { CTA_SUPPORTED_VARIANT_IDS };
