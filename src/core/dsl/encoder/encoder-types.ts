import type { BlockType } from "@/core/blocks";
import type { HarvestWechatCompatibilityMode } from "@/core/wechat-compatibility/harvest-compat-mode";
import type { VariantDslV1 } from "../runtime/dsl-types";
import type { TraceLossReportItem } from "../runtime/dsl-trace-types";

export type EncoderIssue = {
  code: string;
  message: string;
};

export type EncoderEncodeSidecar = {
  traceId: string;
  encoderLossReport: TraceLossReportItem[];
};

export type EncoderResult<T> =
  | { ok: true; value: T; issues: EncoderIssue[]; sidecar?: EncoderEncodeSidecar }
  | { ok: false; issues: EncoderIssue[] };

export type HtmlToVariantDslInput = {
  html: string;
  runtimeVariantId: string;
  blockType: BlockType;
  label?: string;
  family?: string;
  copySafety?: VariantDslV1["copySafety"];
  /** Harvest diagnostic mode; defaults to enforce for non-harvest encoder callers. */
  wechatCompatibilityMode?: HarvestWechatCompatibilityMode;
};
