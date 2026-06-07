import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

/** Canonical sourceType values for new imports — legacy enum values must not be used. */
export const CANONICAL_SOURCE_TYPES = [
  "registry",
  "html_paste",
  "harvest",
  "manual",
  "ai_generated",
  "unknown",
] as const;

export const LEGACY_SOURCE_TYPES = ["style_library_manifest"] as const;

export type RuntimeVariantQualityStatus =
  | "not_checked"
  | "validator_pass"
  | "validator_failed"
  | "copy_fidelity_failed"
  | "paste_qa_pass"
  | "blocked";

export const COPY_FIDELITY_FAILED_HEADING_IDS = [
  "heading_magazine_left_bar",
  "heading_card_centered",
] as const;

export const USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS = [
  "heading_short_line",
  "heading_highlight_marker",
  "heading_icon_prefix",
  "heading_minimal_number",
  "heading_magazine_offset",
  "heading_numbered_section",
] as const;

export const USER_SELECTABLE_HTML_PASTE_HEADING_ID =
  "heading_teal_section_label_html_paste_candidate";

export type RuntimeVariantSeedOverride = {
  sourceType?: "registry" | "html_paste" | "harvest" | "manual" | "unknown";
  sourceCohort?: string;
  qualityStatus: RuntimeVariantQualityStatus;
  distribution: {
    userSelectable: boolean;
    defaultEligible: boolean;
    release1Required: boolean;
    hidden: boolean;
    deprecated: boolean;
  };
};

const RELEASE1_HEADING_PUBLISH_SET = new Set<string>(HEADING_PUBLISH_VARIANT_IDS);

export function resolveRuntimeVariantSeedOverride(
  runtimeVariantId: string,
): RuntimeVariantSeedOverride | undefined {
  if (runtimeVariantId === USER_SELECTABLE_HTML_PASTE_HEADING_ID) {
    return {
      sourceType: "html_paste",
      sourceCohort: "s9_html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
      },
    };
  }

  if (
    (COPY_FIDELITY_FAILED_HEADING_IDS as readonly string[]).includes(runtimeVariantId)
  ) {
    return {
      sourceType: "registry",
      sourceCohort: "release1_required",
      qualityStatus: "copy_fidelity_failed",
      distribution: {
        userSelectable: false,
        defaultEligible: false,
        release1Required: true,
        hidden: false,
        deprecated: false,
      },
    };
  }

  if (
    (USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS as readonly string[]).includes(
      runtimeVariantId,
    )
  ) {
    return {
      sourceType: "registry",
      sourceCohort: "release1_required",
      qualityStatus: "paste_qa_pass",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: true,
        hidden: false,
        deprecated: false,
      },
    };
  }

  if (RELEASE1_HEADING_PUBLISH_SET.has(runtimeVariantId)) {
    return {
      sourceType: "registry",
      sourceCohort: "release1_required",
      qualityStatus: "not_checked",
      distribution: {
        userSelectable: false,
        defaultEligible: false,
        release1Required: true,
        hidden: false,
        deprecated: false,
      },
    };
  }

  return undefined;
}

export function getCodeBackedRuntimeAvailableVariantIds(): ReadonlySet<string> {
  return new Set([
    USER_SELECTABLE_HTML_PASTE_HEADING_ID,
    ...USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS,
  ]);
}
