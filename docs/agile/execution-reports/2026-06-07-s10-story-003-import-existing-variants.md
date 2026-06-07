# Execution Report：S10-STORY-003 既有 Variant 全量导入数据库

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-003-import-existing-variants`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10 — Database-backed Style Management Admin v1
- 关联 Story / Bug / Decision：S10-STORY-003 · DECISION-108
- 执行者：Cursor
- 状态：**In Review**（FIX-A 已修复 · 待 merge 确认）

## 2. 本轮目标

实现既有 variant 全量导入数据库：collect / map / 幂等 importer / dry-run CLI / import report / 测试；不实现 `/admin` UI、用户侧 DB pool、HTML Harvest。

## 3. 执行范围

**已完成：**

- `src/server/style-admin/import/` 导入层（collect · map · checksum · writer · report · orchestrator）
- `scripts/style-admin/import-existing-variants.ts` CLI（`--dry-run` · `--report=`）
- `package.json` 脚本 `style-admin:import-existing-variants` / `:dry-run`
- 测试 `tests/server/style-admin/import/`（10 tests）
- 文档同步 · dry-run 摘要报告

**未做（按范围）：**

- `/admin/style-library`（S10-STORY-004）
- 用户侧 DB variant pool（S10-STORY-005）
- 后台上下架 UI / auth（S10-STORY-006 / 008）
- HTML Harvest（S10-STORY-009~011）
- 真实 RDS 连接 · commit · merge sprint

## 4. 修改文件

- `package.json` — 新增 import 脚本
- `src/server/style-admin/index.ts` — export import 模块
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint10-database-backed-style-admin-v1.md`
- `docs/agile/changelog.md`
- `docs/architecture/style-management-admin-v1.md`

## 5. 新增文件

- `src/server/style-admin/import/checksum.ts`
- `src/server/style-admin/import/import-types.ts`
- `src/server/style-admin/import/lifecycle-distribution-mapper.ts`
- `src/server/style-admin/import/collect-existing-style-variants.ts`
- `src/server/style-admin/import/map-style-registry-variant-to-db.ts`
- `src/server/style-admin/import/style-variant-import-writer.ts`
- `src/server/style-admin/import/import-existing-style-variants-report.ts`
- `src/server/style-admin/import/import-existing-style-variants.ts`
- `src/server/style-admin/import/index.ts`
- `scripts/style-admin/import-existing-variants.ts`
- `tests/server/style-admin/import/collect-existing-style-variants.test.ts`
- `tests/server/style-admin/import/checksum.test.ts`
- `tests/server/style-admin/import/import-existing-style-variants.test.ts`
- `docs/agile/import-reports/2026-06-07-s10-story-003-dry-run-summary.json`

## 6. 阅读但未修改的关键文件

- `prisma/schema.prisma`
- `src/server/style-admin/repositories/style-variant-repository.ts`
- `src/core/styles/` registry · first-wave variants
- `src/core/style-library/manifest.ts`
- `docs/architecture/style-library-storage.md`
- `docs/agile/sprint10-database-backed-style-admin-v1.md`

## 7. 关键变更说明

1. **Collect** 从 registry（92 release1_required）、harvest/html_paste candidates、style-library manifest overlay、5 个 deprecated heading stubs 收集 100 条 variant。
2. **Map** 将 `VariantDefinition` 转为 DB input，manifest 可覆盖 lifecycle / distribution；`userSelectable` 与 `defaultEligible` / `release1Required` 分离。
3. **幂等** 按 `runtimeVariantId` upsert；`sourceChecksum` 稳定 JSON SHA-256；未变则 `skipped_unchanged`。
4. **dry-run** 不写 DB；真实导入需本地 `DATABASE_URL`（非生产 RDS）。

**代码事实与文档差异：** 当前 registry 为 92 个 `release1_required`（11 block × 扩展变体），历史 first-wave 33 作为子集标记 `isHistoricalFirstWave33`，非独立 33 条 registry 记录。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 幂等导入脚本 | PASS | mock + repeated import test → `skipped_unchanged` |
| AC-2 first-wave required | PASS | registry 92 · historical 33 完整识别 |
| AC-3 user-selectable | PASS | `heading_teal_section_label_html_paste_candidate` |
| AC-4 candidate / deprecated | PASS | 8 candidate · 5 deprecated stubs |
| AC-5 导入报告 | PASS | JSON report · dry-run summary |
| AC-6 lint / test / build | PASS | 1037 tests · build OK · lint 0 errors |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | PASS | 0 errors · 27 warnings（既有） |
| `corepack pnpm test` | PASS | 125 files · 1037 tests |
| `corepack pnpm build` | PASS | Next.js build OK |
| `pnpm style-admin:import-existing-variants:dry-run` | PASS | collected=100 · errors=0 |

## 10. 未完成事项

- 未 commit（待用户确认）
- 未 merge 至 `sprint/s10-db-backed-style-admin-v1`
- 未对真实本地 PostgreSQL 执行 apply import（需用户配置 `DATABASE_URL`）

## 11. 风险与阻塞

- 79 variants 无 `componentProtocol`（registry 事实）— 已记入 report warnings，不阻塞导入
- 真实 DB apply 需在 S10-STORY-007 runbook 或本地 migration 后手动验证

## 12. 需要用户 / ChatGPT 审查的问题

1. Story 状态是否可从 In Review 标为 Done 并 merge 至 sprint？
2. 92 vs 历史 33 的文档表述是否需在 product 层进一步对齐？
3. 是否本轮 commit？

## 13. 建议下一步

1. 用户 / ChatGPT 审查 execution report
2. 确认后 commit + merge `feature/s10-story-003-import-existing-variants` → `sprint/s10-db-backed-style-admin-v1`
3. 启动 **S10-STORY-004**：`/admin/style-library` 基于 DB 列表与详情

## 14. FIX-A（merge 前修复）

**问题：** dry-run `byLifecycle.default_eligible=92` 误将 registry `release1_required` 计为 default eligible。

**修复：**

- Prisma `StyleVariantLifecycle` 新增 `release1_required` · migration `20260607110000_add_release1_required_lifecycle`
- `mapVariantStatusToLifecycle`：`release1_required` → lifecycle `release1_required`
- dry-run 现：`byLifecycle.release1_required=92` · `byDistribution.defaultEligible=0` · `byDistribution.release1Required=92`

## 15. Commit

- Commit hash：`15e01f5`
