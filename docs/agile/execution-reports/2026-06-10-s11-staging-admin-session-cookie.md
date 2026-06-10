# Execution Report：S11 staging admin 登录态 / Server Action session 修复

## 1. 基本信息

- 日期：2026-06-10 ~ 2026-06-11
- 当前分支：`sprint/s11-production-ops-go-live`（bugfix 已 merge）
- 来源分支：`bugfix/s11-staging-admin-session-cookie`
- 目标合并分支：`sprint/s11-production-ops-go-live`
- Sprint：Sprint 11 — Production Ops Go-Live
- 关联 Story / Bug / Decision：S11 staging admin session bugfix（**非** S11-STORY-001~003 状态推进）
- 执行者：Cursor
- 状态：**Done**（staging 验收通过 · 用户确认 · bugfix 已 merge sprint）

## 2. 本轮目标

修复 staging HTTPS 部署下 admin 登录后执行治理操作跳回 `/admin/login?next=...` 的问题。

## 3. 执行范围

**已完成：**

- 登录改为 `POST /api/admin/login` Route Handler + 原生 form POST + `303 See Other`
- Logout 改为 `POST /api/admin/logout`；移除 `GET /admin/logout` 清 session 副作用
- Protected layout Logout 由 `<Link href="/admin/logout">` 改为 POST form（避免 RSC prefetch 自动登出）
- Proxy 感知 origin / secure cookie（`STYLE_ADMIN_PUBLIC_ORIGIN` · forwarded headers）
- Nginx example 补充 `X-Forwarded-Host` / `X-Forwarded-Port`
- `.env.example` 补充 `STYLE_ADMIN_PUBLIC_ORIGIN` 占位
- targeted tests + staging 线上验收
- bugfix merge → `sprint/s11-production-ops-go-live`

**明确未做：**

- 未推进 S11-STORY-001 / 002 / 003 状态
- 未启动 production 部署
- 未 merge main / release
- 未回填完整 ECS/RDS ops 环境文档
- 未关闭 auth / 未降低 cookie 安全属性
- 未记录任何 secret 值

## 4. 修改文件

- `src/app/admin/(auth)/login/admin-login-form.tsx`
- `src/app/admin/(auth)/login/actions.ts`
- `src/app/admin/(auth)/login/page.tsx`
- `src/app/admin/(protected)/layout.tsx`
- `src/server/style-admin/auth/admin-auth.ts`
- `deploy/nginx/staging.conf.example`
- `deploy/nginx/production.conf.example`
- `.env.example`
- `tests/app/admin/login/*`
- `tests/app/admin/logout/*`
- `tests/server/style-admin/auth/*`

## 5. 新增文件

- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/admin/(auth)/logout/page.tsx`（GET 确认页，无副作用）
- `src/server/style-admin/auth/admin-request-origin.ts`
- `src/server/style-admin/auth/admin-login-redirect.ts`
- `tests/app/admin/login/admin-login-route.test.ts`
- `tests/app/admin/logout/admin-logout-route.test.ts`
- `tests/app/admin/logout/admin-logout-ui.test.ts`
- `tests/server/style-admin/auth/admin-request-origin.test.ts`
- `tests/server/style-admin/auth/admin-next-path.test.ts`

## 6. 删除文件

- `src/app/admin/(auth)/logout/route.ts`（GET 清 session — 已移除）

## 7. 关键变更说明

### 根因（最终确认）

1. **GET `/admin/logout` 被 RSC prefetch 自动触发（主因）**  
   Protected layout 中 `<Link href="/admin/logout">` 导致登录后出现 `GET /admin/logout?_rsc=...`，旧 route handler 执行 `clearAdminSession()`，session 被 prefetch 清掉。

2. **登录 cookie 写入路径不可靠（已修复）**  
   原 client-side Server Action 登录改为 `POST /api/admin/login` + `303 See Other` POST-Redirect-GET。

3. **部署侧加重因素（已处理，不记录 secret）**  
   staging `STYLE_ADMIN_SESSION_SECRET` 曾配置错误，已更正并轮换。Network 证据表明 GET logout prefetch 是独立代码缺陷，logout POST-only 修复必须保留。

### 修复摘要

| 项 | 修复 |
|----|------|
| Login | `POST /api/admin/login` · Set-Cookie · `303` → `/admin/*` |
| Logout | `POST /api/admin/logout` 清 cookie · `303` → `/admin/login` |
| GET logout | 仅确认页，**不清 session** |
| Origin | `STYLE_ADMIN_PUBLIC_ORIGIN` + trusted forwarded headers |
| Nginx example | `X-Forwarded-Host` / `X-Forwarded-Port` / `X-Forwarded-Proto` |

## 8. Staging 验收结果（用户确认 · 2026-06-11）

| 验收项 | 结果 |
|--------|------|
| `GET /api/health` · database ok | PASS |
| `/admin/login` 登录成功 · cookie persisted | PASS |
| 刷新 `/admin/style-library` 仍保持登录 | PASS |
| Network 不再自动出现 `GET /admin/logout?_rsc=...` | PASS |
| Hide / Restore 不再跳回 login | PASS |
| Logout 按钮点击后才退出 | PASS |

## 9. 运行检查（merge 后 @ sprint）

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm test tests/app/admin/login tests/app/admin/logout tests/server/style-admin/auth/admin-request-origin.test.ts` | PASS | 20 tests |
| `corepack pnpm lint` | PASS | 0 errors（30 warnings · 既有） |
| `corepack pnpm build` | PASS | 含 `/api/admin/login` · `/api/admin/logout` |
| `corepack pnpm test`（全量） | FAIL（既有） | 2 failures · wechat-paste-qa-pack（与本轮无关） |

## 10. 未完成事项

- production 部署（本轮明确不做）
- S11 Story 状态推进（本轮明确不做）
- 全量 test 既有 2 failures 清理（非本轮范围）

## 11. 风险与阻塞

- staging 须配置 `STYLE_ADMIN_PUBLIC_ORIGIN=https://staging.qingpianai.cn`（推荐）
- `STYLE_ADMIN_SESSION_SECRET` 轮换后须 restart 应用
- 全量 wechat-paste-qa-pack test 仍 fail（pre-existing）

## 12. 需要用户 / ChatGPT 审查的问题

- 无（staging 验收 PASS · bugfix 已 merge sprint）

## 13. 建议下一步

1. 用户确认是否 push `sprint/s11-production-ops-go-live` 至远端
2. 继续 S11 其它 story（**非**本轮范围）
3. production 部署待 S11 staging 全量 checklist 完成后单独执行

## 14. Commit

| 项 | Hash |
|----|------|
| Bugfix 首 commit | `e9983c2` |
| Execution report | `dbfddfe` |
| Login 303 | `a3df36f` |
| Logout POST-only | `79664f2` |
| **Merge → sprint** | **`7f218e5`** |
| Docs 验收记录 | （本轮 docs commit · 见交付摘要） |

## 15. Git 状态

- **已 merge**：`bugfix/s11-staging-admin-session-cookie` → `sprint/s11-production-ops-go-live`
- **未 merge**：main / release
- **未 push**：待用户确认
