import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { S8_WECHAT_FIDELITY_FIXTURE_COUNT } from "../../fixtures/fidelity/s8-wechat-fidelity-spec";
import {
  buildWechatFidelityMatrix,
  buildWechatFidelityMatrixDocument,
} from "../../support/wechat-fidelity-matrix-builder";
import {
  S8_006D_HARVEST_MATRIX_ROW_IDS,
  S8_006D_RETEST_MATRIX_ROW_IDS,
} from "../../support/wechat-fidelity-matrix-006d-retest";
import { S8_FIDELITY_PASTE_QA_OVERLAY_20260604 } from "../../support/wechat-fidelity-matrix-paste-overlay";

const MATRIX_DOC_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/agile/paste-qa/wechat-fidelity-matrix.md",
);

const REQUIRED_MATRIX_BLOCK_TYPES = [
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

describe("S8 WeChat Fidelity Matrix", () => {
  it("defines at least 30 fixture rows", () => {
    expect(S8_WECHAT_FIDELITY_FIXTURE_COUNT).toBeGreaterThanOrEqual(30);
  });

  it("builds copy HTML and validator results for every fixture", () => {
    const rows = buildWechatFidelityMatrix();
    expect(rows).toHaveLength(S8_WECHAT_FIDELITY_FIXTURE_COUNT);

    const matrixBlockTypes = new Set(rows.map((r) => String(r.matrixBlockType)));
    for (const blockType of REQUIRED_MATRIX_BLOCK_TYPES) {
      expect(matrixBlockTypes.has(blockType)).toBe(true);
    }

    for (const row of rows) {
      expect(row.clipboardHtmlSummary.length).toBeGreaterThan(0);
      expect(row.validation.contractVersionId).toBe("wechat-safe-contract-v1");
      if (S8_FIDELITY_PASTE_QA_OVERLAY_20260604[row.matrixRowId] != null) {
        expect(["PASS", "WARNING", "FAIL"]).toContain(row.pasteStatus);
      } else {
        expect(row.pasteStatus).toBe("UNTESTED");
      }
      expect(["PASS", "WARNING", "FAIL"]).toContain(row.validatorStatus);

      if (row.variantType === "probe") {
        expect(row.probePurpose?.length).toBeGreaterThan(0);
      }
    }

    const byBlock = rows.reduce<Record<string, number>>((acc, row) => {
      const key = String(row.matrixBlockType);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    for (const blockType of REQUIRED_MATRIX_BLOCK_TYPES) {
      expect(byBlock[blockType] ?? 0).toBeGreaterThanOrEqual(2);
    }
  });

  it("includes 006C harvest candidate rows and 006D queue markers", () => {
    const rows = buildWechatFidelityMatrix();
    for (const id of S8_006D_HARVEST_MATRIX_ROW_IDS) {
      const row = rows.find((r) => r.matrixRowId === id);
      expect(row).toBeDefined();
      expect(row!.variantType).toBe("candidate");
      expect(row!.contractAction).toContain("queued for 006D re-paste");
    }
    for (const id of S8_006D_RETEST_MATRIX_ROW_IDS) {
      const row = rows.find((r) => r.matrixRowId === id)!;
      expect(row.contractAction).toContain("queued for 006D re-paste");
      expect(row.notes).toContain("006D-session-2026-06-05");
    }
  });

  it("heading_highlight_marker uses waiver note not bare gradient warning", () => {
    const row = buildWechatFidelityMatrix().find(
      (r) => r.variantId === "heading_highlight_marker",
    );
    expect(row).toBeDefined();
    expect(row!.validation.valid).toBe(true);
    expect(
      row!.validation.notes.some(
        (n) => n.code === "WECHAT_COPY_YELLOW_CSS_WITH_WAIVER",
      ),
    ).toBe(true);
  });

  it("matches committed wechat-fidelity-matrix.md (or regenerates when UPDATE_FIDELITY_MATRIX=1)", () => {
    const generated = buildWechatFidelityMatrixDocument();
    if (process.env.UPDATE_FIDELITY_MATRIX === "1") {
      writeFileSync(MATRIX_DOC_PATH, generated, "utf8");
      return;
    }
    const committed = readFileSync(MATRIX_DOC_PATH, "utf8");
    expect(generated).toBe(committed);
  });
});
