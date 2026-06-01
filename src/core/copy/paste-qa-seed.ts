import type { BlockType } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";

export const PASTE_QA_STATUSES = ["Not Run", "Pass", "Fail", "Blocked"] as const;

export type PasteQaStatus = (typeof PASTE_QA_STATUSES)[number];

export type PasteQaSeedRecord = {
  id: string;
  sprint: "Sprint 4-A";
  testObject: "text-first-copy-html";
  blockType: Extract<
    BlockType,
    "title" | "heading" | "lead" | "paragraph" | "divider"
  >;
  variantId: string;
  copySafety: CopySafety;
  expectedCheckpoints: string[];
  requiresManualVerification: boolean;
  status: PasteQaStatus;
};

export const SPRINT4A_TEXT_FIRST_PASTE_QA_SEED: PasteQaSeedRecord[] = [
  {
    id: "S4A-PASTE-title-plain-minimal",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "title",
    variantId: "title_plain_minimal",
    copySafety: "strict",
    expectedCheckpoints: ["标题字号与字重保留", "居中对齐保留"],
    requiresManualVerification: true,
    status: "Not Run",
  },
  {
    id: "S4A-PASTE-heading-numbered-section",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "heading",
    variantId: "heading_numbered_section",
    copySafety: "balanced",
    expectedCheckpoints: ["章节标题字号保留", "编号文本保留"],
    requiresManualVerification: true,
    status: "Not Run",
  },
  {
    id: "S4A-PASTE-lead-accent-band",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "lead",
    variantId: "lead_accent_band",
    copySafety: "balanced",
    expectedCheckpoints: ["导语文本保留", "背景色和左侧强调带基本保留"],
    requiresManualVerification: true,
    status: "Not Run",
  },
  {
    id: "S4A-PASTE-paragraph-soft-card",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "paragraph",
    variantId: "paragraph_soft_card",
    copySafety: "balanced",
    expectedCheckpoints: ["正文文本保留", "卡片背景、边框和圆角基本保留"],
    requiresManualVerification: true,
    status: "Not Run",
  },
  {
    id: "S4A-PASTE-divider-simple-line",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "divider",
    variantId: "divider_simple_line",
    copySafety: "strict",
    expectedCheckpoints: ["实线分隔符可见", "上下间距基本保留"],
    requiresManualVerification: true,
    status: "Not Run",
  },
  {
    id: "S4A-PASTE-divider-dotted-line",
    sprint: "Sprint 4-A",
    testObject: "text-first-copy-html",
    blockType: "divider",
    variantId: "divider_dotted_line",
    copySafety: "balanced",
    expectedCheckpoints: ["虚线分隔符可见", "无 class 或 style tag 依赖"],
    requiresManualVerification: true,
    status: "Not Run",
  },
];
