# Execution Report：S10-STORY-011 Candidate Preview Fidelity Refresh

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/10-promote-user-selectable`（推断，与 Story 分支命名一致）
- 目标合并分支：`sprint/10-promote-user-selectable`
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011
- 执行者：Cursor
- 状态：Done（已并入 FIX-C 同批 commit · 未 merge sprint）

## 2. 本轮目标

修复 Candidate Detail Preview inspection 对 `heading_html_paste_4933bb91_candidate` 输出错误 HTML（`slots.title`、collapsed `#1677ff` 结构）的问题；验证后移除 debug instrumentation。

## 3. 执行范围

- 修复 inspection 路径：从 `rawHtml` 强制刷新 fidelity DSL tree（html_paste heading/title）
- 统一使用 `pickInspectionHtmlSource` 选取含 `rawHtml` 的 source
- 移除本轮 debug instrumentation（`debug-agent-log.ts`、fetch 埋点）
- 未 commit / 未 merge

## 4. 修改文件

- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `src/app/admin/(protected)/style-library/candidate-inspection-view-model.ts`
- `src/server/style-admin/inspection/run-candidate-inspection.ts`
- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`

## 5. 新增文件

- `src/server/style-admin/inspection/pick-inspection-html-source.ts`

## 6. 删除文件

- `src/lib/debug-agent-log.ts`

## 7. 阅读但未修改的关键文件

- `tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts`
- `src/server/style-admin/inspection/candidate-preview-block.ts`

## 8. 关键变更说明

**根因（runtime 证据）：** DB 存的是 stale slot-based collapsed tree（无 `meta.semanticBindings.title`）。虽有 `rawHtml`（539 字符），但 `requiresFidelityTreeRefresh()` 返回 `false`，未从 source HTML 重建 fidelity tree，decode 走 `slots.title` 路径。

**修复：**

1. `shouldAlwaysRefreshInspectionFromRawHtml`：对 html_paste heading/title 候选，有 `rawHtml` 时 inspection 始终 `refreshVariantDslFromSourceHtml`。
2. `pickInspectionHtmlSource`：view-model 与 `run-candidate-inspection` 选取第一个含非空 `rawHtml` 的 source，而非固定 `sources[0]`。

## 9. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| Preview 使用 fidelity tree + `meta.semanticBindings.title` | PASS | 用户确认修复；post-fix logs：`substitutionPath: meta.semanticBindings.title`，`has1677ff: false` |
| 无 `#1677ff` collapsed fallback | PASS | 测试与用户验收通过 |
| instrumentation 已清理 | PASS | 已删除 `debug-agent-log.ts` 及所有 fetch 埋点 |

## 10. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test -- tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts` | PASS | 2/2 |
| `npm run lint` | 未运行 | 仅移除埋点，无 API 变更 |
| `npm run build` | 未运行 | — |

## 11. 未完成事项

- 工作区变更未 commit（待用户指示）
- 未 merge 至 sprint 分支

## 12. 风险与阻塞

- 无

## 13. 需要用户 / ChatGPT 审查的问题

- 是否将 `pick-inspection-html-source.ts` 与 inspection refresh 修复一并 commit？
- Story 状态是否由用户关闭为 Done？

## 14. 建议下一步

1. 用户确认后 commit：`fix: refresh candidate inspection from rawHtml for html_paste headings`
2. 合并 `feature/s10-story-011-promote-user-selectable-final` → sprint 分支
3. ChatGPT 审查 execution report 与 AC

## 15. Commit

- Commit hash：（见本轮 `fix: preresolve fidelity DSL from sourceHtml for html_paste headings` commit）
