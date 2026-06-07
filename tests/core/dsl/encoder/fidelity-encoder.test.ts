import { describe, expect, it } from "vitest";

import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { collectFidelityStyleSnapshot } from "@/core/dsl/encoder/fidelity-html-tree";
import { dslRuntimeTraceFixtureArticle, pickTraceFixtureBlock } from "@/lib/dsl-runtime/trace-fixture-article";
import type { VariantDslV1 } from "@/core/dsl/runtime/dsl-types";

import { BACKGROUND_NUMBER_HEADING_HTML } from "../../../fixtures/dsl/background-number-heading-html";
import { BORDERED_HEADING_HTML } from "../../../fixtures/dsl/bordered-heading-html";
import { COMPLEX_HEADING_HTML } from "../../../fixtures/dsl/complex-heading-html";

const DOWNGRADE_CODES = [
  "flex_layout_downgraded",
  "letter_spacing_risky",
  "negative_margin_normalized",
  "deep_nesting_flattened",
];

function encodeHeading(html: string, mode: "off" | "report" | "enforce" = "off") {
  return encodeHtmlToVariantDsl({
    html,
    runtimeVariantId: "heading_fidelity_test_candidate",
    blockType: "heading",
    wechatCompatibilityMode: mode,
  });
}

function styleSnapshot(dsl: VariantDslV1): string {
  return dsl.tree ? collectFidelityStyleSnapshot(dsl.tree) : "";
}

describe("fidelity HTML encoder (mode=off)", () => {
  it("does not emit compatibility downgrade loss codes", () => {
    const encoded = encodeHeading(COMPLEX_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const lossCodes = (encoded.sidecar?.encoderLossReport ?? []).map((entry) => entry.code);
    for (const code of DOWNGRADE_CODES) {
      expect(lossCodes).not.toContain(code);
    }
  });

  it("preserves flex, letter-spacing, negative margin, and font sizes in DSL tree", () => {
    const encoded = encodeHeading(COMPLEX_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const snapshot = styleSnapshot(encoded.value);
    expect(snapshot).toContain("display");
    expect(snapshot).toMatch(/flex/i);
    expect(snapshot).toMatch(/letterSpacing.*2\.6px|letter-spacing.*2\.6px/i);
    expect(snapshot).toMatch(/letterSpacing.*-3px|-3px/);
    expect(snapshot).toMatch(/letterSpacing.*-0\.8px|-0\.8px/);
    expect(snapshot).toMatch(/letterSpacing.*1\.6px|1\.6px/);
    expect(snapshot).toContain("60px");
    expect(snapshot).toContain("30px");
    expect(snapshot).toContain("11px");
    expect(snapshot).toMatch(/marginTop.*-60px|-60px/);
  });

  it("keeps Variant DSL body clean — no lossReport or compatibilityIssues embedded", () => {
    const encoded = encodeHeading(COMPLEX_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const json = JSON.stringify(encoded.value);
    expect(json).not.toContain("flex_layout_downgraded");
    expect(json).not.toContain("compatibilityIssues");
    expect(json).not.toContain("sanitizeLossReport");
    expect(json).not.toContain("encoderLossReport");
    expect(encoded.value.meta?.encoderVersion).toBe("s10_html_encoder_v4_fidelity");
    expect(encoded.value.meta?.encoderTrace).toBeUndefined();
    expect(encoded.value.meta?.lossReport).toBeUndefined();
  });

  it("preserves bordered heading border styles", () => {
    const encoded = encodeHeading(BORDERED_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const tokens = encoded.value.meta?.styleTokens as Record<string, string> | undefined;
    expect(tokens?.border).toContain("#2563eb");
    expect(tokens?.borderLeft).toContain("4px");
    expect(tokens?.borderRadius).toBe("8px");
    expect(tokens?.padding).toBe("14px 18px");
    expect(tokens?.fontSize).toBe("17px");
  });

  it("decoder preview preserves fidelity styles from DSL", () => {
    const encoded = encodeHeading(COMPLEX_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");
    const articleTitle = "春季敏感肌的饮食和生活习惯";
    (block.content as { text: string }).text = articleTitle;

    const decoded = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
    });
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.html).toMatch(/display\s*:\s*flex/i);
    expect(decoded.html).toMatch(/letter-spacing/i);
    expect(decoded.html).toMatch(/margin-top\s*:\s*-60px/i);
    expect(decoded.html).toContain("60px");
    expect(decoded.html).toContain("30px");
    expect(decoded.html).toContain("03");
    expect(decoded.html).toContain(articleTitle);
    expect(decoded.html).not.toContain("怎么用");
    expect(decoded.substitutionTrace?.substitutedSlot).toBe("title");
    expect(decoded.substitutionTrace?.fallbackUsed).toBe(false);
  });
});

describe("background number heading (fidelity tree + semantic meta)", () => {
  it("extracts number and title without title being overwritten by number", () => {
    const encoded = encodeHeading(BACKGROUND_NUMBER_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const extracted = encoded.value.meta?.extractedSlots as Record<string, string> | undefined;
    expect(extracted?.number).toBe("01");
    expect(extracted?.title).toBe("一、生产力暴击");
    expect(extracted?.title).not.toBe("01");
  });

  it("preserves number span, h2 title, and red accent bar styles in fidelity tree", () => {
    const encoded = encodeHeading(BACKGROUND_NUMBER_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const snapshot = styleSnapshot(encoded.value);
    expect(snapshot).toContain("60px 0 35px");
    expect(snapshot).toContain("84px");
    expect(snapshot).toContain("900");
    expect(snapshot).toContain("#f0f0f0");
    expect(snapshot).toContain("24px");
    expect(snapshot).toContain("#111");
    expect(snapshot).toContain("40px");
    expect(snapshot).toContain("#E60012");
    expect(snapshot).not.toMatch(/"type":"slot"/);
  });

  it("extracts tokens from correct styled elements", () => {
    const encoded = encodeHeading(BACKGROUND_NUMBER_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const tokens = encoded.value.tokens as Record<string, string>;
    expect(tokens.numberColor).toBe("#f0f0f0");
    expect(tokens.titleColor).toBe("#111");
    expect(tokens.accentColor).toBe("#E60012");
  });

  it("writes semanticBindings in meta without replacing runtime tree", () => {
    const encoded = encodeHeading(BACKGROUND_NUMBER_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const bindings = encoded.value.meta?.semanticBindings as Record<
      string,
      { text: string; path: string; tag: string }
    >;
    expect(bindings?.number?.text).toBe("01");
    expect(bindings?.number?.tag).toBe("span");
    expect(bindings?.title?.text).toBe("一、生产力暴击");
    expect(bindings?.title?.tag).toBe("h2");
    expect(JSON.stringify(encoded.value.tree)).not.toContain('"type":"slot"');
  });

  it("decoder preview renders embedded tree text and styles", () => {
    const encoded = encodeHeading(BACKGROUND_NUMBER_HEADING_HTML);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");
    const articleTitle = "春季敏感肌的饮食和生活习惯";
    (block.content as { text: string }).text = articleTitle;

    const decoded = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
    });
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.html).toContain("01");
    expect(decoded.html).toContain(articleTitle);
    expect(decoded.html).not.toContain("一、生产力暴击");
    expect(decoded.html).toMatch(/background-color\s*:\s*#E60012/i);
    expect(decoded.html).toMatch(/font-size\s*:\s*84px/i);
    expect(decoded.substitutionTrace?.slotSubstitutionPath).toBe("meta.semanticBindings.title");
    expect(decoded.substitutionTrace?.slotSubstitutionTargetPath).toBe(
      "tree.children[1].children[0]",
    );
  });
});

describe("fidelity HTML encoder (mode=report vs off)", () => {
  it("produces DSL consistent with off mode", () => {
    const off = encodeHeading(COMPLEX_HEADING_HTML, "off");
    const report = encodeHeading(COMPLEX_HEADING_HTML, "report");
    expect(off.ok).toBe(true);
    expect(report.ok).toBe(true);
    if (!off.ok || !report.ok) return;

    const offTree = JSON.stringify(off.value.tree);
    const reportTree = JSON.stringify(report.value.tree);
    expect(reportTree).toBe(offTree);
  });
});
