import type { BlockType } from "@/core/blocks";

import { createRendererIssue } from "./issues";
import type {
  BlockRenderer,
  BlockRendererRegistry,
  RenderMode,
  RendererIssue,
} from "./types";

export class BlockRendererRegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlockRendererRegistryError";
  }
}

function registryKey(blockType: BlockType, mode: RenderMode): string {
  return `${mode}:${blockType}`;
}

export function createBlockRendererRegistry(): BlockRendererRegistry {
  const renderers = new Map<string, BlockRenderer>();

  const register = (renderer: BlockRenderer): void => {
    const key = registryKey(renderer.blockType, renderer.mode);
    if (renderers.has(key)) {
      throw new BlockRendererRegistryError(
        `renderer already registered for ${renderer.mode}:${renderer.blockType}`,
      );
    }
    renderers.set(key, renderer);
  };

  const resolve = (
    blockType: BlockType,
    mode: RenderMode,
  ): BlockRenderer | undefined => {
    return renderers.get(registryKey(blockType, mode));
  };

  const has = (blockType: BlockType, mode: RenderMode): boolean => {
    return renderers.has(registryKey(blockType, mode));
  };

  const list = (): BlockRenderer[] => {
    return [...renderers.values()].sort((left, right) => {
      const leftKey = registryKey(left.blockType, left.mode);
      const rightKey = registryKey(right.blockType, right.mode);
      return leftKey.localeCompare(rightKey);
    });
  };

  return { register, resolve, has, list };
}

export function resolveRendererOrIssue(
  registry: BlockRendererRegistry,
  blockType: BlockType,
  mode: RenderMode,
  blockId: string,
): { renderer?: BlockRenderer; issue?: RendererIssue } {
  const renderer = registry.resolve(blockType, mode);

  if (renderer == null) {
    return {
      issue: createRendererIssue({
        code: "renderer_not_registered",
        message: `no ${mode} renderer registered for block type "${blockType}"`,
        blockId,
        blockType,
        path: ["registry", mode, blockType],
      }),
    };
  }

  return { renderer };
}
