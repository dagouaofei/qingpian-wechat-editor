# S11-STORY-005：Production Monitoring, Alerting & Observation

> **状态：** In Progress · **分支：** `ops/s11-story-005-monitoring-observation`  
> **前置：** S11-STORY-004 **Done** · Production Prelaunch @ `385422d`

---

## 1. 目标

在 **轻量、低成本** 前提下建立 Production Prelaunch **最小可运行监控闭环**：复用现有 ops 状态脚本，新增严格观察脚本与文档化告警分级；**本轮仅提交仓库设计与脚本，服务器部署待审查后执行**。

---

## 2. 架构原则

| 原则           | 实现                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| 不重复状态逻辑 | `observe-environment.sh` 先调用 `status-environment.sh`，再跑 strict checks |
| 环境参数化     | `staging \| production` · 与 deploy/status/rollback 一致                    |
| Fail closed    | 异常 `exit 1` · 正常一行 `OBSERVE OK` 摘要                                  |
| 无 secret      | 不 `source` env 内容 · 不输出 `DATABASE_URL` / session / password           |
| 低成本告警     | 优先 cron + `observe` exit code + syslog；CloudMonitor 为 P1 增强项         |

---

## 3. 监控面

### 3.1 应用存活

| 信号                       | 来源                  | P0                          |
| -------------------------- | --------------------- | --------------------------- |
| systemd active             | `systemctl is-active` | ✓                           |
| `/api/health` ok=true      | localhost curl        | ✓                           |
| `/api/health` database=ok  | localhost curl        | ✓                           |
| `/api/version` environment | localhost curl        | ✓                           |
| Production gitSha          | `/api/version`        | P1（与 deploy commit 漂移） |

### 3.2 HTTP 入口（公网）

| 信号                 | 方法                   | P0/P1                    |
| -------------------- | ---------------------- | ------------------------ |
| HTTP→HTTPS           | `curl -I http://host/` | P0                       |
| HTTPS 可达           | status line            | P0                       |
| Basic Auth           | 无凭证应 401           | P1（Prelaunch 必须保持） |
| X-Robots-Tag noindex | response header        | P1                       |
| robots.txt Disallow  | body                   | P1                       |
| TLS 有效期           | openssl x509           | P1（<14 天）             |

**Production 公网 URL：** `https://paiban.aiqingpian.cn`（`qingpianai.cn` 未备案未使用）

### 3.3 资源

| 信号         | 来源                       | 级别         |
| ------------ | -------------------------- | ------------ |
| load average | `/proc/loadavg`            | P2 记录      |
| 内存使用率   | `free -m`                  | P1 >85% 持续 |
| 根磁盘       | `df -h /`                  | P1 >85%      |
| NRestarts    | `systemctl show NRestarts` | P1 >10       |
| 24h 错误日志 | `journalctl -p err -n 5`   | P1 调查      |

### 3.4 应用内 alert_events

保留 S10-STORY-006 PostgreSQL 表；本 Story **不新增 SDK**。查询与 Admin timeline 为 P2 人工抽查项。

---

## 4. 告警策略

### P0 — 立即通知

- systemd 非 active
- `/api/health` 不可达或 `ok!=true`
- `database!=ok`
- HTTPS 公网不可达
- HTTP 无法跳转 HTTPS

**动作：** 按 [`incident-and-rollback-runbook.md`](../ops/incident-and-rollback-runbook.md) · 可回滚至 `2f09b0d`

### P1 — 工作时间内尽快

- TLS 14 天内过期
- NRestarts >10
- 磁盘/内存持续 >85%
- Basic Auth / noindex / robots 失效
- gitSha 与预期 deploy commit 不一致

### P2 — 记录 / 下一迭代

- 单次 observe WARN
- CloudMonitor / SLS 未创建
- alert_events 未 UI 化

**降噪：** cron 仅 `observe` **失败**时 `logger` / 短信；成功不通知。

---

## 5. 脚本与命令

| 命令                          | 用途                       |
| ----------------------------- | -------------------------- |
| `pnpm ops:status:production`  | 基线摘要（deploy 后同款）  |
| `pnpm ops:observe:production` | **严格**观察 · 失败 exit 1 |
| `pnpm ops:observe:staging`    | staging 同款               |

**实现文件：**

- `scripts/ops/observe-environment.sh` — 入口
- `scripts/ops/observe-checks.sh` — strict 检查函数
- `scripts/ops/common.sh` — `OPS_PUBLIC_URL` per env

---

## 6. Prelaunch 观察

详见 [`production-prelaunch-observation-checklist.md`](../ops/production-prelaunch-observation-checklist.md)：

- **T+0** 部署验收（已完成 · 用户确认）
- **T+24h** 自动化 + 人工抽测（已纳入 T+72h Closing Evidence）
- **T+72h** 复测 + Certbot + deferred 项确认 — **Completed**（2026-07-01 · [`sprint11-closeout.md`](sprint11-closeout.md) §8～§9）

---

## 7. 本轮范围外

- 移除 Basic Auth / noindex
- 正式公开上线
- governance apply · P1-S11-001
- production variant 数据变更
- CloudMonitor 控制台创建（文档预留 · 服务器部署阶段）
- merge `main` / `release/1`

---

## 8. 验收标准（Story 005）

- [x] AC-1 技术方案文档（本文）
- [x] AC-2 `ops:observe:{staging,production}` 脚本 + 复用 status
- [x] AC-3 告警 P0/P1/P2 与 Prelaunch observation checklist
- [x] AC-4 脚本 wiring 测试 · lint · build
- [ ] AC-5 ECS cron / CloudMonitor 接入（**待审查后部署**）
- [x] AC-6 T+72h 观察记录归档（2026-07-01 · Production Observation **Completed** · ECS cron 仍 **Open** → **P1-S11-002**）

---

## 9. 相关文档

- [`monitoring-and-oncall.md`](../ops/monitoring-and-oncall.md)
- [`environments/production.md`](../ops/environments/production.md)
- DECISION-112 · DECISION-113
