# Execution Report：S11-STORY-003A Staging Volcengine + streaming + numbering

## 1. 基本信息

- 日期：2026-06-10
- 当前分支：`feature/s11-story-003a-staging-volcengine-streaming-numbering`
- 来源分支：`sprint/s11-production-ops-go-live`
- 目标合并分支：`sprint/s11-production-ops-go-live`
- Sprint：Sprint 11
- 关联 Story / Bug / Decision：S11-STORY-003A · BUG-S11-STAGING-001 · BUG-S11-STAGING-002 · DECISION-111
- 执行者：Cursor
- 状态：**Done**（staging 验收 2026-06-11 · merge sprint `2ee03c5` `--no-ff` · 用户确认关闭）

## 2. 本轮目标

启动 S11-STORY-003A：补齐 staging Volcengine 文档与 env 指引；修复 staging SSE 打字机回归；修复 HTML variant 章节编号回归；增加 regression tests。

## 3. 执行范围

**做了：**

- 新增 S11-STORY-003A 至 sprint backlog / plan / changelog / bugs
- SSE 响应头 `X-Accel-Buffering: no` + Nginx `/api/generate/stream` `proxy_buffering off` 示例
- DSL numbering：`semanticBindings.number` stale path 校验 + infer fallback
- user preview 传递 `variantSourceMeta` 至 `renderDslBlock`
- Volcengine env 变量名文档（无 secret）
- targeted tests + lint + build

**没做：**

- ECS 上实际配置 Volcengine env（需用户/运维）
- ECS Nginx reload（需用户/运维）
- staging 首页生成 E2E 人工验收
- production 部署 · merge main · Release 1 关闭
- `wechat-paste-qa-pack` 既有 2 failures

## 4. 修改文件

- `src/app/api/generate/stream/route.ts`
- `src/server/generation/stream-sse.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/lib/user-preview-render.ts`
- `deploy/nginx/staging.conf.example`
- `deploy/nginx/production.conf.example`
- `docs/agile/sprint11-production-ops-go-live.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `docs/agile/bugs.md`
- `docs/ops/environment-variables.md`
- `docs/ops/environments/staging.md`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`

## 5. 新增文件

- `tests/server/generation/generate-stream-sse-headers.test.ts`
- `docs/agile/execution-reports/2026-06-10-s11-story-003a-staging-volcengine-streaming-numbering.md`

## 6. 阅读但未修改的关键文件

- `src/server/generation/run-generate-stream-flow.ts`
- `src/lib/generate-stream-client.ts`
- `src/server/style-admin/runtime/runtime-variant-dsl-pool.ts`
- `src/core/generation/model-provider-config.ts`

## 7. 关键变更说明

### 7.1 打字机回归根因

- **dev**：直连 Next.js dev server，SSE chunk 即时到达客户端 → 打字机效果正常。
- **staging**：Nginx 反代默认 `proxy_buffering on`，且 SSE 响应缺少 `X-Accel-Buffering: no` → 事件被缓冲后批量下发 →「一块一块显示」。

**修复：** `buildGenerateStreamSseResponseHeaders()` + staging Nginx 专用 `location /api/generate/stream { proxy_buffering off; ... }`。

### 7.2 章节编号回归根因

- S10-STORY-011 已在 decode 阶段用 `resolveHeadingIndexLabel` 替换 number slot。
- DB-backed HTML variant 经 harvest / pool refresh 后，`meta.semanticBindings.number.path` 可能与当前 tree 不一致。
- `resolveEffectiveSemanticBindings` 曾**无条件**用 stored binding 覆盖 infer → stale path 导致替换失败 → 所有 heading 保留 source HTML 静态 `01`。

**修复：** 仅当 stored path 在 tree 上可解析时才采用；number 替换失败时 fallback 到 infer 的 number path。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 Volcengine staging 配置 | **Pending** | 文档/命令已列出 · ECS env 待用户配置 |
| AC-2 首页生成主链路 | **Pending** | 依赖 AC-1 + deploy |
| AC-3 打字机/streaming | **In Review** | 代码修复完成 · Nginx reload 待 ECS |
| AC-4 HTML variant 编号递增 | **In Review** | 代码 + test PASS · staging 人工待验 |
| AC-5 Preview/Copy 一致 | **In Review** | regression test 覆盖 copy HTML |
| AC-6 health ok | **N/A** | 未改 health 路径 · 预期不回归 |
| AC-7 admin/pool 不回归 | **In Review** | admin tests PASS · 未改 admin 主链 |
| AC-8 无 secret 入库 | **PASS** | 仅变量名 |
| AC-9 production 未启动 / main 未 merge | **PASS** | 明确未做 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | **PASS** | 0 errors · 30 pre-existing warnings |
| `corepack pnpm build` | **PASS** | Next.js 16.2.6 |
| targeted tests (32) | **PASS** | streaming headers · numbering · admin auth |
| full `pnpm test` | **未运行** | 已知 `wechat-paste-qa-pack` 2 failures 不在本轮范围 |

## 10. 未完成事项

- ECS 配置 `VOLCENGINE_*` 并 restart staging systemd
- ECS Nginx 应用 SSE location 并 reload
- staging 首页生成 + 打字机 + numbering 人工验收
- merge feature → sprint（待用户确认）
- S11-STORY-003A 关闭（待用户确认）

## 11. 风险与阻塞

- Volcengine API Key / model endpoint 仅用户持有，Cursor 无法代配。
- Nginx 配置需运维在 ECS 手动 apply（示例已更新，非自动 deploy）。

## 12. 需要用户 / ChatGPT 审查的问题

- staging Nginx 是否已按 `deploy/nginx/staging.conf.example` 增加 `/api/generate/stream` location？
- Volcengine env 配置后首页生成是否 PASS？
- 003A 是否可 merge 回 sprint？

## 13. 建议下一步

1. ECS 配置 Volcengine env + restart + Nginx reload（见 staging.md §9）
2. staging 人工验收：首页生成 · 打字机 · 多 heading 编号 · 复制
3. 通过后 merge `feature/s11-story-003a-...` → `sprint/s11-production-ops-go-live`
4. S11-STORY-004 production 仍保持 Pending

## 14. ECS 操作清单（无 secret）

```bash
# 1. Volcengine env（编辑 systemd unit Environment= 段）
sudo systemctl edit qingpian-wechat-editor-staging --full
sudo systemctl daemon-reload
sudo systemctl restart qingpian-wechat-editor-staging

# 2. Nginx SSE location（合并 staging.conf.example 后）
sudo nginx -t && sudo systemctl reload nginx

# 3. 验证
curl -I https://staging.qingpianai.cn/api/health
# 首页生成人工验收
```

## 15. Commit（streaming + numbering）

- Commit hash：`7eff8f9ad9583ccfd3bb3534eae1f1142cc6cc3b`

---

## 16. 追加：Preview heading picker 回归（2026-06-10 staging 人工验收）

### 根因

1. `PreviewStyleControls` 在 `userSelectablePool.source !== "database"` 时，将 `PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS`（release1 静态 8 项）与 DB userSelectable 选项 **concat 合并**。
2. `source === "empty"` 且 `userSelectableHeadingOptions === []` 时，空数组 truthy → 仍展示全部 release1 publish 项。
3. `mapDbPoolRowToVariantDefinition` 使用 `definitionJson.label/id`，与 admin `row.label` 不一致 → 英文/中文 label 混排。

### 修复

- `resolvePreviewHeadingStyleOptions()`：database/empty/code_fallback 路径均 **不再 merge** release1 publish pool。
- `buildUserSelectableHeadingOptionsFromPool()`：`runtimeVariantId` 去重。
- mapper：canonical `row.runtimeVariantId` + `row.label`。

### 修改文件（追加）

- `src/lib/preview-user-selectable-pool.ts`
- `src/components/preview/preview-style-controls.tsx`
- `src/server/style-admin/runtime/user-selectable-variant-pool-mapper.ts`
- `tests/lib/preview-user-selectable-pool.test.tsx`
- `tests/server/style-admin/runtime/user-selectable-variant-pool-mapper.test.ts`
- `docs/agile/bugs.md` · `changelog.md` · `sprint-backlog.md`

### ECS

需 **pull + build + restart** staging 应用（`qingpian-wechat-editor-staging`）。无需 Nginx 变更。

### Commit（picker fix）

- `d11a34005d31fde235a2d5b020e0df6b24e94601`

---

## 17. 追加：用户池权威性与 lifecycle 混淆（2026-06-10 staging 验收）

### 两个 variant 诊断链路（逻辑 trace · 非 staging DB 实查）

#### `heading_teal_section_label_html_paste_candidate`（应隐藏 · 曾错误显示）

| 阶段 | 修复前 | 修复后 |
|------|--------|--------|
| DB SQL (`userSelectable=true`) | 若 distribution=false → **不在 SQL** | 同左 |
| code fallback seed | **强制 userSelectable=true** → 进入 degraded/static picker | **已移除** |
| `PREVIEW_USER_SELECTABLE_*` | code_fallback 时 **注入 manifest** | degraded → **空列表** |
| preview picker | **显示**（static/seed 绕过 DB） | **不显示**（distribution=false） |

#### `heading_html_paste_d26a6370_candidate`（应显示 · 曾缺失）

| 阶段 | 条件 | 结果 |
|------|------|------|
| SQL | `distribution.userSelectable=true` + quality 非 blocking + heading | 进入 query |
| mapper | valid definitionJson | 进入 mapped pool |
| 曾缺失原因 | admin 列表 filter 不含 quality gate · 或 quality blocking · 或 static 混排掩盖 | admin filter 已对齐 pool where |

### lifecycle `user_selectable` 来源

- Prisma enum `StyleVariantLifecycle.user_selectable`（历史 promote 写入）
- **不等于** `distribution.userSelectable`
- 迁移：`20260610120000_migrate_lifecycle_user_selectable` → `paste_qa_pass`
- Promote 新行为：仅设 `distribution.userSelectable=true`，lifecycle → `paste_qa_pass`

### 根因摘要

1. Static seed / manifest 绕过 DB authority（teal 硬编码）
2. Degraded pool 注入 legacy options
3. Admin list `userSelectable=true` 未对齐 quality gate
4. lifecycle 与 distribution 双轨「user selectable」概念

### ECS

1. `pnpm build` + restart staging
2. **`pnpm db:migrate:deploy`**（lifecycle 数据迁移）
3. 无需 Nginx 变更

### Commit（pool authority）

- `a1967078e27776de6c2dc10e59cedd1871ced598`

---

## 18. 追加：d26a6370 inline 编号 ordinal + 主题色（2026-06-10 staging 验收）

### variant 诊断（`heading_html_paste_d26a6370_candidate` · 逻辑 trace）

| 项 | 值 |
|----|-----|
| runtimeVariantId | `heading_html_paste_d26a6370_candidate` |
| 形态 | inline accent number + title flex row（与 49b0ec2b 同型 · font-size 23px · rgb accent） |
| stored `semanticBindings.number.path` | encode 时通常为 `tree.children[0].children[0]`（styled section 包裹 p>strong>span） |
| `inferSemanticBindingsFromTree`（修复前） | **undefined**（阈值 fontSize≥36 漏掉 23px inline number） |
| number 节点文本 | 静态 `01`（substitution 失败时保留） |
| number 节点 color | 源 HTML `rgb(41, 50, 225)` 等硬编码 |
| palette 注入路径 | `decodeTreeToOutput` → `applyFidelityTreeThemeTokens` → `applyRoleColorAtPath(number)` |
| theme 修复前 | 仅读 **stored** binding path；path stale 时 **不 remap** |
| heading ordinal | `resolveHeadingOrdinalInArticle` — 仅 `block.type===heading` 计数，非 block index |
| Preview / Copy | 共用 `decodeTreeToOutput` + `applyFidelityTreeArticleSubstitution` |
| variantSourceMeta | server pool 已 refresh definitionJson；client 侧 meta 剥离 sourceHtml |

### 根因

1. **infer fallback 漏掉 <36px inline accent number** → stored path stale 时 substitution 失败，全部 heading 保留静态 `01`
2. **theme remap 只用 stored path** → stale path 时保留 source rgb/hex
3. staging DB definitionJson 可能存在 **tree 与 semanticBindings 不同步**（无 sourceHtml 时无法 re-encode 修复）

### 修复

- 扩展 `inferSemanticBindingsFromTree`：inline accent / bold / circular badge number 与 slot classifier 对齐
- `applyFidelityTreeThemeTokens` 改用 `resolveEffectiveSemanticBindings`（stored 有效优先，否则 infer）
- `collectFidelityNumberSubstitutionIssues` 诊断：`fidelity_number_substitution_failed` / `fidelity_number_binding_unresolved`
- `user-preview-render` 传递 `sourceHtml`（server snapshot 有则二次 refresh）

### 测试

```bash
npx vitest run tests/lib/html-paste-inline-number-ordinal-theme.test.ts \
  tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts \
  tests/lib/heading-49b0ec2b-inline-number-color.test.ts
```

19/19 PASS · `pnpm build` PASS

### DSL 契约

- **未新增** `semanticBindings.number.colorToken` 字段
- 颜色仍由 decode 阶段 `ROLE_COLOR_TOKEN` + `resolveNumberRoleColorToken` 解析（inline → `textAccent`）

### Commit（inline number ordinal + theme）

- `6fc8b46a1b936bf35a249025abf4e3848ae0d824`

---

## 19. Story 关闭（2026-06-11）

- **状态：** Done（用户确认 staging 验收）
- **Sprint merge：** `2ee03c5`（`--no-ff` from `feature/s11-story-003a-staging-volcengine-streaming-numbering`）
- **S11-STORY-004 Production：** Pending
- **Sprint 11 / Release 1 / main：** 未关闭 · 未 merge main
