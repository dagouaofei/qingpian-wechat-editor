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
    const theme = getThemeById(registry, "default")!;
    const palette = resolveThemePaletteTokens(theme.tokens);

    expect(palette.textAccent).toBe("#576b95");
    expect(palette.bgSoft).toBe("#f9f9f9");
  });

  it("returns warm palette for warm-editorial theme", () => {
    const theme = getThemeById(registry, "warm-editorial")!;
    const palette = resolveThemePaletteTokens(theme.tokens);

    expect(palette.textDefault).toBe("#3d2c1e");
    expect(palette.textAccent).toBe("#c45c26");
    expect(palette.bgBandBlue).toBe("#fff7ed");
    expect(palette).not.toEqual(DEFAULT_THEME_PALETTE);
  });
});
