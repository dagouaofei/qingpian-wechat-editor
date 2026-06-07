import { BLOCK_TYPES, type BlockType } from "@/core/blocks";

import {
  ARTICLE_DSL_VERSION,
  VARIANT_DSL_VERSION,
  type ArticleDslV1,
  type DslNode,
  type DslValidationIssue,
  type DslValidationResult,
  type VariantDslV1,
  type VariantRenderContract,
} from "./dsl-types";

const RENDER_CONTRACTS_BY_BLOCK: Record<BlockType, VariantRenderContract> = {
  title: "title_block_v1",
  heading: "title_block_v1",
  lead: "text_block_v1",
  paragraph: "text_block_v1",
  divider: "divider_block_v1",
  list: "list_block_v1",
  quote: "quote_block_v1",
  highlight: "highlight_block_v1",
  info_card: "info_card_v1",
  cta: "cta_block_v1",
  image_placeholder: "image_placeholder_v1",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBlockType(value: unknown): value is BlockType {
  return typeof value === "string" && (BLOCK_TYPES as readonly string[]).includes(value);
}

function validateDslNode(node: unknown, path: string, issues: DslValidationIssue[]): void {
  if (!isRecord(node) || typeof node.type !== "string") {
    issues.push({ code: "invalid_node", message: "DSL node must be an object with type", path });
    return;
  }

  if (node.type === "element") {
    if (typeof node.tag !== "string" || node.tag.length === 0) {
      issues.push({ code: "invalid_element", message: "Element node requires tag", path });
    }
    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => validateDslNode(child, `${path}.children[${index}]`, issues));
    }
    return;
  }

  if (node.type === "slot") {
    if (typeof node.slot !== "string" || node.slot.length === 0) {
      issues.push({ code: "invalid_slot", message: "Slot node requires slot name", path });
    }
    return;
  }

  if (node.type === "text") {
    if (typeof node.value !== "string") {
      issues.push({ code: "invalid_text", message: "Text node requires string value", path });
    }
    return;
  }

  issues.push({ code: "unknown_node_type", message: `Unknown DSL node type: ${String(node.type)}`, path });
}

export function validateVariantDsl(dsl: VariantDslV1): DslValidationResult {
  const issues: DslValidationIssue[] = [];

  if (dsl.version !== VARIANT_DSL_VERSION) {
    issues.push({ code: "invalid_version", message: `Expected ${VARIANT_DSL_VERSION}` });
  }
  if (!dsl.id) {
    issues.push({ code: "missing_id", message: "Variant DSL requires id" });
  }
  if (!isBlockType(dsl.blockType)) {
    issues.push({ code: "invalid_block_type", message: "Invalid blockType" });
  }
  if (!dsl.copySafety) {
    issues.push({ code: "missing_copy_safety", message: "copySafety is required" });
  }

  const hasTree = dsl.tree != null;
  const hasContract = dsl.renderContract != null;

  if (!hasTree && !hasContract) {
    issues.push({
      code: "missing_render_source",
      message: "Variant DSL requires tree or renderContract",
    });
  }

  if (hasTree) {
    validateDslNode(dsl.tree, "tree", issues);
  }

  if (hasContract && dsl.blockType) {
    const expected = RENDER_CONTRACTS_BY_BLOCK[dsl.blockType];
    if (dsl.renderContract !== expected) {
      issues.push({
        code: "contract_block_mismatch",
        message: `renderContract ${dsl.renderContract} does not match blockType ${dsl.blockType}`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

export function validateArticleDsl(dsl: ArticleDslV1): DslValidationResult {
  const issues: DslValidationIssue[] = [];

  if (dsl.version !== ARTICLE_DSL_VERSION) {
    issues.push({ code: "invalid_version", message: `Expected ${ARTICLE_DSL_VERSION}` });
  }
  if (!Array.isArray(dsl.blocks) || dsl.blocks.length === 0) {
    issues.push({ code: "missing_blocks", message: "Article DSL requires blocks" });
    return { valid: false, issues };
  }

  dsl.blocks.forEach((block, index) => {
    const path = `blocks[${index}]`;
    if (!block.blockId) {
      issues.push({ code: "missing_block_id", message: "blockId required", path });
    }
    if (!isBlockType(block.blockType)) {
      issues.push({ code: "invalid_block_type", message: "Invalid blockType", path });
    }
    if (!block.styleRef?.runtimeVariantId) {
      issues.push({ code: "missing_style_ref", message: "styleRef.runtimeVariantId required", path });
    }
  });

  return { valid: issues.length === 0, issues };
}

export function isVariantDslV1(value: unknown): value is VariantDslV1 {
  return isRecord(value) && value.version === VARIANT_DSL_VERSION;
}

export function isArticleDslV1(value: unknown): value is ArticleDslV1 {
  return isRecord(value) && value.version === ARTICLE_DSL_VERSION;
}

export function getDefaultRenderContract(blockType: BlockType): VariantRenderContract {
  return RENDER_CONTRACTS_BY_BLOCK[blockType];
}

export function isDslNode(value: unknown): value is DslNode {
  if (!isRecord(value) || typeof value.type !== "string") {
    return false;
  }
  return value.type === "element" || value.type === "slot" || value.type === "text";
}
