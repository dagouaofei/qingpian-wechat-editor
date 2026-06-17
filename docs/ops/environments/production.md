# Production 环境登记

> S11-STORY-004 · 华北 2（北京）· **勿提交 secret**  
> **须在 staging checklist A~E 全部 PASS 后** 创建或启用 production 资源。  
> **Gate A（2026-06-10）：** **Done** · staging 验证 PASS @ `8e01438` · **production 未启动**  
> **Gate B 代码冻结（2026-06-10 · DECISION-112）：** @ `d99aa1a` · production **100 variant 已初始化** · staging 独有 **2** 测试 variant **不迁移** · **暂不 governance snapshot apply**

### Production Prelaunch（Gate B 仍须遵守）

首次 production 部署仅为 **Prelaunch** · **不代表公开发布**。

- **必须保留** Nginx 全站 `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`
- **`/robots.txt` 必须** `Disallow: /`
- **未经用户明确批准，不得解除防爬** · 不得将 production 模板恢复为可抓取状态
- 解除 noindex 须作为后续**独立发布动作**（checklist Section I1~I5 全部 PASS）

---

## 1. 同机双环境拓扑

```text
同一台 ECS（示例 i-2zebuj9xyef2bxuz4ixt）
├─ staging
│  ├─ 目录 /opt/qingpian-wechat-editor/staging
│  ├─ systemd qingpian-wechat-editor-staging
│  ├─ env `/etc/qingpian-wechat-editor-staging.env`
│  ├─ PORT 3001
│  ├─ DB qingpian_style_admin_staging
│  └─ https://staging.qingpianai.cn
└─ production（待启用）
   ├─ 目录 /opt/qingpian-wechat-editor/production
   ├─ systemd qingpian-wechat-editor-production
   ├─ env `/etc/qingpian-wechat-editor-production.env`（独立 · 独立 session secret / admin hash）
   ├─ PORT 3000
   ├─ DB（独立 · 待创建）
   └─ 域名（待填）
```

**隔离要求：** 应用目录 · systemd · env · 数据库 · admin 凭证 · 域名/Nginx · 日志路径 — **不得复用 staging**。

---

## 2. 基本信息（待控制台回填）

| 项 | 值 |
|----|-----|
| 环境名 | production |
| 地域 | cn-beijing |
| 公网域名 / URL | ☐ **待填** |
| DNS A/CNAME | ☐ **待填** |
| HTTPS 证书 | ☐ **待填**（路径 / 到期日） |
| 登记日期 | ☐ |
| 登记人 | ☐ |

---

## 3. ECS（与 staging 同机或独立 — 当前方案同机）

| 项 | staging（已知） | production |
|----|-----------------|------------|
| 实例 ID | `i-2zebuj9xyef2bxuz4ixt` | 同实例 |
| 应用目录 | `/opt/qingpian-wechat-editor/staging` | `/opt/qingpian-wechat-editor/production` ☐ 待创建 |
| systemd | `qingpian-wechat-editor-staging` | `qingpian-wechat-editor-production` ☐ 待安装 |
| 端口 | 3001 | 3000 |
| env 文件 | `/etc/qingpian-wechat-editor-staging.env` | `/etc/qingpian-wechat-editor-production.env` ☐ 待创建 |

---

## 4. RDS PostgreSQL（production 独立库 · 待创建）

| 项 | 值 |
|----|-----|
| 实例 | 可与 staging 同 RDS 实例 · **不同 database** |
| production 数据库名 | ☐ **待填**（建议 `qingpian_style_admin_production`） |
| production 业务账号 | ☐ **待填**（不得与 staging 共用密码） |
| 内网地址:端口 | 同 staging RDS 内网 endpoint |
| 白名单 | 仅 ECS 内网 IP `172.26.166.87` |
| 备份策略 | ☐ **待确认**（自动备份 / 快照保留天数） |

**禁止：** production 连接 staging DB · 公网暴露 5432 · 从 staging 复制 session secret。

---

## 5. Nginx / HTTPS

| 项 | staging | production（Prelaunch） |
|----|---------|-------------------------|
| 模板 | [`deploy/nginx/staging.conf.example`](../../deploy/nginx/staging.conf.example) | [`deploy/nginx/production.conf.example`](../../deploy/nginx/production.conf.example) |
| 发布定位 | 预发验证 | **Prelaunch** · 链路验证 · **非公开发布** |
| `X-Robots-Tag` | `noindex, nofollow, noarchive, nosnippet` | **同策略**（Prelaunch 全站 · 含 HTML/API） |
| `/robots.txt` | `Disallow: /` | **`Disallow: /`**（Prelaunch） |
| 解除 noindex | N/A（staging 长期 noindex） | **独立发布动作** · 见 checklist Section I |
| SSE `proxy_buffering off` | 有 | **必须有** |
| Forwarded headers / HTTPS / 安全头 | 已验证 | 与 staging 一致 · **不复制 staging 域名/端口** |

---

## 6. 环境变量（production 建议）

| 变量 | 值 |
|------|-----|
| `APP_ENV` | `production` |
| `APP_VERSION` | `release-1` |
| `APP_GIT_SHA` | 构建时写入（deploy 脚本） |
| `APP_BUILD_TIME` | 构建时 ISO UTC |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

完整列表见 [`environment-variables.md`](../environment-variables.md) · 占位见 [`.env.example`](../../.env.example)。

---

## 7. 数据库 migration 与 import（Gate B 执行 · Gate A 仅文档）

1. ☐ 创建/确认 production 独立 database + 业务账号  
2. ☐ RDS 快照或手动备份（deploy 前）  
3. ☐ 写入 production env 文件 `/etc/qingpian-wechat-editor-production.env`（`DATABASE_URL` 等 · **不入库**）  
4. ☐ `pnpm prisma generate`  
5. ☐ `pnpm db:migrate:deploy`  
6. ☐ `pnpm style-admin:import-existing-variants:dry-run` → 审查统计  
7. ☐ `pnpm style-admin:import-existing-variants`（首次 deploy 加 `--first-import`）  
8. ☐ 记录 migration 版本与 import 摘要到 execution report  

**不得：** 自动 drop DB · 从 staging 复制 admin hash/session secret。

---

## 8. 运维脚本（Gate A）

| 命令 | 用途 |
|------|------|
| `pnpm ops:deploy:staging -- <git-ref>` | staging 部署 |
| `pnpm ops:deploy:production -- <exact-commit> --confirm-production` | production 部署（Gate B） |
| `pnpm ops:status:staging` | staging 状态 |
| `pnpm ops:status:production` | production 状态 |
| `pnpm ops:rollback:staging -- <commit>` | staging 代码回滚 |
| `pnpm ops:rollback:production -- <commit> --confirm-production` | production 代码回滚（Gate B） |

## 8b. Production 治理 bootstrap（Gate B · 不复制整库）

| 命令 | 用途 |
|------|------|
| `pnpm style-admin:export-governance-snapshot -- <file.json>` | 从 staging DB 导出治理 snapshot（无 secret） |
| `pnpm style-admin:import-governance-snapshot:dry-run -- <file.json>` | production 已 import variants 后 dry-run |
| `pnpm style-admin:import-governance-snapshot -- <file.json>` | 用户确认后写入（**代码冻结期暂不执行 apply**） |

**代码冻结事实（DECISION-112 · 2026-06-10）：**

- Production 已通过 `import-existing-variants` 初始化 **100** 条 variant
- Staging 较 production 多 **2** 条 staging 独有测试 variant → **不迁移**
- **暂不执行** governance snapshot **apply**；export / dry-run 保留供后续 P1-S11-001 决策
- 各环境 **DB 为 variant 唯一事实来源**；代码 importer 为待审计历史 bootstrap

**顺序（Prelaunch）：** `db:migrate:deploy`（已完成）→ variant import（已完成 · 100 条）→ Prelaunch app deploy @ 冻结 commit → 验收 → 回滚演练。Governance snapshot apply **不在** Prelaunch 默认路径。

脚本不打印 env/secret · 部署失败不 restart · production 仅精确 commit。

---

## 9. 回滚演练（Gate A 计划 · Gate B 执行）

见 [`production-rollback-drill.md`](../production-rollback-drill.md)。

---

## 10. Checklist 边界

S11-STORY-004 负责 checklist A~E、F（除 dev route）、回滚演练、发布记录。  
**B4 CloudMonitor / SLS** → S11-STORY-005 **Pending**（不得伪造完成）。

---

## 11. Gate B 精确目标 commit（建议）

| 项 | 值 |
|----|-----|
| 建议 ref | sprint merge @ `8da62e9`（003B `--no-ff`）或其后 Gate A 验证 commit |
| 策略 | **仅精确 commit** · 不用分支 HEAD |

**Gate A 未执行：** DNS 切换 · production systemd 启动 · production migrate · production 切流。
