# Sprint 11 Retrospective

> **日期：** 2026-06-30 · **Sprint 状态：** In Progress（未关闭）  
> **范围：** 回顾事实与流程 · **不**改写产品范围

---

## 1. 做得好的事项

- **staging 先于 production** 策略有效：checklist、回滚演练、SSE/nginx 问题在 staging 暴露并修复后再 Prelaunch。
- **Ops 脚本统一入口**（`pnpm ops:*`）降低 deploy/status/rollback 认知成本；005 复用 `status-environment.sh` 避免双轨状态逻辑。
- **Execution reports + environments/\*.md** 形成可审计运维证据链（无 secret 入库）。
- **Gate A / Gate B 分阶段** 使 production Prelaunch 与代码冻结、qualityStatus 契约解耦清晰。
- **用户手动验收** 与文档日期校正（2026-06-28）纠正了 Prelaunch 实际完成时间与文件名歧义。

---

## 2. 遇到的问题

- **Sprint Goal 与 Story 状态不同步**：`sprint11-production-ops-go-live.md` 头部曾长期写「production 未启动」，与后续 Prelaunch 事实不一致，增加 Review 成本。
- **In Review vs Done 边界模糊**：001~003 staging 验收已完成，但 Story 仍 In Review，Closeout 时 PO 签收标准不清。
- **监控 Story 拆分为「脚本完成」与「运行时部署」**：005 仓库交付完成，但 cron/T+24h/T+72h 无证据，易被误读为 Done。
- **分支与 release 漂移**：S11 sprint @ `653c70a` 比 `release/1` @ `6cd1dfc` 超前 **56 commits**；Sprint 12 从未 merge 的 S11 分支切出，增加治理复杂度。
- **域名/备案约束** 中途变更（`qingpianai.cn` → `paiban.aiqingpian.cn`），需在 decisions + production 文档同步，否则 Release 沟通失真。
- **全量 test 既有失败**（`wechat-paste-qa-pack` ×2）在 Sprint 11 未修复，Closeout 时需明确是否阻塞 Release 1。

---

## 3. S11 运维 Story 与普通代码 Story 的差异

| 维度         | 普通代码 Story     | S11 运维 Story                                          |
| ------------ | ------------------ | ------------------------------------------------------- |
| 完成证据     | CI test / PR merge | **用户手动验收** + ECS 运行时 + 文档登记                |
| 「Done」含义 | 代码在 sprint 分支 | 环境真实可达 · 回滚验证 · 常含 **Prelaunch ≠ 公开发布** |
| 回滚         | git revert         | **精确 commit** deploy + DB 状态保留验证                |
| 秘密处理     | 不入库             | env 仅在 ECS · 脚本不得打印                             |
| 后续依赖     | 下一 Story 代码    | cron/CloudMonitor/观察节点 · 常跨 Sprint                |

---

## 4. 用户手动操作 vs Cursor 自动执行 — 责任边界

| 活动                                          | 责任方               | 证据要求                                 |
| --------------------------------------------- | -------------------- | ---------------------------------------- |
| ECS/RDS 购买、DNS、Nginx、Certbot、Basic Auth | **用户/运维**        | `environments/*.md` + 用户确认           |
| Production deploy @ exact commit              | **用户**（脚本辅助） | execution report + `/api/version` gitSha |
| 回滚演练                                      | **用户**             | 日期 + commit 对 + health/DB             |
| Prelaunch 功能验收                            | **用户**             | 明确日期（2026-06-28）                   |
| 仓库脚本/文档/测试                            | **Cursor**           | lint/build/test + execution report       |
| Sprint/Closeout/merge release                 | **Product Owner**    | **不得**由 Cursor 自行关闭               |

---

## 5. 证据缺失原因

- **CloudMonitor/SLS/OSS**：刻意后置（DECISION-111 · 005 AC-5 待部署），非遗漏但 Closeout 前无运行时证据。
- **RDS 备份恢复**：production.md 登记为待确认，无演练记录。
- **T+24h/T+72h**：005 启动晚于 Prelaunch，观察窗口尚未执行或无归档。
- **PO 正式 Sprint 签收**：流程上等待 Review/Closeout Readiness，本轮才整理。

---

## 6. 分支、文档与环境状态问题

- S11 **未** merge `release/1`；文档与 Sprint 12 闸门已登记，但需 PO 授权 merge 时机。
- 本地/远程 S11 **一致** @ `653c70a`（2026-06-30 核查）。
- Sprint 12 从 S11 分支建立 — 须在 S11 merge `release/1` 后对齐 S12（已有 governance 文档，本轮不执行）。

---

## 7. 后续改进动作

| 动作                                            | 进入位置                       | 类型      |
| ----------------------------------------------- | ------------------------------ | --------- |
| 完成 005 ECS cron + T+24h/T+72h 归档            | Product Backlog **P1-S11-002** | 运维/验证 |
| PO 签收 001~003 或调整 Story 状态               | Product Backlog **P1-S11-003** | 治理      |
| 创建 OSS/SLS/CloudMonitor 或明确 Release 1 豁免 | Product Backlog **P1-S11-004** | 运维      |
| RDS 备份策略确认与恢复演练                      | Product Backlog **P2-S11-001** | 运维/验证 |
| On-call 联系人回填                              | Product Backlog **P2-S11-002** | 运维文档  |
| S11 merge `release/1` 授权与执行                | Closeout / PO 决策             | Git 治理  |
| Sprint 11 Closeout（006）                       | sprint-backlog S11-STORY-006   | Closeout  |

---

## 8. 相关文档

- [`sprint11-review.md`](sprint11-review.md)
- [`sprint11-closeout.md`](sprint11-closeout.md)
- [`product-backlog.md`](product-backlog.md) § Sprint 11 Closeout Carryover
