import {
  typographyForMiaopianPreset,
  type MiaopianPresetTypography,
} from "@/config/miaopian-typography";
import { resolveMiaopianPresetId } from "@/config/miaopian-preset-bundles";

/**
 * Formats a font stack for use inside HTML style="..." attributes.
 * Uses single-quoted family names so double-quoted style attributes stay valid.
 */
export function formatFontFamilyForInlineStyle(fontFamily: string): string {
  return fontFamily
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const bare = part.replace(/^['"]|['"]$/g, "");
      return /[\s]/.test(bare) ? `'${bare}'` : bare;
    })
    .join(", ");
}

export function copyTypographyForPreset(
  presetId: string,
): MiaopianPresetTypography & { fontFamilyInline: string } {
  const resolved = resolveMiaopianPresetId(presetId);
  const typography = typographyForMiaopianPreset(resolved);
  return {
    ...typography,
    fontFamilyInline: formatFontFamilyForInlineStyle(typography.fontFamily),
  };
}

export function copyBodyFontExtras(presetId: string): {
  fontFamily: string;
} {
  return { fontFamily: copyTypographyForPreset(presetId).fontFamilyInline };
}
