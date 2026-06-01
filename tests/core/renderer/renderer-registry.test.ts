import { describe, expect, it } from "vitest";

import type { BlockRenderer } from "@/core/renderer";
import {
  BlockRendererRegistryError,
  createBlockRendererRegistry,
} from "@/core/renderer";

function stubRenderer(
  blockType: BlockRenderer["blockType"],
  mode: BlockRenderer["mode"],
): BlockRenderer {
  return {
    blockType,
    mode,
    render: (context) => ({
      ok: true,
      blockId: context.block.id,
      blockType: context.block.type,
      variantId: context.resolvedBlockStyle.variantId,
      mode: context.mode,
      target: context.target,
      issues: [],
      warnings: [],
    }),
  };
}

describe("block renderer registry", () => {
  it("registers and resolves renderer by blockType + mode", () => {
    const registry = createBlockRendererRegistry();
    const previewTitle = stubRenderer("title", "preview");
    const copyTitle = stubRenderer("title", "copy");

    registry.register(previewTitle);
    registry.register(copyTitle);

    expect(registry.resolve("title", "preview")).toBe(previewTitle);
    expect(registry.resolve("title", "copy")).toBe(copyTitle);
    expect(registry.has("title", "preview")).toBe(true);
    expect(registry.has("paragraph", "preview")).toBe(false);
  });

  it("lists renderers in stable sorted order", () => {
    const registry = createBlockRendererRegistry();
    registry.register(stubRenderer("paragraph", "copy"));
    registry.register(stubRenderer("title", "copy"));
    registry.register(stubRenderer("title", "preview"));

    expect(registry.list().map((entry) => `${entry.mode}:${entry.blockType}`)).toEqual([
      "copy:paragraph",
      "copy:title",
      "preview:title",
    ]);
  });

  it("throws when duplicate renderer is registered", () => {
    const registry = createBlockRendererRegistry();
    registry.register(stubRenderer("divider", "preview"));

    expect(() => registry.register(stubRenderer("divider", "preview"))).toThrow(
      BlockRendererRegistryError,
    );
  });

  it("keeps preview and copy registrations independent", () => {
    const registry = createBlockRendererRegistry();
    registry.register(stubRenderer("heading", "preview"));

    expect(registry.resolve("heading", "preview")).toBeDefined();
    expect(registry.resolve("heading", "copy")).toBeUndefined();
  });
});
