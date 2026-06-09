# Staging 环境登记

> S11-STORY-001 · 华北 2（北京）· **勿提交 secret**

运维开通资源后回填下表。密码与 `DATABASE_URL` 仅保存在 ECS 环境变量中。

---

## 1. 基本信息

| 项 | 值 |
|----|-----|
| 环境名 | staging |
| 地域 | cn-beijing |
| 公网域名 / URL | ☐ 待填（例：`https://staging.example.com`） |
| 登记日期 | ☐ |
| 登记人 | ☐ |

---

## 2. ECS

| 项 | 值 |
|----|-----|
| 实例 ID | ☐ |
| 规格 | ☐ |
| 内网 IP | ☐ |
| 公网 IP / EIP | ☐ |
| 安全组 ID | ☐ |
| 部署用户 | ☐ |
| 应用目录 | ☐ 例：`/opt/qingpian-wechat-editor` |
| 进程管理 | ☐ systemd / PM2 |

---

## 3. RDS PostgreSQL

| 项 | 值 |
|----|-----|
| 实例 ID | ☐ |
| 数据库名 | ☐ |
| 内网地址:端口 | ☐ |
| 白名单 | ☐ 仅 staging ECS 安全组 |

---

## 4. OSS

| 项 | 值 |
|----|-----|
| Bucket 名称 | ☐ |
| 地域 | cn-beijing |
| 用途 | evidence 预留（S11 可不接 SDK） |

---

## 5. SLS

| 项 | 值 |
|----|-----|
| Project | ☐ |
| Logstore | ☐ |
| SDK 接入 | ☐ 未接入 / 已接入 |

---

## 6. CloudMonitor

| 项 | 值 |
|----|-----|
| ECS 监控 | ☐ 已纳管 |
| RDS 监控 | ☐ 已纳管 |
| 告警规则 ID 列表 | ☐ 见 [`monitoring-and-oncall.md`](../monitoring-and-oncall.md) |

---

## 7. 部署记录（S11-STORY-002~003）

| 项 | 值 |
|----|-----|
| 首次 deploy 日期 | ☐ |
| Git commit / tag | ☐ |
| `db:migrate:deploy` | ☐ PASS |
| `import-existing-variants` | ☐ PASS · release1_required=92 |
| `GET /api/health` | ☐ PASS |
| checklist A~E | ☐ 见 [`production-release-checklist.md`](../production-release-checklist.md) |

---

## 8. 环境变量（仅记变量名 · 值在 ECS）

- [ ] `DATABASE_URL`
- [ ] `STYLE_ADMIN_USERNAME`
- [ ] `STYLE_ADMIN_PASSWORD_HASH`
- [ ] `STYLE_ADMIN_SESSION_SECRET`
- [ ] `STYLE_ADMIN_SESSION_TTL_SECONDS`
- [ ] `STYLE_ADMIN_WRITE_ENABLED`
- [ ] `NODE_ENV=production`
- [ ] 其它见 [`environment-variables.md`](../environment-variables.md)
