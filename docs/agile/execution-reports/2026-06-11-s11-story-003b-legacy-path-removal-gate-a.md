# Execution Report：S11-STORY-003B Gate A — Legacy Path Audit

## 1. 基本信息

- 日期：2026-06-11
- 当前分支：`refactor/s11-story-003b-legacy-path-removal`
- 来源分支：`feature/s11-story-003a-staging-volcengine-streaming-numbering` @ `75fecb9`
- 目标合并分支：`sprint/s11-production-ops-go-live`（Gate B 完成后 · 待用户确认）
- Sprint：Sprint 11
- 关联 Story：S11-STORY-003B
- Gate：**A（审计与计划）**
- 执行者：Cursor
- 状态：**In Review**（待用户审查 Gate A · **未执行 Gate B 删除**）

## 2. 前置条件检查

| 条件 | 状态 |
|------|------|
| 003A merge 至 sprint | **未完成** — sprint @ `9ac6edf`，003A feature 领先 6 commits |
| 003A staging 验收 | sprint11 文档记「staging 阶段验收完成 2026-06-11」· 003A Story 仍 **In Progress** |
| 从 sprint 建 003B 分支 | **未采用** — 按指令在 003A 未 merge 时不从旧 sprint 切出；本分支基于 **003A feature tip** |
| Production 启动 | **未启动** |
| main merge | **未执行** |

## 3. 本轮目标（Gate A）

- 全仓 legacy / parallel / fallback 审计
- P0/P1/P2/P3 分类
- P0 删除清单与迁移/测试计划
- **不**批量删除代码

## 4. 已知历史问题总结（003A 暴露 → 003B 清理根因）

1. **UserSelectable 多轨：** file manifest + release1 publish + seed override + code_fallback 与 DB pool 并存
2. **lifecycle `user_selectable` vs `distribution.userSelectable`：** 双轨语义混淆
3. **Eligibility 重复：** `isEligibleForUserSelectablePool` 与 `evaluateUserSelectablePoolMembership` / SQL where 不一致
4. **Label 双轨：** manifest label / definitionJson.label vs `row.label`
5. **Cache：** 治理后需主动 invalidate（003A 已补多处 · 需统一 API 文档化）
6. **HTML paste 编号：** stale path + infer 阈值 + theme 只读 stored path（003A 已修 · Gate B 清旧 fallback 残留）
7. **Streaming 双轨：** SSE 用 `renderArticleBlocks`(registry) · done 后 `/preview` 用 DSL user renderer

## 5. Legacy inventory

见 [`docs/architecture/legacy-parallel-path-inventory.md`](../../architecture/legacy-parallel-path-inventory.md)

- **P0：** 10 项（LP-001 ~ LP-010）
- **P1：** 8 项（LP-101 ~ LP-108）
- **P2：** 7 项（LP-201 ~ LP-207）
- **P3：** 6 项（LP-301 ~ LP-306）

## 6. Gate B P0 删除清单（尚未执行）

| ID | 摘要 |
|----|------|
| LP-001 | `PREVIEW_HEADING_STYLE_OPTIONS` picker fallback |
| LP-002 | manifest `user-selectable-preview-pool` 退出 user runtime |
| LP-003 | degraded pool `source` 语义修正 |
| LP-004 | `buildCodeFallbackDslRuntime` html-paste 注入 |
| LP-005 | `getCodeBackedRuntimeAvailableVariantIds` picker fallback |
| LP-006 | manifest lifecycle `user_selectable` filter |
| LP-007 | Admin lifecycle filter/badge 清理 |
| LP-008 | SSE registry render vs DSL user render 收敛 |
| LP-009 | eligibility 统一至 `evaluateUserSelectablePoolMembership` |
| LP-010 | dead import 清理 |

## 7. P1/P2/P3 遗留清单

见 inventory 文档 §P1 / §P2 / §P3 · 含 DEBT-DSL-RC · PG enum 物理删除 · renderContract 迁移

## 8. 数据迁移计划

- **M-1（已备）：** `20260610120000_migrate_lifecycle_user_selectable.sql`
- **M-2~3（Gate B）：** 停写 `user_selectable` · Admin UI 清理
- **M-4（P1）：** PG enum 物理删除 — **003B 不强制**

## 9. 删除风险

| 风险 | 级别 | 缓解 |
|------|------|------|
| SSE 渲染收敛 | 高 | 保留 SSE 传输与 Nginx 配置 · 分步改 preview payload |
| renderContract 删除 | 高 | P1 defer · 仅清 user pool 旁路 |
| S9 测试大量 lifecycle 断言 | 中 | 测试 scope 改为 distribution-only |
| 本地无 DB 开发 | 中 | 明确 dev degraded 行为 · 文档 |
| PG enum DROP | 高 | 003B 仅逻辑退役 |

## 10. 测试计划（Gate B）

- 新增 `tests/architecture/legacy-path-guards.test.ts`（11 条约束见 inventory）
- 扩展现有：pool · promote · picker · inline number · streaming
- Gate A 执行：`lint` / `build` 未跑（仅文档变更）

## 11. 预计修改文件（Gate B）

| 区域 | 文件（预计） |
|------|----------------|
| User pool | `preview-user-selectable-pool.ts` · `preview-heading-style.ts` · `user-selectable-preview-pool.ts` · `user-preview-style-registry.ts` · `build-code-fallback-dsl-runtime.ts` · `render-article-preview-client.ts` · `user-selectable-variant-pool.ts` |
| Admin lifecycle | `style-library-admin-filters.ts` · `admin-display-labels.ts` · `style-library-admin-components.tsx` |
| Eligibility | `mappers.ts` · promote / distribution repo |
| Streaming | `render-streaming-preview.ts` · `run-generate-stream-flow.ts` |
| Tests | architecture guards + 改写 S9 lifecycle tests scope |
| Docs | bugs · changelog · sprint backlog Done 状态 |

## 12. 本轮修改文件（Gate A · 仅文档）

- `docs/architecture/legacy-parallel-path-inventory.md`（新增）
- `docs/agile/sprint11-production-ops-go-live.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `docs/agile/bugs.md`
- `docs/agile/execution-reports/2026-06-11-s11-story-003b-legacy-path-removal-gate-a.md`（本文件）

## 13. 新增文件

- `docs/architecture/legacy-parallel-path-inventory.md`
- `docs/agile/execution-reports/2026-06-11-s11-story-003b-legacy-path-removal-gate-a.md`

## 14. 未修改代码

Gate A **未删除/未重构** `src/**` · 符合「先 inventory 后删除」指令。

## 15. ECS / staging

Gate A **无部署**。Gate B 后步骤见 inventory §003A 已收敛项 + staging 验收清单（Story §八）。

## 16. staging 验收清单

Gate B 部署后执行（Story §八 · 12 项）— Gate A **未验收**。

## 17. 风险与 rollback

- Gate B 按 P0 逐项删除 · 每项 targeted test · 可 revert 单 commit
- 003A 未 merge：Gate B 前应先 merge 003A → sprint

## 18. 未完成事项

- [ ] 用户确认 Gate A inventory
- [ ] 003A merge 至 sprint（用户确认）
- [ ] Gate B 实施删除
- [ ] Architecture regression tests
- [ ] staging 003B 回归

## 19. commit hash

见本轮 commit（Gate A docs only）

## 20. 是否已 push

**未 push**

## 21. Production / main

**未启动 production · 未 merge main · Release 1 未关闭**
