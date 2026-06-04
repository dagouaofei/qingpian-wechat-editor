import type { BlockType } from "@/core/blocks/block.types";

import type { WechatCopyValidationResult } from "./copy-html-validator";

/** Sprint Matrix 语义：summary 对应 schema block `highlight`。 */
export type FidelityMatrixBlockType = BlockType | "summary";

export type FidelityVariantType = "existing" | "probe" | "candidate";

export type FidelityValidatorStatus = "PASS" | "WARNING" | "FAIL";

export type FidelityPasteStatus = "PASS" | "FAIL" | "WARNING" | "UNTESTED";

export interface WechatFidelityFixtureSpec {
  matrixRowId: string;
  fixtureId: string;
  /** Schema block type used for render + validator */
  blockType: BlockType;
  /** Matrix 展示用别名（如 summary → highlight） */
  matrixBlockType?: FidelityMatrixBlockType;
  variantId: string;
  variantType: FidelityVariantType;
  /** probe 专用：测试目的，不得进入默认 preset */
  probePurpose?: string;
  cssCapability: string[];
  domStructure: string;
  contractLevel: "green" | "yellow" | "mixed";
}

export interface WechatFidelityMatrixRow extends WechatFidelityFixtureSpec {
  matrixBlockType: FidelityMatrixBlockType;
  clipboardHtmlSummary: string;
  validatorStatus: FidelityValidatorStatus;
  validatorErrors: string;
  validatorWarnings: string;
  validatorNotes: string;
  validation: WechatCopyValidationResult;
  pasteStatus: FidelityPasteStatus;
  pasteEvidence: string;
  contractAction: string;
  notes: string;
}
