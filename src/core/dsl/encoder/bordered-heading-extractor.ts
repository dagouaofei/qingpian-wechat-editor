import type { DslNode, DslStyle } from "../runtime/dsl-types";
import type { TraceLossReportItem } from "../runtime/dsl-trace-types";

export type BorderedHeadingExtraction = {
  title: string;
  layoutIntent: "bordered_left_accent_heading";
  styleTokens: Record<string, string>;
  tree: DslNode;
  lossReport: TraceLossReportItem[];
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function camelCaseProperty(property: string): string {
  return property
    .trim()
    .toLowerCase()
    .replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function parseInlineStyle(styleAttr: string): DslStyle {
  const style: DslStyle = {};
  for (const chunk of styleAttr.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon < 0) continue;
    const key = chunk.slice(0, colon).trim();
    const value = chunk.slice(colon + 1).trim();
    if (!key || !value) continue;
    style[camelCaseProperty(key) as keyof DslStyle] = value;
  }
  return style;
}

function readTagBlock(
  html: string,
  tag: "section" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
): { attrs: string; inner: string } | null {
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = html.match(pattern);
  if (!match) return null;
  return { attrs: match[1] ?? "", inner: match[2] ?? "" };
}

function hasBorderAccent(style: DslStyle): boolean {
  return Boolean(
    style.border ||
      style.borderLeft ||
      style.borderLeftWidth ||
      style.borderLeftStyle ||
      style.borderLeftColor,
  );
}

function styleTokensFromDslStyle(style: DslStyle): Record<string, string> {
  const tokens: Record<string, string> = {};
  const keys = [
    "padding",
    "backgroundColor",
    "border",
    "borderLeft",
    "borderLeftWidth",
    "borderLeftStyle",
    "borderLeftColor",
    "borderRadius",
    "color",
    "fontSize",
    "lineHeight",
    "fontWeight",
    "margin",
    "marginTop",
    "marginBottom",
  ] as const;
  for (const key of keys) {
    const value = style[key];
    if (value != null && String(value).trim()) {
      tokens[key] = String(value);
    }
  }
  return tokens;
}

export function extractBorderedHeadingFromHtml(rawHtml: string): BorderedHeadingExtraction | null {
  const section = readTagBlock(rawHtml, "section");
  const headingTag = (["h3", "h2", "h4", "h1", "h5", "h6"] as const)
    .map((tag) => ({ tag, block: readTagBlock(rawHtml, tag) }))
    .find((entry) => entry.block != null);

  if (!headingTag?.block) {
    return null;
  }

  const headingStyle = parseInlineStyle(
    headingTag.block.attrs.match(/style\s*=\s*"([^"]*)"/i)?.[1] ?? "",
  );
  if (!hasBorderAccent(headingStyle)) {
    return null;
  }

  const sectionStyleRaw = parseInlineStyle(
    section?.attrs.match(/style\s*=\s*"([^"]*)"/i)?.[1] ?? "",
  );

  const title = stripTags(headingTag.block.inner);
  if (!title) {
    return null;
  }

  const lossReport: TraceLossReportItem[] = [];
  if (/font-family/i.test(rawHtml)) {
    lossReport.push({
      code: "font_family_stripped",
      message: "font-family not preserved in WeChat-safe DSL output",
    });
  }

  const rootStyle: DslStyle = {};
  if (sectionStyleRaw.margin) rootStyle.margin = String(sectionStyleRaw.margin);
  if (sectionStyleRaw.marginTop) rootStyle.marginTop = String(sectionStyleRaw.marginTop);
  if (sectionStyleRaw.marginBottom) rootStyle.marginBottom = String(sectionStyleRaw.marginBottom);
  if (!rootStyle.margin && !rootStyle.marginTop && !rootStyle.marginBottom) {
    rootStyle.marginTop = "28px";
    rootStyle.marginBottom = "12px";
  }

  const titleSlotStyle: DslStyle = {
    margin: headingStyle.margin ?? "0",
    padding: headingStyle.padding ?? "14px 18px",
    backgroundColor: headingStyle.backgroundColor ?? "transparent",
    border: headingStyle.border ?? "1px solid #2563eb",
    borderLeft: headingStyle.borderLeft ?? "4px solid #2563eb",
    borderRadius: headingStyle.borderRadius ?? "8px",
    color: headingStyle.color ?? "#0f172a",
    fontSize: headingStyle.fontSize ?? "17px",
    lineHeight: headingStyle.lineHeight ?? "1.5",
    fontWeight: headingStyle.fontWeight ?? 700,
    display: "block",
  };

  const tree: DslNode = {
    type: "element",
    tag: "section",
    style: rootStyle,
    children: [
      {
        type: "slot",
        slot: "title",
        tag: headingTag.tag,
        style: titleSlotStyle,
      },
    ],
  };

  return {
    title,
    layoutIntent: "bordered_left_accent_heading",
    styleTokens: styleTokensFromDslStyle(titleSlotStyle),
    tree,
    lossReport,
  };
}
