/**
 * Per-preset typography aligned with miaopian-demo stylePresets tokens.
 */

import type { MiaopianPresetId } from "./miaopian-preset-bundles";

export type MiaopianPresetTypography = {
  fontFamily: string;
  titleFontSize: string;
  titleLineHeight: string;
  titleFontWeight: string;
  headingFontSize: string;
  headingLineHeight: string;
  headingFontWeight: string;
  bodyFontSize: string;
  bodyLineHeight: string;
};

export const MIAOPIAN_PRESET_TYPOGRAPHY: Record<MiaopianPresetId, MiaopianPresetTypography> = {
  business: {
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    titleFontSize: "24px",
    titleLineHeight: "1.35",
    titleFontWeight: "700",
    headingFontSize: "18px",
    headingLineHeight: "1.5",
    headingFontWeight: "600",
    bodyFontSize: "16px",
    bodyLineHeight: "1.75",
  },
  warm: {
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    titleFontSize: "25px",
    titleLineHeight: "1.36",
    titleFontWeight: "700",
    headingFontSize: "17px",
    headingLineHeight: "1.52",
    headingFontWeight: "600",
    bodyFontSize: "16px",
    bodyLineHeight: "1.9",
  },
  magazine: {
    fontFamily:
      '"Songti SC", "Noto Serif SC", "STSong", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Georgia, serif',
    titleFontSize: "30px",
    titleLineHeight: "1.18",
    titleFontWeight: "300",
    headingFontSize: "17px",
    headingLineHeight: "1.48",
    headingFontWeight: "500",
    bodyFontSize: "16px",
    bodyLineHeight: "1.82",
  },
  keynote: {
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    titleFontSize: "31px",
    titleLineHeight: "1.1",
    titleFontWeight: "800",
    headingFontSize: "16px",
    headingLineHeight: "1.42",
    headingFontWeight: "600",
    bodyFontSize: "16px",
    bodyLineHeight: "1.82",
  },
  xiaohongshu: {
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    titleFontSize: "25px",
    titleLineHeight: "1.36",
    titleFontWeight: "700",
    headingFontSize: "16px",
    headingLineHeight: "1.5",
    headingFontWeight: "600",
    bodyFontSize: "16px",
    bodyLineHeight: "1.9",
  },
  dedao: {
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    titleFontSize: "24px",
    titleLineHeight: "1.32",
    titleFontWeight: "700",
    headingFontSize: "16px",
    headingLineHeight: "1.4",
    headingFontWeight: "600",
    bodyFontSize: "16px",
    bodyLineHeight: "1.85",
  },
};

export function typographyForMiaopianPreset(
  presetId: string | undefined,
): MiaopianPresetTypography {
  if (presetId && presetId in MIAOPIAN_PRESET_TYPOGRAPHY) {
    return MIAOPIAN_PRESET_TYPOGRAPHY[presetId as MiaopianPresetId];
  }
  return MIAOPIAN_PRESET_TYPOGRAPHY.business;
}
