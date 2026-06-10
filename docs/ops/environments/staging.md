# Staging 环境登记

> S11-STORY-001~003 · 华北 2（北京）· **勿提交 secret**

运维开通资源后回填下表。密码与 `DATABASE_URL` 仅保存在 ECS 环境变量中。

---

## 1. 基本信息

| 项 | 值 |
|----|-----|
| 环境名 | staging |
| 地域 | cn-beijing（华北 2 · 北京） |
| 公网域名 / URL | `https://staging.qingpianai.cn` |
| 登记日期 | 2026-06-11 |
| 登记人 | 运维验收（Cursor 文档收口） |

---

## 2. ECS

| 项 | 值 |
|----|-----|
| 实例 ID | `i-2zebuj9xyef2bxuz4ixt` |
| 规格 | 2 vCPU / 4 GiB · 通用算力型 u2a |
| 系统盘 | ESSD Entry 40 GiB |
| 镜像 | `ubuntu_22_04_x64_20G_alibase_20260522.vhd` |
| 操作系统 | Ubuntu 22.04.5 LTS |
| 内网 IP | `172.26.166.87` |
| 公网 IP / EIP | `123.56.224.164` |
| 安全组 ID | `sg-2ze3zkrxsxjmbv8gj5p0` |
| 部署用户 | `qingpian` |
| 应用目录 | `/opt/qingpian-wechat-editor/staging` |
| 进程管理 | systemd · unit `qingpian-wechat-editor-staging` |
| 应用端口 | `3001`（Nginx 反代，**未**对公网开放） |

**安全组（staging）：**

| 端口 | 来源 | 说明 |
|------|------|------|
| 22 | `120.244.228.215/32` | SSH · 用户当前公网 IP |
| 80 | `0.0.0.0/0` | HTTP → HTTPS redirect |
| 443 | `0.0.0.0/0` | HTTPS |
| 3000 / 3001 / 5432 / 3389 | — | **未开放** |

---

## 3. RDS PostgreSQL

| 项 | 值 |
|----|-----|
| 实例 ID | `rm-cn-nd34tltxu0001w` |
| 类型 | RDS PostgreSQL Serverless |
| 版本 | PostgreSQL 17 |
| 数据库名 | `qingpian_style_admin_staging` |
| 内网地址:端口 | `rm-cn-nd34tltxu0001w.rwlb.rds.aliyuncs.com:5432` |
| 业务账号 | `qingpian_app`（密码 **不入库**） |
| 白名单 | 仅 ECS 内网 IP `172.26.166.87` |

---

## 4. OSS

| 项 | 值 |
|----|-----|
| Bucket 名称 | ☐ 未创建（S11 staging 可选 / 预留） |
| 地域 | cn-beijing |
| 用途 | evidence 预留（S11 未接 SDK） |

---

## 5. SLS

| 项 | 值 |
|----|-----|
| Project | ☐ 未创建（S11 staging 可选 / 预留） |
| Logstore | ☐ 未创建 |
| SDK 接入 | 未接入 · 事件写 DB |

---

## 6. CloudMonitor

| 项 | 值 |
|----|-----|
| ECS 监控 | ☐ 基础纳管（告警规则待 S11-STORY-005） |
| RDS 监控 | ☐ 基础纳管（告警规则待 S11-STORY-005） |
| 告警规则 ID 列表 | ☐ 见 [`monitoring-and-oncall.md`](../monitoring-and-oncall.md) |

---

## 7. Nginx / HTTPS

| 项 | 值 |
|----|-----|
| 域名 | `staging.qingpianai.cn` |
| DNS | A 记录 → `123.56.224.164` |
| `server_name` | `staging.qingpianai.cn` |
| 反代目标 | `http://127.0.0.1:3001` |
| TLS | Certbot / Let's Encrypt · 已配置 |
| HTTP → HTTPS | 已配置 |
| Forwarded headers | `Host` · `X-Forwarded-Host` · `X-Forwarded-Port` · `X-Real-IP` · `X-Forwarded-For` · `X-Forwarded-Proto` |

---

## 7.1 SEO / 爬虫防护（staging only）

> **production 不应继承此配置。** 正式域名上线前须单独评估 SEO / robots 策略。

| 项 | 值 |
|----|-----|
| 适用范围 | 仅 `staging.qingpianai.cn` |
| Nginx 响应头 | `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` |
| `/robots.txt` | `User-agent: *` · `Disallow: /` |
| 验证方式 | `curl -I https://staging.qingpianai.cn/` · `curl https://staging.qingpianai.cn/robots.txt` |
| 验证结果 | PASS（2026-06-11 · curl） |

---

## 8. 部署记录（S11-STORY-002~003）

| 项 | 值 |
|----|-----|
| 首次 deploy 日期 | 2026-06-11（staging 阶段验收） |
| Git ref | `sprint/s11-production-ops-go-live` @ `7fb4d9e`（含 admin session bugfix merge `7f218e5`） |
| `db:migrate:deploy` | PASS |
| `import-existing-variants` | PASS |
| `pnpm build` + systemd | PASS · `qingpian-wechat-editor-staging` |
| `GET /api/health` | PASS · `ok: true` · `database: ok` |
| checklist A~E（staging） | PASS（见 [`production-release-checklist.md`](../production-release-checklist.md) · staging 列） |
| admin session bugfix | merge `7f218e5` · docs `7fb4d9e` |

---

## 9. 环境变量（仅记变量名 · 值在 ECS）

已配置（非敏感值）：

- [x] `NODE_ENV=production`
- [x] `PORT=3001`
- [x] `STYLE_ADMIN_PUBLIC_ORIGIN=https://staging.qingpianai.cn`
- [x] `STYLE_ADMIN_WRITE_ENABLED=true`
- [x] `STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS=120`

已配置（**值不入库**）：

- [x] `DATABASE_URL`
- [x] `STYLE_ADMIN_USERNAME`
- [x] `STYLE_ADMIN_PASSWORD_HASH`
- [x] `STYLE_ADMIN_SESSION_SECRET`
- [x] `STYLE_ADMIN_SESSION_TTL_SECONDS`

**部署侧说明：** `STYLE_ADMIN_SESSION_SECRET` 曾配置错误，已更正并轮换（不记录 secret 值）。

未配置 / 待办：

- [ ] `VOLCENGINE_*`（首页 AI 生成主链路 · 待配置与验收）

其它见 [`environment-variables.md`](../environment-variables.md)

---

## 10. Staging 验收摘要（2026-06-11）

| 项 | 结果 |
|----|------|
| `/api/health` | PASS |
| admin 登录 · session cookie · refresh | PASS |
| 无 GET `/admin/logout?_rsc=...` prefetch | PASS |
| `/admin/style-library` 列表 · userSelectable filter | PASS |
| `/preview` DB 样式池 | PASS |
| Hide / Restore 治理 | PASS |
| Logout（POST-only） | PASS |
| 首页 AI 生成主链路 | **待办** · 曾报「Provider 配置错误：未配置真实 AI 模型」 |
