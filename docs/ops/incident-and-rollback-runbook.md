# 故障处理与回滚 Runbook

> S10-STORY-007 · 轻篇 style admin

---

## 1. 应用代码回滚

**场景：** 新版本引入 bug · 需回到上一已知良好版本。

```text
1. 在 ECS 切换到上一 Git tag / commit
2. corepack pnpm install --frozen-lockfile
3. corepack pnpm prisma generate
4. corepack pnpm build
5. 重启进程（systemd / PM2）
6. GET /api/health 确认
7. /admin/style-library 冒烟
```

**注意：** 若新版本包含 **不可逆 migration**，仅回滚代码可能不够 · 见 §2。

---

## 2. DB Migration 出错

**场景：** `prisma migrate deploy` 失败或 migration 后应用异常。

| 步骤 | 操作 |
|------|------|
| 1 | **停止**继续 deploy · 不要重复盲跑 |
| 2 | 查看 Prisma / RDS 错误日志（**勿**将连接串贴到公开渠道） |
| 3 | 若 migration 未提交：修复 migration 后在 staging 重试 |
| 4 | 若 migration 已部分应用：按 Prisma 文档评估 `migrate resolve` · 或 RDS 快照恢复 |
| 5 | 恢复后重新 `db:migrate:deploy` |

**原则：** production migration 前必须在 staging 用**同源 schema** 验证。

---

## 3. Import 出错

**场景：** `style-admin:import-existing-variants` 失败或数据异常。

| 步骤 | 操作 |
|------|------|
| 1 | 先 `style-admin:import-existing-variants:dry-run` 查看报告 |
| 2 | 修复 `DATABASE_URL` / 网络 / 权限问题 |
| 3 | import 幂等 · 可安全重跑 |
| 4 | 若数据严重污染：从 RDS 备份恢复后重跑 migration + import |

---

## 4. Admin 写错 Distribution

**场景：** 误 Hide / 误 Mark deprecated。

| 操作 | 说明 |
|------|------|
| **Rollback last distribution change** | 详情页 governance · 须 reason · 恢复上一 audit 快照 |
| **Restore to user-selectable** | 若 qualityStatus 非阻塞 |
| **临时关闭写操作** | `STYLE_ADMIN_WRITE_ENABLED=false` + 重启应用 |

audit 查询：`admin_audit_logs` · `style_variant_rollback_records`。

---

## 5. RDS 无法连接

**现象：** `/api/health` → `database: unavailable` · admin 列表 db_unavailable。

| 排查 | 操作 |
|------|------|
| 网络 | ECS → RDS 安全组 / 白名单是否包含 ECS 内网 IP |
| 凭证 | `DATABASE_URL` 账号密码是否轮换后未更新 |
| RDS 状态 | 控制台实例是否 Running · 存储是否满 |
| 连接数 | RDS 连接数是否打满 · 重启应用释放泄漏连接 |

用户侧表现：pool 可能 fallback `code_fallback`（仅 DB 不可用）· picker 与 admin 数据不一致。

---

## 6. `/admin` 无法登录

| 排查 | 操作 |
|------|------|
| 未配置 | 检查 `STYLE_ADMIN_USERNAME` / `PASSWORD_HASH` / `SESSION_SECRET` |
| 密码错误 | 重新 `style-admin:hash-password` · 更新 env · 重启 |
| Cookie | production 须 HTTPS · `secure` cookie · 检查反代 `X-Forwarded-Proto` |
| Session 过期 | 调整 `STYLE_ADMIN_SESSION_TTL_SECONDS` 或重新登录 |

---

## 7. User Pool 为空

**现象：** `/preview` picker 无选项 · dev API 或 admin 显示 pool 空但 DB 有 variants。

| 排查 | 操作 |
|------|------|
| Import | 是否执行 `style-admin:import-existing-variants` |
| Distribution | admin 是否误 Hide / deprecated 全部 userSelectable |
| Gate | `copy_fidelity_failed` · hidden · deprecated 排除 |
| Cache | 等待 TTL（≤300s）或重启单实例刷新 |
| DB | `GET /api/health` 确认 `database: ok` |

---

## 8. Copy Renderer 找不到 Variant

**现象：** 用户选了 picker 项但 Preview / Copy 异常。

| 排查 | 操作 |
|------|------|
| Registry | variant 是否在 code registry 有定义（DB pool 项须能映射到 renderer） |
| quality | `copy_fidelity_failed` 不应进入 pool · 若出现则为 gate bug |
| 登记 | 已知 Copy Fidelity bug：BUG-S10-COPY-FIDELITY-001/002 |

---

## 9. 临时关闭写操作

无需下线只读 admin：

```env
STYLE_ADMIN_WRITE_ENABLED=false
```

重启应用后：

- `/admin/style-library` 只读仍可访问（已登录）
- Hide / Restore / Rollback 等写操作被拒绝
- 读操作与 `/preview` 不受影响

---

## 10. 紧急联系与记录

| 项 | 建议 |
|----|------|
| 告警 | CloudMonitor → 钉钉 / 邮件 / 短信 |
| 事件记录 | `runtime_error_logs` · `alert_events` · 运维笔记 |
| 事后 | 更新本 runbook · sprint bugs / decisions |

---

## 11. 相关文档

- [`aliyun-deployment-runbook.md`](aliyun-deployment-runbook.md)
- [`production-release-checklist.md`](production-release-checklist.md)
- [`environment-variables.md`](environment-variables.md)
