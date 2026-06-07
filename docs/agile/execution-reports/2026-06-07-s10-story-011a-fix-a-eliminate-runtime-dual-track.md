# Execution Report：S10-STORY-011A FIX-A Eliminate Runtime Dual Track

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011a-dsl-runtime-encoder-decoder`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`（**本轮不 merge**）
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011A FIX-A
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

消除用户侧 runtime 双轨：DB 可用时 `/preview` 全部 block（含 release1_required seed）统一走 Article/Variant DSL + Decoder Core；禁止 `user-preview-render` 回退旧 `renderBlock`。

## 3. 执行范围

**已完成：**

- 新增 `runtime-variant-dsl-pool`（全量 runtime-eligible variants · 含 release1）
- 新增 `DslRuntimeSnapshot` / `buildCodeFallbackDslRuntime`
- 重写 `user-preview-render`：仅 DSL Decoder；`renderBlock` 已移除
- `render-article-preview-client` 接收独立 `dslRuntime`（与 picker pool 分离）
- `/preview` page 并行加载 `getRuntimeVariantDslPool()`
- 文档改写双轨表述
- 新增测试覆盖单轨行为

**未做：**

- merge sprint / 恢复 011 stash / Promote DSL gate

## 4. 修改文件

- `src/lib/user-preview-render.ts`
- `src/lib/render-article-preview-client.ts`
- `src/app/preview/page.tsx`
- `src/app/preview/preview-page-client.tsx`
- `src/server/style-admin/mappers.ts`
- `src/server/style-admin/runtime/index.ts`
- `src/server/style-admin/runtime/user-selectable-variant-pool-cache.ts`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- `tests/lib/dsl-runtime-promoted-heading-preview.test.ts`

## 5. 新增文件

- `src/lib/dsl-runtime-context-types.ts`
- `src/lib/dsl-runtime/build-code-fallback-dsl-runtime.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool-types.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool-mapper.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool-cache.ts`
- `tests/fixtures/dsl/runtime-dsl-snapshot-fixtures.ts`
- `tests/lib/dsl-runtime-single-track.test.ts`
- `tests/server/style-admin/runtime/runtime-variant-dsl-pool.test.ts`

## 6. 关键决策

1. **picker pool ≠ runtime pool**：`user-selectable-variant-pool` 仅服务 heading picker；渲染用 `runtime-variant-dsl-pool`。
2. **database 模式禁止 registry 回退**：缺 DSL 显式报错，不 silent 走旧 renderer。
3. **code_fallback**：DB 不可用时 registry seed 编码为 DSL 再 decode，并标注 `runtime_source=code_fallback` warning。
4. **renderContract**：保留为 Decoder Core 内部 DSL 形态（`decode-contract.ts`），用户侧不直连旧 runtime。

## 7. 验收标准

| AC | 结果 |
|----|------|
| DB 可用时 preview 统一 DSL Decoder | PASS |
| release1 seed 不绕过 DSL | PASS |
| user-preview-render 不调用 renderBlock（DB 模式） | PASS |
| userSelectable variants DSL preview/copy | PASS |
| promoted html_paste heading | PASS |
| admin / user 共用 decoder core | PASS |
| lint / test / build | PASS（1172 tests） |

## 8. 运行检查

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | PASS（0 errors） |
| `corepack pnpm test` | PASS（1172） |
| `corepack pnpm build` | PASS |

## 9. Commit

- **未提交 / not committed**

## 10. 建议下一步

1. ChatGPT 审查 FIX-A
2. 用户确认后 commit 011A（含 FIX-A）
3. 本地 E2E：`style-admin:import-existing-variants` 后验证全文章 preview/copy
4. 011 stash 恢复前须先 merge 011A
