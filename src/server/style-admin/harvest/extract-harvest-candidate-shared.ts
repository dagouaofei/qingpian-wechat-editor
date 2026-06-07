import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import type { BlockType } from "@/core/blocks";
import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { normalizeAndValidateWechatHtml } from "@/core/wechat-compatibility";

import type { JsonValue } from "../types";
import { stableJsonChecksum } from "../import/checksum";
import type { HtmlHarvestDetectableBlockType } from "./html-harvest-types";
import {
  canCreateHarvestCandidate,
  highestHarvestSeverity,
  mapEncoderIssuesToHarvestIssues,
  mapTransformToLossReport,
  mapWechatIssuesToHarvestIssues,
  mergeHarvestIssues,
  type HarvestIssue,
  type HarvestLossReportEntry,
} from "./harvest-compatibility";

export type HarvestExtractSuccess = {
  ok: true;
  partial: boolean;
  runtimeVariantId: string;
  blockType: HtmlHarvestDetectableBlockType;
  styleFamily: string;
  label: string;
  description: string;
  sampleText: string;
  definitionJson: JsonValue;
  componentProtocolJson: JsonValue;
  compatibilityJson: JsonValue;
  copySafety: "strict";
  sourceChecksum: string;
  issues: HarvestIssue[];
  warnings: HarvestIssue[];
  lossReport: HarvestLossReportEntry[];
  canCreateCandidate: boolean;
  severity: ReturnType<typeof highestHarvestSeverity>;
};

export type HarvestExtractFailure = {
  ok: false;
  code: string;
  message: string;
  issues: HarvestIssue[];
  lossReport: HarvestLossReportEntry[];
  blocking: true;
};

export type HarvestExtractResult = HarvestExtractSuccess | HarvestExtractFailure;

type BuildHarvestExtractInput = {
  sanitizedHtml: string;
  runtimeVariantId: string;
  blockType: HtmlHarvestDetectableBlockType;
  label: string;
  description: string;
  sampleText: string;
  styleFamily: string;
  componentProtocolJson: JsonValue;
};

export function extractHarvestCandidateShared(
  input: BuildHarvestExtractInput,
): HarvestExtractResult {
  const { transform, validation } = normalizeAndValidateWechatHtml(input.sanitizedHtml);
  const lossReport = mapTransformToLossReport(transform);
  const compatibilityIssues = mapWechatIssuesToHarvestIssues(validation.issues);

  const encoded = encodeHtmlToVariantDsl({
    html: input.sanitizedHtml,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType as BlockType,
    label: input.label,
    family: input.styleFamily,
    copySafety: "strict",
  });

  const encoderIssues = mapEncoderIssuesToHarvestIssues(encoded.issues);
  const issues = mergeHarvestIssues(compatibilityIssues, encoderIssues);
  const warnings = issues.filter((issue) => issue.severity === "warning" || issue.severity === "info");
  const risks = issues.filter((issue) => issue.severity === "risk");
  const blockingIssues = issues.filter((issue) => issue.severity === "blocking");

  if (!encoded.ok) {
    return {
      ok: false,
      code: "encode_blocked",
      message: blockingIssues[0]?.message ?? encoded.issues[0]?.message ?? "HTML encode blocked",
      issues,
      lossReport,
      blocking: true,
    };
  }

  const definitionJson = {
    ...encoded.value,
    harvestMeta: {
      sampleText: input.sampleText,
      parserVersion: "s10_html_harvest_v1_dsl",
      encoderIssues: encoded.issues,
      compatibilityIssues: issues,
      lossReport,
    },
  } as JsonValue;

  const compatibilityJson = {
    copySafety: "strict",
    dslVersion: VARIANT_DSL_VERSION,
    encoderIssueCount: encoded.issues.length,
    compatibilityIssueCount: issues.length,
    harvestCompatibility: {
      issues,
      lossReport,
      severity: highestHarvestSeverity(issues),
      partial: !validation.valid || risks.length > 0,
      harvestStage: "detect",
    },
  } as JsonValue;

  const sourceChecksum = stableJsonChecksum({
    definition: definitionJson,
    componentProtocol: input.componentProtocolJson,
    compatibility: compatibilityJson,
    sanitizedHtml: input.sanitizedHtml,
  });

  const partial = !validation.valid || risks.length > 0;

  return {
    ok: true,
    partial,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    styleFamily: input.styleFamily,
    label: input.label,
    description: input.description,
    sampleText: input.sampleText,
    definitionJson,
    componentProtocolJson: input.componentProtocolJson,
    compatibilityJson,
    copySafety: "strict",
    sourceChecksum,
    issues,
    warnings,
    lossReport,
    canCreateCandidate: canCreateHarvestCandidate(issues),
    severity: highestHarvestSeverity(issues),
  };
}
