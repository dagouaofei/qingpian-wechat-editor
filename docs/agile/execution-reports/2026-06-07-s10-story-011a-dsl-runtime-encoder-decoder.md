# Execution Report：S10-STORY-011A DSL Runtime + Encoder / Decoder Core

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011a-dsl-runtime-encoder-decoder`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10 — Database-backed Style Management Admin v1
- 关联 Story / Bug / Decision：S10-STORY-011A · S10-STORY-011（暂停 merge · stash WIP）
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

建立 Article / Variant DSL 统一中间表示架构，修复本地 E2E 暴露的 runtime 分裂：promoted `heading_html_paste_*_candidate` 在用户侧 picker 可见但 Preview 小标题不显示。

## 3. 执行范围

**已完成：**

- WeChat Compatibility Spec 模块（`src/core/wechat-compatibility/`）
- DSL Runtime Contract（`src/core/dsl/runtime/`）
- Encoder：HTML → Variant DSL · Registry → Variant DSL · legacy definition 适配
- Decoder Core：tree + renderContract 双路径 · preview / copy_wechat / admin_inspection / qa_snapshot
- 用户侧 runtime · Admin inspection · Harvest · Import 接线 DSL
- 修复 promoted html_paste heading 用户侧 preview/copy（DSL 路径）
- 测试覆盖核心边界（1165 tests PASS）
- 架构文档同步

**未完成（留后续）：**

- S10-STORY-011 Promote eligibility DSL renderability check（011 WIP 在 stash，须在 011A merge 后 rebase 收口）
- 本地完整 E2E（需用户按 DATABASE_URL 路径手动验收）
- commit / merge sprint

**明确不做：** DOM 反向编码 · AI 生成 · 删 registry · OSS · 生产 RDS · merge release/main

## 4. 修改文件

- `src/lib/user-preview-render.ts`
- `src/lib/render-article-preview-client.ts`
- `src/lib/user-selectable-variant-pool-types.ts`
- `src/server/style-admin/harvest/extract-heading-candidate.ts`
- `src/server/style-admin/harvest/extract-info-card-candidate.ts`
- `src/server/style-admin/import/map-style-registry-variant-to-db.ts`
- `src/server/style-admin/inspection/candidate-copy-inspector.ts`
- `src/server/style-admin/inspection/candidate-preview-block.ts`
- `src/server/style-admin/inspection/candidate-preview-inspector.ts`
- `src/server/style-admin/runtime/user-selectable-variant-pool*.ts`
- `tests/server/style-admin/inspection/candidate-inspection.test.ts`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `docs/agile/sprint10-database-backed-style-admin-v1.md`
- `docs/architecture/style-management-admin-v1.md`

## 5. 新增文件

- `src/core/wechat-compatibility/`（8 文件）
- `src/core/dsl/`（encoder · decoder · runtime · index）
- `src/lib/dsl-runtime/`（parse · render · index）
- `src/server/style-admin/inspection/candidate-dsl-render.ts`
- `tests/core/wechat-compatibility/wechat-compatibility-spec.test.ts`
- `tests/core/dsl/encoder/html-to-variant-dsl.test.ts`
- `tests/core/dsl/decoder/decode-variant-dsl.test.ts`
- `tests/lib/dsl-runtime-promoted-heading-preview.test.ts`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/architecture/wechat-compatibility-spec.md`

## 6. 阅读但未修改的关键文件

- `src/server/style-admin/inspection/db-candidate-admin-render.ts`（legacy admin render · 非主路径）
- `src/core/style-library/inspection-render-adapter.ts`（htmlPasteCandidate 专用 renderer · 由 Decoder 复用）
- `src/core/renderer/title-block-renderer.ts`
- `docs/agile/git-workflow.md`

## 7. 关键决策

1. **`definitionJson` = Variant DSL runtime source**（`s10.variant-dsl.v1`），不新增 Prisma 字段。
2. **双 DSL 形态**：`tree`（HTML harvest）+ `renderContract`（registry import，`meta.legacySlots` 保留 slots）。
3. **Preview / Copy / Admin Inspection 共用 Decoder Core**；`usedAdminFallback=false`。
4. **用户侧 DSL 仅作用于 user-selectable variants**；release1 主路径仍用既有 renderer，避免全量迁移风险。
5. **`htmlPasteCandidate` 族**在 `renderContract` 路径走 section-label 专用渲染，主题色来自 `article.styleAssignment.themeId`。
6. **S10-STORY-011 暂停 merge**；Promote 须基于 011A 增加 DSL renderability gate。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| WeChat Compatibility Spec 已建立 | PASS | `src/core/wechat-compatibility/` + 测试 |
| Article / Variant DSL v1 已建立 | PASS | `src/core/dsl/runtime/` |
| HTML / Registry Encoder 已建立 | PASS | harvest · import 已接线 |
| Decoder Core 四 target | PASS | `decode-variant-dsl` · `decode-contract` · `decode-tree` |
| 11 blockType renderContract 支持 | PASS | import 路径全覆盖 |
| Admin / 用户侧共用 Decoder | PASS | `candidate-dsl-render` · `user-preview-render` |
| promoted heading 用户侧 preview | PASS | `dsl-runtime-promoted-heading-preview.test.ts` |
| Promote DSL gate | N/A | 留 S10-STORY-011 收口 |
| lint / test / build | PASS | 1165 tests · build OK · lint 0 errors |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 0 errors · 28 warnings（既有） |
| `corepack pnpm test` | PASS | 157 files · 1165 tests |
| `corepack pnpm build` | PASS | Next.js production build OK |

## 10. 本地 E2E 验收路径（须用户执行）

```bash
export DATABASE_URL="postgresql://qingpian:qingpian_local_dev@localhost:54329/qingpian_style_admin?schema=public"
corepack pnpm prisma migrate deploy
corepack pnpm style-admin:import-existing-variants
corepack pnpm dev
```

1. 登录 admin → `/admin/style-library/harvest` 创建 heading HTML candidate
2. Run Preview / Copy / Validator → Paste QA pass → Promote（011 收口后）
3. `/api/dev/style-admin/user-selectable-pool?blockType=heading` 确认出现
4. `/preview?topic=AI写作&basicStyle=business` 选择 promoted candidate → 小标题显示 · Copy 正常
5. 现有 7 个 userSelectable heading variants 仍正常

## 11. 未完成事项

- Promote eligibility DSL renderability check（S10-STORY-011）
- 用户本地 E2E 全路径确认（Promote 依赖 011）
- Git commit / merge sprint（待用户确认）

## 12. 风险与阻塞

- S10-STORY-011 WIP 在 stash `wip-s10-story-011-promote`，merge 011A 后须 rebase 并接入 DSL gate。
- 已 import DB 的 variants 需重新 `style-admin:import-existing-variants`（或 migration 脚本）方可使 `definitionJson` 全部为 DSL。
- `.pnpm-store/` 为本地 untracked，勿提交。

## 13. 需要用户 / ChatGPT 审查的问题

1. 011A 是否可 merge 至 `sprint/s10-db-backed-style-admin-v1`？
2. merge 后是否从 stash 恢复 011 并在 011A 之上 rebase？
3. 是否需要一次性 DB re-import 使全量 `definitionJson` DSL 化？

## 14. 建议下一步

1. ChatGPT 审查本 execution report
2. 用户确认 merge `feature/s10-story-011a-dsl-runtime-encoder-decoder` → sprint
3. 恢复 011 stash · 增加 Promote DSL renderability check · 本地 E2E
4. S10-STORY-012 Audit / Closeout

## 15. Commit

- Commit hash：**未提交 / not committed**
