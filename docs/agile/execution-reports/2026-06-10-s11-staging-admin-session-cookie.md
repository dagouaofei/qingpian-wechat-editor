# Execution Report：S11 staging admin 登录态 / Server Action session 修复

## 1. 基本信息

- 日期：2026-06-10
- 当前分支：`bugfix/s11-staging-admin-session-cookie`
- 来源分支：`sprint/s11-production-ops-go-live`
- 目标合并分支：`sprint/s11-production-ops-go-live`
- Sprint：Sprint 11 — Production Ops Go-Live
- 关联 Story / Bug / Decision：S11 staging admin 登录态问题（staging 部署验收阻塞）
- 执行者：Cursor
- 状态：**In Review**

## 2. 本轮目标

修复 staging HTTPS 部署下：admin 登录后进入 `/admin/style-library`，执行治理 Server Action 时被 `(protected)/layout` 误判未登录并重定向至 `/admin/login?next=...` 的问题。

## 3. 执行范围

**已完成：**

- 定位根因：登录使用 client-side `startTransition` + Server Action `setCookie + redirect`，session cookie 未稳定写入浏览器；后续 Server Action POST 无 cookie → `getCurrentStyleAdmin()` 为 null → layout redirect
- 登录改为 **原生 HTML form POST** → **`POST /api/admin/login` Route Handler**，在 `NextResponse.redirect` 上显式 `Set-Cookie`
- 新增 proxy 感知工具：`resolveAdminPublicOriginFromRequest` / `resolveAdminSessionCookieSecure`
- `setAdminSessionCookie` / `clearAdminSession` 使用 forwarded proto 决定 `secure`
- `(protected)/layout.tsx` 增加 `dynamic = "force-dynamic"`
- 更新 `deploy/nginx/{staging,production}.conf.example`：补 `X-Forwarded-Host` / `X-Forwarded-Port`
- 新增 targeted tests（login route · request origin · login action）

**明确未做：**

- 未 merge sprint / release / main
- 未 commit（待用户审查）
- 未在 ECS 上实际部署验证
- 未修改 governance Server Action 业务逻辑
- 未关闭 auth / 未降低 cookie 安全属性

## 4. 修改文件

- `src/app/admin/(auth)/login/admin-login-form.tsx`
- `src/app/admin/(auth)/login/actions.ts`
- `src/app/admin/(auth)/login/page.tsx`
- `src/app/admin/(protected)/layout.tsx`
- `src/server/style-admin/auth/admin-auth.ts`
- `deploy/nginx/staging.conf.example`
- `deploy/nginx/production.conf.example`
- `tests/app/admin/login/admin-login-action.test.ts`

## 5. 新增文件

- `src/app/api/admin/login/route.ts`
- `src/server/style-admin/auth/admin-request-origin.ts`
- `tests/app/admin/login/admin-login-route.test.ts`
- `tests/server/style-admin/auth/admin-request-origin.test.ts`

## 6. 阅读但未修改的关键文件

- `src/middleware.ts`
- `src/app/admin/(protected)/style-library/actions.ts`
- `src/server/style-admin/actions/distribution-governance.ts`
- `docs/ops/incident-and-rollback-runbook.md`

## 7. 关键变更说明

### 根因

1. **登录 cookie 未持久化（主因）**  
   原 `admin-login-form.tsx` 使用 `event.preventDefault()` + `startTransition` + `await loginAdminAction()`（fetch 型 Server Action）。在该路径下 `setAdminSessionCookie()` + `redirect()` 组合，浏览器侧 **常常收不到稳定 `Set-Cookie`**。  
   同一 Server Action 响应内仍可能渲染已登录 RSC（内存态 cookie），因此用户 **看起来** 能进入 `/admin/style-library`（含 “Signed in as …” header）。

2. **后续 Server Action 无 session**  
   治理操作（Hide / Restore 等）触发新的 Server Action POST。请求无 `style_admin_session` cookie → `requireStyleAdmin()` 失败；同时 RSC 刷新重跑 `(protected)/layout.tsx` → `redirect('/admin/login?next=...')`。  
   这与用户观察到的 `next=%2Fadmin%2Fstyle-library` 完全一致。

3. **次要因素（已加固）**  
   - Nginx 反代下 redirect 应使用 `X-Forwarded-Proto` / `X-Forwarded-Host` 构造公网 origin  
   - `Failed to find Server Action` 提示 stale build，建议部署时 clean rebuild（见 ECS 步骤）

### 修复

- 登录表单：`method="POST" action="/api/admin/login"`（top-level navigation POST，非 client fetch）
- Route Handler：验证凭证 → `NextResponse.redirect(publicOrigin + next)` + `response.cookies.set(...)`
- Cookie 仍为 `httpOnly` / `sameSite=lax` / production `secure` / `path=/`
- **`next` open redirect 防护：** `sanitizeAdminNextPath` + `buildAdminLoginRedirectUrl` 双重校验（拒绝 `://`、`//`、`\`、编码绕过；仅允许 `/admin/*`）
- **Origin 防污染：** 优先 `STYLE_ADMIN_PUBLIC_ORIGIN`；否则仅当 `x-forwarded-proto=https` 且 host 格式合法时使用 `x-forwarded-host`；永不单独信任 `Host`；fallback 为 `request.nextUrl.origin`

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 登录后进入 style-library | PASS（代码） | 待 staging 人工复验 |
| 治理操作不再跳 login | PASS（代码） | 依赖 cookie 持久化修复 |
| 未登录 `/admin/*` 仍跳 login | PASS | layout 守卫未改逻辑 |
| 不降低 admin 安全性 | PASS | cookie 属性未放宽 |
| targeted tests | PASS | 9 tests |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm test tests/app/admin/login tests/server/style-admin/auth/admin-request-origin.test.ts` | PASS | 9 tests |
| `corepack pnpm build` | PASS | 含 `/api/admin/login` |
| `corepack pnpm lint` | PASS | 0 errors（既有 warnings） |
| `corepack pnpm test`（全量） | FAIL（既有） | 2 failures in wechat-paste-qa-pack（与本轮无关） |

## 10. 未完成事项

- staging ECS 部署与人工验收
- 用户 / ChatGPT 审查后 commit
- 合并回 sprint 分支（需用户确认）

## 11. 风险与阻塞

- 若 ECS Nginx 未配置 `X-Forwarded-Host` / `X-Forwarded-Proto`，redirect 可能仍指向内网 origin（已在 nginx example 补全）
- 若存在 stale `.next` build，仍可能出现 “Failed to find Server Action”；需 clean rebuild
- `STYLE_ADMIN_WRITE_ENABLED` 未开启时治理操作会返回 write_disabled（非 login 跳转）——属预期

## 12. 需要用户 / ChatGPT 审查的问题

- 登录入口从 Server Action 改为 `/api/admin/login` POST；是否接受该 API 路径（非页面路由，无 page/route 冲突）
- staging 复验后是否合并 sprint 分支

## 13. 建议下一步

1. 用户审查 diff
2. ECS 执行 clean rebuild + restart（见下方命令）
3. staging 复验：登录 → DevTools Application → 确认 `style_admin_session` cookie → 执行 Hide/Restore
4. 通过后 commit + merge `sprint/s11-production-ops-go-live`

## 14. Commit

- Commit hash：`e9983c2`
- 未 merge（待用户确认）
