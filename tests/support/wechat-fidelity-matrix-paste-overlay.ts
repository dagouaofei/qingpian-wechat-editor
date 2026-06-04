import type { FidelityPasteStatus } from "@/core/wechat-compat/fidelity-matrix-types";

/** PO Paste QA Session 2026-06-04 — synced from wechat-paste-qa-session (19 rows). */
export type FidelityPasteOverlay = {
  pasteStatus: FidelityPasteStatus;
  pasteEvidence: string;
  contractAction: string;
};

export const S8_FIDELITY_PASTE_QA_OVERLAY_20260604: Record<
  string,
  FidelityPasteOverlay
> = {
  "S8M-TITLE-001": {
    pasteStatus: "WARNING",
    pasteEvidence: "没有显示卡片边框和背景色",
    contractAction:
      "See DRIFT-S8-20260604-003 (observation · needs product clarification; not renderer bug)",
  },
  "S8M-TITLE-002": {
    pasteStatus: "FAIL",
    pasteEvidence:
      "错误的显示成了左右三等分，最左侧的方框和竖线分别显示到了第一等分和第二等分区域",
    contractAction: "See DRIFT-S8-20260604-001",
  },
  "S8M-TITLE-003": {
    pasteStatus: "FAIL",
    pasteEvidence:
      "标题文字下面的线显示成了很高度很高的贯穿左右的长方形，而且错误的显示了边框",
    contractAction: "See DRIFT-S8-20260604-002",
  },
  "S8M-HEAD-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-HEAD-002": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction:
      "Validator false positive · paste PASS; track (no Contract change S8-006)",
  },
  "S8M-HEAD-004": {
    pasteStatus: "WARNING",
    pasteEvidence: "没有显示上下两条横线",
    contractAction: "See DRIFT-S8-20260604-008",
  },
  "S8M-PARA-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-PARA-004": {
    pasteStatus: "FAIL",
    pasteEvidence: "没有显示卡片边框和背景色",
    contractAction: "See DRIFT-S8-20260604-005",
  },
  "S8M-LEAD-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-LEAD-003": {
    pasteStatus: "WARNING",
    pasteEvidence: "没有显示最左侧的竖线",
    contractAction: "See DRIFT-S8-20260604-009",
  },
  "S8M-LIST-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-QUOTE-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-SUM-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-SUM-004": {
    pasteStatus: "FAIL",
    pasteEvidence: "没有显示卡片边框和背景色",
    contractAction: "See DRIFT-S8-20260604-006",
  },
  "S8M-CARD-001": {
    pasteStatus: "WARNING",
    pasteEvidence: "没有显示卡片边框和背景色",
    contractAction: "See DRIFT-S8-20260604-004",
  },
  "S8M-CARD-004": {
    pasteStatus: "FAIL",
    pasteEvidence: "没有显示卡片背景色和左侧竖线",
    contractAction: "See DRIFT-S8-20260604-007",
  },
  "S8M-CTA-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-DIV-001": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
  "S8M-DIV-004": {
    pasteStatus: "PASS",
    pasteEvidence: "MP editor 2026-06-04 · 维多",
    contractAction: "No action; paste PASS",
  },
};
