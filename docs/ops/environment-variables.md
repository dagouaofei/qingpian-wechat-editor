# 环境变量说明

> S10-STORY-007 · 轻篇 style admin 部署

**所有 secret 仅通过服务器环境变量或密钥管理服务配置，不得提交 Git。**

完整占位见项目根目录 [`.env.example`](../../.env.example)。

---

## 1. 环境区分

| 环境 | 用途 | secret 存放 |
|------|------|-------------|
| **local** | 开发者本机 · Docker PostgreSQL | `.env.local`（gitignored） |
| **staging** | 预发验证（可选） | `/etc/qingpian-wechat-editor-staging.env`（ECS · 权限 600 · **不入库**） |
| **production** | 正式对外（Prelaunch 链路验证） | `/etc/qingpian-wechat-editor-production.env`（ECS · **不入库**） |

### ECS canonical env 文件（S11-STORY-004）

| 环境 | 路径 | 说明 |
|------|------|------|
| staging | `/etc/qingpian-wechat-editor-staging.env` | systemd `EnvironmentFile` · ops 脚本默认路径 |
| production | `/etc/qingpian-wechat-editor-production.env` | 独立文件 · **不得**与 staging 共用 |

- 应用目录（如 `/opt/qingpian-wechat-editor/staging`）**不要求**存在 `.env`
- 运维脚本仅读取上述 canonical 路径；可通过 `OPS_ENV_FILE` **显式覆盖**（不自动搜索多个 `.env`）
- 脚本校验：文件存在 · 当前用户可读 · **不输出**文件内容

---

## 2. 数据库（S10-STORY-002+）

| 变量 | 必填 | Secret | 说明 |
|------|------|--------|------|
| `DATABASE_URL` | 生产必填 | **是** | PostgreSQL 连接串 · 仅 ECS / 本机配置 |

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

- **local 示例占位：** `postgresql://qingpian:qingpian_local_dev@localhost:54329/qingpian_style_admin?schema=public`
- **production：** 使用 RDS 内网地址 · 业务账号 · **不得提交 Git**

---

## 3. 单管理员认证（S10-STORY-008 · 部署前置）

| 变量 | 必填 | Secret | 说明 |
|------|------|--------|------|
| `STYLE_ADMIN_USERNAME` | 是 | 否 | 单管理员用户名 |
| `STYLE_ADMIN_PASSWORD_HASH` | 是 | **是** | scrypt 哈希 · **非明文密码** |
| `STYLE_ADMIN_SESSION_SECRET` | 是 | **是** | Session 签名密钥 |
| `STYLE_ADMIN_SESSION_TTL_SECONDS` | 否 | 否 | 默认 `86400`（24h） |
| `STYLE_ADMIN_WRITE_ENABLED` | 生产写操作 | 否 | 默认 `false` · 生产显式 `true` 才允许写 |

### 生成 password hash

```bash
corepack pnpm style-admin:hash-password "your-password"
```

将输出复制到 `STYLE_ADMIN_PASSWORD_HASH`。

### 生成 session secret

```bash
openssl rand -base64 48
```

将输出复制到 `STYLE_ADMIN_SESSION_SECRET`。

### 环境建议

| 环境 | `STYLE_ADMIN_WRITE_ENABLED` |
|------|----------------------------|
| local | `true`（便于 governance 验收） |
| staging | `true`（受控环境） |
| production | 上线验收通过后显式 `true`；紧急关闭写操作设为 `false` |

---

## 4. 用户侧 DB Pool（S10-STORY-005+）

| 变量 | 必填 | Secret | 说明 |
|------|------|--------|------|
| `STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS` | 否 | 否 | 默认 `120` · 最大 `300` |

---

## 5. OSS（预留 · S10-STORY-009~011）

S10 前半段（STORY-003~008）**不强制**配置 OSS。HTML Harvest / evidence 阶段再启用。

| 变量 | 必填 | Secret | 说明 |
|------|------|--------|------|
| `OSS_REGION` | 后续 | 否 | 如 `cn-beijing` |
| `OSS_BUCKET` | 后续 | 否 | 轻篇独立 bucket |
| `OSS_ACCESS_KEY_ID` | 后续 | **是** | RAM 子账号 |
| `OSS_ACCESS_KEY_SECRET` | 后续 | **是** | **不得提交 Git** |

---

## 6. AI 生成（Volcengine · S11-STORY-003A staging 必需）

| 变量 | 说明 | staging | production |
|------|------|---------|------------|
| `VOLCENGINE_ENABLE_REAL_PROVIDER` | 启用真实 Volcengine provider（`true` / `1`） | **必需** | 待定 |
| `VOLCENGINE_API_KEY` | Volcengine Ark API Key | **必需** · **不入库** | 待定 |
| `VOLCENGINE_MODEL` | 模型 endpoint id（如 `ep-...`） | **必需** | 待定 |
| `VOLCENGINE_BASE_URL` | API base（默认 `https://ark.cn-beijing.volces.com/api/v3`） | 可选 | 可选 |
| `VOLCENGINE_TIMEOUT_MS` | Provider 超时毫秒（默认 `60000`） | 可选 | 可选 |

未配置时首页生成报错：`未配置真实 AI 模型...`（`requireRealProvider` 路径）。

Style admin 部署可暂不配置 Volcengine；**首页生成 staging 验收前必须配置**。

---

## 7. Node 运行时

| 变量 | 说明 |
|------|------|
| `NODE_ENV` | production 部署设为 `production` |
| `PORT` | staging `3001` · production `3000` |

---

## 8. 部署版本标识（S11-STORY-004）

| 变量 | 必填 | Secret | 说明 |
|------|------|--------|------|
| `APP_ENV` | 推荐 | 否 | `staging` / `production` / local 缺省为 `dev` |
| `APP_VERSION` | 否 | 否 | 默认 `release-1` |
| `APP_GIT_SHA` | 构建时 | 否 | 完整构建 commit 短 hash（≤12）· **由 deploy/build 写入** |
| `APP_BUILD_TIME` | 构建时 | 否 | ISO UTC · **由 deploy/build 写入** |

- `GET /api/version` 返回上述字段 · **不返回** branch、DB host、env 文件内容
- `GET /api/health` 保持独立 · 仅健康状态
- systemd `EnvironmentFile` 指向 canonical env（staging `/etc/qingpian-wechat-editor-staging.env` · production `/etc/qingpian-wechat-editor-production.env`）· 应设置 `APP_ENV` · deploy 脚本在 build 前导出 `APP_GIT_SHA` / `APP_BUILD_TIME`

---

## 9. 安全规则

1. **不提交** `.env.local` · production `.env` · 私钥 · AccessKey Secret
2. **不写入** Runbook / 代码仓库的真实 `DATABASE_URL`
3. 使用 **password hash**，禁止明文密码环境变量
4. Session cookie：httpOnly · production `secure` · `sameSite=lax`（代码已实现）
5. `/admin/*` 公网部署前 **必须**配置 `STYLE_ADMIN_*` 全套变量

---

## 9. ECS 配置示例（占位）

在 ECS 上创建 **canonical env 文件**（权限 `600` · 所有者部署用户 · **不入库**）：

- staging：`/etc/qingpian-wechat-editor-staging.env`
- production：`/etc/qingpian-wechat-editor-production.env`

systemd unit 使用 `EnvironmentFile=` 指向上述路径（见 `deploy/systemd/*.service.example`）。

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@RDS_INTERNAL_HOST:5432/qingpian_style_admin?schema=public
STYLE_ADMIN_USERNAME=admin
STYLE_ADMIN_PASSWORD_HASH=scrypt:...
STYLE_ADMIN_SESSION_SECRET=...
STYLE_ADMIN_SESSION_TTL_SECONDS=86400
STYLE_ADMIN_WRITE_ENABLED=true
STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS=120
```
