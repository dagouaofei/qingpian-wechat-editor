import type { BlockType, StyleVariantLifecycle } from "@prisma/client";

import type { AdminVariantListFilter } from "@/server/style-admin/queries/style-library-admin-query";

const BLOCK_TYPES: BlockType[] = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "divider",
  "image_placeholder",
];

const LIFECYCLE_VALUES: StyleVariantLifecycle[] = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "release1_required",
  "deprecated",
];

function parseBooleanParam(value: string | string[] | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function parseStringParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseBlockType(value: string | undefined): BlockType | undefined {
  if (!value) return undefined;
  return BLOCK_TYPES.includes(value as BlockType) ? (value as BlockType) : undefined;
}

function parseLifecycle(value: string | undefined): StyleVariantLifecycle | undefined {
  if (!value) return undefined;
  return LIFECYCLE_VALUES.includes(value as StyleVariantLifecycle)
    ? (value as StyleVariantLifecycle)
    : undefined;
}

export type StyleLibraryAdminSearchParams = {
  blockType?: string | string[];
  lifecycle?: string | string[];
  userSelectable?: string | string[];
  release1Required?: string | string[];
  defaultEligible?: string | string[];
  deprecated?: string | string[];
  hidden?: string | string[];
  q?: string | string[];
  search?: string | string[];
};

export function parseAdminVariantListFilter(
  searchParams: StyleLibraryAdminSearchParams = {},
): AdminVariantListFilter {
  return {
    blockType: parseBlockType(parseStringParam(searchParams.blockType)),
    lifecycle: parseLifecycle(parseStringParam(searchParams.lifecycle)),
    userSelectable: parseBooleanParam(searchParams.userSelectable),
    release1Required: parseBooleanParam(searchParams.release1Required),
    defaultEligible: parseBooleanParam(searchParams.defaultEligible),
    deprecated: parseBooleanParam(searchParams.deprecated),
    hidden: parseBooleanParam(searchParams.hidden),
    search:
      parseStringParam(searchParams.q) ?? parseStringParam(searchParams.search),
  };
}

export function buildAdminListHref(filter: AdminVariantListFilter): string {
  const params = new URLSearchParams();
  if (filter.blockType) params.set("blockType", filter.blockType);
  if (filter.lifecycle) params.set("lifecycle", filter.lifecycle);
  if (filter.userSelectable !== undefined) {
    params.set("userSelectable", String(filter.userSelectable));
  }
  if (filter.release1Required !== undefined) {
    params.set("release1Required", String(filter.release1Required));
  }
  if (filter.defaultEligible !== undefined) {
    params.set("defaultEligible", String(filter.defaultEligible));
  }
  if (filter.deprecated !== undefined) {
    params.set("deprecated", String(filter.deprecated));
  }
  if (filter.hidden !== undefined) {
    params.set("hidden", String(filter.hidden));
  }
  if (filter.search) params.set("q", filter.search);
  const query = params.toString();
  return query ? `/admin/style-library?${query}` : "/admin/style-library";
}

export const ADMIN_FILTER_OPTIONS = {
  blockTypes: BLOCK_TYPES,
  lifecycles: LIFECYCLE_VALUES,
};

export type AdminFilterPreset = {
  id: string;
  label: string;
  href: string;
  filter: AdminVariantListFilter;
};

/** URL quick-filter presets · distribution flags are independent (S10 boundary). */
export const ADMIN_FILTER_PRESETS: AdminFilterPreset[] = [
  {
    id: "block-heading",
    label: "blockType=heading",
    href: buildAdminListHref({ blockType: "heading" }),
    filter: { blockType: "heading" },
  },
  {
    id: "lifecycle-release1-required",
    label: "lifecycle=release1_required",
    href: buildAdminListHref({ lifecycle: "release1_required" }),
    filter: { lifecycle: "release1_required" },
  },
  {
    id: "user-selectable-true",
    label: "distribution.userSelectable=true (user pool)",
    href: buildAdminListHref({ userSelectable: true }),
    filter: { userSelectable: true },
  },
  {
    id: "release1-required-true",
    label: "release1Required=true",
    href: buildAdminListHref({ release1Required: true }),
    filter: { release1Required: true },
  },
  {
    id: "default-eligible-true",
    label: "defaultEligible=true",
    href: buildAdminListHref({ defaultEligible: true }),
    filter: { defaultEligible: true },
  },
  {
    id: "default-eligible-false",
    label: "defaultEligible=false",
    href: buildAdminListHref({ defaultEligible: false }),
    filter: { defaultEligible: false },
  },
  {
    id: "hidden-true",
    label: "hidden=true",
    href: buildAdminListHref({ hidden: true }),
    filter: { hidden: true },
  },
  {
    id: "hidden-false",
    label: "hidden=false",
    href: buildAdminListHref({ hidden: false }),
    filter: { hidden: false },
  },
  {
    id: "deprecated-true",
    label: "deprecated=true",
    href: buildAdminListHref({ deprecated: true }),
    filter: { deprecated: true },
  },
  {
    id: "clear",
    label: "clear",
    href: "/admin/style-library",
    filter: {},
  },
];

export function isAdminFilterPresetActive(
  current: AdminVariantListFilter,
  preset: AdminVariantListFilter,
): boolean {
  const keys: Array<keyof AdminVariantListFilter> = [
    "blockType",
    "lifecycle",
    "userSelectable",
    "release1Required",
    "defaultEligible",
    "deprecated",
    "hidden",
    "search",
  ];

  for (const key of keys) {
    const currentValue = current[key];
    const presetValue = preset[key];
    const currentNormalized = currentValue === undefined ? undefined : currentValue;
    const presetNormalized = presetValue === undefined ? undefined : presetValue;
    if (currentNormalized !== presetNormalized) {
      return false;
    }
  }
  return true;
}
