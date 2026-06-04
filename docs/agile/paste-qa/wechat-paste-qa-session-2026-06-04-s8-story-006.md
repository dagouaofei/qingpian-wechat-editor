# Paste QA Session — 2026-06-04（S8-STORY-006）

> **状态：** PO 已填 · Smoke/Risk/Probe **19 行** · Matrix / Drift 已同步（2026-06-04）  
> **Workflow：** `[wechat-paste-qa-workflow.md](wechat-paste-qa-workflow.md)`  
> **QA Pack：** `[wechat-paste-qa-pack-2026-06-04.md](wechat-paste-qa-pack-2026-06-04.md)`

---

## 1. Session 基本信息


| 字段            | 值                                       |
| ------------- | --------------------------------------- |
| 日期            | *2026年6月4日*                             |
| 测试人           | *维多*                                    |
| 操作系统          | *macbook air M2*                        |
| 浏览器           | *chrome*                                |
| 微信公众号后台       | 图文消息 · 正文编辑器                            |
| 是否经 135 辅助    | *否*                                     |
| 是否直接粘贴到公众号编辑器 | *是*                                     |
| 是否查看粘贴后源码/DOM | *否*                                     |
| Matrix 版本     | S8-STORY-005 · 35 行（2026-06-04）         |
| Contract 版本   | `wechat-safe-contract-v1`               |
| Validator     | S8-STORY-004 · `validateWechatCopyHtml` |


---

## 2. 本轮测试范围


| 集合            | 条数  | 目的                        |
| ------------- | --- | ------------------------- |
| **Smoke Set** | 10  | 10 类控件各 1 条 existing 代表   |
| **Risk Set**  | 5   | validator FAIL · 实机是否失真   |
| **Probe Set** | 4   | Yellow 边界 · probe variant |


**可选追加：** `S8M-HEAD-003` · `heading_highlight_marker`（waiver 实机复测）

---

## 3. Smoke Set


| matrixRowId   | blockType | variantId                 | validatorStatus | validatorErrors | validatorWarnings         | copyHtmlSource                                                                   | pasteStatus | pasteEvidence     | driftId | PO notes | nextAction |
| ------------- | --------- | ------------------------- | --------------- | --------------- | ------------------------- | -------------------------------------------------------------------------------- | ----------- | ----------------- | ------- | -------- | ---------- |
| S8M-TITLE-001 | title     | title_plain_minimal       | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | [pack §2](wechat-paste-qa-pack-2026-06-04.md#s8m-title-001--title_plain_minimal) | **WARNING** | **没有显示卡片边框和背景色** | DRIFT-S8-20260604-003 |          |            |
| S8M-HEAD-001  | heading   | heading_short_line        | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-PARA-001  | paragraph | paragraph_plain_body      | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-LEAD-001  | lead      | lead_plain_intro          | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-LIST-001  | list      | list_plain_bullets        | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-QUOTE-001 | quote     | quote_plain               | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-SUM-001   | summary   | highlight_inline_emphasis | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-CARD-001  | info_card | info_card_key_takeaway    | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | **WARNING** | **没有显示卡片边框和背景色**  | DRIFT-S8-20260604-004 |          |            |
| S8M-CTA-001   | cta       | cta_plain_text            | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |
| S8M-DIV-001   | divider   | divider_simple_line       | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack                                                                             | PASS        | —                 | —       |          |            |


---

## 4. Risk Set（validator FAIL · 不在 005/006 修 renderer）


| matrixRowId   | blockType | variantId                   | validatorStatus | validatorErrors        | validatorWarnings         | copyHtmlSource | pasteStatus | pasteEvidence                           | driftId | PO notes            | nextAction |
| ------------- | --------- | --------------------------- | --------------- | ---------------------- | ------------------------- | -------------- | ----------- | --------------------------------------- | ------- | ------------------- | ---------- |
| S8M-TITLE-002 | title     | title_left_bar_classic      | FAIL            | WECHAT_COPY_RED_CSS, … | WECHAT_COPY_YELLOW_TAG, … | pack §3        | FAIL        | 错误的显示成了左右三等分，最左侧的方框和竖线分别显示到了第一等分和第二等分区域 | DRIFT-S8-20260604-001 | 候选池；实机 FAIL 须 Drift |            |
| S8M-TITLE-003 | title     | title_bottom_line_editorial | FAIL            | WECHAT_COPY_RED_CSS    | WECHAT_COPY_YELLOW_TAG, … | pack §3        | FAIL        | 标题文字下面的线显示成了很高度很高的贯穿左右的长方形，而且错误的显示了边框   | DRIFT-S8-20260604-002 |                     |            |
| S8M-HEAD-002  | heading   | heading_numbered_section    | FAIL            | WECHAT_COPY_RED_CSS    | WECHAT_COPY_YELLOW_TAG, … | pack §3        | PASS        | —                                       | —       | Validator FAIL · paste PASS |            |
| S8M-HEAD-004  | heading   | heading_card_centered       | FAIL            | WECHAT_COPY_RED_CSS    | WECHAT_COPY_YELLOW_TAG, … | pack §3        | **WARNING** | 没有显示上下两条横线                              | DRIFT-S8-20260604-008 |                     |            |
| S8M-LEAD-003  | lead      | lead_quote_intro            | FAIL            | WECHAT_COPY_RED_CSS    | WECHAT_COPY_YELLOW_TAG, … | pack §3        | **WARNING** | 没有显示最左侧的竖线                              | DRIFT-S8-20260604-009 |                     |            |


---

## 5. Probe Set


| matrixRowId  | blockType | variantId              | validatorStatus | validatorErrors | validatorWarnings         | copyHtmlSource | pasteStatus | pasteEvidence  | driftId | PO notes           | nextAction |
| ------------ | --------- | ---------------------- | --------------- | --------------- | ------------------------- | -------------- | ----------- | -------------- | ------- | ------------------ | ---------- |
| S8M-PARA-004 | paragraph | paragraph_callout_soft | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack §4        | FAIL        | 没有显示卡片边框和背景色   | DRIFT-S8-20260604-005 | probe              |            |
| S8M-SUM-004  | summary   | highlight_border_glow  | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack §4        | FAIL        | 没有显示卡片边框和背景色   | DRIFT-S8-20260604-006 | probe · box-shadow |            |
| S8M-CARD-004 | info_card | info_card_soft_banner  | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack §4        | FAIL        | 没有显示卡片背景色和左侧竖线 | DRIFT-S8-20260604-007 | probe              |            |
| S8M-DIV-004  | divider   | divider_short_accent   | WARNING         | —               | WECHAT_COPY_YELLOW_TAG, … | pack §4        | PASS        | —              | —       | probe              |            |


---

## 6. Session 汇总（PO 填写后更新）


| 指标       | 数量  |
| -------- | --- |
| PASS     | 10  |
| WARNING  | 4   |
| FAIL     | 5   |
| UNTESTED | 16（Matrix 35 行 − 本 Session 19 行） |


---

## 7. 变更记录


| 日期         | 变更                          |
| ---------- | --------------------------- |
| 2026-06-04 | 创建 Session 模板（S8-STORY-006） |
| 2026-06-04 | PO 实机 19 行 · 同步 Matrix paste 列 · Drift 001–009 |


