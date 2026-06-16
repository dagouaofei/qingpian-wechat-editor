# Sprint 11：Production Ops Go-Live（正式部署与运维上线）

> **分支：** `sprint/s11-production-ops-go-live`（从 `release/1`）  
> **状态：** **In Progress**（2026-06-08 启动 · **DECISION-111** · **staging 阶段验收完成 2026-06-11** · production 未启动）  
> **前置：** Sprint 10 Closed（S10-STORY-001~011 · runbook + admin 登录代码已就绪）

---

## 1. Sprint Goal

轻篇 style admin v1 在 **staging 完整验收** 后 **production 上线**：

```text
阿里云资源（ECS / RDS / OSS / SLS / CloudMonitor）
  → staging 部署 + DB migrate + import
  → staging admin 登录 + 治理 + 用户侧 DB pool 验收
  → production 部署 + HTTPS
  → 监控报警 + 回滚演练
  → Sprint 11 Closeout
```

**环境策略：** staging 先走 [`production-release-checklist.md`](../ops/production-release-checklist.md) → 通过后 production 同流程。

---

## 2. 与 Sprint 10 关系

| Sprint 10（Done） | Sprint 11（执行） |
|-------------------|-------------------|
| S10-STORY-007 Runbook / checklist / health API | 真实创建云资源 · 连接 RDS |
| S10-STORY-008 admin 登录（本地 E2E） | 公网 HTTPS staging/production 验收 |
| S10-STORY-006 alert_events + 设计文档 | CloudMonitor 规则 · SLS 预留 |

---

## 3. Story 索引

| Story | 名称 | 优先级 | 状态 |
|-------|------|--------|------|
| S11-STORY-001 | 阿里云资源开通与网络基线 | P0 | **In Review**（ECS/RDS/网络/HTTPS 已完成 · OSS/SLS/CloudMonitor 未创建 · 后续 story） |
| S11-STORY-002 | Staging 部署与数据库初始化 | P0 | **In Review**（staging deploy · migrate · import · health PASS） |
| S11-STORY-003 | Admin 登录与 Staging 治理/用户池验收 | P0 | **In Review**（admin session · 治理 · preview pool PASS） |
| S11-STORY-003A | Staging Volcengine Provider + 首页生成主链路与样式回归验收 | P0 | **Done**（staging 验收 2026-06-11 · merge sprint `2ee03c5` `--no-ff`） |
| S11-STORY-003B | Legacy Path Removal & Parallel Implementation Audit | P0 | **Done**（merge sprint `8da62e9` `--no-ff` · staging 2026-06-11） |
| S11-STORY-004 | Production 部署与上线 | P0 | **In Progress · Gate B Pending** · Gate A **Done** @ `8e01438` |
| S11-STORY-005 | 监控、报警与运维闭环 | P1 | **Pending** |
| S11-STORY-006 | Sprint 11 Closeout | P0 | **Pending** |

完整 AC 见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 11 章节。

---

## 4. 关键文档

| 文档 | 用途 |
|------|------|
| [`aliyun-deployment-runbook.md`](../ops/aliyun-deployment-runbook.md) | 部署步骤 |
| [`aliyun-resource-checklist.md`](../ops/aliyun-resource-checklist.md) | 资源勾选 |
| [`production-release-checklist.md`](../ops/production-release-checklist.md) | staging/prod 验收 |
| [`environment-variables.md`](../ops/environment-variables.md) | env 清单 |
| [`incident-and-rollback-runbook.md`](../ops/incident-and-rollback-runbook.md) | 故障回滚 |
| [`monitoring-and-oncall.md`](../ops/monitoring-and-oncall.md) | 监控与 on-call |
| [`environments/`](../ops/environments/) | staging/production 资源登记（无 secret） |

---

## 5. 仓库部署辅助（非 CI）

| 路径 | 说明 |
|------|------|
| [`deploy/systemd/qingpian-wechat-editor.service.example`](../../deploy/systemd/qingpian-wechat-editor.service.example) | systemd 单元模板 |
| [`deploy/nginx/staging.conf.example`](../../deploy/nginx/staging.conf.example) | staging HTTPS 反代示例 |
| [`deploy/nginx/production.conf.example`](../../deploy/nginx/production.conf.example) | production HTTPS 反代示例 |

---

## 6. 明确不做

- CI/CD 流水线
- 复杂 RBAC / 多管理员
- OSS 截图 SDK 全量（bucket 可预留）
- SLS SDK 全量日志管道（project/logstore 可预留）
- WeChat Compatibility Recalibration / DSL tree 迁移（→ Sprint 12+）
- merge `main` · 宣布 Release 1 关闭（→ Sprint 13+ Closeout）

---

## 7. Staging 阶段收口（2026-06-11）

**已完成：**

- ECS + RDS + 安全组 + DNS + Nginx HTTPS + systemd staging 部署
- DB migrate · variant import · `GET /api/health` PASS
- Admin 登录 / session / 治理 / preview DB pool staging 验收 PASS
- Admin session bugfix merge @ `7f218e5` · docs @ `7fb4d9e`

**staging 登记：** [`environments/staging.md`](../ops/environments/staging.md)  
**收口报告：** [`execution-reports/2026-06-11-s11-staging-deployment-verification.md`](execution-reports/2026-06-11-s11-staging-deployment-verification.md)

**待办（非 staging 阻塞）：**

- OSS / SLS / CloudMonitor 创建与告警（→ S11-STORY-005）
- ~~首页 Volcengine AI 生成主链路 staging env 与验收~~ → **S11-STORY-003A**（Volcengine env · streaming · HTML variant 编号回归）
- Production 部署（→ S11-STORY-004 · **未启动**）

**明确未做：** merge `main` · 关闭 Release 1 · production 部署

---

## 8. 顺延（DECISION-111）

| 原编号 | 新编号 | 目标 Sprint |
|--------|--------|-------------|
| S10-STORY-012 | S12-STORY-001 | Compat Recalibration |
| S10-STORY-013 | S12-STORY-002 | DSL Schema Cleanup |
| S10-STORY-014 | S13-STORY-001 | Release 1 Closeout |
