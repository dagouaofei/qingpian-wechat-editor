# Execution Report：S10-STORY-011 User Preview Fidelity Refresh

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/10-promote-user-selectable`（推断）
- 目标合并分支：`sprint/10-promote-user-selectable`
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011
- 执行者：Cursor
- 状态：Done（用户验收 2026-06-08 · 已 commit · 未 merge sprint）

## 2. 本轮目标

修复用户侧 `/preview` 与 admin Preview inspection 对 `heading_html_paste_4933bb91_candidate` 输出不一致的问题；保证 preview 与 copy 共用 fidelity tree refresh + semantic title substitution。

## 3. 执行范围

- 扩展 runtime DSL pool，向用户侧传递 `rawHtml` 与 source metadata
- 用户 preview/copy 路径向 `renderDslBlock` 传递 `sourceHtml`，触发与 inspection 相同的 fidelity refresh
- 统一 `shouldRefreshVariantDslFromSourceHtml` 逻辑（admin + user 共用）
- 新增/更新测试；debug instrumentation 已移除

## 4. 修改文件

- `src/lib/dsl-runtime/resolve-fidelity-variant-dsl.ts`
- `src/lib/dsl-runtime/render-dsl-block.ts`
- `src/lib/dsl-runtime-context-types.ts`
- `src/lib/user-preview-render.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool-types.ts`
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `src/lib/dsl-runtime/resolve-runtime-pool-definition.ts`（新增）
- `src/server/style-admin/runtime/runtime-variant-dsl-pool-cache.ts`
- `tests/lib/resolve-runtime-pool-definition.test.ts`（新增）

## 5. 新增文件

- 无

## 6. 阅读但未修改的关键文件

- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/core/copy/clipboard-payload.ts`
- `tests/lib/dsl-runtime-single-track.test.ts`

## 7. 关键变更说明

**根因（runtime 证据）：**

- Admin inspection 已从 `rawHtml` 强制 refresh fidelity tree（Story 011 上一轮修复）
- 用户侧 `renderUserPreviewBlock` 调用 `renderDslBlock` 时**未传 `sourceHtml`**
- DB 中 stale slot-tree DSL（`#1677ff` collapsed 结构）被直接 decode，走 `slots.title` 路径
- Debug log 对比：
  - `sourceHtmlLength: 0` → 仍 decode stale tree（旧行为）
  - `sourceHtmlLength: 546` → `slotSubstitutionPath: meta.semanticBindings.title`，`has1677ff: false`

**修复：**

1. `getRuntimeVariantDslPool` 加载 `sources`，构建 `variantSourceMetaByVariantId`（含 `sourceHtml`、`primarySourceType`、`styleFamily`）
2. `renderUserPreviewBlock` 将 metadata 传入 `renderDslBlock`
3. `shouldRefreshVariantDslFromSourceHtml` 统一 admin/user refresh 条件（`requiresFidelityTreeRefresh` 或 html_paste heading/title）
4. Copy 经 `buildUserPreviewClipboardPayload` → `renderUserPreviewBlock`，自动与 preview 一致

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 用户 preview 与 inspection 结构一致 | PASS | 用户验收 |
| `data-slot-substitution-path=meta.semanticBindings.title` | PASS | server 预解析 + client decode |
| 无 `#1677ff` collapsed fallback | PASS | 用户验收 |
| Copy 与 preview 一致 | PASS | 用户验收 |
| 切换 variant 无 client runtime error | PASS | 用户验收；fidelity refresh 移至 server pool |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test -- tests/lib/dsl-tree-html-preview.test.ts tests/server/style-admin/inspection/candidate-inspection-background-number-heading.test.ts tests/lib/dsl-runtime-single-track.test.ts` | PASS | 10/10 |
| `npm run lint` | 未运行 | — |
| `npm run build` | 未运行 | — |

## 10. 未完成事项

- 未 commit / 未 merge
- **2026-06-08 跟进**：修复 client 切换 variant 时 `randomUUID is not a function`（fidelity refresh 改回 server-side pool 预解析）

## 10b. 跟进修复（client runtime error）

**现象：** 切换 variant 时报 `randomUUID is not a function`，栈：`encodeHtmlToVariantDsl` ← `refreshVariantDslFromSourceHtml` ← client `renderUserPreviewBlock`

**根因：** 上一轮在 client 侧传入 `sourceHtml` 触发 `encodeHtmlToVariantDsl`，该 encoder 依赖 `node:crypto.randomUUID`，浏览器 bundle 不可用。

**修复：**
1. 新增 `resolveRuntimePoolDefinitionJson` — 在 server `getRuntimeVariantDslPool` 加载 DB 时预 refresh fidelity DSL
2. client `renderUserPreviewBlock` 不再传 `sourceHtml`（只 decode 已预解析的 definitionJson）
3. `toDslRuntimeSnapshot` 剥离 `sourceHtml`，避免大 payload + 误触发 client encode
4. runtime pool cache key 升至 `v2-fidelity-preresolve` 使旧 cache 失效

**测试：** 12/12 pass（含 `resolve-runtime-pool-definition.test.ts`）

## 11. 风险与阻塞

- Runtime pool 有 TTL cache；用户验收前需重启 dev server 或等待 cache 过期

## 12. 需要用户 / ChatGPT 审查的问题

- 是否 commit 并 merge 至 sprint 分支？

## 13. 建议下一步

1. 用户按 reproduction steps 验收 preview + copy
2. 确认后移除 debug instrumentation 并 commit
3. 合并至 sprint 分支

## 14. Commit

- Commit hash：（见本轮 `fix: preresolve fidelity DSL from sourceHtml for html_paste headings` commit）
