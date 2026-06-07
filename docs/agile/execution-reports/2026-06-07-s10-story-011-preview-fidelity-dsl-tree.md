# Execution Report：S10-STORY-011 Preview Fidelity DSL Tree

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/10-promote-user-selectable`（延续）
- 目标合并分支：`sprint/10-promote-user-selectable`
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011（In Review）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

修复 Preview 实际渲染未使用 fidelity DSL tree 的问题：当 stored tree 含 `slot:title` 节点但 `meta.semanticBindings.title` 指向 h2 element path 时，Preview 仍走 `slots.title` 并把 sample title 注入 84px span。

## 3. 执行范围

**做了：**

- 根因修复：`semanticBindings.title` 优先于 `slots.title` 早退
- `resolveSlotsForDslDecode`：有 semantic binding 时 title slot 使用 template extractedSlots，不再注入 article title
- 新增 `requiresFidelityTreeRefresh`：检测 tree 含 slot 节点或 binding path 不可解析
- 抽取 `resolveFidelityVariantDslForDecode` 供 admin inspection 与 `renderDslBlock` 共用
- 新增 `tests/lib/dsl-tree-html-preview.test.ts` 覆盖 `renderDslBlock` 最终 HTML + trace
- 扩展 `candidate-inspection-background-number-heading.test.ts` 覆盖 slot-tree hybrid + rawHtml 刷新

**没做：**

- 未 merge sprint / release / main
- 未关闭 Sprint 10 / S10-STORY-011
- 未跑全量 lint / build
- 无 rawHtml 时无法重建 fidelity 结构（仅阻止错误 slots.title 注入）

## 4. 修改文件

- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/core/dsl/decoder/resolve-dsl-slots.ts`
- `src/lib/dsl-runtime/render-dsl-block.ts`
- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`（新增）
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts`

## 5. 新增文件

- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`
- `tests/lib/dsl-tree-html-preview.test.ts`

## 6. 阅读但未修改的关键文件

- `src/components/preview/dsl-tree-html-preview-block.tsx`（确认仅 `dangerouslySetInnerHTML` 渲染 decoded HTML，无二次构造）
- `src/server/style-admin/inspection/candidate-preview-block.ts`

## 7. 关键变更说明

**复现：** hybrid tree = collapsed section + `{ type:"slot", slot:"title" }` span(84px) + 正确 `semanticBindings.title` path → trace `slots.title`，sample title 出现在 84px span。

**修复：**

1. substitution 先尝试 `meta.semanticBindings.title` path；仅当无 semantic binding 时才允许 `slots.title` trace。
2. slot 内容解析：semantic binding 存在时，title slot 保留 template 文本，article title 仅通过 tree substitution 写入 h2。
3. tree 含 slot 节点或 binding 不可解析时，有 `sourceHtml/rawHtml` 则 fidelity re-encode 后再 decode。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| Preview 直接渲染 fidelity tree | PASS | rawHtml 刷新后输出含双 section + h2 + red bar |
| 不再 `data-slot-substitution-path="slots.title"` | PASS | trace 为 `meta.semanticBindings.title` |
| `fallbackUsed=false` | PASS | 测试断言通过 |
| 真实入口 regression test | PASS | `dsl-tree-html-preview.test.ts` + candidate inspection 扩展 |
| 定向测试 | PASS | 见 §9 |

## 9. 运行检查

| 命令 | 结果 |
|------|------|
| `corepack pnpm test -- candidate-inspection` | PASS |
| `corepack pnpm test -- dsl-runtime-fidelity-heading-substitution` | PASS |
| `corepack pnpm test -- dsl-tree-html-preview` | PASS |
| `pnpm lint` | 未运行 |
| `pnpm build` | 未运行 |

## 10. 未完成事项

- 无 rawHtml 的 stale slot-tree 无法恢复完整 fidelity 结构（仅避免错误 title 注入）
- 用户侧 `renderUserPreviewBlock` 尚未从 DB 附加 sourceHtml（需后续从 pool/source 贯通）

## 11. 风险与阻塞

- Admin inspection 依赖 `sources.rawHtml` 存在；缺失时 preview 可能缺少 article title 但不会错位到 number span

## 12. 需要用户 / ChatGPT 审查的问题

- 是否应在 harvest 写入时将 `sourceHtml` 摘要写入 `meta` 以供无 rawHtml 场景自愈？

## 13. 建议下一步

1. 用户复测 `/admin/style-library/heading_html_paste_4933bb91_candidate` Preview inspection
2. 确认 `data-slot-substitution-path="meta.semanticBindings.title"` 且 HTML 结构正确
3. ChatGPT 审查后 merge 至 sprint 分支

## 14. Commit

- Commit hash：`85ee305` — `fix: render preview from fidelity dsl tree`
