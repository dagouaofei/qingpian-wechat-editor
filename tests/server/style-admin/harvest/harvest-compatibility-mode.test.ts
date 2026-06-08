import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import {
  DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE,
  parseHarvestWechatCompatibilityMode,
} from "@/core/wechat-compatibility/harvest-compat-mode";
import { getHarvestWechatCompatibilityMode } from "@/server/style-admin/harvest/harvest-compatibility-mode";
import { buildCandidateVariantDraft } from "@/server/style-admin/harvest/build-candidate-variant";
import { previewHtmlHarvestCandidate } from "@/server/style-admin/harvest/create-html-harvest-candidate";

import { BORDERED_HEADING_HTML } from "../../../fixtures/dsl/bordered-heading-html";
import { COMPLEX_HEADING_HTML } from "../../../fixtures/dsl/complex-heading-html";

const originalMode = process.env.STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE;
const originalGlobalMode = process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE;
const originalPublicMode = process.env.NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE;

function setHarvestMode(mode: string | undefined) {
  delete process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE;
  delete process.env.NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE;
  if (mode === undefined) {
    delete process.env.STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE;
  } else {
    process.env.STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE = mode;
  }
}

function setGlobalMode(mode: string | undefined) {
  delete process.env.STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE;
  if (mode === undefined) {
    delete process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE;
  } else {
    process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE = mode;
  }
}

const DOWNGRADE_CODES = [
  "flex_layout_downgraded",
  "letter_spacing_risky",
  "negative_margin_normalized",
  "deep_nesting_flattened",
];

describe("harvest WeChat compatibility mode", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    setHarvestMode(originalMode);
    if (originalGlobalMode === undefined) {
      delete process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE;
    } else {
      process.env.QINGPIAN_WECHAT_COMPATIBILITY_MODE = originalGlobalMode;
    }
    if (originalPublicMode === undefined) {
      delete process.env.NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE;
    } else {
      process.env.NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE = originalPublicMode;
    }
  });

  it("defaults to off when env is unset or invalid", () => {
    setHarvestMode(undefined);
    expect(getHarvestWechatCompatibilityMode()).toBe("off");
    expect(parseHarvestWechatCompatibilityMode(undefined)).toBe(DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE);
    expect(parseHarvestWechatCompatibilityMode("bogus")).toBe("off");
  });

  it("reads off/report/enforce from global env", () => {
    setGlobalMode("off");
    expect(getHarvestWechatCompatibilityMode()).toBe("off");
    setGlobalMode("enforce");
    expect(getHarvestWechatCompatibilityMode()).toBe("enforce");
  });

  it("reads legacy STYLE_HARVEST env when global env is unset", () => {
    setHarvestMode("report");
    expect(getHarvestWechatCompatibilityMode()).toBe("report");
  });

  it("mode=off still removes script and onclick via sanitize", () => {
    setGlobalMode("off");
    const html = `<section onclick="alert(1)"><script>alert(1)</script><span style="display:flex;letter-spacing:2px;font-size:18px;font-weight:700;">标题</span></section>`;
    const { lossReport, draft, canCreateCandidate, sanitizeLossReport } = buildCandidateVariantDraft(
      html,
      { sourceLabel: "security off mode" },
      "heading",
    );

    expect(draft).not.toBeNull();
    expect(canCreateCandidate).toBe(true);
    expect(sanitizeLossReport.some((entry) => entry.code === "security_removed")).toBe(true);
    expect(lossReport.some((entry) => entry.code === "security_removed")).toBe(true);
    expect(draft?.sanitizedHtml).not.toMatch(/onclick|script/i);
  });

  it("mode=off does not emit flex/letter-spacing compatibility downgrade loss", () => {
    setGlobalMode("off");
    const { issues, encoderLossReport, draft } = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "complex off",
    });

    expect(draft).not.toBeNull();
    expect(issues.some((issue) => issue.severity === "blocking")).toBe(false);
    expect(
      issues.filter((issue) => issue.path?.startsWith("tag:") || issue.path?.startsWith("style:")),
    ).toHaveLength(0);
    for (const code of DOWNGRADE_CODES) {
      expect(encoderLossReport.some((entry) => entry.code === code)).toBe(false);
    }
    expect(encoderLossReport.some((entry) => entry.code === "style_downgraded")).toBe(false);
    expect(encoderLossReport.some((entry) => entry.code === "tag_downgraded")).toBe(false);
  });

  it("mode=off preserves bordered heading border styles in DSL tokens", () => {
    setGlobalMode("off");
    const { draft } = buildCandidateVariantDraft(BORDERED_HEADING_HTML, {
      sourceLabel: "bordered off",
    });
    expect(draft).not.toBeNull();
    const definition = draft?.definitionJson as {
      meta?: { styleTokens?: Record<string, string>; compatibilityMode?: string };
      harvestMeta?: { wechatCompatibilityMode?: string };
    };
    expect(definition?.harvestMeta).toBeUndefined();
    expect(definition?.meta?.compatibilityMode).toBe("off");
    expect(definition?.meta?.styleTokens?.border).toContain("#2563eb");
    expect(definition?.meta?.styleTokens?.borderLeft).toContain("4px");
    expect(definition?.meta?.styleTokens?.borderRadius).toBe("8px");
    expect(definition?.meta?.styleTokens?.padding).toBe("14px 18px");
  });

  it("mode=report reports compatibility issues without transform downgrade loss", () => {
    setGlobalMode("report");
    const { issues, compatibilityTransformLossReport, draft } = buildCandidateVariantDraft(
      COMPLEX_HEADING_HTML,
      { sourceLabel: "complex report" },
    );

    expect(draft).not.toBeNull();
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.severity === "blocking")).toBe(false);
    expect(compatibilityTransformLossReport.some((entry) => entry.code === "style_downgraded")).toBe(
      false,
    );
    expect(compatibilityTransformLossReport.some((entry) => entry.code === "tag_downgraded")).toBe(
      false,
    );
  });

  it("mode=report DSL tree matches off mode", () => {
    setGlobalMode("off");
    const offDraft = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "complex off tree",
    }).draft;
    setGlobalMode("report");
    const reportDraft = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "complex report tree",
    }).draft;

    const offTree = (offDraft?.definitionJson as { tree?: unknown })?.tree;
    const reportTree = (reportDraft?.definitionJson as { tree?: unknown })?.tree;
    expect(JSON.stringify(reportTree)).toBe(JSON.stringify(offTree));
  });

  it("mode=enforce may record transform downgrade loss", () => {
    setGlobalMode("enforce");
    const { compatibilityTransformLossReport } = buildCandidateVariantDraft(
      `<div style="font-size:18px;font-weight:700;">标题</div>`,
      { sourceLabel: "enforce downgrade" },
      "heading",
    );
    expect(
      compatibilityTransformLossReport.some(
        (entry) => entry.code === "tag_downgraded" || entry.code === "style_downgraded",
      ),
    ).toBe(true);
  });

  it("fidelity encoder does not apply enforce transform during encode", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: `<div style="font-size:18px;font-weight:700;">标题</div>`,
      runtimeVariantId: "heading_html_paste_enforce_mode_candidate",
      blockType: "heading",
      wechatCompatibilityMode: "enforce",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(
      encoded.issues.some(
        (issue) =>
          issue.code === "sanitize_transform" ||
          issue.message.toLowerCase().includes("downgraded"),
      ),
    ).toBe(false);
  });

  it("harvest preview trace includes wechatCompatibilityMode", () => {
    setGlobalMode("report");
    const preview = previewHtmlHarvestCandidate({ rawHtml: BORDERED_HEADING_HTML });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    expect(preview.wechatCompatibilityMode).toBe("report");
    expect(preview.trace?.wechatCompatibilityMode).toBe("report");
  });

  it("compatibilityJson stores wechatCompatibilityMode and separates encoder loss", () => {
    setGlobalMode("off");
    const { draft, encoderLossReport } = buildCandidateVariantDraft(BORDERED_HEADING_HTML, {
      sourceLabel: "bordered metadata",
    });
    const compatibility = draft?.compatibilityJson as {
      wechatCompatibilityMode?: string;
      encoderLossReport?: { code: string }[];
      compatibilityIssues?: unknown[];
    };
    expect(compatibility?.wechatCompatibilityMode).toBe("off");
    expect(compatibility?.compatibilityIssues).toEqual([]);
    expect(compatibility?.encoderLossReport?.map((entry) => entry.code)).toEqual(
      encoderLossReport.map((entry) => entry.code),
    );
  });

  it("mode=off chapter heading keeps semantic layoutIntent without compatibility downgrade loss", () => {
    setGlobalMode("off");
    const { draft, encoderLossReport } = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "chapter off",
    });
    const definition = draft?.definitionJson as {
      meta?: { layoutIntent?: string; extractedSlots?: Record<string, string> };
    };
    expect(definition?.meta?.layoutIntent).toBe("chapter_overlay_heading");
    expect(definition?.meta?.extractedSlots?.title).toBe("怎么用");
    for (const code of DOWNGRADE_CODES) {
      expect(encoderLossReport.some((entry) => entry.code === code)).toBe(false);
    }
  });

  it("preview exposes sanitize, encoder, and compatibility transform loss separately", () => {
    setGlobalMode("off");
    const preview = previewHtmlHarvestCandidate({ rawHtml: BORDERED_HEADING_HTML });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    expect(Array.isArray(preview.sanitizeLossReport)).toBe(true);
    expect(Array.isArray(preview.encoderLossReport)).toBe(true);
    expect(Array.isArray(preview.compatibilityTransformLossReport)).toBe(true);
  });
});
