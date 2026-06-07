import type { BlockType, CopySafetyTier } from "@prisma/client";

import type {
  HarvestIssue,
  HarvestIssueSeverity,
  HarvestLossReportEntry,
} from "./harvest-compatibility";
import type { JsonValue } from "../types";

export const HTML_HARVEST_PARSER_VERSION = "s10_html_harvest_v1";
export const HTML_HARVEST_SOURCE_COHORT = "s10_html_harvest_v1";
export const HTML_HARVEST_MAX_RAW_HTML_LENGTH = 100_000;

export type HtmlHarvestSourcePlatform =
  | "wechat_mp"
  | "135_editor"
  | "xiumi"
  | "dom_html"
  | "unknown";

export type HtmlHarvestDetectableBlockType = "heading" | "info_card";
export type HtmlHarvestDetectedBlockType = HtmlHarvestDetectableBlockType | "unknown";

export type HtmlHarvestSourceInput = {
  sourceLabel: string;
  sourceUrl?: string;
  sourcePlatform?: HtmlHarvestSourcePlatform;
  notes?: string;
};

export type HtmlHarvestCandidateDraft = {
  runtimeVariantId: string;
  blockType: HtmlHarvestDetectableBlockType;
  styleFamily: string;
  label: string;
  description?: string;
  sampleText: string;
  definitionJson: JsonValue;
  componentProtocolJson?: JsonValue;
  compatibilityJson?: JsonValue;
  copySafety: CopySafetyTier;
  sourceChecksum: string;
  detectedBlockType: HtmlHarvestDetectedBlockType;
  selectedBlockType: HtmlHarvestDetectableBlockType;
  sanitizedHtml: string;
  rawHtmlLength: number;
};

export type CreateHtmlHarvestCandidateInput = HtmlHarvestSourceInput & {
  rawHtml: string;
  blockType?: HtmlHarvestDetectableBlockType;
  actor: string;
};

export type CreateHtmlHarvestCandidateResult =
  | {
      ok: true;
      action: "created" | "reused";
      runtimeVariantId: string;
      draft: HtmlHarvestCandidateDraft;
      issues?: HarvestIssue[];
      lossReport?: HarvestLossReportEntry[];
    }
  | {
      ok: false;
      code: string;
      message: string;
      issues?: HarvestIssue[];
      lossReport?: HarvestLossReportEntry[];
      blocking?: boolean;
    };

export type PreviewHtmlHarvestInput = {
  rawHtml: string;
  blockType?: HtmlHarvestDetectableBlockType;
};

export type HtmlHarvestDraftPreview = Pick<
  HtmlHarvestCandidateDraft,
  | "runtimeVariantId"
  | "label"
  | "blockType"
  | "styleFamily"
  | "sampleText"
  | "detectedBlockType"
  | "selectedBlockType"
>;

export type PreviewHtmlHarvestResult =
  | {
      ok: true;
      detectedBlockType: HtmlHarvestDetectedBlockType;
      effectiveBlockType: HtmlHarvestDetectableBlockType | null;
      draftPreview: HtmlHarvestDraftPreview | null;
      issues: HarvestIssue[];
      warnings: HarvestIssue[];
      lossReport: HarvestLossReportEntry[];
      canCreateCandidate: boolean;
      partial: boolean;
      severity: HarvestIssueSeverity | null;
      blocking: false;
      guidance?: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
      detectedBlockType?: HtmlHarvestDetectedBlockType;
      issues?: HarvestIssue[];
      lossReport?: HarvestLossReportEntry[];
      blocking?: boolean;
    };

export function isHarvestBlockType(value: string): value is HtmlHarvestDetectableBlockType {
  return value === "heading" || value === "info_card";
}

export function toPrismaBlockType(blockType: HtmlHarvestDetectableBlockType): BlockType {
  return blockType;
}
