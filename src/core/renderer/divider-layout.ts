import type { CopySafety } from "@/core/styles";

import type { ResolvedBlockStyleView } from "./types";

export type DividerLayoutKind = "simple_line" | "dotted_line" | "section_space";

import { DIVIDER_VARIANT_LAYOUT } from "./expansion-layout-maps";

export type DividerSpacing = {
  marginBlock: string;
  sectionSpaceHeight: string;
};

export function resolveDividerLayout(
  variantId: string,
): DividerLayoutKind | undefined {
  return DIVIDER_VARIANT_LAYOUT[variantId];
}

export function resolveDividerSpacing(
  resolved: ResolvedBlockStyleView,
): DividerSpacing {
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    marginBlock: variantSpacing ?? "24px",
    sectionSpaceHeight: variantSpacing ?? "32px",
  };
}

export function resolveDividerCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return (
    resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety
  );
}
