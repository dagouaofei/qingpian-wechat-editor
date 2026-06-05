import type { BlockType } from "@/core/blocks";
import type { RendererOutputPlaceholder } from "@/core/renderer";
import type { WechatCopyValidationIssue, WechatCopyValidationResult } from "@/core/wechat-compat/copy-html-validator";

import type { StyleLibraryVariantAsset } from "./types";

export type StyleLibraryInspectionValidatorStatus = "PASS" | "WARNING" | "FAIL";

export type StyleLibraryInspectionTarget = {
  assetId: string;
  runtimeVariantId: string;
  blockType: BlockType;
  fixtureId: string;
  fixtureLabel: string;
  fixtureText: string;
  inspectionContext: "style-library-inspection";
};

export type StyleLibraryPreviewInspectionResult = {
  ok: boolean;
  status: "ok" | "error";
  blockType: BlockType;
  variantId: string;
  fixtureText: string;
  outputKind: string | null;
  output: RendererOutputPlaceholder | null;
  issues: string[];
};

export type StyleLibraryCopyInspectionResult = {
  ok: boolean;
  status: "ok" | "error";
  blockType: BlockType;
  variantId: string;
  html: string | null;
  htmlSnippet: string | null;
  usesInlineStyle: boolean;
  hasForbiddenCapability: boolean;
  hasRiskyCapability: boolean;
  issues: string[];
};

export type StyleLibraryValidatorInspectionResult = {
  status: StyleLibraryInspectionValidatorStatus;
  valid: boolean;
  issueCount: number;
  blockerCount: number;
  warningCount: number;
  noteCount: number;
  issues: WechatCopyValidationIssue[];
  validation: WechatCopyValidationResult | null;
};

export type PromoteReadiness = {
  candidateId: string;
  runtimeVariantId: string;
  validatorStatus: StyleLibraryInspectionValidatorStatus;
  hasPasteQaEvidence: boolean;
  hasBlockingIssues: boolean;
  readyForPromoteReview: boolean;
  blockedReasons: string[];
  nextRequiredStory: string | null;
};

export type StyleLibraryInspectionSummary = {
  target: StyleLibraryInspectionTarget;
  preview: StyleLibraryPreviewInspectionResult;
  copy: StyleLibraryCopyInspectionResult;
  validator: StyleLibraryValidatorInspectionResult;
  promoteReadiness: PromoteReadiness;
  operatorConclusionKey:
    | "ready_for_promote_review"
    | "ready_for_promote_review_with_warnings"
    | "needs_paste_qa"
    | "has_blocking_issues"
    | "validator_fail";
};

export function isStyleLibraryVariantAsset(
  asset: StyleLibraryVariantAsset | { assetType: string },
): asset is StyleLibraryVariantAsset {
  return asset.assetType === "variant";
}
