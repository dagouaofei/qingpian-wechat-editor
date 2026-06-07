# Sprint 10：Database-backed Style Management Admin v1（数据库版正式样式管理后台 v1）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **状态：** **In Progress**（2026-06-07 · **DECISION-108** · S10-STORY-001~008 Done · **后台保护完成** · **第一验收闭环 PASS**）  
> **分支：** `sprint/s10-db-backed-style-admin-v1`（从 `release/1` · @ `c96e869`）  
> **架构：** [`style-management-admin-v1.md`](../architecture/style-management-admin-v1.md)  
> **决策：** **DECISION-108**

---

## 1. Sprint 名称与定位

| 项 | 内容 |
|----|------|
| **英文名** | Sprint 10：Database-backed Style Management Admin v1 |
| **中文名** | Sprint 10：数据库版正式样式管理后台 v1 |
| **定位** | 在 S9 v0 验证基础上，将样式资产迁移至 **PostgreSQL**，建立 **`/admin/style-library`** 正式后台，使用户侧样式选择池从 DB 分发 |
| **不是什么** | Style Expansion 主 Sprint · 批量新增视觉样式 · 独立仓库 · 复杂 RBAC · CI/CD |

---

## 2. Sprint Goal

### 2.1 第一目标（P0 · 前半段）

```text
既有 variant 全量入库
  → /admin/style-library 后台可见
  → 后台上下架 / 回滚
  → 用户侧样式选择池读取数据库（1–5 分钟缓存）
  → 用户选择后 Preview / Copy 生效
```

**第一验收闭环状态：** **PASS**（2026-06-07 · 用户本地 E2E · S10-STORY-003~006）

### 2.2 第二目标（后半段 · 第一闭环完成后）

HTML Harvest 新增 variant：粘贴 HTML → candidate → validation → evidence → promote → user-selectable。

---

## 3. 与 S9 关系

- S9：file-backed v0 · `/dev/style-library` · 领域模型与运营工作流已验证 · **已 merge `release/1`**
- S10：database-backed v1 · `/admin/style-library` · 正式存储 · 写操作 · 用户侧 DB 分发
- `/dev/style-library` **保留**为 dev diagnostics / file-backed inspection

详见 [`style-management-admin-v1.md`](../architecture/style-management-admin-v1.md) §2。

---

## 4. 技术选型摘要

Next.js · Prisma · PostgreSQL · 阿里云 RDS / OSS / ECS · SLS / CloudMonitor · 华北 2（北京）· 单管理员登录 · ECS 手工部署 · 用户侧 1–5 分钟缓存。

---

## 5. Story 索引

| Story | 名称 | 状态 |
|-------|------|------|
| S10-STORY-001 | S10 架构与技术选型定稿 | **Done**（2026-06-07 · DECISION-108） |
| S10-STORY-002 | Prisma + PostgreSQL DB Schema + Repository | **Done**（2026-06-07） |
| S10-STORY-003 | 既有 Variant 全量导入数据库 | **Done**（2026-06-07 · merge @ `daa1a0a` · FIX-A PASS） |
| S10-STORY-004 | 正式后台 Variant 管理页 | **Done**（2026-06-07 · merge @ `6307925` · 本地验收 PASS） |
| S10-STORY-005 | 用户侧 Variant Pool DB 接入 | **Done**（2026-06-07 · merge @ `6de237d` · FIX-A/B · 本地验收 PASS） |
| S10-STORY-006 | 上下架 / 回滚 / 报警最小闭环 | **Done**（2026-06-07 · 本地 E2E PASS · merge @ `1d309a0`） |
| S10-STORY-007 | 阿里云资源准备与部署 Runbook | Planned |
| S10-STORY-008 | 单管理员登录与后台保护 | **Done**（2026-06-07 · 本地 E2E PASS · merge sprint） |
| S10-STORY-009 | HTML Harvest → Candidate Variant v1 | Planned（后半段） |
| S10-STORY-010 | Candidate Preview / Copy / Validator / Evidence | Planned（后半段） |
| S10-STORY-011 | 采集样式 Promote 到 user-selectable | Planned（后半段） |
| S10-STORY-012 | S10 Audit / Closeout | Planned |

完整 AC 见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 10 章节。

---

## 5.1 S10-STORY-003 导入摘要（2026-06-07）

**实现路径：** `src/server/style-admin/import/` · `scripts/style-admin/import-existing-variants.ts`

**命令：**

```bash
pnpm style-admin:import-existing-variants:dry-run   # 不写 DB · 打印 report
pnpm style-admin:import-existing-variants           # 写入 DATABASE_URL 指向的 DB
```

**dry-run 统计（2026-06-07 · 非敏感）：** collected=100 · registry release1_required=92 · historical first-wave 33=33 · user_selectable=1 · deprecated=5 · candidate=8

**边界：** `userSelectable !== defaultEligible` · `release1Required` 为 distribution flag 不自动 userSelectable · deprecated / hidden 入库但后续用户 pool 排除

**本轮未做：** `/admin/style-library` · 用户侧 DB pool · HTML Harvest · 真实 RDS 连接

**后续：** S10-STORY-005 用户侧 DB pool · S10-STORY-006 写操作

---

## 5.2 S10-STORY-004 Admin Read UI 摘要（2026-06-07）

**路由：** `/admin/style-library` · `/admin/style-library/[runtimeVariantId]`

**能力：** summary cards · URL filters · variant table · detail（distribution / version / source / timeline / validation/evidence）

**URL filter presets（FIX-A）：** `userSelectable` · `release1Required` · `defaultEligible=true|false` · `hidden=true|false` · `deprecated=true` · `lifecycle=release1_required` · `blockType=heading`

**安全：** DATABASE_URL 未配置或 DB 不可用时显示 diagnostic state · 不暴露连接串 · 写操作 disabled（S10-STORY-006）· 公网部署须 S10-STORY-008 登录

**本轮未做：** 上下架写 API · 单管理员登录 · HTML Harvest

---

## 5.3 S10-STORY-005 用户侧 DB Pool 摘要（2026-06-07）

**接入页面：** `/preview`（`PreviewPageClient` 小标题样式 picker）

**Runtime：** `src/server/style-admin/runtime/user-selectable-variant-pool.ts`

**规则：** Runtime Availability Gate（userSelectable + 非 hidden/deprecated + current version + 非 blocking qualityStatus）

**FIX-B：** sourceType canonical · `sourceCohort`（`release1_required` 为 cohort 非 sourceType）· qualityStatus 与 distribution 分离

**缓存：** 默认 120s · env `STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS`（≤300s）

**Fallback：** DB 未配置/不可用 → `code_fallback`（S9 manifest pool）

**Dev-only API：** `GET /api/dev/style-admin/user-selectable-pool`（仅 development / test；production 返回 404 disabled；非正式用户侧接口）

**后续：** S10-STORY-006 写操作后主动 `invalidateUserSelectableVariantPoolCache` + TTL

---

## 5.4 S10-STORY-006 Distribution 写操作摘要（2026-06-07）

**能力：** hide · restore user-selectable · mark deprecated · restore from deprecated · rollback last distribution change

**保护：** `admin-write-guard.ts` · dev/test 默认可写 · production/staging 须 `STYLE_ADMIN_WRITE_ENABLED=true` · 页面 write protection 提示

**审计：** 所有写操作 reason 必填 · `admin_audit_logs` before/after · actor=`admin:<username>`（S10-STORY-008）· rollback 写 `style_variant_rollback_records`

**Alert：** `admin_write_failed` · `variant_restore_blocked_by_quality`（restore 被 qualityStatus 阻塞）

**Cache：** 写操作成功后 `invalidateUserSelectableVariantPoolCache(blockType?)` · 用户侧 1–5 分钟可见变化

**本轮未做：** version rollback UI · promote candidate · mark default eligible · 真实 SLS 接入

**本地验收：** `/admin/style-library/heading_teal_section_label_html_paste_candidate` hide/restore/rollback · dev API `/api/dev/style-admin/user-selectable-pool?blockType=heading`

---

## 5.5 S10-STORY-008 单管理员登录摘要（2026-06-07）

**路由：** `/admin/login` · `/admin/logout` · `(protected)/layout.tsx` 守卫 `/admin/style-library*`

**认证：** scrypt password hash · HMAC signed httpOnly session · `STYLE_ADMIN_SESSION_TTL_SECONDS`

**写操作：** `requireStyleAdmin()` + write guard · actor `admin:<username>`

**工具：** `corepack pnpm style-admin:hash-password "your-password"`

**环境变量：** 见 `.env.example` · S10-STORY-007 部署 runbook 须列出

**本地验收：** 未登录跳转 login · 登录后 governance · logout 后不可访问 · **PASS**（2026-06-07）

**后台保护状态：** **完成** — `/admin/*` 须登录 · 写操作须 session admin + write guard

---

## 6. Sprint 10 明确不做（整体）

1. 不以 Style Expansion / 批量新增样式为第一目标
2. 第一验收闭环完成前不进入 HTML Harvest 主线
3. 不 merge `main`（Release 1 仍未关闭）
4. 不在仓库提交 secret
5. 不做复杂 RBAC · 不做 CI/CD（S10）

---

## 7. 关闭条件（S10-STORY-012）

- 第一验收闭环 PASS
- HTML Harvest 链路 PASS（candidate → validation → promote → 用户侧可选）
- Audit Grade 达标 · **P0=0**
- 用户确认关闭 Sprint 10
