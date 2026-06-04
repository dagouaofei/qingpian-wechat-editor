# Paste QA Session — 2026-06-04（S8-STORY-006 · 待填）

> **状态：** 模板 · 所有 `pasteStatus` 默认 **UNTESTED**（须 PO 在公众号后台实机填写）  
> **Workflow：** [`wechat-paste-qa-workflow.md`](wechat-paste-qa-workflow.md)  
> **QA Pack：** [`wechat-paste-qa-pack-2026-06-04.md`](wechat-paste-qa-pack-2026-06-04.md)

---

## 1. Session 基本信息

| 字段 | 值 |
|------|-----|
| 日期 | _待填_ |
| 测试人 | _待填_ |
| 操作系统 | _待填_ |
| 浏览器 | _待填_ |
| 微信公众号后台 | 图文消息 · 正文编辑器 |
| 是否经 135 辅助 | _待填（是/否）_ |
| 是否直接粘贴到公众号编辑器 | _待填（须为「是」作正式 evidence）_ |
| 是否查看粘贴后源码/DOM | _待填_ |
| Matrix 版本 | S8-STORY-005 · 35 行（2026-06-04） |
| Contract 版本 | `wechat-safe-contract-v1` |
| Validator | S8-STORY-004 · `validateWechatCopyHtml` |

---

## 2. 本轮测试范围

| 集合 | 条数 | 目的 |
|------|------|------|
| **Smoke Set** | 10 | 10 类控件各 1 条 existing 代表 |
| **Risk Set** | 5 | validator FAIL · 实机是否失真 |
| **Probe Set** | 4 | Yellow 边界 · probe variant |

**可选追加：** `S8M-HEAD-003` · `heading_highlight_marker`（waiver 实机复测）

---

## 3. Smoke Set

| matrixRowId | blockType | variantId | validatorStatus | validatorErrors | validatorWarnings | copyHtmlSource | pasteStatus | pasteEvidence | driftId | PO notes | nextAction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S8M-TITLE-001 | title | title_plain_minimal | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | [pack §2](wechat-paste-qa-pack-2026-06-04.md#s8m-title-001--title_plain_minimal) | UNTESTED | — | — | | |
| S8M-HEAD-001 | heading | heading_short_line | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-PARA-001 | paragraph | paragraph_plain_body | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-LEAD-001 | lead | lead_plain_intro | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-LIST-001 | list | list_plain_bullets | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-QUOTE-001 | quote | quote_plain | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-SUM-001 | summary | highlight_inline_emphasis | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-CARD-001 | info_card | info_card_key_takeaway | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-CTA-001 | cta | cta_plain_text | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |
| S8M-DIV-001 | divider | divider_simple_line | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack | UNTESTED | — | — | | |

---

## 4. Risk Set（validator FAIL · 不在 005/006 修 renderer）

| matrixRowId | blockType | variantId | validatorStatus | validatorErrors | validatorWarnings | copyHtmlSource | pasteStatus | pasteEvidence | driftId | PO notes | nextAction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S8M-TITLE-002 | title | title_left_bar_classic | FAIL | WECHAT_COPY_RED_CSS, … | WECHAT_COPY_YELLOW_TAG, … | pack §3 | UNTESTED | — | — | 候选池；实机 FAIL 须 Drift | |
| S8M-TITLE-003 | title | title_bottom_line_editorial | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, … | pack §3 | UNTESTED | — | — | | |
| S8M-HEAD-002 | heading | heading_numbered_section | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, … | pack §3 | UNTESTED | — | — | | |
| S8M-HEAD-004 | heading | heading_card_centered | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, … | pack §3 | UNTESTED | — | — | | |
| S8M-LEAD-003 | lead | lead_quote_intro | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, … | pack §3 | UNTESTED | — | — | | |

---

## 5. Probe Set

| matrixRowId | blockType | variantId | validatorStatus | validatorErrors | validatorWarnings | copyHtmlSource | pasteStatus | pasteEvidence | driftId | PO notes | nextAction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S8M-PARA-004 | paragraph | paragraph_callout_soft | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack §4 | UNTESTED | — | — | probe | |
| S8M-SUM-004 | summary | highlight_border_glow | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack §4 | UNTESTED | — | — | probe · box-shadow | |
| S8M-CARD-004 | info_card | info_card_soft_banner | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack §4 | UNTESTED | — | — | probe | |
| S8M-DIV-004 | divider | divider_short_accent | WARNING | — | WECHAT_COPY_YELLOW_TAG, … | pack §4 | UNTESTED | — | — | probe | |

---

## 6. Session 汇总（PO 填写后更新）

| 指标 | 数量 |
|------|------|
| PASS | _待填_ |
| WARNING | _待填_ |
| FAIL | _待填_ |
| UNTESTED | 19（初始） |

---

## 7. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 创建 Session 模板（S8-STORY-006） |
