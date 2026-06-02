import { describe, expect, it } from "vitest";

import {
  previewHighlightContainerStyle,
  previewInfoCardContainerStyle,
  previewQuoteContainerStyle,
  previewTextBlockContainerStyle,
  previewTitleContainerStyle,
} from "@/core/renderer/preview-visual-styles";

describe("preview-visual-styles", () => {
  it("maps title layout modes to distinct container styles", () => {
    const plain = previewTitleContainerStyle("plain", "title");
    const leftBar = previewTitleContainerStyle("left_bar", "heading");
    const bottomLine = previewTitleContainerStyle("bottom_line", "title");

    expect(plain.textAlign).toBe("center");
    expect(leftBar.borderLeft).toContain("4px solid");
    expect(bottomLine.borderBottom).toContain("1px solid");
  });

  it("maps text block layouts to distinct container styles", () => {
    const plain = previewTextBlockContainerStyle("plain", "paragraph");
    const accentBand = previewTextBlockContainerStyle("accent_band", "lead");
    const softCard = previewTextBlockContainerStyle("soft_card", "paragraph");

    expect(plain.padding).toBeUndefined();
    expect(accentBand.borderLeft).toContain("4px solid");
    expect(softCard.borderRadius).toBe("8px");
  });

  it("maps structured block layouts to distinct container styles", () => {
    const quote = previewQuoteContainerStyle("left_bar");
    const highlight = previewHighlightContainerStyle("accent_band");
    const infoCard = previewInfoCardContainerStyle("warning_note");

    expect(quote.borderLeft).toContain("3px solid");
    expect(highlight.backgroundColor).toBe("var(--preview-bg-band-blue, #f5f7fb)");
    expect(infoCard.backgroundColor).toBe("var(--preview-bg-warning, #fff8e6)");
  });
});
