# 阿里云部署 Runbook

> S10-STORY-007 · qingpian-wechat-editor · Database-backed Style Management Admin v1

本手册描述轻篇公众号排版项目从**本地已验证状态**推进到**阿里云正式部署前准备完成**的手工部署流程。

**本轮不执行真实云资源创建，不连接生产 RDS。**

---

## 1. 目标与范围

```text
阿里云资源规划
→ ECS / RDS PostgreSQL / OSS / SLS / CloudMonitor
→ 安全组 / VPC / 白名单
→ 环境变量
→ 代码部署
→ Prisma migration
→ existing variants import
→ admin login
→ health check
→ /admin/style-library 验收
→ /preview 用户侧 DB pool 验收
```

| 做 | 不做 |
|----|------|
| 手工 ECS 部署步骤 | CI/CD |
| RDS migration + import | 真实控制台操作（本文档仅指引） |
| S10-STORY-008 admin 前置 | OSS / SLS SDK 接入 |
| `GET /api/health` | 连接生产 RDS 做本轮验证 |

---

## 2. 资源规划

**地域：华北 2（北京）**

| 资源 | 策略 |
|------|------|
| ECS | 轻篇**独立**实例 · Next.js `pnpm build` + `pnpm start` |
| RDS | 轻篇**独立** PostgreSQL · 安全组仅 ECS 可访问 |
| OSS | 轻篇**独立** bucket（evidence · 后续 S10-STORY-009~011） |
| SLS | 轻篇**独立** project / logstore（事件当前先入 DB） |
| CloudMonitor | ECS / RDS 基础监控告警 |
| VPC | 可共用同账号同地域 VPC · 安全组隔离 |

**明确不共用：**

- 不与秒篇 AIPPT 共用应用服务
- 不与秒篇论文共用应用服务
- 不共用数据库
- 不共用 OSS bucket

资源勾选见 [`aliyun-resource-checklist.md`](aliyun-resource-checklist.md)。

---

## 3. 部署顺序（总览）

```text
1. 创建 RDS PostgreSQL
2. 创建 ECS
3. 配置安全组 / RDS 白名单（仅 ECS → RDS）
4. 预留 OSS / SLS / CloudMonitor（可按 checklist 创建，前半段可不接 SDK）
5. ECS 安装 Node.js LTS + corepack + pnpm
6. 拉取代码 / 上传构建产物
7. 配置环境变量（见 environment-variables.md）
8. pnpm install --frozen-lockfile
9. pnpm prisma generate
10. pnpm db:migrate:deploy
11. pnpm style-admin:import-existing-variants
12. 配置 STYLE_ADMIN_*（hash-password + session secret）
13. pnpm build
14. pnpm start（或 systemd / PM2）
15. GET /api/health 验收
16. /admin/login → /admin/style-library
17. /preview 用户侧 DB pool 验收
18. hide / restore / rollback 冒烟
19. 填写 production-release-checklist.md
```

---

## 4. RDS PostgreSQL

### 4.1 创建

1. 阿里云控制台 → RDS → 创建 PostgreSQL 实例（华北 2）
2. 创建数据库，例如：`qingpian_style_admin`
3. 创建业务账号（`CREATE` / `CONNECT` / 表 DML 权限即可，非 superuser）
4. 记录**内网地址**与端口（不写入 Git）

### 4.2 网络安全

- RDS 白名单 / 安全组：**仅添加 ECS 内网 IP 或 ECS 安全组**
- **禁止**对公网 `0.0.0.0/0` 开放 5432
- ECS 与 RDS 同 VPC、同地域

### 4.3 连接串

在 ECS 环境变量配置（占位格式）：

```env
DATABASE_URL="postgresql://USER:PASSWORD@RDS_INTERNAL_HOST:5432/qingpian_style_admin?schema=public"
```

### 4.4 Migration

在 ECS 应用目录、已配置 `DATABASE_URL` 后：

```bash
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm prisma generate
corepack pnpm db:migrate:deploy
```

等价于 `prisma migrate deploy` · 应用 `prisma/migrations/` 下全部 migration。

### 4.5 导入既有 variants

```bash
corepack pnpm style-admin:import-existing-variants
```

幂等 · 可重复执行 · dry-run：

```bash
corepack pnpm style-admin:import-existing-variants:dry-run
```

### 4.6 备份

- 启用 RDS 自动备份 · 保留期按运维策略
- 重大发布前可手动快照

---

## 5. ECS 部署

### 5.1 系统准备

推荐：

- **OS：** Ubuntu 22.04 LTS 或 Alibaba Cloud Linux 3
- **Node.js：** LTS（与项目 `package.json` engines 兼容）
- **包管理：** `corepack enable` → `pnpm`

```bash
# 示例（按实际 Node 安装方式调整）
corepack enable
corepack prepare pnpm@latest --activate
```

### 5.2 获取代码

```bash
git clone <repository-url> qingpian-wechat-editor
cd qingpian-wechat-editor
git checkout sprint/s10-db-backed-style-admin-v1   # 或 release 分支策略确定后调整
```

或从 CI 产物上传 `.next` + `node_modules` + `package.json`（本轮以 git 拉取为例）。

### 5.3 环境变量

将 [`environment-variables.md`](environment-variables.md) 中 production 变量写入 ECS **本地** env 文件（不入库）。

**部署前置（S10-STORY-008）：**

```bash
corepack pnpm style-admin:hash-password "your-production-password"
openssl rand -base64 48
```

### 5.4 安装与构建

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm prisma generate
corepack pnpm db:migrate:deploy
corepack pnpm style-admin:import-existing-variants
corepack pnpm build
```

### 5.5 启动

```bash
NODE_ENV=production corepack pnpm start
# 默认监听 3000 · 前置 Nginx/Caddy 反代 443
```

### 5.6 进程管理（建议）

**systemd** 或 **PM2** 二选一即可，勿过度复杂化。

systemd 示例要点：

- `WorkingDirectory` = 应用目录
- `EnvironmentFile` = `/etc/qingpian-wechat-editor.env`（权限 600）
- `Restart=on-failure`
- 反向代理（Nginx）处理 TLS

---

## 6. OSS（预留）

| 项 | 说明 |
|----|------|
| Bucket | 轻篇独立 · 华北 2 |
| 用途 | evidence 截图 · raw HTML 归档 |
| S10 前半段 | **可不启用** · 无 SDK 依赖 |
| S10-STORY-009~011 | HTML Harvest / evidence 再接入 |
| 凭证 | RAM 子账号 · 环境变量 · 不入库 |

---

## 7. SLS / CloudMonitor

### 7.1 当前架构

- `admin_audit_logs` · `runtime_error_logs` · `alert_events` **先写入 PostgreSQL**
- SLS SDK **未接入** · 可后置

### 7.2 SLS 预留

- Project：`qingpian-style-admin`（示例名）
- Logstore：`admin-audit` · `runtime-error` · `alert-events`

### 7.3 CloudMonitor 基础项

| 资源 | 监控项 |
|------|--------|
| ECS | CPU · 内存 · 磁盘 · 网络出入 |
| RDS | 连接数 · CPU · 存储 · IOPS |

告警建议：磁盘 > 80% · RDS 连接数持续高位 · ECS CPU > 85% 持续 5min。

---

## 8. Health Check

### 8.1 端点

```http
GET /api/health
```

### 8.2 响应示例

```json
{
  "ok": true,
  "service": "qingpian-wechat-editor",
  "database": "ok",
  "time": "2026-06-07T12:00:00.000Z"
}
```

| `database` | 含义 |
|------------|------|
| `ok` | `DATABASE_URL` 已配置且 `SELECT 1` 成功 |
| `unavailable` | 已配置但连接失败 · HTTP **503** · `ok: false` |
| `not_configured` | 未配置 `DATABASE_URL` · HTTP **200** · 应用可启动但无 DB |

**不返回：** `DATABASE_URL` · DB host · stack trace · secret。

### 8.3 部署验收

```bash
curl -sS https://<your-domain>/api/health | jq .
```

期望 production：`database: "ok"` · `ok: true`。

---

## 9. Admin 认证（部署必配）

公网暴露 `/admin/*` **必须**完成 S10-STORY-008 配置：

- `STYLE_ADMIN_USERNAME`
- `STYLE_ADMIN_PASSWORD_HASH`
- `STYLE_ADMIN_SESSION_SECRET`
- production 写操作：`STYLE_ADMIN_WRITE_ENABLED=true`（确认策略后）

未配置 auth 时，protected 页面会重定向 login 并提示 `auth_not_configured`。

---

## 10. 上线后冒烟（摘要）

完整清单见 [`production-release-checklist.md`](production-release-checklist.md)。

1. `/admin/style-library` 未登录 → `/admin/login`
2. 登录成功 → 列表可见 DB variants
3. `/preview` picker 使用 DB pool（非 code_fallback）
4. Hide → 用户侧 pool 消失 · Restore → 恢复
5. audit actor = `admin:<username>`
6. 页面 / 日志无 secret 泄漏

---

## 11. 回滚与故障

见 [`incident-and-rollback-runbook.md`](incident-and-rollback-runbook.md)。

---

## 12. 安全清单

- [ ] 不提交 `.env.local` / production env 文件
- [ ] 不提交私钥 / AccessKey Secret
- [ ] RDS 不开放全网
- [ ] ECS 安全组最小端口
- [ ] `/admin/*` 必须登录
- [ ] production write 显式 `STYLE_ADMIN_WRITE_ENABLED`
- [ ] password hash · 非明文
- [ ] session httpOnly / secure / sameSite

---

## 13. 相关命令速查

| 命令 | 用途 |
|------|------|
| `corepack pnpm db:migrate:deploy` | 生产 migration |
| `corepack pnpm style-admin:import-existing-variants` | 全量导入 variants |
| `corepack pnpm style-admin:hash-password "..."` | 生成管理员密码哈希 |
| `corepack pnpm build` | 生产构建 |
| `corepack pnpm start` | 生产启动 |
| `curl /api/health` | 健康检查 |
