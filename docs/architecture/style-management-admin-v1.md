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
| HTML Harvest 入库 | 后半段（S10-STORY-009~011） |

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
- **本轮未做：** variant 导入 · `/admin` UI · 用户侧 DB pool（→ S10-STORY-003~005）

---

## 7. S10 第一验收闭环（Sprint Goal）

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

**这条闭环完成前，不进入 HTML Harvest 主线（S10-STORY-009~011）。**

---

## 8. HTML Harvest 第二阶段（后半段）

| Story | 范围 |
|-------|------|
| S10-STORY-009 | 粘贴 HTML → raw 保存 · blockType 识别 · candidate 写入 DB |
| S10-STORY-010 | DB candidate → Preview / Copy / Validator · evidence 入库 |
| S10-STORY-011 | candidate → user_selectable promote · 用户侧 1–5 分钟可见 |

**约束：** 不直接 user-selectable · 不进入 default preset · 不自动 defaultEligible · 不自动变更 release1Required。

---

## 9. 阿里云部署概要（S10-STORY-007 实现）

| 项 | 策略 |
|----|------|
| ECS | 单实例 · Next.js `pnpm build` + `pnpm start` · 手工部署 |
| RDS | PostgreSQL · 独立实例 · 安全组仅允许 ECS 访问 |
| OSS | 独立 bucket · evidence 截图 · 可选 raw HTML |
| SLS | 独立 project / logstore · admin audit · runtime error |
| CloudMonitor | 基础告警 · 磁盘 · CPU · DB 连接 |
| Migration | `prisma migrate deploy` runbook · 部署前执行 |
| Health check | `/api/health` 或等价端点 · DB 连通性 |
| Secret | 仅环境变量 · **不写入文档或代码仓库** |

---

## 10. 单管理员登录（S10-STORY-008）

| 项 | 策略 |
|----|------|
| 范围 | `/admin/*` 页面 · 后台写 API |
| 模型 | 单管理员账号（环境变量或 DB 单条记录） |
| RBAC | **不做**复杂角色权限 |
| 登录态 | session / JWT · 明确有效期 |
| 审计 | 所有写操作写入 `admin_audit_logs` |
| 公网 | 部署前 **必须**启用；不得裸奔 |

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
