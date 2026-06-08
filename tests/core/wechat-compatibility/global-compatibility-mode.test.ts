import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { collectCopySafeHtmlViolations } from "@/core/copy/copy-safe-html";
import { dslStyleToInlineCss } from "@/core/dsl/decoder/render-style";
import { validateWechatCopyHtml } from "@/core/wechat-compat/copy-html-validator";
import {
  filterAllowedInlineStyles,
  validateHtmlStructureCompatibility,
} from "@/core/wechat-compatibility";
import {
  DEFAULT_WECHAT_COMPATIBILITY_MODE,
  getWechatCompatibilityMode,
  isWechatCompatibilityActive,
  parseWechatCompatibilityMode,
  WECHAT_COMPATIBILITY_MODE_ENV_VARS,
} from "@/core/wechat-compatibility/resolve-wechat-compatibility-mode";

const ENV_KEYS = [
  WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary,
  WECHAT_COMPATIBILITY_MODE_ENV_VARS.public,
  WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest,
] as const;

const originalEnv: Record<(typeof ENV_KEYS)[number], string | undefined> = {
  [WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary]: undefined,
  [WECHAT_COMPATIBILITY_MODE_ENV_VARS.public]: undefined,
  [WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest]: undefined,
};

function snapshotEnv() {
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
  }
}

function restoreEnv() {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }
}

function setGlobalMode(mode: string | undefined, envKey = WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary) {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
  if (mode !== undefined) {
    process.env[envKey] = mode;
  }
}

describe("global WeChat compatibility mode", () => {
  beforeEach(() => {
    snapshotEnv();
  });

  afterEach(() => {
    restoreEnv();
  });

  it("defaults to off when env is unset or invalid", () => {
    setGlobalMode(undefined);
    expect(getWechatCompatibilityMode()).toBe("off");
    expect(parseWechatCompatibilityMode(undefined)).toBe(DEFAULT_WECHAT_COMPATIBILITY_MODE);
    expect(parseWechatCompatibilityMode("bogus")).toBe("off");
    expect(isWechatCompatibilityActive()).toBe(false);
  });

  it("reads primary env before public and legacy aliases", () => {
    process.env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary] = "enforce";
    process.env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.public] = "report";
    process.env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest] = "off";
    expect(getWechatCompatibilityMode()).toBe("enforce");
  });

  it("falls back to public env for browser decode", () => {
    setGlobalMode("report", WECHAT_COMPATIBILITY_MODE_ENV_VARS.public);
    expect(getWechatCompatibilityMode()).toBe("report");
    expect(isWechatCompatibilityActive()).toBe(true);
  });

  it("falls back to legacy harvest env alias", () => {
    setGlobalMode("enforce", WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest);
    expect(getWechatCompatibilityMode()).toBe("enforce");
  });

  describe("mode=off gates validation and copy shaping", () => {
    beforeEach(() => {
      setGlobalMode("off");
    });

    it("passes validateWechatCopyHtml for red/yellow HTML", () => {
      const result = validateWechatCopyHtml({
        html: '<p class="x" style="display:flex;position:absolute;"><script/></p>',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("passes validateHtmlStructureCompatibility", () => {
      const result = validateHtmlStructureCompatibility(
        '<section style="display:flex"><script/></section>',
      );
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("does not filter disallowed inline styles", () => {
      const styles = filterAllowedInlineStyles({
        display: "flex",
        "border-radius": "8px",
        color: "#333",
      });
      expect(styles).toEqual({
        display: "flex",
        "border-radius": "8px",
        color: "#333",
      });
    });

    it("skips copy-safe-html violations", () => {
      expect(
        collectCopySafeHtmlViolations(
          '<p class="x" style="display:flex;position:absolute;transform:scale(1);">t</p>',
        ),
      ).toEqual([]);
    });

    it("preserves flex display and split border styles in copy decode", () => {
      const css = dslStyleToInlineCss(
        {
          display: "flex",
          borderWidth: "0 0 2px",
          borderColor: "#2563eb",
          borderStyle: "solid",
        },
        "copy_wechat",
      );
      expect(css).toContain("display: flex");
      expect(css).toContain("border-width: 0 0 2px");
      expect(css).not.toContain("border-bottom:");
    });
  });

  describe("mode=enforce preserves existing validation behavior", () => {
    beforeEach(() => {
      setGlobalMode("enforce");
    });

    it("reports red tags via validateWechatCopyHtml", () => {
      const result = validateWechatCopyHtml({ html: "<script>alert(1)</script>" });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("filters disallowed inline styles", () => {
      const styles = filterAllowedInlineStyles({
        transform: "translateX(10px)",
        color: "#333",
      });
      expect(styles.transform).toBeUndefined();
      expect(styles.color).toBe("#333");
    });

    it("collects copy-safe-html violations", () => {
      const violations = collectCopySafeHtmlViolations(
        '<p class="x" style="display:flex;">t</p>',
      );
      expect(violations.some((v) => v.code === "class_attribute")).toBe(true);
      expect(violations.some((v) => v.code === "flex_or_grid_layout")).toBe(true);
    });
  });
});
