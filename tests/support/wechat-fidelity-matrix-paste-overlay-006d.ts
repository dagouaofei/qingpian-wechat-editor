import type { FidelityPasteStatus } from "@/core/wechat-compat/fidelity-matrix-types";

import { S8_006D_SESSION_ID } from "./wechat-fidelity-matrix-006d-retest";

/** PO Paste QA Session 2026-06-05 · S8-STORY-006D (Mode A: empty until PO fills). */
export type FidelityPasteOverlay006d = {
  pasteStatus: FidelityPasteStatus;
  pasteEvidence: string;
  contractAction: string;
  retestSessionId: typeof S8_006D_SESSION_ID;
  previousPasteStatus?: FidelityPasteStatus;
  previousPasteEvidence?: string;
};

export const S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D: Record<
  string,
  FidelityPasteOverlay006d
> = {
  // Mode A: no PO results — overlay entries added when session is filled (Mode B).
};
