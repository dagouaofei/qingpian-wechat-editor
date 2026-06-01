import { createBlockRendererRegistry } from "./registry";
import {
  QUOTE_SUPPORTED_VARIANT_IDS,
  createQuoteRenderer,
} from "./quote-renderer";
import type { BlockRendererRegistry } from "./types";

export function createQuoteRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createQuoteRenderer("preview"));
  registry.register(createQuoteRenderer("copy"));

  return registry;
}

export { QUOTE_SUPPORTED_VARIANT_IDS };
