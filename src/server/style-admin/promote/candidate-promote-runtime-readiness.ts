import { parseArticle } from "@/core/article";
import type { Article } from "@/core/article";
import type { Block, BlockType } from "@/core/blocks";
import type { VariantDslRuntimeReadiness } from "@/core/dsl/runtime/dsl-trace-types";
import { parseDefinitionJsonToVariantDsl } from "@/lib/dsl-runtime/parse-variant-dsl";
import { validateVariantDslRuntimeReadiness } from "@/lib/dsl-runtime/validate-variant-dsl-runtime-readiness";

function readExtractedSlots(definitionJson: unknown): Record<string, string> {
  if (typeof definitionJson !== "object" || definitionJson === null) {
    return {};
  }
  const meta = (definitionJson as Record<string, unknown>).meta;
  if (typeof meta !== "object" || meta === null) {
    return {};
  }
  const extractedSlots = (meta as Record<string, unknown>).extractedSlots;
  if (typeof extractedSlots !== "object" || extractedSlots === null) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(extractedSlots).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0,
    ),
  );
}

function buildPromoteReadinessArticle(
  blockType: BlockType,
  extractedSlots: Record<string, string>,
): { article: Article; block: Block } {
  const title = extractedSlots.title ?? extractedSlots.eyebrow ?? "Readiness fixture";
  const blockId = "44444444-4444-4444-8444-000000000099";
  const blockContent =
    blockType === "info_card"
      ? { title, body: extractedSlots.body ?? "Promote readiness body." }
      : blockType === "heading"
        ? { text: title, level: 2 as const }
        : { text: title };

  const article = parseArticle({
    id: "33333333-3333-4333-8333-333333339099",
    version: 1,
    metadata: {
      title: "Promote Readiness Fixture",
      createdAt: "2026-06-07T00:00:00.000Z",
      updatedAt: "2026-06-07T00:00:00.000Z",
      locale: "zh-CN",
    },
    input: {
      type: "fixture",
      raw: "fixture:promote-readiness",
      capturedAt: "2026-06-07T00:00:00.000Z",
    },
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
    },
    blocks: [{ id: blockId, type: blockType, content: blockContent }],
  });

  return { article, block: article.blocks[0]! };
}

export function buildCandidatePromoteRuntimeReadiness(input: {
  runtimeVariantId: string;
  blockType: BlockType;
  definitionJson: unknown;
}): VariantDslRuntimeReadiness | null {
  if (input.definitionJson == null) {
    return null;
  }

  const parsed = parseDefinitionJsonToVariantDsl(
    input.definitionJson,
    input.runtimeVariantId,
    input.blockType,
  );
  const extractedSlots = parsed.ok ? readExtractedSlots(parsed.value) : readExtractedSlots(input.definitionJson);
  const { article, block } = buildPromoteReadinessArticle(input.blockType, extractedSlots);

  return validateVariantDslRuntimeReadiness({
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    definitionJson: input.definitionJson,
    poolSource: "database",
    article,
    block,
  });
}

export function mergePromoteEligibilityWithRuntimeReadiness(
  baseBlockedReasons: string[],
  readiness: VariantDslRuntimeReadiness | null,
): { eligible: boolean; blockedReasons: string[] } {
  const blockedReasons = [...baseBlockedReasons];

  if (!readiness) {
    blockedReasons.push("Not eligible: Variant DSL definition is missing.");
    return { eligible: false, blockedReasons };
  }

  if (!readiness.trace.dslValid) {
    blockedReasons.push("Not eligible: Variant DSL schema invalid.");
  }
  if (readiness.trace.runtimeSource !== "database_dsl") {
    blockedReasons.push(`Not eligible: runtimeSource is ${readiness.trace.runtimeSource}.`);
  }
  if (!readiness.previewReady) {
    blockedReasons.push("Not eligible: DSL preview is not renderable.");
  }
  if (!readiness.copyReady) {
    blockedReasons.push("Not eligible: copy_wechat output is empty.");
  }
  if (readiness.compatibilityStatus === "failed") {
    blockedReasons.push("Not eligible: WeChat compatibility check failed.");
  }
  if (readiness.compatibilityStatus === "skipped") {
    // Diagnostic harvest mode=off — promote allowed when other gates pass; UI must warn.
  }
  for (const issue of readiness.issues.filter((item) => item.severity === "blocking")) {
    blockedReasons.push(`Not eligible: ${issue.message}`);
  }

  const unique = [...new Set(blockedReasons)];
  return {
    eligible: unique.length === 0,
    blockedReasons: unique,
  };
}
