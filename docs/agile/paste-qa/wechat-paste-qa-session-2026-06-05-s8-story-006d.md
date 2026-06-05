# Paste QA Session — 2026-06-05（S8-STORY-006D）

> **状态：** **PO 已填 · Mode B 完成**（15 行 · Matrix / Drift / overlay 已同步）  
> **Workflow：** [`wechat-paste-qa-workflow.md`](wechat-paste-qa-workflow.md)  
> **QA Pack：** [`wechat-paste-qa-pack-2026-06-05-s8-story-006d.md`](wechat-paste-qa-pack-2026-06-05-s8-story-006d.md)  
> **上一轮 Session：** [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md)（19 行 · 历史记录保留）

---

## 1. Session 基本信息

| 字段 | 值 |
|------|-----|
| 日期 | 2026年6月5日 |
| 测试人 | 维多 |
| 操作系统 | macbook air M2 |
| 浏览器 | chrome |
| 微信公众号后台 | 图文消息 · 正文编辑器 |
| 是否经 135 辅助 | 否 |
| 是否直接粘贴到公众号编辑器 | 是 |
| 是否查看粘贴后源码/DOM | 否 |
| Matrix 版本 | S8-STORY-006C · 37 行（2026-06-05） |
| 006C commit hash | `db185bf`（sprint HEAD merge record） |
| Contract version | `wechat-safe-contract-v1` |
| Validator version | S8-STORY-004 · `validateWechatCopyHtml` |
| retestSessionId | `S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D` |

---

## 2. Re-test Set（006C affected · 8 行）

| matrixRowId | blockType | variantId | relatedDrift | validatorStatusAfter006C | previousPasteStatus | currentPasteStatus | currentPasteEvidence | actualChange | driftStatusAfterRetest | nextAction | PO notes |
|-------------|-----------|-----------|--------------|--------------------------|---------------------|--------------------|----------------------|--------------|------------------------|------------|----------|
| S8M-TITLE-002 | title | title_left_bar_classic | DRIFT-S8-20260604-001 | FAIL | FAIL | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-TITLE-003 | title | title_bottom_line_editorial | DRIFT-S8-20260604-002 | WARNING | FAIL | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-HEAD-004 | heading | heading_card_centered | DRIFT-S8-20260604-008 | FAIL | WARNING | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-CARD-001 | info_card | info_card_key_takeaway | DRIFT-S8-20260604-004 | WARNING | WARNING | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-PARA-004 | paragraph | paragraph_callout_soft | DRIFT-S8-20260604-005 | WARNING | FAIL | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-SUM-004 | summary | highlight_border_glow | DRIFT-S8-20260604-006 | WARNING | FAIL | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-CARD-004 | info_card | info_card_soft_banner | DRIFT-S8-20260604-007 | WARNING | FAIL | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |
| S8M-LEAD-003 | lead | lead_quote_intro | DRIFT-S8-20260604-009 | FAIL | WARNING | **PASS** | MP editor 2026-06-05 · 维多 | improved | **RESOLVED_BY_006C_REPASTE_PASS** | No action; drift closed | |

**previousPasteEvidence（Session 2026-06-04）：**

| matrixRowId | previousPasteEvidence |
|-------------|----------------------|
| S8M-TITLE-002 | 错误的显示成了左右三等分，最左侧的方框和竖线分别显示到了第一等分和第二等分区域 |
| S8M-TITLE-003 | 标题文字下面的线显示成了很高度很高的贯穿左右的长方形，而且错误的显示了边框 |
| S8M-HEAD-004 | 没有显示上下两条横线 |
| S8M-CARD-001 | 没有显示卡片边框和背景色 |
| S8M-PARA-004 | 没有显示卡片边框和背景色 |
| S8M-SUM-004 | 没有显示卡片边框和背景色 |
| S8M-CARD-004 | 没有显示卡片背景色和左侧竖线 |
| S8M-LEAD-003 | 没有显示最左侧的竖线 |

---

## 3. Harvest Candidate Set（首次 Paste QA · 2 行）

| matrixRowId | variantId | sourceEvidenceId | validatorStatus | currentPasteStatus | currentPasteEvidence | candidateAssessment | candidateNextAction | PO notes |
|-------------|-----------|------------------|-----------------|--------------------|----------------------|---------------------|---------------------|----------|
| S8M-HARVEST-001 | heading_purple_chapter_label_candidate | WX-HARVEST-EVIDENCE-001 | PASS | **PASS** | MP editor 2026-06-05 · 维多 | **candidate-paste-pass** | Keep candidate; S9 pool review; not default preset | |
| S8M-HARVEST-002 | info_card_reading_path_candidate | WX-HARVEST-EVIDENCE-001 | PASS | **PASS** | MP editor 2026-06-05 · 维多 | **candidate-paste-pass** | Keep candidate; S9 pool review; not default preset | |

---

## 4. Control Set（回归 · 5 行）

| matrixRowId | variantId | previousPasteStatus | currentPasteStatus | regressionResult | PO notes |
|-------------|-----------|---------------------|--------------------|------------------|----------|
| S8M-PARA-001 | paragraph_plain_body | PASS | **PASS** | **no_regression** | |
| S8M-LEAD-001 | lead_plain_intro | PASS | **PASS** | **no_regression** | |
| S8M-LIST-001 | list_plain_bullets | PASS | **PASS** | **no_regression** | |
| S8M-CTA-001 | cta_plain_text | PASS | **PASS** | **no_regression** | |
| S8M-DIV-001 | divider_simple_line | PASS | **PASS** | **no_regression** | |

---

## 5. 006D 汇总

| 类别 | 数量 |
|------|------|
| Re-test PASS（Drift resolved） | 8 |
| Harvest candidate-paste-pass | 2 |
| Control no_regression | 5 |
| WARNING / FAIL（006D） | 0 |

**未纳入本轮：** DRIFT-003（observation）· S8M-HEAD-002（→ 007）

---

## 6. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-05 | 初版 Session 模板（Mode A） |
| 2026-06-05 | PO 回填 · Mode B · overlay / Matrix / Drift 同步 |
