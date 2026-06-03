# R1 Golden · 微信公众号粘贴 QA

> **Story：** S7-STORY-007A · **日期：** 2026-06-02  
> **Fixture 锚点：** `tests/fixtures/articles/r1-golden-default-article.json`  
> **自动化：** Copy HTML `collectCopySafeHtmlViolations` = PASS（无 class / style / var / gradient）

## 手测步骤

1. 开发环境打开 `/dev/style-fidelity`，选择 `r1-golden-default-article`
2. 点击「复制当前 fixture Copy HTML」
3. 粘贴至 **微信公众号编辑器**（正文区域）
4. 对照网页 `/gallery` 或本地 Preview 渲染（同 fixture 逻辑）

## 记录表

| Fixture | 字体/字号 | 颜色/边框/背景 | 标题装饰 | 卡片块 | 整体节奏 | 结果 | 日期 | 测试人 |
|---------|-----------|----------------|----------|--------|----------|------|------|--------|
| r1-golden-default-article | 待测 | 待测 | 待测 | 待测 | 待测 | **Not Run** | — | — |
| r1-golden-structured-article | — | — | — | — | — | Not Run | — | — |
| r1-golden-longform-article | — | — | — | — | — | Not Run | — | — |

## 判定规则

- **PASS：** 与 Preview 核心样式基本一致，无严重错位/丢装饰/全变纯文本
- **FAIL：** 须登记 [`docs/agile/bugs.md`](../bugs.md)，**不得**将 S7-STORY-007A 标为 Done（粘贴 QA）

## 自动化已通过项（2026-06-02）

- [x] 无 `class` / `<style>` / `var(--`
- [x] 无 `linear-gradient`（title copy 已改实色）
- [x] 无 `position:absolute` / `display:flex|grid`（copy-safe 扫描）
