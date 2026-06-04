## WX-HARVEST-EVIDENCE-001

| 字段 | 值 |
|------|-----|
| sourceId | WX-HARVEST-EVIDENCE-001 |
| articleUrl | https://mp.weixin.qq.com/s/OEzyTDbKMZWEquqkkFwrrw |
| harvestDate | 2026-06-04 |
| evidenceLevel | L2 ai-reading-extracted |
| inputType | url-only |

### observedStyleTypes

- card
- highlight-band
- title-divider
- cta-button
- info-box
- inline-emphasis
- divider
- unknown

### domSummary

- Article title（阅读态）：「我做了一款开源免费的Markdown公众号排版神器」；正文自述使用 R-Markdown 编辑器排版生成
- `#js_content` 内 **101 个 `section`**，嵌套约 **7 层**；样式分布在 `section` 与内层 `p`/`span`，非单一浅层 `p` 承载
- **无**带 inline style 的 `h2`/`h3`/`h4`；章节标题与大字由 **`p` + `span`** 承担（如 28px/900 标题、10px uppercase 章节标签）
- 卡片块：`section` 上 `box-shadow` + `border-radius:14px` + `border:1px solid` + `linear-gradient` 背景，内层 `padding:20px` 白底半透明
- 章节徽章：约 64×64 `inline-block` 紫色底块（`#6c5ce7`）+ `box-shadow`，父级含 **flex** 行布局
- READING PATH：单表 `table-layout:fixed` + 全宽，作目录/阅读路线模块
- CHAPTER 01–05 重复模块（标签 + 大标题 + 副标题 `p` 栈）
- `border-left` 极少（约 2 处）；`border-top` 约 5 处；**无** `blockquote`
- 约 5 张 `img`；文中 **3 处 `svg`**（装饰/图标类，未展开全文）
- 链接/话题色 `#576B95`（与微信默认链接色一致）

### cssSummary

- typography: `font-size` · `font-weight` · `line-height` · `letter-spacing` · `text-transform` · `color`
- spacing: `margin` · `padding`
- surfaces: `background` · `background-color` · `linear-gradient` · `rgba(...)` 半透明底
- borders: `border` · `border-radius` · `border-top`（少量 `border-left`）
- effects: `box-shadow`
- layout: `display`（`inline-block` · **flex**）· `align-items` · `justify-content` · `text-align`
- table: `table-layout` · `border-collapse` · `vertical-align`
- wrap: `overflow-wrap` · `word-break`

### patternMapping

- copy-safe-card — 实文大量卡片壳，但 **gradient/shadow/深嵌套 section** 与 Pattern v0.1 推荐 DOM 不一致
- copy-safe-highlight-band — 渐变底与浅色 band 段落
- copy-safe-title-divider — 章节小标签 + 大标题 `p` 组合（非 `h*` + `border-bottom`）
- copy-safe-cta-button — 方形色块徽章（非典型文字 CTA）
- copy-safe-info-box — READING PATH 表格式信息块
- copy-safe-inline-emphasis — `strong` / 彩色 `span`
- copy-safe-divider — `border-top` 分隔
- copy-safe-left-border — **未作为主要版式**（仅零星出现）

### riskFlags

- deep-wrapper
- background-on-wrapper
- flex-like-layout
- svg-decoration
- unknown-css

### wechatSafeAssessment

needs-validation

### relatedDrift

- DRIFT-S8-20260604-004
- DRIFT-S8-20260604-005
- DRIFT-S8-20260604-006
- DRIFT-S8-20260604-007

### recommendedUseIn006C

supporting-evidence

### notes

- 输入为 **ARTICLE-EVIDENCE-INPUT**（`providedHtml: no`）；证据由服务端抓取移动 UA HTML 的 `#js_content` 归纳，**非**用户 DevTools 片段，故定为 **L2** 而非 L3。
- 未做公众号/轻篇 **粘贴对照**（非 L4）。
- 文章为排版工具推广文，版式代表 **第三方 Markdown→公众号** 工具链，可作为「竞品/工具生成文」样式样本，**不能**替代 PO Paste QA 主证据。
- 与 HARVEST 假设对齐：强化 **copy-safe-card** / **highlight-band** 在真实文中的 **Yellow 风险**（gradient、shadow、深 `section`）；**left-border** 假设在本篇 **弱验证**。
- repo **未**保存全文 HTML。

### S8-STORY-006C candidate 映射

| matrixRowId | variantId | copySafePattern |
|-------------|-----------|-----------------|
| S8M-HARVEST-001 | `heading_purple_chapter_label_candidate` | `copy-safe-title-divider`（章节标签 + 标题，视觉意图改写） |
| S8M-HARVEST-002 | `info_card_reading_path_candidate` | `copy-safe-info-box`（阅读路径单 `p` 信息块） |

- `pasteStatus`: **UNTESTED**（006D 实机复测）
