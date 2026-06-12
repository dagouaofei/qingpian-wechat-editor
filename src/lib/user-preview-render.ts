import type { BlockType } from "@/core/blocks";
import { buildClipboardPayload, type BuildClipboardPayloadOptions } from "@/core/copy/clipboard-payload";
import type { DslRenderTarget } from "@/core/dsl/runtime";
import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type {
  RenderArticleBlocksOptions,
  RenderBlockOptions,
  RendererOutputPlaceholder,
  RendererResult,
} from "@/core/renderer";
import { createRendererIssue } from "@/core/renderer/issues";
import type { VariantDefinition } from "@/core/styles/types";

import { buildCodeFallbackDslRuntime } from "@/lib/dsl-runtime/build-code-fallback-dsl-runtime";
import type { DslRuntimeSnapshot } from "@/lib/dsl-runtime-context-types";
import { renderDslBlock } from "@/lib/dsl-runtime";

export type DslRuntimeContext = DslRuntimeSnapshot;

const DEFAULT_CODE_FALLBACK_RUNTIME = buildCodeFallbackDslRuntime();

function resolveDslTarget(mode: "preview" | "copy"): DslRenderTarget {
  return mode === "copy" ? "copy_wechat" : "preview";
}

function resolveRegistryVariantForBlock(
  options: RenderBlockOptions,
): VariantDefinition | undefined {
  const resolved = options.input.resolvedArticleStyle.blocks.find(
    (entry) => entry.blockId === options.input.block.id,
  );
  return resolved?.variant;
}

function resolveDslRuntimeContext(
  dslRuntime?: DslRuntimeContext,
): DslRuntimeContext {
  return dslRuntime ?? DEFAULT_CODE_FALLBACK_RUNTIME;
}

function resolveDefinitionJsonForVariant(
  variantId: string,
  dslRuntime: DslRuntimeContext,
  registryVariant?: VariantDefinition,
): { definitionJson?: unknown; runtimeSource: DslRuntimeContext["source"] } {
  if (dslRuntime.source === "database") {
    const fromDb = dslRuntime.definitionJsonByVariantId[variantId];
    if (fromDb != null) {
      return { definitionJson: fromDb, runtimeSource: "database" };
    }
    return { definitionJson: undefined, runtimeSource: "database" };
  }

  const fromPool = dslRuntime.definitionJsonByVariantId[variantId];
  if (fromPool != null) {
    return { definitionJson: fromPool, runtimeSource: dslRuntime.source };
  }

  if (registryVariant) {
    const encoded = encodeRegistryVariantToDsl(registryVariant);
    if (encoded.ok) {
      return { definitionJson: encoded.value, runtimeSource: "code_fallback" };
    }
  }

  return { definitionJson: undefined, runtimeSource: dslRuntime.source };
}

function buildDslRuntimeMissingError(
  options: RenderBlockOptions,
  variantId: string,
  runtimeSource: DslRuntimeContext["source"],
): RendererResult<RendererOutputPlaceholder> {
  const message =
    runtimeSource === "database"
      ? `Variant DSL missing in database runtime pool for "${variantId}"`
      : `Variant DSL unavailable for "${variantId}"`;

  return {
    ok: false,
    blockId: options.input.block.id,
    blockType: options.input.block.type,
    variantId,
    mode: options.input.mode,
    target: options.input.target,
    issues: [
      createRendererIssue({
        code: "invalid_renderer_input",
        message,
        blockId: options.input.block.id,
        blockType: options.input.block.type,
        variantId,
        details: { runtimeSource },
      }),
    ],
    warnings: [],
  };
}

/**
 * User preview/copy path — always renders via DSL Decoder Core.
 * DB available: definitionJson from database pool only.
 * DB unavailable: code_fallback encodes registry seed into DSL before decode.
 */
export function renderUserPreviewBlock(
  options: RenderBlockOptions & { dslRuntime?: DslRuntimeContext },
): RendererResult<RendererOutputPlaceholder> {
  const resolved = options.input.resolvedArticleStyle.blocks.find(
    (entry) => entry.blockId === options.input.block.id,
  );
  const variantId = resolved?.variantId;
  if (!variantId) {
    return buildDslRuntimeMissingError(options, "unknown", "database");
  }

  const dslRuntime = resolveDslRuntimeContext(options.dslRuntime);
  const registryVariant = resolveRegistryVariantForBlock(options);
  const resolvedDefinition = resolveDefinitionJsonForVariant(
    variantId,
    dslRuntime,
    registryVariant,
  );

  if (!resolvedDefinition.definitionJson) {
    return buildDslRuntimeMissingError(
      options,
      variantId,
      resolvedDefinition.runtimeSource,
    );
  }

  const resolvedBlockStyle = options.input.resolvedArticleStyle.blocks.find(
    (entry) => entry.blockId === options.input.block.id,
  );
  const themePalette = resolvedBlockStyle
    ? resolveThemePaletteTokens(resolvedBlockStyle.tokens.theme)
    : undefined;

  const variantSourceMeta = dslRuntime.variantSourceMetaByVariantId?.[variantId];

  const result = renderDslBlock({
    article: options.input.article,
    block: options.input.block,
    definitionJson: resolvedDefinition.definitionJson,
    runtimeVariantId: variantId,
    target: resolveDslTarget(options.input.mode),
    mode: options.input.mode,
    renderTarget: options.input.target,
    themePalette,
    label: variantSourceMeta?.label,
    family: variantSourceMeta?.styleFamily,
    primarySourceType: variantSourceMeta?.primarySourceType,
  });

  if (resolvedDefinition.runtimeSource === "code_fallback") {
    return {
      ...result,
      warnings: [
        ...result.warnings,
        createRendererIssue({
          code: "copy_safety_warning",
          message: `runtime_source=code_fallback variant=${variantId}`,
          blockId: options.input.block.id,
          blockType: options.input.block.type,
          variantId,
          severity: "warning",
        }),
      ],
    };
  }

  return result;
}

export function renderUserPreviewArticleBlocks(
  options: RenderArticleBlocksOptions & { dslRuntime?: DslRuntimeContext },
): RendererResult<RendererOutputPlaceholder>[] {
  return options.article.blocks.map((block) =>
    renderUserPreviewBlock({
      input: {
        article: options.article,
        block,
        resolvedArticleStyle: options.resolvedArticleStyle,
        mode: options.mode,
        target: options.target,
      },
      registry: options.registry,
      supportedBlockTypes: options.supportedBlockTypes,
      dslRuntime: options.dslRuntime,
    }),
  );
}

export function buildUserPreviewClipboardPayload(
  options: BuildClipboardPayloadOptions & {
    supportedBlockTypes?: readonly BlockType[];
    dslRuntime?: DslRuntimeContext;
  },
) {
  return buildClipboardPayload({
    ...options,
    renderBlockFn: (renderOptions) =>
      renderUserPreviewBlock({
        ...renderOptions,
        dslRuntime: options.dslRuntime,
      }),
  });
}
