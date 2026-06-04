import { readFileSync, writeFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { buildWechatFidelityMatrix } from "../../support/wechat-fidelity-matrix-builder";
import {
  S8_PASTE_QA_PROBE_MATRIX_ROW_IDS,
  S8_PASTE_QA_RISK_MATRIX_ROW_IDS,
  S8_PASTE_QA_SMOKE_MATRIX_ROW_IDS,
  buildPasteQaPackEntries,
  formatWechatPasteQaPackMarkdown,
  getDefaultPasteQaPackDocPath,
  getRepoRootFromImportMeta,
  writePasteQaHtmlSnapshots,
} from "../../support/wechat-paste-qa-pack-builder";

const REQUIRED_SMOKE_BLOCK_TYPES = [
  "title",
  "heading",
  "paragraph",
  "lead",
  "list",
  "quote",
  "summary",
  "info_card",
  "cta",
  "divider",
] as const;

describe("S8 WeChat Paste QA pack", () => {
  it("builds pack entries from matrix rows without changing validatorStatus", () => {
    const matrix = buildWechatFidelityMatrix();
    const entries = buildPasteQaPackEntries(matrix);

    expect(entries).toHaveLength(19);
    expect(
      entries.every((e) => e.copyHtml.length > 0 && e.row.matrixRowId.length > 0),
    ).toBe(true);

    const smoke = entries.filter((e) => e.set === "smoke");
    expect(smoke).toHaveLength(10);
    const smokeBlocks = new Set(smoke.map((e) => String(e.row.matrixBlockType)));
    for (const blockType of REQUIRED_SMOKE_BLOCK_TYPES) {
      expect(smokeBlocks.has(blockType)).toBe(true);
    }

    const riskIds = entries
      .filter((e) => e.set === "risk")
      .map((e) => e.row.matrixRowId);
    expect(riskIds).toEqual([...S8_PASTE_QA_RISK_MATRIX_ROW_IDS]);

    const probeIds = entries
      .filter((e) => e.set === "probe")
      .map((e) => e.row.matrixRowId);
    expect(probeIds).toEqual([...S8_PASTE_QA_PROBE_MATRIX_ROW_IDS]);

    for (const entry of entries) {
      const matrixRow = matrix.find(
        (r) => r.matrixRowId === entry.row.matrixRowId,
      );
      expect(matrixRow?.validatorStatus).toBe(entry.row.validatorStatus);
      expect(entry.row.pasteStatus).toBe("UNTESTED");
    }
  });

  it("smoke row ids match sprint-006 spec", () => {
    expect([...S8_PASTE_QA_SMOKE_MATRIX_ROW_IDS]).toHaveLength(10);
  });

  it("risk set includes five validator FAIL rows", () => {
    const matrix = buildWechatFidelityMatrix();
    for (const id of S8_PASTE_QA_RISK_MATRIX_ROW_IDS) {
      const row = matrix.find((r) => r.matrixRowId === id);
      expect(row?.validatorStatus).toBe("FAIL");
    }
  });

  it("probe set entries are probe variantType", () => {
    const entries = buildPasteQaPackEntries().filter((e) => e.set === "probe");
    expect(entries.every((e) => e.row.variantType === "probe")).toBe(true);
  });

  it("matches committed QA pack markdown when UPDATE_PASTE_QA_PACK is unset", () => {
    const generated = formatWechatPasteQaPackMarkdown();
    const committed = readFileSync(getDefaultPasteQaPackDocPath(), "utf8");
    expect(generated).toBe(committed);
  });

  it("regenerates QA pack and snapshots when UPDATE_PASTE_QA_PACK=1", () => {
    if (process.env.UPDATE_PASTE_QA_PACK !== "1") {
      return;
    }
    const entries = buildPasteQaPackEntries();
    const root = getRepoRootFromImportMeta();
    writePasteQaHtmlSnapshots(entries, root);
    writeFileSync(
      getDefaultPasteQaPackDocPath(),
      formatWechatPasteQaPackMarkdown(entries),
      "utf8",
    );
  });
});
