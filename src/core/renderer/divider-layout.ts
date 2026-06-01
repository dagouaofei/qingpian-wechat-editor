import type { CopySafety } from "@/core/styles";

import type { ResolvedBlockStyleView } from "./types";

export type DividerLayoutKind = "simple_line" | "dotted_line" | "section_space";

const VARIANT_LAYOUT_MAP: Record<string, DividerLayoutKind> = {
  divider_simple_line: "simple_line",
  divider_dotted_line: "dotted_line",
  divider_section_space: "section_space",
};

export type DividerSpacing = {
  marginBlock: string;
  sectionSpaceHeight: string;
};

export function resolveDividerLayout(
  variantId: string,
): DividerLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
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
