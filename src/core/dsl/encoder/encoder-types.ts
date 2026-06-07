import type { BlockType } from "@/core/blocks";
import type { HarvestWechatCompatibilityMode } from "@/core/wechat-compatibility/harvest-compat-mode";
import type { VariantDslV1 } from "../runtime/dsl-types";

export type EncoderIssue = {
  code: string;
  message: string;
};

export type EncoderResult<T> =
  | { ok: true; value: T; issues: EncoderIssue[] }
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
