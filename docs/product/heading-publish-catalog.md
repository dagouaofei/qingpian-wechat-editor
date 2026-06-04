# Heading Publish Catalog · 8 款可发公众号小标题

> **Story：** S7-STORY-008 · **Decision：** DECISION-087  
> **代码：** [`heading-publish-pool.ts`](../../src/core/styles/variants/heading-publish-pool.ts) · Preview [`heading-publish-visual.ts`](../../src/core/renderer/heading-publish-visual.ts) · Copy [`title-heading-copy-styles.ts`](../../src/core/copy/title-heading-copy-styles.ts)

**原则：** 审美优先于 variant 数量；仅保留本 catalog 8 款；同篇 heading **统一 variant**；Preview 装饰与 Copy **同源 token**（无 gradient / shadow / class）。

---

## 1. 发布池一览

| ID | 中文名 | 适用场景 | 禁止场景 | Preview/Copy 必现元素 |
|----|--------|----------|----------|------------------------|
| `heading_short_line` | 短线标题 | 知识/行业/默认小节 | 连续多节无正文间隔 | 17px 字重 600 + 2px accent 底线（≤280px） |
| `heading_highlight_marker` | 荧光笔强调 | 活动/叙事段首强调 | 全篇每节都用 | `h3` inline + accent ≈12%/20% 纵向渐变（56%–92% 淡出） |
| `heading_magazine_left_bar` | 杂志竖线 | 品牌/深度观察 | 清单体密集编号文 | 3px 左色条 + 12px 左内边距，无 card 外框 |
| `heading_magazine_offset` | 杂志错位 | 季节/复盘/里程碑 | 短帖单节 | 浅底块 + 4px 左线 + 适度 padding |
| `heading_numbered_section` | 编号小节 | 清单/步骤/促销条目 | 无 `sourceIndex` 时仍显示默认序号 | accent 方牌编号 + 标题左对齐紧贴 |
| `heading_card_centered` | 卡片居中 | 产品/栏目/专题 | 与 title 同屏抢视觉 | 透明外框卡片 + 居中大号序号 + 居中标题 |
| `heading_icon_prefix` | 图标前缀 | 技巧/清单导读 | 图标语义与正文无关时 | 32px 图标 capsule + 3px 左条 |
| `heading_minimal_number` | 极简数字 | 轻量列表/季节文 | 需要强装饰的 keynote 段 | 右对齐小号序号 + 标题 |

**默认 flagship（`business` preset）：** `heading_short_line`。

**已废弃（不得再注册/生成）：** `heading_plain_minimal`、`heading_underline_classic`、`heading_pill_topic`、`heading_editorial_plain`、`heading_keynote_strong`。

---

## 2. 审美合格 DoD（PO 勾选）

在 `/gallery` 打开 8 套样例（或 `/preview` 切换「小标题样式」），对照 Copy 区：

| ID | 一眼可区分 | 像公众号小节标题（非粗体段落） | PO 日期 | 结果 |
|----|------------|--------------------------------|--------|------|
| `heading_short_line` | ☐ | ☐ | | Pending |
| `heading_highlight_marker` | ☐ | ☐ | | Pending |
| `heading_magazine_left_bar` | ☐ | ☐ | | Pending |
| `heading_magazine_offset` | ☐ | ☐ | | Pending |
| `heading_numbered_section` | ☐ | ☐ | | Pending |
| `heading_card_centered` | ☐ | ☐ | | Pending |
| `heading_icon_prefix` | ☐ | ☐ | | Pending |
| `heading_minimal_number` | ☐ | ☐ | | Pending |

**Story 状态（2026-06-03）：** S7-STORY-008 **Done** — 第六轮微信公众号粘贴 **8/8 PASS**；8 款为 Release 1 **heading 发布池**（`release1_required`）；`business` 默认 `heading_short_line`，`warm` 默认 `heading_highlight_marker`。

---

## 3. 技术约束（Copy Fidelity）

- 仅 inline style；`font-size` / `font-family` / `color` / `line-height` 写在文本节点
- 除 `heading_highlight_marker` 外禁止 `linear-gradient`；禁止 `var(--`、`class`、`<style>`
- 装饰用 table + border 或真实 DOM 元素（见 `title-block-copy.ts`）
- 自动化：[`heading-publish-parity.test.ts`](../../tests/core/styles/heading-publish-parity.test.ts)（含 [`HEADING_PUBLISH_COPY_CONTRACT`](../architecture/heading-publish-copy-contract.md)）

---

## 4. 手测入口

- **Gallery：** `/gallery` → 样例下拉 + Title/Heading 或 block variant 切换
- **Preview：** `/preview` → 侧栏「小标题样式」
- **粘贴：** [`heading-publish-8.md`](../agile/paste-qa/heading-publish-8.md)
