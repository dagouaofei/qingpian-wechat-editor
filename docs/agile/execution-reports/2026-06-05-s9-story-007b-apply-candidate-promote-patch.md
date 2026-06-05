# Execution Report：S9-STORY-007B Apply Candidate Promote Patch via Cursor

## 1. 基本信息

- 日期：2026-06-05
- 当前分支：`feature/s9-story-007b-apply-candidate-promote-patch`
- 来源分支：`sprint/s9-style-management-system-v0`
- 目标合并分支：`sprint/s9-style-management-system-v0`
- Sprint：Sprint 9 — Style Management System v0
- 关联 Story / Decision：S9-STORY-007B · DECISION-105 · S9-STORY-005 · DECISION-104
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 HTML paste proposal → Cursor code-backed apply patch 闭环：新增 `user_selectable` variant/asset/evidence，Workbench 可见，不污染 default preset / release1_required。

## 3. 执行范围

**做了：**

- E2E HTML sample（teal section label · 非 006D seed）
- `html-paste-candidate-variants.ts` + `html-paste-candidate-copy.ts`
- `html-paste-variant-assets.ts` · manifest · evidence refs · lifecycle ref · inactive applied registry patch
- `style-teal-section-label` + `palette_teal_section_editorial`
- inspection registry + summaries 扩展 user_selectable asset
- 测试 · 架构文档 · DECISION-105 · agile 同步

**未做：**

- merge sprint（待用户审查）
- S9-STORY-009 closeout
- merge release/1 / main

## 4. 修改文件

- `src/core/style-library/manifest.ts` · `evidence-refs.ts` · `style-assets.ts` · `palette-assets.ts` · `inspection.ts` · `inspection-fixtures.ts` · `index.ts`
- `src/core/copy/title-block-copy.ts` · `src/core/renderer/title-block-renderer.ts`
- 多份测试与 agile / architecture 文档

## 5. 新增文件

- `src/core/styles/variants/html-paste-candidate-variants.ts`
- `src/core/copy/html-paste-candidate-copy.ts`
- `src/core/style-library/assets/html-paste-variant-assets.ts`
- `src/core/style-library/assets/applied-registry-patch.ts`
- `tests/fixtures/style-library/s9-story-007b-html-paste-e2e-sample.ts`
- `tests/core/style-library/style-library-apply-patch-007b.test.ts`
- `docs/research/wechat-published-article-evidence/WX-HTML-PASTE-E2E-001.md`
- `docs/agile/paste-qa/wechat-paste-qa-e2e-2026-06-05-s9-story-007b.md`
- `docs/architecture/style-library-apply-candidate-promote-patch.md`

## 6. 阅读但未修改的关键文件

- `src/core/style-library/promote.ts`
- `src/config/miaopian-preset-bundles.ts`
- `docs/agile/git-workflow.md`

## 7. 关键变更说明

1. **E2E sample：** 青绿 `#0d9488` section label heading HTML（区别于 006D 紫色 seed）
2. **Apply patch：** asset lifecycle=`user_selectable` · distribution 边界 enforced
3. **Runtime boundary：** 未加入 `createFirstWaveRequiredVariantRegistry()` · 未改 default preset
4. **Inspection：** `getStyleLibraryInspectionSummaries` 含 user_selectable 非 seed asset

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1~AC-21 | PASS（除 AC-21 merge） | 见 sprint-backlog S9-STORY-007B |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| corepack pnpm lint | PASS | 0 errors · 24 warnings |
| corepack pnpm test | PASS | 113 files · 992 tests |
| corepack pnpm build | PASS | Next.js build OK |

## 10. 未完成事项

- 用户确认 merge 至 sprint

## 11. 风险与阻塞

- HTML paste copy renderer 为 E2E 最小实现；S10 批量扩展需更多 Paste QA

## 12. 需要用户 / ChatGPT 审查的问题

- user_selectable asset 出现在 inspection/promote panels（3 panels）是否符合运营 UX 预期
- applied registry patch 保持 inactive；是否需在 S9-STORY-009 激活 admin-only preset pool

## 13. 建议下一步

1. 审查本 report + DECISION-105
2. merge `feature/s9-story-007b-apply-candidate-promote-patch` → sprint
3. 启动 S9-STORY-009 closeout

## 14. Commit

- Commit hash：`071c164`
