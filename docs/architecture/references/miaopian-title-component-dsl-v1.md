# 秒篇成稿 · 标题控件 DSL 与布局骨架规范 v1（历史参考）

> **原始文档：** [秒篇成稿-标题控件DSL与布局骨架规范-v1.docx](./秒篇成稿-标题控件DSL与布局骨架规范-v1.docx)  
> **状态：** 历史参考 · **非**轻篇最终架构  
> **用途：** S1-STORY-024 吸收 family / variant / slot / asset / orchestrator 思想的对照材料  
> **禁止：** 照搬旧代码、Visual Layer、Space Style、旧 DSL 实现

---

## 1. 规范目标

秒篇 Component DSL 旨在支撑类似 135 编辑器的**丰富标题控件**：在受控规则内组合 family、variant、slot、icon asset，实现标题视觉变化，同时避免 AI 直接输出 HTML/CSS。

## 2. titleBlock 五 family

| familyId | 说明 | 典型场景 |
|----------|------|----------|
| `simple` | 纯文字 + 线条装饰 | 章节标题、下划线标题 |
| `iconDecor` | 图标 + 标题组合 | 带语义图标的 section 标题 |
| `badgeTitle` | 徽章 + 标题 | 强调型小节标题 |
| `cardTitle` | 卡片背景 + 标题 | 区块感强的标题 |
| `magazine` | 杂志风左栏/偏移布局 | 长文视觉节奏变化 |

## 3. titleBlock 15 variant 布局骨架（V01–V15）

| ID | variantId | family | layoutMode | 核心 slots |
|----|-----------|--------|------------|------------|
| V01 | `icon_top_title_bottom` | iconDecor | vertical-stack | icon, title |
| V02 | `icon_left_top_title_center` | iconDecor | icon-left | icon, title |
| V03 | `title_left_icon_right` | iconDecor | icon-right | title, icon |
| V04 | `double_icon_symmetric` | iconDecor | symmetric | icon, title, icon |
| V05 | `badge_top_title_bottom` | badgeTitle | vertical-stack | badge, title |
| V06 | `badge_left_title_inline` | badgeTitle | inline-badge | badge, title |
| V07 | `line_top_title_center` | simple | line-top | decorationLine, title |
| V08 | `title_with_bottom_line` | simple | line-bottom | title, decorationLine |
| V09 | `card_bg_icon_corner` | cardTitle | card-corner | bgShape, icon, title |
| V10 | `card_center_title_badge_top` | cardTitle | card-center | badge, title, bgShape |
| V11 | `magazine_left_bar_title` | magazine | left-bar | decorationLine, title |
| V12 | `magazine_offset_icon_bg` | magazine | offset-bg | bgShape, icon, title |
| V13 | `icon_inline_prefix_title` | iconDecor | inline-prefix | icon, title |
| V14 | `title_top_subtitle_bottom_line` | simple | title-subtitle-line | title, subtitle, decorationLine |
| V15 | `badge_icon_title_stack` | badgeTitle | stack | badge, icon, title |

## 4. titleBlock 七类 slot

| slotName | slotType | 必选 | 职责 |
|----------|----------|------|------|
| `icon` | icon | 否 | 语义图标，绑定 VisualAsset |
| `badge` | text/shape | 否 | 标签/序号/强调标记 |
| `title` | text | **是** | 主标题文本 |
| `subtitle` | text | 否 | 副标题/说明 |
| `decorationLine` | line | 否 | 上下装饰线 |
| `bgShape` | bgShape | 否 | 背景块/卡片底 |
| `extraMark` | mark | 否 | 额外角标/点缀 |

**约束（秒篇经验）：** 同一 titleBlock 建议启用 2~4 个 slot；超过 5 个风险高；icon 与 bgShape 不宜同为视觉主角。

## 5. 文章级编排规则（秒篇）

- 相邻 heading 不用同一 variant
- 同一 assetId 默认最多 2 次
- 强装饰 family 连续不超过 2 次
- badge 强调型不应每 section 都出现
- title 与首个 heading 避免同 family + 同 variant

## 6. AI 样式选择（秒篇原则）

- AI 不得输出 HTML / CSS
- AI 只能引用已注册 family / variant / slot / assetId
- 校验失败 fallback 到 simple copy-safe variant

## 7. 轻篇吸收边界

| 吸收 | 不吸收 |
|------|--------|
| family / variant catalog 思想 | 旧 DSL 代码 |
| slot 协议 | Visual Layer |
| VisualAssetRegistry | Space Style |
| StyleOrchestrator 去重规则 | 平行 visualArticle 结构 |
| AI Style Selection Guardrails | 未注册 variant 硬编码 |

轻篇落地见 [style-system.md](../style-system.md) §11 Component DSL 能力对齐。
