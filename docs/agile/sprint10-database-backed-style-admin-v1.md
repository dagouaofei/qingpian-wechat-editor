# Sprint 10：Database-backed Style Management Admin v1（数据库版正式样式管理后台 v1）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **状态：** **In Progress**（2026-06-07 · **DECISION-108** · S10-STORY-001 Done）  
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
| S10-STORY-003 | 既有 Variant 全量导入数据库 | Planned |
| S10-STORY-004 | 正式后台 Variant 管理页 | Planned |
| S10-STORY-005 | 用户侧 Variant Pool DB 接入 | Planned |
| S10-STORY-006 | 上下架 / 回滚 / 报警最小闭环 | Planned |
| S10-STORY-007 | 阿里云资源准备与部署 Runbook | Planned |
| S10-STORY-008 | 单管理员登录与后台保护 | Planned |
| S10-STORY-009 | HTML Harvest → Candidate Variant v1 | Planned（后半段） |
| S10-STORY-010 | Candidate Preview / Copy / Validator / Evidence | Planned（后半段） |
| S10-STORY-011 | 采集样式 Promote 到 user-selectable | Planned（后半段） |
| S10-STORY-012 | S10 Audit / Closeout | Planned |

完整 AC 见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 10 章节。

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
