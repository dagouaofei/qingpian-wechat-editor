# R1 Golden · 微信公众号粘贴 QA

> **Story：** S7-STORY-007B（承接 007A）· **日期：** 2026-06-02  
> **Fixture 锚点：** `tests/fixtures/articles/r1-golden-default-article.json`  
> **默认 preset：** `business`（`classic-news` 等为 **legacy alias**，见 DECISION-083 / DECISION-086）  
> **自动化：** Copy HTML `collectCopySafeHtmlViolations` = PASS

## 手测步骤

1. **`npm run dev`** 启动后打开终端显示的 Local URL（如 `http://localhost:3001/dev/style-fidelity`）。勿用未设 `STYLE_FIDELITY_DEBUG=1` 的 `npm start`（会 404）
2. 选择 `r1-golden-default-article`
3. 对照页内 **Preview** 与 block 表
4. 点击「复制当前 fixture Copy HTML（含 style 管线）」
5. 粘贴至 **微信公众号编辑器**（正文区域）
6. 逐项对照下表

## `r1-golden-default-article` 分项记录

| 检查项 | Preview 对照 | 公众号粘贴 | 结果 | 备注 |
|--------|--------------|------------|------|------|
| title 字号/字重/颜色/底线装饰 | 24px / 700 / 居中 / table 底线 | 待 PO 确认 | **Pending PO** | 007B 修 Copy `font-family` 引号截断 |
| heading 装饰线 / 间距 | `heading_short_line` | 待 PO 确认 | **Pending PO** | — |
| paragraph 16px / lh 1.75 / #333 | 是 | 待 PO 确认 | **Pending PO** | Copy 已 inline font-family |
| list 序号与缩进 | `list_plain_bullets` ordered | 待 PO 确认 | **Pending PO** | — |
| quote 左栏/引用样式 | `quote_left_bar` | 待 PO 确认 | **Pending PO** | — |
| highlight 强调 | `highlight_inline_emphasis` | 待 PO 确认 | **Pending PO** | — |
| info_card 背景/边框/padding | `info_card_key_takeaway` | 待 PO 确认 | **Pending PO** | — |
| cta 文末样式 | `cta_plain_text` | 待 PO 确认 | **Pending PO** | — |
| divider | `divider_simple_line` | 待 PO 确认 | **Pending PO** | — |
| image_placeholder | `image_placeholder_simple` | 待 PO 确认 | **Pending PO** | — |
| 整体节奏（非卡片墙） | Orchestrator RLAYOUT | 待 PO 确认 | **Pending PO** | — |

## 汇总表

| Fixture | 字体/字号 | 颜色/边框/背景 | 标题装饰 | 卡片块 | 整体节奏 | 结果 | 日期 | 测试人 |
|---------|-----------|----------------|----------|--------|----------|------|------|--------|
| r1-golden-default-article | Pending PO | Pending PO | Pending PO | Pending PO | Pending PO | **In Progress** | 2026-06-02 | Cursor（代码修复）+ PO 待测 |
| r1-golden-structured-article | — | — | — | — | — | Not Run | — | — |
| r1-golden-longform-article | — | — | — | — | — | Not Run | — | — |

## 判定规则

- **PASS：** 与 Preview 核心样式基本一致，无严重错位/丢装饰/全变纯文本
- **FAIL：** 须登记 [`docs/agile/bugs.md`](../bugs.md)
- **不得**在无真实公众号粘贴的情况下将汇总标为 **PASS**

## 007B 代码侧已修复（粘贴前 FAIL）

- [x] BUG-001：`font-family` 双引号导致 `style=""` 属性截断 → 已改为单引号栈 + 正文块补全 `font-family`
- [x] 无 `class` / `<style>` / `var(--`
- [x] 无 `linear-gradient` / flex / absolute（copy-safe 扫描）

## PO 签收后更新

PO 完成公众号粘贴后，将上表 **Pending PO** 改为 **PASS** 或 **FAIL**；仅当全部相关项 PASS 时，汇总才可标 **PASS**。
