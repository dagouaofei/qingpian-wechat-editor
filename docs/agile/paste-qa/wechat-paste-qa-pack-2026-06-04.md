# WeChat Paste QA Pack（2026-06-04 · S8-STORY-006）

> **用途：** PO 实机粘贴样本包 · **Contract：** `wechat-safe-contract-v1`  
> **生成：** `tests/support/wechat-paste-qa-pack-builder.ts`（复用 Fidelity Matrix builder）  
> **流程：** [`wechat-paste-qa-workflow.md`](wechat-paste-qa-workflow.md) · **Session：** [`wechat-paste-qa-session-2026-06-04-s8-story-006.md`](wechat-paste-qa-session-2026-06-04-s8-story-006.md)

---

## 1. 集合概览

| 集合 | 条数 | 目的 |
|------|------|------|
| **Smoke** | 10 | 10 类控件各 1 条 existing 代表 |
| **Risk** | 5 | validator FAIL 行 · 实机是否也失真 |
| **Probe** | 4 | Yellow 边界 · 不入默认 preset |

可选追加：**`S8M-HEAD-003`**（`heading_highlight_marker` waiver 复测）

---

## 2. Smoke Set

### S8M-TITLE-001 · title_plain_minimal

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-title-plain-minimal` |
| blockType | title |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:32px 0"><p style="margin:0 0 12px 0;text-align:center"><span style="display:inline-block;width:32…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:32px 0"><p style="margin:0 0 12px 0;text-align:center"><span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background-color:#f9f9f9;border:1px solid #eeeeee;color:#576b95;font-size:15px;font-weight:700">✦</span></p><h1 style="margin:0;color:#333333;font-size:26px;font-weight:700;line-height:1.35;text-align:center;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;padding:14px 16px;background-color:#f9f9f9;border:1px solid #eeeeee">S8 Matrix · title_plain_minimal</h1></section>
```

### S8M-HEAD-001 · heading_short_line

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-heading-short-line` |
| blockType | heading |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_MAX_NESTING_DEPTH_EXCEEDED, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_MAX_NESTING_DEPTH_EXCEEDED |

**Copy HTML 摘要：** <section style="margin:28px 0 12px;padding:0;text-align:left"><p style="margin:0"><span style="display:inline-block;marg…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:28px 0 12px;padding:0;text-align:left"><p style="margin:0"><span style="display:inline-block;margin:0;padding:0;max-width:100%"><span style="display:block;margin:0;color:#333333;font-size:17px;font-weight:600;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">章节 · heading_short_line</span><span style="display:block;width:100%;margin:8px 0 0;padding:0;border:none;border-bottom:2px solid #576b95;line-height:0;font-size:0">&nbsp;</span></span></p></section>
```

### S8M-PARA-001 · paragraph_plain_body

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-paragraph-plain` |
| blockType | paragraph |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'Ping…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0">正文 fixture paragraph_plain_body：验证 inline typography 与 Yellow 装饰边界。</p></section>
```

### S8M-LEAD-001 · lead_plain_intro

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-lead-plain` |
| blockType | lead |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:18px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'Ping…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0">导语 fixture：lead_plain_intro。用于 Contract v1 复制校验。</p></section>
```

### S8M-LIST-001 · list_plain_bullets

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-list-plain-bullets` |
| blockType | list |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:16px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:16px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第一项</p><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第二项</p><p style="margin:2px 0 0 20px;color:#666666;font-size:15px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">◦ 子项 A</p><p style="margin:0 0 8px 0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">• 第三项</p></section>
```

### S8M-QUOTE-001 · quote_plain

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-quote-plain` |
| blockType | quote |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:18px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hirag…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0"><span style="display:block;margin:0">引用 fixture quote_plain</span><span style="display:block;margin:8px 0 0;color:#666666;font-size:14px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;text-align:right">— S8 Fidelity Matrix</span></p></section>
```

### S8M-SUM-001 · highlight_inline_emphasis

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-summary-inline` |
| blockType | summary |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hirag…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;border-left:2px solid #576b95;padding-left:8px"><span style="display:block;margin:0 0 6px;color:#576b95;font-size:13px;line-height:1.75;font-weight:600;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">重点</span>总结/重点 fixture highlight_inline_emphasis</p></section>
```

### S8M-CARD-001 · info_card_key_takeaway

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-info-key-takeaway` |
| blockType | info_card |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hirag…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #576b95"><span style="display:block;margin:0 0 8px;color:#576b95;font-size:16px;font-weight:600;line-height:1.6;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">信息卡 info_card_key_takeaway</span>要点一
要点二</p></section>
```

### S8M-CTA-001 · cta_plain_text

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-cta-plain` |
| blockType | cta |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:18px 0"><p style="margin:0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:18px 0"><p style="margin:0;color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">行动号召 cta_plain_text</p><p style="margin:8px 0 0;color:#576b95;font-size:15px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;font-weight:600">占位操作</p></section>
```

### S8M-DIV-001 · divider_simple_line

| 字段 | 值 |
|------|-----|
| set | smoke |
| fixtureId | `s8-divider-line` |
| blockType | divider |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:24px 0;border-top:1px solid #cccccc;height:0;font-size:0;line-height:0"></section>

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:24px 0;border-top:1px solid #cccccc;height:0;font-size:0;line-height:0"></section>
```


---

## 3. Risk Set（validator FAIL · 不在 STORY-005/006 修 renderer）

### S8M-TITLE-002 · title_left_bar_classic

| 字段 | 值 |
|------|-----|
| set | risk |
| fixtureId | `s8-title-left-bar` |
| blockType | title |
| variantType | candidate |
| validatorStatus | FAIL |
| validatorErrors | WECHAT_COPY_RED_CSS |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, … |

**Copy HTML 摘要：** <section style="margin:32px 0"><p style="margin:0 0 6px 0;color:#576b95;font-size:11px;font-weight:600;letter-spacing:0.…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:32px 0"><p style="margin:0 0 6px 0;color:#576b95;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">主标题</p><h1 style="margin:0;color:#333333;font-size:26px;font-weight:700;line-height:1.35;text-align:left;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;border-left:5px solid #576b95;padding-left:16px;padding:16px 18px;background-color:#f9f9f9"><span style="display:inline-block;margin:0 10px 0 0;vertical-align:top"><span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background-color:#f9f9f9;border:1px solid #eeeeee;color:#576b95;font-size:15px;font-weight:700">引</span></span>S8 Matrix · title_left_bar_classic</h1></section>
```

### S8M-TITLE-003 · title_bottom_line_editorial

| 字段 | 值 |
|------|-----|
| set | risk |
| fixtureId | `s8-title-bottom-line` |
| blockType | title |
| variantType | existing |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:36px 0"><span style="display:inline-block;margin:0 0 8px"><span style="display:inline-block;width…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:36px 0"><span style="display:inline-block;margin:0 0 8px"><span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background-color:#f9f9f9;border:1px solid #eeeeee;color:#576b95;font-size:15px;font-weight:700">✦</span></span><h1 style="margin:0;color:#333333;font-size:28px;font-weight:700;line-height:1.35;text-align:center;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;padding-bottom:6px;border-bottom:1px solid #576b95">S8 Matrix · title_bottom_line_editorial</h1></section>
```

### S8M-HEAD-002 · heading_numbered_section

| 字段 | 值 |
|------|-----|
| set | risk |
| fixtureId | `s8-heading-numbered` |
| blockType | heading |
| variantType | existing |
| validatorStatus | FAIL |
| validatorErrors | WECHAT_COPY_RED_CSS |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:28px 0 12px;padding:0"><p style="margin:0;line-height:1.5"><span style="display:inline-block;min-…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:28px 0 12px;padding:0"><p style="margin:0;line-height:1.5"><span style="display:inline-block;min-width:32px;margin:0 10px 0 0;padding:3px 10px;text-align:center;border-radius:6px;background-color:#576b95;color:#ffffff;font-size:13px;font-weight:700;line-height:1.35;vertical-align:middle;font-variant-numeric:tabular-nums;letter-spacing:0.04em">01</span><span style="color:#333333;font-size:17px;font-weight:600;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">章节 · heading_numbered_section</span></p></section>
```

### S8M-HEAD-004 · heading_card_centered

| 字段 | 值 |
|------|-----|
| set | risk |
| fixtureId | `s8-heading-card-centered` |
| blockType | heading |
| variantType | existing |
| validatorStatus | FAIL |
| validatorErrors | WECHAT_COPY_RED_CSS |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:28px 0 12px;padding:0"><p style="display:block;margin:0 0 10px;padding:0;font-size:22px;font-weig…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:28px 0 12px;padding:0"><p style="display:block;margin:0 0 10px;padding:0;font-size:22px;font-weight:700;line-height:1.2;color:#576b95;text-align:center;letter-spacing:0.05em;font-variant-numeric:tabular-nums">01</p><h3 style="margin:0;padding:16px 18px;text-align:center;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;background-color:transparent;color:#333333;font-size:17px;font-weight:600;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">章节 · heading_card_centered</h3></section>
```

### S8M-LEAD-003 · lead_quote_intro

| 字段 | 值 |
|------|-----|
| set | risk |
| fixtureId | `s8-lead-quote-intro` |
| blockType | lead |
| variantType | existing |
| validatorStatus | FAIL |
| validatorErrors | WECHAT_COPY_RED_CSS |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:20px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'Ping…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:20px 0"><p style="color:#333333;font-size:17px;font-weight:400;line-height:1.65;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;border-left:3px solid #cccccc;padding-left:12px;font-style:italic">导语 fixture：lead_quote_intro。用于 Contract v1 复制校验。</p></section>
```


---

## 4. Probe Set

### S8M-PARA-004 · paragraph_callout_soft

| 字段 | 值 |
|------|-----|
| set | probe |
| fixtureId | `s8-paragraph-callout-probe` |
| blockType | paragraph |
| variantType | probe |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'Ping…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:18px 0"><p style="color:#333333;font-size:16px;font-weight:400;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #eeeeee">正文 fixture paragraph_callout_soft：验证 inline typography 与 Yellow 装饰边界。</p></section>
```

### S8M-SUM-004 · highlight_border_glow

| 字段 | 值 |
|------|-----|
| set | probe |
| fixtureId | `s8-summary-border-glow-probe` |
| blockType | summary |
| variantType | probe |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hirag…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:16px 0"><p style="color:#333333;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;padding:12px 16px;background-color:#f9f9f9;border:1px solid #eeeeee"><span style="display:block;margin:0 0 6px;color:#576b95;font-size:13px;line-height:1.75;font-weight:600;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">重点</span>总结/重点 fixture highlight_border_glow</p></section>
```

### S8M-CARD-004 · info_card_soft_banner

| 字段 | 值 |
|------|-----|
| set | probe |
| fixtureId | `s8-info-soft-banner-probe` |
| blockType | info_card |
| variantType | probe |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG |

**Copy HTML 摘要：** <section style="margin:16px 0"><p style="color:#5f3b00;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hirag…

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:16px 0"><p style="color:#5f3b00;font-size:16px;line-height:1.75;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;margin:0;border-left:4px solid #b36b00;padding-left:12px;padding:12px 16px;background-color:#fff8e6"><span style="display:block;margin:0 0 6px;color:#666666;font-size:13px;line-height:1.5;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">提示</span><span style="display:block;margin:0 0 8px;color:#576b95;font-size:16px;font-weight:600;line-height:1.6;font-family:'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif">信息卡 info_card_soft_banner</span>要点一
要点二</p></section>
```

### S8M-DIV-004 · divider_short_accent

| 字段 | 值 |
|------|-----|
| set | probe |
| fixtureId | `s8-divider-short-accent-probe` |
| blockType | divider |
| variantType | probe |
| validatorStatus | WARNING |
| validatorErrors | — |
| validatorWarnings | WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_TAG, WECHAT_COPY_YELLOW_CSS_WITHOUT_WAIVER |

**Copy HTML 摘要：** <section style="margin:24px 0;border-top:1px solid #cccccc;height:0;font-size:0;line-height:0"></section>

**测试说明：** 复制上述 HTML（或打开 snapshot 文件全选复制），粘贴到**微信公众号后台**正文编辑器；勿用 135/浏览器 Preview 代替判定。


```html
<section style="margin:24px 0;border-top:1px solid #cccccc;height:0;font-size:0;line-height:0"></section>
```


---

## 5. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版 QA pack（19 条 = 10 smoke + 5 risk + 4 probe） |
