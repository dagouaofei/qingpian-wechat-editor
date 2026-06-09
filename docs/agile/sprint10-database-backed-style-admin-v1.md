# Sprint 10：Database-backed Style Management Admin v1（数据库版正式样式管理后台 v1）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **状态：** **Closed**（2026-06-08 · **DECISION-111** · S10-STORY-001~011 Done · 原 012~014 顺延 Sprint 12+）  
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
| S10-STORY-007 | 阿里云资源准备与部署 Runbook | **Done**（2026-06-07 · merge @ `03ec49b`） |
| S10-STORY-008 | 单管理员登录与后台保护 | **Done**（2026-06-07 · 本地 E2E PASS · merge @ `71e7300`） |
| S10-STORY-009 | HTML Harvest → Candidate Variant v1 | **Done**（2026-06-07 · merge @ `147c2e7`） |
| S10-STORY-010 | Candidate Preview / Copy / Validator / Evidence | **Done**（2026-06-07 · merge @ `d5a6af3`） |
| S10-STORY-011A | Article / Variant DSL Runtime + Encoder / Decoder | **Done**（2026-06-07 · checkpoint + FIX-A + FIX-B · 本地 E2E A/B/C PASS · merge sprint） |
| S10-STORY-011 | 采集样式 Promote 到 user-selectable | **Done**（2026-06-08 · merge @ `4c301d0`） |
| S10-STORY-012~014 | — | **Deferred** → Sprint 12+（DECISION-111） |

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

## 5.6 S10-STORY-007 阿里云部署 Runbook 摘要（2026-06-07 · Done）

**文档：** [`docs/ops/README.md`](../ops/README.md)

**范围：** ECS 手工部署 · RDS migration/import · OSS/SLS 预留 · CloudMonitor · 环境变量 · 上线验收 · 故障回滚

**代码：** `GET /api/health` · `pnpm db:migrate:deploy` · `.env.example` 补充 pool/OSS 占位

**未做：** 真实创建云资源 · 生产 RDS 连接 · OSS/SLS SDK · CI/CD

**后续：** S10-STORY-010 Preview / Copy / Validator / Evidence · S10-STORY-011 promote

---

## 5.7 S10-STORY-009 HTML Harvest 摘要（2026-06-07）

**路由：** `/admin/style-library/harvest`（`(protected)` · 须 admin login）

**入口：** `/admin/style-library` 列表页 **Harvest from HTML** 按钮

**模块：** `src/server/style-admin/harvest/` — sanitize · detect blockType · extract heading/info_card · `createHtmlHarvestCandidate`

**Harvest 诊断开关（S10-STORY-011）：** `STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE=off|report|enforce`（默认 `report`）· sanitize 永远开启 · `off` 仅用于保真诊断 · trace 字段 `wechatCompatibilityMode`

**写入：**

| 字段 | 值 |
|------|-----|
| sourceType | `html_paste` |
| sourceCohort | `s10_html_harvest_v1` |
| lifecycle | `candidate` |
| qualityStatus | `not_checked` |
| userSelectable / defaultEligible / release1Required | `false` |

**幂等：** `runtimeVariantId = {blockType}_html_paste_{hash8}_candidate` · 同 HTML + blockType 复用已有 candidate

**安全：** `requireStyleAdmin()` + write guard · raw HTML sanitize（去 script / 事件属性）· admin 展示 escape · 不进入 Preview/Copy 主链路

**本轮未做：** Preview / Copy / Validator / Evidence / OSS · promote（S10-STORY-010 / 011）

**本地验收：** 见 execution report `2026-06-07-s10-story-009-html-harvest-candidate.md`

---

## 5.8 S10-STORY-010 Candidate Inspection 摘要（2026-06-07）

**入口：** `/admin/style-library/[runtimeVariantId]` · Candidate Inspection 面板

**模块：** `src/server/style-admin/inspection/` — preview · copy · wechat validator · qualityStatus · evidence

**Run 按钮：** `Run Preview / Copy / Validator` → 写入 `style_variant_validation_runs`（preview / copy_html / wechat_validator）· 更新 `qualityStatus` · audit `run_candidate_inspection`

**Evidence：** `Add manual Paste QA evidence` → `style_variant_evidence`（paste_qa）· validation run paste_qa · ossKey=null

**Runtime Gate：** admin inspection path 独立于用户 runtime · `validator_pass` / `paste_qa_pass` 仍 `userSelectable=false`

**本轮未做：** OSS 截图上传 · promote（S10-STORY-011）

---

## 6. Sprint 10 明确不做（整体）

1. 不以 Style Expansion / 批量新增样式为第一目标
2. 第一验收闭环完成前不进入 HTML Harvest 主线
3. 不 merge `main`（Release 1 仍未关闭）
4. 不在仓库提交 secret
5. 不做复杂 RBAC · 不做 CI/CD（S10）

---

## 7. 关闭条件（S10-STORY-014）

- 第一验收闭环 PASS
- HTML Harvest 链路 PASS（candidate → validation → promote → 用户侧可选）— **S10-STORY-009~011 Done**（2026-06-08）
- Audit Grade 达标 · **P0=0**
- 用户确认关闭 Sprint 10
