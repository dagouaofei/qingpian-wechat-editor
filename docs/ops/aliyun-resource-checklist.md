# 阿里云资源检查清单

> S10-STORY-007 · 轻篇独立资源 · 华北 2（北京）

用于部署前逐项勾选。**不在仓库记录真实账号 ID、密码、连接串或 AccessKey Secret。**

---

## 1. 资源隔离原则

| 资源 | 轻篇策略 | 禁止 |
|------|----------|------|
| ECS | 轻篇独立实例 | 不与秒篇 AIPPT / 秒篇论文共用应用服务 |
| RDS PostgreSQL | 轻篇独立实例 / 独立库 | 不共用数据库 |
| OSS | 轻篇独立 bucket | 不共用 bucket |
| SLS | 轻篇独立 project / logstore | 可与同账号监控体系共存，但 logstore 独立 |
| CloudMonitor | 基础监控与告警 | 告警规则按轻篇资源单独配置 |
| VPC | 可使用同账号同地域 VPC | 安全组与 RDS 白名单按轻篇最小开放 |

---

## 2. ECS

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | 地域：**华北 2（北京）** | ☐ |
| 2 | 规格满足 Node.js Next.js 生产运行（建议 2 vCPU / 4 GiB 起） | ☐ |
| 3 | 系统盘 ≥ 40 GiB | ☐ |
| 4 | 操作系统：Ubuntu 22.04 LTS 或 Alibaba Cloud Linux 3 | ☐ |
| 5 | 安全组：仅开放 80/443（及 SSH 管理来源 IP 限制） | ☐ |
| 6 | 已安装 Node.js LTS（与项目兼容） | ☐ |
| 7 | 已启用 `corepack` · 可执行 `pnpm` | ☐ |
| 8 | 部署用户非 root · 具备读写应用目录权限 | ☐ |
| 9 | 进程管理：systemd 或 PM2 已规划 | ☐ |

---

## 3. RDS PostgreSQL

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | 引擎：**PostgreSQL**（版本与 Prisma 兼容，建议 14+） | ☐ |
| 2 | 地域与 ECS 同地域（华北 2） | ☐ |
| 3 | 独立实例 · 独立数据库名（如 `qingpian_style_admin`） | ☐ |
| 4 | 业务账号最小权限（非 superuser） | ☐ |
| 5 | **白名单 / 安全组：仅允许 ECS 内网 IP 访问** | ☐ |
| 6 | **禁止 0.0.0.0/0 公网开放数据库端口** | ☐ |
| 7 | 自动备份策略已启用 | ☐ |
| 8 | `DATABASE_URL` 仅配置在 ECS 环境变量 · **未提交 Git** | ☐ |

---

## 4. OSS（预留 · S10 前半段非强制）

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | 独立 bucket（如 `qingpian-style-evidence-<env>`） | ☐ |
| 2 | 地域：华北 2 | ☐ |
| 3 | 用途登记：evidence 截图 · raw HTML 归档（S10-STORY-009~011） | ☐ |
| 4 | RAM 子账号最小权限（后续接入 SDK 时） | ☐ |
| 5 | AccessKey 仅环境变量 · **未提交 Git** | ☐ |
| 6 | S10-STORY-003~008 **可不启用 OSS** | ☐ |

---

## 5. SLS（预留）

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | 独立 project（如 `qingpian-style-admin`） | ☐ |
| 2 | 独立 logstore（如 `admin-audit` · `runtime-error`） | ☐ |
| 3 | 当前事件先写 DB（`admin_audit_logs` · `runtime_error_logs` · `alert_events`） | ☐ |
| 4 | SLS SDK 接入可后置至运维迭代 | ☐ |

---

## 6. CloudMonitor

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | ECS：CPU · 内存 · 磁盘 · 网络 | ☐ |
| 2 | RDS：连接数 · CPU · 存储空间 · IOPS | ☐ |
| 3 | 告警联系人 / 通知渠道已配置 | ☐ |
| 4 | 磁盘 > 80% · RDS 连接数异常 · CPU 持续高占用告警 | ☐ |

---

## 7. 网络与安全

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | ECS ↔ RDS 走内网 | ☐ |
| 2 | `/admin/*` 已规划 S10-STORY-008 登录保护（部署必配 `STYLE_ADMIN_*`） | ☐ |
| 3 | production 写操作须 `STYLE_ADMIN_WRITE_ENABLED=true` 显式开启 | ☐ |
| 4 | 无 secret 写入仓库 · 无 `.env` 提交 | ☐ |

---

## 8. 部署后验证（摘要）

完整步骤见 [`production-release-checklist.md`](production-release-checklist.md)。

- `GET /api/health` → `database: ok`
- `/admin/login` → 登录 → `/admin/style-library`
- `/preview` 用户侧 DB pool 可用
