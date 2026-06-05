/**
 * S8-STORY-006D — Matrix regression / paste re-test row sets (Mode A/B).
 */

export const S8_006D_SESSION_ID = "S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D";

/** Sprint HEAD after 006C merge (merge record commit). */
export const S8_006C_SPRINT_HEAD_COMMIT = "db185bf";

export type PasteQa006dSetType = "retest" | "harvest" | "control";

export type RetestRowMeta = {
  matrixRowId: string;
  relatedDrift: string;
  patternApplied: string;
};

export const S8_006D_RETEST_ROW_METAS: RetestRowMeta[] = [
  {
    matrixRowId: "S8M-TITLE-002",
    relatedDrift: "DRIFT-S8-20260604-001",
    patternApplied: "copy-safe-title-divider",
  },
  {
    matrixRowId: "S8M-TITLE-003",
    relatedDrift: "DRIFT-S8-20260604-002",
    patternApplied: "copy-safe-title-divider",
  },
  {
    matrixRowId: "S8M-HEAD-004",
    relatedDrift: "DRIFT-S8-20260604-008",
    patternApplied: "copy-safe-title-divider",
  },
  {
    matrixRowId: "S8M-CARD-001",
    relatedDrift: "DRIFT-S8-20260604-004",
    patternApplied: "copy-safe-card / copy-safe-info-box",
  },
  {
    matrixRowId: "S8M-PARA-004",
    relatedDrift: "DRIFT-S8-20260604-005",
    patternApplied: "copy-safe-card",
  },
  {
    matrixRowId: "S8M-SUM-004",
    relatedDrift: "DRIFT-S8-20260604-006",
    patternApplied: "copy-safe-card",
  },
  {
    matrixRowId: "S8M-CARD-004",
    relatedDrift: "DRIFT-S8-20260604-007",
    patternApplied: "copy-safe-card + copy-safe-left-border",
  },
  {
    matrixRowId: "S8M-LEAD-003",
    relatedDrift: "DRIFT-S8-20260604-009",
    patternApplied: "copy-safe-left-border",
  },
];

export const S8_006D_RETEST_MATRIX_ROW_IDS = S8_006D_RETEST_ROW_METAS.map(
  (m) => m.matrixRowId,
);

export const S8_006D_HARVEST_ROW_METAS = [
  {
    matrixRowId: "S8M-HARVEST-001",
    variantId: "heading_purple_chapter_label_candidate",
    sourceEvidenceId: "WX-HARVEST-EVIDENCE-001",
  },
  {
    matrixRowId: "S8M-HARVEST-002",
    variantId: "info_card_reading_path_candidate",
    sourceEvidenceId: "WX-HARVEST-EVIDENCE-001",
  },
] as const;

export const S8_006D_HARVEST_MATRIX_ROW_IDS = S8_006D_HARVEST_ROW_METAS.map(
  (m) => m.matrixRowId,
);

export const S8_006D_CONTROL_MATRIX_ROW_IDS = [
  "S8M-PARA-001",
  "S8M-LEAD-001",
  "S8M-LIST-001",
  "S8M-CTA-001",
  "S8M-DIV-001",
] as const;

export const S8_006D_ALL_MATRIX_ROW_IDS = [
  ...S8_006D_RETEST_MATRIX_ROW_IDS,
  ...S8_006D_HARVEST_MATRIX_ROW_IDS,
  ...S8_006D_CONTROL_MATRIX_ROW_IDS,
] as const;

export function get006dSetType(matrixRowId: string): PasteQa006dSetType | null {
  if (S8_006D_RETEST_MATRIX_ROW_IDS.includes(matrixRowId)) return "retest";
  if (S8_006D_HARVEST_MATRIX_ROW_IDS.includes(matrixRowId)) return "harvest";
  if (
    (S8_006D_CONTROL_MATRIX_ROW_IDS as readonly string[]).includes(matrixRowId)
  ) {
    return "control";
  }
  return null;
}

export function is006dMatrixRow(matrixRowId: string): boolean {
  return get006dSetType(matrixRowId) != null;
}

export function get006dRetestMeta(
  matrixRowId: string,
): RetestRowMeta | undefined {
  return S8_006D_RETEST_ROW_METAS.find((m) => m.matrixRowId === matrixRowId);
}

export const S8_006D_EXPECTED_CHECKPOINTS = [
  "背景色是否保留",
  "边框是否保留",
  "左侧竖线是否保留",
  "标题装饰线是否位置正常",
  "间距是否严重异常",
  "是否出现三列错位",
  "是否出现高方块线",
  "candidate variant 是否基本可用",
] as const;
