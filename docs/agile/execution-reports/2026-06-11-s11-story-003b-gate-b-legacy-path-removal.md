# Execution Report：S11-STORY-003B Gate B — Legacy Path Removal

## 1. 基本信息

- 日期：2026-06-11
- 当前分支：`refactor/s11-story-003b-legacy-path-removal` @ `be8c736`
- 来源分支：`sprint/s11-production-ops-go-live` @ `381e146`
- 目标合并分支：`sprint/s11-production-ops-go-live`（**待 staging 回归 · 未 merge**）
- Sprint：Sprint 11 · **In Progress**
- Story：S11-STORY-003B · **In Progress**（Gate B 代码完成 · 待 staging）
- S11-STORY-003A：**Done** · S11-STORY-004：**Pending**
- **production：未启动** · **main：未 merge**

## 2. 003A merge 修正（sprint · 已完成）

| 项 | Hash |
|----|------|
| 备份 `backup/s11-003a-before-no-ff-fix` | 旧 sprint FF 指针 |
| 备份 `backup/s11-003b-gate-a-before-rebase` | 旧 003B Gate A |
| reset 至合并前 | `9ac6edf` |
| `--no-ff` merge commit | **`2ee03c5`** |
| 003A closeout docs | **`381e146`** |
| sprint HEAD（已 push） | **`381e146`** |

## 3. 003B 重建与 Gate A

| 项 | Hash |
|----|------|
| Gate A docs cherry-pick tip | `73b71a8` |
| **Gate A Approved** | **`9fec9c3`** |
| 003B HEAD（已 push） | **`be8c736`** |

## 4. Gate B commits（小批次）

| Batch | Hash | 范围 |
|-------|------|------|
| 1 · user pool paths | **`b55c9b7`** | LP-001～005、LP-010 |
| 2 · lifecycle + eligibility | **`48c80d0`** | LP-006、LP-007、LP-009 |
| 3 · architecture guards | **`be8c736`** | tests + 回归测试更新 |

## 5. 删除 / 隔离 symbol 清单

| LP | Symbol / 路径 | 处置 |
|----|---------------|------|
| LP-001 | `resolvePreviewHeadingStyleOptions` → `PREVIEW_HEADING_STYLE_OPTIONS` | 改为 `[]` fail-closed |
| LP-002 | `user-selectable-preview-pool.ts` runtime 逻辑 | 隔离至 `style-library-manifest-preview-fixtures.ts`（dev/test） |
| LP-002 | `PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS` | 从 `preview-heading-style.ts` 移除 |
| LP-002 | `getCodeBackedUserSelectableVariants` | 删除 |
| LP-002 | `preferDatabaseVariants` | 删除 |
| LP-003 | `buildDegradedEmptyPool` `source: "code_fallback"` | 改为 `db_unavailable` |
| LP-004 | html-paste 注入 `buildCodeFallbackDslRuntime` | 删除 |
| LP-005 | `getCodeBackedRuntimeAvailableVariantIds` fallback in preview client | 删除 · 仅 `poolVariantIds` |
| LP-006 | manifest `lifecycle === "user_selectable"` filter | 删除（distribution-only） |
| LP-007 | admin lifecycle filter `user_selectable` 选项 | 从 dropdown 移除 |
| LP-009 | duplicate `isEligibleForUserSelectablePool` body | 委托 `isUserSelectablePoolMember` |
| LP-010 | dead import `getUserSelectablePreviewVariantDefinition` | 删除 |

**未删除：** LP-008 · Release1 renderer assets · Preview/Copy fidelity compatibility · Nginx SSE config

## 6. 净删除代码行数

| 范围 | 统计 |
|------|------|
| Gate B `src/` + `tests/`（`9fec9c3..be8c736`） | +291 / −171（含新 fixtures + architecture tests） |
| `src/` only 净变化 | 约 −45 LOC（隔离/删除 runtime fallback） |

## 7. 检查命令与结果

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | **PASS**（0 errors · 既有 warnings） |
| `corepack pnpm build` | **PASS** |
| `vitest tests/architecture/legacy-path-guards.test.ts` | **PASS**（12 tests） |
| Gate B 相关 tests（pool/picker/mappers/filters） | **PASS** |
| `pnpm test` 全量 | **1340/1348 PASS** · 8 failures **与 Gate B 无关**（import collect 计数、wechat-paste-qa-pack snapshot、admin detail 文案、dsl-tree-html-preview） |

## 8. push 结果

| 分支 | 结果 |
|------|------|
| `sprint/s11-production-ops-go-live` | **成功** `9ac6edf..381e146`（无 force） |
| `refactor/s11-story-003b-legacy-path-removal` | **成功**（新分支） |

## 9. Staging 部署步骤（Gate B 回归）

1. 在 staging ECS 拉取 `refactor/s11-story-003b-legacy-path-removal` @ `be8c736`
2. `corepack pnpm install --frozen-lockfile && corepack pnpm build`
3. 重启应用进程（同 Sprint 11 staging runbook）
4. 确认 `DATABASE_URL` 有效 · 无需新 migration（M-1 已在 sprint）
5. **人工回归：**
   - `/preview` heading picker 仅 DB pool · degraded 空列表 + notice
   - Admin `/admin/style-library` lifecycle 下拉无 `user_selectable` · distribution.userSelectable 筛选可用
   - Promote candidate → paste_qa_pass · pool 可见性
   - HTML paste 编号/主题 · Preview/Copy 一致
   - 生成 SSE 打字机（LP-008 未改 · 应无回归）
6. 回归通过后用户确认 merge 003B → sprint

## 10. 验收标准（Gate B · 待 staging）

| AC | 代码 | staging |
|----|------|---------|
| AC-1 P0 paths 删除/隔离 | Done | 待验 |
| AC-2 lifecycle 不参与用户可见性 | Done | 待验 |
| AC-3 eligibility 单契约 | Done | 待验 |
| AC-7 architecture tests | PASS | — |
| AC-8 staging 清单 | — | 待验 |
| AC-9 production/main | 未启动/未 merge | — |
| AC-10 LP-008 排除 | 是 | — |

## 11. 明确未执行

- merge 003B → sprint
- production 部署
- merge main
- LP-008 删除

## 12. commit hash 汇总

```
2ee03c5  merge(s11-003a): --no-ff
381e146  docs(s11-003a): closeout Done
9fec9c3  docs(s11-003b): Gate A Approved
b55c9b7  fix(s11-003b-gate-b): user pool paths
48c80d0  fix(s11-003b-gate-b): lifecycle + eligibility
be8c736  test(s11-003b-gate-b): architecture guards
```
