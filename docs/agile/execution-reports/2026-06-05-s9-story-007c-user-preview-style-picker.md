# Execution Report：S9-STORY-007C User Preview Style Picker

## 1. 基本信息

- 日期：2026-06-05
- 当前分支：`feature/s9-story-007c-expose-user-selectable-preview-picker`
- 来源分支：`sprint/s9-style-management-system-v0` @ `634709d`
- 目标合并分支：`sprint/s9-style-management-system-v0`
- Sprint：Sprint 9 — Style Management System v0
- 关联 Story / Decision：S9-STORY-007C · DECISION-107 · S9-STORY-007B · S9-STORY-009（On Hold）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

将 007B `user_selectable` variant 暴露到**用户预览页** heading 样式选择器；手动选择后 Preview / Copy 可用；不污染 default preset / release1 / AI 生成路径。暂停 S9-STORY-009 closeout · 不确认 DECISION-106 · audit 分支不 merge。

## 3. 执行范围

**做了：**

- `user-selectable-preview-pool` · `user-preview-style-registry` · `user-preview-render`
- `PreviewStyleControls` 暴露 user_selectable heading 选项（Gallery 排除）
- `renderArticlePreviewClient` 使用 preview-only registry + adapter
- 测试 `user-selectable-preview-picker-007c.test.ts`
- DECISION-107 · 架构文档 · 敏捷文档同步（009 On Hold）

**未做：**

- S9-STORY-009 merge / closeout
- DECISION-106 确认
- Gallery preset pool 扩展
- sprint → release/1 merge

## 4. 修改文件

- `src/lib/preview-heading-style.ts`
- `src/lib/preview-style-controls.ts`
- `src/lib/render-article-preview-client.ts`
- `src/components/preview/preview-style-controls.tsx`
- `src/app/gallery/gallery-page-client.tsx`
- `src/core/copy/copy-html-snapshot.ts`
- `src/core/copy/clipboard-payload.ts`
- `src/core/style-library/index.ts`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint9-style-management-system-v0.md`
- `docs/agile/product-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`

## 5. 新增文件

- `src/core/style-library/user-selectable-preview-pool.ts`
- `src/lib/user-preview-style-registry.ts`
- `src/lib/user-preview-render.ts`
- `tests/lib/user-selectable-preview-picker-007c.test.ts`
- `docs/architecture/style-library-user-selectable-preview-picker.md`

## 6. 阅读但未修改的关键文件

- `src/core/style-library/inspection-render-adapter.ts`
- `tests/core/style-library/style-library-runtime-boundary-audit-007b.test.ts`

## 7. 关键变更说明

PO 澄清 user-selectable 验收须包含用户预览页手动选择器。实现从 manifest 读取 `user_selectable` pool，扩展 **preview-only** style registry 与 render adapter；generation 仍用 `createFirstWaveRequiredVariantRegistry()`。Gallery 通过 `includeUserSelectableHeadingOptions=false` 保持 release1 pool only。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 预览页选择器可见 | PASS | `PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS` |
| AC-2 手动选择 | PASS | `headingVariantId` override |
| AC-3 Preview | PASS | `renderUserPreviewArticleBlocks` |
| AC-4 Copy | PASS | `#0d9488` in clipboard HTML |
| AC-5~AC-8 边界 | PASS | release1 / gallery / AI 未污染 |
| AC-9 默认生成不变 | PASS | 无 heading override 时不选 html-paste |
| AC-10 Workbench | PASS | manifest metadata 未改 |
| AC-11 Gallery 不暴露 | PASS | `includeUserSelectableHeadingOptions=false` |
| AC-12 lint/test/build | PASS | 1006 tests |
| AC-13 merge sprint | 待用户 | |

## 9. 运行检查

| 命令 | 结果 |
|------|------|
| corepack pnpm lint | PASS（0 errors） |
| corepack pnpm test | PASS（1006 tests） |
| corepack pnpm build | PASS |

## 10. 未完成事项

- 用户审查 merge 007C → sprint
- S9-STORY-009 closeout 重跑（007C merge 后）
- DECISION-106 仍不确认

## 11. 风险与阻塞

- 无 P0。user_selectable 仍依赖 html-paste inspection adapter（P1，与 007B 一致）。

## 12. 需要用户 / ChatGPT 审查的问题

- 用户预览页 heading 选择器中 user_selectable 选项 label 是否满足运营可读性
- 007C merge 后是否立即重跑 S9-STORY-009

## 13. 建议下一步

1. 审查 007C diff + DECISION-107
2. merge `feature/s9-story-007c-expose-user-selectable-preview-picker` → sprint
3. 重跑 S9-STORY-009 closeout（新 audit 分支）
4. 再评估 Sprint 9 关闭

## 14. Commit

- Commit hash：（commit 后更新）
