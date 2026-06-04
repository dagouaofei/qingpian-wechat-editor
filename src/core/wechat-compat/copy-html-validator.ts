/**
 * Copy HTML Validator — Contract v1 (`wechat-safe-contract-v1`).
 *
 * Parses light篇 Clipboard HTML fragments (not a general HTML sanitizer).
 * Uses DOMParser when available (browser / Vitest jsdom); otherwise a small tag
 * stack parser for common copy-safe fragments.
 */

import type { BlockType } from "@/core/blocks/block.types";
import {
  validateCssDeclarationCompatibility,
  type CssCompatibilityValidateOptions,
} from "@/core/styles/compatibility";
import type { WeChatCompatibilityProfile } from "@/core/styles/types";

import { WECHAT_SAFE_CONTRACT_VERSION_ID } from "./contract-version";
import type { YellowCapabilityWaiver } from "./wechat-compat-types";
import { WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS } from "./wechat-css-classification";
import { classifyHtmlTag, isListedHtmlTag } from "./wechat-html-classification";
import { findYellowWaiverForCapability } from "./wechat-yellow-waivers";
import {
  WECHAT_MP_EDITOR_PROFILE_ID,
  WECHAT_SAFE_CONTRACT_V1_PROFILE,
} from "./wechat-compat-profile";

export const WECHAT_COPY_ISSUE_CODES = {
  RED_TAG: "WECHAT_COPY_RED_TAG",
  UNKNOWN_TAG: "WECHAT_COPY_UNKNOWN_TAG",
  YELLOW_TAG: "WECHAT_COPY_YELLOW_TAG",
  CLASS_ATTRIBUTE_FORBIDDEN: "WECHAT_COPY_CLASS_ATTRIBUTE_FORBIDDEN",
  STYLE_TAG_FORBIDDEN: "WECHAT_COPY_STYLE_TAG_FORBIDDEN",
  LINK_TAG_FORBIDDEN: "WECHAT_COPY_LINK_TAG_FORBIDDEN",
  RED_CSS: "WECHAT_COPY_RED_CSS",
  YELLOW_CSS_WITHOUT_WAIVER: "WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER",
  YELLOW_CSS_WITH_WAIVER: "WECHAT_COPY_YELLOW_CSS_WITH_WAIVER",
  DUPLICATE_CSS_PROPERTY: "WECHAT_COPY_DUPLICATE_CSS_PROPERTY",
  UNRESOLVED_TOKEN: "WECHAT_COPY_UNRESOLVED_TOKEN",
  CALC_FORBIDDEN: "WECHAT_COPY_CALC_FORBIDDEN",
  IMPORTANT_FORBIDDEN: "WECHAT_COPY_IMPORTANT_FORBIDDEN",
  MAX_NESTING_DEPTH_EXCEEDED: "WECHAT_COPY_MAX_NESTING_DEPTH_EXCEEDED",
  MISSING_TYPOGRAPHY_INLINE: "WECHAT_COPY_MISSING_TYPOGRAPHY_INLINE",
  PARSE_ERROR: "WECHAT_COPY_PARSE_ERROR",
} as const;

export type WechatCopyValidationSeverity = "error" | "warning" | "note";

export type ContractIssueLevel = "green" | "yellow" | "red";

export interface ValidateWechatCopyHtmlInput {
  html: string;
  blockType?: string;
  variantId?: string;
  contractVersionId?: string;
  profile?: WeChatCompatibilityProfile;
}

export interface WechatCopyValidationIssue {
  severity: WechatCopyValidationSeverity;
  code: string;
  message: string;
  tagName?: string;
  property?: string;
  value?: string;
  level?: ContractIssueLevel;
  fallbackId?: string;
  evidenceId?: string;
  blockType?: string;
  variantId?: string;
}

export interface WechatCopyValidationResult {
  contractVersionId: string;
  profileId: string;
  valid: boolean;
  hasError: boolean;
  hasWarning: boolean;
  errors: WechatCopyValidationIssue[];
  warnings: WechatCopyValidationIssue[];
  notes: WechatCopyValidationIssue[];
  issues: WechatCopyValidationIssue[];
}

const TYPOGRAPHY_TAGS = new Set([
  "p",
  "span",
  "strong",
  "em",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
]);

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type ParsedNode = {
  tagName: string;
  attributes: Record<string, string>;
  children: ParsedNode[];
  depth: number;
};

function pushIssue(
  bucket: {
    errors: WechatCopyValidationIssue[];
    warnings: WechatCopyValidationIssue[];
    notes: WechatCopyValidationIssue[];
    all: WechatCopyValidationIssue[];
  },
  issue: WechatCopyValidationIssue,
): void {
  bucket.all.push(issue);
  if (issue.severity === "error") bucket.errors.push(issue);
  else if (issue.severity === "warning") bucket.warnings.push(issue);
  else bucket.notes.push(issue);
}

function parseStyleDeclarations(
  styleValue: string,
): Array<{ property: string; value: string; raw: string }> {
  const declarations: Array<{ property: string; value: string; raw: string }> =
    [];
  const normalized = styleValue.trim();
  if (!normalized) return declarations;

  for (const part of normalized.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const property = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    declarations.push({ property, value, raw: trimmed });
  }
  return declarations;
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re =
    /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

function lightweightParseHtml(html: string): ParsedNode | null {
  const root: ParsedNode = {
    tagName: "__root__",
    attributes: {},
    children: [],
    depth: 0,
  };
  const stack: ParsedNode[] = [root];
  const tagRe = /<\/?([a-zA-Z][\w-]*)\s*([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(html)) !== null) {
    const full = match[0];
    const tagName = match[1].toLowerCase();
    const attrPart = match[2] ?? "";
    const isClose = full.startsWith("</");
    const isSelfClosing = /\/\s*>$/.test(full) || VOID_TAGS.has(tagName);

    if (isClose) {
      while (stack.length > 1 && stack[stack.length - 1].tagName !== tagName) {
        stack.pop();
      }
      if (stack.length > 1) stack.pop();
      continue;
    }

    const node: ParsedNode = {
      tagName,
      attributes: parseAttributes(attrPart),
      children: [],
      depth: stack.length,
    };
    stack[stack.length - 1].children.push(node);
    if (!isSelfClosing) stack.push(node);
  }
  return root;
}

function domNodeToParsed(node: Element, depth: number): ParsedNode {
  const attributes: Record<string, string> = {};
  for (const attr of Array.from(node.attributes)) {
    attributes[attr.name.toLowerCase()] = attr.value;
  }
  const children: ParsedNode[] = [];
  for (const child of Array.from(node.children)) {
    children.push(domNodeToParsed(child, depth + 1));
  }
  return {
    tagName: node.tagName.toLowerCase(),
    attributes,
    children,
    depth,
  };
}

function parseCopyHtmlTree(html: string): {
  root: ParsedNode;
  usedFallbackParser: boolean;
  parseError?: string;
} {
  const wrapped = `<div data-wechat-copy-root="1">${html}</div>`;
  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(wrapped, "text/html");
      if (doc.querySelector("parsererror")) {
        const fb = lightweightParseHtml(html);
        if (!fb) {
          return {
            root: { tagName: "__root__", attributes: {}, children: [], depth: 0 },
            usedFallbackParser: true,
            parseError: "DOMParser failed",
          };
        }
        return { root: fb, usedFallbackParser: true };
      }
      const el = doc.querySelector("[data-wechat-copy-root]");
      if (el) {
        return {
          root: domNodeToParsed(el, 0),
          usedFallbackParser: false,
        };
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "DOMParser error";
      const fb = lightweightParseHtml(html);
      if (fb) return { root: fb, usedFallbackParser: true, parseError: message };
    }
  }
  const fb = lightweightParseHtml(html);
  return {
    root: fb ?? { tagName: "__root__", attributes: {}, children: [], depth: 0 },
    usedFallbackParser: true,
    parseError: fb ? undefined : "Could not parse HTML fragment",
  };
}

function walkParsedTree(
  node: ParsedNode,
  ctx: {
    bucket: ReturnType<typeof createBucket>;
    maxDepth: number;
    input: ValidateWechatCopyHtmlInput;
    profile: WeChatCompatibilityProfile;
    cssOptions: CssCompatibilityValidateOptions;
    blockType?: BlockType;
  },
): void {
  if (node.tagName !== "__root__") {
    validateTag(node, ctx);
    validateElementAttributes(node, ctx);
    validateNesting(node, ctx);
  }
  for (const child of node.children) {
    walkParsedTree(child, ctx);
  }
}

function createBucket() {
  return {
    errors: [] as WechatCopyValidationIssue[],
    warnings: [] as WechatCopyValidationIssue[],
    notes: [] as WechatCopyValidationIssue[],
    all: [] as WechatCopyValidationIssue[],
  };
}

function baseIssueFields(
  input: ValidateWechatCopyHtmlInput,
): Pick<WechatCopyValidationIssue, "blockType" | "variantId"> {
  return {
    blockType: input.blockType,
    variantId: input.variantId,
  };
}

function validateTag(
  node: ParsedNode,
  ctx: {
    bucket: ReturnType<typeof createBucket>;
    input: ValidateWechatCopyHtmlInput;
  },
): void {
  const tag = node.tagName;
  const classification = classifyHtmlTag(tag);
  const level = classification.level;
  const fields = { ...baseIssueFields(ctx.input), tagName: tag };

  if (tag === "style") {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.STYLE_TAG_FORBIDDEN,
      message: "<style> tags are forbidden in Clipboard HTML",
      level: "red",
      ...fields,
    });
    return;
  }

  if (tag === "link") {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.LINK_TAG_FORBIDDEN,
      message: "<link> tags are forbidden in Clipboard HTML",
      level: "red",
      ...fields,
    });
    return;
  }

  if (level === "red") {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: isListedHtmlTag(tag)
        ? WECHAT_COPY_ISSUE_CODES.RED_TAG
        : WECHAT_COPY_ISSUE_CODES.UNKNOWN_TAG,
      message: isListedHtmlTag(tag)
        ? `<${tag}> is forbidden in Clipboard HTML (Contract Red)`
        : `<${tag}> is not in Contract v1 HTML whitelist`,
      level: "red",
      ...fields,
    });
    return;
  }

  if (level === "yellow") {
    pushIssue(ctx.bucket, {
      severity: "warning",
      code: WECHAT_COPY_ISSUE_CODES.YELLOW_TAG,
      message: `<${tag}> is Yellow in Contract v1; requires Matrix / waiver evidence`,
      level: "yellow",
      ...fields,
    });
  }
}

function validateNesting(
  node: ParsedNode,
  ctx: { bucket: ReturnType<typeof createBucket>; maxDepth: number },
): void {
  if (node.depth > ctx.maxDepth) {
    pushIssue(ctx.bucket, {
      severity: "warning",
      code: WECHAT_COPY_ISSUE_CODES.MAX_NESTING_DEPTH_EXCEEDED,
      message: `Nesting depth ${node.depth} exceeds max ${ctx.maxDepth}`,
      tagName: node.tagName,
      level: "yellow",
    });
  }
}

function validateElementAttributes(
  node: ParsedNode,
  ctx: {
    bucket: ReturnType<typeof createBucket>;
    input: ValidateWechatCopyHtmlInput;
    profile: WeChatCompatibilityProfile;
    cssOptions: CssCompatibilityValidateOptions;
    blockType?: BlockType;
  },
): void {
  const fields = { ...baseIssueFields(ctx.input), tagName: node.tagName };

  if ("class" in node.attributes) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.CLASS_ATTRIBUTE_FORBIDDEN,
      message: "class attributes are forbidden in Clipboard HTML payload",
      level: "red",
      ...fields,
    });
  }

  const styleRaw = node.attributes.style;
  if (styleRaw === undefined) {
    if (TYPOGRAPHY_TAGS.has(node.tagName) && hasTextContentHint(node)) {
      pushIssue(ctx.bucket, {
        severity: "warning",
        code: WECHAT_COPY_ISSUE_CODES.MISSING_TYPOGRAPHY_INLINE,
        message: `Typography element <${node.tagName}> has no inline style`,
        level: "yellow",
        ...fields,
      });
    }
    return;
  }

  validateInlineStyleValue(styleRaw, ctx, fields);
}

function hasTextContentHint(node: ParsedNode): boolean {
  return node.children.length === 0 || node.children.some((c) => c.tagName === "#text" || TYPOGRAPHY_TAGS.has(c.tagName) || c.tagName === "span");
}

function validateInlineStyleValue(
  styleRaw: string,
  ctx: {
    bucket: ReturnType<typeof createBucket>;
    input: ValidateWechatCopyHtmlInput;
    profile: WeChatCompatibilityProfile;
    cssOptions: CssCompatibilityValidateOptions;
    blockType?: BlockType;
  },
  fields: Pick<WechatCopyValidationIssue, "tagName" | "blockType" | "variantId">,
): void {
  if (/var\s*\(\s*--/i.test(styleRaw)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.UNRESOLVED_TOKEN,
      message: "CSS variables var(--*) are forbidden in Clipboard HTML",
      level: "red",
      ...fields,
    });
  }
  if (/\bcalc\s*\(/i.test(styleRaw)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.CALC_FORBIDDEN,
      message: "calc() is forbidden in Clipboard HTML",
      level: "red",
      ...fields,
    });
  }
  if (/!important\b/i.test(styleRaw)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.IMPORTANT_FORBIDDEN,
      message: "!important is forbidden in Clipboard HTML",
      level: "red",
      ...fields,
    });
  }

  for (const { pattern, code, message } of WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS) {
    if (!pattern.test(styleRaw) || code === "clipboard_class_attribute") {
      continue;
    }
    if (code === "tailwind_class_dependency") continue;
    const issueCode =
      code === "calc"
        ? WECHAT_COPY_ISSUE_CODES.CALC_FORBIDDEN
        : code === "important"
          ? WECHAT_COPY_ISSUE_CODES.IMPORTANT_FORBIDDEN
          : code === "css_variable"
            ? WECHAT_COPY_ISSUE_CODES.UNRESOLVED_TOKEN
            : WECHAT_COPY_ISSUE_CODES.RED_CSS;
    pushIssue(ctx.bucket, {
      severity: "error",
      code: issueCode,
      message,
      level: "red",
      ...fields,
    });
  }

  const seen = new Set<string>();
  const declarations = parseStyleDeclarations(styleRaw);
  for (const decl of declarations) {
    const propKey = decl.property.toLowerCase();
    if (seen.has(propKey)) {
      pushIssue(ctx.bucket, {
        severity: "error",
        code: WECHAT_COPY_ISSUE_CODES.DUPLICATE_CSS_PROPERTY,
        message: `Duplicate CSS property "${decl.property}" in style attribute`,
        property: decl.property,
        level: "red",
        ...fields,
      });
      continue;
    }
    seen.add(propKey);

    if (/^margin(-|$)/.test(propKey) && /^-/.test(decl.value.trim())) {
      validateCssDeclWithContract(decl.raw, ctx, fields, "margin (negative)");
      continue;
    }

    validateCssDeclWithContract(decl.raw, ctx, fields, decl.property, decl.value);
  }
}

function resolveWaiverForDecl(
  property: string,
  value: string,
  blockType?: BlockType,
  variantId?: string,
): YellowCapabilityWaiver | null {
  if (!blockType || !variantId) {
    return null;
  }
  const capability =
    value.includes("linear-gradient") || value.includes("gradient")
      ? "linear-gradient"
      : property.toLowerCase().includes("box-decoration-break")
        ? "box-decoration-break"
        : property;
  const hit = findYellowWaiverForCapability(capability, {
    blockType,
    variantId,
  });
  return hit?.waiver ?? null;
}

function validateCssDeclWithContract(
  declaration: string,
  ctx: {
    bucket: ReturnType<typeof createBucket>;
    cssOptions: CssCompatibilityValidateOptions;
    input: ValidateWechatCopyHtmlInput;
    blockType?: BlockType;
  },
  fields: Pick<WechatCopyValidationIssue, "tagName" | "blockType" | "variantId">,
  property: string,
  value?: string,
): void {
  const result = validateCssDeclarationCompatibility(declaration, ctx.cssOptions);
  const prop = result.property ?? property;
  const val = result.value ?? value;

  if (result.level === "allowed") {
    return;
  }

  if (result.level === "forbidden" || result.level === "unknown") {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.RED_CSS,
      message:
        result.message ??
        `CSS declaration is forbidden: ${declaration}`,
      property: prop,
      value: val,
      level: "red",
      ...fields,
    });
    return;
  }

  if (result.level === "risky") {
    const waiver = resolveWaiverForDecl(
      prop,
      val ?? declaration,
      ctx.blockType,
      ctx.input.variantId,
    );
    const waiverApplied =
      waiver !== null ||
      result.issues.some((i) => i.code === "css_yellow_waiver_applied");
    if (waiverApplied) {
      pushIssue(ctx.bucket, {
        severity: "note",
        code: WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITH_WAIVER,
        message: `Yellow CSS allowed via waiver ${waiver?.evidenceId ?? "(profile)"}`,
        property: prop,
        value: val,
        level: "yellow",
        evidenceId: waiver?.evidenceId,
        fallbackId: waiver?.fallbackPolicyId,
        ...fields,
      });
      return;
    }
    pushIssue(ctx.bucket, {
      severity: "warning",
      code: WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITHOUT_WAIVER,
      message:
        result.message ??
        `Yellow CSS without waiver: ${declaration}`,
      property: prop,
      value: val,
      level: "yellow",
      ...fields,
    });
  }
}

function scanRawHtmlPatterns(
  html: string,
  ctx: { bucket: ReturnType<typeof createBucket>; input: ValidateWechatCopyHtmlInput },
): void {
  if (/<style[\s>]/i.test(html)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.STYLE_TAG_FORBIDDEN,
      message: "<style> tag detected in HTML",
      level: "red",
      ...baseIssueFields(ctx.input),
    });
  }
  if (/<link\b/i.test(html)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.LINK_TAG_FORBIDDEN,
      message: "<link> tag detected in HTML",
      level: "red",
      ...baseIssueFields(ctx.input),
    });
  }
  if (/\bclass\s*=/i.test(html)) {
    pushIssue(ctx.bucket, {
      severity: "error",
      code: WECHAT_COPY_ISSUE_CODES.CLASS_ATTRIBUTE_FORBIDDEN,
      message: "class attribute detected in HTML",
      level: "red",
      ...baseIssueFields(ctx.input),
    });
  }
}

export function validateWechatCopyHtml(
  input: ValidateWechatCopyHtmlInput,
): WechatCopyValidationResult {
  const profile =
    input.profile ??
    (input.contractVersionId &&
    input.contractVersionId !== WECHAT_SAFE_CONTRACT_VERSION_ID
      ? WECHAT_SAFE_CONTRACT_V1_PROFILE
      : WECHAT_SAFE_CONTRACT_V1_PROFILE);

  const contractVersionId =
    input.contractVersionId ?? WECHAT_SAFE_CONTRACT_VERSION_ID;
  const profileId = profile.id ?? WECHAT_MP_EDITOR_PROFILE_ID;
  const maxDepth =
    WECHAT_SAFE_CONTRACT_V1_PROFILE.dom?.maxNestingDepth ?? 3;

  const blockType = input.blockType as BlockType | undefined;
  const cssOptions: CssCompatibilityValidateOptions = {
    profile,
    waiverContext: {
      blockType,
      variantId: input.variantId,
    },
  };

  const bucket = createBucket();
  const html = input.html ?? "";

  if (!html.trim()) {
    return buildResult(contractVersionId, profileId, bucket);
  }

  scanRawHtmlPatterns(html, { bucket, input });

  const { root, usedFallbackParser, parseError } = parseCopyHtmlTree(html);
  if (parseError && usedFallbackParser) {
    pushIssue(bucket, {
      severity: "warning",
      code: WECHAT_COPY_ISSUE_CODES.PARSE_ERROR,
      message: `HTML parse fallback: ${parseError}`,
      level: "yellow",
      ...baseIssueFields(input),
    });
  }

  walkParsedTree(root, {
    bucket,
    maxDepth,
    input,
    profile,
    cssOptions,
    blockType,
  });

  return buildResult(contractVersionId, profileId, bucket);
}

function buildResult(
  contractVersionId: string,
  profileId: string,
  bucket: ReturnType<typeof createBucket>,
): WechatCopyValidationResult {
  return {
    contractVersionId,
    profileId,
    valid: bucket.errors.length === 0,
    hasError: bucket.errors.length > 0,
    hasWarning: bucket.warnings.length > 0,
    errors: bucket.errors,
    warnings: bucket.warnings,
    notes: bucket.notes,
    issues: bucket.all,
  };
}
