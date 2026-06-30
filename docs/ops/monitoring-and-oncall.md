# 监控、报警与 On-Call

> S11-STORY-005 · 轻篇 style admin · Production Prelaunch @ `385422d`

事件当前 **先入 PostgreSQL**（`admin_audit_logs` · `runtime_error_logs` · `alert_events`）；SLS SDK 全量接入可后置。

**最小闭环（本 Story）：** `pnpm ops:observe:{staging,production}` · 详见 [`s11-story-005-monitoring-observation.md`](../agile/s11-story-005-monitoring-observation.md) · [`production-prelaunch-observation-checklist.md`](production-prelaunch-observation-checklist.md)

---

## 1. 告警分级

| 级别 | 条件 | 通知策略 | 示例 |
|------|------|----------|------|
| **P0** | 服务不可用或数据面不可信 | **立即**（短信/电话/IM） | systemd down · health fail · database≠ok · HTTPS 不可用 |
| **P1** | degraded 或 Prelaunch 安全漂移 | 工作时间内尽快 | TLS <14 天 · NRestarts>10 · 磁盘/内存>85% · Basic Auth/noindex 失效 |
| **P2** | 信息性 / 未接入 | 记录 · 下一 Sprint | observe WARN · CloudMonitor 未配置 · alert_events 人工抽查 |

**降噪原则：** 正常 `ops:observe` **PASS 不通知**；仅失败时告警（cron + exit code / CloudMonitor）。

---

## 2. 应用内检查（ECS localhost）

| 检查 | 命令/路径 | P0 |
|------|-----------|-----|
| systemd | `systemctl is-active qingpian-wechat-editor-production` | ✓ |
| health | `GET http://127.0.0.1:3000/api/health` → `ok:true` · `database:ok` | ✓ |
| version | `GET http://127.0.0.1:3000/api/version` → `environment:production` · `gitSha` | P1 |
| 汇总脚本 | `pnpm ops:observe:production` | — |

**禁止：** 脚本输出 `DATABASE_URL` · session secret · Basic Auth 密码。

---

## 3. HTTP 入口（公网 · production）

**URL：** https://paiban.aiqingpian.cn（`qingpianai.cn` 未备案未使用）

| 检查 | 期望 | 级别 |
|------|------|------|
| HTTP→HTTPS | 301/302 → https | P0 |
| Basic Auth | 无凭证 **401** | P1（Prelaunch 必须） |
| X-Robots-Tag | 含 `noindex` | P1 |
| robots.txt | `Disallow: /` | P1 |
| TLS 证书 | 有效期 >14 天 | P1 |

由 `observe-checks.sh` 自动验证（无凭证 curl · 不打印 secret）。

---

## 4. 资源（ECS）

| 指标 | 来源 | 阈值建议 | 级别 |
|------|------|----------|------|
| load average | `/proc/loadavg` | 记录 | P2 |
| 内存 | `free -m` | >85% 持续 5min | P1 |
| 磁盘 `/` | `df -h` | >85% | P1 |
| NRestarts | `systemctl show NRestarts` | >10 | P1 |
| 错误日志 | `journalctl -u … -p err -n 5` | 新模式 | P1 |

observe 脚本输出摘要行；CloudMonitor 规则见 §6。

---

## 5. 应用内 alert_events（S10-STORY-006）

| 事件类型 | 触发场景 | 验证方式 |
|----------|----------|----------|
| `admin_write_failed` | 写操作失败 | ☐ staging/production 模拟 |
| `variant_restore_blocked_by_quality` | quality 阻塞 restore | ☐ 已知 variant |

查询：`alert_events` 表 · Admin timeline。

---

## 6. CloudMonitor 建议规则（后续接入 · 非本轮部署）

### ECS

| 规则 | 阈值建议 | 通知 |
|------|----------|------|
| CPU 使用率 | > 80% · 5 分钟 | ☐ |
| 内存使用率 | > 85% · 5 分钟 | ☐ |
| 磁盘使用率 | > 85% | ☐ |
| 进程不存在 | systemd 探测失败 | ☐ |

### RDS

| 规则 | 阈值建议 | 通知 |
|------|----------|------|
| CPU 使用率 | > 80% | ☐ |
| 连接数 | > 最大连接 80% | ☐ |
| 磁盘空间 | > 85% | ☐ |

规则 ID 回填至 [`environments/staging.md`](environments/staging.md) · [`environments/production.md`](environments/production.md)。

**轻量先行方案：** ECS cron 每 15min 运行 `ops:observe:production` · 失败 `logger -t qingpian-observe`。

---

## 7. SLS（预留）

| 项 | staging | production |
|----|---------|------------|
| Project | ☐ | ☐ |
| Logstore | ☐ | ☐ |
| 采集 Agent / SDK | ☐ 未接入 | ☐ 未接入 |

---

## 8. On-Call

| 项 | 值 |
|----|-----|
| 主负责人 | ☐ 待填 |
| 备份联系人 | ☐ |
| 升级路径 | ☐ |
| 故障 Runbook | [`incident-and-rollback-runbook.md`](incident-and-rollback-runbook.md) |
| 回滚演练基线 commit | `2f09b0d` |
| 当前 production commit | `385422d` |

---

## 9. Prelaunch 观察节点

| 节点 | 文档 |
|------|------|
| T+0 | [`production-prelaunch-observation-checklist.md`](production-prelaunch-observation-checklist.md) §2 — **已完成** |
| T+24h | §3 |
| T+72h | §4 |

---

## 10. 相关架构

详见 [`style-management-admin-v1.md`](../architecture/style-management-admin-v1.md) §6.5。
