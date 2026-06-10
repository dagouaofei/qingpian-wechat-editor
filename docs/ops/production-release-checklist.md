# 生产发布与验收清单

> S10-STORY-007 · 轻篇 style admin 上线验收

部署完成后逐项勾选。建议在 staging 先完整走一遍，再 production 执行。

> **Staging 验收摘要（2026-06-11 · `https://staging.qingpianai.cn`）：** Section A~E **PASS** · Section B4 / F / G 部分待办 · **production 未启动**  
> 详细登记见 [`environments/staging.md`](environments/staging.md) · 收口报告 [`2026-06-11-s11-staging-deployment-verification.md`](../agile/execution-reports/2026-06-11-s11-staging-deployment-verification.md)

---

## A. 部署前

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| A1 | RDS 已创建 · 白名单仅 ECS | ✅ | ☐ |
| A2 | ECS 已创建 · 安全组最小开放 | ✅ | ☐ |
| A3 | `DATABASE_URL` 已配置在 ECS（未入库） | ✅ | ☐ |
| A4 | `STYLE_ADMIN_*` 全套已配置（S10-STORY-008 前置） | ✅ | ☐ |
| A5 | `STYLE_ADMIN_PASSWORD_HASH` 由 `style-admin:hash-password` 生成 | ✅ | ☐ |
| A6 | `STYLE_ADMIN_SESSION_SECRET` 由 `openssl rand -base64 48` 生成 | ✅ | ☐ |
| A7 | `STYLE_ADMIN_WRITE_ENABLED` 策略已确认（生产默认 false 直至显式开启） | ✅ staging=`true` | ☐ |
| A8 | `pnpm db:migrate:deploy` 已在目标环境执行 | ✅ | ☐ |
| A9 | `pnpm style-admin:import-existing-variants` 已执行 | ✅ | ☐ |
| A10 | 无 secret 提交 Git | ✅ | ☐ |

---

## B. 基础设施

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| B1 | `GET /api/health` → `ok: true` · `database: ok` | ✅ | ☐ |
| B2 | HTTPS 反代正常（如 Nginx） | ✅ | ☐ |
| B3 | 进程守护（systemd / PM2）运行中 | ✅ | ☐ |
| B4 | CloudMonitor ECS / RDS 基础告警已配置 | ☐ 待 S11-STORY-005 | ☐ |

---

## C. Admin 认证（S10-STORY-008）

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| C1 | 未登录访问 `/admin/style-library` → 跳转 `/admin/login` | ✅ | ☐ |
| C2 | 错误密码登录失败 · 无配置细节泄漏 | ✅ | ☐ |
| C3 | 正确密码登录成功 · 进入 `/admin/style-library` | ✅ | ☐ |
| C4 | 顶栏显示当前管理员 · Logout 可用（POST-only） | ✅ | ☐ |
| C5 | Logout 后再次访问 `/admin/*` 须重新登录 | ✅ | ☐ |

---

## D. Admin 数据与治理（S10-STORY-004~006）

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| D1 | `/admin/style-library` 列表可读 DB variants | ✅ | ☐ |
| D2 | `/admin/style-library?userSelectable=true` filter 正常 | ✅ | ☐ |
| D3 | 详情页 distribution / version / timeline 可见 | ✅ | ☐ |
| D4 | Hide from user pool（reason 必填）成功 | ✅ | ☐ |
| D5 | Restore to user-selectable 成功 | ✅ | ☐ |
| D6 | Rollback last distribution change 成功 | ☐ 未测 / 可选 | ☐ |
| D7 | `copy_fidelity_failed` variant Restore **被阻止** | ☐ 未测 / 可选 | ☐ |
| D8 | audit actor = `admin:<username>`（非 `local-admin`） | ✅ | ☐ |
| D9 | 未登录调用写 action **失败**（`auth_required`） | ✅ | ☐ |

---

## E. 用户侧 DB Pool（S10-STORY-005）

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| E1 | `/preview` 小标题 picker 使用 DB pool（非长期 `code_fallback`） | ✅ | ☐ |
| E2 | Hide 后 1–5 分钟内 picker 选项消失（或同实例立即） | ☐ 未完整计时验收 | ☐ |
| E3 | Restore 后 picker 选项恢复 | ☐ 未完整计时验收 | ☐ |
| E4 | 用户选择 variant 后 Preview / Copy 生效 | ✅ preview 可见 | ☐ |
| E5 | `release1Required` / `defaultEligible` 未污染用户 pool | ✅ | ☐ |
| E6 | `copy_fidelity_failed` variants 不在用户 picker | ✅ | ☐ |

---

## F. 安全

| # | 检查项 | Staging | Production |
|---|--------|---------|------------|
| F1 | 页面 / API 响应无 `DATABASE_URL` · DB host · stack | ✅ | ☐ |
| F2 | 日志无 password · session secret · AccessKey | ✅ | ☐ |
| F3 | `/api/dev/style-admin/*` production 返回 404 disabled | N/A staging | ☐ |
| F4 | production 未配置 auth 时不可裸奔访问写操作 | ✅ staging 已配 auth | ☐ |

---

## G. 上线记录

| 字段 | Staging | Production |
|------|---------|------------|
| 发布日期 | 2026-06-11 | — |
| 环境 URL | `https://staging.qingpianai.cn` | — |
| Git ref | `sprint/s11-production-ops-go-live` @ `7fb4d9e` | — |
| migration 版本 | deploy 已执行 | — |
| import 报告摘要 | PASS | — |
| 验收人 | 用户 staging 人工验收 | — |
| 备注 | admin session bugfix @ `7f218e5` · AI 生成主链路待 Volcengine env | — |

---

## H. 已知 staging 待办（非 admin 阻塞）

| # | 项 | 状态 |
|---|-----|------|
| H1 | 首页 AI 生成主链路 · Volcengine provider env | ☐ 曾报「未配置真实 AI 模型」 |
| H2 | CloudMonitor / SLS 告警 | ☐ → S11-STORY-005 |
| H3 | OSS bucket | ☐ optional / 预留 |
