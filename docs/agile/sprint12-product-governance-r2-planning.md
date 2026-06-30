# Sprint 12：Product Governance & Release 2 Planning

> 轻篇公众号排版 · qingpian-wechat-editor  
> **分支：** `sprint/s12-product-governance-r2-planning`  
> **Current release baseline:** `release/1` @ `3a8203b`  
> **Baseline alignment date:** 2026-06-30  
> **Sprint 11：** Accepted with follow-ups / Closed（DECISION-114）  
> **Sprint 12 Plan：** Not Approved  
> **S12-STORY-002：** Not Started  
> **状态：** Planning Baseline Aligned / Not Approved  
> **基线对齐工作分支：** `docs/s12-release1-baseline-alignment`（merge `release/1` @ `3a8203b` · 未 merge 回 sprint 分支）

> **说明：** 当前仅完成 `release/1` 基线对齐与治理事实源合并；**不代表** Sprint 12 已启动产品开发。Sprint Planning 仍需 Product Owner 明确 **Approved**；committed Stories、顺序、容量与非目标仍待正式确认。

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

本 Sprint 核心范围是产品治理、文档体系升级和 Release 2 planning。Deferred debt 仅登记为 Product Backlog / Deferred Register 候选，不作为 Sprint 12 核心 Story。

本 Sprint 不自动包含：

- Release 2 产品功能开发；
- Compatibility Recalibration 代码实现；
- DSL Runtime Cleanup 代码实现；
- Sprint 11 closeout；
- Release 1 closeout；
- merge `release/1` 或 `main`。

## 2.1 Sprint 11 / Sprint 12 分支关系闸门

- Sprint 11 已 **Accepted with follow-ups / Closed** 并 merge 至 `release/1` @ `3a8203b`（DECISION-114）。
- Sprint 12 规划分支已与最新 `release/1` 在 `docs/s12-release1-baseline-alignment` 完成基线对齐（2026-06-30）；**未** merge 回 `sprint/s12-product-governance-r2-planning`。
- 在 Sprint 12 Plan **Approved** 且 PO 明确启动前，**不得**启动 S12-STORY-002 或任何 Sprint 12 产品开发 Story。
- 本轮不 merge `main`；Release 1 未关闭。

## 3. Story 索引

| Story         | 名称                                                | 优先级 | 状态     | 工作分支                                                            |
| ------------- | --------------------------------------------------- | ------ | -------- | ------------------------------------------------------------------- |
| S12-STORY-001 | 现有项目管理与产品文档体系审计                      | P0     | **Done** | `docs/s12-story-001-sprint-release-structure-alignment`（已 merge） |
| S12-STORY-002 | 产品愿景、目标用户、核心场景与系统边界              | P0     | Proposed | TBD                                                                 |
| S12-STORY-003 | 完整产品模块树与产品功能目录                        | P0     | Proposed | TBD                                                                 |
| S12-STORY-004 | 用户旅程、用户活动与完整 Story Map                  | P0     | Proposed | TBD                                                                 |
| S12-STORY-005 | Product Backlog、Release、Sprint 与模块覆盖追踪体系 | P0     | Proposed | TBD                                                                 |
| S12-STORY-006 | 敏捷事件、流程闸门、DoR/DoD 与标准模板              | P1     | Proposed | TBD                                                                 |
| S12-STORY-007 | Release 1 历史能力、模块及功能映射                  | P1     | Proposed | TBD                                                                 |
| S12-STORY-008 | Release 2 及后续产品路线与渐进式迭代计划            | P0     | Proposed | TBD                                                                 |
| S12-STORY-009 | 全局一致性审计、治理验收与 Sprint 12 关闭           | P0     | Proposed | TBD                                                                 |

> ID 兼容说明：当前治理 Sprint 的 `S12-STORY-001~009` 为正式 Sprint 12 Story。`sprint-backlog.md` 中 DECISION-111 产生的旧占位 “S12-STORY-001 WeChat Compatibility Spec Recalibration / S12-STORY-002 DSL Runtime Schema Cleanup” 仅保留为历史 deferred 占位，不得继续作为正式 Story ID 使用；后续在专门治理决策中为旧 deferred 项分配新的 Backlog / Story ID。
>
> Deferred Debt Replanning 不作为 Sprint 12 核心 Story；Compat / DSL / DB sync 等 deferred 项回到 Product Backlog / Deferred Register 候选池。

## 4. S12-STORY-001

**用户故事：** 作为产品负责人，我希望先审计当前项目管理与产品文档体系，明确已有能力、重复冲突、真实缺口和增量升级路径，以便 Sprint 12 后续能够为 Release 2 建立稳定产品全景，而不是直接开始批量重构文档或开发产品功能。

**目标：**

- 扫描并列出仓库内相关产品、敏捷、治理、架构、运营、研究和规则文档。
- 输出当前体系审计报告。
- 输出产品治理目标模型。
- 输出增量迁移方案。
- 建立 Sprint 12 与 S12-STORY-001 正式记录。
- 生成 execution report，完成 commit，等待人工审查。

**验收（2026-06-29）：** Product Owner 验收结论 **Accepted**；允许标记 **Done**；已 merge 至 `sprint/s12-product-governance-r2-planning`（merge commit 见 execution report §21）。Sprint 12 Plan **未** Approved；S12-STORY-002 **未**启动。

**明确不做：**

- 不开发 Release 2 功能。
- 不开发产品代码。
- 不重写 Release 1 或 Sprint 11 历史。
- 不批量迁移旧文档。
- 不关闭 Sprint 11 / Sprint 12 / Release 1。
- 不 merge `sprint`、`release/1` 或 `main`。

## 5. S12-STORY-001 验收标准

| AC    | 验收标准                                 | 状态 |
| ----- | ---------------------------------------- | ---- |
| AC-1  | 已扫描并列出仓库内所有相关文档           | Done |
| AC-2  | 审计结论基于实际文件，不凭空假设         | Done |
| AC-3  | 明确当前体系已有能力和真实缺口           | Done |
| AC-4  | 明确新旧体系如何增量兼容                 | Done |
| AC-5  | 没有破坏 Release 1 或 Sprint 11 历史     | Done |
| AC-6  | 没有批量重写现有文档                     | Done |
| AC-7  | 没有开发产品代码                         | Done |
| AC-8  | 已建立 Sprint 12 和 Story 001 的正式记录 | Done |
| AC-9  | 文档内部引用有效                         | Done |
| AC-10 | 必要检查通过；若未运行须说明原因         | Done |
| AC-11 | working tree 最终干净                    | Done |
| AC-12 | 完成 commit，不 merge，等待审查          | Done |

## 6. 关键输出

- [`../governance/s12-current-system-audit.md`](../governance/s12-current-system-audit.md)
- [`../governance/product-governance-target-model.md`](../governance/product-governance-target-model.md)
- [`../governance/product-governance-migration-plan.md`](../governance/product-governance-migration-plan.md)
- 本文件
- `docs/agile/execution-reports/2026-06-28-s12-story-001-governance-document-audit.md`
- `.cursor/rules/agile-governance.mdc`（S12-STORY-001 治理验收补充；见 `2026-06-28-s12-story-001-cursor-governance-rule-sync.md`）
- **DECISION-115** — Sprint / Release 独立平级目录与全局索引（见 `2026-06-29-s12-story-001-sprint-release-structure-alignment.md`）

## 7. 建议后续顺序

后续 Story 以用户确认和 ChatGPT 审查为准。推荐顺序：

```text
S12-STORY-001 Governance Audit
  → S12-STORY-002 Vision / Users / Scenarios / Boundaries
  → S12-STORY-003 Product Module Tree & Feature Catalog
  → S12-STORY-004 Journey / Activity / Story Map
  → S12-STORY-005 Backlog / Release / Sprint Coverage Tracking
  → S12-STORY-006 Agile Events / Gates / DoR / DoD / Templates
  → S12-STORY-007 Release 1 Historical Capability Mapping
  → S12-STORY-008 Release 2+ Roadmap & Iteration Plan
  → S12-STORY-009 Consistency Audit / Governance Acceptance / Closeout
```

Compat / DSL 旧占位项必须先完成 ID 冲突处理，再进入正式执行。

S12-STORY-002 尚未启动；启动前须 Sprint 12 Plan 经 Product Owner **Approved**，且基线对齐工作分支已 merge 回 `sprint/s12-product-governance-r2-planning` 并经审查。
