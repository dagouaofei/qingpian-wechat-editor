# Production 环境登记

> S11-STORY-004 **Done** · 华北 2（北京）· **勿提交 secret**  
> **Production Prelaunch 已部署（2026-06-10 · 用户验收 PASS）** · **非正式公开上线**

### Production Prelaunch（当前必须遵守）

- **URL：** https://paiban.aiqingpian.cn
- **Deploy commit：** `385422d`（`merge(s11-004): gate b governance bootstrap and prelaunch code freeze`）
- **systemd：** `qingpian-wechat-editor-production` · **PORT** 3000
- **定位：** Prelaunch 链路验证 · **不代表公开发布**

**域名变更：** 原计划 `qingpianai.cn` 域名因 **未备案** 未继续使用；Production 使用子域 **`paiban.aiqingpian.cn`**。Staging 仍为 `https://staging.qingpianai.cn`。

**入口安全（已验收 · 观察期不得移除）：**

- HTTPS 正常 · HTTP → HTTPS 301
- Nginx **Basic Auth**（无凭证 401）
- `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`
- `/robots.txt` → `Disallow: /`
- Certbot 自动续期任务已创建

**回滚演练（已 PASS）：** `385422d` → `2f09b0d` → 恢复 `385422d` · health/database/version 正常 · DB 数据未丢失 · `heading_highlight_marker.userSelectable` 保持不变

---

## 1. 同机双环境拓扑

```text
同一台 ECS（i-2zebuj9xyef2bxuz4ixt）
├─ staging
│  ├─ 目录 /opt/qingpian-wechat-editor/staging
│  ├─ systemd qingpian-wechat-editor-staging
│  ├─ env `/etc/qingpian-wechat-editor-staging.env`
│  ├─ PORT 3001
│  ├─ DB qingpian_style_admin_staging
│  └─ https://staging.qingpianai.cn
└─ production（Prelaunch · 已启用）
   ├─ 目录 /opt/qingpian-wechat-editor/production
   ├─ systemd qingpian-wechat-editor-production
   ├─ env `/etc/qingpian-wechat-editor-production.env`
   ├─ PORT 3000
   ├─ DB qingpian_style_admin_production（独立）
   └─ https://paiban.aiqingpian.cn
```

**隔离要求：** 应用目录 · systemd · env · 数据库 · admin 凭证 · 域名/Nginx — **不得复用 staging**。

---

## 2. 基本信息

| 项 | 值 |
|----|-----|
| 环境名 | production |
| 地域 | cn-beijing |
| 公网 URL | **https://paiban.aiqingpian.cn** |
| 原规划域名 | `qingpianai.cn` — **未备案 · 未使用** |
| HTTPS | Certbot · 自动续期任务已创建 |
| 登记日期 | 2026-06-10 |
| Prelaunch 状态 | **Active** · 非公开发布 |

---

## 3. ECS

| 项 | staging | production |
|----|---------|------------|
| 实例 ID | `i-2zebuj9xyef2bxuz4ixt` | 同实例 |
| 应用目录 | `/opt/qingpian-wechat-editor/staging` | `/opt/qingpian-wechat-editor/production` |
| systemd | `qingpian-wechat-editor-staging` | `qingpian-wechat-editor-production` |
| 端口 | 3001 | 3000 |
| env 文件 | `/etc/qingpian-wechat-editor-staging.env` | `/etc/qingpian-wechat-editor-production.env` |
| Deploy commit | （staging 独立） | **`385422d`** |

---

## 4. RDS PostgreSQL（production 独立库）

| 项 | 值 |
|----|-----|
| 实例 | 与 staging 同 RDS 实例 · **不同 database** |
| production 数据库名 | `qingpian_style_admin_production`（或 env 配置名） |
| Variant 基线 | **100** 条（`import-existing-variants`） |
| health database | **ok**（验收 PASS） |
| 白名单 | 仅 ECS 内网 |

**禁止：** production 连接 staging DB · 公网暴露 5432 · 从 staging 复制 session secret。

---

## 5. Nginx / HTTPS

| 项 | staging | production（Prelaunch） |
|----|---------|-------------------------|
| 模板 | [`staging.conf.example`](../../deploy/nginx/staging.conf.example) | [`production.conf.example`](../../deploy/nginx/production.conf.example) + **Basic Auth**（服务器配置） |
| 发布定位 | 预发验证 | **Prelaunch** · **非公开发布** |
| Basic Auth | — | **启用** · 观察期 **不得移除** |
| `X-Robots-Tag` | noindex 全家桶 | **同策略** · **不得移除** |
| `/robots.txt` | `Disallow: /` | **`Disallow: /`** |
| SSE `proxy_buffering off` | 有 | **有** |

---

## 6. 环境变量（production）

| 变量 | 值 |
|------|-----|
| `APP_ENV` | `production` |
| `APP_VERSION` | `release-1` |
| `APP_GIT_SHA` | 构建时写入（deploy @ `385422d`） |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

完整列表见 [`environment-variables.md`](../environment-variables.md)。

---

## 7. 数据库 migration 与 import（已完成）

- [x] production 独立 database + 业务账号
- [x] `pnpm db:migrate:deploy`
- [x] `pnpm style-admin:import-existing-variants` → **100** 条 variant
- [x] 人工治理：`heading_highlight_marker` → `userSelectable=true`（验收 PASS）

**Deferred（DECISION-112）：**

- governance snapshot **apply** — **暂不执行**
- staging 独有 **2** 条测试 variant — **不迁移**
- P1-S11-001 跨环境 DB 同步方案 — **未定**

---

## 8. 运维脚本

| 命令 | 用途 |
|------|------|
| `pnpm ops:deploy:production -- <exact-commit> --confirm-production` | production 部署 |
| `pnpm ops:status:production` | 基线状态 |
| `pnpm ops:observe:production` | **严格观察**（S11-STORY-005 · 失败 exit 1） |
| `pnpm ops:rollback:production -- <commit> --confirm-production` | 回滚（演练基线 `2f09b0d`） |

## 8b. Governance snapshot（工具保留 · apply 暂缓）

export / dry-run 可用 · **apply 不在 Prelaunch 路径**。见 DECISION-112。

---

## 9. 回滚

- **演练 PASS：** `385422d` ↔ `2f09b0d` · 当前 **`385422d`**
- 详见 [`production-rollback-drill.md`](../production-rollback-drill.md)

---

## 10. 监控与观察

→ **S11-STORY-005** [`monitoring-and-oncall.md`](../monitoring-and-oncall.md) · [`production-prelaunch-observation-checklist.md`](../production-prelaunch-observation-checklist.md)

---

## 11. 功能验收摘要（Gate B · 用户确认）

- 首页 · Admin 登录 · Style Library · Preview · 生成 / SSE / 复制 — **PASS**
- `/api/health` ok · database ok · `/api/version` environment=production

**仍未做：** 解除 Basic Auth · 解除 noindex · merge `main` · 正式公开发布
