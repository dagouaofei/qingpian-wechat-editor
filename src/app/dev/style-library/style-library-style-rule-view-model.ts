import {
  STYLE_LIBRARY_MANIFEST,
  STYLE_LIBRARY_PALETTE_METADATA,
  STYLE_LIBRARY_RULE_METADATA,
  buildStylePaletteRuleSummaryCounts,
  buildVariantStyleAssociation,
  getStyleLibrarySeedAssets,
  getStyleLibraryStyleDefinitions,
  localizeList,
  localizeText,
  type PaletteMetadata,
  type RuleMetadata,
  type StyleDefinition,
  type StylePaletteRuleSummaryCounts,
  type StyleLibraryManifest,
} from "@/core/style-library";

import {
  getStyleLibraryUiCopy,
  type StyleLibraryDisabledActionCopy,
  type StyleLibraryLocale,
} from "./style-library-i18n";

export type StyleLibraryStyleCard = {
  styleId: string;
  name: string;
  description: string;
  intendedUseCases: string[];
  targetArticleTypes: string[];
  tone: string;
  density: string;
  linkedPaletteLabels: string[];
  linkedPaletteIds: string[];
  linkedVariantAssetIds: string[];
  linkedRuleLabels: string[];
  linkedRuleIds: string[];
  s10ExpansionHint: string;
  readyForExpansion: boolean;
  lifecycle: string;
  operatorNotes: string;
};

export type StyleLibraryPaletteCard = {
  paletteId: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  copySafeNotes: string;
  contrastNotes: string;
  compatibleStyleLabels: string[];
  compatibleStyleIds: string[];
  linkedVariantAssetIds: string[];
  operatorNotes: string;
};

export type StyleLibraryRuleCard = {
  ruleId: string;
  ruleType: string;
  ruleTypeLabel: string;
  name: string;
  description: string;
  severity: string;
  severityLabel: string;
  operatorSummary: string;
  appliesTo: string;
  relatedContract: string;
  linkedStyleIds: string[];
  linkedVariantAssetIds: string[];
  evidenceRefs: string[];
  relatedStory: string | null;
  hasWarning: boolean;
};

export type StyleLibraryCandidateStyleLinks = {
  assetId: string;
  linkedStyleName: string | null;
  linkedStyleId: string | null;
  linkedPaletteNames: string[];
  linkedPaletteIds: string[];
  linkedRuleNames: string[];
  linkedRuleIds: string[];
  unlinkedStyleLabel: string;
  unlinkedPaletteLabel: string;
  unlinkedRuleLabel: string;
};

function buildStyleCard(style: StyleDefinition, locale: StyleLibraryLocale): StyleLibraryStyleCard {
  return {
    styleId: style.styleId,
    name: localizeText(style.name, locale),
    description: localizeText(style.description, locale),
    intendedUseCases: localizeList(style.intendedUseCases, locale),
    targetArticleTypes: style.targetArticleTypes,
    tone: localizeText(style.tone, locale),
    density: localizeText(style.density, locale),
    linkedPaletteLabels: style.linkedPaletteIds,
    linkedPaletteIds: style.linkedPaletteIds,
    linkedVariantAssetIds: style.linkedVariantAssetIds,
    linkedRuleLabels: style.linkedRuleIds,
    linkedRuleIds: style.linkedRuleIds,
    s10ExpansionHint: localizeText(style.s10ExpansionHints, locale),
    readyForExpansion: style.readyForExpansion,
    lifecycle: style.lifecycle,
    operatorNotes: localizeText(style.operatorNotes, locale),
  };
}

function buildPaletteCard(
  palette: PaletteMetadata,
  locale: StyleLibraryLocale,
): StyleLibraryPaletteCard {
  return {
    paletteId: palette.paletteId,
    name: localizeText(palette.name, locale),
    description: localizeText(palette.description, locale),
    primaryColor: palette.primaryColor,
    accentColor: palette.accentColor,
    backgroundColor: palette.backgroundColor,
    textColor: palette.textColor,
    borderColor: palette.borderColor,
    copySafeNotes: localizeText(palette.copySafeNotes, locale),
    contrastNotes: localizeText(palette.contrastNotes, locale),
    compatibleStyleLabels: palette.compatibleStyleIds,
    compatibleStyleIds: palette.compatibleStyleIds,
    linkedVariantAssetIds: palette.linkedVariantAssetIds,
    operatorNotes: localizeText(palette.operatorNotes, locale),
  };
}

function buildRuleCard(rule: RuleMetadata, locale: StyleLibraryLocale): StyleLibraryRuleCard {
  const ui = getStyleLibraryUiCopy(locale);
  return {
    ruleId: rule.ruleId,
    ruleType: rule.ruleType,
    ruleTypeLabel:
      rule.ruleType === "copy_safe" ? ui.ruleTypeCopySafe : ui.ruleTypeSelection,
    name: localizeText(rule.name, locale),
    description: localizeText(rule.description, locale),
    severity: rule.severity,
    severityLabel:
      rule.severity === "blocking"
        ? ui.ruleSeverityBlocking
        : rule.severity === "warning"
          ? ui.ruleSeverityWarning
          : ui.ruleSeverityInfo,
    operatorSummary: localizeText(rule.operatorReadableSummary, locale),
    appliesTo: localizeText(rule.appliesTo, locale),
    relatedContract: rule.relatedContract,
    linkedStyleIds: rule.linkedStyleIds,
    linkedVariantAssetIds: rule.linkedVariantAssetIds,
    evidenceRefs: rule.evidenceRefs,
    relatedStory: rule.relatedStory ?? null,
    hasWarning: rule.severity === "warning",
  };
}

export function buildStyleLibraryStyleCards(
  locale: StyleLibraryLocale = "zh",
): StyleLibraryStyleCard[] {
  return getStyleLibraryStyleDefinitions().map((style) => buildStyleCard(style, locale));
}

export function buildStyleLibraryPaletteCards(
  locale: StyleLibraryLocale = "zh",
): StyleLibraryPaletteCard[] {
  return Object.values(STYLE_LIBRARY_PALETTE_METADATA).map((palette) =>
    buildPaletteCard(palette, locale),
  );
}

export function buildStyleLibraryRuleCards(
  locale: StyleLibraryLocale = "zh",
): StyleLibraryRuleCard[] {
  return Object.values(STYLE_LIBRARY_RULE_METADATA).map((rule) => buildRuleCard(rule, locale));
}

export function buildStyleLibraryStyleRuleSummaryCounts(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
): StylePaletteRuleSummaryCounts {
  return buildStylePaletteRuleSummaryCounts(manifest);
}

export function buildStyleLibraryCandidateStyleLinks(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidateStyleLinks[] {
  const ui = getStyleLibraryUiCopy(locale);
  return getStyleLibrarySeedAssets(manifest).map((asset) => {
    const association = buildVariantStyleAssociation(asset);
    const linkedStyle = association.linkedStyle;
    return {
      assetId: asset.assetId,
      linkedStyleName: linkedStyle ? localizeText(linkedStyle.name, locale) : null,
      linkedStyleId: linkedStyle?.styleId ?? null,
      linkedPaletteNames: association.linkedPalettes.map((palette) =>
        localizeText(palette.name, locale),
      ),
      linkedPaletteIds: association.linkedPalettes.map((palette) => palette.paletteId),
      linkedRuleNames: association.linkedRules.map((rule) => localizeText(rule.name, locale)),
      linkedRuleIds: association.linkedRules.map((rule) => rule.ruleId),
      unlinkedStyleLabel: ui.candidateUnlinkedStyle,
      unlinkedPaletteLabel: ui.candidateUnlinkedPalette,
      unlinkedRuleLabel: ui.candidateUnlinkedRule,
    };
  });
}

export function getStyleManagementDisabledActions(
  locale: StyleLibraryLocale,
): StyleLibraryDisabledActionCopy[] {
  const ui = getStyleLibraryUiCopy(locale);
  return ui.styleManagementDisabledActions;
}

export type { StylePaletteRuleSummaryCounts };
