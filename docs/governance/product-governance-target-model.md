# Product Governance Target Model

> 轻篇公众号排版 · 产品治理目标体系  
> Sprint 12 · S12-STORY-001

## 1. 目标

建立一套增量兼容的产品治理模型，使后续 Release 可以从产品全景出发规划，而不是只从工程交付和技术债务出发推进。

目标链路：

```text
产品愿景与目标
  → 用户与场景
  → 用户旅程
  → 用户活动
  → 用户步骤
  → 用户故事地图
  → 产品模块树
  → 产品功能目录
  → Product Backlog
  → Release Backlog
  → Sprint Backlog
  → 开发、测试与验收
```

追踪链路：

```text
目标
  → 模块
  → 功能
  → 用户故事
  → Release
  → Sprint
  → 分支 / Commit
  → 测试
  → 验收证据
```

## 2. 产品管理对象

| 对象                 | 定义                                              | 建议权威文档                                     | 说明                                                               |
| -------------------- | ------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| Product Goal         | 产品长期目标和阶段目标                            | `docs/product/product-vision.md`                 | 不直接等于 backlog                                                 |
| User / Scenario      | 用户类型、使用场景、优先级                        | `docs/product/product-scope.md`                  | 后续可升级为用户与场景目录                                         |
| User Journey         | 用户围绕某个目标完成的一条端到端旅程              | `docs/product/user-story-map.md`                 | Journey 下分 Activity / Step / Story，不直接跳到 Product Feature   |
| User Activity        | 用户旅程中的一组连续活动                          | 后续 Story Map 升级文档                          | 例如准备内容、生成文章、排版检查、复制发布                         |
| User Step            | Activity 下可观察的用户步骤                       | 后续 Story Map 升级文档                          | 是拆分 User Story 的直接输入                                       |
| User Story Map       | Journey → Activity → Step → User Story 的结构化图 | 后续升级 `docs/product/user-story-map.md`        | 是用户视角的需求地图，不等同模块树或功能目录                       |
| Product Module       | 稳定产品模块，如生成、排版、样式、复制、运营后台  | 后续新增产品模块树                               | 是产品能力结构，不等同代码目录                                     |
| Product Feature      | 产品应具备的稳定功能                              | 后续新增功能目录                                 | 功能目录描述“产品有什么能力”                                       |
| Product Backlog Item | 为实现/完善/修复功能而产生的工作项总类            | `docs/agile/product-backlog.md`                  | User Story 是 PBI 的一种类型；Backlog 描述工作，不描述完整静态能力 |
| User Story           | 从用户价值表达的 Product Backlog Item             | `docs/agile/sprint-backlog.md`                   | 一个 User Story 可涉及多个模块/功能                                |
| Enabler / Tech / Ops | Enabler Story、Technical Story、Ops Task 等 PBI   | `docs/agile/product-backlog.md` / Sprint Backlog | 非用户故事类 PBI，支撑架构、运维、治理、调研、风险收口等           |
| Release Backlog      | 某个 Release 承诺或候选交付集合                   | 后续新增或升级 release plan                      | 从 Product Backlog 选取，并绑定 Release goal                       |
| Sprint Backlog       | 当前 Sprint committed PBIs / Stories              | `docs/agile/sprint-backlog.md` + Sprint 专项文档 | 承接具体 AC、分支和证据                                            |
| Evidence             | 代码、commit、测试、QA、报告、上线证据            | execution reports / paste QA / ops docs          | 需要后续建立索引层                                                 |

## 3. 对象关系

```text
Product Goal 1..n User Journey
User Journey 1..n User Activity
User Activity 1..n User Step
User Step 0..n User Story
Product Backlog Item includes User Story / Enabler Story / Technical Story / Bug / Spike / Ops Task / Governance Task
Product Module n..n Product Feature
Product Feature n..n Product Backlog Item
Product Module n..n Product Backlog Item
Product Backlog Item n..n Release
Release 1..n Sprint
Sprint 1..n Product Backlog Item
Product Backlog Item 1..n Branch / Commit / Check / Evidence
```

关键原则：

- User Story 不是与 Product Backlog Item 并列的独立对象；User Story 是 Product Backlog Item 的一种类型。
- Product Backlog Item 是总类，其他类型包括 Enabler Story、Technical Story、Bug、Spike、Ops Task、Governance Task。
- 模块、功能与 Product Backlog Item 是多对多关系，不强制一个 Release 对应一个模块。
- 一个模块可以被多个 Release、Sprint、Story 渐进完善。
- 一个 Product Backlog Item / Story 可以横跨多个模块和功能，只要 AC 与验收证据清晰。
- Release 可以跨模块做端到端切片，也可以集中深化关键模块，也可以做技术基础阶段。
- Product Backlog 与产品功能目录必须分离：功能目录是稳定能力清单，Backlog 是实现、完善和修复这些能力的工作队列。

## 4. 文档分层

| 层级        | 作用                           | 当前文档                                  | 目标处理                                     |
| ----------- | ------------------------------ | ----------------------------------------- | -------------------------------------------- |
| 产品愿景层  | 定义为什么做、为谁做           | `product-vision.md`, `product-scope.md`   | 保留并补映射                                 |
| 产品结构层  | 定义模块、功能、旅程           | `user-story-map.md` 部分承担              | 新增模块树和功能目录                         |
| Backlog 层  | 管理实现工作项                 | `product-backlog.md`, `sprint-backlog.md` | 明确 Product / Release / Sprint Backlog 边界 |
| Delivery 层 | 管理 Story、分支、commit、检查 | `sprint-backlog.md`, execution reports    | 保留并增加证据索引                           |
| Decision 层 | 管理决策与变更                 | `decisions.md`, `changelog.md`            | 保留，补当前权威说明                         |
| Evidence 层 | 管理测试、QA、上线、审计证据   | execution reports, paste QA, ops, audits  | 新增索引，避免移动历史证据                   |

## 5. Backlog 分层

### Product Backlog

描述所有待实现、待完善、待修复、待验证的产品工作项。它可以关联模块、功能、用户旅程、风险和债务，但不应替代产品功能目录。

建议字段：

- ID
- 标题
- 类型：User Story / Enabler Story / Technical Story / Bug / Spike / Ops Task / Governance Task / Debt / Research
- 关联目标
- 关联模块
- 关联功能
- 关联用户旅程 / 用户活动 / 用户步骤（如适用）
- 优先级
- 候选 Release
- 状态
- 证据链接

### Release Backlog

从 Product Backlog 中选择某个 Release 的候选或承诺范围，说明 Release goal、范围边界、验收条件和非目标。

建议字段：

- Release
- Release Goal
- Candidate / Committed / Deferred
- 关联 Product Backlog Item
- 关联功能
- 关联风险
- Release 验收证据

### Sprint Backlog

从 Release Backlog 或 Product Backlog 中选择当前 Sprint 可执行的 Product Backlog Item，并记录 AC、工作分支、commit、检查和验收。

建议字段：

- PBI / Story / Bug / Task ID
- 用户故事或任务目标
- 状态
- AC
- 工作分支
- 来源分支
- 目标合并分支
- Commit
- 检查命令
- 验收证据

## 6. Story 与模块/功能的多对多关系

Story / PBI 不应被绑定为“一个模块的一次开发”。推荐记录方式：

| PBI / Story                 | 类型            | 关联模块                     | 关联功能                               | 交付模式         |
| --------------------------- | --------------- | ---------------------------- | -------------------------------------- | ---------------- |
| 用户生成主链路              | User Story      | 输入、生成、预览、复制       | 主题输入、AI 生成、样式预览、一键复制  | 跨模块端到端切片 |
| 样式管理后台                | Enabler Story   | 样式、运营后台、分发         | variant 管理、promote、用户池          | 集中深化关键模块 |
| Compatibility Recalibration | Technical Story | 复制、兼容、Harvest、DSL     | report/enforce、Validator、loss report | 技术基础阶段     |
| Product Governance Audit    | Governance Task | 产品治理、敏捷治理、文档体系 | 模块树、功能目录、Backlog 分层         | 治理基础阶段     |

## 7. Release / Sprint 渐进覆盖模式

Release 和 Sprint 可采用以下模式：

| 模式             | 适用场景                   | 示例                                               |
| ---------------- | -------------------------- | -------------------------------------------------- |
| 跨模块端到端切片 | 需要验证用户价值闭环       | Release 1 主链路、Sprint 6                         |
| 关键模块深化     | 某模块成为瓶颈或战略重点   | 样式管理后台、Compatibility                        |
| 多模块并行渐进   | 多个能力需要同步演进       | Release 2+ 多能力路线（由 S12-STORY-008 重新制定） |
| 技术基础阶段     | 为后续产品能力清障         | DSL cleanup、治理升级                              |
| 治理与计划阶段   | 产品全景和交付机制需要升级 | Sprint 12 Product Governance                       |

## 8. 敏捷事件进入流程

| 事件                       | 输入                                  | 输出                                      | 建议记录位置                              |
| -------------------------- | ------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| Product Backlog Refinement | 产品目标、模块、功能、反馈、债务      | 更新 Product Backlog、拆分候选 Story      | `product-backlog.md` 或后续 backlog index |
| Release Planning           | Product Backlog、目标、风险、能力依赖 | Release Backlog、Release Goal、Release AC | `release-plan.md` 或后续 Release Backlog  |
| Sprint Planning            | Release Backlog、团队容量、依赖       | Sprint Goal、committed Story、AC、分支    | Sprint 专项文档 + `sprint-backlog.md`     |
| Daily / Execution Loop     | 当前 Story、分支、检查                | commit、execution report、阻塞            | execution reports                         |
| Sprint Review              | Done / In Review Story、验收证据      | PO 验收、返工项、是否建议合并             | execution report + sprint doc             |
| Sprint Audit / Closeout    | Sprint 证据、P0/P1/P2                 | closeout 结论、是否 merge release         | audit / execution report / decisions      |
| Retrospective              | 执行问题、流程问题                    | 改进项、规则更新候选                      | decisions 或 governance backlog           |

## 9. Sprint / Release 文档结构原则

后续采用“全局索引 + 每个 Sprint / Release 独立目录”结构。历史大文件保持原样，不在本 Story 中迁移；从后续新 Sprint / Release 开始逐步采用。

目标结构：

```text
docs/agile/
├─ sprint-backlog.md              # 全局 Sprint 索引与状态总览
├─ release-plan.md                # 全局 Release 索引与状态总览
├─ sprints/
│  └─ sprint-<id>/
│     ├─ plan.md
│     ├─ backlog.md
│     ├─ review.md
│     ├─ retrospective.md
│     └─ closeout.md
└─ releases/
   └─ release-<id>/
      ├─ plan.md
      ├─ backlog.md
      ├─ coverage.md
      ├─ review.md
      └─ closeout.md
```

执行原则：

- `sprint-backlog.md` 只保留全局 Sprint 索引、状态总览和跨 Sprint 链接。
- `release-plan.md` 只保留全局 Release 索引、状态总览和 Release 级入口。
- 详细 Story、AC、Review、Retrospective、Closeout 放入独立 Sprint / Release 目录。
- 避免同一状态在多个文件重复维护；如需摘要，必须指向唯一权威文件。
- 历史 `sprint-plan.md` / `sprint-backlog.md` / `release-plan.md` 不批量拆分，只在后续 Sprint 中前向采用。

## 10. 追踪链路模板

后续可为每个 Release 或重要产品能力建立以下追踪矩阵：

| 目标                 | Journey / Activity / Step | 模块               | 功能                           | PBI / Story          | Release     | Sprint   | Branch / Commit       | 测试                    | 验收证据               |
| -------------------- | ------------------------- | ------------------ | ------------------------------ | -------------------- | ----------- | -------- | --------------------- | ----------------------- | ---------------------- |
| 公众号文章可复制使用 | 复制使用 / 复制到公众号   | 复制 / 兼容        | 微信兼容 HTML                  | PB-R1-05 / US-R1-009 | R1          | S6 / S8  | execution report 记录 | lint / build / Paste QA | Matrix / Drift / PO QA |
| 样式可运营治理       | 运营治理 / 上下架样式     | 样式 / 后台 / 分发 | variant 上下架与用户池         | S9 / S10 stories     | R1          | S9 / S10 | execution report 记录 | unit / e2e / build      | admin / preview 验收   |
| Release 2 产品全景   | 待 S12-STORY-004 定义     | 产品治理           | 模块树 / 功能目录 / R2 backlog | S12 后续 Story       | R2 planning | S12      | 待定                  | docs check              | 目标文档审查           |

## 11. 与历史体系的兼容方式

- 不迁移历史 execution reports，只新增索引。
- 不重写已关闭 Sprint 结论，只在新文档中说明当前权威来源。
- 不重新编号既有 Story；遇到 ID 冲突时，先登记冲突和影响，再由用户确认映射策略。
- 不删除旧决策；旧决策与当前规则冲突时，以后续 Decision / `git-workflow.md` / 当前 sprint 文档为准，并在迁移计划中安排补注。
- 新增产品模块树、功能目录、Release Backlog 等文档只作为“前向权威”，不反向要求 Release 1 历史全部改写。
