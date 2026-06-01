/**
 * Release 1 VisualAssetRegistry — 15~30 system builtin icon / shape / mark assets
 * @see docs/architecture/style-system.md §11.6
 */

import { STYLE_SCHEMA_VERSION } from "./tokens";
import type {
  ValidateAssetBindingsOptions,
  ValidateVisualAssetReferenceOptions,
  VisualAssetDefinition,
  VisualAssetRegistry,
} from "./visual-assets";
import {
  visualAssetRegistrySchema,
} from "./visual-asset-schemas";
import type { StyleValidationIssue } from "./types";
import { buildStyleValidationResult } from "./validation";

const RELEASE1_BUILTIN_VISUAL_ASSETS: VisualAssetDefinition[] = [
  {
    assetId: "icon-star-minimal",
    kind: "icon",
    name: "star-minimal",
    label: "Star Minimal",
    copySafe: true,
    category: "decoration",
    suitableFor: ["titleBlock", "highlight"],
  },
  {
    assetId: "icon-check-circle",
    kind: "icon",
    name: "check-circle",
    label: "Check Circle",
    copySafe: true,
    category: "status",
    suitableFor: ["list", "info_card"],
  },
  {
    assetId: "icon-dot-marker",
    kind: "icon",
    name: "dot-marker",
    label: "Dot Marker",
    copySafe: true,
    category: "bullet",
    suitableFor: ["list", "divider"],
  },
  {
    assetId: "icon-arrow-right",
    kind: "icon",
    name: "arrow-right",
    label: "Arrow Right",
    copySafe: true,
    category: "navigation",
    suitableFor: ["cta", "heading"],
  },
  {
    assetId: "icon-quote-left",
    kind: "icon",
    name: "quote-left",
    label: "Quote Left",
    copySafe: true,
    category: "quote",
    suitableFor: ["quote", "titleBlock"],
  },
  {
    assetId: "icon-info-outline",
    kind: "icon",
    name: "info-outline",
    label: "Info Outline",
    copySafe: true,
    category: "status",
    suitableFor: ["info_card", "highlight"],
  },
  {
    assetId: "icon-warning-triangle",
    kind: "icon",
    name: "warning-triangle",
    label: "Warning Triangle",
    copySafe: false,
    fallbackAssetId: "icon-info-outline",
    category: "status",
    suitableFor: ["info_card"],
  },
  {
    assetId: "icon-section-number",
    kind: "icon",
    name: "section-number",
    label: "Section Number",
    copySafe: true,
    category: "badge",
    suitableFor: ["titleBlock", "heading"],
  },
  {
    assetId: "icon-bookmark",
    kind: "icon",
    name: "bookmark",
    label: "Bookmark",
    copySafe: true,
    category: "decoration",
    suitableFor: ["highlight", "lead"],
  },
  {
    assetId: "shape-line-horizontal",
    kind: "shape",
    name: "line-horizontal",
    label: "Horizontal Line",
    copySafe: true,
    category: "line",
    suitableFor: ["titleBlock", "divider"],
  },
  {
    assetId: "shape-bar-vertical",
    kind: "shape",
    name: "bar-vertical",
    label: "Vertical Bar",
    copySafe: true,
    category: "line",
    suitableFor: ["titleBlock", "quote"],
  },
  {
    assetId: "shape-circle-outline",
    kind: "shape",
    name: "circle-outline",
    label: "Circle Outline",
    copySafe: true,
    category: "frame",
    suitableFor: ["list", "cta"],
  },
  {
    assetId: "shape-square-fill",
    kind: "shape",
    name: "square-fill",
    label: "Square Fill",
    copySafe: true,
    category: "background",
    suitableFor: ["highlight", "info_card"],
  },
  {
    assetId: "shape-card-background",
    kind: "shape",
    name: "card-background",
    label: "Card Background",
    copySafe: false,
    fallbackAssetId: "shape-square-fill",
    category: "background",
    suitableFor: ["titleBlock", "highlight"],
  },
  {
    assetId: "shape-divider-dot",
    kind: "divider",
    name: "divider-dot",
    label: "Divider Dot",
    copySafe: true,
    category: "divider",
    suitableFor: ["divider"],
  },
  {
    assetId: "mark-step-badge",
    kind: "mark",
    name: "step-badge",
    label: "Step Badge",
    copySafe: true,
    category: "badge",
    suitableFor: ["titleBlock", "list"],
  },
  {
    assetId: "mark-highlight-band",
    kind: "mark",
    name: "highlight-band",
    label: "Highlight Band",
    copySafe: true,
    category: "emphasis",
    suitableFor: ["highlight", "lead"],
  },
  {
    assetId: "mark-corner-accent",
    kind: "mark",
    name: "corner-accent",
    label: "Corner Accent",
    copySafe: false,
    fallbackAssetId: "mark-step-badge",
    category: "decoration",
    suitableFor: ["titleBlock"],
  },
  {
    assetId: "mark-topic-label",
    kind: "mark",
    name: "topic-label",
    label: "Topic Label",
    copySafe: true,
    category: "badge",
    suitableFor: ["heading", "lead"],
  },
];

export const RELEASE1_VISUAL_ASSET_REGISTRY: VisualAssetRegistry = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  assets: RELEASE1_BUILTIN_VISUAL_ASSETS,
};

export const RELEASE1_VISUAL_ASSET_COUNT = RELEASE1_BUILTIN_VISUAL_ASSETS.length;

export function parseVisualAssetRegistry(input: unknown): VisualAssetRegistry {
  return visualAssetRegistrySchema.parse(input);
}

function buildAssetIndex(registry: VisualAssetRegistry): Map<string, VisualAssetDefinition> {
  return new Map(registry.assets.map((asset) => [asset.assetId, asset]));
}

export function getVisualAssetById(
  registry: VisualAssetRegistry,
  assetId: string,
): VisualAssetDefinition | undefined {
  return registry.assets.find((asset) => asset.assetId === assetId);
}

export function isVisualAssetCopySafe(
  registry: VisualAssetRegistry,
  assetId: string,
): boolean {
  const asset = getVisualAssetById(registry, assetId);
  return asset?.copySafe === true;
}

export function getFallbackVisualAsset(
  registry: VisualAssetRegistry,
  assetId: string,
): VisualAssetDefinition | undefined {
  const asset = getVisualAssetById(registry, assetId);
  if (!asset?.fallbackAssetId) {
    return undefined;
  }
  return getVisualAssetById(registry, asset.fallbackAssetId);
}

export function validateVisualAssetRegistry(
  registry: VisualAssetRegistry,
): ReturnType<typeof buildStyleValidationResult> {
  const issues: StyleValidationIssue[] = [];
  const parsed = visualAssetRegistrySchema.safeParse(registry);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        severity: "error",
        code: "visual_asset_registry_schema_invalid",
        message: issue.message,
        path: issue.path.map(String),
      });
    }
    return buildStyleValidationResult(issues);
  }

  const assetIds = new Set<string>();
  const index = buildAssetIndex(parsed.data);

  for (const asset of parsed.data.assets) {
    if (assetIds.has(asset.assetId)) {
      issues.push({
        severity: "error",
        code: "duplicate_visual_asset_id",
        message: `Duplicate visual asset id "${asset.assetId}"`,
        path: ["assets"],
        value: asset.assetId,
      });
    }
    assetIds.add(asset.assetId);

    if (asset.fallbackAssetId) {
      if (asset.fallbackAssetId === asset.assetId) {
        issues.push({
          severity: "error",
          code: "visual_asset_fallback_self_reference",
          message: `Visual asset "${asset.assetId}" fallbackAssetId must not reference itself`,
          path: ["assets", asset.assetId, "fallbackAssetId"],
          value: asset.fallbackAssetId,
        });
      } else if (!index.has(asset.fallbackAssetId)) {
        issues.push({
          severity: "error",
          code: "visual_asset_fallback_not_found",
          message: `Visual asset "${asset.assetId}" fallbackAssetId "${asset.fallbackAssetId}" is not registered`,
          path: ["assets", asset.assetId, "fallbackAssetId"],
          value: asset.fallbackAssetId,
        });
      }
    }
  }

  return buildStyleValidationResult(issues);
}

export function validateVisualAssetReference(
  assetId: string,
  registry: VisualAssetRegistry,
  options: ValidateVisualAssetReferenceOptions = {},
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];
  const asset = getVisualAssetById(registry, assetId);

  if (!asset) {
    issues.push({
      severity: "error",
      code: "visual_asset_not_registered",
      message: `Visual asset "${assetId}" is not registered in VisualAssetRegistry`,
      path: options.path,
      value: assetId,
    });
    return issues;
  }

  if (options.requireCopySafe && !asset.copySafe) {
    issues.push({
      severity: "error",
      code: "visual_asset_not_copy_safe",
      message: `Visual asset "${assetId}" is not copy-safe and cannot be used on default release1_required path`,
      path: options.path,
      value: assetId,
    });
  }

  return issues;
}

export function validateAssetBindingReferences(
  assetBindings: Record<string, string>,
  registry: VisualAssetRegistry,
  options: ValidateAssetBindingsOptions = {},
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];

  for (const [slotKey, assetId] of Object.entries(assetBindings)) {
    issues.push(
      ...validateVisualAssetReference(assetId, registry, {
        requireCopySafe: options.requireCopySafe,
        path: ["assetBindings", slotKey],
      }),
    );
  }

  return issues;
}

export function countAssetBindingUsage(
  assetBindingsList: Array<Record<string, string> | undefined>,
): Map<string, number> {
  const usage = new Map<string, number>();

  for (const bindings of assetBindingsList) {
    if (!bindings) {
      continue;
    }
    for (const assetId of Object.values(bindings)) {
      usage.set(assetId, (usage.get(assetId) ?? 0) + 1);
    }
  }

  return usage;
}
