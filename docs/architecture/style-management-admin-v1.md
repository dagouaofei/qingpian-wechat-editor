# Style Management Admin v1（Database-backed）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 10 · S10-STORY-001** · Database-backed Style Management Admin v1  
> **状态：** 架构与技术选型定稿（文档层） · **DECISION-108**  
> **关联：** [`style-management-domain-model.md`](style-management-domain-model.md) · [`style-library-storage.md`](style-library-storage.md) · [`style-library-admin-shell.md`](style-library-admin-shell.md) · [`sprint10-database-backed-style-admin-v1.md`](../agile/sprint10-database-backed-style-admin-v1.md)

---

## 1. Sprint 10 定位

| 项 | 内容 |
|----|------|
| **英文名** | Sprint 10：Database-backed Style Management Admin v1 |
| **中文名** | Sprint 10：数据库版正式样式管理后台 v1 |
| **分支** | `sprint/s10-db-backed-style-admin-v1`（从 `release/1` · 2026-06-07 · @ `c96e869` S9 merge） |
| **第一目标** | **既有 variant 全量入库** → 后台可管理 → 后台上下架 / 回滚 → 用户侧样式选择池读取数据库 → 用户侧 1–5 分钟内看到变化 → 用户选择后 Preview / Copy 生效 |
| **第二目标（后半段）** | HTML Harvest 新增 variant：粘贴公众号 / 135 / 秀米 / DOM HTML → candidate → validation → evidence → promote → user-selectable |
| **不是什么** | Style Expansion / Visual Quality Upgrade 主 Sprint · 批量新增视觉样式 · 独立仓库 · 复杂 RBAC · CI/CD 全自动部署 |

**S10 不再沿用「Style Expansion / Visual Quality Upgrade」作为主目标。** HTML Harvest 新增 variant 是**第二阶段**，不能排在既有 variant DB 分发闭环之前。

---

## 2. S9 → S10 关系

### 2.1 Sprint 9（file-backed / code-backed v0）

S9 Style Management System v0 已验证：

| 能力 | S9 交付 |
|------|---------|
| 领域模型 | [`style-management-domain-model.md`](style-management-domain-model.md) |
| File-backed 存储 | `src/core/style-library/` · [`style-library-storage.md`](style-library-storage.md) |
| 运营工作台 | `/dev/style-library` · [`style-library-admin-shell.md`](style-library-admin-shell.md) |
| Lifecycle | [`style-library-lifecycle-management.md`](style-library-lifecycle-management.md) |
| Preview / Copy / Validator inspection | [`style-library-preview-copy-validator-integration.md`](style-library-preview-copy-validator-integration.md) |
| Promote proposal | [`style-library-promote-user-selectable.md`](style-library-promote-user-selectable.md) |
| User-selectable 暴露 | 用户预览页 picker · [`style-library-user-selectable-preview-picker.md`](style-library-user-selectable-preview-picker.md) |

S9 已 merge 至 `release/1`（`c96e869` · 2026-06-05）。

### 2.2 Sprint 10（database-backed v1）

S10 在 S9 领域模型与运营工作流验证基础上，解决**正式生产化**问题：

| 能力 | S10 目标 |
|------|----------|
| 既有 variant 全量入库 | first-wave · user-selectable · candidate · deprecated |
| 正式数据库存储 | PostgreSQL + Prisma |
| 正式管理入口 | `/admin/style-library` |
| 后台写操作 | 上下架 · 回滚 · promote · audit |
| 用户侧 DB 分发 | style picker 从 DB 读取 user-selectable pool |
| 单管理员登录 | `/admin/*` 访问保护 |
| 阿里云部署与运维 | ECS · RDS · OSS · SLS / CloudMonitor |
| HTML Harvest 入库 | S10-STORY-009~010 **Done**（`147c2e7` · `d5a6af3`）· S10-STORY-011 Promote 后续 |

### 2.3 迁移策略

```text
S9 file-backed manifest / code-backed variants（source of truth v0）
  → S10-STORY-003 幂等导入脚本 → PostgreSQL
  → S10-STORY-005 用户侧 picker 改读 DB（1–5 分钟缓存）
  → S10-STORY-006 后台写操作成为新 source of truth（DB）
  → /dev/style-library 保留为 diagnostics / file-backed inspection（只读对照）
```

**原则：**

1. S9 代码与 manifest **不删除**；`/dev/style-library` 保留用于 dev diagnostics 与导入前后对照
2. 用户侧 runtime **仍只消费** `ResolvedBlockStyle`；DB 分发的是 **variant metadata + distribution 状态**，variant 定义体（ComponentProtocol 等）入库后由 repository 提供给现有 Renderer 路径
3. `release1_required` · default preset · Gallery 默认池 **边界不变**（DECISION-106 · DECISION-107）
4. HTML Harvest 新 variant **不直接** user-selectable；须经 candidate → validation → evidence → promote

---

## 3. 技术选型（DECISION-108）

| 层 | 选型 | 说明 |
|----|------|------|
| 应用框架 | **Next.js** | 与主项目一致；App Router |
| ORM | **Prisma** | schema · migration · repository |
| 数据库 | **PostgreSQL** | 正式样式资产与运营审计存储 |
| 云数据库 | **阿里云 RDS PostgreSQL** | 华北 2（北京） |
| 对象存储 | **阿里云 OSS** | validation evidence 截图 · raw HTML 归档（可选） |
| 计算 | **阿里云 ECS** | 单实例手工部署；暂不做 CI/CD |
| 日志 / 监控 | **阿里云 SLS** · **CloudMonitor** | admin audit · runtime error · alert event |
| 地域 | **华北 2（北京）** | 与现有阿里云资源对齐 |
| 认证 | **单管理员登录** | `/admin/*` 保护；不做复杂 RBAC |
| 部署 | **ECS 手工部署** | 环境变量注入；migration runbook；health check |
| 用户侧缓存 | **1–5 分钟** | variant pool 允许短暂延迟；后台上下架后用户侧可见变化 |

**明确不做（S10）：**

- 不引入第二套 Next.js 应用或独立仓库
- 不共用秒篇 AIPPT / 秒篇论文的应用服务与数据库（见 §4）
- 不在文档或代码中提交任何 secret（密码 · AccessKey Secret · 私钥 · 真实连接串）
- 不 merge `main`（Release 1 仍未关闭）

---

## 4. 资源隔离策略

| 资源 | 策略 |
|------|------|
| 阿里云账号 | **可共用** |
| 地域 / VPC | **可共用**（华北 2） |
| 监控体系 | **可共用**账号体系；SLS project / logstore **建议独立** |
| ECS | **轻篇建议独立实例** — 不与秒篇 AIPPT、秒篇论文共用应用服务 |
| RDS PostgreSQL | **轻篇建议独立实例** — 不与秒篇 AIPPT、秒篇论文共用数据库 |
| OSS | **轻篇建议独立 bucket** — style evidence · raw HTML 归档 |

**原则：** 可以共用阿里云账号、地域、VPC、监控体系；**应用服务与数据库必须隔离**，避免样式管理后台与无关产品互相影响。

---

## 5. `/dev/style-library` 与 `/admin/style-library`

| 路由 | 归属 | 职责 |
|------|------|------|
| `/dev/style-library` | **S9 v0** · 保留 | dev diagnostics · file-backed inspection · 导入前后对照 · 只读 |
| `/admin/style-library` | **S10 v1** · 新建 | database-backed 正式管理入口 · variant 列表 / 详情 · 上下架 · lifecycle timeline |

**边界：**

1. S10 **后台写操作只放在 `/admin/*`**
2. 公网部署前 `/admin/*` **必须有单管理员登录保护**（S10-STORY-008）
3. **不做复杂 RBAC** — 单管理员账号即可
4. `/dev/style-library` **不迁移**为写入口；避免无 auth 的写操作
5. 后台写 API 与页面路由 **同等级保护**

---

## 6. 数据库 Schema 概要（S10-STORY-002 · 已实现 schema + migration 初版）

> **实现：** `prisma/schema.prisma` · 初始 migration `prisma/migrations/20260607100000_init_style_admin/` · repository `src/server/style-admin/`

| 表名 | 职责 |
|------|------|
| `style_variants` | variant 主记录 · runtimeVariantId · blockType · family · 当前 lifecycle / distribution 摘要 |
| `style_variant_versions` | variant 定义版本 · ComponentProtocol 快照 · 兼容信息 |
| `style_variant_sources` | 来源（registry · harvest · html_paste · manual） |
| `style_variant_distribution` | userSelectable · defaultEligible · release1Required · hidden 等分发状态 |
| `style_variant_lifecycle_events` | lifecycle 状态变迁时间线 |
| `style_variant_validation_runs` | Validator 运行记录 |
| `style_variant_evidence` | Paste QA · 截图 OSS key · evidence 元数据 |
| `style_variant_promote_records` | candidate → user_selectable promote 记录 |
| `style_variant_rollback_records` | 回滚记录 · 原因 · 目标版本 / distribution |
| `admin_audit_logs` | 后台写操作审计 |
| `runtime_error_logs` | 运行时错误（用户侧 / admin API） |
| `alert_events` | 报警事件 · SLS / CloudMonitor 对接元数据 |

**本地开发：** Docker PostgreSQL 或本地 PostgreSQL；`.env.local` 注入 `DATABASE_URL`（不提交仓库）。占位示例见 `.env.example`。

### 6.1 Repository 边界（S10-STORY-002）

| 模块 | 路径 | 职责 |
|------|------|------|
| Prisma client | `src/server/style-admin/prisma.ts` | 单例 · 仅 server-side |
| Variant CRUD | `repositories/style-variant-repository.ts` | create/list/version/current |
| Distribution | `repositories/style-variant-distribution-repository.ts` | user-selectable pool · update + audit |
| Validation / Evidence | `repositories/style-variant-validation-repository.ts` | validation runs · evidence |
| Audit / Alert | `repositories/style-variant-audit-repository.ts` | lifecycle · admin audit · error · alert |
| Pool 规则 | `mappers.ts` | `userSelectable` 独立于 `defaultEligible` / `release1Required` |

**约束：**

- React client component **不得**直接 `import` Prisma 或 repository
- `listUserSelectableVariants` 仅按 `distribution.userSelectable=true` 且排除 `hidden` / `deprecated`；**不**以 `defaultEligible` 或 `release1Required` 作为入选条件
- `updateDistribution` 写入 `admin_audit_logs`
- **S10-STORY-003 已实现：** variant 幂等导入层 · dry-run CLI · import report（→ §6.2）
- **S10-STORY-004 已实现：** `/admin/style-library` read UI（→ §6.3）
- **S10-STORY-005 已实现：** 用户侧 `/preview` DB pool（→ §6.4）
- **S10-STORY-006 已实现：** distribution 写操作 · rollback · audit · alert · pool cache 刷新（→ §6.5）
- **S10-STORY-008 已实现（Done · 本地 E2E PASS）：** 单管理员登录 · `/admin/*` 保护 · session actor（→ §6.6）
- **本轮未做：** version rollback · promote · default preset 编辑 · 复杂 RBAC

### 6.2 既有 Variant 导入（S10-STORY-003 · 已实现）

| 模块 | 路径 | 职责 |
|------|------|------|
| Collect | `import/collect-existing-style-variants.ts` | 扫描 registry · harvest · html_paste · manifest overlay · deprecated stubs |
| Map | `import/map-style-registry-variant-to-db.ts` | `VariantDefinition` + style-library → `CollectedStyleVariant` |
| Lifecycle / Distribution | `import/lifecycle-distribution-mapper.ts` | registry status / manifest → lifecycle + `StyleVariantDistribution` |
| Checksum | `import/checksum.ts` | 稳定 JSON SHA-256 · 版本幂等 |
| Import | `import/import-existing-style-variants.ts` | 编排 collect → write |
| Writer | `import/style-variant-import-writer.ts` | Prisma upsert · version · distribution · lifecycle event · source |
| Report | `import/import-existing-style-variants-report.ts` | 统计 · warnings · JSON export |
| CLI | `scripts/style-admin/import-existing-variants.ts` | `--dry-run` · `--report=path` · 非 0 退出 |

**资产来源：**

1. `createFirstWaveRequiredVariantRegistry()` — 92 `release1_required` variants
2. `HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS` — 历史 33 子集标记（非独立 registry）
3. `HARVEST_CANDIDATE_VARIANTS` · `HTML_PASTE_CANDIDATE_VARIANTS`
4. `STYLE_LIBRARY_MANIFEST` / `getStyleLibraryVariantAssets()` — lifecycle / distribution 覆盖
5. `DEPRECATED_HEADING_RUNTIME_VARIANT_IDS` — S7 废弃 heading catalog stubs（5）

**幂等规则：**

- `runtimeVariantId` upsert `style_variants`
- `sourceChecksum` 未变 → `skipped_unchanged` · 不新建 version
- lifecycle event 仅 lifecycle 变化时写入
- source 记录仅 metadata 变化时追加
- distribution 变化写 `admin_audit_logs`

**lifecycle 与 distribution 分离（FIX-A）：**

- registry `release1_required` variants → DB lifecycle `release1_required`（**非** `default_eligible`）
- `default_eligible` lifecycle 仅用于 style-library 明确标记为 default eligible 的资产
- `release1Required` 为 distribution flag；与 lifecycle `release1_required` 对齐但不自动 `userSelectable`

**distribution 边界（导入时强制）：**

- `userSelectable=true` 不隐含 `defaultEligible=true`
- `release1Required=true` 不隐含 `userSelectable=true`
- `deprecated=true` / `hidden=true` 入库 · 用户 pool（S10-STORY-005）须排除

### 6.3 Admin Read UI（S10-STORY-004 · 已实现）

| 路由 | 职责 |
|------|------|
| `/admin/style-library` | 列表 · summary · URL filters · disabled governance actions |
| `/admin/style-library/[runtimeVariantId]` | 详情 · distribution · current version · source · lifecycle timeline · validation/evidence |

| 模块 | 路径 |
|------|------|
| Query | `queries/style-library-admin-query.ts` |
| View model | `src/app/admin/style-library/style-library-admin-view-model.ts` |
| DB availability | `db-availability.ts` |

**约束：**

- Server component + server-only view model · client 不得 import Prisma
- Build 不强制连接 DB · `DATABASE_URL` 缺失时展示 diagnostic state
- **S10-STORY-006 起：** 详情页 governance 写操作可用（hide / restore / deprecated / rollback）· 须 reason · 写保护见 §6.5
- **S10-STORY-008 起：** `/admin/*` 须登录 · 写操作 actor=`admin:<username>` · production 写另须 `STYLE_ADMIN_WRITE_ENABLED=true`

### 6.4 用户侧 DB Pool（S10-STORY-005 · 已实现）

| 模块 | 路径 |
|------|------|
| Pool service | `runtime/user-selectable-variant-pool.ts` |
| Cache | `runtime/user-selectable-variant-pool-cache.ts` |
| Mapper | `runtime/user-selectable-variant-pool-mapper.ts` |
| Preview 接入 | `src/app/preview/page.tsx` → `PreviewPageClient` |

**Runtime Availability Gate（FIX-B）：** 用户侧 picker / Preview / Copy / AI heading 候选须同时满足：

```text
distribution.userSelectable = true
AND hidden = false AND deprecated = false
AND currentVersion exists
AND qualityStatus NOT IN (copy_fidelity_failed, validator_failed, blocked)
```

**sourceType（canonical）：** `registry` · `html_paste` · `harvest` · `manual` · `ai_generated` · `unknown` — `release1_required` 改为 `sourceCohort`，非 sourceType

**qualityStatus 与 distribution 分离：** qualityStatus 在 `StyleVariantVersion`；distribution 仅表示用户侧分发

**S10 heading seed（7 个 runtime available）：** 6 个 release1 publish + `heading_teal_section_label_html_paste_candidate`；2 个 copy fidelity failed 排除（BUG-S10-COPY-FIDELITY-001/002）

**不入选：** `release1Required` · `defaultEligible` 不自动绕过 gate

**Fallback：** `code_fallback` 仅 DB 不可用；DB 可用时不混合 code pool

**Dev-only API（非正式用户侧接口）：** `GET /api/dev/style-admin/user-selectable-pool`

- 仅在 `NODE_ENV=development` 或 `test` 可用；production / staging 等返回 `404` + `{ disabled: true, reason: "dev_only" }`
- 响应对 `notice` / `issues` 做脱敏，不暴露 `DATABASE_URL`、DB host、连接错误 stack 或 secret
- 正式用户侧路径仍为 `/preview` server 加载 pool，不依赖该 dev API

**Cache invalidation（S10-STORY-006）：** distribution 写操作成功后调用 `invalidateUserSelectableVariantPoolCache(blockType?)`；同实例可立即生效 · 多实例依赖 TTL（默认 120s，≤300s）

### 6.5 Distribution 写操作与治理（S10-STORY-006 · 已实现）

| 模块 | 路径 | 职责 |
|------|------|------|
| Write guard | `admin-write-guard.ts` | `assertStyleAdminWriteAllowed()` · dev/test 默认可写 · production/staging 默认 disabled · `STYLE_ADMIN_WRITE_ENABLED=true` 显式开启 |
| Governance actions | `actions/distribution-governance.ts` | hide · restore · deprecated · restore-from-deprecated · rollback last distribution |
| Server actions | `src/app/admin/style-library/actions.ts` | Next.js Server Actions · `revalidatePath` |
| UI | `style-library-governance-actions.tsx` | reason 必填 · 成功/失败反馈 · write protection banner |
| Repository | `style-variant-distribution-repository.ts` | `updateDistribution` + audit · `rollbackLastDistributionChange` + rollback record |
| Audit / Alert | `style-variant-audit-repository.ts` | `admin_audit_logs` · `runtime_error_logs` · `alert_events` |

**可用写操作：**

| 操作 | 效果 |
|------|------|
| Hide from user pool | `hidden=true` · `userSelectable=false` |
| Restore to user-selectable | `userSelectable=true` · `hidden=false` · `deprecated=false` · 须通过 Runtime Availability Gate（含 qualityStatus） |
| Mark deprecated | `deprecated=true` · `hidden=true` · `userSelectable=false` |
| Restore from deprecated | `deprecated=false` · `hidden=false` · **不**自动 `userSelectable` |
| Rollback last distribution change | 从最近 `update_distribution` audit `beforeJson` 恢复 · 写 `style_variant_rollback_records` |

**本轮 disabled（后续 story）：** promote candidate · mark default eligible · rollback version

**Actor（S10-STORY-008 起）：** `admin:<username>` 来自 signed httpOnly session

**写操作保护（须同时满足）：**

```text
requireStyleAdmin() passed
AND assertStyleAdminWriteAllowed() passed
```

```text
development / test → write guard 默认允许（已登录前提下）
production / staging → 另须 STYLE_ADMIN_WRITE_ENABLED=true
```

**Alert event 最小范围：**

| alertType | 场景 |
|-----------|------|
| `admin_write_failed` | distribution 写操作失败 |
| `variant_restore_blocked_by_quality` | restore 被 `copy_fidelity_failed` / `validator_failed` / `blocked` 拒绝 |
| `variant_pool_empty` | （设计登记）DB 有 variants 但 pool 为空 |
| `runtime_variant_pool_db_unavailable` | （设计登记）DB pool 不可用 |
| `copy_fidelity_blocked_variant_attempted` | （设计登记）用户侧显式命中 blocked variant |

**SLS / CloudMonitor 接入设计（AC-5）：** 事件先写入 DB `alert_events` / `runtime_error_logs`；S10-STORY-007 runbook 定义 SLS logstore 与 CloudMonitor 告警规则映射 · 本轮不接真实 SLS SDK。

**本地手动验收：**

```bash
export DATABASE_URL="postgresql://qingpian:qingpian_local_dev@localhost:54329/qingpian_style_admin?schema=public"
corepack pnpm prisma migrate deploy
corepack pnpm style-admin:import-existing-variants
corepack pnpm dev
```

建议 variant：`heading_teal_section_label_html_paste_candidate`（hide → dev API/preview 消失 → restore → rollback）；quality block：`heading_magazine_left_bar` / `heading_card_centered`。

### 6.6 单管理员登录与后台保护（S10-STORY-008 · 已实现 · Done）

**后台保护状态：** **完成**（2026-06-07 · 用户本地 E2E PASS）

| 模块 | 路径 | 职责 |
|------|------|------|
| Auth core | `auth/admin-auth.ts` | `requireStyleAdmin()` · `getCurrentStyleAdmin()` · `getStyleAdminActor()` |
| Password | `auth/admin-password.ts` | scrypt hash / verify（Node `crypto`） |
| Session | `auth/admin-session.ts` | HMAC-signed httpOnly cookie · TTL |
| Login | `src/app/admin/(auth)/login/` | username/password · safe `next` redirect |
| Logout | `src/app/admin/(auth)/logout/route.ts` | 清除 session |
| Guard | `src/app/admin/(protected)/layout.tsx` | 未登录重定向 `/admin/login?next=...` |
| Middleware | `src/middleware.ts` | 注入 `x-admin-pathname` 供 login redirect |
| Hash CLI | `scripts/style-admin/hash-admin-password.ts` | `pnpm style-admin:hash-password` |

**环境变量（`.env.example` 占位 · 不提交真实 secret）：**

```env
STYLE_ADMIN_USERNAME="admin"
STYLE_ADMIN_PASSWORD_HASH="CHANGE_ME_GENERATED_HASH"
STYLE_ADMIN_SESSION_SECRET="CHANGE_ME_LONG_RANDOM_SECRET"
STYLE_ADMIN_SESSION_TTL_SECONDS="86400"
STYLE_ADMIN_WRITE_ENABLED="false"
```

**保护范围：**

- `/admin/style-library` · `/admin/style-library/[runtimeVariantId]` · 后续 `(protected)` 下所有 `/admin/*` 页面
- 写操作 server actions / governance：`requireStyleAdmin()` 强制登录
- `/admin/login` · `/admin/logout` 不套 protected layout
- `/api/dev/style-admin/*` 保持 dev-only，非正式 admin API

**本地验收：**

```bash
corepack pnpm style-admin:hash-password "your-password"
# 将 hash + STYLE_ADMIN_SESSION_SECRET 写入 .env.local
corepack pnpm dev
```

1. 未登录访问 `/admin/style-library` → 跳转 `/admin/login`
2. 错误密码登录失败 · 正确密码进入后台
3. Hide / Restore 后 audit actor 为 `admin:<username>`
4. Logout 后再次访问须登录

**S10-STORY-007 部署：** ECS 环境变量须配置上述 `STYLE_ADMIN_*` 项 · 不写入仓库

---

## 7. S10 第一验收闭环（Sprint Goal）

**状态：** **PASS**（2026-06-07 · 用户本地 E2E · S10-STORY-003~006）

**在 HTML Harvest 主线启动前，必须完成：**

```text
既有 variant 入库
  → /admin/style-library 后台可见
  → 后台将某个 user-selectable variant 下架
  → 用户侧样式选择池 1–5 分钟内消失
  → 后台恢复上架
  → 用户侧样式选择池 1–5 分钟内恢复
  → 用户选择后 Preview / Copy 生效
```

| 步骤 | 验收点 |
|------|--------|
| 入库 | S10-STORY-003 幂等导入 · 导入报告 |
| 后台可见 | S10-STORY-004 `/admin/style-library` 列表 / 详情 |
| 下架 | S10-STORY-006 distribution → hidden / deprecated |
| 用户侧消失 | S10-STORY-005 DB pool + 缓存失效 · 1–5 分钟 |
| 恢复上架 | S10-STORY-006 恢复 userSelectable |
| Preview / Copy | 现有 Renderer 路径 · 不污染 default preset / release1Required |

**第一验收闭环已于 2026-06-07 通过**；HTML Harvest 主线（S10-STORY-009~011）可在 Sprint 10 后半段启动。

---

## 8. HTML Harvest 第二阶段

| Story | 范围 | 状态 |
|-------|------|------|
| S10-STORY-009 | 粘贴 HTML → raw 保存 · blockType 识别 · candidate 写入 DB | **Done**（2026-06-07 · `147c2e7`） |
| S10-STORY-010 | DB candidate → Preview / Copy / Validator · evidence 入库 | **Done**（2026-06-07 · `d5a6af3`） |
| S10-STORY-011 | candidate → user_selectable promote · 用户侧 1–5 分钟可见 | Planned |

### 8.1 S10-STORY-009 HTML Harvest v1（已实现）

| 项 | 策略 |
|----|------|
| 入口 | `/admin/style-library/harvest` · 列表页 **Harvest from HTML** |
| 支持 blockType | `heading` · `info_card`（其它仅扩展接口） |
| sourceType | `html_paste`（canonical） |
| sourceCohort | `s10_html_harvest_v1` |
| lifecycle | `candidate` |
| qualityStatus | `not_checked` |
| distribution | `userSelectable=false` · `defaultEligible=false` · `release1Required=false` |
| raw HTML | 存 `style_variant_sources.raw_html` · sanitize 后入库 · admin 展示 escape |
| 幂等 | `{blockType}_html_paste_{hash8}_candidate` · duplicate 返回 existing |
| 审计 | `create_html_harvest_candidate` · lifecycle event `created candidate` |
| Runtime Gate | 新 candidate **不**进入 `/preview` picker · AI pool 不使用 |

### 8.2 S10-STORY-010 Candidate Inspection（已实现）

| 项 | 策略 |
|----|------|
| 入口 | `/admin/style-library/[runtimeVariantId]` · Candidate Inspection 面板 |
| 路径 | `src/server/style-admin/inspection/` · admin-only · 复用 Preview/Copy renderer + `validateWechatCopyHtml` |
| Run | preview + copy_html + wechat_validator validation runs 入库 |
| qualityStatus | `validator_pass` / `validator_failed` / `copy_fidelity_failed` / `paste_qa_pass` |
| Evidence | manual Paste QA（`paste_qa`）· ossKey=null |
| Runtime Gate | inspection 不绕过用户 gate · `validator_pass`/`paste_qa_pass` 仍不 userSelectable |

**约束：** 不直接 user-selectable · 不进入 default preset · promote 留给 S10-STORY-011 · OSS 截图留后续。

---

## 9. 阿里云部署概要（S10-STORY-007 · 已实现 · Done）

| 项 | 策略 |
|----|------|
| ECS | 单实例 · Next.js `pnpm build` + `pnpm start` · 手工部署 |
| RDS | PostgreSQL · 独立实例 · 安全组仅允许 ECS 访问 |
| OSS | 独立 bucket · evidence 截图 · **S10-STORY-009~011 再接入** |
| SLS | 独立 project / logstore · 事件当前先入 DB · SDK 后置 |
| CloudMonitor | 基础告警 · ECS / RDS CPU · 磁盘 · 连接数 |
| Migration | `pnpm db:migrate:deploy` |
| Import | `pnpm style-admin:import-existing-variants` |
| Health check | `GET /api/health` · `database: ok\|unavailable\|not_configured` |
| Admin auth | S10-STORY-008 部署前置 · `STYLE_ADMIN_*` |
| Secret | 仅环境变量 · **不写入文档或代码仓库** |

**运维文档：** [`docs/ops/README.md`](../ops/README.md)

| 文档 | 路径 |
|------|------|
| 部署 Runbook | `docs/ops/aliyun-deployment-runbook.md` |
| 资源清单 | `docs/ops/aliyun-resource-checklist.md` |
| 环境变量 | `docs/ops/environment-variables.md` |
| 上线验收 | `docs/ops/production-release-checklist.md` |
| 故障回滚 | `docs/ops/incident-and-rollback-runbook.md` |

---

## 10. 单管理员登录（S10-STORY-008 · 已实现）

| 项 | 策略 |
|----|------|
| 范围 | `/admin/*` 页面 · 后台写 server actions |
| 模型 | 单管理员账号（`STYLE_ADMIN_USERNAME` + `STYLE_ADMIN_PASSWORD_HASH`） |
| Session | signed httpOnly cookie · `STYLE_ADMIN_SESSION_TTL_SECONDS` |
| Actor | `admin:<username>` 写入 `admin_audit_logs` |
| RBAC | **不做**复杂角色权限 |
| 写操作 | 须登录 **且** write guard 通过 |
| 公网 | 部署前 **必须**配置 auth env；不得裸奔 |

详见 §6.6。

---

## 11. Story 索引

见 [`sprint-backlog.md`](../agile/sprint-backlog.md) Sprint 10 章节 · S10-STORY-001 ~ S10-STORY-012。

**建议执行顺序：**

```text
S10-STORY-001（架构定稿）— Done
  → S10-STORY-002（Prisma + Schema）
  → S10-STORY-003（全量导入）
  → S10-STORY-008（单管理员登录，可与 004 并行）
  → S10-STORY-004（/admin/style-library）
  → S10-STORY-005（用户侧 DB pool）
  → S10-STORY-006（上下架 / 回滚 / 报警）
  → S10-STORY-007（阿里云部署 runbook）
  → —— 第一验收闭环 ——
  → S10-STORY-009 → 010 → 011（HTML Harvest）
  → S10-STORY-012（Audit / Closeout）
```

---

## 12. 明确不做（S10-STORY-001 本轮）

- 不实现 Prisma schema / migration
- 不写 DB repository
- 不实现 `/admin/style-library` 页面
- 不接入用户侧 DB variant pool
- 不做 HTML Harvest
- 不执行阿里云控制台操作
- 不 merge `main`
- 不关闭 Sprint 10
