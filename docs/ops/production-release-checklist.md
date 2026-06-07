# 生产发布与验收清单

> S10-STORY-007 · 轻篇 style admin 上线验收

部署完成后逐项勾选。建议在 staging 先完整走一遍，再 production 执行。

---

## A. 部署前

| # | 检查项 | 状态 |
|---|--------|------|
| A1 | RDS 已创建 · 白名单仅 ECS | ☐ |
| A2 | ECS 已创建 · 安全组最小开放 | ☐ |
| A3 | `DATABASE_URL` 已配置在 ECS（未入库） | ☐ |
| A4 | `STYLE_ADMIN_*` 全套已配置（S10-STORY-008 前置） | ☐ |
| A5 | `STYLE_ADMIN_PASSWORD_HASH` 由 `style-admin:hash-password` 生成 | ☐ |
| A6 | `STYLE_ADMIN_SESSION_SECRET` 由 `openssl rand -base64 48` 生成 | ☐ |
| A7 | `STYLE_ADMIN_WRITE_ENABLED` 策略已确认（生产默认 false 直至显式开启） | ☐ |
| A8 | `pnpm db:migrate:deploy` 已在目标环境执行 | ☐ |
| A9 | `pnpm style-admin:import-existing-variants` 已执行 | ☐ |
| A10 | 无 secret 提交 Git | ☐ |

---

## B. 基础设施

| # | 检查项 | 状态 |
|---|--------|------|
| B1 | `GET /api/health` → `ok: true` · `database: ok` | ☐ |
| B2 | HTTPS 反代正常（如 Nginx） | ☐ |
| B3 | 进程守护（systemd / PM2）运行中 | ☐ |
| B4 | CloudMonitor ECS / RDS 基础告警已配置 | ☐ |

---

## C. Admin 认证（S10-STORY-008）

| # | 检查项 | 状态 |
|---|--------|------|
| C1 | 未登录访问 `/admin/style-library` → 跳转 `/admin/login` | ☐ |
| C2 | 错误密码登录失败 · 无配置细节泄漏 | ☐ |
| C3 | 正确密码登录成功 · 进入 `/admin/style-library` | ☐ |
| C4 | 顶栏显示当前管理员 · Logout 可用 | ☐ |
| C5 | Logout 后再次访问 `/admin/*` 须重新登录 | ☐ |

---

## D. Admin 数据与治理（S10-STORY-004~006）

| # | 检查项 | 状态 |
|---|--------|------|
| D1 | `/admin/style-library` 列表可读 DB variants | ☐ |
| D2 | `/admin/style-library?userSelectable=true` filter 正常 | ☐ |
| D3 | 详情页 distribution / version / timeline 可见 | ☐ |
| D4 | Hide from user pool（reason 必填）成功 | ☐ |
| D5 | Restore to user-selectable 成功 | ☐ |
| D6 | Rollback last distribution change 成功 | ☐ |
| D7 | `copy_fidelity_failed` variant Restore **被阻止** | ☐ |
| D8 | audit actor = `admin:<username>`（非 `local-admin`） | ☐ |
| D9 | 未登录调用写 action **失败**（`auth_required`） | ☐ |

---

## E. 用户侧 DB Pool（S10-STORY-005）

| # | 检查项 | 状态 |
|---|--------|------|
| E1 | `/preview` 小标题 picker 使用 DB pool（非长期 `code_fallback`） | ☐ |
| E2 | Hide 后 1–5 分钟内 picker 选项消失（或同实例立即） | ☐ |
| E3 | Restore 后 picker 选项恢复 | ☐ |
| E4 | 用户选择 variant 后 Preview / Copy 生效 | ☐ |
| E5 | `release1Required` / `defaultEligible` 未污染用户 pool | ☐ |
| E6 | `copy_fidelity_failed` variants 不在用户 picker | ☐ |

---

## F. 安全

| # | 检查项 | 状态 |
|---|--------|------|
| F1 | 页面 / API 响应无 `DATABASE_URL` · DB host · stack | ☐ |
| F2 | 日志无 password · session secret · AccessKey | ☐ |
| F3 | `/api/dev/style-admin/*` production 返回 404 disabled | ☐ |
| F4 | production 未配置 auth 时不可裸奔访问写操作 | ☐ |

---

## G. 上线记录

| 字段 | 值 |
|------|-----|
| 发布日期 | |
| 环境 | staging / production |
| Git ref | |
| migration 版本 | |
| import 报告摘要 | |
| 验收人 | |
| 备注 | |
