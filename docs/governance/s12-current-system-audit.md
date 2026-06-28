# S12 Current System Audit

> 轻篇公众号排版 · Sprint 12 Product Governance & Release 2 Planning  
> Story: S12-STORY-001 · 现有项目管理与产品文档体系审计  
> 日期: 2026-06-28

## 1. 审计范围

本报告只做现状盘点、审计和升级方案设计，不重写历史事实，不开发产品代码，不批量迁移旧文档。

本轮扫描范围：

| 范围                            | 数量                 | 说明                                                                  |
| ------------------------------- | -------------------- | --------------------------------------------------------------------- |
| `docs/agile/`                   | 269 个 Markdown 文件 | Sprint / Backlog / Decision / Changelog / Execution Report / Paste QA |
| `docs/agile/execution-reports/` | 226 个 Markdown 文件 | 每轮 Cursor 执行交接凭证，含 `_template.md` 与 `README.md`            |
| `docs/agile/paste-qa/`          | 24 个 Markdown 文件  | 微信粘贴 QA、Fidelity Matrix、Drift 记录                              |
| `docs/product/`                 | 6 个 Markdown 文件   | 产品愿景、范围、Release 1、Story Map、样式质量基线                    |
| `docs/architecture/`            | 48 个 Markdown 文件  | 架构主文档、模块契约、债务、审计                                      |
| `docs/ops/`                     | 12 个 Markdown 文件  | 部署、环境、监控、回滚、发布检查                                      |
| `docs/research/`                | 7 个 Markdown 文件   | 微信兼容、样式采集、证据                                              |
| `.cursor/rules/`                | 6 个规则文件         | Cursor 执行、协作、项目、架构、样式与复制规则                         |
| `src/core/**/README.md`         | 6 个 README          | 模块级说明，部分状态可能滞后                                          |

## 2. 当前文档清单与职责

### 产品文档

- `docs/product/product-vision.md`: 产品愿景、目标用户、第一阶段聚焦与后续方向。
- `docs/product/product-scope.md`: 核心用户、核心场景、第一阶段做与不做。
- `docs/product/release-1-scope.md`: Release 1 主链路、必须包含和不包含的能力。
- `docs/product/user-story-map.md`: Release 1 主流程、Sprint 6 用户闭环、R1 P0 用户故事。
- `docs/product/r1-style-quality-baseline.md`: Release 1 样式质量锚点。
- `docs/product/heading-publish-catalog.md`: heading 发布池与粘贴验收结果。

### 敏捷与治理文档

- `docs/agile/product-backlog.md`: Release/Epic、Release 1 Product Backlog、技术 enabler、遗留债务登记。
- `docs/agile/release-plan.md`: Release 1 状态、关闭标准、Sprint 索引。
- `docs/agile/sprint-plan.md`: 多 Sprint 计划、关闭摘要、历史 P1/P2 登记。
- `docs/agile/sprint-backlog.md`: Story 级状态、AC、工作分支、merge 证据。
- `docs/agile/decisions.md`: 决策记录，含 Release/Sprint 重排、债务 deferred、上线约束。
- `docs/agile/changelog.md`: 时间线变更记录，偏历史事件索引。
- `docs/agile/bugs.md`: Bug、债务、遗留问题登记。
- `docs/agile/git-workflow.md`: 当前分支模型权威来源。
- `docs/agile/chatgpt-cursor-docs-workflow.md`: ChatGPT / Cursor / docs 协作机制。
- `docs/agile/execution-reports/`: 每轮执行证据、检查命令、commit 与审查输入。
- `docs/agile/paste-qa/`: Paste QA 流程、Matrix、Drift 与粘贴证据。

### 架构、运营与研究文档

- `docs/architecture/architecture-overview.md`: Release 1 架构总览。
- `docs/architecture/article-schema.md`, `block-schema.md`, `style-system.md`, `generation-pipeline.md`, `rendering-pipeline.md`, `copy-to-wechat-pipeline.md`: 核心模块契约。
- `docs/architecture/wechat-safe-html-css-contract.md`, `wechat-compatibility-spec.md`, `wechat-compatibility-known-debt.md`: 微信兼容契约与债务。
- `docs/architecture/article-variant-dsl-runtime.md`, `variant-dsl-legacy-render-contract-debt.md`: DSL runtime 与双轨债务。
- `docs/architecture/audits/`: Sprint / contract / close readiness 审计。
- `docs/ops/production-release-checklist.md`, `aliyun-deployment-runbook.md`, `monitoring-and-oncall.md`, `production-prelaunch-observation-checklist.md`, `environments/`: 部署与上线证据。
- `docs/research/`: 微信编辑器兼容、真实文章样式采集与证据。

### Cursor 规则

- `.cursor/rules/agile-rules.mdc`: Story/Bug/Decision、AC、分支、execution report 要求。
- `.cursor/rules/collaboration-rules.mdc`: ChatGPT / Cursor 分工与每轮执行流程。
- `.cursor/rules/project-rules.mdc`: 项目身份、命名禁令、Sprint/Git 约束。
- `.cursor/rules/architecture-rules.mdc`, `style-system-rules.mdc`, `wechat-copy-rules.mdc`: 架构、样式、复制边界。

## 3. 当前工作流

当前权威工作流基本为：

```text
Product Backlog / Decision
  → Sprint Planning
  → Sprint Backlog Story + AC
  → sprint 分支
  → 独立 work branch
  → docs / code / checks
  → execution report
  → 用户 / ChatGPT 审查
  → 用户确认后 work branch merge sprint
  → Sprint closeout
  → 用户确认后 sprint merge release/1
  → Release closeout 后才可能 merge main
```

这个流程在 `git-workflow.md`、`chatgpt-cursor-docs-workflow.md`、`.cursor/rules/`、`sprint-backlog.md` 与 execution reports 中有充分证据。

## 4. 已具备能力

- Story 级状态、AC、工作分支、merge commit 和检查命令记录较完整。
- Sprint / Release 分支模型清晰，当前权威模型为 `main ← release/<n> ← sprint/<slug> ← work branch`。
- Decision Log 连续记录关键产品、架构、治理和部署决策。
- Execution Report 数量充足，是跨会话交接和审查的稳定证据层。
- 微信复制保真有 Matrix、Drift、Paste QA、Contract、Validator 多层证据。
- Release 1 关闭标准明确，且文档反复声明 Sprint 上线不等于 Release 1 关闭。
- 风险、债务、deferred 项没有被隐藏，已分散登记在 backlog、decisions、bugs、architecture debt、audit、ops 文档中。

## 5. 主要缺口

- 缺少统一的产品全景：产品愿景、用户、旅程、用户活动、用户步骤、Story Map、模块树、功能目录、Backlog、Release/Sprint 之间没有单一映射入口。
- 没有正式的产品模块树和功能目录；目前能力散落在 `product-scope.md`、`product-backlog.md`、架构文档和 Sprint 文档中。
- Product Backlog 与产品功能目录边界不清：`product-backlog.md` 同时承载 release roadmap、Epic、PB item、技术 enabler 与债务登记。
- Release Backlog 不是独立对象；目前主要由 `release-plan.md`、`product-backlog.md` 和 `sprint-backlog.md` 共同承担。
- Story Map 当前偏 Release 1 / Sprint 6 视角，且未正式分层为 Journey → Activity → Step → User Story，不能覆盖 Release 2 及后续产品全景。
- DoR / DoD 未独立成文；DoD 散落在 per-story AC、Release 关闭标准、Copy Fidelity DoD、Paste QA、execution report 模板中。
- 敏捷事件（Planning / Review / Retro / Closeout / Audit）被实践了，但缺少正式事件定义、输入、输出和记录位置。
- 证据索引缺失：execution reports 很多，但未按 Story / Bug / Decision / commit / check 建立可检索索引。
- Release / Sprint 状态在多个文件重复维护，容易漂移。

## 6. 重复、冲突与失效

- `git-workflow.md` 已明确 Sprint merge `release/1`，但 `decisions.md` 的 DECISION-020 详情仍保留早期 “Sprint 整体验收后 merge main” 表述；应作为历史决策文本保留，并由后续说明标注 DECISION-052 / `git-workflow.md` 为当前权威。
- `chatgpt-cursor-docs-workflow.md` 的协作流程第 10 步仍写 Sprint 合并回 main，与当前 release 分支模型不一致。
- `.cursor/rules/project-rules.mdc` 仍写 Sprint 1 整体状态为 In Review，而 `sprint-plan.md` 已记录 Sprint 1-B Closed。
- `sprint-plan.md`、`release-plan.md`、`product-backlog.md`、`sprint-backlog.md` 都维护 Sprint 状态摘要，存在漂移风险。
- `sprint11-production-ops-go-live.md` 顶部仍有 “production 未启动” 文案，但后文和 DECISION-113 已记录 Production Prelaunch Done。
- 当前治理 Sprint 的 `S12-STORY-001~009` 为正式 Sprint 12 Story；仓库原有 “S12-STORY-001 WeChat Compatibility Spec Recalibration / S12-STORY-002 DSL Runtime Schema Cleanup” 仅为 DECISION-111 下的历史 deferred 占位，不得继续作为正式 Story ID 使用。该冲突不应靠改写旧 Decision 原文解决，需在后续专门治理决策中为旧 deferred 项分配新的 Backlog / Story ID。
- `product-backlog.md` 中 “Release 2：样式增强、轻编辑与手动配图” 是早期规划，应标记为 Superseded / Pending Replanning；正式 Release 2 范围需由 S12-STORY-008 重新制定。
- Sprint 12 当前基于未关闭的 Sprint 11 分支建立；S12-STORY-001 可以 merge 回 Sprint 12 分支，但启动 S12-STORY-002 前必须确认 Sprint 11 最终 merge 状态，并在 Sprint 11 merge `release/1` 后对齐 Sprint 12 与最新 `release/1`。

## 7. 文档职责矩阵

| 文档                             | 当前职责                    | 是否权威来源     | 重复对象                           | 当前问题                                               | 建议处理                                                      |
| -------------------------------- | --------------------------- | ---------------- | ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| `docs/product/product-vision.md` | 产品目标、用户、阶段方向    | 是，愿景层       | README、product-scope              | 不含模块/功能全景                                      | 保留，后续补充到产品全景索引                                  |
| `docs/product/product-scope.md`  | 用户、场景、第一阶段做/不做 | 是，范围层       | product-vision、release-1-scope    | 停留第一阶段                                           | 保留，后续与 Release 2 scope 关联                             |
| `docs/product/user-story-map.md` | Release 1 用户路径与 P0 US  | 部分             | product-backlog、sprint-backlog    | 仅覆盖 R1/S6 主体，缺少 Journey / Activity / Step 层级 | 升级为多 Release Story Map                                    |
| `docs/agile/product-backlog.md`  | Epic、PB、enabler、debt     | 部分             | release-plan、bugs、sprint-plan    | 职责过宽                                               | 拆清 Product Backlog vs 功能目录                              |
| `docs/agile/release-plan.md`     | Release 1 状态和关闭标准    | 是，Release 状态 | sprint-plan、product-backlog       | 只覆盖 R1                                              | 保留为 Release dashboard，后续加 R2/R3 或独立 Release backlog |
| `docs/agile/sprint-plan.md`      | 多 Sprint 叙事与关闭摘要    | 历史权威         | release-plan、sprint-backlog       | 状态重复、体量大                                       | 保留历史，新 Sprint 使用独立 Sprint plan                      |
| `docs/agile/sprint-backlog.md`   | Story AC、状态、分支        | 是，Story ledger | sprint docs、execution reports     | 文件过大，S12 ID 冲突                                  | 保留，新增 Sprint 12 section 并标冲突                         |
| `docs/agile/decisions.md`        | 决策记录                    | 是，决策层       | changelog、audit                   | 早期决策有旧模型文字                                   | 保留历史，新增当前权威说明                                    |
| `docs/agile/changelog.md`        | 事件时间线                  | 否，历史索引     | decisions、reports                 | 不总是当前状态权威                                     | 保留，仅作时间线                                              |
| `docs/agile/bugs.md`             | Bug / debt backlog          | 是，缺陷债务层   | product-backlog、architecture debt | 风险/债务分散                                          | 后续建立 debt register 索引                                   |
| `docs/agile/execution-reports/`  | 执行证据                    | 是，执行证据层   | changelog、sprint-backlog          | 缺少总索引                                             | 保留，后续建立 evidence index                                 |
| `docs/architecture/*`            | 模块契约、审计、债务        | 是，技术契约层   | product-backlog enabler            | 偏工程，不表达产品能力树                               | 保留，映射到模块/功能目录                                     |
| `docs/ops/*`                     | 部署、环境、监控、回滚      | 是，运维证据层   | sprint11 doc、reports              | 与 Sprint 状态重复                                     | 保留，纳入验收证据链                                          |
| `.cursor/rules/*`                | Cursor 执行约束             | 是，执行规则     | agile docs                         | 个别状态/流程滞后                                      | 小步修正规则，不批量改历史                                    |

## 7.1 文档结构审计结论

当前 `sprint-plan.md`、`sprint-backlog.md`、`release-plan.md` 已承担大量历史明细，继续把详细 Story、AC、Review、Closeout 都写入全局文件会放大重复维护风险。

后续建议采用：

```text
全局索引 + 每个 Sprint / Release 独立目录
```

全局文件只保留索引和状态总览；详细 Story、AC、Review、Retro、Closeout 放入 `docs/agile/sprints/sprint-<id>/` 和 `docs/agile/releases/release-<id>/`。历史大文件保持原样，从后续新 Sprint / Release 开始逐步采用。

## 8. 管理能力矩阵

| 管理对象        | 当前是否存在 | 当前文档                                              | 完整度 | 主要缺口                                         |
| --------------- | ------------ | ----------------------------------------------------- | ------ | ------------------------------------------------ |
| 产品愿景        | 存在         | `product-vision.md`, README                           | 中     | 未连接模块树、Release 2 全景                     |
| 用户与场景      | 存在         | `product-scope.md`, `user-story-map.md`               | 中     | 缺少用户画像、场景优先级和后续 Release 变化      |
| 产品模块树      | 不完整       | 架构文档、README 目录                                 | 低     | 无正式产品模块树                                 |
| 产品功能目录    | 不完整       | `product-scope.md`, `product-backlog.md`, sprint docs | 低     | 功能目录与 backlog 混用                          |
| 用户旅程        | 存在         | `user-story-map.md`                                   | 中     | 偏 Release 1 / Sprint 6，未覆盖 R2+              |
| 用户活动        | 不完整       | `user-story-map.md`                                   | 低     | 未作为正式层级管理                               |
| 用户步骤        | 不完整       | `user-story-map.md`                                   | 低     | 未作为 User Story 拆分输入                       |
| Story Map       | 存在         | `user-story-map.md`                                   | 中     | 不是完整多 Release story map，层级不完整         |
| Product Backlog | 存在         | `product-backlog.md`                                  | 中     | 职责过宽，混入技术 enabler / debt / release plan |
| Release Backlog | 部分存在     | `release-plan.md`, `product-backlog.md`               | 低     | 缺少独立 Release Backlog 定义与状态              |
| Sprint Backlog  | 存在         | `sprint-backlog.md`, sprint 专项文档                  | 高     | 大文件、状态重复、S12 ID 冲突                    |
| 追踪矩阵        | 部分存在     | `sprint-backlog.md`, execution reports, decisions     | 中     | 无目标→模块→功能→Story→证据单表                  |
| 敏捷事件        | 部分存在     | decisions, execution reports, closeout audits         | 中     | 事件定义、输入/输出、执行频率不正式              |

## 9. 历史兼容矩阵

| 历史对象                 | 是否保持原样 | 是否补充映射           | 是否迁移       | 风险                                       |
| ------------------------ | ------------ | ---------------------- | -------------- | ------------------------------------------ |
| 既有 Story 编号          | 是           | 是                     | 否             | S12-STORY-001 已发生当前指令与历史占位冲突 |
| 既有 Sprint 关闭结论     | 是           | 必要时补充当前权威说明 | 否             | 多文档状态摘要可能漂移                     |
| 既有 Decision            | 是           | 是                     | 否             | 早期 DECISION-020 与当前 release 模型冲突  |
| Execution Reports        | 是           | 建议新增索引           | 否             | 数量大但检索成本高                         |
| Product Backlog 历史内容 | 是           | 是                     | 否             | 职责过宽，后续拆分需避免改写历史           |
| Paste QA / Drift 记录    | 是           | 是                     | 否             | 应保持原始证据，不把自动化结果冒充人工 QA  |
| 架构债务文档             | 是           | 是                     | 否             | Debt 分散，后续需统一索引                  |
| `src/core/**/README.md`  | 暂保留       | 是                     | 后续按模块审计 | 状态可能滞后，但本 Story 不修              |

## 10. 审计结论

当前体系强在工程交付确定性：Story、分支、commit、检查、execution report、Decision、Sprint closeout 的链路成熟，适合小步交付、审查和回滚。

当前体系弱在产品全局管理：产品目标、模块、功能、用户旅程、Story Map、Release Backlog、Sprint Backlog 之间缺少统一对象模型和追踪矩阵。文档数量增长后，`product-backlog.md`、`release-plan.md`、`sprint-plan.md`、`sprint-backlog.md` 开始共同承担状态管理，导致重复和漂移风险。

建议采用增量升级：保留历史文档和关闭结论，不批量迁移旧格式；新增目标模型、功能目录、模块树、Release Backlog、证据索引等“索引层”和“映射层”，让新体系覆盖后续 Release，同时用映射方式兼容 Release 1 历史。
