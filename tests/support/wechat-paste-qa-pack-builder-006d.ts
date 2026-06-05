/**
 * S8-STORY-006D — Paste QA pack for Matrix regression + harvest candidates + controls.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { WechatFidelityMatrixRow } from "@/core/wechat-compat/fidelity-matrix-types";

import {
  S8_006D_ALL_MATRIX_ROW_IDS,
  S8_006D_CONTROL_MATRIX_ROW_IDS,
  S8_006D_EXPECTED_CHECKPOINTS,
  S8_006D_HARVEST_ROW_METAS,
  S8_006D_RETEST_ROW_METAS,
  S8_006D_SESSION_ID,
  S8_006C_SPRINT_HEAD_COMMIT,
  get006dRetestMeta,
  get006dSetType,
  type PasteQa006dSetType,
} from "./wechat-fidelity-matrix-006d-retest";
import { S8_FIDELITY_PASTE_QA_OVERLAY_20260604 } from "./wechat-fidelity-matrix-paste-overlay";
import {
  buildWechatFidelityMatrix,
  renderCopyHtmlForFidelityFixture,
} from "./wechat-fidelity-matrix-builder";
import { S8_WECHAT_FIDELITY_FIXTURE_SPECS } from "../fixtures/fidelity/s8-wechat-fidelity-spec";

export type PasteQa006dPackEntry = {
  setType: PasteQa006dSetType;
  row: WechatFidelityMatrixRow;
  copyHtml: string;
  snapshotRelativePath: string;
  relatedDrift: string;
  patternApplied: string;
  previousPasteStatus: string;
  previousPasteEvidence: string;
  sourceEvidenceId: string;
};

function previousPasteFor(matrixRowId: string): {
  status: string;
  evidence: string;
} {
  const prev = S8_FIDELITY_PASTE_QA_OVERLAY_20260604[matrixRowId];
  if (prev == null) {
    return { status: "UNTESTED", evidence: "—" };
  }
  return { status: prev.pasteStatus, evidence: prev.pasteEvidence };
}

export function buildPasteQa006dPackEntries(
  rows: WechatFidelityMatrixRow[] = buildWechatFidelityMatrix(),
): PasteQa006dPackEntry[] {
  const specByRowId = new Map(
    S8_WECHAT_FIDELITY_FIXTURE_SPECS.map((s) => [s.matrixRowId, s]),
  );

  return S8_006D_ALL_MATRIX_ROW_IDS.map((matrixRowId) => {
    const row = rows.find((r) => r.matrixRowId === matrixRowId);
    if (!row) {
      throw new Error(`Missing matrix row: ${matrixRowId}`);
    }
    const spec = specByRowId.get(matrixRowId);
    if (!spec) {
      throw new Error(`Missing fixture spec: ${matrixRowId}`);
    }

    const setType = get006dSetType(matrixRowId)!;
    const retestMeta = get006dRetestMeta(matrixRowId);
    const harvestMeta = S8_006D_HARVEST_ROW_METAS.find(
      (m) => m.matrixRowId === matrixRowId,
    );
    const prev = previousPasteFor(matrixRowId);
    const copyHtml = renderCopyHtmlForFidelityFixture(spec);

    return {
      setType,
      row,
      copyHtml,
      snapshotRelativePath: `tests/snapshots/wechat-paste-qa/006d/${row.fixtureId}.html`,
      relatedDrift: retestMeta?.relatedDrift ?? "—",
      patternApplied: retestMeta?.patternApplied ?? "—",
      previousPasteStatus: prev.status,
      previousPasteEvidence: prev.evidence,
      sourceEvidenceId: harvestMeta?.sourceEvidenceId ?? "—",
    };
  });
}

export function writePasteQa006dHtmlSnapshots(
  entries: PasteQa006dPackEntry[],
  repoRoot: string,
): void {
  for (const { copyHtml, snapshotRelativePath, row } of entries) {
    const abs = join(repoRoot, snapshotRelativePath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(
      abs,
      `<!-- ${row.matrixRowId} · ${row.fixtureId} · ${row.variantId} · S8-STORY-006D -->\n${copyHtml}\n`,
      "utf8",
    );
  }
}

function escapeHtmlFence(html: string): string {
  return html.replace(/```/g, "``\\`");
}

function formatCheckpointList(): string {
  return S8_006D_EXPECTED_CHECKPOINTS.map((c) => `- ${c}`).join("\n");
}

function format006dEntrySection(entry: PasteQa006dPackEntry): string {
  const {
    row,
    copyHtml,
    snapshotRelativePath,
    setType,
    relatedDrift,
    patternApplied,
    previousPasteStatus,
    previousPasteEvidence,
    sourceEvidenceId,
  } = entry;

  const useFence = copyHtml.length <= 2000;
  const htmlSection = useFence
    ? `\n\`\`\`html\n${escapeHtmlFence(copyHtml)}\n\`\`\`\n`
    : `\n完整 HTML 见 [\`${snapshotRelativePath}\`](../../../${snapshotRelativePath})。\n`;

  return `### ${row.matrixRowId} · ${row.variantId}

| 字段 | 值 |
|------|-----|
| matrixRowId | \`${row.matrixRowId}\` |
| blockType | ${row.matrixBlockType} |
| variantId | \`${row.variantId}\` |
| setType | **${setType}** |
| relatedDrift | ${relatedDrift} |
| patternApplied | ${patternApplied} |
| sourceEvidenceId | ${sourceEvidenceId} |
| validatorStatusAfter006C | ${row.validatorStatus} |
| previousPasteStatus | ${previousPasteStatus} |
| previousPasteEvidence | ${previousPasteEvidence} |
| copyHtmlSource | \`${snapshotRelativePath}\` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [\`wechat-paste-qa-session-2026-06-05-s8-story-006d.md\`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

${formatCheckpointList()}

${htmlSection}`;
}

export function formatWechatPasteQa006dPackMarkdown(
  entries: PasteQa006dPackEntry[] = buildPasteQa006dPackEntries(),
): string {
  const bySet = (set: PasteQa006dSetType) =>
    entries.filter((e) => e.setType === set);

  return `# WeChat Paste QA Pack（2026-06-05 · S8-STORY-006D）

> **用途：** 006C 后 Matrix 回归 + Harvest candidate 首次实机粘贴 · **Contract：** \`wechat-safe-contract-v1\`  
> **生成：** \`tests/support/wechat-paste-qa-pack-builder-006d.ts\`  
> **006C commit：** \`${S8_006C_SPRINT_HEAD_COMMIT}\`（sprint HEAD merge record）  
> **Session overlay：** \`${S8_006D_SESSION_ID}\`  
> **流程：** [\`wechat-paste-qa-workflow.md\`](wechat-paste-qa-workflow.md) · **Session：** [\`wechat-paste-qa-session-2026-06-05-s8-story-006d.md\`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md)  
> **上一轮：** [\`wechat-paste-qa-session-2026-06-04-s8-story-006.md\`](wechat-paste-qa-session-2026-06-04-s8-story-006.md)（19 行 · 保留为历史记录）

---

## 1. 集合概览

| 集合 | 条数 | 目的 |
|------|------|------|
| **Re-test Set** | ${bySet("retest").length} | 006C copy-safe pattern 影响行 · Drift 001/002/004–009 |
| **Harvest Candidate Set** | ${bySet("harvest").length} | 006C 新增 candidate · 首次公众号粘贴 |
| **Control Set** | ${bySet("control").length} | 006 已 PASS 基础样本 · 确认无倒退 |

**状态：** Ready for PO Paste QA（Mode A — 未虚构 paste 结果）

---

## 2. Re-test Set（006C affected · Drift）

${bySet("retest").map(format006dEntrySection).join("\n")}

---

## 3. Harvest Candidate Set（首次 Paste QA）

${bySet("harvest").map(format006dEntrySection).join("\n")}

---

## 4. Control Set（回归 · 006 PASS 样本）

${bySet("control").map(format006dEntrySection).join("\n")}

---

## 5. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-05 | 初版 006D QA pack（${entries.length} 条 = ${bySet("retest").length} retest + ${bySet("harvest").length} harvest + ${bySet("control").length} control） |
`;
}

export function getDefaultPasteQa006dPackDocPath(): string {
  return join(
    dirname(fileURLToPath(import.meta.url)),
    "../../docs/agile/paste-qa/wechat-paste-qa-pack-2026-06-05-s8-story-006d.md",
  );
}

export function getRepoRootFrom006dImportMeta(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../..");
}

export {
  S8_006D_RETEST_ROW_METAS,
  S8_006D_HARVEST_ROW_METAS,
  S8_006D_CONTROL_MATRIX_ROW_IDS,
  S8_006D_ALL_MATRIX_ROW_IDS,
};
