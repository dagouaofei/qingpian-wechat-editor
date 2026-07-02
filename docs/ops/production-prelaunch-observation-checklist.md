# Production Prelaunch 观察清单

> S11-STORY-005 · Production **Prelaunch**（非正式公开上线）  
> **URL：** https://paiban.aiqingpian.cn · **deploy commit：** `385422d`  
> **回滚演练基线：** `2f09b0d` · **当前恢复版本：** `385422d`

---

## 0. 约束（观察期不得违反）

- **不得移除** Nginx Basic Auth
- **不得移除** `X-Robots-Tag: noindex,nofollow,noarchive,nosnippet` 与 `/robots.txt Disallow: /`
- **不得** 将 Prelaunch 宣称为正式公开上线
- **不得** 执行 governance snapshot apply
- **不得** 修改 production variant 数据（除已验收的人工治理项）
- **不得** merge `main` / `release/1`（→ Sprint 11 Closeout 单独决策）

**域名说明：** 原计划 `qingpianai.cn` 因 **未备案** 未继续使用；Production 使用 **`paiban.aiqingpian.cn`**。

---

## 1. 自动化检查（ECS 上执行）

```bash
# 基线状态（信息性）
pnpm ops:status:production

# 严格观察（失败 exit 1 · 无 secret 输出）
pnpm ops:observe:production
```

**覆盖：** systemd · `/api/health` · `/api/version` · gitSha · database=ok · CPU/内存/磁盘摘要 · NRestarts · 24h 错误日志摘要 · HTTP→HTTPS · TLS 有效期 · Basic Auth(401) · noindex · robots.txt

**建议 cron（示例 · 每 15 分钟 · 仅失败时通知）：**

```cron
*/15 * * * * cd /opt/qingpian-wechat-editor/production && /usr/bin/flock -n /tmp/qingpian-production-observe.lock bash -lc 'export PATH=/usr/local/bin:/usr/bin:/bin; corepack pnpm ops:observe:production || logger -t qingpian-observe "production observe FAILED"'
```

正常 PASS **不发送消息**；FAIL 写入 syslog / 后续接入 CloudMonitor（S11-STORY-005 后续部署阶段）。

---

## 2. T+0（部署完成 · 人工）

| #    | 检查项                                         | 期望           | ☐   |
| ---- | ---------------------------------------------- | -------------- | --- |
| O0-1 | `pnpm ops:observe:production`                  | 全部 PASS      |     |
| O0-2 | 首页 HTTPS 可访问（经 Basic Auth）             | 200            |     |
| O0-3 | Admin 登录                                     | PASS           |     |
| O0-4 | Style Library / Preview / 生成 / SSE / 复制    | PASS           |     |
| O0-5 | `heading_highlight_marker` userSelectable=true | 已确认         |     |
| O0-6 | `/api/version` gitSha 与 deploy commit 一致    | `385422d` 前缀 |     |

**异常处理：** 见 [`incident-and-rollback-runbook.md`](incident-and-rollback-runbook.md)  
**回滚入口：** `pnpm ops:rollback:production -- 2f09b0d --confirm-production`（演练已验证 · DB 数据保留）

---

## 3. T+24h 观察节点

| #     | 检查项                          | 期望                          | ☐   |
| ----- | ------------------------------- | ----------------------------- | --- |
| O24-1 | `pnpm ops:observe:production`   | PASS                          |     |
| O24-2 | systemd NRestarts               | 无异常激增（>10 需调查）      |     |
| O24-3 | journalctl 24h 错误             | 无新增 P0 模式                |     |
| O24-4 | RDS / 磁盘 / 内存               | 无持续 >85%                   |     |
| O24-5 | 首页生成 + SSE 打字机           | 至少 1 次人工抽测 PASS        |     |
| O24-6 | Admin 写操作（非 variant 批量） | 无 5xx                        |     |
| O24-7 | Basic Auth + noindex 仍生效     | curl 401 / noindex / Disallow |     |

**记录：** 日期 · 执行人 · observe 输出摘要 · 异常与处置

---

## 4. T+72h 观察节点

> **Completed** · **2026-07-01** · Sprint 11 Closing Evidence · [`sprint11-closeout.md`](../agile/sprint11-closeout.md) §8～§9

| #     | 检查项              | 期望                                     | 结果     |
| ----- | ------------------- | ---------------------------------------- | -------- |
| O72-1 | T+24h 全部项复测    | PASS                                     | **PASS** |
| O72-2 | TLS 证书有效期      | >14 天（observe 自动检查）               | **OK**   |
| O72-3 | Certbot 续期任务    | 存在且未报错                             | **OK**   |
| O72-4 | 回滚路径仍可用      | 文档 + 脚本未漂移                        | **OK**   |
| O72-5 | deferred 项未误执行 | 无 governance apply · 无 P1-S11-001 变更 | **OK**   |

**T+72h `ops:observe:production` 摘要（2026-07-01）：**

| 检查项                | 结果     |
| --------------------- | -------- |
| OBSERVE               | **OK**   |
| Health                | **OK**   |
| Database              | **OK**   |
| HTTPS                 | **OK**   |
| TLS                   | **OK**   |
| NRestarts             | **0**    |
| Recent service errors | **none** |

**通过后：** 可进入 S11-STORY-005 服务器侧告警接入审查；**仍不**解除 Prelaunch 防爬 / Basic Auth。

---

## 5. 告警分级（摘要）

完整策略见 [`monitoring-and-oncall.md`](monitoring-and-oncall.md) · [`s11-story-005-monitoring-observation.md`](../agile/s11-story-005-monitoring-observation.md)。

| 级别   | 示例                                                    | 通知               |
| ------ | ------------------------------------------------------- | ------------------ |
| **P0** | systemd down · health fail · database≠ok · HTTPS 不可用 | **立即**           |
| **P1** | NRestarts 激增 · 磁盘>85% · TLS <14 天 · 持续 5xx       | 工作时间内尽快     |
| **P2** | 单次 observe WARN · CloudMonitor 未配置                 | 记录 · 下一 Sprint |

---

## 6. Deferred（观察期不处理）

- P1-S11-001 Dev/Staging/Production DB 同步方案
- governance snapshot apply
- staging 独有 2 条测试 variant 迁移
- `import-existing-variants` 路径审计
