/**
 * VisualAssetRegistry types — Release 1 system builtin assets
 * @see docs/architecture/style-system.md §11.6
 */

import type { StyleSchemaVersion } from "./tokens";

export const VISUAL_ASSET_KINDS = ["icon", "shape", "mark", "divider"] as const;

export type VisualAssetKind = (typeof VISUAL_ASSET_KINDS)[number];

export type VisualAssetDefinition = {
  assetId: string;
  kind: VisualAssetKind;
  name: string;
  label: string;
  copySafe: boolean;
  fallbackAssetId?: string;
  category?: string;
  style?: string;
  suitableFor?: string[];
  aspectRatio?: string;
  defaultColors?: Record<string, string>;
};

export type VisualAssetRegistry = {
  schemaVersion: StyleSchemaVersion;
  assets: VisualAssetDefinition[];
};

export type ValidateVisualAssetReferenceOptions = {
  requireCopySafe?: boolean;
  path?: Array<string | number>;
};

export type ValidateAssetBindingsOptions = {
  requireCopySafe?: boolean;
  variantId?: string;
  blockType?: string;
};
