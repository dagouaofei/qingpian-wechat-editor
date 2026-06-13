# Legacy / Parallel / Fallback Path Inventory

> **Story:** S11-STORY-003B · Legacy Path Removal & Parallel Implementation Audit  
> **Gate:** A（审计与计划 · 2026-06-11）  
> **Branch basis:** `feature/s11-story-003a-staging-volcengine-streaming-numbering` @ `75fecb9`（**003A 尚未 merge 至 sprint**）  
> **Production:** Pending · **main:** 不 merge

本文档为 Gate B 删除/隔离的唯一事实输入。每项含：ID、类别、symbol、历史用途、当前调用方、是否进入 staging/production runtime、替代实现、处置、删除风险、测试证据、目标 Sprint。

---

## 优先级定义

| 级别 | 含义 |
|------|------|
| **P0** | 仍可能污染用户主链路；003B Gate B 必须处理 |
| **P1** | 确认废弃但删除风险较高；建议后续专门 Story |
| **P2** | 有意保留的 compatibility / dev-only / release1 资产 |
| **P3** | 文档、命名、低风险清理 |

---

## P0 — Gate B 必须处理

### LP-001 · User picker 静态 fallback 链

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `PREVIEW_HEADING_STYLE_OPTIONS` · `resolvePreviewHeadingStyleOptions` L92 · `src/lib/preview-user-selectable-pool.ts` |
| **历史用途** | DB pool 不可用时 merge release1 publish + file manifest userSelectable |
| **当前调用方** | `/preview` `PreviewStyleControls`（当 pool 非 database 且无 server options） |
| **Staging/production runtime** | **是**（DB 异常路径） |
| **替代实现** | `buildUserSelectableHeadingOptionsFromPool` + fail closed 空列表 |
| **处置** | **删除** L88–92 fallback 至 `PREVIEW_HEADING_STYLE_OPTIONS` |
| **删除风险** | 低；003A 已覆盖 database/degraded 分支 |
| **测试证据** | `tests/lib/preview-user-selectable-pool.test.tsx` · Gate B 增 architecture test |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-002 · File manifest userSelectable 池

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `src/core/style-library/user-selectable-preview-pool.ts` · `PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS` · `src/lib/preview-heading-style.ts` |
| **历史用途** | S9 HTML paste apply patch 后 file-backed user_selectable 预览池 |
| **当前调用方** | `preview-heading-style.ts` 常量 · `user-preview-style-registry.ts` · `build-code-fallback-dsl-runtime.ts` |
| **Staging/production runtime** | **间接是**（registry / code_fallback DSL 注入 teal variant） |
| **替代实现** | DB `getUserSelectableVariantPool` + `distribution.userSelectable` |
| **处置** | **隔离** → dev/import/test only；**禁止** user runtime import；重命名去掉 `USER_SELECTABLE` 语义 |
| **删除风险** | 中（大量 S9 测试引用 lifecycle `user_selectable`） |
| **测试证据** | `tests/lib/user-selectable-preview-picker-007c.test.ts` 等需改写 scope |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-003 · Degraded pool 错误 source 标签

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `buildDegradedEmptyPool` · `source: "code_fallback"` · `src/server/style-admin/runtime/user-selectable-variant-pool.ts` L62–74 |
| **历史用途** | DB 不可用时语义上表示 code fallback |
| **当前调用方** | `getUserSelectableVariantPool` catch / no DATABASE_URL |
| **Staging/production runtime** | **是**（fail closed 已 empty，但 source 误导） |
| **替代实现** | `source: "db_unavailable"` 或 `"empty"`（与 `UserSelectableVariantPoolSnapshot` 对齐） |
| **处置** | **删除/修正** source 语义；确保无 consumer 把 degraded 当 code_fallback 渲染 |
| **删除风险** | 低 |
| **测试证据** | `tests/server/style-admin/runtime/user-selectable-variant-pool.test.ts` |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-004 · code_fallback DSL 注入 html-paste userSelectable

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable / DSL runtime |
| **Symbol / 文件** | `buildCodeFallbackDslRuntime` · `getUserSelectablePreviewVariantDefinition` · `src/lib/dsl-runtime/build-code-fallback-dsl-runtime.ts` |
| **历史用途** | 无 DB 时仍渲染 teal section label |
| **当前调用方** | `user-preview-render.ts` DEFAULT_CODE_FALLBACK_RUNTIME |
| **Staging/production runtime** | **staging 不应**（有 DATABASE_URL）；dev 可能 |
| **替代实现** | 空 DSL runtime + 明确 degraded 警告 |
| **处置** | **删除** html-paste 注入；保留 registry encode 仅用于非 user pool 场景 |
| **删除风险** | 中（本地无 DB 开发体验） |
| **测试证据** | `tests/server/style-admin/runtime/runtime-variant-dsl-pool.test.ts` |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-005 · Heading variant 解析 seed fallback

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `getCodeBackedRuntimeAvailableVariantIds` · `resolveRuntimeAvailableVariantId` · `src/lib/render-article-preview-client.ts` L108–116 |
| **历史用途** | pool 空时用 seed 列表解析 headingVariantId |
| **当前调用方** | `/preview` style control |
| **Staging/production runtime** | **是**（pool 为空时） |
| **替代实现** | 仅 `userSelectablePool.poolVariantIds` |
| **处置** | **删除** seed fallback on user path |
| **删除风险** | 低 |
| **测试证据** | Gate B architecture test |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-006 · Manifest lifecycle 过滤 user_selectable

| 字段 | 内容 |
|------|------|
| **类别** | lifecycle vs distribution |
| **Symbol / 文件** | `getUserSelectablePreviewVariantAssets` filter `lifecycle === "user_selectable"` · `user-selectable-preview-pool.ts` L16–23 |
| **历史用途** | file-backed 池 membership |
| **当前调用方** | LP-002 链 |
| **Staging/production runtime** | 不应（003A 后 DB 为主） |
| **替代实现** | `distribution.userSelectable` only |
| **处置** | **删除** lifecycle gate（模块隔离后整体退役） |
| **删除风险** | 低（与 LP-002 同批） |
| **测试证据** | S9 style-library tests |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-007 · Admin lifecycle filter 仍含 user_selectable

| 字段 | 内容 |
|------|------|
| **类别** | lifecycle vs distribution |
| **Symbol / 文件** | `style-library-admin-filters.ts` L24 · `LifecycleBadge` `user_selectable` 分支 · `admin-display-labels.ts` |
| **历史用途** | Admin 筛选「已 promote 可选」 |
| **当前调用方** | `/admin/style-library` |
| **Staging/production runtime** | **是**（UI 混淆） |
| **替代实现** | Distribution filter `userSelectable=true`；lifecycle 仅治理阶段 |
| **处置** | **删除** lifecycle filter 选项；badge 标 Legacy 或隐藏 |
| **删除风险** | 低（迁移 SQL 已备） |
| **测试证据** | admin view-model tests |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-008 · SSE 与 post-preview 双渲染轨

| 字段 | 内容 |
|------|------|
| **类别** | Streaming / Renderer 并行 |
| **Symbol / 文件** | `renderArticleBlocks` · `src/lib/render-streaming-preview.ts` · `src/server/generation/run-generate-stream-flow.ts` L161 |
| **历史用途** | 流式生成过程中 registry renderer 预览 |
| **当前调用方** | 首页 SSE · `preview-page-client` streaming phase |
| **Staging/production runtime** | **是** |
| **替代实现** | 流式阶段仅文本/结构；样式化 block 在 done 后 `renderUserPreviewArticleBlocks`；或 SSE 也走 DSL user renderer |
| **处置** | **隔离/收敛** — Gate B 需设计决策（不重写已通过验收的 SSE 传输层） |
| **删除风险** | **高**（003A 刚验打字机；勿误删 Nginx/SSE headers） |
| **测试证据** | 003A streaming 人工验收 · Gate B 增 parity test |
| **目标 Sprint** | S11-STORY-003B Gate B（分步） |

### LP-009 · 重复 eligibility：`isEligibleForUserSelectablePool` vs `evaluateUserSelectablePoolMembership`

| 字段 | 内容 |
|------|------|
| **类别** | Admin vs runtime eligibility |
| **Symbol / 文件** | `isEligibleForUserSelectablePool` · `src/server/style-admin/mappers.ts` L24 · promote / distribution repo |
| **历史用途** | 早期 pool SQL 后处理 |
| **当前调用方** | promote · distribution repository · **不含 quality gate** |
| **Staging/production runtime** | **是**（promote 验证与 pool mapper 可能不一致） |
| **替代实现** | `evaluateUserSelectablePoolMembership` / `buildUserSelectablePoolWhere` |
| **处置** | **删除** duplicate；admin filter 已对齐 SQL where（003A） |
| **删除风险** | 中 |
| **测试证据** | `tests/lib/user-selectable-pool-eligibility.test.ts` · admin query tests |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-010 · Unused import 残留（manifest pool）

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable |
| **Symbol / 文件** | `getUserSelectablePreviewVariantDefinition` import · `user-selectable-variant-pool.ts` L4 |
| **历史用途** | code_fallback 合并 static variants |
| **当前调用方** | **无**（003A 已移除合并逻辑） |
| **替代实现** | — |
| **处置** | **删除** dead import |
| **删除风险** | 无 |
| **测试证据** | lint |
| **目标 Sprint** | S11-STORY-003B Gate B |

---

## P1 — 后续专门清理（003B 登记 backlog）

### LP-101 · `user-preview-style-registry` manifest merge

| 字段 | 内容 |
|------|------|
| **类别** | UserSelectable |
| **Symbol** | `createUserPreviewStyleRegistry` · `getCodeBackedUserSelectableVariants` · `src/lib/user-preview-style-registry.ts` |
| **Runtime** | 当 `preferDatabaseVariants: false` |
| **处置** | **defer** — Gate B 强制 `preferDatabaseVariants: true` on `/preview` |
| **风险** | 中 |

### LP-102 · `renderBlock` registry 主链路（非 DSL）

| 字段 | 内容 |
|------|------|
| **类别** | Renderer 并行 |
| **Symbol** | `src/core/renderer/render-block.ts` |
| **Runtime** | SSE done payload · style-library inspection |
| **替代** | `renderUserPreviewBlock` / `renderDslBlock` |
| **处置** | **defer** — DEBT-DSL-RC · 与 LP-008 同批规划 |
| **风险** | 高 |

### LP-103 · `decodeRenderContract` html_paste 旁路

| 字段 | 内容 |
|------|------|
| **类别** | HTML paste / Renderer |
| **Symbol** | `isHtmlPasteCandidateDsl` · `src/core/dsl/decoder/decode-contract.ts` |
| **Runtime** | title_block_v1 contract 路径 |
| **替代** | `decodeTreeToOutput` fidelity tree |
| **处置** | **defer** · `docs/architecture/variant-dsl-legacy-render-contract-debt.md` |
| **风险** | 高 |

### LP-104 · Registry → DB import 桥

| 字段 | 内容 |
|------|------|
| **类别** | 数据权威双轨 |
| **Symbol** | `map-style-registry-variant-to-db.ts` · `collect-existing-style-variants` |
| **Runtime** | import CLI / 初始 seed |
| **处置** | **保留** 至全量 DB DSL；标记 non-runtime |
| **风险** | 低 |

### LP-105 · `defaultDistributionForLifecycle("user_selectable")`

| 字段 | 内容 |
|------|------|
| **类别** | lifecycle |
| **Symbol** | `src/server/style-admin/mappers.ts` |
| **Runtime** | import 默认值 |
| **处置** | **defer** — 改为 `paste_qa_pass` + explicit distribution |
| **风险** | 中 |

### LP-106 · PostgreSQL enum `user_selectable` 物理删除

| 字段 | 内容 |
|------|------|
| **类别** | Schema / migration |
| **Symbol** | `StyleVariantLifecycle` enum · Prisma |
| **Runtime** | 只读历史行（迁移 SQL 已写） |
| **处置** | **defer** — 标为 DB legacy enum value；Gate B 完成无写入/无查询依赖后再评估 DROP |
| **风险** | **高**（PG enum 缩值需专用 migration + rollback） |
| **迁移计划** | 见 §数据迁移计划 |

### LP-107 · `cacheVersion` DB increment 未接 runtime

| 字段 | 内容 |
|------|------|
| **类别** | Cache |
| **Symbol** | `style-variant-distribution-repository.ts` |
| **Runtime** | 否 |
| **处置** | **defer** 或删除无效字段 |
| **风险** | 低 |

### LP-108 · `definitionJson.label` vs `row.label`

| 字段 | 内容 |
|------|------|
| **类别** | Canonical label |
| **Symbol** | pool mapper 已用 `row.label`（003A） |
| **Runtime** | admin 列表 · picker 已 canonical |
| **处置** | **defer** — 审计 admin UI 是否仍读 definitionJson.label |
| **风险** | 低 |

---

## P2 — 有意保留（compatibility / dev-only）

### LP-201 · Gallery release1 publish pool

| 字段 | 内容 |
|------|------|
| **Symbol** | `PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS` · `includeUserSelectableHeadingOptions={false}` |
| **保留原因** | Gallery 展示 release1 静态 heading，**非** userSelectable 分发 |
| **边界** | 不得被 `/preview` user picker import |

### LP-202 · Registry variants / heading publish pool

| 字段 | 内容 |
|------|------|
| **Symbol** | `src/core/styles/variants/*` · `HEADING_PUBLISH_VARIANT_IDS` |
| **保留原因** | Release1 renderer · generation · Gallery |
| **边界** | 不得决定 userSelectable 可见性 |

### LP-203 · `/dev/style-library` file manifest workbench

| 字段 | 内容 |
|------|------|
| **Symbol** | `src/app/dev/style-library/*` |
| **保留原因** | HTML paste 提案 · import 前 inspection |
| **边界** | `isDevApiEnabled` · 非 production admin |

### LP-204 · `deterministicGenerationStreamProvider` (test provider)

| 字段 | 内容 |
|------|------|
| **Symbol** | `src/core/generation/test-provider.ts` |
| **保留原因** | vitest · 本地无 API key |
| **边界** | `/preview` 已 `requireRealProvider: true` |

### LP-205 · Fidelity tree encode/decode（003A 正确路径）

| 字段 | 内容 |
|------|------|
| **Symbol** | `resolveEffectiveSemanticBindings` · `fidelity-tree-substitution.ts` · `fidelity-tree-theme-tokens.ts` |
| **保留原因** | 唯一 HTML paste 编号/主题共享链路 |
| **边界** | 不得再增 runtimeVariantId 特判 |

### LP-206 · Nginx SSE buffering 配置

| 字段 | 内容 |
|------|------|
| **Symbol** | `deploy/nginx/staging.conf.example` |
| **保留原因** | 003A 打字机验收依赖 |
| **边界** | 部署配置，非代码删除对象 |

### LP-207 · `buildRuntimeVariantPoolWhere` vs `buildUserSelectablePoolWhere`

| 字段 | 内容 |
|------|------|
| **保留原因** | runtime DSL pool ⊃ user pool（含 release1_required 治理用 variant） |
| **边界** | 文档化 contract；user pool 不得 widen |

---

## P3 — 文档 / 命名 / 低风险

### LP-301 · `LEGACY_PRESET_ID_ALIASES` (`classic-news` → `business`)

### LP-302 · `LEGACY_SOURCE_TYPES` in seed config

### LP-303 · `docs/architecture/style-library-storage.md` file-backed 叙述

### LP-304 · Style library lifecycle 单元测试仍断言 `user_selectable` transitions

### LP-305 · `generationModeSchema: "batch" | "stream"` 类型无 active batch 路径

### LP-306 · Duplicate dev/admin promote view-models

---

## 003A 已收敛项（Gate B 勿重复删除）

以下在 `feature/s11-story-003a` @ `6fc8b46` 已修复，inventory 仅作 baseline：

| 项 | 003A 状态 |
|----|-----------|
| DB pool + static publish merge | **已移除**（`resolvePreviewHeadingStyleOptions`） |
| teal seed `userSelectable: true` override | **已改 false** |
| degraded pool 注入 manifest variants | **已改 empty** |
| admin `userSelectable=true` filter quality gate | **已对齐** |
| Promote lifecycle → `paste_qa_pass` | **已改** |
| inline number infer + theme effective bindings | **已改** |
| lifecycle 数据迁移 SQL | **已添加**（待 staging `db:migrate:deploy`） |

---

## Gate B P0 删除清单（摘要）

| ID | 动作 |
|----|------|
| LP-001 | 删除 `PREVIEW_HEADING_STYLE_OPTIONS` picker fallback |
| LP-002 | 隔离/重命名 manifest userSelectable 模块 |
| LP-003 | 修正 degraded `source` 语义 |
| LP-004 | 移除 code_fallback html-paste 注入 |
| LP-005 | 移除 heading variant seed fallback |
| LP-006 | 移除 manifest lifecycle gate |
| LP-007 | Admin lifecycle UI 清理 |
| LP-008 | SSE/DSL 渲染收敛（分步，保留 SSE 传输） |
| LP-009 | 统一 eligibility contract |
| LP-010 | 删除 dead import |

**预计 Gate B 净删除：** ~400–800 LOC（不含测试改写）· **Gate A 未删代码**

---

## 数据迁移计划

| 步骤 | 内容 | Gate |
|------|------|------|
| M-1 | `20260610120000_migrate_lifecycle_user_selectable` — `lifecycle` 行 → `paste_qa_pass` | 003A 已备 · staging deploy |
| M-2 | 确认无代码再 **写入** `lifecycle=user_selectable` | Gate B |
| M-3 | Admin UI 移除 lifecycle `user_selectable` 筛选 | Gate B |
| M-4 | 评估 PG enum DROP VALUE（**不强制** 003B） | P1 backlog |
| M-5 | 不自动修改 `distribution.userSelectable` | 契约 |

**Enum 物理删除风险：** PostgreSQL 不能直接 DROP enum value；需新 enum + column swap + 回滚脚本。建议 **003B 仅逻辑退役**，物理清理单独 Story。

---

## Architecture 测试计划（Gate B）

新增 `tests/architecture/legacy-path-guards.test.ts`（或扩展现有 audit tests）：

1. `/preview` runtime 不得 import `PREVIEW_USER_SELECTABLE_*` / manifest pool
2. DB `source=database` 时 picker 不得 merge publish pool
3. degraded 返回 empty · 非 static merge
4. lifecycle 不参与 `evaluateUserSelectablePoolMembership`
5. Promote 不写 `user_selectable`
6. Admin list filter 与 `buildUserSelectablePoolWhere` 同源
7. Picker label 来自 `row.label` / pool variant label
8. HTML paste 编号走 shared substitution（已有 targeted tests 扩展）
9. `requireRealProvider` on production-like preview path
10. 无 GET admin mutation routes

---

## 前置阻塞：003A merge

```text
sprint/s11-production-ops-go-live @ 9ac6edf
feature/s11-story-003a @ 75fecb9  (+6 commits 未 merge)
```

**Gate B 开始前必须：** 003A staging 验收确认 + merge feature → sprint（用户确认）。

本 Gate A 分支基于 **003A feature tip**，以便 inventory 反映最新修复。
