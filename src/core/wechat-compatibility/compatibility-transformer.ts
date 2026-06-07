import { isWechatAllowedTag, isWechatForbiddenTag } from "./allowed-tags";
import { filterAllowedInlineStyles, parseInlineStyle, serializeInlineStyle } from "./style-normalizer";

export type CompatibilityTransformResult = {
  html: string;
  issues: string[];
  downgraded: string[];
};

function stripEventHandlers(html: string): string {
  return html.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

function stripScripts(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

function transformTagOpen(tag: string, attrs: string): string {
  if (isWechatForbiddenTag(tag)) {
    return "";
  }
  if (!isWechatAllowedTag(tag)) {
    return `<section${transformAttrs(attrs)}>`;
  }
  return `<${tag}${transformAttrs(attrs)}>`;
}

function transformAttrs(attrs: string): string {
  let result = attrs.replace(/\sclass\s*=\s*(?:"[^"]*"|'[^']*')/gi, "");
  result = stripEventHandlers(result);

  const styleMatch = result.match(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  if (styleMatch) {
    const raw = styleMatch[1] ?? styleMatch[2] ?? "";
    const filtered = filterAllowedInlineStyles(parseInlineStyle(raw));
    result = result.replace(/style\s*=\s*(?:"[^"]*"|'[^']*')/i, "");
    const serialized = serializeInlineStyle(filtered);
    if (serialized) {
      result += ` style="${serialized}"`;
    }
  }
  return result;
}

export function transformHtmlToWechatCompatible(html: string): CompatibilityTransformResult {
  const issues: string[] = [];
  const downgraded: string[] = [];

  let output = stripScripts(html);
  output = stripEventHandlers(output);

  output = output.replace(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();
    if (isWechatForbiddenTag(tag)) {
      issues.push(`removed_forbidden_tag:${tag}`);
      downgraded.push(tag);
      return "";
    }
    if (!isWechatAllowedTag(tag)) {
      issues.push(`downgraded_tag:${tag}->section`);
      downgraded.push(tag);
      return transformTagOpen("section", attrs);
    }
    return transformTagOpen(tag, attrs);
  });

  output = output.replace(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g, (match, tagName: string) => {
    const tag = tagName.toLowerCase();
    if (isWechatForbiddenTag(tag)) {
      return "";
    }
    if (!isWechatAllowedTag(tag)) {
      return "</section>";
    }
    return `</${tag}>`;
  });

  return { html: output.trim(), issues, downgraded };
}
