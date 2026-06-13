# Legacy / Parallel / Fallback Path Inventory

> **Story:** S11-STORY-003B · Legacy Path Removal & Parallel Implementation Audit  
> **Gate B P0：** **Done**（staging 2026-06-11 · LP-001～007、LP-009、LP-010 已删除/隔离）  
> **LP-008 / P1/P2/P3：** backlog · 未批量删除  
> **Branch basis:** `sprint/s11-production-ops-go-live` @ `8da62e9`（003B `--no-ff` merge）· 003A merge `2ee03c5` · closeout `381e146`  
> **Production:** Pending · **main:** 不 merge

本文档为 Gate B 删除/隔离的唯一事实输入。

**每项必填字段：** ID · 类别 · Symbol/文件/路由 · 历史用途 · 当前调用方 · Staging/Production runtime 影响 · 替代实现 · 处置 · 删除风险 · 删除证据 · 测试计划 · 目标 Sprint

---

## 优先级与 Gate B 范围（2026-06-11 用户裁定）

| 级别 | Gate B |
|------|--------|
| **P0** | LP-001～007、LP-009、LP-010 — **Done**（Gate B 2026-06-11 · staging 验收 PASS） |
| **P1** | 含 **LP-008**（SSE 双渲染轨）— **默认不纳入 003B**；仅当证明污染 production-like 主链路且可小范围删除时重新申请 |
| **P2/P3** | backlog · 不批量删除 |

---

## 分支基线（003B 重建记录）

| 步骤 | 操作 |
|------|------|
| 1 | `003A` `--no-ff` merge → `sprint/s11-production-ops-go-live` @ `2ee03c5` · closeout `381e146` |
| 2 | `refactor/s11-story-003b-legacy-path-removal`：`git reset --hard sprint` + cherry-pick Gate A docs |
| 3 | Gate B merge → sprint **`8da62e9`**（`--no-ff` · closeout `a21c1f1`） |
| **未采用** | 保留 003B 以未 merge 的 003A feature tip 为独立基线 |
| **未采用** | rebase 003B  onto sprint（等价于 reset + cherry-pick，更清晰保留仅 docs 提交） |

---

## P0 — Gate B 已完成项（LP-008 除外 · backlog）

### LP-001 · User picker 静态 fallback 链

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已删除 |
| **ID** | LP-001 |
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `PREVIEW_HEADING_STYLE_OPTIONS` · `resolvePreviewHeadingStyleOptions()` 最终 fallback · `src/lib/preview-user-selectable-pool.ts` L88–92 |
| **历史用途** | DB pool 不可用或无 server options 时，合并 release1 publish + file manifest `PREVIEW_USER_SELECTABLE_*` |
| **当前调用方** | `src/components/preview/preview-style-controls.tsx` → `resolvePreviewHeadingStyleOptions` · `tests/lib/preview-user-selectable-pool.test.tsx` |
| **Runtime 影响** | **Staging/Prod 是** — 仅当 `userSelectablePool.source` ≠ `database` 且无 `userSelectableHeadingOptions` 时触发；003A 已覆盖 database/degraded 分支，此为**最后静默降级口** |
| **替代实现** | 返回 `[]`（fail closed）+ optional degraded notice；「跟随生成结果」由 UI 层保留 |
| **处置** | **删除** L92 `return PREVIEW_HEADING_STYLE_OPTIONS` |
| **删除风险** | 低 |
| **删除证据** | 003A `resolvePreviewHeadingStyleOptions` 已拒绝 publish+DB merge；grep 仅 `preview-user-selectable-pool.ts` + S9 测试引用静态常量 |
| **测试计划** | 扩 `preview-user-selectable-pool.test.tsx` degraded/empty → `[]` · architecture guard 禁止 import merge |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-002 · File manifest userSelectable 池

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已隔离（`style-library-manifest-preview-fixtures.ts` · dev/test only） |
| **ID** | LP-002 |
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `src/core/style-library/user-selectable-preview-pool.ts` · `PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS` · `src/lib/preview-heading-style.ts` |
| **历史用途** | S9 file-backed manifest 标记 `lifecycle=user_selectable` 的 HTML paste asset 进入用户预览池 |
| **当前调用方** | `preview-heading-style.ts`（常量） · `user-preview-style-registry.ts` · `build-code-fallback-dsl-runtime.ts` · `src/core/style-library/index.ts` re-export · S9 tests |
| **Runtime 影响** | **间接是** — 经 LP-001/LP-004 链进入 user path；003A DB 主路径不再读 manifest 入 picker |
| **替代实现** | DB `getUserSelectableVariantPool` + `distribution.userSelectable` + `evaluateUserSelectablePoolMembership` |
| **处置** | **隔离** → 重命名为 `style-library-manifest-preview-fixtures.ts` 或限 dev/test import；禁止 `/preview` runtime import |
| **删除风险** | 中 — S9 e2e/audit 测试依赖 |
| **删除证据** | `/preview/page.tsx` 仅 `getUserSelectableVariantPool`；003A 移除 seed merge |
| **测试计划** | 改写 `user-selectable-preview-picker-007c.test.ts` scope → dev manifest · architecture test 禁止 `user-preview-render` import |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-003 · Degraded pool 错误 source 标签

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已修正（`db_unavailable`） |
| **ID** | LP-003 |
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `buildDegradedEmptyPool()` · `source: "code_fallback"` · `src/server/style-admin/runtime/user-selectable-variant-pool.ts` L62–74 |
| **历史用途** | DB 异常时语义上表示「code fallback pool」 |
| **当前调用方** | `getUserSelectableVariantPool()` — `!DATABASE_URL` · catch 分支 |
| **Runtime 影响** | **Staging/Prod 是** — variants 已 empty（003A），但 `source` 误导 consumer 区分 degraded vs code_fallback |
| **替代实现** | `UserSelectableVariantPoolSnapshot.source = "db_unavailable"`（类型已存在于 client 分支 L84） |
| **处置** | **修正** source 字段；审计所有 `source === "code_fallback"` 分支 |
| **删除风险** | 低 |
| **删除证据** | `preview-user-selectable-pool.ts` L84–85 已单独处理 code_fallback/db_unavailable；server 不应再 emit code_fallback for empty pool |
| **测试计划** | 更新 `user-selectable-variant-pool.test.ts` expect `db_unavailable` · architecture guard |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-004 · code_fallback DSL 注入 html-paste manifest variant

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已删除 |
| **ID** | LP-004 |
| **类别** | UserSelectable / DSL runtime |
| **Symbol / 文件** | `buildCodeFallbackDslRuntime()` · `getUserSelectablePreviewVariantDefinition(USER_SELECTABLE_HTML_PASTE_HEADING_ID)` · `src/lib/dsl-runtime/build-code-fallback-dsl-runtime.ts` |
| **历史用途** | 无 DATABASE_URL 时注入 teal html-paste variant DSL |
| **当前调用方** | `user-preview-render.ts` `DEFAULT_CODE_FALLBACK_RUNTIME` · `runtime-variant-dsl-pool.ts` `buildCodeFallbackRuntimeResult` |
| **Runtime 影响** | **Staging 不应**（有 RDS）；**本地 dev 可能** — 无 DB 时 user preview 仍可能渲染 manifest variant |
| **替代实现** | 空 `definitionJsonByVariantId` + `source: "code_fallback"` notice；registry-only encode 限非 user pool |
| **处置** | **删除** html-paste 注入块 |
| **删除风险** | 中 — 本地无 DB 体验 |
| **删除证据** | staging `getRuntimeVariantDslPool` 走 database；003A 要求 user pool DB-only |
| **测试计划** | `runtime-variant-dsl-pool.test.ts` · `user-preview-render` degraded 无 teal 注入 |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-005 · Heading variant 解析 seed fallback

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已删除 |
| **ID** | LP-005 |
| **类别** | UserSelectable 多套分发 |
| **Symbol / 文件** | `getCodeBackedRuntimeAvailableVariantIds()` · `resolveRuntimeAvailableVariantId()` · `src/lib/render-article-preview-client.ts` L108–116 |
| **历史用途** | `userSelectablePool.poolVariantIds` 空时用 release1 seed set 解析 picker 选择 |
| **当前调用方** | `renderArticlePreviewClient()` · `runtime-variant-availability.ts` · `runtime-variant-seed-config.ts` · tests |
| **Runtime 影响** | **Staging/Prod 是** — pool 空或 id 不在 pool 时 fallback 到 seed |
| **替代实现** | 仅 `poolSnapshot.poolVariantIds`；无效 id → 保持生成结果或 first pool entry |
| **处置** | **删除** user preview path 的 seed fallback |
| **删除风险** | 低 |
| **删除证据** | 003A AC：picker 与 admin userSelectable 一致；seed 列表 ≠ DB pool |
| **测试计划** | architecture guard · preview client test pool-only resolution |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-006 · Manifest lifecycle 过滤 user_selectable

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已删除 lifecycle gate（distribution-only） |
| **ID** | LP-006 |
| **类别** | lifecycle vs distribution |
| **Symbol / 文件** | `getUserSelectablePreviewVariantAssets()` filter `lifecycle === "user_selectable"` · `user-selectable-preview-pool.ts` L16–23 |
| **历史用途** | File manifest 池 membership 由 lifecycle 决定 |
| **当前调用方** | LP-002 链 · `STYLE_LIBRARY_MANIFEST` assets |
| **Runtime 影响** | **否**（DB 主路径）· **是**（manifest/code_fallback 链） |
| **替代实现** | 删除 lifecycle 条件；若保留 manifest 仅用 `distribution.userSelectable` metadata |
| **处置** | 随 LP-002 **隔离/删除** lifecycle gate |
| **删除风险** | 低（与 LP-002 同批） |
| **删除证据** | `evaluateUserSelectablePoolMembership` 明确 lifecycle 不授予可见性 |
| **测试计划** | manifest unit tests 改 distribution-only |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-007 · Admin lifecycle filter / badge user_selectable

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · lifecycle filter 选项已移除 |
| **ID** | LP-007 |
| **类别** | lifecycle vs distribution |
| **Symbol / 文件** | `LIFECYCLE_FILTER_OPTIONS` · `style-library-admin-filters.ts` · `LifecycleBadge` · `admin-display-labels.ts` `user_selectable: "Legacy (migrating)"` |
| **历史用途** | Admin 按 lifecycle「User Selectable」筛选 |
| **当前调用方** | `/admin/style-library` shell · filters · components · view-model tests |
| **Runtime 影响** | **Admin UI 是** — 混淆 lifecycle 与 distribution.userSelectable |
| **替代实现** | Distribution 区 filter `userSelectable` · Lifecycle 仅 candidate/paste_qa_pass/… |
| **处置** | **删除** lifecycle filter 选项 · badge 仅只读历史行或隐藏 |
| **删除风险** | 低 |
| **删除证据** | 003A Promote → `paste_qa_pass` · migration SQL M-1 |
| **测试计划** | `style-library-admin-view-model.test.ts` · 无 lifecycle user_selectable filter option |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-009 · 重复 eligibility 实现

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · mappers 已委托 `isUserSelectablePoolMember` |
| **ID** | LP-009 |
| **类别** | Admin vs runtime eligibility |
| **Symbol / 文件** | `isEligibleForUserSelectablePool()` · `src/server/style-admin/mappers.ts` L24 · vs `evaluateUserSelectablePoolMembership()` · `user-selectable-pool-eligibility.ts` |
| **历史用途** | Promote / distribution repo 后置过滤 |
| **当前调用方** | `promote-candidate-to-user-selectable.ts` · `style-variant-distribution-repository.ts` · harvest tests · **不含** quality gate / definitionJson gate |
| **Runtime 影响** | **是** — promote 成功提示与 runtime pool 可能不一致 |
| **替代实现** | 共享 `evaluateUserSelectablePoolMembership` 或 thin wrapper；SQL 用 `buildUserSelectablePoolWhere` |
| **处置** | **删除** duplicate · mappers 委托 eligibility 模块 |
| **删除风险** | 中 — 多测试文件 import mappers helper |
| **删除证据** | 003A admin query 已用 `buildUserSelectablePoolWhere`；mapper 已用 `evaluateUserSelectablePoolMembership` |
| **测试计划** | `user-selectable-pool-eligibility.test.ts` · promote test poolEligible 与 mapper 一致 |
| **目标 Sprint** | S11-STORY-003B Gate B |

### LP-010 · Dead import manifest pool in server loader

| 字段 | 内容 |
|------|------|
| **Gate B 状态** | **Done** · 已删除 dead import |
| **ID** | LP-010 |
| **类别** | UserSelectable 清理 |
| **Symbol / 文件** | `import { getUserSelectablePreviewVariantDefinition }` · `user-selectable-variant-pool.ts` L4（未使用） |
| **历史用途** | 003A 前 code_fallback 合并 static variants |
| **当前调用方** | **无** |
| **Runtime 影响** | **否** |
| **替代实现** | — |
| **处置** | **删除** import |
| **删除风险** | 无 |
| **删除证据** | grep 文件内无 symbol 使用 · lint unused |
| **测试计划** | `pnpm lint` |
| **目标 Sprint** | S11-STORY-003B Gate B |

---

## P1 — 后续 Story / 003B 不默认处理

### LP-008 · SSE registry render vs DSL user render（**用户降级为 P1**）

| 字段 | 内容 |
|------|------|
| **ID** | LP-008 |
| **类别** | Streaming / Renderer 并行 |
| **Symbol / 文件** | `renderArticleBlocks()` · `renderBlock()` · `src/lib/render-streaming-preview.ts` · `src/server/generation/run-generate-stream-flow.ts` L161 · `src/app/preview/preview-page-client.tsx` |
| **历史用途** | SSE 流式阶段用 registry renderer 增量展示 styled blocks |
| **当前调用方** | 首页 generate stream · preview streaming phase · `tests/lib/render-streaming-preview.test.ts` |
| **Runtime 影响** | **Staging/Prod 是** — 流式阶段与 done 后 `renderUserPreviewArticleBlocks`（DSL）可能视觉不一致 |
| **污染主链路？** | **部分** — 003A 已验收打字机/SSE 传输；问题在**渲染轨双轨**非 SSE 本身。**不满足**「小范围删除即可解决」— 需设计 streaming 是否仅文本或延迟 styled render |
| **替代实现** | 流式仅 markdown/结构；done 后统一 DSL user render；或 SSE payload 去 styled blocks |
| **处置** | **defer** → 独立 Story（建议 S11-STORY-003C 或 S12）· **禁止** Gate B 重写 SSE 主链路 |
| **删除风险** | **高** — 003A Nginx/`X-Accel-Buffering` 依赖 |
| **删除证据** | 需 Gate B 前 parity 度量报告（非本 Gate A 范围） |
| **测试计划** | 后续：streaming vs post-done HTML diff test |
| **重新纳入条件** | 证明污染 production-like 路径 + 可 <200 LOC 删除且无 SSE 回归 |
| **目标 Sprint** | **P1 backlog** |

### LP-101 · user-preview-style-registry manifest merge

| 字段 | 内容 |
|------|------|
| **ID** | LP-101 |
| **类别** | UserSelectable |
| **Symbol** | `createUserPreviewStyleRegistry` · `getCodeBackedUserSelectableVariants` · `src/lib/user-preview-style-registry.ts` |
| **历史用途** | DB variants 与 manifest variants 合并 registry |
| **当前调用方** | `render-article-preview-client.ts` when `preferDatabaseVariants: false` |
| **Runtime 影响** | **否** on `/preview`（`preferDatabaseVariants: true`） |
| **替代实现** | DB-only registry |
| **处置** | **defer** · Gate B 可 hardcode prefer true |
| **删除风险** | 中 |
| **删除证据** | `render-article-preview-client.ts` L86–88 |
| **测试计划** | preview client test |
| **目标 Sprint** | P1 |

### LP-102 · renderBlock registry 主链路

| 字段 | 内容 |
|------|------|
| **ID** | LP-102 |
| **Symbol** | `src/core/renderer/render-block.ts` |
| **历史用途** | Release1 registry 渲染 |
| **当前调用方** | LP-008 SSE · style-library inspection · generation done payload |
| **Runtime 影响** | 见 LP-008 |
| **替代实现** | `renderDslBlock` / DEBT-DSL-RC migration |
| **处置** | **defer** |
| **删除风险** | 高 |
| **测试计划** | DEBT-DSL-RC checklist |
| **目标 Sprint** | P1 |

### LP-103 · decodeRenderContract html_paste 旁路

| 字段 | 内容 |
|------|------|
| **ID** | LP-103 |
| **Symbol** | `decodeRenderContract` · `isHtmlPasteCandidateDsl` · `decode-contract.ts` |
| **调用方** | `decode-variant-dsl.ts` when no tree |
| **Runtime 影响** | contract-path html_paste variants |
| **替代** | tree-only fidelity |
| **处置** | defer · `variant-dsl-legacy-render-contract-debt.md` |
| **测试计划** | fidelity tree tests |
| **目标 Sprint** | P1 |

### LP-104 · Registry → DB import 桥

| 字段 | 内容 |
|------|------|
| **ID** | LP-104 |
| **Symbol** | `map-style-registry-variant-to-db.ts` · import CLI |
| **Runtime 影响** | **否** runtime · import only |
| **处置** | **保留** 至全量 DB |
| **测试计划** | import integration tests |
| **目标 Sprint** | P1 |

### LP-105 · defaultDistributionForLifecycle(user_selectable)

| 字段 | 内容 |
|------|------|
| **ID** | LP-105 |
| **Symbol** | `defaultDistributionForLifecycle` · `mappers.ts` |
| **调用方** | import / create variant |
| **Runtime 影响** | 新行默认值 · 非 runtime visibility |
| **处置** | defer → `paste_qa_pass` + explicit distribution |
| **测试计划** | mappers.test.ts |
| **目标 Sprint** | P1 |

### LP-106 · PG enum user_selectable 物理删除

| 字段 | 内容 |
|------|------|
| **ID** | LP-106 |
| **Symbol** | Prisma `StyleVariantLifecycle.user_selectable` |
| **Runtime 影响** | 历史行只读；M-1 迁移 SQL 已备 |
| **处置** | **defer** 物理 DROP · 003B 逻辑退役 |
| **删除风险** | 高 |
| **测试计划** | migration dry-run on staging |
| **目标 Sprint** | P1 |

### LP-107 · cacheVersion DB increment 未接 runtime

| 字段 | 内容 |
|------|------|
| **ID** | LP-107 |
| **Symbol** | `style-variant-distribution-repository.ts` |
| **Runtime 影响** | **否** |
| **处置** | defer |
| **测试计划** | — |
| **目标 Sprint** | P1 |

### LP-108 · definitionJson.label vs row.label

| 字段 | 内容 |
|------|------|
| **ID** | LP-108 |
| **Symbol** | pool mapper `row.label`（003A canonical） |
| **Runtime 影响** | picker/admin 已 canonical · 审计 admin detail 是否仍显示 definitionJson.label |
| **处置** | defer audit |
| **测试计划** | admin view-model label assertions |
| **目标 Sprint** | P1 |

---

## P2 — 有意保留

### LP-201 · Gallery release1 publish pool

| 字段 | 内容 |
|------|------|
| **Symbol** | `PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS` · `gallery-page-client.tsx` `includeUserSelectableHeadingOptions={false}` |
| **保留原因** | Gallery 展示 release1 静态 heading · **非** userSelectable 分发 |
| **Runtime 影响** | Gallery only |
| **边界** | architecture test：`/preview` 不得 import publish pool for picker |
| **测试计划** | existing gallery tests |

### LP-202 · Registry variants / HEADING_PUBLISH_VARIANT_IDS

| 字段 | 内容 |
|------|------|
| **保留原因** | Generation · Gallery · release1 renderer assets |
| **边界** | 不得决定 userSelectable |
| **测试计划** | `runtime-variant-availability.test.ts` scope |

### LP-203 · /dev/style-library

| 字段 | 内容 |
|------|------|
| **Symbol** | `src/app/dev/style-library/*` |
| **保留原因** | HTML paste 提案 · manifest workbench |
| **边界** | `isDevApiEnabled` |
| **测试计划** | dev route tests |

### LP-204 · deterministicGenerationStreamProvider

| 字段 | 内容 |
|------|------|
| **Symbol** | `src/core/generation/test-provider.ts` |
| **保留原因** | vitest / 无 API key |
| **边界** | `/preview` `requireRealProvider: true` |
| **测试计划** | generate stream tests |

### LP-205 · Fidelity tree shared path（003A）

| 字段 | 内容 |
|------|------|
| **Symbol** | `resolveEffectiveSemanticBindings` · substitution · theme tokens |
| **保留原因** | 唯一 HTML paste 编号/主题 Preview+Copy 链路 |
| **测试计划** | `html-paste-inline-number-ordinal-theme.test.ts` |

### LP-206 · Nginx SSE buffering

| 字段 | 内容 |
|------|------|
| **Symbol** | `deploy/nginx/staging.conf.example` · `stream-sse.ts` headers |
| **保留原因** | 003A 打字机验收 |
| **边界** | 部署配置 · Gate B 勿删 |

### LP-207 · buildRuntimeVariantPoolWhere vs buildUserSelectablePoolWhere

| 字段 | 内容 |
|------|------|
| **保留原因** | Runtime DSL pool ⊃ user pool |
| **边界** | 文档化；user pool 不得 widen |
| **测试计划** | pool mapper tests |

---

## P3 — 文档 / 命名 / 低风险

### LP-301 · LEGACY_PRESET_ID_ALIASES

| **Symbol** | `src/config/miaopian-preset-bundles.ts` |
| **处置** | keep alias |
| **测试** | input normalize tests |

### LP-302 · LEGACY_SOURCE_TYPES

| **Symbol** | `runtime-variant-seed-config.ts` |
| **处置** | keep import guard |
| **测试** | import tests |

### LP-303 · style-library-storage.md file-backed 叙述

| **处置** | 标记 superseded by DB admin |

### LP-304 · lifecycle 单测仍断言 user_selectable transitions

| **Symbol** | `style-library-lifecycle.test.ts` |
| **处置** | defer 更新为 paste_qa_pass 模型 |

### LP-305 · generationModeSchema batch

| **处置** | keep type · 无 active batch path |

### LP-306 · duplicate dev/admin promote view-models

| **处置** | defer consolidate |

---

## 003A 已 merge sprint — 勿重复删除

| 项 | 状态 |
|----|------|
| `--no-ff` merge | **`2ee03c5`** |
| closeout docs | **`381e146`** |
| DB pool + static publish merge | 已移除 |
| teal seed userSelectable override | 已改 false |
| degraded empty pool（无 manifest 注入） | 已改 |
| admin userSelectable filter + quality gate | 已对齐 |
| Promote → paste_qa_pass | 已改 |
| inline number infer + theme effective bindings | 已改 |
| lifecycle 迁移 SQL | 已添加 |

---

## Gate B P0 删除清单（**Done** · 2026-06-11）

| LP | 状态 |
|----|------|
| LP-001 | **Done** · 已删除 |
| LP-002 | **Done** · 已隔离 |
| LP-003 | **Done** · 已修正 |
| LP-004 | **Done** · 已删除 |
| LP-005 | **Done** · 已删除 |
| LP-006 | **Done** · 已删除 lifecycle gate |
| LP-007 | **Done** · admin filter 已移除 |
| LP-009 | **Done** · eligibility 已统一 |
| LP-010 | **Done** · dead import 已删除 |

**排除（backlog）：** LP-008（P1 · 独立 Story）· P1/P2/P3 见上文

**实际净变化：** Gate B `src/` 约 −45 LOC runtime fallback（含 fixtures 隔离 · 不含 LP-008）

---

## 数据迁移计划

| 步骤 | 内容 | 状态 |
|------|------|------|
| M-1 | `20260610120000_migrate_lifecycle_user_selectable` | SQL 在 sprint · staging 需 `db:migrate:deploy` |
| M-2 | 停写 lifecycle=user_selectable | **Done**（Promote → `paste_qa_pass`） |
| M-3 | Admin UI 移除 lifecycle filter | **Done**（Gate B · LP-007） |
| M-4 | PG enum 物理删除 | P1 · LP-106 |
| M-5 | 不自动改 distribution.userSelectable | 契约 |

---

## Architecture 测试计划（Gate B · **Done**）

`tests/architecture/legacy-path-guards.test.ts` — **12/12 PASS**（merge 后 sprint）

1. `/preview` user path 不 import `PREVIEW_USER_SELECTABLE_*` / manifest pool
2. DB source=database 不 merge publish pool
3. degraded → empty · source ≠ misleading code_fallback
4. lifecycle 不参与 `evaluateUserSelectablePoolMembership`
5. Promote 不写 user_selectable
6. Admin filter 与 `buildUserSelectablePoolWhere` 同源
7. Picker label 来自 pool variant / row.label
8. HTML paste 编号 shared substitution（扩展现有 tests）
9. requireRealProvider on preview generate path
10. 无 GET admin mutation

**不含 LP-008 streaming parity**（P1 Story）

---

## Merge 记录

### 003A → sprint

| 项 | Commit |
|----|--------|
| `--no-ff` merge | **`2ee03c5`** |
| closeout docs | **`381e146`** |

**Staging 验收：** 003A **Done**（2026-06-11）

### 003B → sprint

| 项 | Commit |
|----|--------|
| closeout docs | **`a21c1f1`** |
| **`--no-ff` merge** | **`8da62e9`** |

**Staging 验收：** 003B **Done**（2026-06-11 · LP-001～007、LP-009、LP-010）· LP-008 / P1/P2/P3 **backlog**
