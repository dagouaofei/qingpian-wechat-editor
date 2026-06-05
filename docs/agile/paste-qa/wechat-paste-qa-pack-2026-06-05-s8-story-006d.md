# WeChat Paste QA Pack（2026-06-05 · S8-STORY-006D）

> **用途：** 006C 后 Matrix 回归 + Harvest candidate 首次实机粘贴 · **Contract：** `wechat-safe-contract-v1`  
> **生成：** `tests/support/wechat-paste-qa-pack-builder-006d.ts`  
> **006C commit：** `db185bf`（sprint HEAD merge record）  
> **Session overlay：** `S8_FIDELITY_PASTE_QA_OVERLAY_20260605_006D`  
> **流程：** [`wechat-paste-qa-workflow.md`](wechat-paste-qa-workflow.md) · **Session：** [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md)  
> **上一轮：** [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md)（19 行 · 保留为历史记录）

---

## 1. 集合概览

| 集合 | 条数 | 目的 |
|------|------|------|
| **Re-test Set** | 8 | 006C copy-safe pattern 影响行 · Drift 001/002/004–009 |
| **Harvest Candidate Set** | 2 | 006C 新增 candidate · 首次公众号粘贴 |
| **Control Set** | 5 | 006 已 PASS 基础样本 · 确认无倒退 |

**状态：** Ready for PO Paste QA（Mode A — 未虚构 paste 结果）

---

## 2. Re-test Set（006C affected · Drift）

### S8M-TITLE-002 · title_left_bar_classic

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-TITLE-002` |
| blockType | title |
| variantId | `title_left_bar_classic` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-001 |
| patternApplied | copy-safe-title-divider |
| sourceEvidenceId | — |
| validatorStatusAfter006C | FAIL |
| previousPasteStatus | FAIL |
| previousPasteEvidence | 错误的显示成了左右三等分，最左侧的方框和竖线分别显示到了第一等分和第二等分区域 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-title-left-bar.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:32px 0"><p style="margin:0 0 6px 0;color:#576b95;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">主标题</p><h1 style="margin:0;color:#333333;font-size:26px;font-weight:700;line-height:1.35;text-align:left;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;border-left:5px solid #576b95;padding-left:16px;padding:16px 18px;background-color:#f9f9f9"><span style="display:inline-block;margin:0 10px 0 0;vertical-align:top"><span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background-color:#f9f9f9;border:1px solid #eeeeee;color:#576b95;font-size:15px;font-weight:700">引</span></span>S8 Matrix · title_left_bar_classic</h1></section>
```

### S8M-TITLE-003 · title_bottom_line_editorial

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-TITLE-003` |
| blockType | title |
| variantId | `title_bottom_line_editorial` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-002 |
| patternApplied | copy-safe-title-divider |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | FAIL |
| previousPasteEvidence | 标题文字下面的线显示成了很高度很高的贯穿左右的长方形，而且错误的显示了边框 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-title-bottom-line.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:36px 0"><span style="display:inline-block;margin:0 0 8px"><span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background-color:#f9f9f9;border:1px solid #eeeeee;color:#576b95;font-size:15px;font-weight:700">✦</span></span><h1 style="margin:0;color:#333333;font-size:28px;font-weight:700;line-height:1.35;text-align:center;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;padding-bottom:6px;border-bottom:1px solid #576b95">S8 Matrix · title_bottom_line_editorial</h1></section>
```

### S8M-HEAD-004 · heading_card_centered

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-HEAD-004` |
| blockType | heading |
| variantId | `heading_card_centered` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-008 |
| patternApplied | copy-safe-title-divider |
| sourceEvidenceId | — |
| validatorStatusAfter006C | FAIL |
| previousPasteStatus | WARNING |
| previousPasteEvidence | 没有显示上下两条横线 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-heading-card-centered.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:28px 0 12px;padding:0"><p style="display:block;margin:0 0 10px;padding:0;font-size:22px;font-weight:700;line-height:1.2;color:#576b95;text-align:center;letter-spacing:0.05em;font-variant-numeric:tabular-nums">01</p><h3 style="margin:0;padding:16px 18px;text-align:center;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;background-color:transparent;color:#333333;font-size:17px;font-weight:600;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">章节 · heading_card_centered</h3></section>
```

### S8M-CARD-001 · info_card_key_takeaway

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-CARD-001` |
| blockType | info_card |
| variantId | `info_card_key_takeaway` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-004 |
| patternApplied | copy-safe-card / copy-safe-info-box |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | WARNING |
| previousPasteEvidence | 没有显示卡片边框和背景色 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-info-key-takeaway.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #576b95"><span style="display:block;margin:0 0 8px;color:#576b95;font-size:16px;font-weight:600;line-height:1.6;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">信息卡 info_card_key_takeaway</span>要点一
要点二</p></section>
```

### S8M-PARA-004 · paragraph_callout_soft

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-PARA-004` |
| blockType | paragraph |
| variantId | `paragraph_callout_soft` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-005 |
| patternApplied | copy-safe-card |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | FAIL |
| previousPasteEvidence | 没有显示卡片边框和背景色 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-paragraph-callout-probe.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #eeeeee">正文 fixture paragraph_callout_soft：验证 inline typography 与 Yellow 装饰边界。</p></section>
```

### S8M-SUM-004 · highlight_border_glow

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-SUM-004` |
| blockType | summary |
| variantId | `highlight_border_glow` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-006 |
| patternApplied | copy-safe-card |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | FAIL |
| previousPasteEvidence | 没有显示卡片边框和背景色 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-summary-border-glow-probe.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #eeeeee"><span style="display:block;margin:0 0 6px;color:#576b95;font-size:13px;line-height:1.75;font-weight:600;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">重点</span>总结/重点 fixture highlight_border_glow</p></section>
```

### S8M-CARD-004 · info_card_soft_banner

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-CARD-004` |
| blockType | info_card |
| variantId | `info_card_soft_banner` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-007 |
| patternApplied | copy-safe-card + copy-safe-left-border |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | FAIL |
| previousPasteEvidence | 没有显示卡片背景色和左侧竖线 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-info-soft-banner-probe.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:16px 0"><p style="color:#5f3b00;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;border-left:4px solid #b36b00;padding-left:12px;padding:12px 16px;background-color:#fff8e6"><span style="display:block;margin:0 0 6px;color:#666666;font-size:13px;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">提示</span><span style="display:block;margin:0 0 8px;color:#576b95;font-size:16px;font-weight:600;line-height:1.6;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">信息卡 info_card_soft_banner</span>要点一
要点二</p></section>
```

### S8M-LEAD-003 · lead_quote_intro

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-LEAD-003` |
| blockType | lead |
| variantId | `lead_quote_intro` |
| setType | **retest** |
| relatedDrift | DRIFT-S8-20260604-009 |
| patternApplied | copy-safe-left-border |
| sourceEvidenceId | — |
| validatorStatusAfter006C | FAIL |
| previousPasteStatus | WARNING |
| previousPasteEvidence | 没有显示最左侧的竖线 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-lead-quote-intro.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:20px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;border-left:3px solid #cccccc;padding-left:12px;font-style:italic">导语 fixture：lead_quote_intro。用于 Contract v1 复制校验。</p></section>
```


---

## 3. Harvest Candidate Set（首次 Paste QA）

### S8M-HARVEST-001 · heading_purple_chapter_label_candidate

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-HARVEST-001` |
| blockType | heading |
| variantId | `heading_purple_chapter_label_candidate` |
| setType | **harvest** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | WX-HARVEST-EVIDENCE-001 |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | UNTESTED |
| previousPasteEvidence | — |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-harvest-evidence-001-candidate.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:24px 0 12px"><p style="margin:0 0 6px;text-align:left"><span style="display:inline-block;background-color:#6c5ce7;color:#ffffff;font-size:12px;font-weight:700;padding:2px 8px;line-height:1.5">CHAPTER 01</span></p><h3 style="margin:0;font-size:20px;font-weight:600;line-height:1.5;color:#333333;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">章节 · heading_purple_chapter_label_candidate</h3></section>
```

### S8M-HARVEST-002 · info_card_reading_path_candidate

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-HARVEST-002` |
| blockType | info_card |
| variantId | `info_card_reading_path_candidate` |
| setType | **harvest** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | WX-HARVEST-EVIDENCE-001 |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | UNTESTED |
| previousPasteEvidence | — |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-harvest-reading-path-candidate.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.8;margin:0;padding:12px 14px;background-color:#f7f5ff;border:1px solid #d8d2ff"><strong style="color:#6c5ce7">阅读路径：</strong> 要点一 / 要点二 / 要点三</p></section>
```


---

## 4. Control Set（回归 · 006 PASS 样本）

### S8M-PARA-001 · paragraph_plain_body

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-PARA-001` |
| blockType | paragraph |
| variantId | `paragraph_plain_body` |
| setType | **control** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | PASS |
| previousPasteEvidence | MP editor 2026-06-04 · 维多 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-paragraph-plain.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0">正文 fixture paragraph_plain_body：验证 inline typography 与 Yellow 装饰边界。</p></section>
```

### S8M-LEAD-001 · lead_plain_intro

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-LEAD-001` |
| blockType | lead |
| variantId | `lead_plain_intro` |
| setType | **control** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | PASS |
| previousPasteEvidence | MP editor 2026-06-04 · 维多 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-lead-plain.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0">导语 fixture：lead_plain_intro。用于 Contract v1 复制校验。</p></section>
```

### S8M-LIST-001 · list_plain_bullets

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-LIST-001` |
| blockType | list |
| variantId | `list_plain_bullets` |
| setType | **control** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | PASS |
| previousPasteEvidence | MP editor 2026-06-04 · 维多 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-list-plain-bullets.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:16px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第一项</p><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第二项</p><p style="margin:2px 0 0 20px;color:#666666;font-size:15px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">◦ 子项 A</p><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第三项</p></section>
```

### S8M-CTA-001 · cta_plain_text

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-CTA-001` |
| blockType | cta |
| variantId | `cta_plain_text` |
| setType | **control** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | PASS |
| previousPasteEvidence | MP editor 2026-06-04 · 维多 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-cta-plain.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:18px 0"><p style="margin:0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">行动号召 cta_plain_text</p><p style="margin:8px 0 0;color:#576b95;font-size:15px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;font-weight:600">占位操作</p></section>
```

### S8M-DIV-001 · divider_simple_line

| 字段 | 值 |
|------|-----|
| matrixRowId | `S8M-DIV-001` |
| blockType | divider |
| variantId | `divider_simple_line` |
| setType | **control** |
| relatedDrift | — |
| patternApplied | — |
| sourceEvidenceId | — |
| validatorStatusAfter006C | WARNING |
| previousPasteStatus | PASS |
| previousPasteEvidence | MP editor 2026-06-04 · 维多 |
| copyHtmlSource | `tests/snapshots/wechat-paste-qa/006d/s8-divider-line.html` |

**测试说明：** 打开 snapshot 或下方 HTML，全选复制，**直接粘贴**到微信公众号后台正文编辑器；勿用 135/浏览器 Preview 代替判定。对照 Session [`wechat-paste-qa-session-2026-06-05-s8-story-006d.md`](wechat-paste-qa-session-2026-06-05-s8-story-006d.md) 回填。

**expectedCheckpoints：**

- 背景色是否保留
- 边框是否保留
- 左侧竖线是否保留
- 标题装饰线是否位置正常
- 间距是否严重异常
- 是否出现三列错位
- 是否出现高方块线
- candidate variant 是否基本可用


```html
<section style="margin:24px 0;border-top:1px solid #cccccc;height:0;font-size:0;line-height:0"></section>
```


---

## 5. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-05 | 初版 006D QA pack（15 条 = 8 retest + 2 harvest + 5 control） |
