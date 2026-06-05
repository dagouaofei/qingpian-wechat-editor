import { readFileSync, writeFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  S8_006D_ALL_MATRIX_ROW_IDS,
  S8_006D_CONTROL_MATRIX_ROW_IDS,
  S8_006D_HARVEST_MATRIX_ROW_IDS,
  S8_006D_RETEST_MATRIX_ROW_IDS,
  S8_006D_SESSION_ID,
} from "../../support/wechat-fidelity-matrix-006d-retest";
import {
  apply006dPasteOverlay,
  buildWechatFidelityMatrix,
} from "../../support/wechat-fidelity-matrix-builder";
import { S8_FIDELITY_PASTE_QA_OVERLAY_20260604 } from "../../support/wechat-fidelity-matrix-paste-overlay";
import { S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D } from "../../support/wechat-fidelity-matrix-paste-overlay-006d";
import {
  buildPasteQa006dPackEntries,
  formatWechatPasteQa006dPackMarkdown,
  getDefaultPasteQa006dPackDocPath,
  getRepoRootFrom006dImportMeta,
  writePasteQa006dHtmlSnapshots,
} from "../../support/wechat-paste-qa-pack-builder-006d";

describe("S8 WeChat Paste QA pack 006D", () => {
  it("builds 15 entries covering retest, harvest, and control sets", () => {
    const matrix = buildWechatFidelityMatrix();
    const entries = buildPasteQa006dPackEntries(matrix);

    expect(entries).toHaveLength(15);
    expect(entries.map((e) => e.row.matrixRowId)).toEqual([
      ...S8_006D_ALL_MATRIX_ROW_IDS,
    ]);

    const retest = entries.filter((e) => e.setType === "retest");
    expect(retest).toHaveLength(8);
    expect(retest.map((e) => e.row.matrixRowId)).toEqual([
      ...S8_006D_RETEST_MATRIX_ROW_IDS,
    ]);

    const harvest = entries.filter((e) => e.setType === "harvest");
    expect(harvest).toHaveLength(2);
    expect(harvest.map((e) => e.row.matrixRowId)).toEqual([
      ...S8_006D_HARVEST_MATRIX_ROW_IDS,
    ]);
    expect(harvest.every((e) => e.row.variantType === "candidate")).toBe(true);

    const control = entries.filter((e) => e.setType === "control");
    expect(control).toHaveLength(5);
    expect(control.map((e) => e.row.matrixRowId)).toEqual([
      ...S8_006D_CONTROL_MATRIX_ROW_IDS,
    ]);

    for (const entry of entries) {
      expect(entry.copyHtml.length).toBeGreaterThan(0);
      expect(entry.snapshotRelativePath).toMatch(
        /^tests\/snapshots\/wechat-paste-qa\/006d\/.+\.html$/,
      );
    }
  });

  it("harvest candidates are not release1_required and validator passes", () => {
    const matrix = buildWechatFidelityMatrix();
    for (const id of S8_006D_HARVEST_MATRIX_ROW_IDS) {
      const row = matrix.find((r) => r.matrixRowId === id);
      expect(row).toBeDefined();
      expect(row!.variantType).toBe("candidate");
      expect(row!.notes).toContain("release1Eligible: false");
      expect(["PASS", "WARNING"]).toContain(row!.validatorStatus);
      expect(row!.pasteStatus).toBe("UNTESTED");
    }
  });

  it("006D overlay does not overwrite 006 paste data without 006D results (Mode A)", () => {
    expect(Object.keys(S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D)).toHaveLength(
      0,
    );

    const matrix = buildWechatFidelityMatrix();
    for (const id of S8_006D_RETEST_MATRIX_ROW_IDS) {
      const row = matrix.find((r) => r.matrixRowId === id)!;
      const prev = S8_FIDELITY_PASTE_QA_OVERLAY_20260604[id]!;
      expect(row.pasteStatus).toBe(prev.pasteStatus);
      expect(row.pasteEvidence).toBe(prev.pasteEvidence);
      expect(row.contractAction).toContain("queued for 006D re-paste");
      expect(row.notes).toContain("006D-session-2026-06-05");
      expect(row.notes).toContain(`prev=${prev.pasteStatus}`);
    }
  });

  it("006D session rows trace previous 006 overlay for control PASS rows", () => {
    const matrix = buildWechatFidelityMatrix();
    for (const id of S8_006D_CONTROL_MATRIX_ROW_IDS) {
      const row = matrix.find((r) => r.matrixRowId === id)!;
      const prev = S8_FIDELITY_PASTE_QA_OVERLAY_20260604[id]!;
      expect(row.pasteStatus).toBe("PASS");
      expect(prev.pasteStatus).toBe("PASS");
      expect(row.contractAction).toContain("queued for 006D re-paste");
    }
  });

  it("apply006dPasteOverlay preserves row when not in 006D set", () => {
    const matrix = buildWechatFidelityMatrix();
    const title001 = matrix.find((r) => r.matrixRowId === "S8M-TITLE-001")!;
    const reapplied = apply006dPasteOverlay(title001);
    expect(reapplied.pasteStatus).toBe(title001.pasteStatus);
    expect(reapplied.contractAction).toBe(title001.contractAction);
  });

  it("006D session id constant matches overlay module", () => {
    expect(S8_006D_SESSION_ID).toBe(
      "S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D",
    );
  });

  it("matches committed 006D QA pack markdown when UPDATE_PASTE_QA_PACK_006D is unset", () => {
    const generated = formatWechatPasteQa006dPackMarkdown();
    const committed = readFileSync(getDefaultPasteQa006dPackDocPath(), "utf8");
    expect(generated).toBe(committed);
  });

  it("regenerates 006D QA pack and snapshots when UPDATE_PASTE_QA_PACK_006D=1", () => {
    if (process.env.UPDATE_PASTE_QA_PACK_006D !== "1") {
      return;
    }
    const entries = buildPasteQa006dPackEntries();
    const root = getRepoRootFrom006dImportMeta();
    writePasteQa006dHtmlSnapshots(entries, root);
    writeFileSync(
      getDefaultPasteQa006dPackDocPath(),
      formatWechatPasteQa006dPackMarkdown(entries),
      "utf8",
    );
  });
});
