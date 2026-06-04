# Execution Report：iconDecor / cardTitle slot 加强 + R8 测试修复

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s7-rich-styles-title-heading`
- 来源分支：`sprint/s7-wechat-article-experience`
- 目标合并分支：`sprint/s7-wechat-article-experience`
- Sprint：Sprint 7
- 关联 Story / Bug / Decision：S7-STORY-003 · DECISION-082
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

在 **不新增 first-wave variant registry 条目**（仍 6 个 title/heading）前提下，通过 presentation slot + 内置 icon 资产映射加强 **iconDecor / cardTitle** 观感；修复因 `family` 拆分导致的 **R8 单测/流水线 5 项失败**。

## 3. 执行范围

**已完成：**

- `title-heading.ts`：`icon` / `corner` presentation slot；`title_plain_minimal` → cardTitle；`title_left_bar` / `title_bottom_line` / `heading_plain` → iconDecor 视觉（heading_plain 节奏族为 `cardTitle`+`plain` 以触发 R8）
- `title-heading-assets.ts`：6 variant → VisualAsset 风格 glyph / 卡框 / 角标开关
- Preview：`TitleHeadingPreviewBlock`（IconCapsule、CornerAccents、CardTitleFrame、EditorialOrnamentLine）
- Copy：`title-block-copy.ts` 同步胶囊与卡框 table 布局
- R8：`excludeVariantIds` 含当前 heading；`heading_plain_minimal.family` = `cardTitle`（与 `title_plain` 同节奏组，默认 preset 仍走 R8 → `heading_numbered_section`）
- 单测：784 PASS · build PASS

**未做：**

- 新增第 7+ variant
- commit / merge（待用户）
- Paste QA / 人工 `/gallery` 全矩阵签收

## 4. 修改文件

- `src/core/styles/variants/title-heading.ts`
- `src/core/styles/style-orchestrator-rules.ts`
- `src/core/renderer/text-style.ts`
- `src/core/renderer/title-block-preview.ts`
- `src/core/renderer/title-heading-visual.ts`
- `src/core/renderer/types.ts`
- `src/core/copy/title-block-copy.ts`
- `src/components/preview/title-heading-preview-block.tsx`
- `tests/core/styles/style-orchestrator-rules.test.ts`
- `docs/agile/sprint-backlog.md`
- （同分支既有）preview controls / palette / gallery tests 等

## 5. 新增文件

- `src/core/renderer/title-heading-assets.ts`
- `tests/core/renderer/title-heading-assets.test.ts`

## 6. 阅读但未修改的关键文件

- `docs/architecture/style-system.md`
- `src/app/gallery/gallery-page-client.tsx`

## 7. 关键变更说明

- **视觉与节奏分离**：`variant.family` 服务 R8（title_plain + heading_plain 同为 `cardTitle`/`plain`）；icon 胶囊、左栏、卡框等由 `variantId` + slot + `title-heading-assets` 驱动，不增加 registry 条目。
- **R8 回归**：此前 `title_plain`（cardTitle）与 `heading_plain`（iconDecor）不同族，R8 永不触发，导致 5 个 orchestrator/validation 测试失败；恢复 heading_plain 节奏族并排除当前 heading variant，fallback 稳定为 `heading_numbered_section`。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 不扩 registry | PASS | 仍 6 variant id |
| iconDecor/cardTitle 加强 | In Review | 需 PO `/gallery` 目视 |
| 测试绿 | PASS | 784 tests + build |
| Preview/Copy 同源 | PASS | 共用 presentation + copy 表布局 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run test | PASS | 784/784 |
| npm run build | PASS | |

## 10. 未完成事项

- 用户 commit / 合并 sprint
- `/gallery` 6×6 人工样式签收
- e2e / Paste QA（Sprint 8）

## 11. 风险与阻塞

- 默认 preset（title_plain + heading_plain）经 R8 后首个 heading 变为 **numbered**，与 AC-4「样例不全为 plain+plain」一致，但 PO 需确认默认成稿节奏是否符合预期。

## 12. 需要用户 / ChatGPT 审查的问题

- `heading_plain_minimal` 的 `family: cardTitle` 仅为 R8 节奏分组，小节视觉仍为 iconDecor 胶囊行——是否需在 docs/decisions 中明示？
- 若希望 **默认保留 heading_plain** 而不被 R8 替换，需调整 preset 默认组合或 R8 触发条件（范围变更）。

## 13. 建议下一步

1. 本地打开 `/gallery` → Title/Heading 聚焦 → 6 variant × 多配色目视
2. 满意后 commit `feature/s7-rich-styles-title-heading` 并合并 `sprint/s7-wechat-article-experience`
3. ChatGPT 审查本 report + `2026-06-02-s7-rich-styles-title-heading.md` 后决定是否关闭 S7-STORY-003

## 14. Commit

- Commit hash：未提交 / not committed
