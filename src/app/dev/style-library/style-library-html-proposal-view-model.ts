import {
  createHtmlCandidateProposal,
  type HtmlCandidateProposal,
  type CreateHtmlCandidateProposalInput,
} from "@/core/style-library/html-candidate-proposal";
import type { BlockType } from "@/core/blocks";

import {
  getStyleLibraryUiCopy,
  translateHtmlProposalWarning,
  type StyleLibraryLocale,
} from "./style-library-i18n";

export type HtmlProposalBlockTypeOption = {
  value: BlockType;
  label: string;
};

export type HtmlProposalPanelCopy = {
  sectionTitle: string;
  sectionHint: string;
  htmlInputLabel: string;
  blockTypeLabel: string;
  labelInputLabel: string;
  generateButton: string;
  proposalPreviewTitle: string;
  extractedFeaturesTitle: string;
  inspectionTitle: string;
  evidenceDraftTitle: string;
  cursorPatchTitle: string;
  nextStepsTitle: string;
  emptyHtmlHint: string;
  noProposalYet: string;
};

export type HtmlProposalDisplay = {
  proposal: HtmlCandidateProposal;
  proposalId: string;
  candidateVariantId: string;
  label: string;
  blockType: string;
  styleFamily: string;
  paletteId: string;
  ruleIds: string[];
  copySafeRiskSummary: string;
  featureRows: Array<{ key: string; value: string }>;
  extractionWarnings: string[];
  inspectionCopyStatus: string;
  validatorStatus: string;
  operatorConclusion: string;
  promoteReadinessHint: string;
  previewNote: string;
  evidenceDraftLines: string[];
  cursorPatchSummary: string;
  nextSteps: string[];
  distributionSummary: string;
};

export function getHtmlProposalBlockTypeOptions(
  locale: StyleLibraryLocale,
): HtmlProposalBlockTypeOption[] {
  const ui = getStyleLibraryUiCopy(locale);
  return [
    { value: "heading", label: ui.htmlProposalBlockHeading },
    { value: "info_card", label: ui.htmlProposalBlockInfoCard },
    { value: "paragraph", label: ui.htmlProposalBlockParagraph },
    { value: "quote", label: ui.htmlProposalBlockQuote },
  ];
}

export function getHtmlProposalPanelCopy(locale: StyleLibraryLocale): HtmlProposalPanelCopy {
  const ui = getStyleLibraryUiCopy(locale);
  return {
    sectionTitle: ui.sectionCreateCandidate,
    sectionHint: ui.htmlProposalHint,
    htmlInputLabel: ui.htmlProposalInputLabel,
    blockTypeLabel: ui.htmlProposalBlockTypeLabel,
    labelInputLabel: ui.htmlProposalLabelInput,
    generateButton: ui.htmlProposalGenerateButton,
    proposalPreviewTitle: ui.htmlProposalPreviewTitle,
    extractedFeaturesTitle: ui.htmlProposalFeaturesTitle,
    inspectionTitle: ui.htmlProposalInspectionTitle,
    evidenceDraftTitle: ui.htmlProposalEvidenceTitle,
    cursorPatchTitle: ui.htmlProposalCursorPatchTitle,
    nextStepsTitle: ui.htmlProposalNextStepsTitle,
    emptyHtmlHint: ui.htmlProposalEmptyHtml,
    noProposalYet: ui.htmlProposalNoProposal,
  };
}

export function buildHtmlProposalDisplay(
  proposal: HtmlCandidateProposal,
  locale: StyleLibraryLocale,
): HtmlProposalDisplay {
  const label = locale === "zh" ? proposal.label.zh : proposal.label.en;

  return {
    proposal,
    proposalId: proposal.proposalId,
    candidateVariantId: proposal.candidateVariantId,
    label,
    blockType: proposal.detectedBlockType,
    styleFamily: proposal.suggestedStyleFamily,
    paletteId: proposal.suggestedPaletteId ?? "—",
    ruleIds: proposal.suggestedRuleIds,
    copySafeRiskSummary: proposal.copySafeRiskSummary,
    featureRows: proposal.extractedStyleFeatures,
    extractionWarnings: proposal.extraction.warnings.map((code) =>
      translateHtmlProposalWarning(locale, code),
    ),
    inspectionCopyStatus: proposal.inspection.copyStatus,
    validatorStatus: proposal.inspection.validatorStatus,
    operatorConclusion: proposal.inspection.operatorConclusion,
    promoteReadinessHint: proposal.inspection.promoteReadinessHint,
    previewNote: proposal.inspection.previewNote,
    evidenceDraftLines: [
      `sourceType: ${proposal.evidenceDraft.sourceType}`,
      `sourceHtmlHash: ${proposal.evidenceDraft.sourceHtmlHash}`,
      `sourceHtmlPreview: ${proposal.evidenceDraft.sourceHtmlPreview}`,
      `detectedBlockType: ${proposal.evidenceDraft.detectedBlockType}`,
      `validatorSummary: ${proposal.evidenceDraft.validatorSummary}`,
      `pasteQaStatus: ${proposal.evidenceDraft.pasteQaStatus}`,
      `operatorNotes: ${proposal.evidenceDraft.operatorNotes}`,
    ],
    cursorPatchSummary: proposal.cursorPatchSummary,
    nextSteps: proposal.nextSteps,
    distributionSummary:
      "userSelectable=false · defaultEligible=false · release1Required=false · lifecycle=candidate",
  };
}

export function generateHtmlCandidateProposalDisplay(
  input: CreateHtmlCandidateProposalInput,
  locale: StyleLibraryLocale,
): HtmlProposalDisplay | null {
  if (!input.sourceHtml.trim()) {
    return null;
  }
  return buildHtmlProposalDisplay(createHtmlCandidateProposal(input), locale);
}
