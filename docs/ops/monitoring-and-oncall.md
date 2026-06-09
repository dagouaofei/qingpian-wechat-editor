# 监控、报警与 On-Call

> S11-STORY-005 · 轻篇 style admin

事件当前 **先入 PostgreSQL**（`admin_audit_logs` · `runtime_error_logs` · `alert_events`）；SLS SDK 全量接入可后置 Sprint 12。

---

## 1. CloudMonitor 建议规则（ECS）

| 规则 | 阈值建议 | 通知 |
|------|----------|------|
| CPU 使用率 | > 80% · 5 分钟 | ☐ 短信/邮件 |
| 内存使用率 | > 85% · 5 分钟 | ☐ |
| 磁盘使用率 | > 85% | ☐ |
| 进程不存在 | systemd/PM2 探测失败 | ☐ |

## 2. CloudMonitor 建议规则（RDS）

| 规则 | 阈值建议 | 通知 |
|------|----------|------|
| CPU 使用率 | > 80% | ☐ |
| 连接数 | > 最大连接 80% | ☐ |
| 磁盘空间 | > 85% | ☐ |

规则 ID 回填至 [`environments/staging.md`](environments/staging.md) · [`environments/production.md`](environments/production.md)。

---

## 3. 应用内 alert_events（S10-STORY-006）

| 事件类型 | 触发场景 | 验证方式 |
|----------|----------|----------|
| `admin_write_failed` | 写操作失败 | ☐ staging 模拟 |
| `variant_restore_blocked_by_quality` | quality 阻塞 restore | ☐ `copy_fidelity_failed` variant |

查询：`alert_events` 表 · Admin 详情 timeline（如有 UI）。

---

## 4. SLS（预留）

| 项 | staging | production |
|----|---------|------------|
| Project | ☐ | ☐ |
| Logstore | ☐ | ☐ |
| 采集 Agent / SDK | ☐ 未接入 | ☐ 未接入 |

---

## 5. On-Call

| 项 | 值 |
|----|-----|
| 主负责人 | ☐ 待填 |
| 备份联系人 | ☐ |
| 升级路径 | ☐ |
| 故障 Runbook | [`incident-and-rollback-runbook.md`](incident-and-rollback-runbook.md) |

---

## 6. 健康检查

- 外部探测：`GET /api/health` 期望 `ok: true` · `database: ok`
- 建议频率：1~5 分钟（CloudMonitor 站点监控或自建）

---

## 7. 相关架构

详见 [`style-management-admin-v1.md`](../architecture/style-management-admin-v1.md) §6.5（S11 完成后更新为「已配置」）。
