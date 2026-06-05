import {
  STYLE_LIBRARY_MANIFEST,
  getStyleLibrarySeedAssets,
  getStyleLibraryVariantAssets,
  validateStyleLibraryManifest,
  validateStyleLibraryRegistryPatch,
} from "@/core/style-library";
import type {
  StyleLibraryEvidenceRef,
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
  StyleLibraryRegistryPatch,
  StyleLibraryValidationIssue,
  StyleLibraryVariantAsset,
} from "@/core/style-library";

import {
  STYLE_LIBRARY_DEFAULT_LOCALE,
  getAllLifecycleStates,
  getCandidateDisabledActions,
  getLifecycleColumnMeta,
  getLifecycleDisplayLabel,
  getStyleLibraryUiCopy,
  type StyleLibraryDisabledActionCopy,
  type StyleLibraryLocale,
  type StyleLibraryUiCopy,
} from "./style-library-i18n";
import {
  buildCandidateLifecyclePanels,
  buildLifecycleColumnMetaList,
  type StyleLibraryCandidateLifecyclePanel,
  type StyleLibraryLifecycleColumnMeta,
} from "./style-library-lifecycle-view-model";

export type StyleLibraryAdminAssetRow = {
  assetId: string;
  assetType: string;
  label: string;
  runtimeVariantId: string | null;
  blockType: string | null;
  styleFamily: string | null;
  lifecycle: StyleLibraryLifecycleState;
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
  isSeedAsset: boolean;
  evidenceCount: number;
  seedBadge: string | null;
};

export type StyleLibraryAdminPatchRow = {
  patchId: string;
  operation: string;
  variantId: string;
  active: boolean;
  requiresLifecycle: string | null;
  requiresEvidenceIds: string[];
  validationIssueCount: number;
  validationIssues: StyleLibraryValidationIssue[];
};

export type StyleLibraryAdminEvidenceRow = {
  evidenceId: string;
  kind: string;
  refPath: string;
  matrixRowId: string | null;
  sessionId: string | null;
};

export type StyleLibraryAdminOverview = {
  libraryId: string;
  schemaVersion: number;
  updatedAt: string;
  totalAssets: number;
  variantAssetCount: number;
  seedAssetCount: number;
  registryPatchCount: number;
  activePatchCount: number;
  evidenceRefCount: number;
  lifecycleDistribution: Record<StyleLibraryLifecycleState, number>;
};

export type StyleLibraryAdminValidationPanel = {
  ok: boolean;
  issueCount: number;
  issues: StyleLibraryValidationIssue[];
};

export type StyleLibraryWorkbenchHeader = {
  title: string;
  subtitle: string;
  description: string;
  libraryId: string;
  schemaVersion: number;
  updatedAt: string;
  runtimeStatus: string;
  mode: string;
};

export type StyleLibraryStatusSummary = {
  totalAssets: number;
  seedCandidates: number;
  pasteQaPassed: number;
  userSelectable: number;
  defaultEligible: number;
  activePatches: number;
  validationIssues: number;
};

export type StyleLibraryLifecycleGroup = {
  lifecycle: StyleLibraryLifecycleState;
  label: string;
  rawKey: string;
  businessMeaning: string;
  nextAction: string;
  assets: StyleLibraryAdminAssetRow[];
};

export type StyleLibraryCandidateReviewCard = StyleLibraryAdminAssetRow & {
  lifecycleLabel: string;
  currentConclusion: string;
  nextStepHint: string;
  disabledActions: StyleLibraryDisabledActionCopy[];
  lifecyclePanel: StyleLibraryCandidateLifecyclePanel;
};

export type StyleLibraryAdminViewModel = {
  locale: StyleLibraryLocale;
  ui: StyleLibraryUiCopy;
  workbench: StyleLibraryWorkbenchHeader;
  statusSummary: StyleLibraryStatusSummary;
  lifecycleGroups: StyleLibraryLifecycleGroup[];
  lifecycleColumnMeta: StyleLibraryLifecycleColumnMeta[];
  candidateReviewCards: StyleLibraryCandidateReviewCard[];
  candidateLifecyclePanels: StyleLibraryCandidateLifecyclePanel[];
  overview: StyleLibraryAdminOverview;
  assets: StyleLibraryAdminAssetRow[];
  patches: StyleLibraryAdminPatchRow[];
  evidence: StyleLibraryAdminEvidenceRow[];
  validation: StyleLibraryAdminValidationPanel;
  runtimeNotice: string;
};

export type { StyleLibraryCandidateLifecyclePanel, StyleLibraryLifecycleColumnMeta };
export type { StyleLibraryDisabledActionCopy, StyleLibraryLocale, StyleLibraryUiCopy };

function emptyLifecycleDistribution(): Record<
  StyleLibraryLifecycleState,
  number
> {
  return getAllLifecycleStates().reduce(
    (acc, state) => {
      acc[state] = 0;
      return acc;
    },
    {} as Record<StyleLibraryLifecycleState, number>,
  );
}

function buildLifecycleDistribution(
  manifest: StyleLibraryManifest,
): Record<StyleLibraryLifecycleState, number> {
  const distribution = emptyLifecycleDistribution();
  for (const asset of manifest.assets) {
    distribution[asset.lifecycle] += 1;
  }
  return distribution;
}

function seedBadgeForAsset(
  asset: StyleLibraryVariantAsset,
  locale: StyleLibraryLocale,
): string {
  return getStyleLibraryUiCopy(locale).seedBadge(asset.lifecycle);
}

function toAssetRow(
  asset: StyleLibraryManifest["assets"][number],
  seedAssetIds: Set<string>,
  locale: StyleLibraryLocale,
): StyleLibraryAdminAssetRow {
  if (asset.assetType === "variant") {
    const isSeed =
      asset.isSeedAsset === true || seedAssetIds.has(asset.assetId);
    return {
      assetId: asset.assetId,
      assetType: asset.assetType,
      label: asset.label,
      runtimeVariantId: asset.runtimeVariantId,
      blockType: asset.blockType,
      styleFamily: asset.styleFamily,
      lifecycle: asset.lifecycle,
      userSelectable: asset.distribution.userSelectable,
      defaultEligible: asset.distribution.defaultEligible,
      release1Required: asset.distribution.release1Required,
      isSeedAsset: isSeed,
      evidenceCount: asset.evidenceIds?.length ?? 0,
      seedBadge: isSeed ? seedBadgeForAsset(asset, locale) : null,
    };
  }

  return {
    assetId: asset.assetId,
    assetType: asset.assetType,
    label: asset.label,
    runtimeVariantId: null,
    blockType: null,
    styleFamily: null,
    lifecycle: asset.lifecycle,
    userSelectable: asset.distribution.userSelectable,
    defaultEligible: asset.distribution.defaultEligible,
    release1Required: asset.distribution.release1Required,
    isSeedAsset: seedAssetIds.has(asset.assetId),
    evidenceCount: 0,
    seedBadge: null,
  };
}

function toPatchRow(
  manifest: StyleLibraryManifest,
  patch: StyleLibraryRegistryPatch,
): StyleLibraryAdminPatchRow {
  const validationIssues = validateStyleLibraryRegistryPatch(manifest, patch);
  return {
    patchId: patch.patchId,
    operation: patch.operation,
    variantId: patch.variantId,
    active: patch.active,
    requiresLifecycle: patch.requiresLifecycle ?? null,
    requiresEvidenceIds: patch.requiresEvidenceIds ?? [],
    validationIssueCount: validationIssues.length,
    validationIssues,
  };
}

function toEvidenceRow(ref: StyleLibraryEvidenceRef): StyleLibraryAdminEvidenceRow {
  return {
    evidenceId: ref.evidenceId,
    kind: ref.kind,
    refPath: ref.refPath,
    matrixRowId: ref.matrixRowId ?? null,
    sessionId: ref.sessionId ?? null,
  };
}

function buildLifecycleGroups(
  assets: StyleLibraryAdminAssetRow[],
  locale: StyleLibraryLocale,
): StyleLibraryLifecycleGroup[] {
  return getAllLifecycleStates().map((lifecycle) => {
    const meta = getLifecycleColumnMeta(locale, lifecycle);
    return {
      lifecycle,
      label: meta.label,
      rawKey: lifecycle,
      businessMeaning: meta.businessMeaning,
      nextAction: meta.nextAction,
      assets: assets.filter((asset) => asset.lifecycle === lifecycle),
    };
  });
}

function buildCandidateReviewCards(
  assets: StyleLibraryAdminAssetRow[],
  manifest: StyleLibraryManifest,
  locale: StyleLibraryLocale,
  ui: StyleLibraryUiCopy,
  lifecyclePanels: StyleLibraryCandidateLifecyclePanel[],
): StyleLibraryCandidateReviewCard[] {
  const panelByAssetId = new Map(
    lifecyclePanels.map((panel) => [panel.assetId, panel]),
  );

  return assets
    .filter((asset) => asset.isSeedAsset)
    .map((asset) => {
      const panel = panelByAssetId.get(asset.assetId);
      if (!panel) {
        throw new Error(`Missing lifecycle panel for seed asset ${asset.assetId}`);
      }
      return {
        ...asset,
        lifecycleLabel: getLifecycleDisplayLabel(locale, asset.lifecycle),
        currentConclusion: ui.candidateCurrentConclusionValue,
        nextStepHint: panel.nextStepSuggestion,
        disabledActions: getCandidateDisabledActions(locale),
        lifecyclePanel: panel,
      };
    });
}

function buildStatusSummary(
  overview: StyleLibraryAdminOverview,
  validation: StyleLibraryAdminValidationPanel,
): StyleLibraryStatusSummary {
  const { lifecycleDistribution } = overview;
  return {
    totalAssets: overview.totalAssets,
    seedCandidates: overview.seedAssetCount,
    pasteQaPassed: lifecycleDistribution.paste_qa_pass,
    userSelectable: lifecycleDistribution.user_selectable,
    defaultEligible: lifecycleDistribution.default_eligible,
    activePatches: overview.activePatchCount,
    validationIssues: validation.issueCount,
  };
}

export function buildStyleLibraryAdminViewModel(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = STYLE_LIBRARY_DEFAULT_LOCALE,
): StyleLibraryAdminViewModel {
  const ui = getStyleLibraryUiCopy(locale);
  const seedAssetIds = new Set(manifest.seedAssetIds);
  const validationResult = validateStyleLibraryManifest(manifest);
  const variantAssets = getStyleLibraryVariantAssets(manifest);
  const seedAssets = getStyleLibrarySeedAssets(manifest);
  const assets = manifest.assets.map((asset) =>
    toAssetRow(asset, seedAssetIds, locale),
  );
  const validation: StyleLibraryAdminValidationPanel = {
    ok: validationResult.ok,
    issueCount: validationResult.ok ? 0 : validationResult.issues.length,
    issues: validationResult.ok ? [] : validationResult.issues,
  };
  const overview: StyleLibraryAdminOverview = {
    libraryId: manifest.libraryId,
    schemaVersion: manifest.schemaVersion,
    updatedAt: manifest.updatedAt,
    totalAssets: manifest.assets.length,
    variantAssetCount: variantAssets.length,
    seedAssetCount: seedAssets.length,
    registryPatchCount: manifest.registryPatches.length,
    activePatchCount: manifest.registryPatches.filter((patch) => patch.active)
      .length,
    evidenceRefCount: manifest.evidenceRefs.length,
    lifecycleDistribution: buildLifecycleDistribution(manifest),
  };

  const lifecycleColumnMeta = buildLifecycleColumnMetaList(manifest, locale);
  const candidateLifecyclePanels = buildCandidateLifecyclePanels(manifest, locale);

  return {
    locale,
    ui,
    workbench: {
      title: ui.workbenchTitle,
      subtitle: ui.workbenchSubtitle,
      description: ui.workbenchDescription,
      libraryId: manifest.libraryId,
      schemaVersion: manifest.schemaVersion,
      updatedAt: manifest.updatedAt,
      runtimeStatus: ui.runtimeStatus,
      mode: ui.mode,
    },
    statusSummary: buildStatusSummary(overview, validation),
    lifecycleGroups: buildLifecycleGroups(assets, locale),
    lifecycleColumnMeta,
    candidateReviewCards: buildCandidateReviewCards(
      assets,
      manifest,
      locale,
      ui,
      candidateLifecyclePanels,
    ),
    candidateLifecyclePanels,
    overview,
    assets,
    patches: manifest.registryPatches.map((patch) => toPatchRow(manifest, patch)),
    evidence: manifest.evidenceRefs.map(toEvidenceRow),
    validation,
    runtimeNotice: ui.runtimeNotice,
  };
}
