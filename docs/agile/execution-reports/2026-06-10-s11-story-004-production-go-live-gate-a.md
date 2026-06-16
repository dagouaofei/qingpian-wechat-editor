# Execution Report：S11-STORY-004 Gate A — Production Go-Live Prep

## 1. 基本信息

| 项 | 值 |
|----|-----|
| 日期 | 2026-06-10（Gate A closeout） |
| 当前分支 | `ops/s11-story-004-production-go-live` → merge `sprint/s11-production-ops-go-live` |
| 来源分支 | `sprint/s11-production-ops-go-live` @ `edc1fd7` |
| 目标合并分支 | `sprint/s11-production-ops-go-live` |
| Sprint | Sprint 11 — Production Ops Go-Live |
| 关联 Story | **S11-STORY-004** · Gate A **Done** · Story **In Progress · Gate B Pending** |
| 执行者 | Cursor |
| 状态 | **Done（Gate A）** · staging 验证 PASS · merge sprint 本轮 · **production 未启动** · **main 未 merge** |
| Commit | 见 §23 |

**前置确认：**

- S11-STORY-003A、003B：**Done** · 已 merge sprint
- Gate A staging 验收：**PASS** @ `8e01438`
- production：**未启动**
- main：**未 merge**

---

## 2. 本轮目标

Gate A：生产上线准备、轻量运维工具、staging 验证方案与文档；**禁止** production 部署/切流。

---

## 3. 执行范围

**已完成：**

- `GET /api/version` + 构建时 metadata 注入
- Admin 版本 footer
- `scripts/ops/*` 部署/状态/回滚脚本 + `pnpm ops:*`
- production/staging systemd、Nginx 模板
- production 环境登记、DB migration/import 方案、回滚演练计划
- ECS staging deploy / rollback 验证（用户确认 2026-06-10 @ `8e01438`）
- 单元测试（version route + ops scripts）
- lint / build / test 基线对比

**未执行（按 Story 边界）：**

- production DNS / HTTPS / systemd / Nginx 切流
- production 数据库创建、migrate、import
- Gate B production Prelaunch 部署与回滚演练
- merge `main` / Sprint 11 closeout
- B4 CloudMonitor / SLS（→ S11-STORY-005 Pending）

---

## 4. 修改文件

- `.env.example` — APP_* 占位
- `.gitignore` — `/src/generated/`（build metadata）
- `deploy/nginx/staging.conf.example` — X-Robots-Tag、robots.txt
- `deploy/nginx/production.conf.example` — **Prelaunch** noindex + robots.txt；SSE buffering off
- `docs/agile/changelog.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/sprint11-production-ops-go-live.md`
- `docs/ops/environment-variables.md`
- `docs/ops/environments/production.md`
- `docs/ops/production-release-checklist.md`
- `package.json` — build 注入、ops scripts
- `src/app/admin/(protected)/layout.tsx` — AdminVersionFooter

---

## 5. 新增文件

- `scripts/build/inject-build-metadata.mjs`
- `scripts/ops/common.sh`
- `scripts/ops/deploy-environment.sh`
- `scripts/ops/status-environment.sh`
- `scripts/ops/rollback-environment.sh`
- `deploy/systemd/qingpian-wechat-editor-staging.service.example`
- `deploy/systemd/qingpian-wechat-editor-production.service.example`
- `docs/ops/production-rollback-drill.md`
- `src/app/api/version/route.ts`
- `src/server/version/app-version.ts`
- `src/components/admin/admin-version-footer.tsx`
- `tests/app/api/version/version-route.test.ts`

---

## 6. 阅读但未修改的关键文件

- `src/app/api/health/route.ts`
- `docs/ops/staging-deployment.md`
- `docs/ops/production-release-checklist.md`
- `docs/agile/git-workflow.md`
- `docs/agile/execution-reports/2026-06-11-s11-story-003b-gate-b-legacy-path-removal.md`

---

## 7. 生产环境拓扑

```text
同一台 ECS（i-2zebuj9xyef2bxuz4ixt · 华北 2）
├─ staging
│  ├─ /opt/qingpian-wechat-editor/staging
│  ├─ systemd: qingpian-wechat-editor-staging
│  ├─ PORT 3001 · APP_ENV=staging
│  ├─ DB: qingpian_style_admin_staging
│  └─ https://staging.qingpianai.cn
└─ production（待启用）
   ├─ /opt/qingpian-wechat-editor/production
   ├─ systemd: qingpian-wechat-editor-production
   ├─ PORT 3000 · APP_ENV=production
   ├─ DB: 独立（待创建）
   └─ 域名（待填）
```

**隔离：** 应用目录 · systemd · env · 数据库 · admin hash · session secret · 域名/Nginx · 日志 — **不得复用 staging**。

---

## 8. 缺失的控制台配置（仅登记 · 未伪造）

| 项 | 状态 |
|----|------|
| production 公网域名 / URL | ☐ 待填 |
| DNS A/CNAME | ☐ 待填 |
| HTTPS 证书（路径 / 到期） | ☐ 待填 |
| production 数据库名 | ☐ 待填（建议 `qingpian_style_admin_production`） |
| production 业务账号 | ☐ 待填 |
| RDS 白名单（ECS 内网） | 已知 staging：`172.26.166.87` · production 同规则待确认 |
| RDS 备份 / 快照策略 | ☐ 待确认 |
| production env 文件 | `/etc/qingpian-wechat-editor-production.env` ☐ 待创建 |
| systemd service | `qingpian-wechat-editor-production` ☐ 待安装 |
| Nginx server block | 模板就绪 · ☐ 待部署 |
| CloudMonitor / SLS（B4） | → S11-STORY-005 Pending |

---

## 9. `/api/version` 实现

**路由：** `GET /api/version` → `getAppVersionInfo()`

**响应字段：**

```json
{
  "service": "qingpian-wechat-editor",
  "environment": "staging",
  "appVersion": "release-1",
  "gitSha": "8da62e9",
  "buildTime": "2026-06-16T00:00:00.000Z"
}
```

**环境变量：** `APP_ENV` · `APP_VERSION` · `APP_GIT_SHA` · `APP_BUILD_TIME`

**规则：**

- 构建时 `scripts/build/inject-build-metadata.mjs` 写入 `src/generated/build-metadata.json`（gitignore）
- 运行时 `APP_ENV` 优先于文件 metadata（避免 production 误显 staging）
- `gitSha` 为完整 commit 短 hash（≤12 字符）· 请求时不调用 git
- dev/test 缺变量时降级为 `dev` / `unknown`
- 不返回 branch、DATABASE_URL、host、secret
- `/api/health` 未改动

**Admin footer：** 右下角 `environment · gitSha · build YYYY-MM-DD HH:mm`（UTC）

**测试：** `tests/app/api/version/version-route.test.ts` — 3/3 PASS

---

## 10. 运维脚本用法

| 命令 | 说明 |
|------|------|
| `pnpm ops:deploy:staging -- <git-ref>` | staging 部署 |
| `pnpm ops:deploy:production -- <exact-commit> --confirm-production` | production 仅精确 commit + 显式确认 |
| `pnpm ops:status:staging` | 环境 / commit / version / systemd / health / DB / 端口 |
| `pnpm ops:status:production` | 同上 |
| `pnpm ops:rollback:staging -- <commit>` | 代码回滚（≠ DB migration 回滚） |
| `pnpm ops:rollback:production -- <commit> --confirm-production` | production 代码回滚 |

**deploy 流程：** 校验 env/ref → flock 锁 → 记录 pre-commit → fetch → checkout → 清 `.next` → `pnpm install --frozen-lockfile` → prisma generate → 加载 env → `db:migrate:deploy` →（production 首次 `--first-import`）→ build → restart systemd → health + version 检查。

**安全：** 不打印 env/secret · 任一步失败即停 · build 失败不 restart · 不自动 DB 回滚。

---

## 11. Staging 部署与 rollback 验证（**Done · 2026-06-10**）

**staging 最终部署 commit：** `8e01438`（`https://staging.qingpianai.cn`）

| 项 | 结果 |
|----|------|
| `/api/health` | **PASS** |
| `/api/version` | **PASS** · environment=staging · commit · buildTime 正确 |
| Admin 版本 footer | **PASS** |
| `pnpm ops:status:staging` | **PASS** |
| deploy 结束自动 status | **PASS**（`print_environment_status`） |
| SSE 打字机 | **PASS** |
| Admin 登录 / Logout | **PASS** |
| userSelectable pool | **PASS** |
| Preview / Copy | **PASS** |
| 部署过程无 secret 输出 | **PASS** |

**Rollback 演练：**

| 步骤 | commit | 验证 |
|------|--------|------|
| 1 | 自 `8e01438` 回滚至 `275cc51` | `/api/version` gitSha 正确变化 |
| 2 | 自 `275cc51` 再部署 `8e01438` | 恢复至 Gate A 最终 commit |
| 最终 staging | **`8e01438`** | health / version / 冒烟 PASS |

**Gate A 期间修复项（均已验证）：**

- canonical env path（`/etc/qingpian-wechat-editor-staging.env`）
- pnpm `allowBuilds`（sharp / unrs-resolver）
- deploy lock 移出 Git worktree（`/tmp/...-deploy.lock`）
- status 命令（`status-environment.sh` 直连，非 `pnpm ops:status`）

**Gate B 前置：** staging PASS · 用户确认后可启动 production **Prelaunch**（仍须 noindex · 非公开发布）。

---

## 12. Production 精确目标 commit

| 项 | 值 |
|----|-----|
| 建议 baseline | sprint 003B merge `8da62e9` |
| **Gate A staging 验证 commit** | **`8e01438`** |
| Gate B 建议 ref | **`8e01438`** 或 sprint merge 后 exact hash |
| 策略 | production **仅精确 commit** · 禁止分支 HEAD 隐式部署 |

当前工作分支基于 `edc1fd7`（003B closeout 文档对齐）；Gate B 前应以 **staging 验证通过的 exact commit** 为准。

---

## 13. DB migration / import 方案（Gate B 文档 · 未执行）

1. 创建 production 独立 database + 业务账号（仅 ECS 内网）
2. deploy 前 RDS 快照或手动备份
3. 创建 production env `/etc/qingpian-wechat-editor-production.env`（独立 `DATABASE_URL` · **不入库** · 不得复制到应用目录）
4. `pnpm prisma generate && pnpm db:migrate:deploy`
5. `pnpm style-admin:import-existing-variants:dry-run` → 审查
6. `pnpm style-admin:import-existing-variants`（首次 `ops:deploy:production ... --first-import`）
7. 记录 migration 版本与 import 摘要

**禁止：** 连接 staging DB · 复制 staging session secret · 公网暴露 PostgreSQL · 自动 drop/rebuild DB

---

## 14. Production env / Nginx / systemd 差异

**Production Prelaunch（Gate B 仍须遵守）：** 首次 production 部署仅为链路验证 · **不代表公开发布** · **必须保留** `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` · **`robots.txt` 必须 `Disallow: /`** · **未经用户明确批准不得解除防爬** · 模板 [`production.conf.example`](../../../deploy/nginx/production.conf.example) 已配置 · checklist Section I 未勾选

| 维度 | staging | production（Prelaunch） |
|------|---------|-------------------------|
| `APP_ENV` | `staging` | `production` |
| `PORT` | 3001 | 3000 |
| `NODE_ENV` | `production` | `production` |
| systemd | `qingpian-wechat-editor-staging` | `qingpian-wechat-editor-production` |
| EnvironmentFile | `/etc/qingpian-wechat-editor-staging.env` | `/etc/qingpian-wechat-editor-production.env`（独立） |
| Nginx robots | `X-Robots-Tag` noindex + `/robots.txt Disallow: /` | **Prelaunch 同策略**（全站 HTML/API） |
| 公开发布 | N/A | **阻断** · checklist I1~I5 未勾选 |
| SSE `/api/generate/stream` | `proxy_buffering off` | **保留** |
| Forwarded headers / HTTPS / 安全头 | 已验证 | 与 staging 一致 · 不复制 staging 域名/端口 |

模板：[`deploy/systemd/qingpian-wechat-editor-production.service.example`](../../../deploy/systemd/qingpian-wechat-editor-production.service.example) · [`deploy/nginx/production.conf.example`](../../../deploy/nginx/production.conf.example)

---

## 15. Release checklist 状态

| Section | staging | production |
|---------|---------|------------|
| A 部署前 | PASS（2026-06-11） | Gate B |
| B1~B3 基础设施 | PASS | ☐ 待创建 |
| B1a `/api/version` | **PASS**（Gate A @ `8e01438`） | Gate B |
| B4 CloudMonitor/SLS | → **S11-STORY-005 Pending** | ☐ |
| C Admin 认证 | PASS | Gate B |
| D Admin 数据与治理 | PASS | Gate B |
| E 用户侧 DB pool | PASS | Gate B |
| F 安全 | 部分 | Gate B |
| 回滚演练 | **PASS**（staging · Gate A） | Gate B |
| 发布记录 | Gate B | Gate B |

---

## 16. Gate B 逐步操作指令（用户确认后）

1. 回填 [`production.md`](../../ops/environments/production.md) 域名、DNS、证书、DB 名、备份策略
2. 控制台创建 production DB + 账号 · RDS 白名单
3. 创建 `/opt/qingpian-wechat-editor/production` · 创建 `/etc/qingpian-wechat-editor-production.env`（**不入库**）
4. 安装 systemd + Nginx（production **Prelaunch** 模板 · noindex + Disallow robots）
5. RDS 快照
6. `pnpm ops:deploy:production -- <exact-commit> --confirm-production --first-import`
7. 验证 `/api/health` · `/api/version` · Admin · `/preview`
8. 回滚演练：A → B → rollback A（[`production-rollback-drill.md`](../../ops/production-rollback-drill.md)）
9. 更新 checklist · execution report · 用户确认 Gate B 完成

---

## 17. 风险与停止条件

| 风险 | 停止条件 |
|------|----------|
| production 误连 staging DB | env 未独立确认前禁止 deploy |
| 构建失败导致 downtime | 脚本 build 失败不 restart |
| 不可向后兼容 migration | rollback 脚本停止 · 人工 DBA |
| APP_ENV 缺失导致 version 误导 | deploy 前检查 env · runtime APP_ENV 优先 |
| Gate A staging 未验 | **不得**进入 Gate B |
| B4 监控未就绪 | 登记 005 Pending · 不伪造 PASS |

---

## 18. 验收标准

| AC | 结果 | 说明 |
|----|------|------|
| AC-A1 staging `/api/version` | **PASS** | @ `8e01438` |
| AC-A2 Admin footer | **PASS** | |
| AC-A3 `ops:status:staging` | **PASS** | |
| AC-A4 staging redeploy | **PASS** | ops 脚本 |
| AC-A5 staging rollback | **PASS** | `8e01438 ↔ 275cc51` |
| AC-A6 无 secret 泄漏 | **PASS** | |
| AC-A7 lint/build/test | **PASS** | closeout 复验 |
| Gate B AC-1~4 | **N/A** | 未执行 |

---

## 19. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | **PASS** | 0 errors · 33 warnings（既有） |
| `corepack pnpm build` | **PASS** | 含 build metadata 注入 |
| `corepack pnpm test` | **1343/1351 PASS · 8 failures** | 与 003B 基线一致 · **0 新增失败** |

**既有 8 failures（与 sprint @003B 相同）：**

1. `tests/app/admin/style-library/style-library-admin-page.test.tsx` — governance placeholders
2. `tests/core/wechat-compat/wechat-paste-qa-pack-006d.test.ts` — 006D QA pack markdown
3. `tests/core/wechat-compat/wechat-paste-qa-pack.test.ts` — QA pack markdown
4. `tests/lib/dsl-tree-html-preview.test.ts` — slots.title semantic binding
5. `tests/server/style-admin/import/collect-existing-style-variants.test.ts` — userSelectable ×2
6. `tests/server/style-admin/import/import-existing-style-variants.test.ts` — report summary ×2

**本轮新增：** `tests/app/api/version/version-route.test.ts` — **3/3 PASS**

---

## 20. 未完成事项

- Gate B production Prelaunch 部署（用户确认后）
- S11-STORY-005 监控告警
- S11-STORY-006 closeout
- merge `main`（未执行）

---

## 21. 需要用户 / ChatGPT 审查的问题

1. Gate B 是否以 `8e01438`（或 sprint merge hash）为 production exact commit？
2. production 域名与 DB 命名是否采用建议值 `qingpian_style_admin_production`？
3. Gate B 启动前是否需先完成 S11-STORY-005（B4）或允许 Prelaunch 先行？

---

## 22. 建议下一步

1. 用户确认后启动 **Gate B**（production 资源 · Prelaunch deploy · migrate · import）
2. 保持 production **Prelaunch 防爬**直至 checklist Section I 全部 PASS
3. 并行或后续 S11-STORY-005（CloudMonitor / SLS）
4. Sprint 11 closeout（S11-STORY-006 · 用户确认）

---

## 23. Commit

- Gate A commit hash：`2a416df`
- Env path fix commit：`c314ffc`
- pnpm build approval commit：`9a78b6b`
- Deploy lock fix commit：`e7a7b98`
- Status command fix commit：`8e01438`
- Gate A closeout commit：`44a235f`
- Sprint `--no-ff` merge commit：（merge 后填入）
- **Gate A Done** · **Gate B Pending** · **production 未启动**

### Env path 修正（追加）

| 环境 | Canonical env |
|------|---------------|
| staging | `/etc/qingpian-wechat-editor-staging.env` |
| production | `/etc/qingpian-wechat-editor-production.env` |

- deploy 在 `prisma generate` **之前**加载 env（修复 Prisma 缺 `DATABASE_URL`）
- 脚本启动校验 env 存在且可读 · 不输出内容
- 拒绝不可解释 dirty worktree（如 `pnpm-workspace.yaml`）；脚本产生的 tracked 变更在 EXIT 时恢复

### Deploy lock 修正（追加）

| 环境 | Lock path（仓库外） |
|------|---------------------|
| staging | `/tmp/qingpian-wechat-editor-staging-deploy.lock` |
| production | `/tmp/qingpian-wechat-editor-production-deploy.lock` |

- 不再在 `${OPS_APP_DIR}/.deploy.lock` 创建锁文件
- `require_acceptable_worktree` 在 `acquire_deploy_lock` **之前**执行
- `flock` 持有 fd · EXIT 释放 · 不污染 Git worktree

### Status 命令修正（追加）

- deploy / rollback 结束阶段调用 `print_environment_status` → 直接执行 `status-environment.sh "$OPS_ENV_NAME"`
- 不再通过错误的 `pnpm ops:status` 间接调用

## 24. 明确未执行

- production DNS 修改
- production 数据库 migration
- production systemd 启动
- production Nginx 切流
- production 上线（含 Prelaunch deploy）
- merge `main`
- Sprint 11 closeout
- S11-STORY-005 启动
- checklist Section I 公开发布阻断项（保持未勾选 · **Prelaunch 防爬仍有效**）
