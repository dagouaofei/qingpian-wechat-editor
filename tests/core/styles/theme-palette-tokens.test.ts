import { describe, expect, it } from "vitest";

import {
  DEFAULT_THEME_PALETTE,
  resolveThemePaletteTokens,
} from "@/core/styles/theme-palette-tokens";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles/variants";
import { getThemeById } from "@/core/styles/registry";

describe("resolveThemePaletteTokens", () => {
  const registry = createFirstWaveRequiredVariantRegistry();

  it("returns default palette for default theme", () => {
    const theme = getThemeById(registry, "businessBlue")!;
    const palette = resolveThemePaletteTokens(theme.tokens);

    expect(palette.textAccent).toBe("#2563eb");
    expect(palette.bgSoft).toBe("#f1f5f9");
  });

  it("returns warm palette for warm-editorial theme", () => {
    const theme = getThemeById(registry, "creamOrange")!;
    const palette = resolveThemePaletteTokens(theme.tokens);

    expect(palette.textDefault).toBe("#292524");
    expect(palette.textAccent).toBe("#ea580c");
    expect(palette.bgBandBlue).toBe("#fffdfb");
    expect(palette).not.toEqual(DEFAULT_THEME_PALETTE);
  });
});
