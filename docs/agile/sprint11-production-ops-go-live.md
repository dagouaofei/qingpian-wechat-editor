# Sprint 11：Production Ops Go-Live（正式部署与运维上线）

> **分支：** `sprint/s11-production-ops-go-live`（从 `release/1`）  
> **状态：** **In Progress**（2026-06-08 · **DECISION-111** · staging 2026-06-11 · Production Prelaunch 2026-06-28 · Review 2026-06-30）
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

| Sprint 10（Done）                              | Sprint 11（执行）                  |
| ---------------------------------------------- | ---------------------------------- |
| S10-STORY-007 Runbook / checklist / health API | 真实创建云资源 · 连接 RDS          |
| S10-STORY-008 admin 登录（本地 E2E）           | 公网 HTTPS staging/production 验收 |
| S10-STORY-006 alert_events + 设计文档          | CloudMonitor 规则 · SLS 预留       |

---

## 3. Story 索引

| Story          | 名称                                                       | 优先级 | 状态                                                                                                                             |
| -------------- | ---------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| S11-STORY-001  | 阿里云资源开通与网络基线                                   | P0     | **Done** · **Accepted with follow-ups**（PO 2026-06-30 · ECS/RDS/网络/HTTPS 已验收 · OSS/SLS/CloudMonitor → **P1-S11-004**）     |
| S11-STORY-002  | Staging 部署与数据库初始化                                 | P0     | **Done** · **Accepted**（PO 2026-06-30 · staging deploy · migrate · import · health PASS）                                       |
| S11-STORY-003  | Admin 登录与 Staging 治理/用户池验收                       | P0     | **Done** · **Accepted**（PO 2026-06-30 · admin session · 治理 · preview pool PASS）                                              |
| S11-STORY-003A | Staging Volcengine Provider + 首页生成主链路与样式回归验收 | P0     | **Done**（staging 验收 2026-06-11 · merge sprint `2ee03c5` `--no-ff`）                                                           |
| S11-STORY-003B | Legacy Path Removal & Parallel Implementation Audit        | P0     | **Done**（merge sprint `8da62e9` `--no-ff` · staging 2026-06-11）                                                                |
| S11-STORY-004  | Production 部署与上线                                      | P0     | **Done** · Prelaunch @ `385422d` · https://paiban.aiqingpian.cn                                                                  |
| S11-STORY-005  | Production Monitoring, Alerting & Observation              | P1     | **Done** · **Accepted with follow-ups**（PO 2026-06-30 · `ops:observe` 脚本/文档已验收 · ECS cron/T+24h/T+72h → **P1-S11-002**） |
| S11-STORY-006  | Sprint 11 Closeout                                         | P0     | **In Review** · 工作分支 `docs/s11-story-006-closeout` · Closeout **Ready for PO Decision**                                      |

完整 AC 见 [`sprint-backlog.md`](sprint-backlog.md) Sprint 11 章节。

**Review / Closeout（2026-06-30 · Sprint 未关闭）：**

| 文档                                                     | 用途                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| [`sprint11-review.md`](sprint11-review.md)               | Sprint Review · **Ready for Acceptance**（待 PO Sprint 决定） |
| [`sprint11-retrospective.md`](sprint11-retrospective.md) | Retrospective                                                 |
| [`sprint11-closeout.md`](sprint11-closeout.md)           | Closeout · **Ready for PO Decision / Not Closed**             |

---

## 4. 关键文档

| 文档                                                                          | 用途                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------- |
| [`aliyun-deployment-runbook.md`](../ops/aliyun-deployment-runbook.md)         | 部署步骤                                 |
| [`aliyun-resource-checklist.md`](../ops/aliyun-resource-checklist.md)         | 资源勾选                                 |
| [`production-release-checklist.md`](../ops/production-release-checklist.md)   | staging/prod 验收                        |
| [`environment-variables.md`](../ops/environment-variables.md)                 | env 清单                                 |
| [`incident-and-rollback-runbook.md`](../ops/incident-and-rollback-runbook.md) | 故障回滚                                 |
| [`monitoring-and-oncall.md`](../ops/monitoring-and-oncall.md)                 | 监控与 on-call                           |
| [`environments/`](../ops/environments/)                                       | staging/production 资源登记（无 secret） |

---

## 5. 仓库部署辅助（非 CI）

| 路径                                                                                                                   | 说明                      |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`deploy/systemd/qingpian-wechat-editor.service.example`](../../deploy/systemd/qingpian-wechat-editor.service.example) | systemd 单元模板          |
| [`deploy/nginx/staging.conf.example`](../../deploy/nginx/staging.conf.example)                                         | staging HTTPS 反代示例    |
| [`deploy/nginx/production.conf.example`](../../deploy/nginx/production.conf.example)                                   | production HTTPS 反代示例 |

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

- OSS / SLS / CloudMonitor 创建与告警（→ **P1-S11-004** · S11-STORY-001 follow-up · **未创建**）
- ~~首页 Volcengine AI 生成主链路 staging env 与验收~~ → **S11-STORY-003A**（Volcengine env · streaming · HTML variant 编号回归）
- Production Prelaunch 部署（→ S11-STORY-004 · **Done** @ `385422d`）
- Production 监控观察运行时闭环（→ **P1-S11-002** · S11-STORY-005 follow-up · ECS cron/T+24h/T+72h **未完成**）

**明确未做：** merge `main` · 关闭 Release 1 · 正式公开发布（Prelaunch 仍 active）

---

## 9. Gate B 代码冻结（2026-06-10 · DECISION-112）

**Prelaunch deploy 前 sprint 代码冻结点：** `d99aa1a`（governance `qualityStatus` 契约对齐）及 Gate B governance bootstrap 链。

| 项                        | 决策                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| Production variant 基线   | **100** 条（`import-existing-variants` 已执行）                      |
| Staging 独有测试 variant  | **2** 条 · **不迁移** production                                     |
| Governance snapshot apply | **暂不执行**                                                         |
| DB 事实来源               | 各环境 PostgreSQL DB                                                 |
| 代码 importer             | 历史 bootstrap · **待审计**                                          |
| 环境间 DB 同步方案        | **Deferred** → product-backlog **P1-S11-001** · **不阻塞 Prelaunch** |

**未做：** production 启动 · DNS/Nginx/systemd · production DB 变更 · merge `main`

---

## 10. Production Prelaunch 上线（2026-06-28 · S11-STORY-004 Done）

| 项         | 值                                                   |
| ---------- | ---------------------------------------------------- |
| URL        | https://paiban.aiqingpian.cn                         |
| 域名说明   | `qingpianai.cn` 未备案 · 改用 `paiban.aiqingpian.cn` |
| Commit     | `385422d`                                            |
| 定位       | Prelaunch · Basic Auth + noindex 保持                |
| 回滚基线   | `2f09b0d`                                            |
| 下一 Story | S11-STORY-005 监控观察                               |

---

## 8. 顺延（DECISION-111）

| 原编号        | 新编号        | 目标 Sprint          |
| ------------- | ------------- | -------------------- |
| S10-STORY-012 | S12-STORY-001 | Compat Recalibration |
| S10-STORY-013 | S12-STORY-002 | DSL Schema Cleanup   |
| S10-STORY-014 | S13-STORY-001 | Release 1 Closeout   |
