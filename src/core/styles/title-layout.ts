import {
  titleBlockLayoutCompatibilityTableSchema,
  titleBlockLayoutModeSchema,
} from "./schemas";
import {
  TITLE_BLOCK_COMPONENT_ID,
  TITLE_BLOCK_FIRST_WAVE_ALLOWED_LAYOUT_MODES,
  TITLE_BLOCK_LAYOUT_MODES,
} from "./types";
import type {
  CopySafety,
  StyleValidationIssue,
  StyleValidationResult,
  TitleBlockCatalogLayoutMapping,
  TitleBlockLayoutCompatibility,
  TitleBlockLayoutCompatibilityTable,
  TitleBlockLayoutMode,
  TitleBlockLayoutRiskLevel,
  ValidateTitleBlockLayoutOptions,
  VariantDefinition,
  VariantStatus,
} from "./types";

const RISK_LEVEL_RANK: Record<TitleBlockLayoutRiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  forbidden: 3,
};

const ALL_COPY_SAFETY: CopySafety[] = ["strict", "balanced", "preview_only"];
const REQUIRED_COPY_SAFETY: CopySafety[] = ["strict", "balanced"];
const ALL_VARIANT_STATUS: VariantStatus[] = [
  "release1_required",
  "release1_candidate",
  "experimental",
];
const CANDIDATE_ONLY_STATUS: VariantStatus[] = [
  "release1_candidate",
  "experimental",
];
const EXPERIMENTAL_ONLY_STATUS: VariantStatus[] = ["experimental"];

function entry(
  layoutMode: TitleBlockLayoutMode,
  config: Omit<TitleBlockLayoutCompatibility, "layoutMode">,
): TitleBlockLayoutCompatibility {
  return { layoutMode, ...config };
}

export const TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE: TitleBlockLayoutCompatibilityTable =
  {
    plain: entry("plain", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Plain text title; lowest copy risk",
    }),
    left_bar: entry("left_bar", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Left vertical bar via real DOM line",
    }),
    bottom_line: entry("bottom_line", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Bottom divider line title",
    }),
    top_badge: entry("top_badge", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Badge above title; paste test recommended",
    }),
    numbered: entry("numbered", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
    }),
    underline: entry("underline", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Section underline heading",
    }),
    pill: entry("pill", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Pill label heading",
    }),
    keynote_bar: entry("keynote_bar", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Strong keynote underline heading",
    }),
    highlight_marker: entry("highlight_marker", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Highlighter marker band behind heading text",
    }),
    short_line: entry("short_line", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Bottom accent line heading (miaopian title_with_bottom_line)",
    }),
    minimal_number: entry("minimal_number", {
      allowedInCopy: true,
      riskLevel: "low",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Index label + divider + heading",
    }),
    magazine_offset: entry("magazine_offset", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Offset card heading (miaopian magazine_offset_title)",
    }),
    card: entry("card", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
    }),
    quote_mark: entry("quote_mark", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
    }),
    icon_prefix: entry("icon_prefix", {
      allowedInCopy: true,
      riskLevel: "medium",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
    }),
    magazine_left_bar: entry("magazine_left_bar", {
      allowedInCopy: true,
      riskLevel: "medium",
      fallbackLayoutMode: "left_bar",
      allowedCopySafety: REQUIRED_COPY_SAFETY,
      allowedVariantStatus: ALL_VARIANT_STATUS,
      notes: "Magazine dual vertical bar heading",
    }),
    overlay: entry("overlay", {
      allowedInCopy: false,
      riskLevel: "forbidden",
      fallbackLayoutMode: "plain",
      allowedCopySafety: ALL_COPY_SAFETY,
      allowedVariantStatus: EXPERIMENTAL_ONLY_STATUS,
      notes: "Overlay layout forbidden for Release 1 required copy path",
    }),
    offset_background: entry("offset_background", {
      allowedInCopy: false,
      riskLevel: "forbidden",
      fallbackLayoutMode: "plain",
      allowedCopySafety: ALL_COPY_SAFETY,
      allowedVariantStatus: EXPERIMENTAL_ONLY_STATUS,
      notes: "Offset background forbidden for Release 1 required copy path",
    }),
  };

titleBlockLayoutCompatibilityTableSchema.parse(
  TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE,
);

export function getTitleBlockLayoutCompatibility(
  layoutMode: TitleBlockLayoutMode,
): TitleBlockLayoutCompatibility | undefined {
  return TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE[layoutMode];
}

export function isTitleBlockVariant(variant: VariantDefinition): boolean {
  if (variant.componentProtocol?.componentId === TITLE_BLOCK_COMPONENT_ID) {
    return true;
  }
  if (
    (variant.blockType === "title" || variant.blockType === "heading") &&
    variant.componentProtocol?.layoutMode
  ) {
    return true;
  }
  return false;
}

function isSaferFallbackLayout(
  from: TitleBlockLayoutCompatibility,
  to: TitleBlockLayoutCompatibility,
): boolean {
  if (from.layoutMode === to.layoutMode) {
    return false;
  }
  if (RISK_LEVEL_RANK[to.riskLevel] < RISK_LEVEL_RANK[from.riskLevel]) {
    return true;
  }
  if (!from.allowedInCopy && to.allowedInCopy) {
    return true;
  }
  return false;
}

export function getFallbackTitleBlockLayoutMode(
  layoutMode: TitleBlockLayoutMode,
): TitleBlockLayoutMode | undefined {
  const entryCompat = getTitleBlockLayoutCompatibility(layoutMode);
  if (!entryCompat?.fallbackLayoutMode) {
    return undefined;
  }
  const fallback = getTitleBlockLayoutCompatibility(
    entryCompat.fallbackLayoutMode,
  );
  if (!fallback || !isSaferFallbackLayout(entryCompat, fallback)) {
    return undefined;
  }
  return entryCompat.fallbackLayoutMode;
}

export function isTitleBlockLayoutAllowedForCopy(
  layoutMode: TitleBlockLayoutMode,
  options: ValidateTitleBlockLayoutOptions & {
    variantStatus?: VariantStatus;
  } = {},
): boolean {
  const compatibility = getTitleBlockLayoutCompatibility(layoutMode);
  if (!compatibility) {
    return false;
  }
  if (!compatibility.allowedInCopy) {
    return false;
  }
  if (compatibility.riskLevel === "forbidden") {
    return false;
  }
  if (options.variantStatus) {
    if (!compatibility.allowedVariantStatus.includes(options.variantStatus)) {
      return false;
    }
  }
  if (options.copySafety) {
    if (!compatibility.allowedCopySafety.includes(options.copySafety)) {
      return false;
    }
  }
  return true;
}

function buildLayoutValidationResult(
  issues: StyleValidationIssue[],
): StyleValidationResult {
  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

function pushLayoutIssue(
  issues: StyleValidationIssue[],
  issue: StyleValidationIssue,
): void {
  issues.push(issue);
}

export function validateTitleBlockLayoutCompatibility(
  variant: VariantDefinition,
  options: ValidateTitleBlockLayoutOptions = {},
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  if (!isTitleBlockVariant(variant)) {
    return buildLayoutValidationResult(issues);
  }

  const layoutModeRaw = variant.componentProtocol?.layoutMode;
  if (!layoutModeRaw) {
    if (variant.componentProtocol?.componentId === TITLE_BLOCK_COMPONENT_ID) {
      pushLayoutIssue(issues, {
        severity: "warning",
        code: "title_layout_mode_missing",
        message:
          "titleBlock variant should declare componentProtocol.layoutMode",
        variantId: variant.id,
        blockType: variant.blockType,
        path: ["componentProtocol", "layoutMode"],
      });
    }
    return buildLayoutValidationResult(issues);
  }

  const parsedLayoutMode = titleBlockLayoutModeSchema.safeParse(layoutModeRaw);
  if (!parsedLayoutMode.success) {
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_mode_invalid",
      message: `Invalid titleBlock layoutMode "${layoutModeRaw}"`,
      variantId: variant.id,
      blockType: variant.blockType,
      path: ["componentProtocol", "layoutMode"],
    });
    return buildLayoutValidationResult(issues);
  }

  const layoutMode = parsedLayoutMode.data;
  const compatibility = getTitleBlockLayoutCompatibility(layoutMode);
  if (!compatibility) {
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_mode_unknown",
      message: `Unknown titleBlock layoutMode "${layoutMode}"`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
    return buildLayoutValidationResult(issues);
  }

  const copySafety =
    options.copySafety ?? variant.compatibility?.copySafety ?? "strict";

  if (!compatibility.allowedVariantStatus.includes(variant.status)) {
    pushLayoutIssue(issues, {
      severity:
        variant.status === "release1_required" ? "error" : "warning",
      code: "title_layout_status_not_allowed",
      message: `layoutMode "${layoutMode}" is not allowed for variant status "${variant.status}"`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (
    variant.status === "release1_required" &&
    (layoutMode === "overlay" || layoutMode === "offset_background")
  ) {
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_forbidden_for_required",
      message: `layoutMode "${layoutMode}" must not be used on release1_required variants`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (compatibility.riskLevel === "forbidden") {
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_risk_forbidden",
      message: `layoutMode "${layoutMode}" has forbidden copy risk level`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (!compatibility.allowedInCopy) {
    const fallback = getFallbackTitleBlockLayoutMode(layoutMode);
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_not_allowed_in_copy",
      message: fallback
        ? `layoutMode "${layoutMode}" is not allowed in copy HTML; fallback layoutMode "${fallback}"`
        : `layoutMode "${layoutMode}" is not allowed in copy HTML`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (
    layoutMode === "magazine_left_bar" &&
    variant.status === "release1_candidate"
  ) {
    pushLayoutIssue(issues, {
      severity: "warning",
      code: "title_layout_candidate_only",
      message:
        "magazine_left_bar is candidate-only and must not enter required default copy path",
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (!compatibility.allowedCopySafety.includes(copySafety)) {
    pushLayoutIssue(issues, {
      severity: "error",
      code: "title_layout_copy_safety_not_allowed",
      message: `layoutMode "${layoutMode}" does not support copySafety "${copySafety}"`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  if (compatibility.fallbackLayoutMode) {
    const fallbackCompat = getTitleBlockLayoutCompatibility(
      compatibility.fallbackLayoutMode,
    );
    if (!fallbackCompat) {
      pushLayoutIssue(issues, {
        severity: "error",
        code: "title_layout_fallback_missing",
        message: `fallbackLayoutMode "${compatibility.fallbackLayoutMode}" is not defined in compatibility table`,
        variantId: variant.id,
        blockType: variant.blockType,
      });
    } else if (!isSaferFallbackLayout(compatibility, fallbackCompat)) {
      pushLayoutIssue(issues, {
        severity: "error",
        code: "title_layout_fallback_not_safer",
        message: `fallbackLayoutMode "${compatibility.fallbackLayoutMode}" is not safer than "${layoutMode}"`,
        variantId: variant.id,
        blockType: variant.blockType,
      });
    }
  }

  if (
    copySafety === "strict" &&
    (compatibility.riskLevel === "high" || compatibility.riskLevel === "medium")
  ) {
    pushLayoutIssue(issues, {
      severity: "warning",
      code: "title_layout_strict_risky",
      message: `strict copySafety with ${compatibility.riskLevel} risk layoutMode "${layoutMode}" requires review`,
      variantId: variant.id,
      blockType: variant.blockType,
    });
  }

  return buildLayoutValidationResult(issues);
}

export function assertTitleBlockLayoutTableComplete(): boolean {
  return TITLE_BLOCK_LAYOUT_MODES.every(
    (mode) => TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE[mode] !== undefined,
  );
}

const CATALOG_LAYOUT_MODE_ALIASES: Record<string, TitleBlockLayoutMode> = {
  "vertical-stack": "plain",
  "line-top": "bottom_line",
  "line-bottom": "bottom_line",
  "badge-top": "top_badge",
  "corner-label": "top_badge",
  "offset-bg": "offset_background",
  "magazine-left-bar": "magazine_left_bar",
  "left-bar": "magazine_left_bar",
  "icon-left": "icon_prefix",
  "icon-right": "icon_prefix",
  "inline-prefix": "icon_prefix",
  "inline-badge": "top_badge",
  "card-corner": "card",
  "card-center": "card",
  symmetric: "card",
  "title-subtitle-line": "bottom_line",
  stack: "card",
};

export const TITLE_BLOCK_CATALOG_LAYOUT_MODE_MAPPINGS: TitleBlockCatalogLayoutMapping[] =
  [
    {
      catalogName: "vertical-stack",
      canonicalLayoutMode: "plain",
      allowedInRelease1Required: true,
      note: "Icon/badge above title stack",
    },
    {
      catalogName: "line-top",
      canonicalLayoutMode: "bottom_line",
      allowedInRelease1Required: true,
      note: "Historical DSL name; maps to bottom_line decoration",
    },
    {
      catalogName: "line-bottom",
      canonicalLayoutMode: "bottom_line",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "badge-top",
      canonicalLayoutMode: "top_badge",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "inline-badge",
      canonicalLayoutMode: "top_badge",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "corner-label",
      canonicalLayoutMode: "top_badge",
      allowedInRelease1Required: true,
      note: "Card corner badge maps to top_badge presentation",
    },
    {
      catalogName: "inline-prefix",
      canonicalLayoutMode: "icon_prefix",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "icon-left",
      canonicalLayoutMode: "icon_prefix",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "icon-right",
      canonicalLayoutMode: "icon_prefix",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "card-corner",
      canonicalLayoutMode: "card",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "card-center",
      canonicalLayoutMode: "card",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "symmetric",
      canonicalLayoutMode: "card",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "stack",
      canonicalLayoutMode: "card",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "title-subtitle-line",
      canonicalLayoutMode: "bottom_line",
      allowedInRelease1Required: true,
    },
    {
      catalogName: "left-bar",
      canonicalLayoutMode: "magazine_left_bar",
      allowedInRelease1Required: false,
      fallbackLayoutMode: "left_bar",
      note: "Candidate-only magazine left bar",
    },
    {
      catalogName: "magazine-left-bar",
      canonicalLayoutMode: "magazine_left_bar",
      allowedInRelease1Required: false,
      fallbackLayoutMode: "left_bar",
    },
    {
      catalogName: "offset-bg",
      canonicalLayoutMode: "offset_background",
      allowedInRelease1Required: false,
      fallbackLayoutMode: "plain",
    },
  ];

function normalizeLayoutModeInput(input: string): string {
  return input.trim().toLowerCase();
}

function isCanonicalTitleBlockLayoutMode(
  value: string,
): value is TitleBlockLayoutMode {
  return (TITLE_BLOCK_LAYOUT_MODES as readonly string[]).includes(value);
}

export function normalizeTitleBlockLayoutMode(
  input: string,
): TitleBlockLayoutMode | undefined {
  const normalized = normalizeLayoutModeInput(input);
  const snakeCase = normalized.replace(/-/g, "_");

  if (isCanonicalTitleBlockLayoutMode(snakeCase)) {
    return snakeCase;
  }

  return (
    CATALOG_LAYOUT_MODE_ALIASES[normalized] ??
    CATALOG_LAYOUT_MODE_ALIASES[snakeCase]
  );
}

export function mapTitleBlockCatalogLayoutMode(
  input: string,
): TitleBlockLayoutMode | undefined {
  const normalized = normalizeLayoutModeInput(input);
  const snakeCase = normalized.replace(/-/g, "_");

  if (isCanonicalTitleBlockLayoutMode(snakeCase)) {
    return snakeCase;
  }

  return (
    CATALOG_LAYOUT_MODE_ALIASES[normalized] ??
    CATALOG_LAYOUT_MODE_ALIASES[snakeCase]
  );
}

export function isTitleBlockFirstWaveLayoutMode(
  layoutMode: TitleBlockLayoutMode,
): boolean {
  return (
    TITLE_BLOCK_FIRST_WAVE_ALLOWED_LAYOUT_MODES as readonly TitleBlockLayoutMode[]
  ).includes(layoutMode);
}
