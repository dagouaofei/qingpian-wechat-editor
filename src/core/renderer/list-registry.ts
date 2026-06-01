import { createBlockRendererRegistry } from "./registry";
import {
  LIST_SUPPORTED_VARIANT_IDS,
  createListRenderer,
} from "./list-renderer";
import type { BlockRendererRegistry } from "./types";

export function createListRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createListRenderer("preview"));
  registry.register(createListRenderer("copy"));

  return registry;
}

export { LIST_SUPPORTED_VARIANT_IDS };
