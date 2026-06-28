# Product Governance Migration Plan

> 轻篇公众号排版 · 产品治理增量迁移方案  
> Sprint 12 · S12-STORY-001

## 1. 迁移原则

- 不重写历史事实。
- 不重新编号已存在的 Story、Backlog、Decision 或 Sprint。
- 不强制迁移已关闭 Sprint 的历史文档格式。
- 不删除仍有历史价值的文档。
- 新体系优先新增索引层、映射层和前向规范，减少对 Release 1 历史文件的扰动。
- 对重复、过时或冲突内容，先登记、再由用户确认后小步处理。

## 2. 保留文档

以下文档继续保留为历史和当前事实来源：

| 文档                              | 保留原因                        | 后续动作                       |
| --------------------------------- | ------------------------------- | ------------------------------ |
| `docs/product/product-vision.md`  | 产品目标源头                    | 补到产品全景索引               |
| `docs/product/product-scope.md`   | 用户与场景源头                  | 后续升级用户/场景目录          |
| `docs/product/release-1-scope.md` | Release 1 历史范围              | 不迁移，不改关闭事实           |
| `docs/product/user-story-map.md`  | R1 用户旅程和 US 依据           | 前向升级为多 Release Story Map |
| `docs/agile/product-backlog.md`   | 既有 backlog 与债务登记         | 保留历史，后续拆清职责         |
| `docs/agile/release-plan.md`      | Release 1 当前状态和关闭标准    | 保留为 Release dashboard       |
| `docs/agile/sprint-plan.md`       | Sprint 历史叙事与 close summary | 保留历史，不再无限扩张         |
| `docs/agile/sprint-backlog.md`    | Story ledger                    | 保留，新增 Sprint 12 section   |
| `docs/agile/decisions.md`         | 决策记录                        | 保留历史，后续补当前权威说明   |
| `docs/agile/changelog.md`         | 时间线                          | 保留为历史索引                 |
| `docs/agile/bugs.md`              | Bug / debt backlog              | 保留并纳入 debt index          |
| `docs/agile/execution-reports/`   | 执行证据                        | 保留原地，后续加索引           |
| `docs/agile/paste-qa/`            | 粘贴证据                        | 保留原始证据                   |
| `docs/architecture/`              | 架构契约与债务                  | 保留，映射到模块/功能          |
| `docs/ops/`                       | 部署与运维证据                  | 保留，映射到验收证据           |
| `.cursor/rules/`                  | Cursor 执行规则                 | 小步修正滞后项                 |

## 3. 升级文档

| 文档                                         | 升级目标                                     | 风险                  | 验收方式                           |
| -------------------------------------------- | -------------------------------------------- | --------------------- | ---------------------------------- |
| `docs/product/user-story-map.md`             | 扩展为覆盖 R1/R2/R3 的用户旅程与 Story Map   | 误改 R1 历史          | 新增章节，不重写 R1                |
| `docs/agile/product-backlog.md`              | 明确 Product Backlog 与功能目录分工          | 打断历史 backlog 语义 | 保留旧内容，新增说明或索引         |
| `docs/agile/release-plan.md`                 | 作为 Release dashboard，减少 Sprint 状态重复 | 与 sprint-plan 重复   | 只定义当前权威来源                 |
| `docs/agile/sprint-backlog.md`               | 建立 Sprint 12 / Story 001 正式记录          | S12 ID 冲突           | 明确冲突，不重编号旧占位           |
| `docs/agile/git-workflow.md`                 | 与协作文档/Decision 早期文字对齐             | 改写历史              | 只修当前规范，不改旧 Decision 原文 |
| `docs/agile/chatgpt-cursor-docs-workflow.md` | 修正 Sprint merge main 的旧表述              | 与旧历史不一致        | 引用 release 分支模型              |
| `.cursor/rules/project-rules.mdc`            | 修正 Sprint 1 状态滞后                       | 规则变更影响执行      | 单独 Story 执行，用户审查          |
| `src/core/**/README.md`                      | 模块 README 状态校准                         | 容易扩大到代码重构    | 后续按模块小步审计                 |

## 4. 新增文档

建议后续按以下顺序新增，不在本 Story 中提前完成正式内容：

| 文档                                            | 作用                                          | 建议 Story     |
| ----------------------------------------------- | --------------------------------------------- | -------------- |
| `docs/product/product-module-tree.md`           | 产品模块树，定义稳定产品模块                  | S12 后续 Story |
| `docs/product/product-feature-catalog.md`       | 产品功能目录，区别于 Backlog                  | S12 后续 Story |
| `docs/product/release-2-scope.md`               | Release 2 产品范围与非目标                    | S12 后续 Story |
| `docs/agile/release-backlog.md`                 | Release Backlog 分层                          | S12 后续 Story |
| `docs/governance/traceability-matrix.md`        | 目标→模块→功能→Story→证据                     | S12 后续 Story |
| `docs/governance/agile-events.md`               | Planning / Review / Audit / Closeout 事件定义 | S12 后续 Story |
| `docs/governance/evidence-index.md`             | execution report / QA / ops / audit 证据索引  | S12 后续 Story |
| `docs/governance/debt-and-deferred-register.md` | 风险、债务、deferred 统一索引                 | S12 后续 Story |

## 5. 后续可能废弃或合并的文档

本 Story 不废弃、不删除。后续仅在用户确认后处理：

| 对象                                                          | 建议                           | 前置条件                                    |
| ------------------------------------------------------------- | ------------------------------ | ------------------------------------------- |
| `sprint-plan.md` 中重复的 Sprint 状态摘要                     | 停止继续扩张，转为历史叙事     | Release dashboard 和 Sprint docs 权威明确后 |
| `product-backlog.md` 中非 backlog 的静态能力描述              | 抽到功能目录并保留历史引用     | 功能目录建立后                              |
| `release-plan.md` 与 `product-backlog.md` 的 Release 状态重复 | `release-plan.md` 作为状态权威 | 用户确认 Release dashboard 责任             |
| 过时 `src/core/**/README.md`                                  | 按模块更新或归档               | 独立模块审计 Story                          |
| 早期协作文档中的 sprint→main 文字                             | 修为当前 release 模型          | 单独治理修正文档 Story                      |

## 6. 历史内容处理原则

- 已关闭 Sprint 的 audit、closeout、merge 记录不改结论。
- 旧 Decision 原文不改写；如与当前规则冲突，用新 Decision 或治理说明补当前权威。
- 已存在的 Story 编号不重编号；若编号冲突，先登记冲突、冻结相关执行、由用户确认映射。
- 旧文档中的“计划”与后续已发生事实冲突时，优先保留原文并在当前 dashboard / sprint doc 中标注最新事实。
- 历史 execution report 不移动、不合并，只新增索引。

## 7. Sprint 12 后续 Story 建议

| 顺序 | Story 建议                                           | 目标                                             | 验收方式                              |
| ---- | ---------------------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| 1    | S12-STORY-001 Governance Document Audit              | 完成本轮审计、蓝图、迁移计划                     | 本轮 execution report + commit        |
| 2    | S12-STORY-002 Product Module Tree & Feature Catalog  | 建立模块树和功能目录                             | 新增产品文档，映射 R1/R2，不改历史    |
| 3    | S12-STORY-003 Release 2 Scope & Release Backlog      | 建立 R2 scope、候选 backlog、非目标              | R2 scope 文档 + release backlog       |
| 4    | S12-STORY-004 Traceability & Evidence Index          | 建立目标→Story→证据索引                          | execution reports / QA / ops 链接可查 |
| 5    | S12-STORY-005 Agile Events & Governance Rule Cleanup | 定义敏捷事件，修正规则滞后                       | 修正协作文档/规则，检查通过           |
| 6    | S12-STORY-006 Deferred Debt Replanning               | 对 Compat / DSL / DB sync 等 deferred 做重新归类 | 不直接实现债务，只拆分候选 Story      |

说明：仓库已有 “S12-STORY-001/002” 作为 DECISION-111 下 Compat / DSL deferred 占位。因本轮用户已指定 Product Governance 审计为 S12-STORY-001，后续必须先做 ID 冲突处理，再正式执行 Compat / DSL 债务 Story。

## 8. 分步风险与验收

| 步骤                             | 风险                           | 验收方式                                  |
| -------------------------------- | ------------------------------ | ----------------------------------------- |
| 建立治理审计文档                 | 结论脱离实际文件               | 文档列出扫描范围和矩阵                    |
| 建立 Sprint 12 记录              | 与 S11 未关闭、旧 S12 占位冲突 | 明确基线依赖与 ID 冲突                    |
| 新增模块树/功能目录              | 把 Backlog 当功能目录          | 明确稳定能力 vs 工作项                    |
| 新增 Release Backlog             | 与 `release-plan.md` 重复      | 定义 release backlog 是选取项，不是状态页 |
| 新增追踪矩阵                     | 人工维护成本高                 | 从当前高价值链路开始，不追求一次全量      |
| 清理规则/协作文档                | 误改历史结论                   | 只修当前规范，不改旧 decision 原文        |
| Compat / DSL deferred replanning | 误把债务修复混入治理 Story     | 单独 Story，先规划再实现                  |

## 9. 本 Story 停止线

本 Story 到以下内容为止：

- 完成当前体系审计报告。
- 完成目标体系蓝图。
- 完成增量迁移方案。
- 建立 Sprint 12 / S12-STORY-001 正式记录。
- 生成 execution report 并提交。

本 Story 不做：

- 不开发 Release 2 功能。
- 不实现 Compatibility Recalibration。
- 不实现 DSL Runtime Cleanup。
- 不批量重构历史文档。
- 不关闭 Sprint 11、Sprint 12 或 Release 1。
- 不 merge `sprint`、`release/1` 或 `main`。
