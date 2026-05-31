import {
  WECHAT_MP_COMPATIBILITY_PROFILE,
  validateVariantWechatCompatibility,
} from "./compatibility";
import { getVariantById, validateStyleRegistrySchema } from "./registry";
import { validateTitleBlockLayoutCompatibility } from "./title-layout";
import {
  fallbackVariantPolicySchema,
  styleValidationIssueSchema,
  styleValidationResultSchema,
  variantDefinitionSchema,
} from "./schemas";
import type {
  CompatibilityIssue,
  CopySafety,
  FallbackVariantPolicy,
  ResolvedArticleStyle,
  ResolvedBlockStyle,
  StyleRegistry,
  StyleResolveIssue,
  StyleValidationIssue,
  StyleValidationResult,
  StyleValidationSeverity,
  ValidateResolvedArticleStyleContext,
  ValidateStyleRegistryOptions,
  ValidateVariantDefinitionContext,
  VariantDefinition,
  WeChatCompatibilityProfile,
} from "./types";

const MAGAZINE_LEFT_BAR_TITLE_ID = "magazine_left_bar_title";

export const RELEASE1_FALLBACK_VARIANT_POLICY: FallbackVariantPolicy = {
  onMissingVariant: "fallback_to_registry_default",
  onBlockTypeMismatch: "fallback_to_registry_default",
  onForbiddenCss: "error",
  onRiskyCss: "warning",
  allowExperimentalFallback: false,
  allowPreviewOnlyInCopy: false,
};

fallbackVariantPolicySchema.parse(RELEASE1_FALLBACK_VARIANT_POLICY);

/** Legacy alias — not part of the primary CopySafety model. */
const COPY_SAFETY_LEGACY_ALIASES: Record<string, CopySafety> = {
  safe: "strict",
  risky: "balanced",
};

export function normalizeCopySafetyInput(
  value: string,
): CopySafety | undefined {
  if (value in COPY_SAFETY_LEGACY_ALIASES) {
    return COPY_SAFETY_LEGACY_ALIASES[value];
  }
  if (value === "strict" || value === "balanced" || value === "preview_only") {
    return value;
  }
  return undefined;
}

function isErrorSeverity(severity: StyleValidationSeverity): boolean {
  return severity === "error";
}

export function buildStyleValidationResult(
  issues: StyleValidationIssue[],
): StyleValidationResult {
  const result: StyleValidationResult = {
    ok: !issues.some((issue) => isErrorSeverity(issue.severity)),
    issues,
  };
  styleValidationResultSchema.parse(result);
  return result;
}

function pushIssue(
  issues: StyleValidationIssue[],
  issue: StyleValidationIssue,
): void {
  styleValidationIssueSchema.parse(issue);
  issues.push(issue);
}

function compatibilityIssueToStyleValidationIssue(
  issue: CompatibilityIssue,
  variant: VariantDefinition,
): StyleValidationIssue {
  return {
    severity: issue.severity === "error" ? "error" : "warning",
    code: issue.code,
    message: issue.message,
    variantId: variant.id,
    blockType: variant.blockType,
    property: issue.property,
    value: issue.value,
  };
}

function resolveIssueToStyleValidationIssue(
  issue: StyleResolveIssue,
): StyleValidationIssue {
  const severity =
    issue.code === "variant_not_found" ||
    issue.code === "variant_block_type_mismatch" ||
    issue.code === "no_variant_for_block_type"
      ? "warning"
      : "warning";

  return {
    severity,
    code: issue.code,
    message: issue.message,
    blockId: issue.blockId,
  };
}

function isAutomaticFallbackCandidate(variant: VariantDefinition): boolean {
  if (variant.id === MAGAZINE_LEFT_BAR_TITLE_ID) {
    return false;
  }
  if (variant.status === "experimental") {
    return false;
  }
  if (variant.compatibility?.copySafety === "preview_only") {
    return false;
  }
  return true;
}

function validateVariantStatusRules(
  variant: VariantDefinition,
  issues: StyleValidationIssue[],
): void {
  if (
    variant.id === MAGAZINE_LEFT_BAR_TITLE_ID &&
    variant.status === "release1_required"
  ) {
    pushIssue(issues, {
      severity: "error",
      code: "magazine_left_bar_title_not_required",
      message:
        "magazine_left_bar_title must not be release1_required (candidate only)",
      variantId: variant.id,
      blockType: variant.blockType,
      path: ["status"],
    });
  }
}

export function validateVariantForWechatCopy(
  variant: VariantDefinition,
  profile: WeChatCompatibilityProfile = WECHAT_MP_COMPATIBILITY_PROFILE,
  policy: FallbackVariantPolicy = RELEASE1_FALLBACK_VARIANT_POLICY,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const copySafety = variant.compatibility?.copySafety;
  const wechatResult = validateVariantWechatCompatibility(variant, profile);

  for (const issue of wechatResult.issues) {
    const styleIssue = compatibilityIssueToStyleValidationIssue(issue, variant);
    pushIssue(issues, styleIssue);
  }

  if (
    copySafety === "preview_only" &&
    !policy.allowPreviewOnlyInCopy
  ) {
    const alreadyReported = issues.some(
      (issue) => issue.code === "preview_only_copy_path_blocked",
    );
    if (!alreadyReported) {
      pushIssue(issues, {
        severity:
          variant.status === "release1_candidate" ? "warning" : "error",
        code: "preview_only_copy_path_blocked",
        message:
          "preview_only variants are blocked from default copy-safe path in Release 1",
        variantId: variant.id,
        blockType: variant.blockType,
      });
    }
  }

  if (
    variant.status === "release1_required" &&
    copySafety === "strict" &&
    variant.compatibility?.wechat?.riskyCssProperties?.length
  ) {
    pushIssue(issues, {
      severity: "error",
      code: "strict_copy_safety_risky_css",
      message:
        "strict copySafety does not allow declared risky CSS on release1_required variants",
      variantId: variant.id,
      blockType: variant.blockType,
      path: ["compatibility", "wechat", "riskyCssProperties"],
    });
  }

  if (
    policy.onForbiddenCss === "fallback_variant" &&
    issues.some((issue) => issue.code.includes("forbidden"))
  ) {
    pushIssue(issues, {
      severity: "warning",
      code: "forbidden_css_fallback_variant",
      message: "Forbidden CSS requires fallback variant per policy",
      variantId: variant.id,
      fallbackVariantId: policy.defaultFallbackVariantId,
    });
  }

  if (
    policy.onRiskyCss === "fallback_variant" &&
    issues.some((issue) => issue.code.includes("risky"))
  ) {
    pushIssue(issues, {
      severity: "warning",
      code: "risky_css_fallback_variant",
      message: "Risky CSS requires fallback variant per policy",
      variantId: variant.id,
      fallbackVariantId: policy.defaultFallbackVariantId,
    });
  }

  return buildStyleValidationResult(issues);
}

export function validateVariantDefinition(
  variant: VariantDefinition,
  context: ValidateVariantDefinitionContext = {},
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const profile = context.profile ?? WECHAT_MP_COMPATIBILITY_PROFILE;
  const policy = context.policy ?? RELEASE1_FALLBACK_VARIANT_POLICY;

  const parsed = variantDefinitionSchema.safeParse(variant);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      pushIssue(issues, {
        severity: "error",
        code: "variant_schema_invalid",
        message: issue.message,
        variantId: typeof variant.id === "string" ? variant.id : undefined,
        path: issue.path.map(String),
      });
    }
    return buildStyleValidationResult(issues);
  }

  validateVariantStatusRules(parsed.data, issues);

  const wechatValidation = validateVariantForWechatCopy(
    parsed.data,
    profile,
    policy,
  );
  issues.push(...wechatValidation.issues);

  if (context.registry && parsed.data.compatibility?.wechat?.fallbackVariantId) {
    const fallbackVariant = getVariantById(
      context.registry,
      parsed.data.compatibility.wechat.fallbackVariantId,
    );
    if (!fallbackVariant) {
      pushIssue(issues, {
        severity: "error",
        code: "fallback_variant_not_found",
        message: `Fallback variant "${parsed.data.compatibility.wechat.fallbackVariantId}" not found in registry`,
        variantId: parsed.data.id,
        fallbackVariantId: parsed.data.compatibility.wechat.fallbackVariantId,
      });
    } else if (!isAutomaticFallbackCandidate(fallbackVariant)) {
      pushIssue(issues, {
        severity: "error",
        code: "fallback_variant_not_allowed",
        message: `Fallback variant "${fallbackVariant.id}" is not an allowed automatic fallback candidate`,
        variantId: parsed.data.id,
        fallbackVariantId: fallbackVariant.id,
      });
    }
  }

  const layoutValidation = validateTitleBlockLayoutCompatibility(parsed.data);
  issues.push(...layoutValidation.issues);

  return buildStyleValidationResult(issues);
}

export function validateStyleRegistry(
  registry: StyleRegistry,
  options: ValidateStyleRegistryOptions = {},
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const profile = options.profile ?? WECHAT_MP_COMPATIBILITY_PROFILE;
  const policy = options.policy ?? RELEASE1_FALLBACK_VARIANT_POLICY;

  const schemaResult = validateStyleRegistrySchema(registry);
  if (!schemaResult.ok) {
    for (const issue of schemaResult.issues) {
      pushIssue(issues, {
        severity: "error",
        code: issue.code,
        message: issue.message,
        path: issue.path.map(String),
      });
    }
    return buildStyleValidationResult(issues);
  }

  const validatedRegistry = schemaResult.data;
  const themeIds = new Set<string>();
  for (const theme of validatedRegistry.themes) {
    if (themeIds.has(theme.id)) {
      pushIssue(issues, {
        severity: "error",
        code: "duplicate_theme_id",
        message: `Duplicate theme id "${theme.id}"`,
        path: ["themes"],
      });
    }
    themeIds.add(theme.id);
  }

  const presetIds = new Set<string>();
  for (const preset of validatedRegistry.presets) {
    if (presetIds.has(preset.id)) {
      pushIssue(issues, {
        severity: "error",
        code: "duplicate_preset_id",
        message: `Duplicate preset id "${preset.id}"`,
        path: ["presets"],
      });
    }
    presetIds.add(preset.id);

    if (!validatedRegistry.themes.some((theme) => theme.id === preset.themeId)) {
      pushIssue(issues, {
        severity: "error",
        code: "preset_theme_not_found",
        message: `Preset "${preset.id}" references missing theme "${preset.themeId}"`,
        path: ["presets", preset.id, "themeId"],
      });
    }

    if (preset.defaultVariantByBlockType) {
      for (const [blockType, variantId] of Object.entries(
        preset.defaultVariantByBlockType,
      )) {
        if (!variantId) {
          continue;
        }
        const variant = getVariantById(validatedRegistry, variantId);
        if (!variant) {
          pushIssue(issues, {
            severity: "error",
            code: "preset_default_variant_not_found",
            message: `Preset "${preset.id}" default variant "${variantId}" not found`,
            path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          });
          continue;
        }
        if (variant.blockType !== blockType) {
          pushIssue(issues, {
            severity: "error",
            code: "preset_default_variant_block_type_mismatch",
            message: `Preset "${preset.id}" default variant "${variantId}" blockType mismatch for ${blockType}`,
            path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          });
        }
      }
    }
  }

  const variantIds = new Set<string>();
  for (const variant of validatedRegistry.variants) {
    if (variantIds.has(variant.id)) {
      pushIssue(issues, {
        severity: "error",
        code: "duplicate_variant_id",
        message: `Duplicate variant id "${variant.id}"`,
        path: ["variants"],
      });
    }
    variantIds.add(variant.id);

    const variantResult = validateVariantDefinition(variant, {
      registry: validatedRegistry,
      profile,
      policy,
    });
    issues.push(...variantResult.issues);
  }

  return buildStyleValidationResult(issues);
}

function validateResolvedBlockStyle(
  block: ResolvedBlockStyle,
  context: ValidateResolvedArticleStyleContext,
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];
  const policy = context.policy ?? RELEASE1_FALLBACK_VARIANT_POLICY;
  const profile = context.profile ?? WECHAT_MP_COMPATIBILITY_PROFILE;

  const variantValidation = validateVariantForWechatCopy(
    block.variant,
    profile,
    policy,
  );
  for (const issue of variantValidation.issues) {
    pushIssue(issues, {
      ...issue,
      blockId: block.blockId,
      blockType: block.blockType,
      variantId: block.variantId,
    });
  }

  if (block.source === "fallback") {
    pushIssue(issues, {
      severity: "warning",
      code: "variant_resolve_fallback",
      message:
        block.fallbackReason ??
        `Block resolved via fallback variant "${block.variantId}"`,
      blockId: block.blockId,
      blockType: block.blockType,
      variantId: block.variantId,
      fallbackVariantId: block.variantId,
    });
  }

  if (
    block.variant.status === "experimental" &&
    !policy.allowExperimentalFallback
  ) {
    pushIssue(issues, {
      severity: "error",
      code: "experimental_variant_in_copy_path",
      message: `Experimental variant "${block.variantId}" must not be used in copy path`,
      blockId: block.blockId,
      blockType: block.blockType,
      variantId: block.variantId,
    });
  }

  if (block.variant.id === MAGAZINE_LEFT_BAR_TITLE_ID && block.source === "fallback") {
    pushIssue(issues, {
      severity: "error",
      code: "magazine_left_bar_title_not_default_fallback",
      message:
        "magazine_left_bar_title must not be used as automatic fallback variant",
      blockId: block.blockId,
      blockType: block.blockType,
      variantId: block.variantId,
    });
  }

  return issues;
}

export function validateResolvedArticleStyle(
  resolvedArticleStyle: ResolvedArticleStyle,
  context: ValidateResolvedArticleStyleContext = {},
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const policy = context.policy ?? RELEASE1_FALLBACK_VARIANT_POLICY;

  for (const block of resolvedArticleStyle.blocks) {
    issues.push(...validateResolvedBlockStyle(block, context));
  }

  for (const resolveIssue of resolvedArticleStyle.issues ?? []) {
    const mapped = resolveIssueToStyleValidationIssue(resolveIssue);
    if (resolveIssue.code === "variant_not_found") {
      mapped.severity =
        policy.onMissingVariant === "error" ? "error" : "warning";
    }
    if (resolveIssue.code === "variant_block_type_mismatch") {
      mapped.severity =
        policy.onBlockTypeMismatch === "error" ? "error" : "warning";
    }
    pushIssue(issues, mapped);
  }

  return buildStyleValidationResult(issues);
}

export function parseFallbackVariantPolicy(
  input: unknown,
): FallbackVariantPolicy {
  return fallbackVariantPolicySchema.parse(input);
}

export function parseStyleValidationResult(
  input: unknown,
): StyleValidationResult {
  return styleValidationResultSchema.parse(input);
}
