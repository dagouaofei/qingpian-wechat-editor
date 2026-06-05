import type { FidelityPasteStatus } from "@/core/wechat-compat/fidelity-matrix-types";

import { S8_006D_SESSION_ID } from "./wechat-fidelity-matrix-006d-retest";

/** PO Paste QA Session 2026-06-05 · S8-STORY-006D (Mode B · PO 已回填). */
export type FidelityPasteOverlay006d = {
  pasteStatus: FidelityPasteStatus;
  pasteEvidence: string;
  contractAction: string;
  retestSessionId: typeof S8_006D_SESSION_ID;
  previousPasteStatus?: FidelityPasteStatus;
  previousPasteEvidence?: string;
};

const PO_PASS_EVIDENCE_006D = "MP editor 2026-06-05 · 维多";

const RESOLVED_CONTRACT_ACTION =
  "Resolved by 006C; paste PASS in 006D";

const HARVEST_PASS_CONTRACT_ACTION =
  "candidate-paste-pass; not in default preset; S9 pool review";

const CONTROL_PASS_CONTRACT_ACTION =
  "006D control regression PASS; no regression from 006C";

export const S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D: Record<
  string,
  FidelityPasteOverlay006d
> = {
  "S8M-TITLE-002": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "FAIL",
    previousPasteEvidence:
      "错误的显示成了左右三等分，最左侧的方框和竖线分别显示到了第一等分和第二等分区域",
  },
  "S8M-TITLE-003": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "FAIL",
    previousPasteEvidence:
      "标题文字下面的线显示成了很高度很高的贯穿左右的长方形，而且错误的显示了边框",
  },
  "S8M-HEAD-004": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "WARNING",
    previousPasteEvidence: "没有显示上下两条横线",
  },
  "S8M-CARD-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "WARNING",
    previousPasteEvidence: "没有显示卡片边框和背景色",
  },
  "S8M-PARA-004": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "FAIL",
    previousPasteEvidence: "没有显示卡片边框和背景色",
  },
  "S8M-SUM-004": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "FAIL",
    previousPasteEvidence: "没有显示卡片边框和背景色",
  },
  "S8M-CARD-004": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "FAIL",
    previousPasteEvidence: "没有显示卡片背景色和左侧竖线",
  },
  "S8M-LEAD-003": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: RESOLVED_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "WARNING",
    previousPasteEvidence: "没有显示最左侧的竖线",
  },
  "S8M-HARVEST-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: HARVEST_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "UNTESTED",
    previousPasteEvidence: "—",
  },
  "S8M-HARVEST-002": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: HARVEST_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "UNTESTED",
    previousPasteEvidence: "—",
  },
  "S8M-PARA-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: CONTROL_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "PASS",
    previousPasteEvidence: "MP editor 2026-06-04 · 维多",
  },
  "S8M-LEAD-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: CONTROL_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "PASS",
    previousPasteEvidence: "MP editor 2026-06-04 · 维多",
  },
  "S8M-LIST-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: CONTROL_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "PASS",
    previousPasteEvidence: "MP editor 2026-06-04 · 维多",
  },
  "S8M-CTA-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: CONTROL_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "PASS",
    previousPasteEvidence: "MP editor 2026-06-04 · 维多",
  },
  "S8M-DIV-001": {
    pasteStatus: "PASS",
    pasteEvidence: PO_PASS_EVIDENCE_006D,
    contractAction: CONTROL_PASS_CONTRACT_ACTION,
    retestSessionId: S8_006D_SESSION_ID,
    previousPasteStatus: "PASS",
    previousPasteEvidence: "MP editor 2026-06-04 · 维多",
  },
};
