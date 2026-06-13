import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { PreviewStyleControls } from "@/components/preview/preview-style-controls";
import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";
import {
  buildPreviewHeadingStyleOptionsFromPool,
  buildUserSelectableHeadingOptionsFromPool,
  isVariantInUserSelectablePool,
  resolvePreviewHeadingStyleOptions,
} from "@/lib/preview-user-selectable-pool";
import { DEFAULT_PREVIEW_STYLE_CONTROL } from "@/lib/preview-style-controls";
import { headingTealSectionLabelHtmlPasteCandidate } from "@/core/styles/variants/html-paste-candidate-variants";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";

const databasePool: UserSelectableVariantPoolSnapshot = {
  source: "database",
  cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T00:00:00.000Z" },
  variants: [headingTealSectionLabelHtmlPasteCandidate],
  poolVariantIds: [headingTealSectionLabelHtmlPasteCandidate.id],
  issues: [],
};

describe("preview-user-selectable-pool", () => {
  it("builds heading options from database pool", () => {
    const options = buildUserSelectableHeadingOptionsFromPool(databasePool);
    expect(options).toHaveLength(1);
    expect(options[0]?.id).toBe("heading_teal_section_label_html_paste_candidate");
    expect(options[0]?.source).toBe("database");
  });

  it("deduplicates heading options by runtimeVariantId", () => {
    const duplicatePool: UserSelectableVariantPoolSnapshot = {
      ...databasePool,
      variants: [
        headingTealSectionLabelHtmlPasteCandidate,
        { ...headingTealSectionLabelHtmlPasteCandidate },
      ],
      poolVariantIds: [
        headingTealSectionLabelHtmlPasteCandidate.id,
        headingTealSectionLabelHtmlPasteCandidate.id,
      ],
    };

    expect(buildUserSelectableHeadingOptionsFromPool(duplicatePool)).toHaveLength(1);
  });

  it("uses database pool only without mixing release1 publish pool", () => {
    const options = buildPreviewHeadingStyleOptionsFromPool(databasePool);
    expect(options).toHaveLength(1);
    expect(options[0]?.source).toBe("database");
    expect(options.some((option) => option.id === "heading_short_line")).toBe(false);
  });

  it("resolvePreviewHeadingStyleOptions keeps database pool only on user preview", () => {
    const dbOptions = buildUserSelectableHeadingOptionsFromPool(databasePool);
    const resolved = resolvePreviewHeadingStyleOptions({
      includeUserSelectableHeadingOptions: true,
      userSelectableHeadingOptions: dbOptions,
      userSelectablePool: databasePool,
    });

    expect(resolved).toHaveLength(1);
    expect(resolved.some((option) => option.id === "heading_short_line")).toBe(false);
    for (const release1Id of HEADING_PUBLISH_VARIANT_IDS) {
      expect(resolved.some((option) => option.id === release1Id)).toBe(false);
    }
  });

  it("does not fall back to release1 publish pool when database pool is empty", () => {
    const emptyPool: UserSelectableVariantPoolSnapshot = {
      source: "empty",
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [],
      poolVariantIds: [],
      issues: [],
    };

    const resolved = resolvePreviewHeadingStyleOptions({
      includeUserSelectableHeadingOptions: true,
      userSelectableHeadingOptions: [],
      userSelectablePool: emptyPool,
    });

    expect(resolved).toEqual([]);
    for (const release1Id of HEADING_PUBLISH_VARIANT_IDS) {
      expect(resolved.some((option) => option.id === release1Id)).toBe(false);
    }
  });

  it("does not merge release1 publish pool with partial userSelectable options", () => {
    const dbOptions = buildUserSelectableHeadingOptionsFromPool(databasePool);
    const codeFallbackPool: UserSelectableVariantPoolSnapshot = {
      source: "code_fallback",
      cache: { hit: false, ttlSeconds: 0, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [],
      poolVariantIds: [],
      issues: [],
    };

    const resolved = resolvePreviewHeadingStyleOptions({
      includeUserSelectableHeadingOptions: true,
      userSelectableHeadingOptions: dbOptions,
      userSelectablePool: codeFallbackPool,
    });

    expect(resolved).toHaveLength(1);
    expect(resolved.some((option) => option.id === "heading_short_line")).toBe(false);
  });

  it("renders DB pool variant in preview style controls", () => {
    const html = renderToStaticMarkup(
      <PreviewStyleControls
        value={DEFAULT_PREVIEW_STYLE_CONTROL}
        onChange={() => {}}
        userSelectableHeadingOptions={buildUserSelectableHeadingOptionsFromPool(databasePool)}
        userSelectablePool={databasePool}
        poolSourceNotice="User-selectable pool: database (1 variants · cache TTL 120s)"
      />,
    );

    expect(html).toContain("heading_teal_section_label_html_paste_candidate");
    expect(html).toContain('data-testid="preview-user-selectable-pool-notice"');
    expect(html).toContain("database (1 variants");
    expect(html).not.toContain("heading_short_line");
  });

  it("returns empty options when no pool snapshot and no explicit options", () => {
    const resolved = resolvePreviewHeadingStyleOptions({
      includeUserSelectableHeadingOptions: true,
    });

    expect(resolved).toEqual([]);
  });

  it("tracks pool membership by snapshot ids", () => {
    expect(
      isVariantInUserSelectablePool("heading_teal_section_label_html_paste_candidate", databasePool),
    ).toBe(true);
    expect(isVariantInUserSelectablePool("heading_short_line", databasePool)).toBe(false);
  });
});
