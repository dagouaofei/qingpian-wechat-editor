import type { CssFallbackPolicyEntry, FallbackPolicy } from "./wechat-compat-types";

/** @see docs/architecture/wechat-safe-html-css-contract.md §8 */
export const WECHAT_CONTRACT_V1_CSS_FALLBACK_POLICIES: CssFallbackPolicyEntry[] =
  [
    {
      id: "fallback-linear-gradient",
      capability: "linear-gradient",
      fromLevel: "yellow",
      fallbackDescription: "Solid background-color or border-bottom accent strip",
      fallbackTargets: ["background-color", "border-bottom"],
    },
    {
      id: "fallback-box-shadow",
      capability: "box-shadow",
      fromLevel: "yellow",
      fallbackDescription: "Border or light background-color",
      fallbackTargets: ["border", "background-color"],
    },
    {
      id: "fallback-border-radius",
      capability: "border-radius",
      fromLevel: "yellow",
      fallbackDescription: "Square corners (remove radius)",
      fallbackTargets: [],
    },
    {
      id: "fallback-table-layout",
      capability: "table",
      fromLevel: "yellow",
      fallbackDescription: "Flow layout with section / p / span",
      fallbackTargets: ["display:block", "display:inline-block"],
    },
    {
      id: "fallback-complex-display",
      capability: "complex-display",
      fromLevel: "yellow",
      fallbackDescription: "block or inline-block",
      fallbackTargets: ["display:block", "display:inline-block"],
    },
    {
      id: "fallback-box-decoration-break",
      capability: "box-decoration-break",
      fromLevel: "yellow",
      fallbackDescription: "Remove; pair with gradient fallback",
      fallbackTargets: ["background-color"],
    },
    {
      id: "fallback-opacity",
      capability: "opacity",
      fromLevel: "yellow",
      fallbackDescription: "Opaque color / background-color",
      fallbackTargets: ["color", "background-color"],
    },
    {
      id: "fallback-background-shorthand",
      capability: "background",
      fromLevel: "yellow",
      fallbackDescription: "background-color only",
      fallbackTargets: ["background-color"],
    },
  ];

export function getCssFallbackPolicyById(
  id: string,
): CssFallbackPolicyEntry | undefined {
  return WECHAT_CONTRACT_V1_CSS_FALLBACK_POLICIES.find(
    (entry) => entry.id === id,
  );
}

export function buildContractV1FallbackPolicy(): FallbackPolicy {
  return {
    onForbiddenCss: "reject",
    onRiskyCss: "warn",
    previewOnlyAllowed: false,
    notes:
      "Contract v1: forbidden=Red reject; risky=Yellow warn unless variant waiver; " +
      "fallback via same resolveStyle/copy renderer chain (no second style system)",
  };
}
