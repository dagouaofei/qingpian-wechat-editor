import { createBlockRendererRegistry } from "./registry";
import {
  DIVIDER_SUPPORTED_VARIANT_IDS,
  createDividerRenderer,
} from "./divider-renderer";
import type { BlockRendererRegistry } from "./types";

export function createDividerRendererRegistry(): BlockRendererRegistry {
  const registry = createBlockRendererRegistry();

  registry.register(createDividerRenderer("preview"));
  registry.register(createDividerRenderer("copy"));

  return registry;
}

export { DIVIDER_SUPPORTED_VARIANT_IDS };
