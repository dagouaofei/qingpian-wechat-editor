# WeChat Fidelity Matrix（Contract v1 · 第一版）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Contract：** `wechat-safe-contract-v1` · **Profile：** `wechat-mp-editor-v1`  
> **Story：** S8-STORY-005 · **生成：** `tests/support/wechat-fidelity-matrix-builder.ts`  
> **状态：** Validator 已跑 · Paste QA **UNTESTED**（待 S8-STORY-006）

---

## 1. Matrix 目标

在多控件、多 variant 的 **fixture** 上验证：

1. Copy Renderer 产物可生成 Clipboard HTML；
2. `validateWechatCopyHtml()` 与 Contract v1 / Compatibility Profile 一致；
3. 为公众号实机粘贴（Paste QA）提供可追溯行（`matrixRowId` + `fixtureId`）。

**非目标：** 视觉升级、扩充默认样式库、修改 Contract v1 分级。

---

## 2. 状态定义

| 字段 | 取值 | 含义 |
|------|------|------|
| **validatorStatus** | PASS | `valid=true` 且无 warning |
| | WARNING | `valid=true` 但有 Yellow 等 warning |
| | FAIL | 存在 error（`valid=false`） |
| **pasteStatus** | PASS / FAIL / WARNING / UNTESTED | 公众号实机粘贴结果；本轮均为 **UNTESTED** |

**重要：** `validatorStatus=PASS` **不代表** Paste QA PASS。

---

## 3. Variant 类型

| 类型 | 说明 |
|------|------|
| **existing** | 已有产品 variant（Release 1 路径） |
| **probe** | 测试专用；验证某 CSS/DOM 能力；**不**进入默认 preset / 用户可选池 |
| **candidate** | 候选正式样式；仅 Matrix + Paste QA 通过后再考虑入池 |

Fixture 使用 preset `s8_fidelity_matrix_test`（test-only）；probe variant 仅通过 `blockOverrides` 引用。

---

## 4. Validator vs Paste

| 层 | 工具 | 本轮 |
|----|------|------|
| 机器校验 | `validateWechatCopyHtml` | 已执行（见下表） |
| 实机粘贴 | 公众号后台 / 135 | **未执行** → pasteStatus=UNTESTED |

---

## 5. 本轮覆盖

- **控件：** title · heading · paragraph · lead · list · quote · summary（`highlight`）· info_card · cta · divider  
- **样本数：** 35 行（≥30）  
- **汇总：** PASS 0 · WARNING 30 · FAIL 5  
- **CSS 能力：** Green/Yellow 见 sprint8 / contract v1；Red 能力仅在 Validator 单测，不纳入本轮粘贴样本  

---

## 6. Matrix 表

| matrixRowId | blockType | variantId | variantType | fixtureId | cssCapability | domStructure | contractLevel | validatorStatus | validatorErrors | validatorWarnings | validatorNotes | pasteStatus | pasteEvidence | contractAction | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S8M-TITLE-001 | title | title_plain_minimal | existing | s8-title-plain-minimal | font-size, font-weight, color, line-height, text-align | section > h1[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-TITLE-002 | title | title_left_bar_classic | candidate | s8-title-left-bar | border-left, padding, margin, background-color | section > h1[style*=border-left] | mixed | FAIL | WECHAT_COPY_RED_CSS, WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_TAG, … | — | UNTESTED | — | Fix Red violations or adjust Contract/Renderer | candidate: not in default preset until Matrix PASS |
| S8M-TITLE-003 | title | title_bottom_line_editorial | existing | s8-title-bottom-line | text-align:center, border, padding, font-size | section > h1[style*=border-bottom] | mixed | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_TAG, … | — | UNTESTED | — | Fix Red violations or adjust Contract/Renderer | — |
| S8M-HEAD-001 | heading | heading_short_line | existing | s8-heading-short-line | font-size, font-weight, margin, border | section > h3[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_MAX_NESTING_DEPTH_EXCEEDED, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_MAX_NESTING_DEPTH_EXCEEDED | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-HEAD-002 | heading | heading_numbered_section | existing | s8-heading-numbered | display:inline-block, margin, padding, section wrapper | section > span + h3 | mixed | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Fix Red violations or adjust Contract/Renderer | — |
| S8M-HEAD-003 | heading | heading_highlight_marker | existing | s8-heading-highlight-marker | linear-gradient, box-decoration-break, section wrapper | section > h3[style*=linear-gradient] | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | WECHAT_COPY_YELLOW_CSS_WITH_WAIVER, WECHAT_COPY_YELLOW_CSS_WITH_WAIVER, WECHAT_COPY_YELLOW_CSS_WITH_WAIVER | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | waiver: PASTE-HEADING-HIGHLIGHT-20260603 |
| S8M-HEAD-004 | heading | heading_card_centered | existing | s8-heading-card-centered | background-color, border-radius, padding, text-align:center | section > h3[style*=background] | mixed | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Fix Red violations or adjust Contract/Renderer | — |
| S8M-PARA-001 | paragraph | paragraph_plain_body | existing | s8-paragraph-plain | font-size, line-height, color, margin | p[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-PARA-002 | paragraph | paragraph_accent_left | existing | s8-paragraph-accent-left | border-left, padding, background-color | p[style*=border-left] | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-PARA-003 | paragraph | paragraph_soft_card | existing | s8-paragraph-soft-card | background-color, border-radius, padding, div wrapper | section > p[style*=background] | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-PARA-004 | paragraph | paragraph_callout_soft | probe | s8-paragraph-callout-probe | section wrapper, padding, border-radius | section > p (callout expansion layout) | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | probe: Probe soft-card / section wrapper for paragraph expansion |
| S8M-LEAD-001 | lead | lead_plain_intro | existing | s8-lead-plain | font-size, line-height, color, margin | p[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-LEAD-002 | lead | lead_accent_band | existing | s8-lead-accent-band | background-color, padding, border-left | section > p[style*=background] | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-LEAD-003 | lead | lead_quote_intro | existing | s8-lead-quote-intro | border-left, padding, font-style, color | p[style*=border-left] | mixed | FAIL | WECHAT_COPY_RED_CSS | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Fix Red violations or adjust Contract/Renderer | — |
| S8M-LIST-001 | list | list_plain_bullets | existing | s8-list-plain-bullets | margin, padding, line-height | ul/ol > li[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-LIST-002 | list | list_numbered_steps | existing | s8-list-numbered-steps | display:inline-block, margin, font-weight | ol > li + span index | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-LIST-003 | list | list_checklist_cards | existing | s8-list-checklist-cards | background-color, border-radius, section wrapper | section > ul/ol card rows | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, … | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-QUOTE-001 | quote | quote_plain | existing | s8-quote-plain | font-size, color, line-height, margin | p[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-QUOTE-002 | quote | quote_left_bar | existing | s8-quote-left-bar | border-left, padding, color | p[style*=border-left] | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-QUOTE-003 | quote | quote_card | existing | s8-quote-card | background-color, border-radius, padding | section > p card | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-SUM-001 | summary | highlight_inline_emphasis | existing | s8-summary-inline | font-weight, color, background-color | p/span emphasis inline | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-SUM-002 | summary | highlight_accent_band | existing | s8-summary-accent-band | background-color, padding, border-left | section > p band | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-SUM-003 | summary | highlight_soft_card | existing | s8-summary-soft-card | background-color, border-radius, padding | section > p soft card | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-SUM-004 | summary | highlight_border_glow | probe | s8-summary-border-glow-probe | box-shadow, border-radius, section wrapper | section > p glow card | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | probe: Probe Yellow box-shadow / glow on summary (highlight) expansion |
| S8M-CARD-001 | info_card | info_card_key_takeaway | existing | s8-info-key-takeaway | background-color, padding, border, font-size | section > div/p card | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-CARD-002 | info_card | info_card_steps | existing | s8-info-steps | margin, padding, border-left, line-height | section > stacked steps | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-CARD-003 | info_card | info_card_warning_note | existing | s8-info-warning | background-color, border, color | section > warning band | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-CARD-004 | info_card | info_card_soft_banner | probe | s8-info-soft-banner-probe | box-shadow, border-radius, section wrapper | section > info banner | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | probe: Probe info_card expansion banner / Yellow decoration |
| S8M-CTA-001 | cta | cta_plain_text | existing | s8-cta-plain | font-size, color, text-align, margin | p[style*=inline] | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-CTA-002 | cta | cta_button_like | existing | s8-cta-button | background-color, border-radius, padding, display:inline-block | section > span/button-like | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-CTA-003 | cta | cta_qr_placeholder | existing | s8-cta-qr-placeholder | border, padding, max-width, section wrapper | section > qr placeholder box | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_TAG | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-DIV-001 | divider | divider_simple_line | existing | s8-divider-line | border, margin, height | hr or div line | green | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-DIV-002 | divider | divider_dotted_line | existing | s8-divider-dotted | border, margin, letter-spacing | div dotted rule | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-DIV-003 | divider | divider_section_space | existing | s8-divider-section-space | margin, height, section wrapper | section spacing block | yellow | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | — |
| S8M-DIV-004 | divider | divider_short_accent | probe | s8-divider-short-accent-probe | border, margin, max-width | div short line accent | mixed | WARNING | — | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER | — | UNTESTED | — | Track in Matrix; Paste QA in STORY-006; waiver only with evidence | probe: Probe short accent divider expansion (Yellow decoration) |


---

## 7. S8-STORY-006 Paste QA 入口

| 文档 | 用途 |
|------|------|
| [`wechat-paste-qa-workflow.md`](wechat-paste-qa-workflow.md) | 公众号实机粘贴标准流程 |
| [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md) | 第一轮 Session 表（**paste 默认 UNTESTED**） |
| [`wechat-paste-qa-pack-2026-06-04.md`](wechat-paste-qa-pack-2026-06-04.md) | Smoke / Risk / Probe Copy HTML 样本包 |

**回填规则：** 仅 PO 实机后可改上表 `pasteStatus` / `pasteEvidence`；**禁止** Cursor/CI 虚构 PASS。

### 7.1 Risk Set（validator FAIL · 跟踪口径）

以下五行 **不在 S8-STORY-005 修复**；已纳入 Paste QA Risk Set，由 **STORY-006 / Drift / 后续** 闭环：

| matrixRowId | variantId |
|-------------|-----------|
| S8M-TITLE-002 | `title_left_bar_classic` |
| S8M-TITLE-003 | `title_bottom_line_editorial` |
| S8M-HEAD-002 | `heading_numbered_section` |
| S8M-HEAD-004 | `heading_card_centered` |
| S8M-LEAD-003 | `lead_quote_intro` |

实机粘贴若 FAIL → `DRIFT-S8-YYYYMMDD-###`（见 [`copy-drift-diagnostics.md`](../../architecture/copy-drift-diagnostics.md)）。

---

## 8. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 创建第一版 Matrix（fixture + validator） | S8-STORY-005 |
| 2026-06-04 | §7 Paste QA 入口 · Risk Set 说明（paste 仍 UNTESTED） | S8-STORY-006 |
