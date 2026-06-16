# Execution Report：S11-STORY-004 Gate A — Production Go-Live Prep

## 1. 基本信息

| 项 | 值 |
|----|-----|
| 日期 | 2026-06-10 |
| 当前分支 | `ops/s11-story-004-production-go-live` |
| 来源分支 | `sprint/s11-production-ops-go-live` @ `edc1fd7` |
| 目标合并分支 | `sprint/s11-production-ops-go-live` |
| Sprint | Sprint 11 — Production Ops Go-Live |
| 关联 Story | **S11-STORY-004** · Gate A |
| 执行者 | Cursor |
| 状态 | **In Review**（Gate A 已 commit · ECS staging 验证待用户 · **production 未启动** · **main 未 merge**） |
| Commit | 见 §23（Gate A commit 含 Prelaunch 修正）

**前置确认：**

- S11-STORY-003A、003B：**Done** · 已 merge sprint（003B `--no-ff` @ `8da62e9`）
- Working tree：有未提交 Gate A 变更（无 secret）
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
- 单元测试（version route）
- lint / build / 全量 test 基线对比

**未执行（按 Story 边界）：**

- production DNS / HTTPS / systemd / Nginx 切流
- production 数据库创建、migrate、import
- ECS staging 实际 deploy / rollback（待用户）
- Gate B production 部署与回滚演练
- merge sprint / merge main / Sprint 11 closeout
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
| production `.env` 路径 | 规划：`/opt/qingpian-wechat-editor/production/.env` ☐ 待创建 |
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

## 11. Staging 部署与 rollback 验证（待 ECS 执行）

Gate A 代码在本地 PASS；**AC-A1~A6 需在 ECS 完成**：

1. `pnpm ops:deploy:staging -- <gate-a-commit>` 重新部署
2. `curl https://staging.qingpianai.cn/api/version` — environment=staging · gitSha/buildTime 正确
3. Admin 页右下角版本 footer
4. `pnpm ops:status:staging`
5. SSE 打字机 · Admin 登录/logout · userSelectable pool · Preview/Copy
6. rollback 演练：commit A → deploy B → verify B → rollback A → verify A（见 [`production-rollback-drill.md`](../../ops/production-rollback-drill.md)）
7. 确认脚本 stdout 无 DATABASE_URL / password / secret

**未通过 staging 不得进入 Gate B。**

---

## 12. Production 精确目标 commit

| 项 | 值 |
|----|-----|
| 建议 baseline | sprint 003B merge `8da62e9` |
| Gate A 合并后 | 本分支 merge commit 或用户指定的 **exact hash** |
| 策略 | production **仅精确 commit** · 禁止分支 HEAD 隐式部署 |

当前工作分支基于 `edc1fd7`（003B closeout 文档对齐）；Gate B 前应以 **staging 验证通过的 exact commit** 为准。

---

## 13. DB migration / import 方案（Gate B 文档 · 未执行）

1. 创建 production 独立 database + 业务账号（仅 ECS 内网）
2. deploy 前 RDS 快照或手动备份
3. 写入 production `.env`（独立 `DATABASE_URL` · `ADMIN_PASSWORD_HASH` · `SESSION_SECRET`）
4. `pnpm prisma generate && pnpm db:migrate:deploy`
5. `pnpm style-admin:import-existing-variants:dry-run` → 审查
6. `pnpm style-admin:import-existing-variants`（首次 `ops:deploy:production ... --first-import`）
7. 记录 migration 版本与 import 摘要

**禁止：** 连接 staging DB · 复制 staging session secret · 公网暴露 PostgreSQL · 自动 drop/rebuild DB

---

## 14. Production env / Nginx / systemd 差异

**Production Prelaunch：** 首次 production 部署仅验证正式环境链路，**不代表公开发布**。全站 `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` + `/robots.txt Disallow: /`。解除 noindex 须独立发布动作（checklist Section I）。

| 维度 | staging | production（Prelaunch） |
|------|---------|-------------------------|
| `APP_ENV` | `staging` | `production` |
| `PORT` | 3001 | 3000 |
| `NODE_ENV` | `production` | `production` |
| systemd | `qingpian-wechat-editor-staging` | `qingpian-wechat-editor-production` |
| EnvironmentFile | `staging/.env` | `production/.env`（独立） |
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
| B1a `/api/version` | Gate A 代码就绪 · ECS 待验 | ☐ |
| B4 CloudMonitor/SLS | → **S11-STORY-005 Pending** | ☐ |
| C Admin 认证 | PASS | Gate B |
| D Admin 数据与治理 | PASS | Gate B |
| E 用户侧 DB pool | PASS | Gate B |
| F 安全 | 部分 | Gate B |
| 回滚演练 | Gate A 计划就绪 · ECS 待执行 | Gate B |
| 发布记录 | Gate B | Gate B |

---

## 16. Gate B 逐步操作指令（用户确认后）

1. 回填 [`production.md`](../../ops/environments/production.md) 域名、DNS、证书、DB 名、备份策略
2. 控制台创建 production DB + 账号 · RDS 白名单
3. 创建 `/opt/qingpian-wechat-editor/production` · 复制 `.env.example` 占位（**不入库**）
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
| AC-A1 staging `/api/version` | **Pending** | 待 ECS |
| AC-A2 Admin footer | **Pending** | 待 ECS |
| AC-A3 `ops:status:staging` | **Pending** | 待 ECS |
| AC-A4 staging redeploy | **Pending** | 待 ECS |
| AC-A5 staging rollback | **Pending** | 待 ECS |
| AC-A6 无 secret 泄漏 | **Pending** | 待 ECS |
| AC-A7 lint/build/test | **PASS** | 见下节 |
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

- ECS staging 全量 Gate A 验收（AC-A1~A6）
- 用户 commit / merge 本分支至 sprint
- Gate B production 全流程
- S11-STORY-005 监控告警
- S11-STORY-006 closeout

---

## 21. 需要用户 / ChatGPT 审查的问题

1. Gate A 代码是否可 commit 并 merge sprint（staging 验证前 vs 后）？
2. production 域名与 DB 命名是否采用建议值 `qingpian_style_admin_production`？
3. Gate B 目标 commit：固定 `8da62e9` 还是 Gate A merge 后的新 hash？
4. 既有 8 test failures 是否纳入 Sprint 11 尾项或顺延？

---

## 22. 建议下一步

1. **Commit** Gate A 变更至 `ops/s11-story-004-production-go-live`
2. 在 ECS 执行 staging deploy + rollback 演练（AC-A1~A6）
3. 通过后 merge sprint · 更新 Story 004 Gate A → Done
4. 用户确认后启动 **Gate B**（production 资源创建 + deploy）
5. 并行或后续启动 S11-STORY-005（B4 监控）

---

## 23. Commit

- Gate A commit hash：（本轮 commit 后填入）
- Message：`feat(s11-004): add environment ops and prelaunch production safeguards`
- **未 merge sprint** · **未启动 production**

## 24. 明确未执行

- production DNS 修改
- production 数据库 migration
- production systemd 启动
- production Nginx 切流
- production 上线（含 Prelaunch deploy）
- merge sprint
- merge `main`
- Sprint 11 closeout
- checklist Section I 公开发布阻断项（保持未勾选）
