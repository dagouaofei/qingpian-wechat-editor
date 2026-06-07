import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { PreviewStyleControls } from "@/components/preview/preview-style-controls";
import {
  buildPreviewHeadingStyleOptionsFromPool,
  buildUserSelectableHeadingOptionsFromPool,
  isVariantInUserSelectablePool,
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

  it("uses database pool only without mixing release1 publish pool", () => {
    const options = buildPreviewHeadingStyleOptionsFromPool(databasePool);
    expect(options).toHaveLength(1);
    expect(options[0]?.source).toBe("database");
    expect(options.some((option) => option.id === "heading_short_line")).toBe(false);
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
  });

  it("tracks pool membership by snapshot ids", () => {
    expect(
      isVariantInUserSelectablePool("heading_teal_section_label_html_paste_candidate", databasePool),
    ).toBe(true);
    expect(isVariantInUserSelectablePool("heading_short_line", databasePool)).toBe(false);
  });
});
