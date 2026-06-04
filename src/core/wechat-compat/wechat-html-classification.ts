import type {
  ContractCapabilityLevel,
  HtmlTagClassification,
  HtmlTagClassificationResult,
} from "./wechat-compat-types";
import { CONTRACT_TO_CSS_LEVEL } from "./wechat-compat-types";

/** @see docs/architecture/wechat-safe-html-css-contract.md §3 */
export const WECHAT_CONTRACT_V1_HTML_TAGS: HtmlTagClassification[] = [
  { tag: "p", level: "green" },
  { tag: "span", level: "green" },
  { tag: "strong", level: "green" },
  { tag: "em", level: "green" },
  { tag: "br", level: "green" },
  { tag: "ul", level: "green" },
  { tag: "ol", level: "green" },
  { tag: "li", level: "green" },
  { tag: "h1", level: "green" },
  { tag: "h2", level: "green" },
  { tag: "h3", level: "green" },
  { tag: "h4", level: "green" },
  {
    tag: "section",
    level: "yellow",
    notes: "copy-safe wrapper only; counts toward max nesting depth",
  },
  {
    tag: "div",
    level: "yellow",
    notes: "copy-safe wrapper or Matrix-verified card shell only",
  },
  {
    tag: "a",
    level: "yellow",
    notes: "href http(s) only; default R1 path avoids links",
  },
  {
    tag: "img",
    level: "yellow",
    notes: "image_placeholder block only in R1",
  },
  { tag: "table", level: "yellow", notes: "specific variant structures only" },
  { tag: "tbody", level: "yellow" },
  { tag: "tr", level: "yellow" },
  { tag: "td", level: "yellow" },
  { tag: "thead", level: "yellow" },
  { tag: "th", level: "yellow" },
  { tag: "script", level: "red" },
  { tag: "style", level: "red" },
  { tag: "link", level: "red" },
  { tag: "iframe", level: "red" },
  { tag: "form", level: "red" },
  { tag: "input", level: "red" },
  { tag: "button", level: "red" },
  { tag: "canvas", level: "red" },
  { tag: "svg", level: "red" },
  { tag: "video", level: "red" },
  { tag: "audio", level: "red" },
];

const TAG_INDEX = new Map(
  WECHAT_CONTRACT_V1_HTML_TAGS.map((entry) => [entry.tag.toLowerCase(), entry]),
);

export function classifyHtmlTag(tagName: string): HtmlTagClassificationResult {
  const tag = tagName.trim().toLowerCase();
  const entry = TAG_INDEX.get(tag);
  const level: ContractCapabilityLevel = entry?.level ?? "red";
  return {
    tag,
    level,
    cssLevel: CONTRACT_TO_CSS_LEVEL[level],
    notes: entry?.notes,
  };
}

export function isHtmlTagAllowedForCopy(tagName: string): boolean {
  const { level } = classifyHtmlTag(tagName);
  return level === "green" || level === "yellow";
}

export function listHtmlTagsByLevel(
  level: ContractCapabilityLevel,
): string[] {
  return WECHAT_CONTRACT_V1_HTML_TAGS.filter((t) => t.level === level).map(
    (t) => t.tag,
  );
}
