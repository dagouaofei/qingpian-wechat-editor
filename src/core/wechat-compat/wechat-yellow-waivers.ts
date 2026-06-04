import type {
  CssClassificationContext,
  WaiverLookupResult,
  YellowCapabilityWaiver,
} from "./wechat-compat-types";
import { WECHAT_SAFE_CONTRACT_VERSION_ID } from "./contract-version";
import { getCssFallbackPolicyById } from "./wechat-fallback-policy";

/**
 * S7 heading publish paste QA — must not transfer to other variants (DECISION-089).
 * @see docs/agile/paste-qa/heading-publish-8.md
 */
export const HEADING_HIGHLIGHT_MARKER_WAIVER: YellowCapabilityWaiver = {
  evidenceId: "PASTE-HEADING-HIGHLIGHT-20260603",
  contractVersionId: WECHAT_SAFE_CONTRACT_VERSION_ID,
  blockType: "heading",
  variantId: "heading_highlight_marker",
  cssCapabilities: [
    "linear-gradient",
    "box-decoration-break",
    "-webkit-box-decoration-break",
    "background",
  ],
  htmlDomContext: "section > h3[style*=inline]",
  fallbackPolicyId: "fallback-linear-gradient",
  verifiedAt: "2026-06-03",
  matrixRowId: "TBD-S8-STORY-005",
  allowedInDefaultPreset: true,
  nonTransferable: true,
  reason:
    "WeChat MP paste 8/8 PASS for heading publish pool only; gradient must not globalize",
};

export const WECHAT_CONTRACT_V1_YELLOW_WAIVERS: YellowCapabilityWaiver[] = [
  HEADING_HIGHLIGHT_MARKER_WAIVER,
];

export function findYellowWaiverForVariant(
  variantId: string,
  blockType?: YellowCapabilityWaiver["blockType"],
): YellowCapabilityWaiver | undefined {
  return WECHAT_CONTRACT_V1_YELLOW_WAIVERS.find(
    (w) =>
      w.variantId === variantId &&
      (blockType === undefined || w.blockType === blockType),
  );
}

export function findYellowWaiverForCapability(
  capability: string,
  context: CssClassificationContext,
): WaiverLookupResult {
  const normalized = capability.trim().toLowerCase();
  for (const waiver of WECHAT_CONTRACT_V1_YELLOW_WAIVERS) {
    if (context.variantId && waiver.variantId !== context.variantId) {
      continue;
    }
    if (context.blockType && waiver.blockType !== context.blockType) {
      continue;
    }
    const matched = waiver.cssCapabilities.find(
      (c) => normalized.includes(c.toLowerCase()) || c.toLowerCase() === normalized,
    );
    if (matched) {
      return { waiver, matchedCapability: matched };
    }
  }
  return null;
}

export function isYellowCapabilityWaived(
  capability: string,
  context: CssClassificationContext,
): boolean {
  return findYellowWaiverForCapability(capability, context) !== null;
}

export function getWaiverFallbackPolicyId(
  waiver: YellowCapabilityWaiver,
): string {
  return waiver.fallbackPolicyId;
}

export function resolveWaiverFallbackDescription(
  waiver: YellowCapabilityWaiver,
): string | undefined {
  return getCssFallbackPolicyById(waiver.fallbackPolicyId)?.fallbackDescription;
}
