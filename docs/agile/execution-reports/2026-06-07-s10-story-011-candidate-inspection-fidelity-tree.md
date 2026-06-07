# Execution Report：S10-STORY-011 Candidate Inspection Fidelity Tree Binding

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/10-promote-user-selectable`（推断，延续 S10 工作分支）
- 目标合并分支：`sprint/10-promote-user-selectable`
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011（In Review）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

修复 Candidate detail 页 Preview inspection 真实入口在 background number heading 场景下仍走错误渲染路径的问题：当 DB `definitionJson.tree` 与 `meta.semanticBindings.title` 不一致时，标题被替换到错误节点（84px number span + pill fallback 样式）。

## 3. 执行范围

**做了：**

- 新增覆盖 `buildCandidateInspectionPanelViewModel` 真实入口的 regression test
- 在 `renderCandidateViaDslDecoder` 中，当 semantic binding path 无法在 stored tree 上解析且 `rawHtml` 存在时，从 `rawHtml` 重新 fidelity encode 后再 decode
- 将 `rawHtml` 贯通 inspection source（view-model / persist 路径）
- `buildCandidatePreviewBlock` 输出 `runtimeTrace`（含 substitution 路径）
- 增强 `FidelitySubstitutionTrace`：`slotSubstitutionPath`、`slotSubstitutionTargetPath`、`actualTextLeafPath`
- 更新相关 decoder / preview trace 测试期望

**没做：**

- 未 merge sprint / release / main
- 未关闭 S10-STORY-011 或 Sprint 10
- 未跑全量 lint / build
- 未修改 DB 中已有 stale definition（运行时通过 rawHtml 自愈）

## 4. 修改文件

- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `src/server/style-admin/inspection/candidate-preview-block.ts`
- `src/server/style-admin/inspection/candidate-inspection-types.ts`
- `src/server/style-admin/inspection/run-candidate-inspection.ts`
- `src/app/admin/(protected)/style-library/candidate-inspection-view-model.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/core/renderer/types.ts`
- `src/lib/dsl-runtime/render-dsl-block.ts`
- `src/components/preview/dsl-tree-html-preview-block.tsx`
- `tests/server/style-admin/inspection/candidate-inspection-dsl-preview.test.ts`
- `tests/core/dsl/encoder/fidelity-encoder.test.ts`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`

## 5. 新增文件

- `tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts`

## 6. 阅读但未修改的关键文件

- `src/server/style-admin/inspection/candidate-preview-inspector.ts`
- `src/app/admin/(protected)/style-library/candidate-inspection-panel.tsx`
- `src/app/admin/(protected)/style-library/style-library-admin-view-model.ts`
- `src/core/dsl/decoder/decode-tree.ts`
- `src/core/dsl/decoder/resolve-dsl-slots.ts`

## 7. 关键变更说明

**根因：** 用户看到的错误 HTML 与「collapsed stale tree + fallback 替换到第一个 styled text（84px span）」完全一致；而 harvest/encoder 产出的 fidelity tree + `semanticBindings.title = tree.children[1].children[0]` 本身是正确的。说明 DB 中 `definitionJson.tree` 可能与 meta 不同步。

**修复策略：**

1. `semanticBindingsResolveOnTree()` 校验 title binding path 是否能在 stored tree 上解析。
2. 解析失败且 `source.rawHtml` 存在时，`resolveInspectionVariantDsl()` 用 fidelity encoder 从 rawHtml 重建 tree，再进入 decode + `applyFidelityTreeArticleSubstitution`。
3. Preview block 透出完整 substitution trace，供 UI `data-*` 属性与 `sourceExact.fallbackUsed` 使用。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 新增真实入口 regression test 先失败 | PASS | stale collapsed tree fixture 复现用户错误输出 |
| Preview inspection 含 `01` + sample title 在 h2 | PASS | `buildCandidateInspectionPanelViewModel` 测试通过 |
| 无 pill fallback（#1677ff / 错误 accent 位置） | PASS | 断言通过 |
| trace: `meta.semanticBindings.title`, `fallbackUsed=false` | PASS | runtimeTrace 断言通过 |
| 定向测试通过 | PASS | 见 §9 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm test -- candidate-inspection` | PASS | 1250 tests |
| `corepack pnpm test -- dsl-runtime-fidelity-heading-substitution` | PASS | 1250 tests |
| `corepack pnpm test -- fidelity-encoder` | PASS | 1250 tests |
| `pnpm lint` | 未运行 | 本轮仅定向测试 |
| `pnpm build` | 未运行 | 本轮仅定向测试 |

## 10. 未完成事项

- 用户本地 DB 若 `rawHtml` 缺失，stale tree 仍无法自愈（需 re-harvest 或数据修复）
- 全量 lint / build 待后续轮次或合并前执行

## 11. 风险与阻塞

- 每次 inspection 在 binding/tree 不一致时会 re-encode rawHtml（仅 heading/title + 有 rawHtml 时）；性能影响应可忽略
- 若 DB tree 与 meta 一致但内容本身错误，本轮不会触发 refresh

## 12. 需要用户 / ChatGPT 审查的问题

- 是否应在 promote / harvest 写入阶段也强制 tree/meta 一致性校验，避免 stale tree 入库？
- `slotSubstitutionPath` 由 tree path 改为逻辑路径 `meta.semanticBindings.title` 是否符合长期 trace 契约？

## 13. 建议下一步

1. 用户在 `/admin/style-library/heading_html_paste_4933bb91_candidate` 重新打开 Candidate Inspection，确认 Preview inspection HTML 与 trace
2. ChatGPT 审查本 report + commit
3. 用户确认后 merge 工作分支 → sprint 分支

## 14. Commit

- Commit hash：`5f67a56` — `fix: render candidate inspection through fidelity tree binding`
