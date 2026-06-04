# Execution Report：Heading Publish 8 款粘贴 QA 修复

## 1. 基本信息

- 日期：2026-06-03
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 来源分支：`sprint/7`（沿用当前 sprint 工作流；本轮未新建分支）
- 目标合并分支：`sprint/7`
- Sprint：Sprint 7
- 关联 Story / Bug / Decision：S7-STORY-008、DECISION-087、`docs/agile/paste-qa/heading-publish-8.md`
- 执行者：Cursor
- 状态：In Review（待 PO 重新粘贴验收）

## 2. 本轮目标

根据 PO 在 `heading-publish-8.md` 记录的 8 款 **装饰保留** 全部 FAIL 描述，修复 Preview/Copy 与微信公众号粘贴不一致的问题（编号自增、短线宽度、荧光笔、杂志双竖线、错位卡片、去大圆章/边框表等）。

## 3. 执行范围

- **做了：** Copy HTML 结构重写（WeChat-safe `<section>` + 窄装饰）、Preview 与 Copy 对齐、`heading-ordinal` 接入 presentation/copy/preview、自动化测试更新
- **没做：** 未在真实公众号编辑器内代 PO 粘贴；未改 Sprint/Story 为 Done

## 4. 修改文件

- `src/core/copy/title-block-copy.ts`
- `src/core/copy/title-heading-copy-styles.ts`
- `src/core/renderer/title-heading-assets.ts`
- `src/core/renderer/title-heading-visual.ts`
- `src/core/renderer/title-block-preview.ts`
- `src/core/renderer/heading-publish-visual.ts`
- `src/components/preview/title-heading-preview-block.tsx`
- `docs/agile/paste-qa/heading-publish-8.md`
- `tests/core/styles/heading-publish-parity.test.ts`
- `tests/core/renderer/title-heading-assets.test.ts`

## 5. 新增文件

- `src/core/renderer/heading-ordinal.ts`（若上轮已建则本轮为接线完善）
- `tests/core/renderer/heading-ordinal.test.ts`

## 6. 阅读但未修改的关键文件

- `docs/product/heading-publish-catalog.md`
- `docs/agile/sprint-backlog.md`
- `src/core/copy/index.ts`（clipboard 上下文已含 `article`）

## 7. 关键变更说明

| 问题 | 修复要点 |
|------|----------|
| 编号全为 01 | `resolveHeadingIndexLabel(article, blockId)` 按文中 heading 顺序 01/02/… |
| `heading_short_line` 满宽条 | Copy/Preview 使用固定 `width:200px` 的 `border-bottom` 短线 |
| `heading_highlight_marker` | 仅标题文字 `<span>` 荧光底+底线，非整段背景 |
| `heading_magazine_left_bar` | 双竖线（浅+深）+ 三行：编号 / SECTION / 标题 |
| `heading_magazine_offset` | 样式写在 `<section>` 上，避免内层 `div` 被剥离 |
| `heading_numbered_section` / `icon_prefix` | 去掉大圆章、全宽表、左边框包裹；改为行内 ordinal / 28px 图标 |
| `heading_top_badge_topic` Preview 卡片底 | 取消 `heading_top_badge_topic` 的 card frame |
| `heading_minimal_number` 无数字 | 始终输出 ordinal（默认 01） |

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-5 PO 视觉 | N/A | 待 PO 在 Gallery/Preview 复测 |
| AC-6 粘贴 QA | N/A | 待 PO 按 `heading-publish-8.md` 重填表 |
| 自动化 copy-safe | PASS | `npm run test` 814 passed |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run test | PASS | 814 tests |
| npm run build | PASS | Next.js build OK |

## 10. 未完成事项

- PO 需在公众号编辑器对 8 款重新粘贴并更新 `heading-publish-8.md` 结果列

## 11. 风险与阻塞

- 微信公众号对 `box-decoration-break`、双竖线 table 仍可能有平台差异；若单款仍 FAIL 需按款登记 Bug

## 12. 需要用户 / ChatGPT 审查的问题

- 是否将本轮拆到建议分支 `feature/s7-story-008-heading-publish-paste-fix` 再合并 sprint
- `heading_highlight_marker` 无真渐变（WeChat 约束）；PO 是否接受「底色+底线」近似荧光笔

## 13. 建议下一步

1. `npm run dev` → `/gallery` 逐款对照 Preview
2. 复制粘贴公众号，更新 `heading-publish-8.md`
3. FAIL 项写入 `bugs.md`；通过后 Story 标 In Review → 用户确认 Done

## 14. Commit

- Commit hash：未提交 / not committed
