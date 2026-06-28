# Sprint 12：Product Governance & Release 2 Planning

> 轻篇公众号排版 · qingpian-wechat-editor  
> **分支：** `sprint/s12-product-governance-r2-planning`  
> **来源基线：** `sprint/s11-production-ops-go-live` @ `653c70a`  
> **状态：** In Progress / Needs Review  
> **启动说明：** `release/1` 尚未包含 Sprint 11 最新完整状态；本 Sprint 分支从当前完整的 `sprint/s11-production-ops-go-live` 创建，依赖 Sprint 11 后续人工审查与合并决策。

## 1. Sprint Goal

Sprint 12 聚焦产品治理与 Release 2 规划前置工作：

```text
现有文档与治理体系审计
  → 产品治理目标模型
  → 增量迁移方案
  → 产品模块树 / 功能目录 / Release 2 scope / backlog 分层
  → 为 Release 2 及后续 Release 建立可追踪产品全景
```

## 2. Sprint 12 本轮边界

本 Sprint 可以包含产品治理、文档体系升级、Release 2 planning、deferred debt replanning。

本 Sprint 不自动包含：

- Release 2 产品功能开发；
- Compatibility Recalibration 代码实现；
- DSL Runtime Cleanup 代码实现；
- Sprint 11 closeout；
- Release 1 closeout；
- merge `release/1` 或 `main`。

## 3. Story 索引

| Story         | 名称                                   | 优先级 | 状态      | 工作分支                                       |
| ------------- | -------------------------------------- | ------ | --------- | ---------------------------------------------- |
| S12-STORY-001 | 现有项目管理与产品文档体系审计         | P0     | In Review | `docs/s12-story-001-governance-document-audit` |
| S12-STORY-002 | Product Module Tree & Feature Catalog  | P0     | Proposed  | TBD                                            |
| S12-STORY-003 | Release 2 Scope & Release Backlog      | P0     | Proposed  | TBD                                            |
| S12-STORY-004 | Traceability & Evidence Index          | P1     | Proposed  | TBD                                            |
| S12-STORY-005 | Agile Events & Governance Rule Cleanup | P1     | Proposed  | TBD                                            |
| S12-STORY-006 | Deferred Debt Replanning               | P1     | Proposed  | TBD                                            |

> ID 兼容说明：`sprint-backlog.md` 中已有 DECISION-111 产生的旧占位 “S12-STORY-001 WeChat Compatibility Spec Recalibration / S12-STORY-002 DSL Runtime Schema Cleanup”。本 Sprint 不删除、不重编号旧占位；先将冲突记录为治理问题，后续由用户确认映射策略。

## 4. S12-STORY-001

**用户故事：** 作为产品负责人，我希望先审计当前项目管理与产品文档体系，明确已有能力、重复冲突、真实缺口和增量升级路径，以便 Sprint 12 后续能够为 Release 2 建立稳定产品全景，而不是直接开始批量重构文档或开发产品功能。

**目标：**

- 扫描并列出仓库内相关产品、敏捷、治理、架构、运营、研究和规则文档。
- 输出当前体系审计报告。
- 输出产品治理目标模型。
- 输出增量迁移方案。
- 建立 Sprint 12 与 S12-STORY-001 正式记录。
- 生成 execution report，完成 commit，等待人工审查。

**明确不做：**

- 不开发 Release 2 功能。
- 不开发产品代码。
- 不重写 Release 1 或 Sprint 11 历史。
- 不批量迁移旧文档。
- 不关闭 Sprint 11 / Sprint 12 / Release 1。
- 不 merge `sprint`、`release/1` 或 `main`。

## 5. S12-STORY-001 验收标准

| AC    | 验收标准                                 | 状态      |
| ----- | ---------------------------------------- | --------- |
| AC-1  | 已扫描并列出仓库内所有相关文档           | In Review |
| AC-2  | 审计结论基于实际文件，不凭空假设         | In Review |
| AC-3  | 明确当前体系已有能力和真实缺口           | In Review |
| AC-4  | 明确新旧体系如何增量兼容                 | In Review |
| AC-5  | 没有破坏 Release 1 或 Sprint 11 历史     | In Review |
| AC-6  | 没有批量重写现有文档                     | In Review |
| AC-7  | 没有开发产品代码                         | In Review |
| AC-8  | 已建立 Sprint 12 和 Story 001 的正式记录 | In Review |
| AC-9  | 文档内部引用有效                         | In Review |
| AC-10 | 必要检查通过；若未运行须说明原因         | In Review |
| AC-11 | working tree 最终干净                    | In Review |
| AC-12 | 完成 commit，不 merge，等待审查          | In Review |

## 6. 关键输出

- [`../governance/s12-current-system-audit.md`](../governance/s12-current-system-audit.md)
- [`../governance/product-governance-target-model.md`](../governance/product-governance-target-model.md)
- [`../governance/product-governance-migration-plan.md`](../governance/product-governance-migration-plan.md)
- 本文件
- `docs/agile/execution-reports/2026-06-28-s12-story-001-governance-document-audit.md`

## 7. 建议后续顺序

后续 Story 以用户确认和 ChatGPT 审查为准。推荐顺序：

```text
S12-STORY-001 Governance Audit
  → S12-STORY-002 Product Module Tree & Feature Catalog
  → S12-STORY-003 Release 2 Scope & Release Backlog
  → S12-STORY-004 Traceability & Evidence Index
  → S12-STORY-005 Agile Events & Governance Rule Cleanup
  → S12-STORY-006 Deferred Debt Replanning
```

Compat / DSL 旧占位项必须先完成 ID 冲突处理，再进入正式执行。
