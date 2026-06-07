import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import type { BlockType } from "@/core/blocks";
import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { applyWechatCompatibilityForHarvest } from "@/core/wechat-compatibility";

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
import {
  getHarvestWechatCompatibilityMode,
  type HarvestWechatCompatibilityMode,
} from "./harvest-compatibility-mode";

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
  encoderLossReport: HarvestLossReportEntry[];
  compatibilityTransformLossReport: HarvestLossReportEntry[];
  canCreateCandidate: boolean;
  severity: ReturnType<typeof highestHarvestSeverity>;
  wechatCompatibilityMode: HarvestWechatCompatibilityMode;
};

export type HarvestExtractFailure = {
  ok: false;
  code: string;
  message: string;
  issues: HarvestIssue[];
  lossReport: HarvestLossReportEntry[];
  encoderLossReport: HarvestLossReportEntry[];
  compatibilityTransformLossReport: HarvestLossReportEntry[];
  blocking: true;
  wechatCompatibilityMode: HarvestWechatCompatibilityMode;
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
  wechatCompatibilityMode?: HarvestWechatCompatibilityMode;
};

export function extractHarvestCandidateShared(
  input: BuildHarvestExtractInput,
): HarvestExtractResult {
  const wechatCompatibilityMode =
    input.wechatCompatibilityMode ?? getHarvestWechatCompatibilityMode();
  const { transform, validation } = applyWechatCompatibilityForHarvest(
    input.sanitizedHtml,
    wechatCompatibilityMode,
  );

  const compatibilityTransformLossReport =
    wechatCompatibilityMode === "enforce" ? mapTransformToLossReport(transform) : [];
  const compatibilityIssues =
    wechatCompatibilityMode === "off"
      ? []
      : mapWechatIssuesToHarvestIssues(validation.issues);

  const encoded = encodeHtmlToVariantDsl({
    html: input.sanitizedHtml,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType as BlockType,
    label: input.label,
    family: input.styleFamily,
    copySafety: "strict",
    wechatCompatibilityMode,
  });

  const encoderLossReport: HarvestLossReportEntry[] =
    encoded.ok && encoded.sidecar
      ? encoded.sidecar.encoderLossReport.map((entry) => ({
          code: entry.code,
          message: entry.message,
        }))
      : [];

  const encoderIssues = mapEncoderIssuesToHarvestIssues(encoded.issues);
  const issues = mergeHarvestIssues(compatibilityIssues, encoderIssues);
  const warnings = issues.filter((issue) => issue.severity === "warning" || issue.severity === "info");
  const risks = issues.filter((issue) => issue.severity === "risk");
  const blockingIssues = issues.filter((issue) => issue.severity === "blocking");
  const lossReport = [...encoderLossReport, ...compatibilityTransformLossReport];

  if (!encoded.ok) {
    return {
      ok: false,
      code: "encode_blocked",
      message: blockingIssues[0]?.message ?? encoded.issues[0]?.message ?? "HTML encode blocked",
      issues,
      lossReport,
      encoderLossReport,
      compatibilityTransformLossReport,
      blocking: true,
      wechatCompatibilityMode,
    };
  }

  const definitionJson = encoded.value as JsonValue;

  const compatibilityStatus =
    wechatCompatibilityMode === "off"
      ? "skipped"
      : validation.valid
        ? "pass"
        : "failed";

  const compatibilityJson = {
    copySafety: "strict",
    dslVersion: VARIANT_DSL_VERSION,
    wechatCompatibilityMode,
    compatibilityStatus,
    compatibilityIssues,
    encoderLossReport,
    compatibilityTransformLossReport,
    traceId: encoded.sidecar?.traceId ?? null,
    harvestCompatibility: {
      issues,
      encoderLossReport,
      compatibilityTransformLossReport,
      severity: highestHarvestSeverity(issues),
      partial:
        wechatCompatibilityMode === "enforce"
          ? !validation.valid || risks.length > 0
          : wechatCompatibilityMode === "report"
            ? risks.length > 0 || warnings.length > 0
            : false,
      harvestStage: "detect",
      wechatCompatibilityMode,
    },
  } as JsonValue;

  const sourceChecksum = stableJsonChecksum({
    definition: definitionJson,
    componentProtocol: input.componentProtocolJson,
    compatibility: compatibilityJson,
    sanitizedHtml: input.sanitizedHtml,
  });

  const partial =
    wechatCompatibilityMode === "enforce"
      ? !validation.valid || risks.length > 0
      : wechatCompatibilityMode === "report"
        ? risks.length > 0 || warnings.length > 0
        : false;

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
    encoderLossReport,
    compatibilityTransformLossReport,
    canCreateCandidate: canCreateHarvestCandidate(issues),
    severity: highestHarvestSeverity(issues),
    wechatCompatibilityMode,
  };
}
