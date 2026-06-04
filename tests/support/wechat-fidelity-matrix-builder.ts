import {
  createRelease1FirstWaveCopyRendererRegistry,
  validateWechatCopyHtml,
} from "@/core/copy";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  renderBlock,
  renderTargetForMode,
  type RendererOutputPlaceholder,
} from "@/core/renderer";

function extractCopyHtml(output: RendererOutputPlaceholder | undefined): string | null {
  if (
    output != null &&
    "html" in output &&
    typeof output.html === "string"
  ) {
    return output.html;
  }
  return null;
}

import { createS8FidelityArticleFixture } from "../fixtures/fidelity/s8-wechat-fidelity-articles";
import {
  S8_FIDELITY_STYLE_REGISTRY,
} from "../fixtures/fidelity/s8-wechat-fidelity-registry";
import { S8_WECHAT_FIDELITY_FIXTURE_SPECS } from "../fixtures/fidelity/s8-wechat-fidelity-spec";
import {
  S8_FIDELITY_PASTE_QA_OVERLAY_20260604,
  type FidelityPasteOverlay,
} from "./wechat-fidelity-matrix-paste-overlay";

import type {
  FidelityValidatorStatus,
  WechatFidelityFixtureSpec,
  WechatFidelityMatrixRow,
} from "@/core/wechat-compat/fidelity-matrix-types";

const styleRegistry = parseStyleRegistry(S8_FIDELITY_STYLE_REGISTRY);
const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();

function summarizeHtml(html: string, max = 120): string {
  const flat = html.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

function deriveValidatorStatus(
  valid: boolean,
  hasWarning: boolean,
): FidelityValidatorStatus {
  if (!valid) return "FAIL";
  if (hasWarning) return "WARNING";
  return "PASS";
}

function joinIssueCodes(
  issues: { code: string }[],
  limit = 6,
): string {
  if (issues.length === 0) return "—";
  return issues
    .slice(0, limit)
    .map((i) => i.code)
    .join(", ")
    .concat(issues.length > limit ? ", …" : "");
}

export function renderCopyHtmlForFidelityFixture(
  spec: WechatFidelityFixtureSpec,
): string {
  const article = createS8FidelityArticleFixture(spec);
  const resolved = resolveArticleStyle(article, styleRegistry);
  const block = article.blocks[0]!;
  const result = renderBlock({
    input: {
      article,
      block,
      resolvedArticleStyle: resolved,
      mode: "copy",
      target: renderTargetForMode("copy"),
    },
    registry: copyRegistry,
  });

  const html = extractCopyHtml(result.output);
  if (!result.ok || html == null) {
    throw new Error(
      `Fidelity copy render failed: ${spec.fixtureId} (${spec.variantId}): ${result.issues.map((i) => i.message).join("; ")}`,
    );
  }

  return html;
}

export function buildWechatFidelityMatrixRow(
  spec: WechatFidelityFixtureSpec,
): WechatFidelityMatrixRow {
  const html = renderCopyHtmlForFidelityFixture(spec);
  const validation = validateWechatCopyHtml({
    html,
    blockType: spec.blockType,
    variantId: spec.variantId,
  });

  const matrixBlockType = spec.matrixBlockType ?? spec.blockType;
  const validatorStatus = deriveValidatorStatus(
    validation.valid,
    validation.hasWarning,
  );

  const contractAction =
    validatorStatus === "FAIL"
      ? "Fix Red violations or adjust Contract/Renderer"
      : validatorStatus === "WARNING"
        ? "Track in Matrix; Paste QA in STORY-006; waiver only with evidence"
        : "No validator action; await Paste QA";

  const notesParts: string[] = [];
  if (spec.variantType === "probe") {
    notesParts.push(`probe: ${spec.probePurpose ?? "see spec"}`);
  }
  if (spec.variantType === "candidate") {
    notesParts.push("candidate: not in default preset until Matrix PASS");
    if (spec.matrixRowId.startsWith("S8M-HARVEST-")) {
      notesParts.push("sourceEvidenceId: WX-HARVEST-EVIDENCE-001");
      notesParts.push("release1Eligible: false");
    }
  }
  if (spec.variantId === "heading_highlight_marker") {
    notesParts.push("waiver: PASTE-HEADING-HIGHLIGHT-20260603");
  }

  return {
    ...spec,
    matrixBlockType,
    clipboardHtmlSummary: summarizeHtml(html),
    validatorStatus,
    validatorErrors: joinIssueCodes(validation.errors),
    validatorWarnings: joinIssueCodes(validation.warnings),
    validatorNotes: joinIssueCodes(validation.notes),
    validation,
    pasteStatus: "UNTESTED",
    pasteEvidence: "—",
    contractAction,
    notes: notesParts.length > 0 ? notesParts.join(" · ") : "—",
  };
}

export function applyFidelityPasteOverlay(
  row: WechatFidelityMatrixRow,
): WechatFidelityMatrixRow {
  const overlay: FidelityPasteOverlay | undefined =
    S8_FIDELITY_PASTE_QA_OVERLAY_20260604[row.matrixRowId];
  if (overlay == null) return row;
  return {
    ...row,
    pasteStatus: overlay.pasteStatus,
    pasteEvidence: overlay.pasteEvidence,
    contractAction: overlay.contractAction,
  };
}

export function buildWechatFidelityMatrix(): WechatFidelityMatrixRow[] {
  return S8_WECHAT_FIDELITY_FIXTURE_SPECS.map(buildWechatFidelityMatrixRow).map(
    applyFidelityPasteOverlay,
  );
}

function escapeMdCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function formatWechatFidelityMatrixMarkdown(
  rows: WechatFidelityMatrixRow[],
): string {
  const header = `| matrixRowId | blockType | variantId | variantType | fixtureId | cssCapability | domStructure | contractLevel | validatorStatus | validatorErrors | validatorWarnings | validatorNotes | pasteStatus | pasteEvidence | contractAction | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`;

  const body = rows
    .map((row) => {
      const caps = row.cssCapability.join(", ");
      return `| ${escapeMdCell(row.matrixRowId)} | ${escapeMdCell(String(row.matrixBlockType))} | ${escapeMdCell(row.variantId)} | ${escapeMdCell(row.variantType)} | ${escapeMdCell(row.fixtureId)} | ${escapeMdCell(caps)} | ${escapeMdCell(row.domStructure)} | ${escapeMdCell(row.contractLevel)} | ${escapeMdCell(row.validatorStatus)} | ${escapeMdCell(row.validatorErrors)} | ${escapeMdCell(row.validatorWarnings)} | ${escapeMdCell(row.validatorNotes)} | ${escapeMdCell(row.pasteStatus)} | ${escapeMdCell(row.pasteEvidence)} | ${escapeMdCell(row.contractAction)} | ${escapeMdCell(row.notes)} |`;
    })
    .join("\n");

  return `${header}\n${body}\n`;
}

/** Manual doc appendix (STORY-006); not derived from validator rows. */
export function formatMatrixStory006PasteQaAppendix(): string {
  return `---

## 7. S8-STORY-006 Paste QA 入口

| 文档 | 用途 |
|------|------|
| [\`wechat-paste-qa-workflow.md\`](wechat-paste-qa-workflow.md) | 公众号实机粘贴标准流程 |
| [\`wechat-paste-qa-session-2026-06-04-s8-story-006.md\`](wechat-paste-qa-session-2026-06-04-s8-story-006.md) | 第一轮 Session · 19 行已回填 Matrix |
| [\`drift/README.md\`](drift/README.md) | Copy Drift 索引（FAIL/WARNING · 2026-06-04） |
| [\`wechat-paste-qa-pack-2026-06-04.md\`](wechat-paste-qa-pack-2026-06-04.md) | Smoke / Risk / Probe Copy HTML 样本包 |

**回填规则：** 仅 PO 实机后可改上表 \`pasteStatus\` / \`pasteEvidence\`；**禁止** Cursor/CI 虚构 PASS。

### 7.1 Risk Set（validator FAIL · 跟踪口径）

以下五行 **不在 S8-STORY-005 修复**；已纳入 Paste QA Risk Set，由 **STORY-006 / Drift / 后续** 闭环：

| matrixRowId | variantId |
|-------------|-----------|
| S8M-TITLE-002 | \`title_left_bar_classic\` |
| S8M-TITLE-003 | \`title_bottom_line_editorial\` |
| S8M-HEAD-002 | \`heading_numbered_section\` |
| S8M-HEAD-004 | \`heading_card_centered\` |
| S8M-LEAD-003 | \`lead_quote_intro\` |

实机粘贴若 FAIL → \`DRIFT-S8-YYYYMMDD-###\`（见 [\`copy-drift-diagnostics.md\`](../../architecture/copy-drift-diagnostics.md)）。`;
}

export function buildWechatFidelityMatrixDocument(): string {
  const rows = buildWechatFidelityMatrix();
  const table = formatWechatFidelityMatrixMarkdown(rows);

  const pass = rows.filter((r) => r.validatorStatus === "PASS").length;
  const warn = rows.filter((r) => r.validatorStatus === "WARNING").length;
  const fail = rows.filter((r) => r.validatorStatus === "FAIL").length;
  const pasteTested = rows.filter((r) => r.pasteStatus !== "UNTESTED").length;
  const pastePass = rows.filter((r) => r.pasteStatus === "PASS").length;
  const pasteWarn = rows.filter((r) => r.pasteStatus === "WARNING").length;
  const pasteFail = rows.filter((r) => r.pasteStatus === "FAIL").length;

  return `# WeChat Fidelity Matrix（Contract v1 · 第一版）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Contract：** \`wechat-safe-contract-v1\` · **Profile：** \`wechat-mp-editor-v1\`  
> **Story：** S8-STORY-005 · **生成：** \`tests/support/wechat-fidelity-matrix-builder.ts\`  
> **状态：** Validator 已跑 · Paste QA Session 2026-06-04 已回填 ${pasteTested} 行（Matrix 其余 ${rows.length - pasteTested} 行 UNTESTED）

---

## 1. Matrix 目标

在多控件、多 variant 的 **fixture** 上验证：

1. Copy Renderer 产物可生成 Clipboard HTML；
2. \`validateWechatCopyHtml()\` 与 Contract v1 / Compatibility Profile 一致；
3. 为公众号实机粘贴（Paste QA）提供可追溯行（\`matrixRowId\` + \`fixtureId\`）。

**非目标：** 视觉升级、扩充默认样式库、修改 Contract v1 分级。

---

## 2. 状态定义

| 字段 | 取值 | 含义 |
|------|------|------|
| **validatorStatus** | PASS | \`valid=true\` 且无 warning |
| | WARNING | \`valid=true\` 但有 Yellow 等 warning |
| | FAIL | 存在 error（\`valid=false\`） |
| **pasteStatus** | PASS / FAIL / WARNING / UNTESTED | 公众号实机粘贴结果；Session 2026-06-04 已测 ${pasteTested} 行 |

**重要：** \`validatorStatus=PASS\` **不代表** Paste QA PASS。

---

## 3. Variant 类型

| 类型 | 说明 |
|------|------|
| **existing** | 已有产品 variant（Release 1 路径） |
| **probe** | 测试专用；验证某 CSS/DOM 能力；**不**进入默认 preset / 用户可选池 |
| **candidate** | 候选正式样式；仅 Matrix + Paste QA 通过后再考虑入池 |

Fixture 使用 preset \`s8_fidelity_matrix_test\`（test-only）；probe variant 仅通过 \`blockOverrides\` 引用。

---

## 4. Validator vs Paste

| 层 | 工具 | 本轮 |
|----|------|------|
| 机器校验 | \`validateWechatCopyHtml\` | 已执行（见下表） |
| 实机粘贴 | 公众号后台 | **Session 2026-06-04** · ${pasteTested}/${rows.length} 行已测 |

---

## 5. 本轮覆盖

- **控件：** title · heading · paragraph · lead · list · quote · summary（\`highlight\`）· info_card · cta · divider  
- **样本数：** ${rows.length} 行（≥30）  
- **Validator 汇总：** PASS ${pass} · WARNING ${warn} · FAIL ${fail}  
- **Paste 汇总（已测行）：** PASS ${pastePass} · WARNING ${pasteWarn} · FAIL ${pasteFail} · UNTESTED ${rows.length - pasteTested}  
- **CSS 能力：** Green/Yellow 见 sprint8 / contract v1；Red 能力仅在 Validator 单测，不纳入本轮粘贴样本  

---

## 6. Matrix 表

${table}

${formatMatrixStory006PasteQaAppendix()}

---

## 8. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 创建第一版 Matrix（fixture + validator） | S8-STORY-005 |
| 2026-06-04 | §7 Paste QA 入口 · Risk Set 说明（paste 仍 UNTESTED） | S8-STORY-006 |
| 2026-06-04 | Session 2026-06-04 回填 paste 列 · Drift 001–009 | S8-STORY-006 |
| 2026-06-04 | S8-STORY-006C copy-safe pattern fix · harvest candidates S8M-HARVEST-001/002 | S8-STORY-006C |
`;
}
