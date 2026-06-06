import {
  STYLE_LIBRARY_PALETTE_ASSETS,
  STYLE_LIBRARY_PALETTE_METADATA,
  type PaletteMetadata,
} from "./palette-assets";
import {
  STYLE_LIBRARY_RULE_ASSETS,
  STYLE_LIBRARY_RULE_METADATA,
  type RuleMetadata,
  type RuleSeverity,
} from "./rule-assets";
import {
  STYLE_LIBRARY_STYLE_DEFINITIONS,
  type StyleDefinition,
  type StyleLocalizedText,
} from "./style-assets";
import type {
  StyleLibraryManifest,
  StyleLibraryPaletteAsset,
  StyleLibraryRuleAsset,
  StyleLibraryVariantAsset,
} from "./types";

export type StylePaletteRuleSummaryCounts = {
  styleCount: number;
  paletteCount: number;
  ruleCount: number;
  copySafeRuleCount: number;
  selectionRuleCount: number;
  stylesReadyForExpansion: number;
  stylesMissingPalette: number;
  rulesWithWarnings: number;
};

export type VariantStyleAssociation = {
  assetId: string;
  runtimeVariantId: string;
  linkedStyle: StyleDefinition | null;
  linkedStyleLabel: string | null;
  linkedPalettes: PaletteMetadata[];
  linkedRules: RuleMetadata[];
  hasStyleLink: boolean;
  hasPaletteLink: boolean;
  hasRuleLink: boolean;
};

export type StylePaletteRuleGraph = {
  styles: StyleDefinition[];
  palettes: PaletteMetadata[];
  rules: RuleMetadata[];
  paletteAssets: StyleLibraryPaletteAsset[];
  ruleAssets: StyleLibraryRuleAsset[];
};

export function localizeText(text: StyleLocalizedText, locale: "zh" | "en"): string {
  return text[locale];
}

export function localizeList(list: { zh: string[]; en: string[] }, locale: "zh" | "en"): string[] {
  return list[locale];
}

export function getStyleLibraryStyleDefinitions(): StyleDefinition[] {
  return [...STYLE_LIBRARY_STYLE_DEFINITIONS];
}

export function getStyleLibraryPaletteAssets(): StyleLibraryPaletteAsset[] {
  return [...STYLE_LIBRARY_PALETTE_ASSETS];
}

export function getStyleLibraryRuleAssets(): StyleLibraryRuleAsset[] {
  return [...STYLE_LIBRARY_RULE_ASSETS];
}

export function getPaletteMetadataById(paletteId: string): PaletteMetadata | undefined {
  return STYLE_LIBRARY_PALETTE_METADATA[paletteId];
}

export function getRuleMetadataById(ruleId: string): RuleMetadata | undefined {
  return STYLE_LIBRARY_RULE_METADATA[ruleId];
}

export function getStyleDefinitionById(styleId: string): StyleDefinition | undefined {
  return STYLE_LIBRARY_STYLE_DEFINITIONS.find((style) => style.styleId === styleId);
}

export function getStyleForVariantAssetId(assetId: string): StyleDefinition | undefined {
  return STYLE_LIBRARY_STYLE_DEFINITIONS.find((style) =>
    style.linkedVariantAssetIds.includes(assetId),
  );
}

export function getPalettesForVariantAssetId(assetId: string): PaletteMetadata[] {
  const style = getStyleForVariantAssetId(assetId);
  if (!style) {
    return Object.values(STYLE_LIBRARY_PALETTE_METADATA).filter((palette) =>
      palette.linkedVariantAssetIds.includes(assetId),
    );
  }
  return style.linkedPaletteIds
    .map((paletteId) => STYLE_LIBRARY_PALETTE_METADATA[paletteId])
    .filter((palette): palette is PaletteMetadata => palette !== undefined);
}

export function getRulesForVariantAssetId(assetId: string): RuleMetadata[] {
  const style = getStyleForVariantAssetId(assetId);
  const ruleIds = new Set<string>();
  if (style) {
    for (const ruleId of style.linkedRuleIds) {
      ruleIds.add(ruleId);
    }
  }
  for (const rule of Object.values(STYLE_LIBRARY_RULE_METADATA)) {
    if (rule.linkedVariantAssetIds.includes(assetId)) {
      ruleIds.add(rule.ruleId);
    }
  }
  return [...ruleIds]
    .map((ruleId) => STYLE_LIBRARY_RULE_METADATA[ruleId])
    .filter((rule): rule is RuleMetadata => rule !== undefined);
}

export function buildVariantStyleAssociation(
  asset: StyleLibraryVariantAsset,
): VariantStyleAssociation {
  const linkedStyle = getStyleForVariantAssetId(asset.assetId) ?? null;
  const linkedPalettes = getPalettesForVariantAssetId(asset.assetId);
  const linkedRules = getRulesForVariantAssetId(asset.assetId);

  return {
    assetId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    linkedStyle,
    linkedStyleLabel: linkedStyle?.name.zh ?? null,
    linkedPalettes,
    linkedRules,
    hasStyleLink: linkedStyle !== null,
    hasPaletteLink: linkedPalettes.length > 0,
    hasRuleLink: linkedRules.length > 0,
  };
}

export function buildStylePaletteRuleGraph(
  _manifest: StyleLibraryManifest = {} as StyleLibraryManifest,
): StylePaletteRuleGraph {
  return {
    styles: getStyleLibraryStyleDefinitions(),
    palettes: Object.values(STYLE_LIBRARY_PALETTE_METADATA),
    rules: Object.values(STYLE_LIBRARY_RULE_METADATA),
    paletteAssets: getStyleLibraryPaletteAssets(),
    ruleAssets: getStyleLibraryRuleAssets(),
  };
}

export function buildStylePaletteRuleSummaryCounts(
  _manifest: StyleLibraryManifest = {} as StyleLibraryManifest,
): StylePaletteRuleSummaryCounts {
  const styles = getStyleLibraryStyleDefinitions();
  const rules = Object.values(STYLE_LIBRARY_RULE_METADATA);

  return {
    styleCount: styles.length,
    paletteCount: getStyleLibraryPaletteAssets().length,
    ruleCount: rules.length,
    copySafeRuleCount: rules.filter((rule) => rule.ruleType === "copy_safe").length,
    selectionRuleCount: rules.filter((rule) => rule.ruleType === "selection").length,
    stylesReadyForExpansion: styles.filter((style) => style.readyForExpansion).length,
    stylesMissingPalette: styles.filter((style) => style.linkedPaletteIds.length === 0).length,
    rulesWithWarnings: rules.filter((rule) => rule.severity === "warning").length,
  };
}

export function isRuleWithWarning(severity: RuleSeverity): boolean {
  return severity === "warning";
}

export type { PaletteMetadata, RuleMetadata, RuleSeverity, StyleDefinition, StyleLocalizedText };
