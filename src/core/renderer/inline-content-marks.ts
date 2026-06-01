import {
  COLOR_TOKEN_REFS,
  type ColorTokenRef,
  isColorTokenRef,
  type ThemeTokens,
} from "@/core/styles";

import { createRendererIssue } from "./issues";
import type { RendererIssue } from "./types";

const SAFE_HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const DEFAULT_TOKEN_CSS: Record<ColorTokenRef, string> = {
  "text.default": "#333333",
  "text.muted": "#666666",
  "text.accent": "#576b95",
  "text.strong": "#111111",
  "brand.primary": "#576b95",
  "brand.secondary": "#888888",
};

/** Article InlineMark semantic token → Style ColorTokenRef（跨模块最小桥接） */
const ARTICLE_SEMANTIC_COLOR_ALIASES: Record<string, ColorTokenRef> = {
  brandPrimary: "brand.primary",
  brandSecondary: "brand.secondary",
  textDefault: "text.default",
  textMuted: "text.muted",
  textAccent: "text.accent",
  textStrong: "text.strong",
};

function resolveColorTokenRef(colorInput: string): ColorTokenRef | null {
  if (isColorTokenRef(colorInput)) {
    return colorInput;
  }

  return ARTICLE_SEMANTIC_COLOR_ALIASES[colorInput] ?? null;
}

export type ResolvedInlineColor = {
  cssColor: string;
  state: "active" | "fallback";
  fallbackReason?: string;
  issue?: RendererIssue;
};

export function resolveInlineMarkColor(options: {
  colorInput: string;
  themeTokens: ThemeTokens;
  defaultColor: string;
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
}): ResolvedInlineColor {
  const { colorInput, themeTokens, defaultColor, blockId, blockType, variantId } =
    options;

  const tokenRef = resolveColorTokenRef(colorInput);
  if (tokenRef != null) {
    const cssColor =
      themeTokens.color?.[tokenRef] ?? DEFAULT_TOKEN_CSS[tokenRef];
    return { cssColor, state: "active" };
  }

  const themeDirectColor = themeTokens.color?.[colorInput];
  if (themeDirectColor != null) {
    return { cssColor: themeDirectColor, state: "active" };
  }

  if (SAFE_HEX_COLOR.test(colorInput)) {
    return { cssColor: colorInput, state: "active" };
  }

  const issue = createRendererIssue({
    code: "unsafe_inline_color",
    message: `InlineMark color "${colorInput}" is not a supported token or safe hex value`,
    severity: "warning",
    blockId,
    blockType,
    variantId,
    details: { colorInput, allowedTokens: COLOR_TOKEN_REFS.join(",") },
  });

  return {
    cssColor: defaultColor,
    state: "fallback",
    fallbackReason: "unsafe_color_fallback_to_default",
    issue,
  };
}

export type ResolvedInlineLink = {
  href?: string;
  state: "active" | "stripped";
  fallbackReason?: string;
  issue?: RendererIssue;
};

const ALLOWED_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

export function resolveInlineMarkLink(options: {
  href: string;
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
}): ResolvedInlineLink {
  const trimmed = options.href.trim();

  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) {
    return {
      state: "stripped",
      fallbackReason: "forbidden_link_protocol",
      issue: createRendererIssue({
        code: "unsafe_link_href",
        message: `Link href uses forbidden protocol: "${trimmed}"`,
        severity: "warning",
        blockId: options.blockId,
        blockType: options.blockType,
        variantId: options.variantId,
        details: { href: trimmed },
      }),
    };
  }

  try {
    const parsed = new URL(trimmed, "https://example.com");
    if (!ALLOWED_LINK_PROTOCOLS.has(parsed.protocol)) {
      return {
        state: "stripped",
        fallbackReason: "unsupported_link_protocol",
        issue: createRendererIssue({
          code: "unsafe_link_href",
          message: `Link href protocol "${parsed.protocol}" is not allowed for copy`,
          severity: "warning",
          blockId: options.blockId,
          blockType: options.blockType,
          variantId: options.variantId,
          details: { href: trimmed, protocol: parsed.protocol },
        }),
      };
    }
  } catch {
    return {
      state: "stripped",
      fallbackReason: "invalid_link_href",
      issue: createRendererIssue({
        code: "unsafe_link_href",
        message: `Link href is not a valid URL: "${trimmed}"`,
        severity: "warning",
        blockId: options.blockId,
        blockType: options.blockType,
        variantId: options.variantId,
        details: { href: trimmed },
      }),
    };
  }

  return { href: trimmed, state: "active" };
}
