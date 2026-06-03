# Heading Publish · Copy 一致性契约

> **Story：** S7-STORY-008 · 实现：`src/core/renderer/heading-publish-decoration.ts`

## 问题

逐款肉眼粘贴 QA 只能发现单点回归，无法沉淀「胶囊不要灰底」「编号款≠极简款」等**共性问题**。

## 做法

1. **同源 token**：`heading-publish-decoration.ts` 导出全部 `copySafe*` 样式；Preview 经 `heading-publish-visual.ts` 引用同一文件。
2. **同源 HTML**：`heading-publish-copy-html.ts` 为 8 款 Copy 唯一实现；`title-block-copy.ts` 在 `isHeadingPublishVariantId` 时委托，不再分叉手写。
3. **机器契约**：`HEADING_PUBLISH_COPY_CONTRACT` 定义每款 `mustMatch` / `mustNotMatch`；`heading-publish-parity.test.ts` 在粘贴 QA 前拦截结构退化。

## 共性规则（全池）

| 规则 | 说明 |
|------|------|
| `HEADING_PUBLISH_NO_FILL_ON_LABEL` | 卡片居中/编号牌、图标前缀、荧光笔**标题字**默认无灰底填充 |
| `themePalette` on Preview | `title-block-preview` 输出与 Copy 相同的 `resolveThemePaletteTokens`，禁止 `resolveTitleHeadingPaletteFromTypography` 近似色 |
| 杂志竖线不用 `<table>` | 微信会把 td 背景撑成横条；改用嵌套 `section` + `border-left` 双轨 |
| 短线随字宽 | `inline-block` wrap + `width:100%` 底线，禁止固定 `200px` |
| numbered ≠ minimal | numbered 须 6px 方牌（accent 底 + 白字）；minimal 须纯文本序号 |
| `HEADING_PUBLISH_COMMON_COPY_FORBIDDEN` | 全池禁止满宽 table 等粘贴退化模式 |
| 荧光笔 | 窄 `table`（`width:auto`）字行 + 12px 色条行；禁止仅 `border-bottom` 单 span（微信难叠压） |
| `heading_icon_prefix` | 禁止 `<table>`；固定 `▸` + inline 兄弟节点 |
| 仅 inline style | 与 [wechat-copy-style-rules.md](wechat-copy-style-rules.md) 一致 |

## 与粘贴 QA 关系

- **Contract PASS** ≠ 微信公众号粘贴 PASS
- Contract FAIL → 不必手测，直接修代码
- 手测 FAIL 但 Contract PASS → 补充 `mustMatch`/`mustNotMatch` 或 token，再跑测试

## 手测记录

[`docs/agile/paste-qa/heading-publish-8.md`](../agile/paste-qa/heading-publish-8.md)
