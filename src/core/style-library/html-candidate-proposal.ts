import type { BlockType } from "@/core/blocks";
import { validateWechatCopyHtml } from "@/core/copy";

import type { StyleLibraryInspectionValidatorStatus } from "./inspection-result";
import {
  extractStyleFeaturesFromHtml,
  hashSourceHtml,
  inferBlockTypeFromHtml,
  previewSourceHtml,
  type ExtractedStyleFeature,
  type HtmlStyleExtractionResult,
} from "./html-style-extractor";
import type { StyleLibraryDistributionFlags, StyleLibraryLifecycleState } from "./types";

export type HtmlCandidateEvidenceDraft = {
  sourceType: "pasted_html";
  createdAt: string;
  sourceHtmlHash: string;
  sourceHtmlPreview: string;
  detectedBlockType: BlockType;
  validatorSummary: string;
  pasteQaStatus: "not_tested";
  operatorNotes: string;
};

export type HtmlCandidateProposalInspection = {
  copyHtml: string;
  copyStatus: "ok" | "error";
  validatorStatus: StyleLibraryInspectionValidatorStatus;
  validatorValid: boolean;
  issueCount: number;
  blockerCount: number;
  warningCount: number;
  operatorConclusionKey:
    | "proposal_needs_review"
    | "proposal_validator_fail"
    | "proposal_validator_warning";
  operatorConclusion: string;
  promoteReadinessHint: string;
  previewNote: string;
};

export type HtmlCandidateProposal = {
  proposalId: string;
  sourceHtml: string;
  detectedBlockType: BlockType;
  candidateVariantId: string;
  label: { zh: string; en: string };
  extractedStyleFeatures: ExtractedStyleFeature[];
  extraction: HtmlStyleExtractionResult;
  suggestedStyleFamily: string;
  suggestedPaletteId: string | null;
  suggestedRuleIds: string[];
  copySafeRiskSummary: string;
  proposedLifecycle: StyleLibraryLifecycleState;
  distribution: StyleLibraryDistributionFlags;
  evidenceDraft: HtmlCandidateEvidenceDraft;
  cursorPatchSummary: string;
  inspection: HtmlCandidateProposalInspection;
  nextSteps: string[];
};

export type CreateHtmlCandidateProposalInput = {
  sourceHtml: string;
  blockType?: BlockType;
  label?: string;
  createdAt?: string;
};

const PROPOSAL_RULE_IDS = [
  "RULE_PASTE_QA_BEFORE_DEFAULT",
  "RULE_WARNING_PROMOTE_WITH_EVIDENCE",
  "RULE_USER_SELECTABLE_NOT_DEFAULT",
  "RULE_HARVEST_NOT_RELEASE1",
] as const;

const FALSE_DISTRIBUTION: StyleLibraryDistributionFlags = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

function suggestPaletteId(blockType: BlockType, extraction: HtmlStyleExtractionResult): string | null {
  const colors = extraction.features
    .filter((row) => row.key.toLowerCase().includes("color"))
    .map((row) => row.value.toLowerCase());
  if (colors.some((c) => c.includes("6c5ce7") || c.includes("7c3aed") || c.includes("purple"))) {
    return "palette_purple_chapter_editorial";
  }
  if (blockType === "info_card" || colors.some((c) => c.includes("2563eb") || c.includes("blue"))) {
    return "palette_reading_path_calm";
  }
  return null;
}

function suggestStyleFamily(blockType: BlockType): string {
  if (blockType === "heading") return "harvestCandidate";
  if (blockType === "info_card") return "harvestCandidate";
  return "pastedCandidate";
}

function buildCopySafeRiskSummary(extraction: HtmlStyleExtractionResult): string {
  if (extraction.hasForbiddenCss) {
    return "Forbidden CSS detected in pasted HTML; requires review before candidate registration.";
  }
  if (extraction.hasRiskyCss) {
    return "Risky CSS patterns detected; retain Paste QA evidence before promote.";
  }
  if (!extraction.hasInlineStyle) {
    return "No inline style detected; may not render correctly in WeChat copy path.";
  }
  return "Inline style detected; run validator and Paste QA before promote.";
}

function buildCursorPatchSummary(proposal: {
  proposalId: string;
  candidateVariantId: string;
  detectedBlockType: BlockType;
  label: { zh: string; en: string };
  suggestedStyleFamily: string;
  suggestedPaletteId: string | null;
  suggestedRuleIds: string[];
  evidenceDraft: HtmlCandidateEvidenceDraft;
}): string {
  return [
    `# Cursor patch summary · ${proposal.proposalId}`,
    "",
    "## Add candidate variant definition",
    `- variantId: ${proposal.candidateVariantId}`,
    `- blockType: ${proposal.detectedBlockType}`,
    `- styleFamily: ${proposal.suggestedStyleFamily}`,
    `- label: ${proposal.label.en}`,
    "",
    "## Add style-library asset",
    `- assetType: variant`,
    `- assetId: seed-variant-${slugify(proposal.candidateVariantId)}`,
    `- lifecycle: candidate (or validator_pass after code review; NOT paste_qa_pass without real Paste QA)`,
    `- distribution: userSelectable=false · defaultEligible=false · release1Required=false`,
    "",
    "## Evidence refs (draft)",
    `- sourceType: pasted_html`,
    `- sourceHtmlHash: ${proposal.evidenceDraft.sourceHtmlHash}`,
    `- pasteQaStatus: not_tested`,
    "",
    "## Suggested associations",
    `- palette: ${proposal.suggestedPaletteId ?? "TBD"}`,
    `- rules: ${proposal.suggestedRuleIds.join(", ")}`,
    "",
    "## Boundaries",
    "- Do NOT enter default preset",
    "- Do NOT set release1_required",
    "- Do NOT activate runtime registry patch in browser",
    "- Apply via S9-STORY-007B (Cursor apply patch workflow)",
  ].join("\n");
}

function buildProposalInspection(
  sourceHtml: string,
  blockType: BlockType,
  candidateVariantId: string,
  extraction: HtmlStyleExtractionResult,
): HtmlCandidateProposalInspection {
  const validation = validateWechatCopyHtml({
    html: sourceHtml,
    blockType,
    variantId: candidateVariantId,
  });

  const blockerCount = validation.errors.length;
  const warningCount = validation.warnings.length;
  const validatorStatus: StyleLibraryInspectionValidatorStatus = !validation.valid
    ? "FAIL"
    : warningCount > 0
      ? "WARNING"
      : "PASS";

  const operatorConclusionKey =
    validatorStatus === "FAIL"
      ? "proposal_validator_fail"
      : validatorStatus === "WARNING" || extraction.hasRiskyCss
        ? "proposal_validator_warning"
        : "proposal_needs_review";

  const operatorConclusion =
    operatorConclusionKey === "proposal_validator_fail"
      ? "Validator FAIL — fix copy-safe issues before registering candidate."
      : operatorConclusionKey === "proposal_validator_warning"
        ? "Validator WARNING or risky CSS — proposal OK for review with evidence retention."
        : "Proposal ready for operator review — apply patch via Cursor (S9-STORY-007B).";

  return {
    copyHtml: sourceHtml,
    copyStatus: sourceHtml.trim() ? "ok" : "error",
    validatorStatus,
    validatorValid: validation.valid,
    issueCount: validation.issues.length,
    blockerCount,
    warningCount,
    operatorConclusionKey,
    operatorConclusion,
    promoteReadinessHint:
      "Not ready for promote — lifecycle candidate · pasteQaStatus not_tested · requires S9-STORY-007B apply + Paste QA",
    previewNote:
      "Preview requires variant definition in inspection registry — apply patch via S9-STORY-007B before renderer preview.",
  };
}

export function createHtmlCandidateProposal(
  input: CreateHtmlCandidateProposalInput,
): HtmlCandidateProposal {
  const sourceHtml = input.sourceHtml.trim();
  const createdAt = input.createdAt ?? "2026-06-05";
  const extraction = extractStyleFeaturesFromHtml(sourceHtml);
  const inferred = inferBlockTypeFromHtml(sourceHtml);
  const detectedBlockType = input.blockType ?? inferred ?? "paragraph";
  const baseLabel =
    input.label?.trim() ||
    `Pasted ${detectedBlockType} candidate ${hashSourceHtml(sourceHtml).slice(-6)}`;
  const candidateVariantId = `${slugify(detectedBlockType)}_${slugify(baseLabel)}_candidate`.replace(
    /_+/g,
    "_",
  );
  const proposalId = `html-candidate-proposal-${hashSourceHtml(sourceHtml)}`;
  const suggestedPaletteId = suggestPaletteId(detectedBlockType, extraction);

  const label = {
    zh: baseLabel,
    en: baseLabel,
  };

  const evidenceDraft: HtmlCandidateEvidenceDraft = {
    sourceType: "pasted_html",
    createdAt,
    sourceHtmlHash: hashSourceHtml(sourceHtml),
    sourceHtmlPreview: previewSourceHtml(sourceHtml),
    detectedBlockType,
    validatorSummary: "pending inspection",
    pasteQaStatus: "not_tested",
    operatorNotes: "Generated from HTML paste · not persisted · requires operator review",
  };

  const inspection = buildProposalInspection(
    sourceHtml,
    detectedBlockType,
    candidateVariantId,
    extraction,
  );
  evidenceDraft.validatorSummary = `${inspection.validatorStatus} · blockers=${inspection.blockerCount} · warnings=${inspection.warningCount}`;

  const partial = {
    proposalId,
    candidateVariantId,
    detectedBlockType,
    label,
    suggestedStyleFamily: suggestStyleFamily(detectedBlockType),
    suggestedPaletteId,
    suggestedRuleIds: [...PROPOSAL_RULE_IDS],
    evidenceDraft,
  };

  return {
    ...partial,
    sourceHtml,
    extractedStyleFeatures: extraction.features,
    extraction,
    copySafeRiskSummary: buildCopySafeRiskSummary(extraction),
    proposedLifecycle: "candidate",
    distribution: { ...FALSE_DISTRIBUTION },
    cursorPatchSummary: buildCursorPatchSummary(partial),
    inspection,
    nextSteps: [
      "Requires operator review",
      "Requires Cursor apply patch (S9-STORY-007B)",
      "Requires subsequent promote review (S9-STORY-007)",
    ],
  };
}

export function validateHtmlCandidateProposal(proposal: HtmlCandidateProposal): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (proposal.distribution.userSelectable) issues.push("must not be userSelectable");
  if (proposal.distribution.defaultEligible) issues.push("must not be defaultEligible");
  if (proposal.distribution.release1Required) issues.push("must not be release1Required");
  if (proposal.proposedLifecycle === "paste_qa_pass") {
    issues.push("must not start at paste_qa_pass without Paste QA evidence");
  }
  if (!proposal.cursorPatchSummary.includes("S9-STORY-007B")) {
    issues.push("cursor patch summary must reference S9-STORY-007B");
  }
  return { ok: issues.length === 0, issues };
}
