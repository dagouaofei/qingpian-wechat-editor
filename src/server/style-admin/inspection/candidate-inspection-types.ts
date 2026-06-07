import type {
  BlockType,
  CopySafetyTier,
  StyleVariantEvidenceType,
  StyleVariantLifecycle,
  StyleVariantQualityStatus,
  StyleVariantSourceType,
} from "@prisma/client";

import type { VariantDefinition } from "@/core/styles/types";
import type { JsonValue } from "../types";

export const ADMIN_INSPECTION_CONTEXT = "s10-admin-candidate-inspection" as const;

export type CandidateInspectionBlockType = "heading" | "info_card";

export type DbCandidateInspectionSource = {
  variantId: string;
  runtimeVariantId: string;
  blockType: BlockType;
  styleFamily: string;
  label: string;
  lifecycle: StyleVariantLifecycle;
  definitionJson: JsonValue;
  componentProtocolJson: JsonValue | null;
  compatibilityJson: JsonValue | null;
  copySafety: CopySafetyTier;
  qualityStatus: StyleVariantQualityStatus;
  versionId: string;
  versionNumber: number;
  primarySourceType: StyleVariantSourceType | null;
  hasRawHtml: boolean;
  rawHtml?: string | null;
};

export type CandidateInspectionFixture = {
  fixtureId: string;
  fixtureLabel: string;
  sampleText: string;
  blockContent: Record<string, unknown>;
};

export type CandidatePreviewInspection = {
  ok: boolean;
  status: "ok" | "error" | "unsupported";
  blockType: BlockType;
  variantId: string;
  fixtureText: string;
  outputKind: string | null;
  issues: string[];
  usedAdminFallback: boolean;
};

export type CandidateCopyInspection = {
  ok: boolean;
  status: "ok" | "error" | "unsupported";
  blockType: BlockType;
  variantId: string;
  html: string | null;
  htmlSnippet: string | null;
  textPlain: string | null;
  copySafety: CopySafetyTier;
  usesInlineStyle: boolean;
  issues: string[];
  usedAdminFallback: boolean;
};

export type CandidateValidatorInspection = {
  status: "pass" | "warning" | "fail";
  valid: boolean;
  issueCount: number;
  blockerCount: number;
  warningCount: number;
  structuralIssues: string[];
  issues: Array<{ level: string; message: string; code?: string }>;
};

export type CandidateInspectionResult = {
  context: typeof ADMIN_INSPECTION_CONTEXT;
  runtimeVariantId: string;
  blockType: BlockType;
  variantDefinition: VariantDefinition | null;
  supported: boolean;
  unsupportedReason: string | null;
  fixture: CandidateInspectionFixture;
  preview: CandidatePreviewInspection;
  copy: CandidateCopyInspection;
  validator: CandidateValidatorInspection;
  resolvedQualityStatus: StyleVariantQualityStatus;
};

export type RunCandidateInspectionResult =
  | {
      ok: true;
      inspection: CandidateInspectionResult;
      validationRunIds: string[];
      qualityStatus: StyleVariantQualityStatus;
      previousQualityStatus: StyleVariantQualityStatus;
    }
  | { ok: false; code: string; message: string };

export type ManualPasteQaEvidenceInput = {
  runtimeVariantId: string;
  sourceLabel: string;
  notes?: string;
  sourceUrl?: string;
  status: "not_run" | "pass" | "failed";
  actor: string;
};

export type ManualPasteQaEvidenceResult =
  | {
      ok: true;
      evidenceId: string;
      qualityStatus: StyleVariantQualityStatus;
    }
  | { ok: false; code: string; message: string };

export type PasteQaEvidenceMetadata = {
  notes?: string;
  pasteQaStatus: "not_run" | "pass" | "failed";
  actor: string;
  createdFrom: "s10_story_010";
  validationRunIds?: string[];
};

export const PASTE_QA_EVIDENCE_TYPE: StyleVariantEvidenceType = "paste_qa";
