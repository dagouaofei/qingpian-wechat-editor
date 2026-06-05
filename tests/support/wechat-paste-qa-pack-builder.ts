/**
 * S8-STORY-006 — Paste QA pack from Fidelity Matrix rows (reuses STORY-005 builder).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { WechatFidelityMatrixRow } from "@/core/wechat-compat/fidelity-matrix-types";

import {
  buildWechatFidelityMatrix,
  renderCopyHtmlForFidelityFixture,
} from "./wechat-fidelity-matrix-builder";
import { S8_WECHAT_FIDELITY_FIXTURE_SPECS } from "../fixtures/fidelity/s8-wechat-fidelity-spec";

export const S8_PASTE_QA_SMOKE_MATRIX_ROW_IDS = [
  "S8M-TITLE-001",
  "S8M-HEAD-001",
  "S8M-PARA-001",
  "S8M-LEAD-001",
  "S8M-LIST-001",
  "S8M-QUOTE-001",
  "S8M-SUM-001",
  "S8M-CARD-001",
  "S8M-CTA-001",
  "S8M-DIV-001",
] as const;

/** Optional waiver smoke: `S8M-HEAD-003` (heading_highlight_marker) */
export const S8_PASTE_QA_OPTIONAL_WAIVER_ROW_ID = "S8M-HEAD-003";

export const S8_PASTE_QA_RISK_MATRIX_ROW_IDS = [
  "S8M-TITLE-002",
  "S8M-TITLE-003",
  "S8M-HEAD-002",
  "S8M-HEAD-004",
  "S8M-LEAD-003",
] as const;

export const S8_PASTE_QA_PROBE_MATRIX_ROW_IDS = [
  "S8M-PARA-004",
  "S8M-SUM-004",
  "S8M-CARD-004",
  "S8M-DIV-004",
] as const;

export type PasteQaSetName = "smoke" | "risk" | "probe";

export type PasteQaPackEntry = {
  set: PasteQaSetName;
  row: WechatFidelityMatrixRow;
  copyHtml: string;
  snapshotRelativePath: string;
};

export function getMatrixRowById(
  matrixRowId: string,
  rows: WechatFidelityMatrixRow[] = buildWechatFidelityMatrix(),
): WechatFidelityMatrixRow | undefined {
  return rows.find((r) => r.matrixRowId === matrixRowId);
}

export function buildPasteQaPackEntries(
  rows: WechatFidelityMatrixRow[] = buildWechatFidelityMatrix(),
): PasteQaPackEntry[] {
  const specByRowId = new Map(
    S8_WECHAT_FIDELITY_FIXTURE_SPECS.map((s) => [s.matrixRowId, s]),
  );

  function entryFor(set: PasteQaSetName, matrixRowId: string): PasteQaPackEntry {
    const row = getMatrixRowById(matrixRowId, rows);
    if (!row) {
      throw new Error(`Missing matrix row: ${matrixRowId}`);
    }
    const spec = specByRowId.get(matrixRowId);
    if (!spec) {
      throw new Error(`Missing fixture spec: ${matrixRowId}`);
    }
    const copyHtml = renderCopyHtmlForFidelityFixture(spec);
    return {
      set,
      row,
      copyHtml,
      snapshotRelativePath: `tests/snapshots/wechat-paste-qa/${row.fixtureId}.html`,
    };
  }

  return [
    ...S8_PASTE_QA_SMOKE_MATRIX_ROW_IDS.map((id) => entryFor("smoke", id)),
    ...S8_PASTE_QA_RISK_MATRIX_ROW_IDS.map((id) => entryFor("risk", id)),
    ...S8_PASTE_QA_PROBE_MATRIX_ROW_IDS.map((id) => entryFor("probe", id)),
  ];
}

export function writePasteQaHtmlSnapshots(
  entries: PasteQaPackEntry[],
  repoRoot: string,
): void {
  for (const { copyHtml, snapshotRelativePath, row } of entries) {
    const abs = join(repoRoot, snapshotRelativePath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(
      abs,
      `<!-- ${row.matrixRowId} · ${row.fixtureId} · ${row.variantId} -->\n${copyHtml}\n`,
      "utf8",
    );
  }
}

function escapeHtmlFence(html: string): string {
  return html.replace(/```/g, "``\\`");
}

function formatPackEntrySection(entry: PasteQaPackEntry): string {
  const { row, copyHtml, snapshotRelativePath } = entry;
  const useFence = copyHtml.length <= 2000;
  const htmlSection = useFence
    ? `\n\`\`\`html\n${escapeHtmlFence(copyHtml)}\n\`\`\`\n`
    : `\n完整 HTML 见 [\`${snapshotRelativePath}\`](../../../${snapshotRelativePath})。\n`;

  return `### ${row.matrixRowId} · ${row.variantId}

| 字段 | 值 |
|------|-----|
| set | ${entry.set} |
| fixtureId | \`${row.fixtureId}\` |
| blockType | ${row.matrixBlockType} |
| variantType | ${row.variantType} |
| validatorStatus | ${row.validatorStatus} |
| validatorErrors | ${row.validatorErrors} |
| validatorWarnings | ${row.validatorWarnings} |

**Copy HTML 摘要：** ${row.clipboardHtmlSummary}

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。

${htmlSection}`;
}

export function formatWechatPasteQaPackMarkdown(
  entries: PasteQaPackEntry[] = buildPasteQaPackEntries(),
): string {
  const bySet = (set: PasteQaSetName) =>
    entries.filter((e) => e.set === set);

  return `# WeChat Paste QA Pack（2026-06-04 · S8-STORY-006）

> **用途：** PO 实机粘贴样本包 · **Contract：** \`wechat-safe-contract-v1\`  
> **生成：** \`tests/support/wechat-paste-qa-pack-builder.ts\`（复用 Fidelity Matrix builder）  
> **流程：** [\`wechat-paste-qa-workflow.md\`](wechat-paste-qa-workflow.md) · **Session：** [\`wechat-paste-qa-session-2026-06-04-s8-story-006.md\`](wechat-paste-qa-session-2026-06-04-s8-story-006.md)

---

## 1. 集合概览

| 集合 | 条数 | 目的 |
|------|------|------|
| **Smoke** | ${bySet("smoke").length} | 10 类控件各 1 条 existing 代表 |
| **Risk** | ${bySet("risk").length} | validator FAIL 行 · 实机是否也失真 |
| **Probe** | ${bySet("probe").length} | Yellow 边界 · 不入默认 preset |

可选追加：**\`${S8_PASTE_QA_OPTIONAL_WAIVER_ROW_ID}\`**（\`heading_highlight_marker\` waiver 复测）

---

## 2. Smoke Set

${bySet("smoke").map(formatPackEntrySection).join("\n")}

---

## 3. Risk Set（validator FAIL · 不在 STORY-005/006 修 renderer）

${bySet("risk").map(formatPackEntrySection).join("\n")}

---

## 4. Probe Set

${bySet("probe").map(formatPackEntrySection).join("\n")}

---

## 5. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版 QA pack（19 条 = 10 smoke + 5 risk + 4 probe） |
`;
}

export function getDefaultPasteQaPackDocPath(): string {
  return join(
    dirname(fileURLToPath(import.meta.url)),
    "../../docs/agile/paste-qa/wechat-paste-qa-pack-2026-06-04.md",
  );
}

export function getRepoRootFromImportMeta(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../..");
}
