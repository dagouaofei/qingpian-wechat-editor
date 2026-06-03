# Sprint Backlog

> **Sprint 1：** 正式项目启动、核心技术方案定稿与工程治理 · Sprint 1-A / 1-B：**Closed**
> **Sprint 2：** Article / Block Schema + InlineContent 代码契约 · **Closed**（2026-05-31；DECISION-054）
> **Sprint 3-A：** Style System Contract & Registry Infrastructure · **Closed**（2026-05-31；DECISION-057）
> **Sprint 3-B：** First-wave Required Variant Registry · **Closed**（2026-06-01；DECISION-059）
> **Sprint 4-A：** Preview / Copy Renderer for Text-first Blocks · **Closed**（2026-06-01；DECISION-061；audit Grade A；P0=0）
> **Sprint 4-B：** Preview / Copy Renderer for Structured Blocks · **Closed**（2026-06-01；DECISION-063；audit Grade A；P0=0）
> **Sprint 3-C：** Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry · **Closed**（2026-06-01；DECISION-065；audit Grade A；P0=0 · P1=5 · P2=4；merged `release/1`）
> **Sprint 5：** Generation / Streaming + Release 1 真实 UI 主流程闭环 · **Closed**（2026-06-02；DECISION-069；audit Grade A- · P0=0 · P1=4 · P2=3；`sprint/s5-generation-ui-main-flow` 已 merge 至 `release/1`）
> **Sprint 6：** Release 1 Visible AI Main Flow · **Closed**（2026-06-02；DECISION-078；audit Grade A- · P0=0 · P1=5 · P2=4；`sprint/s6-visible-ai-main-flow` 已 merge 至 `release/1`）
> **Release 1：** **进行中（未关闭）** · 尾声按 **方案 B** 重排（DECISION-070）
> **当前 Sprint：** **Sprint 7**（**In Progress** · **S7-STORY-007A In Review** · 002~006 **Done** · **007 不做**）
> **当前 Chore：** **Visible Progress & Legacy Convergence** — **Done**（DECISION-080 · 用户验收 2026-06-02 · merged @ `a5704d6`）
> **Sprint 7 分支：** `sprint/s7-wechat-article-experience`（从 `release/1` 切出）
> **miaopian 对齐：** [`docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md`](miaopian-alignment/s7-workflow-and-ux-gap.md)
> **Release 1 主干：** `release/1`

---

## Sprint 1-A Stories

## S1-STORY-001 初始化正式项目工程

**用户故事：** 作为开发者，我需要初始化轻篇公众号排版正式项目工程，以便后续 Sprint 在统一技术栈上开发。

**优先级：** P0 · **状态：** Done

**验收标准：** 项目名 qingpian-wechat-editor；可安装启动；含 Next.js/TS/Tailwind/ESLint/Prettier；README 定位明确；无禁用命名。

---

## S1-STORY-002 建立 Cursor 全局规则和项目约束

**用户故事：** 作为团队成员，我需要 Cursor 规则约束开发和命名，以避免重复旧项目错误。

**优先级：** P0 · **状态：** Done

**验收标准：** 6 类规则文件；禁止临时链路/多套方案/旁路逻辑；样式系统和复制一致性为 Release 1 核心。

---

## S1-STORY-003 建立敏捷项目管理文档体系

**用户故事：** 作为产品负责人，我需要敏捷文档体系来管理 Backlog、Sprint 和决策。

**优先级：** P0 · **状态：** Done

**验收标准：** docs/agile 全部文档已建立；decisions.md 写入初始关键决策。

---

## S1-STORY-004 建立产品文档体系

**用户故事：** 作为产品负责人，我需要产品文档明确愿景、范围和 Release 1 边界。

**优先级：** P0 · **状态：** Done

**验收标准：** product-vision/scope/user-story-map/release-1-scope 已建立；Release 1 范围完整。

---

## S1-STORY-005 建立架构文档骨架

**用户故事：** 作为架构师，我需要架构文档骨架明确主链路和核心约束。

**优先级：** P0 · **状态：** Done

**验收标准：** 9 份架构文档骨架已建立；关键约束已写入。

---

## S1-STORY-006 沉淀 Sprint 2 候选目标

**用户故事：** 作为产品负责人，我需要 Sprint 2 候选方向。

**优先级：** P1 · **状态：** Done

**验收标准：** sprint-plan.md 含 A/B/C 三方向及选择约束。

---

## S1-STORY-007 沉淀一键成稿历史经验参考清单

**用户故事：** 作为团队成员，我需要旧项目经验清单。

**优先级：** P0 · **状态：** Done

**验收标准：** prototype-lessons.md 和 migration-reference.md 已建立；经验覆盖完整；明确不迁移废弃方案。

---

## Sprint 1-B Stories

## S1-STORY-008 建立 Git 仓库治理与分支策略

**用户故事：** 作为开发者，我需要 Git 仓库治理和分支策略，以便正式项目在版本控制下协作开发。

**优先级：** P0 · **状态：** Done

**工作内容：** 初始化 Git（main）；完善 .gitignore；Sprint 1-A commit；建立 git-workflow.md。

**验收标准：**

- [x] Git 仓库已初始化，主分支为 main
- [x] `.gitignore` 覆盖 node_modules、.next、.env、测试产物
- [x] Sprint 1-A 成果已 commit
- [x] git-workflow.md 已建立，含分支策略
- [x] Remote 待配置已标注

---

## S1-STORY-009 完成 Article / Block Schema 正式技术方案

**用户故事：** 作为架构师，我需要 Article / Block 正式技术方案，以便后续 Sprint 按统一数据模型实现代码。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] Article 字段结构、metadata、input、styleAssignment、fixture 设计完整
- [x] 11 种 Block 语义边界与建议字段完整
- [x] 禁止多套 Article 结构和平行结构已明确
- [x] 指向 src/core/article 和 src/core/blocks

---

## S1-STORY-010 完成 Style System 正式技术方案

**用户故事：** 作为架构师，我需要样式系统正式技术方案，以便 Preview / Copy 共享样式定义并支持扩展。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] slot、density、variant 组合、registry 管理、style assignment 机制已写清楚
- [x] 参考 Component DSL 有效经验，不采用 Visual Layer / Space Style
- [x] Release 1 第一批样式最小范围已定义
- [x] preview/copy 共享 style definition 方式已明确

---

## S1-STORY-011 完成 Preview / Copy Renderer 正式技术方案

**用户故事：** 作为开发者，我需要 Renderer 正式方案，以便 Preview 和 Copy 分离但共享样式。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] Preview / Copy 职责、分离原因、共享方式已明确
- [x] Article → Style Assignment → Renderer 数据流完整
- [x] 可共享 vs Copy 特殊处理已区分
- [x] 模块边界指向 src/core/renderer 和 src/core/copy

---

## S1-STORY-012 完成 Copy-to-WeChat 与复制一致性技术方案

**用户故事：** 作为产品团队，我需要复制一致性正式方案，以便复制效果作为 P0 前置设计。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] 复制一致性明确为 Release 1 P0
- [x] inline style 重要性、微信丢失样式、旧项目问题已覆盖
- [x] 人工粘贴测试记录方式已定义
- [x] 135 vs 微信公众号编辑器区别已明确

---

## S1-STORY-013 完成 Generation / Streaming 正式技术方案

**用户故事：** 作为架构师，我需要生成链路正式方案，以便多输入和流式生成最终归一 Article。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] 三类输入、输入标准化已覆盖
- [x] SSE + JSONL/block 增量 + done.article 经验表述正确
- [x] 禁止 streamArticle 独立结构
- [x] batch / stream 不分裂为两套主链路

---

## S1-STORY-014 完成核心技术方案一致性审查

**用户故事：** 作为架构师，我需要方案一致性审查，以确保各文档之间无冲突。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] Release 1 范围一致；样式系统 = 核心；复制一致性 = P0
- [x] Article 唯一主模型；Block 语义分离；Preview/Copy 共享样式
- [x] Generation 归一 Article；旧项目经验 = 参考不复制
- [x] 无「仅骨架」关键空洞

---

## S1-STORY-015 更新 Sprint 1 状态、决策记录与 Changelog

**用户故事：** 作为产品负责人，我需要 Sprint 状态同步，以便团队了解 Sprint 1 完整交付。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] Sprint 1-A / 1-B 拆分明确
- [x] DECISION-011 ~ DECISION-018 已记录
- [x] Changelog 记录 1-A 和 1-B
- [x] 全部 Story 001~015 状态已更新

---

## S1-STORY-016 建立 execution report 协作机制

**用户故事：** 作为产品负责人，我希望 Cursor 每轮执行后都在项目中生成 execution report，以便 ChatGPT 可以基于项目文档审查执行结果，而不是依赖复制完整对话。

**优先级：** P0 · **状态：** Done

**验收标准：**

- [x] AC-1 docs/agile/execution-reports/README.md 已建立
- [x] AC-2 docs/agile/execution-reports/_template.md 已建立
- [x] AC-3 .cursor/rules/agile-rules.mdc 已写入 execution report 默认规则
- [x] AC-4 .cursor/rules/collaboration-rules.mdc 已写入 ChatGPT + Cursor + docs + execution report 协作机制
- [x] AC-5 chatgpt-cursor-docs-workflow.md 已同步更新
- [x] AC-6 decisions.md 已记录 DECISION-019
- [x] AC-7 changelog.md 已记录本轮变更

---

## S1-STORY-017 建立迭代分支与工作分支规则

**用户故事：** 作为产品负责人，我希望每个 Sprint 有独立迭代分支，并且 Sprint 内每项工作从迭代分支新开工作分支，以便每轮任务边界清晰、便于审查、回滚和合并。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-iteration-branch-workflow`

**验收标准：**

- [x] AC-1 git-workflow.md 已明确 main / sprint / feature / docs / bugfix / chore 分支模型
- [x] AC-2 git-workflow.md 已明确每个 Sprint 新建 sprint 分支
- [x] AC-3 git-workflow.md 已明确 Sprint 内任务从 sprint 分支新建工作分支
- [x] AC-4 project-rules.mdc 已写入该规则
- [x] AC-5 agile-rules.mdc 已写入 Story / Bug / Docs / Chore 与工作分支对应规则
- [x] AC-6 collaboration-rules.mdc 已写入分支说明要求
- [x] AC-7 chatgpt-cursor-docs-workflow.md 已同步更新
- [x] AC-8 decisions.md 已记录 DECISION-020
- [x] AC-9 changelog.md 已记录本轮变更
- [x] AC-10 Sprint 1-B 状态仍保持 In Review

---

## S1-STORY-020 Release 1 整体架构定稿

**用户故事：** 作为产品负责人，我希望在 A/B 比较与 audit 基础上形成唯一的 Release 1 整体架构主文档，以便 Sprint 2 有明确、单一的架构事实源。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-architecture-finalize`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 定稿版 architecture-overview.md 已产出
- [x] AC-2 P0-1 ~ P0-6 决策项已在文档中关闭
- [x] AC-3 generation-pipeline.md 事件模型已与定稿一致
- [x] AC-4 decisions.md 已记录 DECISION-023 ~ 028
- [x] AC-5 架构校验清单已纳入定稿文档
- [x] AC-6 进入 Sprint 2 前置条件已列出
- [x] AC-7 已生成 execution report
- [x] AC-8 Sprint 1-B 保持 In Review（待用户确认收口）

---

## S1-STORY-021 核心技术方案实现前契约缺口修正

**用户故事：** 作为产品负责人，我希望在 Sprint 2 代码实现前，补齐 InlineContent、StyleDefinition 命名边界、slot copy-safe 边界、WeChatCompatibilityProfile 等实现前契约，以避免 Article / Block、Style System、Renderer、Copy Pipeline 在实现阶段出现返工或概念混乱。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-pre-implementation-contract-gaps`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 article-schema.md / block-schema.md 已补充 InlineContent / InlineMark / 段内高亮协议
- [x] AC-2 style-system.md 已明确 StyleDefinition、VariantDefinition、ResolvedBlockStyle、ResolvedArticleStyle 命名边界
- [x] AC-3 style-system.md 已补充 slot copy-safe 边界、fallback 规则、preview_only 限制
- [x] AC-4 wechat-copy-style-rules.md 已补充 WeChatCompatibilityProfile
- [x] AC-5 copy-to-wechat-pipeline.md 已同步 WeChatCompatibilityProfile 与 Copy Renderer
- [x] AC-6 rendering-pipeline.md 已同步 ResolvedBlockStyle / ResolvedArticleStyle 共享输入边界
- [x] AC-7 sprint-plan.md 已调整 Sprint 2~6 计划
- [x] AC-8 product-backlog.md 已补充 TECH-ARCH-002~005
- [x] AC-9 decisions.md 已记录 DECISION-029~033
- [x] AC-10 changelog.md 已记录本轮变更
- [x] AC-11 已生成 execution report
- [x] AC-12 pnpm lint / pnpm build 通过
- [x] AC-13 Sprint 1-B 保持 In Review

---

## S1-STORY-022 S1-STORY-021 实现前契约二次审计

**用户故事：** 作为产品负责人，我希望在 S1-STORY-021 补齐实现前契约后，基于当前技术文档并对照一键成稿样式经验做一次二次 audit，以判断是否可以进入 Sprint 2 代码实现。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-pre-implementation-contract-audit`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 已生成 docs/architecture/audits/s1b-pre-implementation-contract-audit.md
- [x] AC-2 审计覆盖 InlineContent、StyleDefinition 命名边界、slot copy-safe、WeChatCompatibilityProfile 四项
- [x] AC-3 审计对照 prototype-style-system-technical-lessons.md
- [x] AC-4 审计判断 Sprint 2 是否可以启动
- [x] AC-5 审计输出 P0/P1/P2 问题清单
- [x] AC-6 已生成 execution report
- [x] AC-7 Sprint 1-B 保持 In Review

---

## S1-STORY-023 Sprint 2 启动前契约收口

**用户故事：** 作为产品负责人，我希望在 Sprint 2 代码实现前，吸收 S1-STORY-022 二次 audit 结论，解决 block 文本字段命名不一致问题，并将剩余 P1 / P2 风险登记到后续 Sprint 计划，以便 Sprint 2 可以在清晰契约下启动。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-sprint2-readiness-contract-closure`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 block-schema.md 已统一 paragraph / lead 的文本字段命名，不再使用 body
- [x] AC-2 architecture-overview.md / article-schema.md / rendering-pipeline.md 中相关描述已同步
- [x] AC-3 剩余 P1 / P2 问题已登记到 sprint-plan.md 或 product-backlog.md
- [x] AC-4 rendering-pipeline.md 的后续实现顺序已与 Sprint 2~6 最新计划一致
- [x] AC-5 decisions.md 已记录文本字段命名决策和 Sprint 2 readiness 决策
- [x] AC-6 changelog.md 已记录本轮变更
- [x] AC-7 已生成 execution report
- [x] AC-8 pnpm lint / pnpm build 通过
- [x] AC-9 Sprint 1-B 仍保持 In Review，不得关闭

---

## S1-STORY-024 Component DSL 能力对齐与 Style System 补强

**用户故事：** 作为产品负责人，我希望在 Sprint 1-B 收口前，将秒篇 Component DSL 规范中经过验证的 family、variant、slot、asset pool、AI 生成约束、文章级编排规则等能力，对齐到轻篇 Style System 的正式技术方案中，以便后续 Sprint 3 实现 Style System 时既保持轻篇主架构干净，又能支撑类似 135 编辑器的丰富标题控件与样式变化能力。

**优先级：** P0 · **状态：** Done（已由 S1-STORY-025~027 吸收并 merge）

**工作分支：** `docs/s1b-component-dsl-style-system-alignment`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 style-system.md 已新增 Component DSL 能力对齐章节
- [x] AC-2 已明确 ComponentProtocol / BlockVisualProtocol
- [x] AC-3 已明确 title / heading → titleBlock
- [x] AC-4 已补充 5 family
- [x] AC-5 已补充 15 variant 候选 + Sprint 3 最小范围
- [x] AC-6 已补充 7 类 titleBlock slot
- [x] AC-7 已补充 VisualAssetRegistry
- [x] AC-8 已补充 StyleOrchestrator / 节奏规则
- [x] AC-9 已补充 AI 样式选择约束
- [x] AC-10 已补充 fallback / validation / versioning
- [x] AC-11 architecture-overview.md 已同步
- [x] AC-12 rendering / copy pipeline 已同步 titleBlock 成对 renderer
- [x] AC-13 sprint-plan.md 已同步 Sprint 3
- [x] AC-14 decisions.md DECISION-036~038
- [x] AC-15 changelog.md 已记录
- [x] AC-16 已生成 execution report
- [x] AC-17 pnpm lint / build 通过
- [x] AC-18 Sprint 1-B 保持 In Review

---

## S1-STORY-025 Component DSL 对齐后的 Style System 实现前收口

**用户故事：** 作为产品负责人，我希望在 Sprint 1-B 收口前，基于 Component DSL 对齐后的最新版技术方案，进一步收口 Style System 实现前契约，明确 titleBlock slot 内容来源、Component DSL 相关数据契约、Release 1 第一批 variant 范围、layoutMode copy-safe 规则、Release 1 AI 样式选择边界，以及后续实现路径。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-component-dsl-style-system-readiness`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：** AC-1~AC-18（slot binding、architecture 契约表、11×3~5 variants、layoutMode、AI Style Selection、Sprint 3~6、DECISION-039~042、execution report、lint/build、Sprint 1-B In Review）— 本轮全部 PASS

---

## S1-STORY-026 S1-STORY-025 二次审计与 Release 1 样式范围可执行性审查

**用户故事：** 作为产品负责人，我希望在 S1-STORY-025 扩大 Release 1 样式范围并启用受控 AI 样式选择后，做一次二次审计，确认 Release 1 样式范围、Sprint 3/4/6 工作量、Paste QA 范围、AI Style Selection 边界是否可执行，避免在进入代码实现前留下范围失控或架构污染风险。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-style-system-readiness-audit`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：**

- [x] AC-1 已生成 docs/architecture/audits/s1b-style-system-readiness-audit.md
- [x] AC-2 审计覆盖 Release 1 11×3~5 variants 范围可执行性
- [x] AC-3 审计覆盖 Sprint 3/4/6 工作量与拆分建议
- [x] AC-4 审计覆盖 required/candidate/experimental 三层边界
- [x] AC-5 审计明确 magazine_left_bar_title 建议降为 candidate
- [x] AC-6 审计覆盖 AI Style Selection 主链路（PASS，无架构污染）
- [x] AC-7 审计输出 P0=0 / P1=7 / P2=4
- [x] AC-8 审计判断 S1-STORY-025 **有条件可以 merge（分级 B）**
- [x] AC-9 已生成 execution report
- [x] AC-10 pnpm lint / build 通过
- [x] AC-11 Sprint 1-B 保持 In Review

---

## S1-STORY-027 Release 1 样式范围与 Sprint 拆分收口

**用户故事：** 作为产品负责人，我希望在 S1-STORY-025 扩大 Release 1 样式范围后，基于 S1-STORY-026 审计结论，将 Release 1 required variants 收口为先 11 block × 3 first-wave required variants、后续扩展到每 block 5 个，并正式拆分 Sprint 3/4/6。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-release1-style-scope-closure`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：** AC-1~AC-12 — first wave 11×3、expansion 分层、magazine candidate、Sprint 3-A/B/C & 4-A/B & 6-A/B、DECISION-043~045、execution report、lint/build、Sprint 1-B In Review — 本轮全部 PASS

---

## S1-STORY-028 Sprint 1-B 总 Audit

**用户故事：** 作为产品负责人，我希望在 Sprint 1-B 关闭前，对全部技术方案、敏捷文档、决策记录和 execution reports 做一次总 audit，以确认当前架构是否已经足够进入 Sprint 2 代码实现，是否存在 P0/P1/P2 风险，以及是否可以将 S1-STORY-025~027 链路 merge 回 Sprint 1-B 主分支。

**优先级：** P0 · **状态：** Done

**工作分支：** `docs/s1b-final-audit`（已 merge 至 `sprint/s1b-core-tech-governance` @ `25b9bad`）

**验收标准：**

- [x] AC-1 已生成 `docs/architecture/audits/sprint1b-final-audit.md`
- [x] AC-2 Audit 覆盖 Article / Block / InlineContent — PASS
- [x] AC-3 Audit 覆盖 Style System / Component DSL / Variant Scope / VisualAssetRegistry / StyleOrchestrator — PASS
- [x] AC-4 Audit 覆盖 AI Style Selection 与 Generation 边界 — PASS
- [x] AC-5 Audit 覆盖 Preview / Copy / WeChat Paste QA — PASS
- [x] AC-6 Audit 覆盖 Sprint 2~6 可执行性 — PASS
- [x] AC-7 Audit 覆盖敏捷文档一致性与 execution report 链路 — PARTIAL（021~024 状态滞后）
- [x] AC-8 Audit 输出 P0=0 / P1=9 / P2=5
- [x] AC-9 025~027 **已在 sprint merge**（`23e6fb0`）；建议 merge 本轮 final-audit
- [x] AC-10 Sprint 1-B **有条件可准备关闭**（需用户确认）
- [x] AC-11 已生成 execution report
- [x] AC-12 pnpm lint / build 通过
- [x] AC-13 Sprint 1-B 保持 In Review

---

## S1-STORY-029 Sprint 1-B 关闭前状态同步

**用户故事：** 作为产品负责人，我希望在 Sprint 1-B 关闭前，同步 final audit、Story 状态、遗留风险登记和关闭前检查项，以便 Sprint 1-B 可以在用户确认后关闭，并安全进入 Sprint 2。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s1b-close-readiness-sync`（已 merge 至 `sprint/s1b-core-tech-governance`）

**验收标准：** AC-1~AC-8 — 全部 PASS；Sprint 1-B 已正式关闭（DECISION-051）

**Sprint 1-B 关闭依据：**

- Sprint 1-B final audit 分级 **B**；**P0 = 0**
- 用户已确认 Checklist **#10**：接受 B 级 final audit
- 用户已确认 Checklist **#11**：可以关闭 Sprint 1-B
- P1/P2 已登记至 Product Backlog / 后续 Sprint
- P1-010（architecture-overview §19 过期状态）已在本轮修复
- **Sprint 2 已启动**（DECISION-053，2026-05-31）

---

# Sprint 2 Backlog

> **Sprint 2 目标：** 实现 Article / Block Schema + InlineContent **代码契约**（TypeScript 类型 + Zod + helpers + fixtures + 单元测试）
> **Sprint 2 分支：** `sprint/s2-article-block-schema`（从 `release/1` 切出）
> **Sprint 2 不做：** Renderer、Style System、Generation、AI Style Selection

---

## S2-STORY-001 Sprint 2 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 2 并拆分 Backlog，以便团队在明确边界下按 Story 逐步实现 Article / Block Schema 代码契约。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s2-start-backlog-split`

**明确不做：**

- 不实现 Article / Block / InlineContent 业务代码
- 不修改 `src/core/` 下除 README 外的源码
- 不 merge 至 `release/1` 或 `main`（本轮由用户审查后 merge sprint 分支）

**验收标准：**

- [x] AC-1 工作区干净；已从 `release/1` 创建 `sprint/s2-article-block-schema`
- [x] AC-2 `sprint-backlog.md` 已新增 Sprint 2 Backlog（S2-STORY-001~007）
- [x] AC-3 `sprint-plan.md` Sprint 2 状态已更新为 In Progress
- [x] AC-4 `changelog.md` 已记录 Sprint 2 启动与 sprint 分支建立
- [x] AC-5 `decisions.md` 已记录 DECISION-053
- [x] AC-6 每个 Story 含用户故事、优先级、状态、工作分支、AC、不做事项
- [x] AC-7 `pnpm lint` / `pnpm build` 通过
- [x] AC-8 已生成 execution report

---

## S2-STORY-002 InlineContent / InlineMark 代码契约

**用户故事：** 作为开发者，我需要 InlineContent / InlineMark 的 TypeScript 类型与 Zod Schema，以便 paragraph / lead 等 block 能表达段内富文本语义且与文档契约一致。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s2-inline-content-contract`（已 merge 至 `sprint/s2-article-block-schema` @ `ba149fe`）

**明确不做：**

- 不实现 Copy Renderer 的 InlineMark → HTML 映射
- 不实现 Style System 或 ResolvedBlockStyle
- 不升级 quote / highlight / cta 至 InlineContent（Release 2，见 P2-001）

**验收标准：**

- [x] AC-1 `src/core/article/` 已定义 `InlineMark`、`InlineTextNode`、`InlineContent` TS 类型（`InlineContent = InlineTextNode[]`，与 block-schema §3.1 一致）
- [x] AC-2 Zod schema 覆盖 mark 类型：`bold` | `italic` | `highlight` | `color` | `link`；可选 `color`、`href`、`semantic`
- [x] AC-3 禁止 HTML 富文本 string 作为主模型；schema 校验失败有明确错误
- [x] AC-4 与 `block-schema.md` §3.1 一致；导出 `InlineTextInput` 供 paragraph / lead `text: string | InlineContent` 使用
- [x] AC-5 提供 `normalizeInlineContent(input: string | InlineContent): InlineContent` 及 `parseInlineContent` / `isInlineContent`
- [x] AC-6 提供 `legacyEmphasisToMarks` 供文档兼容期 emphasis → InlineMark 迁移
- [x] AC-7 单元测试覆盖合法 / 非法 InlineContent（22 cases，`tests/core/article/inline-content.test.ts`）
- [x] AC-8 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过

---

## S2-STORY-003 Block Schema 代码契约

**用户故事：** 作为开发者，我需要 Release 1 全部 11 种 Block 的 discriminated union 类型与 Zod Schema，以便 Article 内容与后续 Renderer 共享同一语义边界。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s2-block-schema-contract`（已 merge 至 `sprint/s2-article-block-schema` @ `93c6526`）

**明确不做：**

- 不实现 Preview / Copy Renderer
- 不在 Block 上绑定 variant / CSS / StyleDefinition
- 不实现 Generation 或流式 block 增量解析
- 不实现 Article Schema 总装

**验收标准：**

- [x] AC-1 已实现 11 种 `BlockType`（`BLOCK_TYPES` / `blockTypeSchema`）
- [x] AC-2 每种 block `content` 与 `block-schema.md` §5 一致；paragraph / lead 使用 `content.text`（`inlineTextInputSchema`）
- [x] AC-3 `info_card.content.body` 保留独立语义
- [x] AC-4 Block 通用结构 `id` / `type` / `content` / `meta?`；`blockSchema` discriminated union
- [x] AC-5 `BlockMeta` 已定义（`blockMetaSchema`）
- [x] AC-6 导出 `Block` / `blockSchema` 及 11 种 block schema（`@/core/blocks`）
- [x] AC-7 单元测试 26 cases（`tests/core/blocks/block-schema.test.ts`）
- [x] AC-8 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过

---

## S2-STORY-004 Article Schema 代码契约

**用户故事：** 作为开发者，我需要 Article 顶层结构的 TypeScript 类型与 Zod Schema，以便全项目有唯一可校验的文章主模型。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s2-article-schema-contract`（已 merge 至 `sprint/s2-article-block-schema` @ `d68e503`）

**明确不做：**

- 不实现 StyleResolver / StyleDefinition / theme registry
- 不实现 parse / normalize 总 helper（S2-STORY-005）
- 不引入 `mockArticle` / `streamArticle` 等平行结构

**验收标准：**

- [x] AC-1 Article 顶层：`id`、`version`、`metadata`、`input`、`styleAssignment`、`blocks`、`generation?`
- [x] AC-2 `ArticleMetadata`、`InputSource`、`StyleAssignment`、`GenerationMeta` 与 `article-schema.md` 一致
- [x] AC-3 `blocks: Block[]` 复用 `blockSchema`；至少 1 个 block
- [x] AC-4 `version` 固定 literal `1`
- [x] AC-5 Article `.strict()`；无 CSS / style / className
- [x] AC-6 单元测试 23 cases（`tests/core/article/article-schema.test.ts`）
- [x] AC-7 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过

---

## S2-STORY-005 Schema normalize / parse / validation helper

**用户故事：** 作为开发者，我需要统一的 parse / validate / normalize 入口，以便 fixture、测试与后续 Generation 终态共用同一校验与归一逻辑。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s2-schema-helpers`（已 merge 至 `sprint/s2-article-block-schema` @ `9a7d625`）

**明确不做：**

- 不实现 JSONL / SSE 流式 parser
- 不实现 Style Assignment 解析或 StyleOrchestrator
- 不实现 fixtures 总装（S2-STORY-006）
- 不修改 Renderer / Copy pipeline

**验收标准：**

- [x] AC-1 `parseArticle(input: unknown): Article` + `ArticleSchemaError`
- [x] AC-2 `validateArticle` + `parseBlock` / `validateBlock`（`@/core/blocks`）
- [x] AC-3 `normalizeArticle`：paragraph / lead `content.text` string → InlineContent（复用 `normalizeInlineContent`）
- [x] AC-4 `SchemaValidationResult` / `SchemaValidationIssue` + `formatZodIssues`（`@/core/schema`）
- [x] AC-5 非法输入显式失败；`validateArticle` 不 throw
- [x] AC-6 单元测试 23 helper cases + 3 schema cases（`article-helpers.test.ts`、`validation-result.test.ts`）
- [x] AC-7 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过

---

## S2-STORY-006 基础 fixtures 与 schema 单元测试

**用户故事：** 作为开发者，我需要可复用的 Article / Block JSON fixture 与 schema 单元测试，以便后续 Sprint 3~6 在不重写测试数据的情况下扩展。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s2-schema-fixtures`（已 merge 至 `sprint/s2-article-block-schema` @ `049b427`）

**明确不做：**

- 不实现 Copy HTML snapshot fixture（Sprint 6-A）
- 不实现 Paste QA 记录
- 不覆盖 33 variants 或 StyleDefinition fixture

**验收标准：**

- [x] AC-1 `minimalArticleFixture` 最小合法 Article（`tests/fixtures/articles/`）
- [x] AC-2 `inlineMarksArticleFixture` 覆盖 bold / italic / highlight / color / link
- [x] AC-3 fixture 路径 `tests/fixtures/articles/` + `index.ts` 统一导出
- [x] AC-4 Vitest：`parseArticle` / `validateArticle` / `normalizeArticle` 与 fixtures 打通
- [x] AC-5 `fullBlocksArticleFixture` 覆盖 11 种 block 类型
- [x] AC-6 `corepack pnpm test` 通过
- [x] AC-7 `corepack pnpm lint` / `corepack pnpm build` 通过

---

## S2-STORY-007 Sprint 2 契约 audit 与关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 2 代码实现完成后做一次契约 audit，确认 TS/Zod 与 architecture 文档一致，并准备 Sprint 2 关闭与 Sprint 3 启动条件。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s2-contract-audit-close-readiness`（已 merge 至 `sprint/s2-article-block-schema` @ `5eda6cd`）

**明确不做：**

- 不在 audit 轮修复 Style System / Renderer / Generation 代码
- 不自行宣布 Sprint 2 Done（须用户确认）
- 不 merge sprint 分支至 `release/1`，除非用户确认

**验收标准：**

- [x] AC-1 已生成 `docs/architecture/audits/sprint2-contract-audit.md`
- [x] AC-2 audit 对照 `article-schema.md`、`block-schema.md`、DECISION-034（text 字段）
- [x] AC-3 audit 输出 P0=0 / P1=1 / P2=3；P0=0 建议可关闭 Sprint 2（待用户确认）
- [x] AC-4 S2-STORY-002~006 状态与 sprint-backlog 已同步 Done
- [x] AC-5 sprint-plan / changelog 已更新 Sprint 2 In Review / Close Readiness
- [x] AC-6 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过
- [x] AC-7 已生成 execution report
- [x] AC-8 Sprint 2 已关闭（用户确认 2026-05-31；DECISION-054）

---

## Sprint 2 Close Readiness

> **状态：已关闭**（2026-05-31；用户确认；DECISION-054）

| 项 | 状态 |
|----|------|
| S2-STORY-002~007 | Done |
| Contract audit | ✅ A 级，P0=0，P1=1，P2=3（用户已接受） |
| Code audit | ✅ A 级，P0=0，P1=3，P2=5（用户已接受） |
| lint / test / build | PASS |
| Sprint 2 关闭 | ✅ **已关闭**（2026-05-31） |
| merge sprint → `release/1` | ✅ 用户已确认执行 |

---

# Sprint 3-A Backlog

> **Sprint 3-A 目标：** Style System **代码契约与 Registry 基础设施**（Theme / Preset / VariantDefinition / StyleResolver / WeChatCompatibilityProfile / validation helpers）
> **Sprint 3-A 分支：** `sprint/s3a-style-system-infra`（从 `release/1` 切出，DECISION-055）· **状态：Closed**（2026-05-31；DECISION-057）
> **Sprint 3-A 不做：** 33 first-wave required variants 全量 registry、Preview / Copy Renderer、AI Style Selection 生成、VisualAssetRegistry 全量 assets

---

## S3A-STORY-001 Sprint 3-A 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 3-A 并拆分 Backlog，以便团队在明确边界下按 Story 逐步实现 Style System 基础设施。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3a-start-backlog-split`

**明确不做：**

- 不实现 Style System 业务代码（S3A-STORY-002 起）
- 不实现 33 variants registry
- 不实现 Preview / Copy Renderer
- 不 merge 至 `release/1` 或 `main`（本轮由用户审查后 merge sprint 分支）

**验收标准：**

- [x] AC-1 工作区干净；已从 `release/1` 创建 `sprint/s3a-style-system-infra`
- [x] AC-2 `sprint-backlog.md` 已新增 Sprint 3-A Backlog（S3A-STORY-001~007）
- [x] AC-3 `sprint-plan.md` Sprint 3-A 状态已更新为 In Progress
- [x] AC-4 `changelog.md` 已记录 Sprint 3-A 启动与 sprint 分支建立
- [x] AC-5 `decisions.md` 已记录 DECISION-055
- [x] AC-6 每个 Story 含用户故事、优先级、状态、工作分支、AC、不做事项
- [x] AC-7 `corepack pnpm lint` / `corepack pnpm build` 通过
- [x] AC-8 已生成 execution report

---

## S3A-STORY-002 Style System 基础类型与 schema 契约

**用户故事：** 作为开发者，我需要 Theme / Preset / VariantDefinition / StyleRegistry 的 TypeScript 类型与 Zod Schema，以便后续 StyleResolver 与 Sprint 3-B variant registry 有统一契约。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3a-style-system-schema`（已 merge 至 `sprint/s3a-style-system-infra`，`08bc500`）

**明确不做：**

- 不写 33 first-wave required variants 定义
- 不实现 Preview / Copy Renderer
- 不输出 Copy HTML

**验收标准：**

- [x] AC-1 `ThemeDefinition`、`PresetDefinition`、`VariantDefinition` TS 类型完成（`src/core/styles/types.ts`）
- [x] AC-2 `StyleRegistry` 结构与 `schemaVersion` 完成（`STYLE_SCHEMA_VERSION = 1`）
- [x] AC-3 Zod schema 覆盖上述类型；`.strict()` 拒绝未知字段
- [x] AC-4 `ColorTokenRef` 基础契约 + `inlineMarkColorInputSchema` legacy 兼容
- [x] AC-5 VariantDefinition 复用 `BlockType`；禁止 html/className/style/css
- [x] AC-6 registry helper：parse / validate / getThemeById / getPresetById / getVariantById / getVariantsForBlockType
- [x] AC-7 单元测试 28 cases（`tests/core/styles/`）
- [x] AC-8 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过

---

## S3A-STORY-003 ResolvedStyle 与 StyleResolver 最小实现

**用户故事：** 作为开发者，我需要 StyleResolver 最小实现，将 Article.styleAssignment 解析为 ResolvedBlockStyle / ResolvedArticleStyle，以便 Preview / Copy 后续共享同一 resolved 输入。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3a-style-resolver`（已 merge 至 `sprint/s3a-style-system-infra`，`85ffcbd`）

**明确不做：**

- 不实现文章级复杂 StyleOrchestrator 编排（Sprint 3-C）
- 不实现 AI 样式选择
- 不实现 Renderer 输出

**验收标准：**

- [x] AC-1 已从 `sprint/s3a-style-system-infra` 创建 `feature/s3a-style-resolver`
- [x] AC-2 `ResolvedBlockStyle`、`ResolvedArticleStyle` 类型完成（`src/core/styles/types.ts`）
- [x] AC-3 `resolveArticleStyle` / `resolveBlockStyle` 最小实现完成（`src/core/styles/resolver.ts`）
- [x] AC-4 resolver 输入使用 Article + StyleRegistry，不引入平行 Article 模型
- [x] AC-5 variant 选择优先级：block-level assignment > preset default > registry fallback
- [x] AC-6 preset / theme 解析有明确 fallback 或 issue
- [x] AC-7 fallback 不 silent fail，记录 issue / fallbackReason
- [x] AC-8 fallback 不默认选择 experimental
- [x] AC-9 `magazine_left_bar_title` 不作为 required 默认 fallback
- [x] AC-10 resolver 不修改 Article / Block 主模型
- [x] AC-11 resolver 输出不包含 html / css / className / style / React component
- [x] AC-12 单元测试 16 cases（`tests/core/styles/style-resolver.test.ts` + `tests/fixtures/styles/`）
- [x] AC-13 `corepack pnpm lint` 通过
- [x] AC-14 `corepack pnpm test` 通过（170 tests）
- [x] AC-15 `corepack pnpm build` 通过
- [x] AC-16 已生成 execution report
- [x] AC-17 已 merge 至 `sprint/s3a-style-system-infra`（用户确认 2026-05-31）

---

## S3A-STORY-004 WeChatCompatibilityProfile 机器可读契约

**用户故事：** 作为开发者，我需要 WeChatCompatibilityProfile 的机器可读契约与 copy-safe 校验 helper，以便 VariantDefinition 的 compatibility 字段有统一校验基础。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3a-wechat-compatibility-profile`（已 merge 至 `sprint/s3a-style-system-infra`，`11a3d11`）

**明确不做：**

- 不做人工粘贴 QA
- 不做 Copy Renderer
- 不做 PasteTestRecord

**验收标准：**

- [x] AC-1 已从 `sprint/s3a-style-system-infra` 创建 `feature/s3a-wechat-compatibility-profile`
- [x] AC-2 已定义 WeChatCompatibilityProfile 类型与 schema（`src/core/styles/types.ts` / `schemas.ts`）
- [x] AC-3 已定义 allowed / risky / forbidden CSS 能力分层（`WECHAT_MP_COMPATIBILITY_PROFILE`）
- [x] AC-4 已定义基础 FallbackPolicy 数据结构
- [x] AC-5 已提供默认 `WECHAT_MP_COMPATIBILITY_PROFILE`
- [x] AC-6 已打通 VariantDefinition.compatibility 的 copySafety / wechat 字段
- [x] AC-7 已实现 validateVariantWechatCompatibility / validateCssPropertyCompatibility / validateCssDeclarationCompatibility
- [x] AC-8 forbidden CSS 不得 silent allow
- [x] AC-9 risky CSS 至少产生 warning / issue
- [x] AC-10 preview_only 不得进入 release1_required 默认 copy-safe path
- [x] AC-11 单元测试 19 cases（`tests/core/styles/wechat-compatibility.test.ts`）
- [x] AC-12 未实现 Copy Renderer / Preview Renderer / 33 variants / Paste QA
- [x] AC-13 `corepack pnpm lint` 通过
- [x] AC-14 `corepack pnpm test` 通过（189 tests）
- [x] AC-15 `corepack pnpm build` 通过
- [x] AC-16 已生成 execution report
- [x] AC-17 已 merge 至 `sprint/s3a-style-system-infra`（`11a3d11`，用户确认 2026-05-31）

---

## S3A-STORY-005 StyleValidationResult / FallbackVariantPolicy

**用户故事：** 作为开发者，我需要统一的 Style 层 validation result 与 FallbackVariantPolicy，以便 registry 校验与后续 UI / QA 有稳定错误结构。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3a-style-validation-policy`（已 merge 至 `sprint/s3a-style-system-infra`，`bcd6947`；用户确认验收 2026-05-31）

**copySafety 命名统一（本轮）：** 以 `style-system.md` 为准，统一为 `strict | balanced | preview_only`；legacy `safe`/`risky` 仅经 `normalizeCopySafetyInput` helper 兼容，非主模型。

**验收标准：**

- [x] AC-1 ~ AC-18（见上轮 execution report）
- [x] AC-19 已 merge 至 `sprint/s3a-style-system-infra`（本轮前置 merge）

---

## S3A-STORY-006 TitleBlockLayoutCompatibility 契约

**用户故事：** 作为开发者，我需要 TitleBlockLayoutCompatibility 契约（layoutMode / allowedInCopy / fallbackLayoutMode / riskLevel），以便 first-wave required variants 与 candidate variants 的 copy-safe 边界清晰。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3a-title-layout-compatibility`（已 merge 至 `sprint/s3a-style-system-infra`，`f44a131`）

**明确不做：**

- 不将 `magazine_left_bar_title` 纳入 first-wave required（保持 candidate）
- 不实现 titleBlock Renderer

**验收标准：**

- [x] AC-1 已从 `sprint/s3a-style-system-infra` 创建 `feature/s3a-title-layout-compatibility`
- [x] AC-2 已定义 TitleBlockLayoutMode（11 项）
- [x] AC-3 已定义 TitleBlockLayoutCompatibility 类型与 schema
- [x] AC-4 已提供 TITLE_BLOCK_LAYOUT_COMPATIBILITY_TABLE
- [x] AC-5 compatibility table 覆盖全部 layoutMode
- [x] AC-6 已与 VariantDefinition.componentProtocol.layoutMode 最小打通
- [x] AC-7 已实现 getTitleBlockLayoutCompatibility / validateTitleBlockLayoutCompatibility / isTitleBlockLayoutAllowedForCopy / getFallbackTitleBlockLayoutMode
- [x] AC-8 release1_required + overlay / offset_background 必须 error
- [x] AC-9 release1_required + magazine_left_bar 必须 error
- [x] AC-10 candidate + magazine_left_bar 可存在但 warning（不得进入 required 默认路径）
- [x] AC-11 fallbackLayoutMode 必须更安全，不得指向自身
- [x] AC-12 helper 输出 StyleValidationResult
- [x] AC-13 单元测试 16 cases（`tests/core/styles/title-layout-compatibility.test.ts`）
- [x] AC-14 未实现 renderer / 33 variants / Paste QA / AI Style Selection
- [x] AC-15 `corepack pnpm lint` 通过
- [x] AC-16 `corepack pnpm test` 通过（221 tests）
- [x] AC-17 `corepack pnpm build` 通过
- [x] AC-18 已生成 execution report
- [x] AC-19 已 merge 至 `sprint/s3a-style-system-infra`（`f44a131`，用户确认 2026-05-31）

---

## S3A-STORY-007 Sprint 3-A 契约 audit 与关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 3-A 代码实现完成后做契约 audit，确认与 style-system.md 一致，并准备 Sprint 3-B 启动条件。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3a-contract-audit-close-readiness`（已 merge 至 sprint）

**用户确认（2026-05-31）：**

- 用户已确认接受 contract audit **A** 级
- 用户已确认 **P0=0**
- 用户已确认关闭 Sprint 3-A（DECISION-057）
- merge `sprint/s3a-style-system-infra` → `release/1` 已由用户确认执行

**明确不做：**

- 不在 audit 轮实现 33 variants 或 Renderer
- 不自行宣布 Sprint 3-A Done（须用户确认）
- 不 merge sprint 分支至 `release/1`，除非用户确认

**验收标准：**

- [x] AC-1 已从 `sprint/s3a-style-system-infra` 创建 `docs/s3a-contract-audit-close-readiness`
- [x] AC-2 已生成 `docs/architecture/audits/sprint3a-contract-audit.md`
- [x] AC-3 audit 覆盖 S3A-STORY-002~006 全部代码契约
- [x] AC-4 audit 覆盖 Style System / Resolver / WeChatCompatibility / Validation / TitleLayout
- [x] AC-5 audit 输出 P0 / P1 / P2（P0=0，P1=4，P2=3；grade A）
- [x] AC-6 audit 明确 Sprint 3-A 可进入 Close Readiness（须用户确认关闭）
- [x] AC-7 已最小修复 layoutMode §11.10 / §12 与 copySafety 文档一致性
- [x] AC-8 sprint-backlog 已同步 S3A-STORY-002~006 状态 Done
- [x] AC-9 sprint-plan 已同步 Sprint 3-A 为 In Review / Close Readiness
- [x] AC-10 changelog 已记录 S3A-STORY-007 audit
- [x] AC-11 未实现任何新业务功能
- [x] AC-12 未 merge 到 `release/1` 或 `main`
- [x] AC-13 `corepack pnpm lint` 通过
- [x] AC-14 `corepack pnpm test` 通过（221 tests）
- [x] AC-15 `corepack pnpm build` 通过
- [x] AC-16 已生成 execution report
- [x] AC-17 未自行关闭 Sprint 3-A（用户确认后关闭，DECISION-057）

---

## Sprint 3-A Close Readiness

> **状态：已关闭**（2026-05-31；用户确认；DECISION-057）

| 项 | 状态 |
|----|------|
| S3A-STORY-001~007 | Done |
| Contract audit | ✅ A 级，P0=0，P1=4，P2=3（用户已接受） |
| lint / test / build | PASS（221 tests） |
| Sprint 3-A 范围未越界 | ✅ |
| Sprint 3-A 关闭 | ✅ **已关闭**（2026-05-31） |
| merge sprint → `release/1` | ✅ 用户已确认执行 |
| 下一步 | Sprint 4-A：Preview / Copy Renderer for Text-first Blocks（**In Progress**，DECISION-060） |

---

# Sprint 3-B Backlog

> **Sprint 3-B 目标：** First-wave **11 block × 3 = 33** release1_required variants registry；title / heading titleBlock ComponentProtocol；SlotContentBinding 规则落地
> **Sprint 3-B 状态：** **Closed**（2026-06-01；用户确认接受 audit A / P0=0，并确认关闭 Sprint 3-B 与 merge sprint → `release/1`）
> **Sprint 3-B 分支：** `sprint/s3b-first-wave-variant-registry`（从 `release/1` 切出，DECISION-058）
> **Sprint 3-B 前置遗留（须纳入 planning）：** P1-S3A-001（§11.4 layoutMode 映射）、P2-S3A-002（slot 级 copySafety）
> **Sprint 3-B 不做：** Preview / Copy Renderer、Paste QA、AI Style Selection 生成、VisualAssetRegistry 全量 assets、StyleOrchestrator、Generation / Streaming
> **Sprint 3-B Close Readiness：** 用户已确认；S3B-STORY-001~007 全部 Done；`sprint/s3b-first-wave-variant-registry` 已 merge 至 `release/1`（DECISION-059）

---

## Sprint 3-B Close Readiness

> **状态：已关闭**（2026-06-01；用户确认；DECISION-059）

| 项 | 状态 |
|----|------|
| S3B-STORY-001~007 | Done |
| Contract audit | ✅ A 级，P0=0，P1=5，P2=3（用户已接受） |
| lint / test / build | PASS（286 tests） |
| Sprint 3-B 关闭 | ✅ **已关闭**（2026-06-01） |
| merge sprint → `release/1` | ✅ 用户已确认执行（`9040ef9`） |
| 下一步 | Sprint 4-A 启动（DECISION-060） |

---

## S3B-STORY-001 Sprint 3-B 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 3-B 并拆分 Backlog，以便团队在明确边界下逐步实现 first-wave 33 variants registry。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3b-start-backlog-split`

**明确不做：**

- 不实现 variant registry 代码（S3B-STORY-002 起）
- 不实现 Preview / Copy Renderer
- 不 merge 至 `release/1` 或 `main`（本轮由用户审查后 merge sprint 分支）
- 不关闭 Sprint 3-B

**验收标准：**

- [x] AC-1 工作区启动前干净
- [x] AC-2 已从 `release/1` 创建 `sprint/s3b-first-wave-variant-registry`
- [x] AC-3 已从 sprint 分支创建 `docs/s3b-start-backlog-split`
- [x] AC-4 `sprint-backlog.md` 已新增 Sprint 3-B Backlog（S3B-STORY-001~007）
- [x] AC-5 `sprint-plan.md` 已将 Sprint 3-B 更新为 In Progress
- [x] AC-6 `decisions.md` 已新增 DECISION-058
- [x] AC-7 `changelog.md` 已记录 Sprint 3-B 启动
- [x] AC-8 `product-backlog.md` 已将 P1-S3A-001 / P2-S3A-002 纳入 Sprint 3-B
- [x] AC-9 Sprint 3-B 范围未越界（未实现 variants 代码 / renderer / copy）
- [x] AC-10 `corepack pnpm lint` 通过
- [x] AC-11 `corepack pnpm test` 通过
- [x] AC-12 `corepack pnpm build` 通过
- [x] AC-13 已生成 execution report
- [x] AC-14 未 merge 到 sprint / release / main
- [x] AC-15 未启动 S3B-STORY-002

---

## S3B-STORY-002 titleBlock catalog mapping 与 slot copySafety 收口

**用户故事：** 作为开发者，我需要在实现 33 variants 前收口 layoutMode 映射与 slot copySafety 规则，以免 registry 写错 layoutMode 或 copySafety。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3b-titleblock-mapping-slot-copysafety`（已 merge 至 sprint）

**P1-S3A-001 / P2-S3A-002：** ✅ 已收口（layoutMode mapping + slot copySafety schema/validation）

**明确不做：**

- 不写 33 variants registry 定义
- 不实现 Preview / Copy Renderer

**验收标准：**

- [x] AC-1 layoutMode DSL catalog → code enum 映射表可执行且与 `title-layout.ts` 一致
- [x] AC-2 slot 级 copySafety 规则写入 style-system 与 validation
- [x] AC-3 first-wave 允许的 slot / layoutMode / copySafety 组合文档化
- [x] AC-4 单元测试覆盖 mapping / copySafety 校验
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过（241 tests）
- [x] AC-6 已生成 execution report

---

## S3B-STORY-003 title / heading titleBlock first-wave variants

**用户故事：** 作为开发者，我需要为 title / heading block 各实现 3 个 release1_required variants，以便 Sprint 4 Renderer 有 copy-safe titleBlock 样式可用。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3b-title-heading-variants`

**已实现 variants（6）：**

| id | blockType | layoutMode |
|----|-----------|------------|
| `title_plain_minimal` | title | `plain` |
| `title_left_bar_classic` | title | `left_bar` |
| `title_bottom_line_editorial` | title | `bottom_line` |
| `heading_plain_minimal` | heading | `plain` |
| `heading_numbered_section` | heading | `numbered` |
| `heading_top_badge_topic` | heading | `top_badge` |

**明确不做：**

- 不实现 Preview / Copy Renderer
- 不实现 magazine_left_bar_title candidate variant

**验收标准：**

- [x] AC-1 title 3 variants + heading 3 variants 注册至 StyleRegistry fixture
- [x] AC-2 每个 variant `releaseTier = release1_required`（status）
- [x] AC-3 全部通过 StyleValidationResult（无 error）
- [x] AC-4 单元测试覆盖 6 variants（`title-heading-variants.test.ts`）
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-6 已生成 execution report
- [x] AC-7 已 merge 至 `sprint/s3b-first-wave-variant-registry`（`ba062ae`，用户确认 2026-06-01）

---

## S3B-STORY-004 text-first block first-wave variants

**用户故事：** 作为开发者，我需要为 lead / paragraph / divider / list 各实现 3 个 release1_required variants，以便 Sprint 4-A text-first Renderer 有样式可用。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3b-text-first-variants`

**已实现 variants（12）：**

| id | blockType | copySafety |
|----|-----------|------------|
| `lead_plain_intro` | lead | strict |
| `lead_accent_band` | lead | balanced |
| `lead_quote_intro` | lead | balanced |
| `paragraph_plain_body` | paragraph | strict |
| `paragraph_accent_left` | paragraph | balanced |
| `paragraph_soft_card` | paragraph | balanced |
| `divider_simple_line` | divider | strict |
| `divider_dotted_line` | divider | balanced |
| `divider_section_space` | divider | strict |
| `list_plain_bullets` | list | strict |
| `list_numbered_steps` | list | balanced |
| `list_checklist_cards` | list | balanced |

**明确不做：**

- 不实现 Preview / Copy Renderer

**验收标准：**

- [x] AC-1 4 block × 3 = 12 variants 注册完成
- [x] AC-2 全部 `releaseTier = release1_required`（status）
- [x] AC-3 全部通过 StyleValidationResult
- [x] AC-4 单元测试覆盖（`text-first-variants.test.ts`）
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-6 已生成 execution report
- [x] AC-7 已 merge 至 `sprint/s3b-first-wave-variant-registry`（`3350777`，用户确认 2026-06-01）

---

## S3B-STORY-005 structured block first-wave variants

**用户故事：** 作为开发者，我需要为 quote / highlight / info_card / cta / image_placeholder 各实现 3 个 release1_required variants，以便 Sprint 4-B structured Renderer 有样式可用。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3b-structured-block-variants`

**已实现 variants（15）：**

| id | blockType | copySafety |
|----|-----------|------------|
| `quote_plain` | quote | strict |
| `quote_left_bar` | quote | balanced |
| `quote_card` | quote | balanced |
| `highlight_inline_emphasis` | highlight | strict |
| `highlight_accent_band` | highlight | balanced |
| `highlight_soft_card` | highlight | balanced |
| `info_card_key_takeaway` | info_card | balanced |
| `info_card_steps` | info_card | balanced |
| `info_card_warning_note` | info_card | balanced |
| `cta_plain_text` | cta | strict |
| `cta_button_like` | cta | balanced |
| `cta_qr_placeholder` | cta | balanced |
| `image_placeholder_simple` | image_placeholder | strict |
| `image_placeholder_caption` | image_placeholder | balanced |
| `image_placeholder_card` | image_placeholder | balanced |

**明确不做：**

- 不实现 Copy Renderer
- 不实现 VisualAssetRegistry 全量 assets

**验收标准：**

- [x] AC-1 5 block × 3 = 15 variants 注册完成
- [x] AC-2 全部 `releaseTier = release1_required`（status）
- [x] AC-3 全部通过 StyleValidationResult
- [x] AC-4 单元测试覆盖（`structured-variants.test.ts`）
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-6 已形成 33 variants 聚合（coverage 细测留 S3B-STORY-006）
- [x] AC-7 已生成 execution report
- [x] AC-8 已 merge 至 `sprint/s3b-first-wave-variant-registry`（`f5771eb`，用户确认 2026-06-01）

---

## S3B-STORY-006 first-wave registry validation 与 coverage 测试

**用户故事：** 作为开发者，我需要验证 first-wave registry 覆盖 33 variants 且全部 copy-safe，以便 Sprint 3-B 关闭前有可验收的 coverage gate。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3b-first-wave-coverage`

**目标：**

- first-wave variants 总数 = **33**
- 11 block 每个恰好 3 个 release1_required variants
- 全部 required variants 通过 StyleValidationResult
- 无 preview_only / experimental / candidate 混入 required
- title / heading 不含 magazine_left_bar / overlay / offset_background
- SlotContentBinding 完整

**验收标准：**

- [x] AC-1 coverage 测试断言 33 variants
- [x] AC-2 11 block × 3 分布测试
- [x] AC-3 全量 StyleValidationResult PASS
- [x] AC-4 forbidden layoutMode / releaseTier 混入测试
- [x] AC-5 SlotContentBinding 完整性测试
- [x] AC-6 registry helper 按 blockType / id 查询稳定
- [x] AC-7 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-8 已生成 execution report
- [x] AC-9 已 merge 至 `sprint/s3b-first-wave-variant-registry`（`7837dce`，用户确认 2026-06-01）

---

## S3B-STORY-007 Sprint 3-B contract audit 与关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 3-B 完成后做契约 audit，确认 33 variants registry 与 style-system.md 一致，并准备 Sprint 4-A 启动条件。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3b-contract-audit-close-readiness`

**Audit 结论：** Grade **A**；P0=0，P1=5，P2=3；用户已确认接受 audit、确认关闭 Sprint 3-B，并确认 merge `sprint/s3b-first-wave-variant-registry` → `release/1`。

**明确不做：**

- 不自行关闭 Sprint 3-B（须用户确认）
- 不 merge 至 `release/1`，除非用户确认

**验收标准：**

- [x] AC-1 已生成 `docs/architecture/audits/sprint3b-contract-audit.md`
- [x] AC-2 audit 覆盖 33 variants 与 Sprint 3-B 全部 Story
- [x] AC-3 audit 输出 P0 / P1 / P2（P0=0，P1=5，P2=3）
- [x] AC-4 Sprint 3-B 范围未越界
- [x] AC-5 lint / test / build PASS（286 tests）
- [x] AC-6 已生成 execution report
- [x] AC-7 未自行关闭 Sprint 3-B
- [x] AC-8 未 merge 至 `release/1` / `main`

---

# Sprint 4-A Backlog

> **Sprint 4-A 目标：** Preview / Copy Renderer for **text-first blocks**（title / lead / heading / paragraph / divider）；使用 Sprint 3-B first-wave required variants；建立 Preview / Copy 成对 Renderer 实现边界；启动最小 Paste QA seed
> **Sprint 4-A 状态：** **Closed**（2026-06-01；用户确认；DECISION-061）
> **Sprint 4-A 分支：** `sprint/s4a-text-first-renderer`（从 `release/1` 切出，DECISION-060；已 merge 至 `release/1`）
> **Sprint 4-A 前置遗留（须纳入 planning）：** P1-S3B-001、P1-S3B-002、P1-S3B-004、P2-S3B-002、P2-S3B-003 / P1-CODE-002、P1-S3A-004（见下方登记表）
> **Sprint 4-A 不做：** structured blocks（list / quote / highlight / info_card / cta / image_placeholder）、AI Style Selection、Generation / Streaming、完整 33 variants Paste QA、VisualAssetRegistry 全量 assets、StyleOrchestrator

> **Sprint 4-A Close Readiness：** 用户已确认；S4A-STORY-001~007 全部 Done；`sprint/s4a-text-first-renderer` 已 merge 至 `release/1`（DECISION-061）

---

## Sprint 4-A Close Readiness

> **状态：已关闭**（2026-06-01；用户确认；DECISION-061）

| 项 | 状态 |
|----|------|
| S4A-STORY-001~007 | Done |
| Renderer contract audit | ✅ A 级，P0=0，P1=4，P2=1（用户已接受） |
| lint / test / build | PASS（378 tests） |
| Sprint 4-A 关闭 | ✅ **已关闭**（2026-06-01） |
| merge sprint → `release/1` | ✅ 用户已确认执行（`b2efdb2`） |
| 下一步 | Sprint 4-B 未启动（待用户确认） |

---

## Sprint 4-A 前置遗留登记（须纳入 planning）

| ID | 问题 | 纳入 Story | 说明 |
|----|------|------------|------|
| **P1-S3B-001** | 33 variants 尚未经过 Preview / Copy Renderer 实际保真验证 | S4A-STORY-003~006 | Sprint 4-A 先验证 text-first blocks |
| **P1-S3B-002** | `balanced` copySafety variants 可能在微信粘贴中出现细节差异 | S4A-STORY-006 | 启动最小 Paste QA seed |
| **P1-S3B-004** | 缺少 style quality gallery / 人工视觉验收入口 | 登记 · 后续 gallery / QA 支撑 | 不必 Sprint 4-A 实现 |
| **P2-S3B-002** | WeChat profile 文档字段与代码结构仍有轻微命名差异 | S4A-STORY-002 | Sprint 4-A 前置处理 |
| **P2-S3B-003 / P1-CODE-002** | InlineMark color 与 Style ColorTokenRef 跨模块校验未打通 | S4A-STORY-004 | copy-safe CSS 映射前置 |
| **P1-S3A-004** | ResolvedBlockStyle 未展开 componentProtocol | S4A-STORY-002 / S4A-STORY-003 | Renderer 输入契约 |

---

## S4A-STORY-001 Sprint 4-A 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 4-A 并拆分 Backlog，以便团队在明确边界下按 Story 逐步实现 text-first Preview / Copy Renderer。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s4a-start-backlog-split`（已 merge 至 `sprint/s4a-text-first-renderer` @ `bb5051d`）

**明确不做：**

- 不实现 Preview / Copy Renderer 代码（S4A-STORY-002 起）
- 不实现 title / heading / paragraph / divider 渲染逻辑
- 不新增业务页面
- 不 merge 至 `release/1` 或 `main`（本轮由用户审查后 merge sprint 分支）
- 不关闭 Sprint 4-A

**验收标准：**

- [x] AC-1 工作区启动前干净
- [x] AC-2 已从 `release/1` 创建 `sprint/s4a-text-first-renderer`
- [x] AC-3 已从 sprint 分支创建 `docs/s4a-start-backlog-split`
- [x] AC-4 `sprint-backlog.md` 已修正 Sprint 3-B 状态漂移；已新增 Sprint 4-A Backlog（S4A-STORY-001~007）
- [x] AC-5 `sprint-plan.md` 已修正 Sprint 3-B 状态漂移；Sprint 4-A 已更新为 In Progress
- [x] AC-6 `product-backlog.md` 已同步 3-B → 4-A renderer 验收状态
- [x] AC-7 `decisions.md` 已新增 DECISION-060
- [x] AC-8 `changelog.md` 已记录 Sprint 4-A 启动
- [x] AC-9 Sprint 4-A 前置遗留已登记至 planning
- [x] AC-10 Sprint 4-A 范围未越界（未实现 Renderer 代码）
- [x] AC-11 `corepack pnpm lint` 通过
- [x] AC-12 `corepack pnpm test` 通过
- [x] AC-13 `corepack pnpm build` 通过
- [x] AC-14 已生成 execution report
- [x] AC-15 未 merge 到 sprint / release / main
- [x] AC-16 未启动 S4A-STORY-002

---

## S4A-STORY-002 Preview / Copy Renderer 基础接口与共享输入契约

**用户故事：** 作为开发者，我需要 Preview Renderer / Copy Renderer 的基础接口与共享输入契约，以便 text-first blocks 的成对实现有统一边界且与 StyleResolver 输出一致。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4a-renderer-base-contract`（已 merge 至 `sprint/s4a-text-first-renderer` @ `a0a5ed6`）

**纳入遗留：** P2-S3B-002（WeChat profile 文档字段对齐）；P1-S3A-004（ResolvedBlockStyle componentProtocol 展开）

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/types.ts` | RenderMode / RenderTarget / RendererResult / RendererIssue |
| `src/core/renderer/context.ts` | Article + ResolvedArticleStyle 输入校验、BlockRenderContext |
| `src/core/renderer/resolved-view.ts` | componentProtocol 展开、slot disabled/fallback 视图 |
| `src/core/renderer/registry.ts` | block renderer registry 最小实现 |
| `src/core/renderer/render-block.ts` | `renderBlock` / `renderArticleBlocks` 编排 |
| `src/core/renderer/index.ts` | 模块导出 |
| `src/core/copy/wechat-profile-bridge.ts` | WeChat profile 文档字段 ↔ 代码结构映射（P2-S3B-002） |
| `src/core/copy/index.ts` | Copy 路径 re-export |
| `tests/core/renderer/renderer-contract.test.ts` | 契约测试 |
| `tests/core/renderer/renderer-registry.test.ts` | registry 测试 |
| `tests/core/copy/wechat-profile-bridge.test.ts` | profile bridge 测试 |

**明确不做：**

- 不引入 `mockArticle` / `streamArticle` / parallel render model
- 不输出业务页面或 UI 路由
- 不实现具体 block 渲染逻辑（S4A-STORY-003 起）
- 不实现 structured blocks Renderer

**验收标准：**

- [x] AC-1 已定义 Preview Renderer / Copy Renderer 基础接口（`src/core/renderer/`、`src/core/copy/`）
- [x] AC-2 输入契约明确使用 `Article` + `ResolvedArticleStyle` / `ResolvedBlockStyle`
- [x] AC-3 `ResolvedBlockStyle` 已展开 renderer 所需 `componentProtocol` 最小字段（`enrichResolvedBlockStyleForRenderer` / `ResolvedBlockStyleView`）
- [x] AC-4 WeChat profile 文档与代码结构命名差异已登记 fallback（`WECHAT_PROFILE_DOC_FIELD_BRIDGE`）
- [x] AC-5 Renderer 契约不输出 html / className / React component；Style 层未修改
- [x] AC-6 单元测试覆盖接口契约与非法输入（17 cases）
- [x] AC-7 `corepack pnpm lint` / `test` / `build` 通过（303 tests）
- [x] AC-8 已生成 execution report
- [x] AC-9 未实现具体 block renderer；未启动 S4A-STORY-003
- [x] AC-10 未 merge 至 sprint / release / main

---

## S4A-STORY-003 title / heading titleBlock Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 title / heading 的 titleBlock Preview / Copy 成对 Renderer，以便 first-wave 6 variants 可在页面预览与微信复制路径中一致呈现。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4a-title-heading-renderer`（已 merge 至 `sprint/s4a-text-first-renderer` @ `cdeb611`）

**纳入遗留：** P1-S3B-001（text-first 子集保真验证）；P1-S3A-004（componentProtocol 消费）

**目标 variants（6）：** `title_plain_minimal`、`title_left_bar_classic`、`title_bottom_line_editorial`、`heading_plain_minimal`、`heading_numbered_section`、`heading_top_badge_topic`

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/title-block-renderer.ts` | titleBlock Preview / Copy 渲染与校验 |
| `src/core/renderer/title-block-preview.ts` | Preview 结构化输出 |
| `src/core/renderer/title-block-registry.ts` | 4 路 registry 注册（title/heading × preview/copy） |
| `src/core/renderer/text-style.ts` | typography / slot 内容解析 |
| `src/core/copy/title-block-copy.ts` | Copy inline HTML（5 layoutMode） |
| `src/core/copy/html-escape.ts` | HTML 转义 |
| `src/core/copy/inline-style.ts` | inline style 构建 |
| `tests/core/renderer/title-heading-renderer.test.ts` | Preview / registry / fallback 测试 |
| `tests/core/copy/title-heading-copy-renderer.test.ts` | Copy HTML / escape 测试 |
| `tests/fixtures/renderer/title-heading-articles.ts` | 测试 fixture helper |

**明确不做：**

- 不实现 `magazine_left_bar_title` candidate variant
- 不实现 lead / paragraph / divider Renderer（S4A-STORY-004 / 005）
- 不实现业务页面 / Clipboard / Paste QA
- 不实现 VisualAssetRegistry 全量 assets

**验收标准：**

- [x] AC-1 title / heading 各 3 variants Preview Renderer 实现
- [x] AC-2 对应 Copy Renderer 成对实现；共享 ResolvedBlockStyle 输入
- [x] AC-3 optional slot（badge / decoration 等）disabled / fallback 行为明确（`resolveTitleBlockSlotContents` + warnings）
- [x] AC-4 layoutMode copy-safe 规则与 Sprint 3-A/B 契约一致（禁止 magazine_left_bar / overlay / offset_background）
- [x] AC-5 单元测试覆盖 6 variants Preview / Copy + registry / escape / fallback（21 cases）
- [x] AC-6 `corepack pnpm lint` / `test` / `build` 通过（324 tests）
- [x] AC-7 已生成 execution report
- [x] AC-8 未实现 lead / paragraph / divider / structured blocks
- [x] AC-9 未 merge 至 sprint / release / main
- [x] AC-10 未启动 S4A-STORY-004

---

## S4A-STORY-004 lead / paragraph InlineContent Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 lead / paragraph 支持 InlineContent 的 Preview / Copy Renderer，以便 bold / italic / highlight / color / link 在预览与复制路径中有最小 copy-safe 映射。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4a-inline-content-renderer`（已 merge 至 `sprint/s4a-text-first-renderer` @ `a50ea4c`）

**纳入遗留：** P2-S3B-003 / P1-CODE-002（Article semantic color token ↔ Style ColorTokenRef 完整 registry 校验仍待 Style 层收紧；本轮提供 alias 桥接 + fallback issue）

**目标 variants（6）：** `lead_plain_intro`、`lead_accent_band`、`lead_quote_intro`、`paragraph_plain_body`、`paragraph_accent_left`、`paragraph_soft_card`

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/inline-content-marks.ts` | InlineMark color / link 安全解析与 issue |
| `src/core/renderer/inline-content-preview.ts` | InlineContent Preview 节点映射 |
| `src/core/renderer/text-block-typography.ts` | lead / paragraph layout / typography |
| `src/core/renderer/text-block-preview.ts` | lead / paragraph Preview Renderer |
| `src/core/renderer/text-block-renderer.ts` | lead / paragraph 成对 render 入口 |
| `src/core/renderer/text-block-registry.ts` | `createTextBlockRendererRegistry()` |
| `src/core/copy/inline-content-html.ts` | InlineContent Copy inline HTML |
| `src/core/copy/text-block-copy.ts` | lead / paragraph variant layout Copy HTML |
| `src/core/copy/html-escape.ts` | 新增 `escapeHtmlAttribute` |
| `tests/core/renderer/lead-paragraph-renderer.test.ts` | Preview / registry / fallback 测试 |
| `tests/core/copy/inline-content-copy-renderer.test.ts` | marks / escape / color / link 测试 |
| `tests/core/copy/lead-paragraph-copy-renderer.test.ts` | 6 variants Copy HTML 测试 |
| `tests/fixtures/renderer/lead-paragraph-articles.ts` | lead / paragraph fixture |

**明确不做：**

- 不实现 divider Renderer（S4A-STORY-005）
- 不实现 list / quote / highlight / info_card / cta / image_placeholder 等 structured blocks
- 不新增业务页面 / Copy 按钮 / Clipboard API
- 不做 Paste QA（S4A-STORY-006）
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 lead / paragraph Preview Renderer 支持 `InlineContent`（含 string normalize）
- [x] AC-2 Copy Renderer 支持 bold / italic / highlight / color / link 最小 inline style 映射
- [x] AC-3 InlineMark `color` 与 Style `ColorTokenRef` 最小 alias 桥接；不可解析时 fallback + `unsafe_inline_color` warning
- [x] AC-4 copy-safe CSS 符合 WeChat 约束；Copy HTML 无 className / Tailwind / style tag；href 非法时 strip + `unsafe_link_href`
- [x] AC-5 单元测试覆盖 marks 组合、6 variants、registry、escape、非法 color / href（24 cases 新增）
- [x] AC-6 `corepack pnpm lint` / `test` / `build` 通过（348 tests）
- [x] AC-7 已生成 execution report
- [x] AC-8 未实现 divider / structured blocks / 业务页面 / Clipboard
- [x] AC-9 已 merge 至 `sprint/s4a-text-first-renderer`；未 merge 至 release / main

---

## S4A-STORY-005 divider Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 divider 3 个 first-wave variants 的 Preview / Copy 成对 Renderer，以便 section 分隔在微信复制中简单、安全、可复制。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4a-divider-renderer`（已 merge 至 `sprint/s4a-text-first-renderer` @ `eed8ffd`）

**纳入遗留：** P1-S3B-001（text-first 子集保真验证）

**目标 variants（3）：** `divider_simple_line`、`divider_dotted_line`、`divider_section_space`

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/divider-layout.ts` | divider layout / spacing 映射 |
| `src/core/renderer/divider-preview.ts` | divider Preview Renderer |
| `src/core/renderer/divider-renderer.ts` | divider 成对 render 入口 |
| `src/core/renderer/divider-registry.ts` | `createDividerRendererRegistry()` |
| `src/core/copy/divider-copy.ts` | divider Copy inline HTML |
| `tests/core/renderer/divider-renderer.test.ts` | Preview / registry / fallback 测试 |
| `tests/core/copy/divider-copy-renderer.test.ts` | Copy HTML / copy-safe 测试 |
| `tests/fixtures/renderer/divider-articles.ts` | divider fixture |

**明确不做：**

- 不实现 list / quote / highlight / info_card / cta / image_placeholder 等 structured blocks
- 不新增业务页面 / Copy 按钮 / Clipboard API
- 不做 Paste QA（S4A-STORY-006）
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 divider 3 variants Preview Renderer 实现
- [x] AC-2 对应 Copy Renderer 成对实现；共享 ResolvedBlockStyle 输入
- [x] AC-3 `balanced` / `strict` copySafety 行为与 registry 一致（`divider_dotted_line` balanced warning）
- [x] AC-4 输出 HTML 结构简单、微信粘贴安全（inline style；无 class / style tag / absolute / transform / pseudo）
- [x] AC-5 单元测试覆盖 3 variants Preview / Copy + registry / fallback（14 cases 新增）
- [x] AC-6 `corepack pnpm lint` / `test` / `build` 通过（362 tests）
- [x] AC-7 已生成 execution report
- [x] AC-8 未实现 structured blocks / 业务页面 / Clipboard / Paste QA
- [x] AC-9 已 merge 至 `sprint/s4a-text-first-renderer`；未 merge 至 release / main

---

## S4A-STORY-006 Text-first Copy HTML / Clipboard 双格式 / 最小 Paste QA seed

**用户故事：** 作为产品团队，我需要 text-first blocks 的 Copy HTML snapshot 与 Clipboard 双格式策略及最小 Paste QA seed，以便复制一致性有可回归基础，但不阻塞 Sprint 4-A 关闭。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4a-copy-html-clipboard-paste-seed`（已 merge 至 `sprint/s4a-text-first-renderer` @ `3b6d900`）

**纳入遗留：** P1-S3B-002（balanced copySafety paste 验证）；P1-S3B-004（gallery 登记，不必本轮实现）

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/copy/copy-safe-html.ts` | Copy HTML snapshot 安全断言 |
| `src/core/copy/text-first-copy-registry.ts` | Sprint 4-A text-first copy renderer registry |
| `src/core/copy/copy-html-snapshot.ts` | 基于现有 Copy Renderer 的 snapshot seed builder |
| `src/core/copy/clipboard-payload.ts` | `text/html` + `text/plain` payload builder（纯函数） |
| `src/core/copy/plain-text.ts` | text/plain fallback builder |
| `src/core/copy/paste-qa-seed.ts` | 最小 Paste QA seed 数据结构 |
| `tests/fixtures/copy/text-first-copy-fixtures.ts` | 6 个代表 variants 的 Article + Style fixture |
| `tests/core/copy/copy-html-snapshot.test.ts` | snapshot / copy-safe / missing renderer/style 测试 |
| `tests/core/copy/clipboard-payload.test.ts` | Clipboard 双格式 payload 测试 |
| `tests/core/copy/plain-text.test.ts` | text/plain fallback 测试 |
| `tests/core/copy/paste-qa-seed.test.ts` | Paste QA seed 测试 |
| `docs/agile/paste-qa/sprint4a-text-first-seed.md` | 最小 Paste QA seed 文档 |

**明确不做：**

- 不做完整 **33 variants** Paste QA（留 Sprint 4-B / 6-B）
- 不调用 `navigator.clipboard`，不实现浏览器 Clipboard 权限逻辑
- 不新增业务页面 / Copy 按钮
- 不实现 structured blocks Renderer
- 不实现 Style Gallery / AI Style Selection / Generation / Streaming
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 明确 `text/html` + `text/plain` 双格式 Clipboard payload（纯函数，不调用 Clipboard API）
- [x] AC-2 建立 text-first blocks 最小 Copy HTML snapshot seed（fixture，来源为现有 Copy Renderer）
- [x] AC-3 建立最小 Paste QA seed（TypeScript seed + markdown 记录，状态 Not Run）
- [x] AC-4 balanced variants 至少 1 条人工 paste 验证路径文档化（`heading_numbered_section` / `lead_accent_band` / `paragraph_soft_card` / `divider_dotted_line`）
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过（378 tests）
- [x] AC-6 已生成 execution report
- [x] AC-7 未实现 structured blocks / 业务页面 / Clipboard API / 真实 Paste QA
- [x] AC-8 已 merge 至 `sprint/s4a-text-first-renderer`；未 merge 至 release / main

---

## S4A-STORY-007 Sprint 4-A Renderer Contract Audit 与关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 4-A 完成后做 Renderer 契约 audit，确认 text-first Preview / Copy Renderer 与 architecture / style-system / copy-to-wechat 一致，并准备是否进入 Sprint 4-B。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s4a-renderer-contract-audit-close-readiness`（已 merge 至 `sprint/s4a-text-first-renderer` @ `c65a285`）

**实际产物：**

| 路径 | 说明 |
|------|------|
| `docs/architecture/audits/sprint4a-renderer-contract-audit.md` | Sprint 4-A Renderer Contract Audit（Grade A；P0=0；P1=4；P2=1） |
| `docs/agile/execution-reports/2026-06-01-s4a-renderer-contract-audit-close-readiness.md` | 本轮 execution report |

**Close Readiness 摘要：**

- S4A-STORY-002~006 均为 Done，且已 merge 至 `sprint/s4a-text-first-renderer`
- Contract audit：Grade A；P0=0；P1=4；P2=1
- Sprint 4-A 范围未越界：未实现 structured blocks / AI / Generation / Style Gallery
- Copy HTML / Clipboard / Paste QA seed 边界清晰：未调用 Clipboard API；Paste QA seed 为 Not Run
- 建议进入 Close Readiness；是否关闭 Sprint 4-A 需用户确认

**明确不做：**

- 不在 audit 轮实现 structured blocks Renderer
- 不自行关闭 Sprint 4-A（须用户确认）
- 不 merge 至 `release/1`，除非用户确认

**验收标准：**

- [x] AC-1 已生成 `docs/architecture/audits/sprint4a-renderer-contract-audit.md`
- [x] AC-2 audit 覆盖 S4A-STORY-002~006 全部交付
- [x] AC-3 audit 对照 `rendering-pipeline.md`、`style-system.md`、`copy-to-wechat-pipeline.md`、`wechat-copy-style-rules.md`
- [x] AC-4 audit 输出 P0 / P1 / P2（P0=0；P1=4；P2=1）
- [x] AC-5 Sprint 4-A 范围未越界（无 structured blocks / AI / Generation）
- [x] AC-6 lint / test / build PASS（378 tests）
- [x] AC-7 已生成 execution report
- [x] AC-8 未自行关闭 Sprint 4-A
- [x] AC-9 准备 Sprint 4-B 启动条件说明
- [x] AC-10 已 merge 至 `sprint/s4a-text-first-renderer`；sprint 已 merge 至 `release/1`（DECISION-061）；未 merge 至 `main`

---

# Sprint 4-B Backlog

> **Sprint 4-B 目标：** Preview / Copy Renderer for **structured blocks**（list / quote / highlight / info_card / cta / image_placeholder）；使用 Sprint 3-B first-wave required variants；完成 first-wave 33 variants 最小 Paste QA **计划**（Not Run）
> **Sprint 4-B 状态：** **Closed**（2026-06-01；DECISION-063；audit Grade A；P0=0）
> **Sprint 4-B 分支：** `sprint/s4b-structured-block-renderer`（从 `release/1` 切出，DECISION-062）
> **Sprint 4-B 前置遗留（须纳入 planning）：** P1-005、P1-S3B-003、P1-S3B-005、P1-S4A-002、P1-S4A-003、P2-S4A-001（见下方登记表）
> **Sprint 4-B 不做：** AI Style Selection、Generation / Streaming、VisualAssetRegistry 全量 assets、StyleOrchestrator、真实微信公众号 Paste QA 全量执行、Style Gallery、业务页面、真实 QR / 外链 / 小程序 / 图片上传托管

**Sprint 4-B 关闭摘要（DECISION-063）：**

| 项 | 状态 |
|----|------|
| S4B-STORY-001~007 | Done |
| Renderer Contract Audit | Grade A，P0=0，P1=4，P2=2 |
| lint / test / build | PASS（491 tests） |
| Sprint 4-B 关闭 | ✅ 用户已确认 |
| merge sprint → `release/1` | ✅ 用户已确认执行 |
| 真实 Paste QA | Not Run，归 Sprint 6-B |
| 下一步 | 待用户确认；不自动启动 Sprint 5 / Sprint 3-C / Sprint 6-A |

---

## Sprint 4-B 前置遗留登记（须纳入 planning）

| ID | 问题 | 纳入 Story | 说明 |
|----|------|------------|------|
| **P1-005** | list / info_card copy 结构保真规则未细化 | S4B-STORY-002 / S4B-STORY-004 | Copy HTML 结构保真 |
| **P1-S3B-003** | cta / image_placeholder 为占位契约，无真实 QR / 链接 / 小程序 / 图片能力 | S4B-STORY-005 | Release 1 占位 Renderer 边界 |
| **P1-S3B-005** | optional 字段需 renderer 明确 disabled / fallback 行为 | S4B-STORY-004 / S4B-STORY-005 | info_card / cta / image_placeholder |
| **P1-S4A-002** | `balanced` copySafety variants 仍需粘贴细节验证 | S4B-STORY-006 | 纳入 33 variants Paste QA plan |
| **P1-S4A-003** | Copy HTML snapshot seed 覆盖不足 | S4B-STORY-006 | 扩展 structured blocks representative snapshot |
| **P2-S4A-001** | Style Gallery / 人工视觉验收入口缺失 | 登记 · 后续 gallery / QA | 不要求 Sprint 4-B 实现 |

---

## S4B-STORY-001 Sprint 4-B 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 4-B 并拆分 Backlog，以便团队在明确边界下按 Story 逐步实现 structured blocks Preview / Copy Renderer。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s4b-start-backlog-split`

**明确不做：**

- 不实现 Renderer 代码
- 不实现 list / quote / highlight / info_card / cta / image_placeholder 渲染逻辑
- 不新增业务页面
- 不执行真实 Paste QA
- 不 merge 至 `release/1` 或 `main`（本轮由用户审查后 merge sprint 分支）
- 不关闭 Sprint 4-B

**验收标准：**

- [x] AC-1 工作区启动前干净
- [x] AC-2 已从 `release/1` 创建 `sprint/s4b-structured-block-renderer`
- [x] AC-3 已从 sprint 分支创建 `docs/s4b-start-backlog-split`
- [x] AC-4 `sprint-backlog.md` 已新增 Sprint 4-B Backlog（S4B-STORY-001~007）
- [x] AC-5 `sprint-plan.md` 已将 Sprint 4-B 更新为 In Progress
- [x] AC-6 `product-backlog.md` 已同步 Sprint 4-B structured renderer 状态与相关遗留
- [x] AC-7 `decisions.md` 已新增 DECISION-062
- [x] AC-8 `changelog.md` 已记录 Sprint 4-B 启动
- [x] AC-9 Sprint 4-B 前置遗留已登记至 planning
- [x] AC-10 Sprint 4-B 范围未越界（未实现 Renderer 代码）
- [x] AC-11 `corepack pnpm lint` 通过
- [x] AC-12 `corepack pnpm test` 通过
- [x] AC-13 `corepack pnpm build` 通过
- [x] AC-14 已生成 execution report
- [x] AC-15 未 merge 到 sprint / release / main
- [x] AC-16 未启动 S4B-STORY-002

---

## S4B-STORY-002 list Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 list 3 个 first-wave variants 的 Preview / Copy 成对 Renderer，以便 structured blocks 渲染从 list 起步。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4b-list-renderer`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `611a2a1`）

**目标 variants：**

- `list_plain_bullets`
- `list_numbered_steps`
- `list_checklist_cards`

**纳入遗留：** P1-005（list copy 结构保真）

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/list-layout.ts` | list variant layout / typography / item normalization / copySafety |
| `src/core/renderer/list-preview.ts` | list Preview Renderer 输出 |
| `src/core/renderer/list-renderer.ts` | list renderer validation、balanced warning、Preview/Copy 调度 |
| `src/core/renderer/list-registry.ts` | list preview/copy registry |
| `src/core/copy/list-copy.ts` | list Copy HTML renderer 与 copy-safe CSS assertion |
| `tests/fixtures/renderer/list-articles.ts` | list renderer/copy fixtures |
| `tests/core/renderer/list-renderer.test.ts` | list Preview / registry / fallback 测试 |
| `tests/core/copy/list-copy-renderer.test.ts` | list Copy HTML / escape / copy-safe 测试 |

**实现摘要：**

- 3 个 variants 均已实现 Preview / Copy 成对 Renderer。
- Preview / Copy 共享既有 `Article` + `ResolvedArticleStyle` / `ResolvedBlockStyle` 输入；未引入平行 list 模型。
- Copy HTML 使用 inline style；无 Tailwind class / `<style>` / CSS variables / absolute / transform / pseudo element。
- `list_plain_bullets` 使用稳定 bullet 文本结构；`list_numbered_steps` 使用稳定编号文本结构；`list_checklist_cards` 使用轻量卡片结构。
- `list_numbered_steps` / `list_checklist_cards` 为 balanced copySafety，输出 warning 但不阻塞渲染。
- item 为空时返回明确 `invalid_renderer_input` warning 并跳过该 item；全部缺失/不可渲染时返回 error。

**明确不做：**

- 不实现 quote / highlight / info_card / cta / image_placeholder
- 不做真实 Paste QA
- 不新增业务页面
- 不新增 Copy 按钮
- 不调用 Clipboard API
- 不 merge 至 `release/1` 或 `main`
- 不启动 S4B-STORY-003

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `feature/s4b-list-renderer`
- [x] AC-2 list 3 个 first-wave variants Preview Renderer 已实现
- [x] AC-3 list 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-4 Preview / Copy 共享既有 Article + ResolvedStyle 输入，不引入平行模型
- [x] AC-5 renderer registry 已接入 list preview / copy renderer
- [x] AC-6 Copy HTML 使用 inline style，无 Tailwind class / style tag / CSS variables
- [x] AC-7 Copy HTML 不使用 absolute / transform / pseudo element
- [x] AC-8 list item 顺序、bullet / number / checklist 语义在 Preview 与 Copy 中一致
- [x] AC-9 balanced variants 有明确 warning / issue 机制，但不阻塞代码路径
- [x] AC-10 单元测试覆盖 3 variants Preview / Copy、registry、fallback、escape、copy-safe 约束
- [x] AC-11 `corepack pnpm lint` 通过
- [x] AC-12 `corepack pnpm test` 通过
- [x] AC-13 `corepack pnpm build` 通过
- [x] AC-14 `docs/agile/sprint-backlog.md` 已同步 S4B-STORY-002 状态与产物
- [x] AC-15 `docs/agile/changelog.md` 已记录本轮变更
- [x] AC-16 未实现 quote / highlight / info_card / cta / image_placeholder
- [x] AC-17 未执行真实 Paste QA
- [x] AC-18 未新增业务页面 / Clipboard API
- [x] AC-19 未 merge 至 `release/1`
- [x] AC-20 未 merge 至 `main`
- [x] AC-21 未关闭 Sprint 4-B
- [x] AC-22 未启动 S4B-STORY-003

---

## S4B-STORY-003 quote / highlight Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 quote / highlight 各 3 个 first-wave variants 的 Preview / Copy 成对 Renderer。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4b-quote-highlight-renderer`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `4d3967e`）

**目标 variants：**

quote：

- `quote_plain`
- `quote_left_bar`
- `quote_card`

highlight：

- `highlight_inline_emphasis`
- `highlight_accent_band`
- `highlight_soft_card`

**明确不做：**

- 不升级 quote / highlight 到 InlineContent 主模型，沿用当前 Release 1 block schema
- 不实现 info_card / cta / image_placeholder
- 不做真实 Paste QA
- 不新增业务页面 / Copy 按钮 / Clipboard API
- 不 merge 至 `release/1` 或 `main`
- 不关闭 Sprint 4-B
- 不启动 S4B-STORY-004

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/quote-layout.ts` | quote variant layout / typography / content normalization / copySafety |
| `src/core/renderer/quote-preview.ts` | quote Preview Renderer 输出 |
| `src/core/renderer/quote-renderer.ts` | quote renderer validation、balanced warning、Preview/Copy 调度 |
| `src/core/renderer/quote-registry.ts` | quote preview/copy registry |
| `src/core/copy/quote-copy.ts` | quote Copy HTML renderer 与 copy-safe CSS assertion |
| `src/core/renderer/highlight-layout.ts` | highlight variant layout / typography / content normalization / copySafety |
| `src/core/renderer/highlight-preview.ts` | highlight Preview Renderer 输出 |
| `src/core/renderer/highlight-renderer.ts` | highlight renderer validation、balanced warning、Preview/Copy 调度 |
| `src/core/renderer/highlight-registry.ts` | highlight preview/copy registry |
| `src/core/copy/highlight-copy.ts` | highlight Copy HTML renderer 与 copy-safe CSS assertion |
| `tests/fixtures/renderer/quote-highlight-articles.ts` | quote/highlight renderer/copy fixtures |
| `tests/core/renderer/quote-highlight-renderer.test.ts` | quote/highlight Preview / registry / fallback 测试 |
| `tests/core/copy/quote-highlight-copy-renderer.test.ts` | quote/highlight Copy HTML / escape / copy-safe 测试 |

**实现摘要：**

- quote / highlight 各 3 个 variants 均已实现 Preview / Copy 成对 Renderer。
- Preview / Copy 共享既有 `Article` + `ResolvedArticleStyle` / `ResolvedBlockStyle` 输入；未引入平行 quote / highlight 模型。
- 未修改 Article / Block Schema 主模型，未升级 quote / highlight 到 InlineContent 主模型。
- Copy HTML 使用 inline style；无 Tailwind class / `<style>` / CSS variables / absolute / transform / pseudo element。
- `quote_left_bar` 使用真实 DOM `border-left`；`quote_card` / `highlight_soft_card` 使用轻量卡片结构；`highlight_inline_emphasis` 保持轻量强调结构。
- quote attribution / highlight label 缺失时返回 `optional_slot_disabled` info，并在输出中标记 disabled。
- balanced variants 输出 `copy_safety_warning`，不阻塞渲染。

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `feature/s4b-quote-highlight-renderer`
- [x] AC-2 quote 3 个 first-wave variants Preview Renderer 已实现
- [x] AC-3 quote 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-4 highlight 3 个 first-wave variants Preview Renderer 已实现
- [x] AC-5 highlight 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-6 Preview / Copy 共享既有 Article + ResolvedStyle 输入，不引入平行模型
- [x] AC-7 renderer registry 已接入 quote / highlight preview + copy renderer
- [x] AC-8 Copy HTML 使用 inline style，无 Tailwind class / style tag / CSS variables
- [x] AC-9 Copy HTML 不使用 absolute / transform / pseudo element
- [x] AC-10 quote / highlight 的 optional 字段有明确 disabled / fallback 行为
- [x] AC-11 balanced variants 有明确 warning / issue 机制，但不阻塞代码路径
- [x] AC-12 单元测试覆盖 6 variants Preview / Copy、registry、fallback、escape、copy-safe 约束
- [x] AC-13 `corepack pnpm lint` 通过
- [x] AC-14 `corepack pnpm test` 通过
- [x] AC-15 `corepack pnpm build` 通过
- [x] AC-16 `docs/agile/sprint-backlog.md` 已同步 S4B-STORY-003 状态与产物
- [x] AC-17 `docs/agile/changelog.md` 已记录本轮变更
- [x] AC-18 未实现 info_card / cta / image_placeholder
- [x] AC-19 未执行真实 Paste QA
- [x] AC-20 未新增业务页面 / Clipboard API
- [x] AC-21 未 merge 至 `release/1`
- [x] AC-22 未 merge 至 `main`
- [x] AC-23 未关闭 Sprint 4-B
- [x] AC-24 未启动 S4B-STORY-004

---

## S4B-STORY-004 info_card Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 info_card 3 个 first-wave variants 的 Preview / Copy 成对 Renderer，并明确 optional 字段 fallback 行为。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4b-info-card-renderer`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `02492ec`）

**目标 variants：**

- `info_card_key_takeaway`
- `info_card_steps`
- `info_card_warning_note`

**纳入遗留：** P1-005（info_card copy 结构保真）；P1-S3B-005（optional 字段 disabled / fallback）

**重点要求：**

- 明确 `content.title` / `content.body` / optional 字段的 disabled / fallback 行为
- 避免 Copy HTML 依赖复杂卡片 wrapper 继承 typography
- Copy HTML 必须使用 inline style

**明确不做：**

- 不实现 cta / image_placeholder
- 不做真实 Paste QA
- 不实现真实二维码、真实链接、小程序卡片、图片能力
- 不新增业务页面 / Copy 按钮 / Clipboard API
- 不 merge 至 `release/1` 或 `main`
- 不关闭 Sprint 4-B
- 不启动 S4B-STORY-005

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/info-card-layout.ts` | info_card variant layout / typography / content normalization / copySafety |
| `src/core/renderer/info-card-preview.ts` | info_card Preview Renderer 输出 |
| `src/core/renderer/info-card-renderer.ts` | info_card renderer validation、balanced warning、Preview/Copy 调度 |
| `src/core/renderer/info-card-registry.ts` | info_card preview/copy registry |
| `src/core/copy/info-card-copy.ts` | info_card Copy HTML renderer 与 copy-safe CSS assertion |
| `tests/fixtures/renderer/info-card-articles.ts` | info_card renderer/copy fixtures |
| `tests/core/renderer/info-card-renderer.test.ts` | info_card Preview / registry / fallback 测试 |
| `tests/core/copy/info-card-copy-renderer.test.ts` | info_card Copy HTML / escape / copy-safe 测试 |

**实现摘要：**

- 3 个 variants 均已实现 Preview / Copy 成对 Renderer。
- Preview / Copy 共享既有 `Article` + `ResolvedArticleStyle` / `ResolvedBlockStyle` 输入；未引入平行 info_card 模型。
- 未修改 Article / Block Schema 主模型。
- Copy HTML 使用 inline style；无 Tailwind class / `<style>` / CSS variables / absolute / transform / pseudo element / flex / grid。
- `info_card_steps` 沿用当前 `content.body` 字段，以换行文本生成稳定编号结构，不新增 schema。
- `content.body` 缺失/为空时返回 `invalid_renderer_input` error；`title` / `icon` 缺失时返回 `optional_slot_disabled` info。
- 3 个 variants 均为 balanced copySafety，输出 `copy_safety_warning`，不阻塞渲染。

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `feature/s4b-info-card-renderer`
- [x] AC-2 info_card 3 个 first-wave variants Preview Renderer 已实现
- [x] AC-3 info_card 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-4 Preview / Copy 共享既有 Article + ResolvedStyle 输入，不引入平行模型
- [x] AC-5 renderer registry 已接入 info_card preview + copy renderer
- [x] AC-6 Copy HTML 使用 inline style，无 Tailwind class / style tag / CSS variables
- [x] AC-7 Copy HTML 不使用 absolute / transform / pseudo element
- [x] AC-8 `content.title` / `content.body` / optional 字段有明确 disabled / fallback 行为
- [x] AC-9 balanced variants 有明确 warning / issue 机制，但不阻塞代码路径
- [x] AC-10 单元测试覆盖 3 variants Preview / Copy、registry、fallback、escape、copy-safe 约束
- [x] AC-11 `corepack pnpm lint` 通过
- [x] AC-12 `corepack pnpm test` 通过
- [x] AC-13 `corepack pnpm build` 通过
- [x] AC-14 `docs/agile/sprint-backlog.md` 已同步 S4B-STORY-004 状态与产物
- [x] AC-15 `docs/agile/changelog.md` 已记录本轮变更
- [x] AC-16 未实现 cta / image_placeholder
- [x] AC-17 未执行真实 Paste QA
- [x] AC-18 未新增业务页面 / Clipboard API
- [x] AC-19 未修改 Article / Block Schema 主模型
- [x] AC-20 未 merge 至 `release/1`
- [x] AC-21 未 merge 至 `main`
- [x] AC-22 未关闭 Sprint 4-B
- [x] AC-23 未启动 S4B-STORY-005

---

## S4B-STORY-005 cta / image_placeholder Preview + Copy Renderer

**用户故事：** 作为开发者，我需要 cta / image_placeholder 各 3 个 first-wave variants 的 Release 1 占位型 Preview / Copy 成对 Renderer。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4b-cta-image-placeholder-renderer`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `e1914ed`）

**目标 variants：**

cta：

- `cta_plain_text`
- `cta_button_like`
- `cta_qr_placeholder`

image_placeholder：

- `image_placeholder_simple`
- `image_placeholder_caption`
- `image_placeholder_card`

**纳入遗留：** P1-S3B-003（占位契约）；P1-S3B-005（optional 字段 fallback）

**明确边界：**

- cta 不实现真实二维码生成
- cta 不实现小程序卡片
- cta 不实现真实外链跳转能力
- image_placeholder 不实现图片上传、图片托管、AI 生图或图库
- 本轮只保证占位契约、Preview / Copy 结构和 copy-safe HTML

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/renderer/cta-layout.ts` | cta layout / typography / copySafety / content normalization |
| `src/core/renderer/cta-preview.ts` | cta Preview Renderer 输出契约 |
| `src/core/renderer/cta-renderer.ts` | cta renderer validation、balanced warning 与 Preview / Copy 调度 |
| `src/core/renderer/cta-registry.ts` | cta Preview / Copy registry |
| `src/core/copy/cta-copy.ts` | cta copy-safe inline HTML，占位按钮 / QR placeholder 表达 |
| `src/core/renderer/image-placeholder-layout.ts` | image_placeholder layout / typography / copySafety / placeholder normalization |
| `src/core/renderer/image-placeholder-preview.ts` | image_placeholder Preview Renderer 输出契约 |
| `src/core/renderer/image-placeholder-renderer.ts` | image_placeholder renderer validation、balanced warning 与 Preview / Copy 调度 |
| `src/core/renderer/image-placeholder-registry.ts` | image_placeholder Preview / Copy registry |
| `src/core/copy/image-placeholder-copy.ts` | image_placeholder copy-safe inline HTML，占位框表达且不输出真实 `<img>` |
| `tests/fixtures/renderer/cta-image-placeholder-articles.ts` | cta / image_placeholder variant fixtures |
| `tests/core/renderer/cta-image-placeholder-renderer.test.ts` | cta / image_placeholder Preview、registry、fallback、回归测试 |
| `tests/core/copy/cta-image-placeholder-copy-renderer.test.ts` | cta / image_placeholder Copy HTML、escape、copy-safe、strict / balanced 测试 |

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `feature/s4b-cta-image-placeholder-renderer`
- [x] AC-2 cta 3 个 first-wave variants Preview Renderer 已实现：`cta_plain_text` / `cta_button_like` / `cta_qr_placeholder`
- [x] AC-3 cta 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-4 image_placeholder 3 个 first-wave variants Preview Renderer 已实现：`image_placeholder_simple` / `image_placeholder_caption` / `image_placeholder_card`
- [x] AC-5 image_placeholder 3 个 first-wave variants Copy Renderer 已实现
- [x] AC-6 Preview / Copy 共享既有 Article + ResolvedStyle 输入，不引入平行模型
- [x] AC-7 renderer registry 已接入 cta / image_placeholder preview + copy renderer
- [x] AC-8 Copy HTML 使用 inline style，无 Tailwind class / style tag / CSS variables
- [x] AC-9 Copy HTML 不使用 absolute / transform / pseudo element
- [x] AC-10 Release 1 占位边界明确：无真实二维码、真实链接按钮、小程序卡片、图片上传、图片托管、AI 生图
- [x] AC-11 optional 字段有明确 disabled / fallback 行为
- [x] AC-12 strict / balanced variants 有明确 warning / issue 机制，但不阻塞代码路径
- [x] AC-13 单元测试覆盖 6 variants Preview / Copy、registry、fallback、escape、copy-safe 约束
- [x] AC-14 `corepack pnpm lint` 通过
- [x] AC-15 `corepack pnpm test` 通过（475 tests）
- [x] AC-16 `corepack pnpm build` 通过
- [x] AC-17 `docs/agile/sprint-backlog.md` 已同步 S4B-STORY-005 状态与产物
- [x] AC-18 `docs/agile/changelog.md` 已记录本轮变更
- [x] AC-19 未执行真实 Paste QA
- [x] AC-20 未新增业务页面 / Clipboard API
- [x] AC-21 未修改 Article / Block Schema 主模型
- [x] AC-22 未 merge 至 `release/1`
- [x] AC-23 未 merge 至 `main`
- [x] AC-24 未关闭 Sprint 4-B
- [x] AC-25 未启动 S4B-STORY-006

---

## S4B-STORY-006 Structured blocks Copy HTML snapshot / 33 variants 最小 Paste QA plan

**用户故事：** 作为产品团队，我需要扩展 structured blocks Copy HTML snapshot seed，并汇总 text-first + structured blocks 形成 first-wave 33 variants 最小 Paste QA 计划。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s4b-structured-copy-snapshot-paste-plan`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `c13f0e1`）

**纳入遗留：** P1-S4A-002、P1-S4A-003

**明确不做：**

- 不执行完整真实 Paste QA
- 不实现浏览器 Clipboard API
- 不新增业务页面 / Copy 按钮

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/copy/copy-html-snapshot.ts` | snapshot builder 支持传入 `supportedBlockTypes`，默认仍保持 S4A text-first 行为 |
| `src/core/copy/copy-safe-html.ts` | copy-safe snapshot 断言补充 flex / grid 检查 |
| `src/core/copy/structured-copy-registry.ts` | Sprint 4-B structured blocks Copy Renderer registry |
| `src/core/copy/first-wave-copy-registry.ts` | Release 1 first-wave 11 block Copy Renderer registry |
| `src/core/copy/first-wave-paste-qa-plan.ts` | first-wave 33 variants 最小 Paste QA plan 纯函数 |
| `tests/fixtures/copy/structured-copy-fixtures.ts` | structured blocks 18 variants snapshot fixture |
| `tests/core/copy/structured-copy-html-snapshot.test.ts` | structured snapshot seed、copy-safe、missing renderer/style、unsupported variant 测试 |
| `tests/core/copy/first-wave-paste-qa-plan.test.ts` | 33 variants plan 分布、字段、Not Run、copySafety、placeholder scope 测试 |
| `docs/agile/paste-qa/sprint4b-structured-seed.md` | Sprint 4-B structured snapshot seed 文档 |
| `docs/agile/paste-qa/release1-first-wave-33-plan.md` | Release 1 first-wave 33 variants 最小 Paste QA plan |

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `feature/s4b-structured-copy-snapshot-paste-plan`
- [x] AC-2 structured blocks Copy HTML snapshot seed 已建立，覆盖 list / quote / highlight / info_card / cta / image_placeholder
- [x] AC-3 structured snapshot 覆盖 18 个 variants
- [x] AC-4 snapshot HTML 来自真实 Copy Renderer，不手写脱节 HTML
- [x] AC-5 structured snapshot copy-safe assertion 覆盖并通过
- [x] AC-6 first-wave 33 variants 最小 Paste QA plan 已建立
- [x] AC-7 plan 总数 = 33，且 11 block × 3 分布正确
- [x] AC-8 每个 plan entry 有 blockType / variantId / copySafety / rendererCoverage / pasteQaStatus
- [x] AC-9 所有 pasteQaStatus 均为 Not Run / not_run，不冒充真实 QA 通过
- [x] AC-10 balanced variants 标记需要真实微信公众号 Paste QA 验证
- [x] AC-11 cta / image_placeholder 明确 Release 1 占位契约，不测试真实 QR / link / image 能力
- [x] AC-12 新增 Paste QA markdown 文档
- [x] AC-13 不调用浏览器 Clipboard API
- [x] AC-14 未新增业务页面 / Copy 按钮
- [x] AC-15 未修改 Article / Block Schema 主模型
- [x] AC-16 单元测试覆盖 structured snapshot 与 33 variants plan
- [x] AC-17 `corepack pnpm lint` 通过
- [x] AC-18 `corepack pnpm test` 通过（491 tests）
- [x] AC-19 `corepack pnpm build` 通过
- [x] AC-20 `docs/agile/sprint-backlog.md` 已同步 S4B-STORY-006 状态与产物
- [x] AC-21 `docs/agile/changelog.md` 已记录本轮变更
- [x] AC-22 未执行真实 Paste QA
- [x] AC-23 未 merge 至 `release/1`
- [x] AC-24 未 merge 至 `main`
- [x] AC-25 未关闭 Sprint 4-B
- [x] AC-26 未启动 S4B-STORY-007

---

## S4B-STORY-007 Sprint 4-B Renderer Contract Audit 与关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 4-B 完成后做 Renderer 契约 audit，确认 structured blocks Preview / Copy Renderer 与 architecture / style-system / copy-to-wechat 一致，并准备是否关闭 Sprint 4-B。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s4b-renderer-contract-audit-close-readiness`（已 merge 至 `sprint/s4b-structured-block-renderer` @ `4622a9c`）

**明确不做：**

- 不在 audit 轮实现新业务 Renderer
- 不自行关闭 Sprint 4-B（须用户确认）
- 不 merge 至 `release/1`，除非用户确认

**实际产物：**

| 路径 | 说明 |
|------|------|
| `docs/architecture/audits/sprint4b-renderer-contract-audit.md` | Sprint 4-B Renderer Contract Audit 与 Close Readiness 建议 |
| `docs/agile/sprint-backlog.md` | S4B-STORY-002~006 状态确认、S4B-STORY-007 audit 摘要 |
| `docs/agile/sprint-plan.md` | Sprint 4-B 更新为 Close Readiness |
| `docs/agile/product-backlog.md` | TECH-ARCH-021 / 022 / 023 状态同步 |
| `docs/agile/changelog.md` | 记录 Sprint 4-B renderer contract audit |

**Audit 摘要：**

- Grade：**A**
- P0：**0**
- P1：**4**
- P2：**2**
- 建议：Sprint 4-B 进入 **Close Readiness**，但不由 Cursor 关闭；关闭需用户确认。
- 真实微信公众号 Paste QA：**Not Run**，后续归 Sprint 6-B。
- 关闭状态：用户已确认关闭 Sprint 4-B（DECISION-063）。

**验收标准：**

- [x] AC-1 已从 `sprint/s4b-structured-block-renderer` 创建 `docs/s4b-renderer-contract-audit-close-readiness`
- [x] AC-2 已确认 S4B-STORY-006 merge 至 sprint
- [x] AC-3 已生成 `docs/architecture/audits/sprint4b-renderer-contract-audit.md`
- [x] AC-4 audit 覆盖 S4B-STORY-002~006 全部交付
- [x] AC-5 audit 覆盖 list / quote / highlight / info_card / cta / image_placeholder
- [x] AC-6 audit 覆盖 structured snapshot seed 与 first-wave 33 variants Paste QA plan
- [x] AC-7 audit 对照 rendering-pipeline / style-system / copy-to-wechat-pipeline / wechat-copy-style-rules
- [x] AC-8 audit 输出 P0 / P1 / P2 风险清单
- [x] AC-9 audit 明确建议进入 Sprint 4-B Close Readiness
- [x] AC-10 `docs/agile/sprint-backlog.md` 已同步 Sprint 4-B Story 状态与 audit 摘要
- [x] AC-11 `docs/agile/sprint-plan.md` 已同步 Sprint 4-B Close Readiness
- [x] AC-12 `docs/agile/product-backlog.md` 已同步 TECH-ARCH-021 / 022 / 023
- [x] AC-13 `docs/agile/changelog.md` 已记录本轮 audit
- [x] AC-14 未实现新的 Renderer 业务代码
- [x] AC-15 未执行真实微信公众号 Paste QA
- [x] AC-16 未把任何 Paste QA 标记为 Passed
- [x] AC-17 未关闭 Sprint 4-B
- [x] AC-18 未 merge 至 `release/1`
- [x] AC-19 未 merge 至 `main`
- [x] AC-20 未启动 Sprint 5 / Sprint 3-C / Sprint 6-A
- [x] AC-21 `corepack pnpm lint` 通过
- [x] AC-22 `corepack pnpm test` 通过（491 tests）
- [x] AC-23 `corepack pnpm build` 通过

---

# Sprint 3-C Backlog

> **Sprint 3-C 目标：** Style Assignment / Style Selection **validation 闭环** + StyleOrchestrator 最小规则 + VisualAssetRegistry 最小 assets + expansion variants **规划**（不实现 expansion registry / Renderer / Generation）
> **Sprint 3-C 分支：** `sprint/s3c-style-assignment-validation`（从 `release/1` 切出，DECISION-064）
> **Sprint 3-C 状态：** **Closed**（2026-06-01；DECISION-065；S3C-STORY-001~006 **Done**；audit Grade A · P0=0 · P1=5 · P2=4；Close Readiness **用户已确认**；merge `release/1`）
> **Story 拆分调整说明：** 在 `sprint-plan.md` 原定义（VisualAssetRegistry + AI Style Selection validation + Orchestrator）基础上，按 Style Assignment 契约递进拆分；S3C-STORY-003 纳入 StyleOrchestrator R1/R2/R8 与 Block→Variant fallback；S3C-STORY-004 纳入 VisualAssetRegistry 与 ComponentProtocol/BlockVisualProtocol 校验；S3C-STORY-006 纳入 expansion variants 规划文档，不要求 expansion registry 全量实现。
> **Sprint 3-C 前置条件：** Sprint 3-A / 3-B Closed；Sprint 4-A / 4-B Closed 且 merge 至 `release/1`（first-wave 33 variants registry + Preview / Copy Renderer 最小闭环已完成，为 validation 提供 registry 与 renderer 参照；**Sprint 3-C 不修改 Renderer**）
> **Sprint 3-C 不做：** Preview / Copy Renderer 新实现或大范围修改、真实 Paste QA、Generation / Streaming、AI 样式建议**生成**（生成归 Sprint 5）、Style Gallery / 业务 UI、样式市场、expansion variants 全量 registry 实现、merge 至 `main`

---

## Sprint 3-C 前置遗留纳入 planning

| ID | 问题 | 纳入 Story |
|----|------|------------|
| **P1-003** | StyleOrchestrator 文章级节奏代码未实现 | S3C-STORY-003 |
| **TECH-ARCH-010** | VisualAssetRegistry / icon asset pool | S3C-STORY-004 |
| **TECH-ARCH-011** | StyleOrchestrator / ArticleRhythmPolicy | S3C-STORY-003 |
| **TECH-ARCH-012** | AI Style Selection Guardrails | S3C-STORY-002 / S3C-STORY-005 |
| **TECH-ARCH-017** | StyleSelection Validation Pipeline | S3C-STORY-005 |
| P1-S3B-004 | 缺少 style quality gallery / 人工视觉验收入口 | 登记 · S3C-STORY-006 audit；不要求 Sprint 3-C 实现 |

---

## S3C-STORY-001 Sprint 3-C 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要正式启动 Sprint 3-C 并拆分 Backlog，以便团队在明确边界下按 Story 逐步实现 Style Assignment validation 与 Style System 分配闭环。

**技术价值：** 在 Sprint 4 Renderer 完成后补齐 Style System 分配层，为 Sprint 5 受控 AI 样式选择提供 validation pipeline 前置。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3c-start-backlog-split`

**范围：**

- 从 `release/1` 创建 sprint / docs 工作分支
- 确认 Sprint 3-C Goal、范围边界、Story 拆分、AC 与执行顺序
- 同步 sprint-backlog / sprint-plan / decisions / changelog / product-backlog
- 轻量更新 architecture 文档边界说明

**非范围：**

- 不实现 Style Assignment 业务代码（S3C-STORY-002 起）
- 不实现 Preview / Copy Renderer
- 不 merge 至 sprint / release / main（本轮由用户审查后 merge docs 分支至 sprint）
- 不关闭 Sprint 3-C
- 不启动 S3C-STORY-002

**依赖：** Sprint 3-A / 3-B Closed；Sprint 4-A / 4-B Closed 且 merge 至 `release/1`

**验收标准：**

- [x] AC-1 工作区干净；已切至 `release/1` 并确认与 origin 同步
- [x] AC-2 已从 `release/1` 创建 `sprint/s3c-style-assignment-validation`
- [x] AC-3 已从 sprint 分支创建 `docs/s3c-start-backlog-split`
- [x] AC-4 `sprint-backlog.md` 已新增 Sprint 3-C Backlog（S3C-STORY-001~006）
- [x] AC-5 `sprint-plan.md` 已将 Sprint 3-C 更新为 In Progress
- [x] AC-6 `decisions.md` 已新增 DECISION-064
- [x] AC-7 `changelog.md` 已记录 Sprint 3-C 启动
- [x] AC-8 `product-backlog.md` 已将 TECH-ARCH-010~012 / TECH-ARCH-017 纳入 Sprint 3-C planning
- [x] AC-9 每个 Story 含用户/技术价值、范围、非范围、AC、依赖、状态
- [x] AC-10 Sprint 3-A / 3-B 保持 Closed / Done，未回改
- [x] AC-11 架构文档已轻量补充 Sprint 3-C 边界（`architecture-overview.md` / `style-system.md` / `rendering-pipeline.md`）
- [x] AC-12 `corepack pnpm lint` / `corepack pnpm test` / `corepack pnpm build` 通过
- [x] AC-13 已生成 execution report
- [x] AC-14 未 merge 到 sprint / release / main
- [x] AC-15 未启动 S3C-STORY-002

---

## S3C-STORY-002 Style Assignment Contract / 样式分配输入输出契约

**用户故事：** 作为开发者，我需要 Style Assignment 输入输出契约（含 AI 样式建议结构）的 TypeScript 类型与 Zod Schema，以便 Sprint 5 Generation 与 Style validation pipeline 共享同一契约。

**技术价值：** 将 `style-system.md` §11.8 的 `StyleSelectionRequest` / `StyleAssignmentPatch` / `ArticleStylePlan` 代码化，并与现有 `Article.styleAssignment` 对齐。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3c-style-assignment-contract`

**产物：**

- `src/core/styles/style-assignment.ts` — TS 类型
- `src/core/styles/style-assignment-schemas.ts` — Zod schema + parse helpers
- `src/core/styles/style-assignment-patch.ts` — patch merge / apply helpers
- `tests/core/styles/style-assignment-contract.test.ts`（11 cases）
- `tests/core/styles/style-assignment-patch.test.ts`（6 cases）

**范围：**

- `StyleSelectionRequest`、`StyleAssignmentPatch`、`ArticleStylePlan` TS 类型 + Zod schema
- `Article.styleAssignment` 与 patch merge 规则（只写 `styleAssignment`，不 mutate blocks 内容）
- validation meta 字段（`source`、`validationStatus` 等）
- 单元测试覆盖 schema 拒绝未知字段与必填字段

**非范围：**

- 不实现 AI 样式建议生成（Sprint 5）
- 不实现完整 validation pipeline（S3C-STORY-005）
- 不实现 StyleOrchestrator（S3C-STORY-003）
- 不修改 Preview / Copy Renderer

**依赖：** S3C-STORY-001 Done；Sprint 3-A `StyleAssignment` 基础 schema

**验收标准：**

- [x] AC-1 已从 `sprint/s3c-style-assignment-validation` 创建 `feature/s3c-style-assignment-contract`
- [x] AC-2 `StyleSelectionRequest` 类型与 schema 与 `style-system.md` §11.8.1 字段一致
- [x] AC-3 `StyleAssignmentPatch` 类型与 schema 与 §11.8.2 一致
- [x] AC-4 `ArticleStylePlan` 类型与 schema 定义 preset / blockOverrides / orchestrator hints 最小结构
- [x] AC-5 patch merge helper：仅影响 `styleAssignment`；不修改 `blocks[]` 内容语义
- [x] AC-6 schema 使用 `.strict()`；拒绝 html / css / className / style 字段
- [x] AC-7 单元测试 ≥ 12 cases（17 cases；508 tests total）
- [x] AC-8 未实现 Generation / Renderer / Orchestrator
- [x] AC-9 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-10 已生成 execution report

---

## S3C-STORY-003 Block → Variant 选择规则与 fallback 策略 + StyleOrchestrator 最小规则

**用户故事：** 作为开发者，我需要 StyleOrchestrator 最小规则与明确的 Block→Variant 选择 / fallback 策略，以便文章级样式节奏可控且 Sprint 5 AI 建议可被 rhythm 规则拦截。

**技术价值：** 实现 `style-system.md` §11.7 R1 / R2 / R8；收口 P1-003 / TECH-ARCH-011；在 StyleResolver **之前**输出 `ArticleStylePlan` / blockOverrides，不 mutate Article 内容。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3c-style-orchestrator`

**产物：**

- `src/core/styles/style-orchestrator.ts` — `orchestrateArticleStyle`
- `src/core/styles/style-orchestrator-rules.ts` — R1 / R2 / R8
- `src/core/styles/style-orchestrator-selection.ts` — Block→Variant 优先级
- `tests/core/styles/style-orchestrator.test.ts`（11 cases）
- `tests/core/styles/style-orchestrator-rules.test.ts`（10 cases）

**范围：**

- StyleOrchestrator 最小实现：**R1** 相邻 heading 不得同 variant；**R2** 同一 assetId 默认最多 2 次；**R8** title 与首个 heading 避免同 family+variant
- Block→Variant 选择优先级文档化并与代码一致：block-level assignment > preset default > registry fallback
- rhythm 违规产生 `StyleValidationIssue`；提供 copy-safe fallback override
- 单元测试覆盖 R1 / R2 / R8 正例与违规 fallback

**非范围：**

- 不实现 R3~R7 全量规则（登记后续 Sprint）
- 不实现 AI 建议生成
- 不修改 Renderer
- 不实现 VisualAssetRegistry（S3C-STORY-004）

**依赖：** S3C-STORY-002；Sprint 3-A StyleResolver；Sprint 3-B first-wave registry

**验收标准：**

- [x] AC-1 已从 sprint 创建 `feature/s3c-style-orchestrator`
- [x] AC-2 `orchestrateArticleStyle` 输入 Article + StyleRegistry，输出 ArticleStylePlan / blockOverrides
- [x] AC-3 R1 / R2 / R8 已实现且有单元测试
- [x] AC-4 Orchestrator 不 mutate Article.blocks 内容
- [x] AC-5 Orchestrator 在 StyleResolver 之前调用；与 StyleValidationIssue 结构兼容
- [x] AC-6 fallback 不 silent fail；不默认选择 experimental / candidate variant
- [x] AC-7 单元测试 ≥ 16 cases（21 cases；529 tests total）
- [x] AC-8 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-9 已生成 execution report

---

## S3C-STORY-004 Theme / Preset / Density / Slot 组合边界 + VisualAssetRegistry + Protocol 校验

**用户故事：** 作为开发者，我需要 Theme / Preset / Density / Slot 与 variant 的组合边界，以及 VisualAssetRegistry 最小 assets 与 ComponentProtocol / BlockVisualProtocol 校验，以便非法组合在 Style 层被拦截。

**技术价值：** 实现 TECH-ARCH-010 / TECH-ARCH-007；VisualAssetRegistry **15~30** 系统内置 icon / shape / mark；校验 family / variant / slot / assetId 白名单。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3c-visual-asset-protocol-validation` · **已 merge 至 sprint**（`3faddb4`）

**产物：**

- `src/core/styles/visual-assets.ts` — VisualAssetDefinition / VisualAssetRegistry 类型
- `src/core/styles/visual-asset-schemas.ts` — Zod schema（strict）
- `src/core/styles/visual-asset-registry.ts` — Release 1 内置 **19** assets + parse / validate / lookup helpers
- `src/core/styles/block-visual-protocol.ts` — BlockVisualProtocol / ComponentProtocol 构建
- `src/core/styles/protocol-validation.ts` — ComponentProtocol / BlockVisualProtocol / slot / assetBindings 校验
- `src/core/styles/style-combination-validation.ts` — Theme / Preset / Density / Slot 组合边界校验
- `tests/core/styles/visual-asset-registry.test.ts`（11 cases）
- `tests/core/styles/protocol-validation.test.ts`（14 cases）
- `tests/core/styles/style-combination-validation.test.ts`（9 cases）

**范围：**

- VisualAssetRegistry 最小 **15~30** assets 注册（`copySafe` / `fallbackAssetId` 字段）
- ComponentProtocol / BlockVisualProtocol 校验 helper（对照 Sprint 3-B first-wave registry）
- Theme / Preset / Density / Slot 组合规则：非法 slot override、未知 density、未注册 assetId 须 error
- assetId 白名单与复用上限（与 R2 衔接）
- 单元测试覆盖 registry 校验与组合边界

**非范围：**

- 不实现完整 Style Selection pipeline 串联（S3C-STORY-005）
- 不实现 StyleOrchestrator（S3C-STORY-003）
- 不新增 Renderer slot 渲染逻辑
- 不实现用户上传 / 外部 CDN assets

**依赖：** S3C-STORY-002；Sprint 3-B first-wave registry；S3A WeChatCompatibility / TitleLayout

**验收标准：**

- [x] AC-1 已从 sprint 创建 `feature/s3c-visual-asset-protocol-validation`
- [x] AC-2 VisualAssetRegistry 含 ≥ 15 且 ≤ 30 个 Release 1 系统内置 assets（19 assets：icon 9 / shape 5 / mark 4 / divider 1）
- [x] AC-3 每个 asset 含 assetId / kind / copySafe / fallbackAssetId（如适用）
- [x] AC-4 ComponentProtocol / BlockVisualProtocol 校验 helper 已实现
- [x] AC-5 Theme / Preset / Density / Slot 组合违规产生明确 StyleValidationIssue
- [x] AC-6 未注册 assetId / variantId / familyId 不得 silent allow
- [x] AC-7 单元测试 ≥ 20 cases（34 新 cases；563 tests total）
- [x] AC-8 未修改 Preview / Copy Renderer
- [x] AC-9 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-10 已生成 execution report

---

## S3C-STORY-005 Style Assignment fixture 与 validation snapshot seeds

**用户故事：** 作为开发者，我需要 Style Assignment fixture 与 validation snapshot seeds，以便 Style Selection Validation Pipeline 可回归测试且 Sprint 5 可复用同一套 seeds。

**技术价值：** 实现 TECH-ARCH-017 最小 fixture 集；覆盖 valid request、invalid registry 引用、orchestrator 违规、fallback_applied 等路径。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s3c-style-selection-validation-fixtures` · **已 merge 至 sprint**（`8473235`）

**产物：**

- `src/core/styles/style-selection-validation.ts` — `validateStyleSelectionPipeline` / merge guards
- `tests/fixtures/styles/style-selection/index.ts` — 10 组 Style Assignment fixtures
- `tests/fixtures/styles/style-selection-validation-seeds.ts` — validation snapshot seeds
- `tests/core/styles/style-selection-validation-pipeline.test.ts`（29 cases）

**范围：**

- Style Selection Validation Pipeline 串联：`StyleSelectionRequest` / `StyleAssignmentPatch` → Protocol → Registry → Asset → Profile → Orchestrator → merge
- fixture：≥ 3 篇代表 Article + StyleSelectionRequest + 期望 StyleValidationResult
- snapshot seeds：validation result JSON（非 Copy HTML；Copy snapshot 归 Sprint 4 / 6）
- 禁止未校验 patch 写入 `Article.styleAssignment`

**非范围：**

- 不实现 Generation 产出 StyleSelectionRequest
- 不执行真实 Paste QA
- 不建立 PasteTestRecord（Sprint 6-A）
- 不新增 Copy HTML snapshot

**依赖：** S3C-STORY-002~004

**验收标准：**

- [x] AC-1 已从 sprint 创建 `feature/s3c-style-selection-validation-fixtures`
- [x] AC-2 validation pipeline 函数已实现并导出（`validateStyleSelectionPipeline` / `validateStyleSelection`）
- [x] AC-3 ≥ 3 组 fixture 覆盖 valid / invalid / fallback_applied（10 fixtures）
- [x] AC-4 snapshot seeds 位于 `tests/fixtures/styles/style-selection-validation-seeds.ts`
- [x] AC-5 未经校验的 patch 不得 merge 至 Article.styleAssignment（`canMergeStyleSelectionResult` / `applyValidatedStyleSelection` 测试断言）
- [x] AC-6 单元测试 ≥ 12 cases（29 pipeline cases；592 tests total）
- [x] AC-7 未实现 Generation / Renderer / Paste QA
- [x] AC-8 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-9 已生成 execution report

---

## S3C-STORY-006 Style System Contract Audit 与 Sprint 3-C 关闭准备

**用户故事：** 作为产品负责人，我需要在 Sprint 3-C 代码实现完成后做 Style System 分配层 contract audit，确认与 style-system.md §11.7~11.8 一致，并准备 Sprint 3-C 关闭条件。

**技术价值：** 确认 Style Assignment validation 闭环可支撑 Sprint 5；登记 P1/P2；输出 expansion variants 规划文档。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s3c-style-system-contract-audit-close-readiness` · **已 merge 至 sprint**（用户确认关闭 · DECISION-065）

**产物：**

- `docs/architecture/audits/sprint3c-style-system-contract-audit.md` — Grade **A** · P0=0 · P1=5 · P2=4
- `docs/architecture/style-system.md` §11.12 — expansion variants 规划引用
- sprint-backlog / sprint-plan / product-backlog / changelog 同步

**范围：**

- 生成 `docs/architecture/audits/sprint3c-style-system-contract-audit.md`
- audit 覆盖 S3C-STORY-002~005 全部交付
- expansion variants **规划文档**（11 block × 第 4/5 variant 批次建议；不要求 registry 实现）
- 同步 sprint-backlog / sprint-plan / product-backlog / changelog

**非范围：**

- 不在 audit 轮实现 expansion registry 或 Renderer
- 不自行宣布 Sprint 3-C Done（须用户确认）
- 不 merge sprint 至 `release/1`，除非用户确认
- 不启动 Sprint 5 / Sprint 6-A

**依赖：** S3C-STORY-002~005 Done

**验收标准：**

- [x] AC-1 已从 sprint 创建 `docs/s3c-style-system-contract-audit-close-readiness`
- [x] AC-2 已确认 S3C-STORY-005 merge 至 sprint（`8473235` / `d3db85b`）
- [x] AC-3 已生成 audit 文档
- [x] AC-4 audit 覆盖 Style Assignment / Orchestrator / VisualAssetRegistry / Validation Pipeline
- [x] AC-5 audit 输出 P0 / P1 / P2 风险清单（P0=0 · P1=5 · P2=4）
- [x] AC-6 expansion variants 规划已写入 audit §12 + style-system §11.12 引用
- [x] AC-7 audit 建议进入 Sprint 3-C Close Readiness（**用户已确认关闭** · DECISION-065）
- [x] AC-8 `sprint-backlog.md` 已同步 Story 状态
- [x] AC-9 未实现新业务 Renderer / Generation 功能
- [x] AC-10 Sprint 3-C 已关闭（用户确认 · DECISION-065）
- [x] AC-11 sprint 已 merge 至 `release/1`（DECISION-065）；未 merge `main`
- [x] AC-12 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-13 已生成 execution report

---

## Sprint 3-C 建议执行顺序

```text
S3C-STORY-001（启动）
  → S3C-STORY-002（Style Assignment Contract）
  → S3C-STORY-003（Orchestrator + Block→Variant fallback）  ╮
  → S3C-STORY-004（VisualAssetRegistry + Protocol 校验）     ├─ 003 / 004 可并行，但 005 依赖二者
  → S3C-STORY-005（Validation Pipeline + fixtures）
  → S3C-STORY-006（audit + close readiness）
```

---

# Sprint 5 Backlog

> **Sprint 5 目标：** Generation / Streaming + **Release 1 真实 UI 主流程闭环**（输入 → 生成 → 预览 → 复制）
> **Sprint 5 状态：** **Closed**（2026-06-02；DECISION-069；S5-STORY-001~008 **Done**；Close Readiness **用户已确认**；merge `release/1`）
> **Sprint 5 分支：** `sprint/s5-generation-ui-main-flow`（从 `release/1` 切出，DECISION-067；已 merge 至 `release/1`）
> **Release 1 主干：** `release/1`
> **UI 主流程入口：** **`/generate`**（S5-STORY-007 Done @ `01318c4`）
> **Close Readiness Audit：** [`docs/architecture/audits/sprint5-main-flow-close-readiness-audit.md`](../architecture/audits/sprint5-main-flow-close-readiness-audit.md)
> **下一步：** **S7-STORY-007** 手动视觉 QA 与 close readiness；**不 merge `main`**
> **Sprint 5 不做：** 真实微信公众号 Paste QA 全量回归、不宣称复制到公众号最终保真通过、Style Gallery、真实 QR / 小程序 / 图片上传托管 / AI 生图、复杂编辑器 / block 级编辑、样式市场、merge 至 `main`
> **保留原则：** 真实 Paste QA 归 **Sprint 8**；Style Gallery / 样式丰富度归 **Sprint 7**；Sprint 5 技术 smoke **不替代** Release 1 用户可见验收与 Paste QA

## Sprint 5 建议执行顺序

```text
S5-STORY-001 Sprint 5 启动与 Backlog 拆分 — Done
S5-STORY-002 InputRequest / NormalizedInput 代码契约 — Done
S5-STORY-003 GenerationEvent / SSE Streaming Runtime — Done
S5-STORY-004 done.article 归一与 Article Schema 校验 — Done
S5-STORY-005 真实模型 Provider 对接（Volcengine / Doubao）— Done
S5-STORY-005A Volcengine / Doubao Provider Dev-only Real API Smoke — Done
S5-STORY-005B Model Article Candidate Enrichment + Real API Smoke Re-run — Done
S5-STORY-006 受控 AI 样式选择生成与 validation pipeline 接入 — Done
S5-STORY-007 Release 1 主流程真实 UI 页面集成（/generate）— Done
S5-STORY-008 Sprint 5 主链路 Smoke / E2E 与关闭准备 — Done
```

---

## S5-STORY-001 Sprint 5 启动与 Backlog 拆分

**用户故事：** 作为产品负责人，我需要在正式启动 Sprint 5 时建立 sprint 分支并细化 Backlog，以便团队在明确边界下按 Story 逐步实现 Generation / Streaming 与真实 UI 主流程集成。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s5-start-backlog-split`

**目标：** 正式启动 Sprint 5 时建立 sprint 分支与细化 Backlog。

**验收标准：**

- [x] AC-1~AC-13 — Sprint 5 启动与 Backlog 拆分完成（DECISION-067；见 `docs/s5-start-backlog-split` merge）

---

## S5-STORY-002 InputRequest / NormalizedInput 代码契约

**用户故事：** 作为开发者，我需要主题、资料、草稿三类输入的标准化入口契约，以便 Generation 与 UI 共享同一输入模型。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-input-request-contract`

**目标：** 实现主题、资料、草稿三类输入的标准化入口。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/input.ts` | InputRequest / NormalizedInput 类型与 limits |
| `src/core/generation/schemas.ts` | Zod schema（`.strict()`） |
| `src/core/generation/input.parse.ts` | parse / validate / isInputRequest |
| `src/core/generation/input.normalize.ts` | normalize / parseAndNormalize |
| `src/core/generation/index.ts` | 模块导出 |
| `tests/fixtures/generation/` | input request fixtures |
| `tests/core/generation/input-request.test.ts` | 契约单元测试 |

**明确不做：**

- 不实现 GenerationEvent / SSE（S5-STORY-003）
- 不实现 done.article 归一（S5-STORY-004）
- 不实现 AI Style Selection 生成（S5-STORY-006）
- 不实现真实模型 Provider（S5-STORY-005）
- 不实现 `/generate` UI 页面（S5-STORY-007）
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 InputRequest / NormalizedInput TypeScript 类型与 Zod Schema 与 `generation-pipeline.md` 一致（Release 1 三类输入 + mode）
- [x] AC-2 三类输入（主题 / 资料 / 草稿）均可 normalize 为统一结构
- [x] AC-3 单元测试覆盖合法 / 非法输入（topic_only / topic_with_materials / draft_rewrite / empty / mode mismatch / trim / order / styleIntent / length）
- [x] AC-4 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-5 提供 parse / validate / normalize helper；`validateInputRequest` 不 throw
- [x] AC-6 未引入 parallel Article 模型；未修改 Article / Block Schema 主契约
- [x] AC-7 已生成 execution report
- [x] AC-8 未 merge 至 sprint / release / main
- [x] AC-9 未启动 S5-STORY-003

---

## S5-STORY-003 GenerationEvent / SSE Streaming Runtime

**用户故事：** 作为开发者，我需要 block.start / block.delta / block.complete / done.article 流式事件链路，以便生成过程可流式展示且终态归一 Article。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-generation-event-sse-runtime`

**目标：** 实现 GenerationEvent 契约、SSE encode/decode、stream runtime 与 deterministic test provider。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/events.ts` | GenerationEvent 类型与 stream 抽象 |
| `src/core/generation/event-schemas.ts` | Zod schema + `parseGenerationEvent` |
| `src/core/generation/sse.ts` | SSE encode / decode helpers |
| `src/core/generation/stream.ts` | `createGenerationStream` / `collectGenerationStream` / `validateGenerationEventSequence` |
| `src/core/generation/test-provider.ts` | deterministic provider（NormalizedInput → 固定事件序列） |
| `tests/fixtures/generation/generation-events.ts` | 事件 fixtures |
| `tests/core/generation/generation-event.test.ts` | 事件 schema 测试 |
| `tests/core/generation/generation-sse.test.ts` | SSE 编解码测试 |
| `tests/core/generation/generation-stream.test.ts` | runtime / sequence 校验测试 |

**明确不做：**

- 不实现 `done.article` → Article Schema parse / normalize / validate（S5-STORY-004）
- 不实现真实模型 Provider（S5-STORY-005；仅提供 deterministic test provider）
- 不实现 AI Style Selection 生成（S5-STORY-006）
- 不实现 `/generate` UI 页面（S5-STORY-007）
- 不调用真实模型 API / web search
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 GenerationEvent 类型与 Zod schema 对齐 DECISION-024（block.start / block.delta / block.complete / done.article / error / heartbeat）
- [x] AC-2 SSE encode / decode helper（单事件 / 多事件 / 非法 data 明确失败）
- [x] AC-3 stream runtime：`GenerationStreamProvider` / `createGenerationStream` / `collectGenerationStream` / `validateGenerationEventSequence`
- [x] AC-4 deterministic test provider 基于 `NormalizedInput` 输出稳定事件序列
- [x] AC-5 序列校验：单调 sequence、block.start 前禁止 delta、error / done 后禁止继续、done.article 必须为最后非 heartbeat 事件
- [x] AC-6 禁止废弃事件名与 forbidden html/css/className/style 字段
- [x] AC-7 `done.article` 仅透传 Article candidate；不归一 Article Schema
- [x] AC-8 单元测试覆盖事件 / SSE / runtime（20 cases 新增）
- [x] AC-9 `corepack pnpm lint` / `test` / `build` 通过
- [x] AC-10 已生成 execution report
- [x] AC-11 未 merge 至 sprint / release / main
- [x] AC-12 未启动 S5-STORY-004

---

## S5-STORY-004 done.article 归一与 Article Schema 校验

**用户故事：** 作为开发者，我需要生成终态进入唯一 Article Schema 并可被 Preview / Copy 复用，以便全链路共享同一文章主模型。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-done-article-normalize`

**目标：** 确保生成终态进入唯一 Article Schema，并可被 Preview / Copy 复用。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/done-article.ts` | `validateDoneArticleEventSequence` / `extractDoneArticleEvent` |
| `src/core/generation/article-finalize.ts` | `finalizeGenerationEvents` / `assertFinalizedArticle` |
| `tests/core/generation/done-article.test.ts` | 事件序列校验测试 |
| `tests/core/generation/article-finalize.test.ts` | Article 归一与 schema 拒绝测试 |

**明确不做：**

- 不实现真实模型 Provider（S5-STORY-005）
- 不实现 AI Style Selection 生成（S5-STORY-006）
- 不实现 `/generate` UI 页面（S5-STORY-007）
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 `done.article` 经 `parseArticle` / `normalizeArticle` / `validateArticle` 进入唯一 Article Schema
- [x] AC-2 禁止 `streamArticle` / `mockArticle` / parallel article model 作为主链路
- [x] AC-3 生成终态 Article 可被 Sprint 4-A / 4-B Preview / Copy Renderer 直接消费（正式 `Article` 类型）
- [x] AC-4 单元测试覆盖终态归一、事件序列拒绝与 schema 拒绝
- [x] AC-5 `corepack pnpm lint` / `test` / `build` 通过

---

## S5-STORY-005 真实模型 Provider 对接（Volcengine / Doubao）

**用户故事：** 作为产品负责人，我需要 Sprint 5 对接真实模型 API，使 Release 1 主流程不是只依赖 deterministic provider，而是可以通过真实模型生成结构化 Article candidate。

**优先级：** P0 · **状态：** Done（Provider code + real API smoke passed；见 S5-STORY-005A / 005B） · **工作分支：** `feature/s5-volcengine-model-provider`（**已 merge 至 sprint** @ `7421089`）

**目标：** 实现 Volcengine / Doubao 真实模型 Provider；输出进入 GenerationEvent stream runtime 与 `done.article` 归一链路。

**旧项目经验：** 当前仓库不可访问旧一键成稿 Volcengine 源码；仅参考 `migration-reference.md` SSE + `done.article` 经验，以及 `prototype-style-system-technical-lessons.md` 中 `mapArkJsonToArticle` 命名线索；按轻篇 Article Schema 实现 provider，未复制旧 parallel 模型。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/model-provider.ts` | Provider / transport 契约 |
| `src/core/generation/model-provider-config.ts` | `VOLCENGINE_*` env config loader |
| `src/core/generation/model-provider-errors.ts` | 稳定 error code 与 HTTP / network 映射 |
| `src/core/generation/model-prompt.ts` | Article JSON prompt builder |
| `src/core/generation/volcengine-transport.ts` | Ark chat completions transport |
| `src/core/generation/volcengine-provider.ts` | Volcengine provider → GenerationEvent stream |
| `.env.example` | Volcengine 环境变量说明 |
| `tests/core/generation/model-provider*.test.ts` | config / provider / volcengine 测试 |

**明确不做：**

- 不在本 Story 实现 `/generate` UI 页面（S5-STORY-007）
- 不执行真实微信公众号 Paste QA（Sprint 6-B）
- 不实现文件上传 / URL 抓取 / 知识库 / web search
- 不实现图片生成
- 不硬编码任何密钥
- 不把真实 API 调用写入普通单元测试强依赖
- 不 merge 至 `release/1` 或 `main`

**验收标准：**

- [x] AC-1 定义 `GenerationModelProvider` / `GenerationModelProviderConfig` / `GenerationModelProviderResult` 等最小 provider 契约
- [x] AC-2 实现 Volcengine / Doubao provider（Ark chat completions + Article JSON prompt）
- [x] AC-3 API key / endpoint / model name 通过环境变量配置，不得硬编码密钥
- [x] AC-4 提供 `.env.example`，说明 `VOLCENGINE_*` 变量
- [x] AC-5 provider 输入使用 S5-STORY-002 的 `NormalizedInput`
- [x] AC-6 provider 输出进入 S5-STORY-003 的 GenerationEvent stream runtime
- [x] AC-7 provider 最终产出 `done.article` candidate，供 S5-STORY-004 finalization 消费
- [x] AC-8 真实 provider 与 deterministic provider 共用 `GenerationStreamProvider`；deterministic 仅 dev fallback / test
- [x] AC-9 不允许 provider 绕过 Article Schema / Style System / Renderer / Copy pipeline
- [x] AC-10 不允许模型输出 HTML / CSS / className / inline style 作为主链路字段
- [x] AC-11 网络 / 鉴权 / 格式错误转换为稳定 `error` GenerationEvent
- [x] AC-12 单元测试覆盖 config、错误映射、mock transport、deterministic fallback（29 cases 新增）
- [x] AC-13 无真实 API key 时 test / build 不失败
- [x] AC-14 `corepack pnpm lint` / `test` / `build` 通过

---

## S5-STORY-005A Volcengine / Doubao Provider Dev-only Real API Smoke

**用户故事：** 作为开发者，我需要在进入 S5-STORY-006 前通过 dev-only smoke 手动验证真实 Volcengine / Doubao API 是否可用。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-volcengine-real-api-smoke`（**已 merge 至 sprint** @ `d77d3d0`）

**目标：** 提供 dev-only 真实 API smoke 脚本，验证 provider → `done.article` → `finalizeGenerationEvents` 全链路。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `scripts/smoke/volcengine-provider-smoke.ts` | dev-only CLI 入口 |
| `src/core/generation/volcengine-provider-smoke.ts` | smoke runner + 结果摘要 |
| `src/core/generation/smoke-env.ts` | `.env.local` / `.env` loader |
| `docs/agile/smoke/s5-volcengine-provider-smoke.md` | 运行说明 |
| `package.json` | `smoke:volcengine-provider` |

**明确不做：**

- 不实现 `/generate` UI（S5-STORY-007）
- 不实现 AI Style Selection（S5-STORY-006）
- 不把真实 API smoke 接入 `pnpm test` / CI
- 不泄露 API key

**验收标准：**

- [x] AC-1 提供 `corepack pnpm smoke:volcengine-provider` dev-only 脚本
- [x] AC-2 读取 `VOLCENGINE_*` env（支持 `.env.local`）
- [x] AC-3 使用真实 transport 调用 Volcengine / Doubao API
- [x] AC-4 收集 `GenerationEvent[]` 并 `finalizeGenerationEvents`
- [x] AC-5 成功时输出最小摘要（provider / model / eventCount / article title 等）
- [x] AC-6 失败时输出稳定 error code / failureCategory；不泄露 key
- [x] AC-7 无 API key 时 `pnpm test` / `build` 仍 PASS；smoke 缺 key 时明确失败并提示配置
- [x] AC-8 单元测试覆盖 smoke helper 纯函数（不依赖真实网络）
- [x] AC-9 至少一次真实 API smoke 手动运行并通过 — **2026-06-02 PASSED**（`finalizeGenerationEvents` passed；`enrichmentWarningCount: 0`）

---

## S5-STORY-005B Model Article Candidate Enrichment + Real API Smoke Re-run

**用户故事：** 作为开发者，我需要在真实模型 JSON 进入 `done.article` 前通过 deterministic enrichment / repair 补齐机器字段，并重新跑通真实 API smoke 全链路。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-model-article-candidate-enrichment`（**已 merge 至 sprint** @ `532f685`）

**目标：** 新增 Model Article Candidate Enrichment 层；Volcengine provider 接入 enrichment；重跑 dev-only real API smoke 验证 Provider → GenerationEvent → `done.article` → `finalizeGenerationEvents` → Article。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/model-article-candidate.ts` | enrichment 输入 / 输出类型 |
| `src/core/generation/model-article-enrichment.ts` | `enrichModelArticleCandidate` / UUID / metadata / block content repair |
| `src/core/generation/volcengine-provider.ts` | provider 接入 enrichment；`done.article` meta 含 `enrichmentWarningCount` |
| `src/core/generation/model-prompt.ts` | prompt 强化（JSON / UUID / 禁止 HTML） |
| `src/core/generation/volcengine-provider-smoke.ts` | smoke summary 增加 `finalizationStatus` / `enrichmentWarningCount` |
| `tests/core/generation/model-article-enrichment.test.ts` | enrichment 单测（18 cases） |

**明确不做：**

- 不创建 parallel Article 模型
- 不绕过 `finalizeGenerationEvents` / Article Schema
- 不实现 S5-STORY-006 AI Style Selection / `/generate` UI

**验收标准：**

- [x] AC-1 实现 `enrichModelArticleCandidate`（UUID / version / metadata / input / styleAssignment / block content）
- [x] AC-2 非法 block type / 非 object raw output 返回 unrecoverable error → provider `error` event
- [x] AC-3 forbidden html/css/className/style 安全剥离并记录 warning
- [x] AC-4 Volcengine provider 使用 enriched candidate 输出 `done.article`
- [x] AC-5 mock transport 缺 UUID JSON 可通过 `finalizeGenerationEvents`
- [x] AC-6 真实 API smoke **PASSED**（2026-06-02；eventCount 7；finalizationStatus passed）
- [x] AC-7 `corepack pnpm lint` / `test` / `build` 通过（709 tests）
- [x] AC-8 无真实 API key 时 test / build 不失败

---

## S5-STORY-006 受控 AI 样式选择生成与 validation pipeline 接入

**用户故事：** 作为开发者，我需要在 Generation 链路中生成 StyleSelectionRequest / StyleAssignmentPatch，并通过 Sprint 3-C validation pipeline 后写入 Article.styleAssignment。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-ai-style-selection`（**已 merge 至 sprint** @ sprint tip）

**目标：** 生成 StyleSelectionRequest / StyleAssignmentPatch，并通过 Sprint 3-C validation pipeline 后写入 `Article.styleAssignment`；不实现 `/generate` UI。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/core/generation/style-selection.ts` | 样式选择主入口 |
| `src/core/generation/style-selection-prompt.ts` | styleIntent heuristics / forbidden 字段检查 |
| `src/core/generation/style-selection-apply.ts` | validation pipeline + StyleResolver 接入 |
| `tests/core/generation/style-selection.test.ts` | 14 cases |
| `tests/fixtures/generation/style-selection.ts` | fixtures |

**明确不做：**

- 不实现 `/generate` UI（S5-STORY-007）
- 不修改 Article / Block Schema 主契约
- 不让模型直接输出 HTML / CSS / 未注册 variant

**验收标准：**

- [x] AC-1 Generation 产出 StyleSelectionRequest / StyleAssignmentPatch
- [x] AC-2 所有样式建议经 `validateStyleSelectionPipeline`；不 bypass Style System
- [x] AC-3 校验通过后 patch 写入 `Article.styleAssignment`；不 mutate block.content
- [x] AC-4 校验失败有明确 issue / safe preset fallback
- [x] AC-5 单元测试覆盖 valid / invalid / fallback（14 cases）
- [x] AC-6 `corepack pnpm lint` / `test` / `build` 通过（723 tests）

---

## S5-STORY-007 Release 1 主流程真实 UI 页面集成

**用户故事：** 作为用户，我需要在真实业务页面中完成输入 → 生成 → 预览 → 复制，以便 Release 1 主链路可手动验收。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s5-generate-ui-main-flow`（**已 merge 至 sprint** @ `01318c4`）

**关闭说明（用户确认 2026-06-02）：**

- `/generate` 主流程可人工跑通（输入 → 生成 → 预览 → 复制）
- 修复：Copy `supportedBlockTypes`（cta 等 structured block）、Preview visual layer、style selection diversity、Volcengine JSON parser
- **不宣称：** Paste QA 已通过、公众号粘贴最终一致、样式质量最终达标、真实 provider 全场景稳定
- **后续继续：** 更多 automated test、provider 稳定性、样式质量、Paste QA（Sprint 6-B）

**目标：** 新增真实业务页面 `/generate`，跑通输入 → 生成 → 预览 → 复制；不执行微信公众号 Paste QA。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/app/generate/page.tsx` | `/generate` 页面入口 |
| `src/app/generate/generate-page-client.tsx` | 输入 / 状态 / 预览 / 复制 UI |
| `src/app/api/generate/route.ts` | Server API（provider 在服务端） |
| `src/server/generation/run-generate-main-flow.ts` | 统一主链路 orchestration |
| `src/core/renderer/first-wave-preview-registry.ts` | Release 1 preview registry |
| `tests/server/generation/run-generate-main-flow.test.ts` | server flow 单测 |
| `tests/e2e/generate-page.spec.ts` | Playwright `/generate` smoke |

**明确不做：**

- 不执行真实微信公众号 Paste QA（Sprint 6-B）
- 不实现 Style Gallery / 复杂编辑器
- 不宣称 Sprint 5 已关闭

**验收标准：**

- [x] AC-1 `/generate` 为真实业务页面，非 Storybook / gallery
- [x] AC-2 支持 topic / materials / draft / styleIntent 输入
- [x] AC-3 点击生成走统一 API → InputRequest → provider → finalization → style → preview → copy
- [x] AC-4 页面展示 idle / normalizing / generating / finalizing / styling / rendering / ready / error
- [x] AC-5 预览区使用 Preview Renderer 输出（非手写 block UI）
- [x] AC-6 复制使用 Copy Renderer + Clipboard payload
- [x] AC-7 payload 含 `text/html` + `text/plain`
- [x] AC-8 不从 DOM 抓取 HTML
- [x] AC-9 不 bypass Article / StyleResolver / Renderer / Copy pipeline
- [x] AC-10 优先 Volcengine provider；无配置时 deterministic fallback 且 UI 明示
- [x] AC-11 `corepack pnpm lint` / `test` / `build` 通过

---

## S5-STORY-008 Sprint 5 主链路 Smoke / E2E 与关闭准备

**用户故事：** 作为产品负责人，我需要为真实 UI 主流程建立最小 smoke / e2e 验证，并做 Sprint 5 close readiness，以便确认 Release 1 主流程已在真实页面跑通。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s5-main-flow-e2e-close-readiness`

**目标：** 为真实 UI 主流程建立最小 smoke / e2e 验证，并做 Sprint 5 close readiness。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `docs/architecture/audits/sprint5-main-flow-close-readiness-audit.md` | Sprint 5 close readiness audit（P0=0） |
| `tests/e2e/generate-page.spec.ts` | Playwright `/generate` smoke（3 cases） |
| `playwright.config.ts` | e2e webServer 默认 `VOLCENGINE_ENABLE_REAL_PROVIDER=false` |

**验收标准：**

- [x] AC-1 Playwright smoke 可打开 `/generate` 真实页面
- [x] AC-2 可填写输入
- [x] AC-3 可触发生成
- [x] AC-4 可等待预览出现
- [x] AC-5 可触发复制或验证 Clipboard payload
- [x] AC-6 lint / test / build PASS（743 tests）
- [x] AC-7 audit 明确主链路已达 Close Readiness（真实 provider 已接入；e2e 以 deterministic 为基线）
- [x] AC-8 audit 明确 Paste QA 未执行，归 Sprint 6-B
- [x] AC-9 execution report 已生成
- [x] AC-10 未自行关闭 Sprint 5（关闭由用户确认 · DECISION-069）

---

## Sprint 5 Close Readiness

> **Sprint 5 状态：** **Closed**（2026-06-02；DECISION-069；S5-STORY-001~008 全部 Done；audit Grade A- · P0=0 · P1=4 · P2=3；`sprint/s5-generation-ui-main-flow` 已 merge 至 `release/1`）

**Audit 摘要：**

| 项 | 结论 |
|----|------|
| Audit 文档 | [`sprint5-main-flow-close-readiness-audit.md`](../architecture/audits/sprint5-main-flow-close-readiness-audit.md) |
| Grade | A- |
| P0 | 0 |
| P1 | 4（登记 Sprint 7 / Sprint 8 / 后续） |
| P2 | 3 |
| Paste QA | **Not Run**（归 **Sprint 8**） |
| Release 1 完成 | **否**（Paste QA 未执行；不宣称 Release 1 完成） |

**关闭决策（DECISION-069）：**

- 用户确认 Sprint 5 关闭
- `sprint/s5-generation-ui-main-flow` merge 至 `release/1`
- P1/P2 登记后续 Sprint，不阻塞关闭
- **不 merge 至 `main`**
- **不自动启动 Sprint 6 / 7 / 8**（Release 1 尾声方案 B · DECISION-070）

---

# Sprint 6 Backlog · Release 1 Visible AI Main Flow

> **Sprint 6 名称：** Release 1 Visible AI Main Flow
> **Sprint 6 Sprint Goal：** 让用户真实完成一次公众号文章生成与使用闭环：打开首页 → 输入需求 → 真实 AI 生成文章 → 进入预览页 → 查看带样式公众号文章 → 切换基础风格 / 配色 → 复制到公众号编辑器 → 可实际粘贴使用。
> **Sprint 6 定位：** 不是 mock demo，不是纯技术验证；须完成用户侧最小可用闭环（真实页面、真实 AI、结构化 Article、带样式预览、生成反馈、风格 / 配色切换、可复制、最小粘贴 QA）。
> **Sprint 6 状态：** **Closed**（2026-06-02 · DECISION-078 · merge `release/1`）
> **Close Readiness Audit：** [`docs/architecture/audits/sprint6-visible-ai-main-flow-close-readiness-audit.md`](../architecture/audits/sprint6-visible-ai-main-flow-close-readiness-audit.md)（Grade **A-** · P0=0）
> **Sprint 6 分支：** `sprint/s6-visible-ai-main-flow`（从 `release/1` 切出）
> **Release 1 主干：** `release/1`
> **关联 Decision：** DECISION-070、DECISION-071
> **Product Backlog：** PB-R1-01 ~ PB-R1-08（见 [`product-backlog.md`](product-backlog.md)）
> **User Story Map：** 8 步用户闭环路径（见 [`user-story-map.md`](../product/user-story-map.md)）
> **前置：** Sprint 5 Generation / Volcengine provider / `/generate` 技术框架已 merge `release/1`（Sprint 6 重构或增强用户可见体验，验收以手测闭环为准）
> **Sprint 6 不做：** 完整富文本编辑器、块级拖拽、图片生成 / 上传、样式市场、用户登录、历史文章、多文章项目管理、复杂模板商城、完整 block-aware token streaming、Style Gallery 大改（Sprint 7）、全量 Paste QA 归档（Sprint 8）、关闭 Release 1、merge `main`

## Sprint 6 Definition of Done

### 技术 DoD

- `corepack pnpm lint` 通过
- `corepack pnpm test` 通过
- `corepack pnpm build` 通过
- AI 输出经 Article / Block Schema 校验
- Preview Renderer / Copy Renderer **复用** Sprint 4-A / 4-B 现有体系
- **不允许**临时另写不可维护 HTML 渲染主链路

### 产品 DoD（Sprint 6 关闭前用户须能完成）

1. 打开首页
2. 输入一个公众号文章主题（及场景、读者、风格等基础字段）
3. 点击生成
4. 看到生成中状态
5. 看到**真实 AI**生成的文章
6. 进入或停留在预览页
7. 看到完整带样式文章
8. 切换风格
9. 切换配色
10. 点击复制到公众号
11. 粘贴到公众号编辑器或 135 编辑器
12. 核心样式基本可用

### 内容质量 DoD

- 不是几百字短文
- 至少 **1200–1500 字**
- 至少 **4–5 个分节**
- 有导语、重点内容、列表、总结、CTA
- 整体像一篇公众号文章，而不是普通问答文本

### 样式质量 DoD

- 标题、分节标题有明确样式
- 重点内容有突出样式；列表可读性好
- 总结与 CTA 有差异化样式；不全部卡片化
- 风格和配色切换后有**真实视觉差异**

## Sprint 6 建议执行顺序

```text
S6-STORY-001 Sprint 6 Planning 与 Backlog / Story Map 对齐 — Done
S6-STORY-002 首页输入与生成入口 — Done
S6-STORY-003 真实 AI 生成结构化 Article — Done
S6-STORY-004 预览页与带样式文章渲染 — Done
S6-STORY-005 基础生成反馈与轻量打字机体验 — Done
S6-STORY-006A 首页 / 预览 UI Shell 对齐 miaopian-demo — Done
S6-STORY-006 风格 / 配色基础切换与复制到公众号 — Done
```

---

## S6-STORY-001 Sprint 6 Planning 与 Backlog / Story Map 对齐

**用户故事：** 作为产品负责人，我需要在启动 Sprint 6 时完成规划对齐，以便团队在真实 AI 用户闭环边界下按 Story 推进。

**优先级：** P0 · **状态：** Done · **工作分支：** `sprint/s6-visible-ai-main-flow`（本轮在 sprint 分支直接完成）

**对应 Product Backlog：** PB-R1-01 ~ PB-R1-08

**对应 Story Map：** 完整用户侧最小闭环路径（8 步）

**目标：** 完成 Sprint 6 启动规划；对齐 Sprint Goal、PB-R1、Story Map、Sprint Backlog 与 DoD。

**验收标准：**

- [x] AC-1 已从 `release/1` 创建 `sprint/s6-visible-ai-main-flow`
- [x] AC-2 product-backlog / sprint-backlog / sprint-plan / release-plan / user-story-map 已同步 Sprint 6 范围
- [x] AC-3 S6-STORY-002~006 已登记 To Do；S6-STORY-001 Done
- [x] AC-4 明确 Sprint 6 为真实 AI 用户侧最小闭环，非 mock demo / 非纯技术验证
- [x] AC-5 未启动 S6-STORY-002 及后续功能 Story
- [x] AC-6 未关闭 Sprint 6 / Release 1；未 merge `main` / `release/1`

---

## S6-STORY-002 首页输入与生成入口

**用户故事：** 作为用户，我可以在首页输入公众号文章需求并点击开始生成。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-home-ai-preview-flow`（**已 merge 至 sprint**）

**对应 Product Backlog：** PB-R1-01

**对应 Story Map：** 进入工具 / 输入需求 / 触发生成

**目标：** 用户可以在首页输入主题、文章用途 / 场景、目标读者、基础风格等信息，并点击按钮开始生成。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `/` | 首页：`HomePageClient` |
| `src/lib/home-input.ts` | 表单 → `InputRequest` / URL 参数 |
| `src/app/home-page-client.tsx` | 主题 / 场景 / 读者 / 基础风格 + 开始生成 |

**验收标准：**

- [x] AC-1 首页 `/` 可手动打开
- [x] AC-2 主题（必填）、场景、读者、基础风格字段
- [x] AC-3 「开始生成」跳转 `/preview` 并携带参数
- [x] AC-4 输入经 `buildHomeInputRequest` → `InputRequest`
- [x] AC-5 空主题前端校验，不提交

---

## S6-STORY-003 真实 AI 生成结构化 Article

**用户故事：** 作为用户，我点击生成后系统调用真实 AI，产出符合 Article / Block Schema 的结构化公众号文章。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-home-ai-preview-flow`（**已 merge 至 sprint**）

**对应 Product Backlog：** PB-R1-02

**对应 Story Map：** 触发生成 / 等待生成 / 生成结果

**目标：** 系统根据用户输入调用真实 AI（复用 Sprint 5 Volcengine provider），生成符合 Article / Block Schema 的结构化文章。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `POST /api/generate` | `requireRealProvider: true` 拒绝静默 deterministic fallback |
| `run-generate-main-flow.ts` | `requireRealProvider` 选项 |
| `model-prompt.ts` | 公众号长文结构与 block 约束 prompt |

**验收标准：**

- [x] AC-1 预览页请求 `requireRealProvider: true`
- [x] AC-2 `runGenerateMainFlow` → Volcengine → `finalizeGenerationEvents` → Article Schema
- [x] AC-3 无 parallel article model / DOM 抓取
- [x] AC-4 无 API key 时明确 `provider_config` 错误（非 mock 静默）
- [x] AC-5 prompt 约束 1200–1500 字、分节与必需 block（质量依赖模型，待手测）

**本轮未做：** 复杂 repair / 多轮重试（S6 后续可增强）

---

## S6-STORY-004 预览页与带样式文章渲染

**用户故事：** 作为用户，我可以在预览页看到完整、带样式、接近公众号文章的结果。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-home-ai-preview-flow`（**已 merge 至 sprint**）

**对应 Product Backlog：** PB-R1-03、PB-R1-04

**对应 Story Map：** 查看结果 / 评审文章

**目标：** 预览页展示完整 Article；应用 Release 1 样式系统，非纯文本。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `/preview` | 预览页：加载 / 成功 / 失败；`ArticlePreviewPanel` |
| `src/app/preview/preview-page-client.tsx` | 承接生成 + Preview Renderer 输出 |

**验收标准：**

- [x] AC-1 完整 Article 预览（`article-preview-panel`）
- [x] AC-2 复用 Sprint 4 Preview Renderer + StyleResolver（经 `runGenerateMainFlow`）
- [x] AC-3 模型输出 block 由 first-wave renderer 渲染
- [x] AC-4 与 server 侧同一 `article` 数据源
- [x] AC-5 基础 loading / 错误态；无风格切换 UI、无复制专项（归 S6-STORY-006）

---

## S6-STORY-005 基础生成反馈与轻量打字机体验

**用户故事：** 作为用户，我点击生成后有明确反馈，并在生成完成后看到轻量打字机或分块渐显效果。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-generation-feedback-typewriter`（**已 merge 至 sprint**）

**UX 参考：** miaopian-demo block-aware SSE + LandingStreamAnalysisPanel + 滚动跟随（DECISION-077）

**主路径：** `POST /api/generate/stream`（真实 SSE）；batch `/api/generate` 保留

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/app/api/generate/stream/route.ts` | SSE API |
| `src/server/generation/run-generate-stream-flow.ts` | stream + phase + flow.complete |
| `src/core/generation/jsonl-block-stream-parser.ts` | JSONL → GenerationEvent |
| `src/core/generation/volcengine-streaming-provider.ts` | Ark stream: true |
| `src/lib/render-streaming-preview.ts` | 流式 block → Style Selection + Preview Renderer |
| `src/lib/use-preview-stream-scroll.ts` | 自动跟随 + 回到当前位置 |
| `src/components/preview/` | 成稿分析面板 + 生成状态条 |
| `src/app/preview/preview-page-client.tsx` | connecting/planning/streaming/finalizing/done UI |

**验收标准：**

- [x] AC-1 点击后立即进入生成 UI（非空白等待）
- [x] AC-2 phase + 分析步骤可见反馈
- [x] AC-3 真实 SSE block.start/delta/complete 驱动 Preview Renderer + Style 系统控件样式 + caret
- [x] AC-4 预览区滚动跟随 + 手动暂停/恢复
- [x] AC-5 非客户端 batch 假打字机；终态 flow.complete 可复制

**用户验收：** 2026-06-02 PO 确认通过（流式 Style 控件样式 + list 渲染 + 滚动跟随）

**Merge：** `feature/s6-generation-feedback-typewriter` → `sprint/s6-visible-ai-main-flow` @ `ce967b1`（2026-06-02）

---

## S6-STORY-006 风格 / 配色基础切换与复制到公众号

**用户故事：** 作为用户，我可以切换基础风格和配色，复制文章到公众号编辑器，并做最小粘贴验证。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-style-palette-copy-paste-qa`（**已 merge 至 sprint** @ `e7391e5` · PO 2026-06-02）

**对应 Product Backlog：** PB-R1-05、PB-R1-07、PB-R1-08

**对应 Story Map：** 调整观感 / 复制使用 / 粘贴验证

**目标：** 基础风格与配色切换；Copy Renderer + Clipboard；最小手动粘贴 QA 记录。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/components/preview/preview-style-controls.tsx` | 预览侧栏风格 / 配色切换 UI |
| `src/lib/preview-style-controls.ts` | 风格控制状态与 styleIntent 映射 |
| `src/lib/preview-color-palette.ts` | 配色 palette + CSS 变量 |
| `src/lib/render-article-preview-client.ts` | 客户端重跑 Style Selection + Preview/Copy |
| `src/core/styles/variants/index.ts` | 新增 `warm-editorial` theme |
| `src/core/styles/theme-palette-tokens.ts` | Copy / Preview 共享 theme palette 解析 |
| `docs/agile/paste-qa/s6-minimal-paste-qa.md` | 最小粘贴 QA 手测记录（PO 2026-06-02 通过） |

**验收标准：**

- [x] AC-1 用户可切换基础文章风格，整篇视觉有差异（经典资讯 vs 经典简约 → variant 差异）
- [x] AC-2 用户可切换配色，整篇视觉有差异（默认 vs 暖色编辑 → theme + CSS palette）
- [x] AC-3 Copy 按钮；payload 来自 Copy Renderer（切换后客户端重渲染 clipboard）
- [x] AC-4 最小粘贴 QA 已完成（`docs/agile/paste-qa/s6-minimal-paste-qa.md`；PO 2026-06-02；含暖色复制公众号验证）
- [x] AC-5 不宣称 Sprint 8 全量 Paste QA / Release 1 关闭已通过

---

## S6-STORY-006A 首页 / 预览 UI Shell 对齐 miaopian-demo（batch + 复制）

**用户故事：** 作为用户，我可以在有产品感的首页输入需求，在预览工作台完成 batch 生成、查看带样式文章并复制到公众号。

**优先级：** P0 · **状态：** Done · **工作分支：** `feature/s6-ux-shell-miaopian-reference`（已并入 `feature/s6-generation-feedback-typewriter` 并 **merge 至 sprint**）

**对应 Product Backlog：** PB-R1-01、PB-R1-04、PB-R1-07（复制部分提前）

**UX 参考：** `miaopian-demo` Landing（信息架构与视觉密度；非代码复制 · DECISION-075）

**目标：** `/` + `/preview` UI Shell 抛光；预览页 Copy 按钮。主路径后续由 S6-STORY-005 升级为 SSE（DECISION-077）。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `src/components/ui-shell/` | 共享页面壳（backdrop / nav / primitives） |
| `src/app/home-page-client.tsx` | miaopian 风格 Landing 输入区 |
| `src/app/preview/preview-page-client.tsx` | 双栏工作台 + 复制 |
| `src/lib/copy-clipboard-payload.ts` | 剪贴板复制工具 |

**验收标准：**

- [x] AC-1 `/` 信息架构对齐 miaopian Landing（hero + 输入卡片 + 示例选题 + 高级选项）
- [x] AC-2 `/preview` 双栏布局（侧栏操作 + 主预览区）
- [x] AC-3 预览主路径已升级为 SSE stream（原 batch 保留于 `/generate` harness · DECISION-077）
- [x] AC-4 预览页「复制到公众号」可用（Copy Renderer payload）
- [x] AC-5 不动 Article Schema；不复制 miaopian-demo 代码

**用户验收：** 2026-06-02 PO 确认通过（随 S6-STORY-005 一并验收）

**Merge：** 已随 `feature/s6-generation-feedback-typewriter` @ `ce967b1` 进入 sprint

---

# Visible Progress Chore（DECISION-080 · Sprint 7 Paused）

> **状态：** Done（2026-06-02 用户验收）· **工作分支：** `chore/visible-progress-gallery-legacy` → `sprint/s7-wechat-article-experience`
> **目标：** 肉眼可见进展 + 入口澄清；不调用 AI；不全量测试每轮

## CHORE-VIS-001 `/generate` legacy 收敛与导航澄清

**优先级：** P2 · **状态：** Done · **工作分支：** `chore/visible-progress-gallery-legacy`

**用户故事：** 作为协作者，我需要清楚用户主路径是 `/` → `/preview`，而不是 `/generate` dev 页。

**验收标准：**

- [x] AC-1 导航主链：`/` CTA + `/gallery`「样式进展」
- [x] AC-2 **`/generate` 页面已删除**（2026-06-02 用户确认无作用）
- [x] AC-3 batch `POST /api/generate` 已删除；仅保留 `POST /api/generate/stream` SSE 主路径

---

## CHORE-VIS-002 `/gallery` 进展可视化最小版（S7-STORY-003 pull-forward）

**优先级：** P1 · **状态：** Done · **工作分支：** `chore/visible-progress-gallery-legacy`

**用户故事：** 作为 PO / 开发者，我需要在不调用 AI 的情况下，用 fixture Article 即时查看 Renderer / Style 改动进展。

**验收标准：**

- [x] AC-1 `/gallery` 可访问，fixture 驱动 Preview（`full-blocks` + `minimal-title`）
- [x] AC-2 复用 PreviewStyleControls + ArticlePreviewPanel；展示 variant id 列表
- [x] AC-3 不替代 S7-STORY-003 完整 Gallery（无多主题样例墙 / 无 Copy 侧栏）；后续 Sprint 7 恢复时扩展

**关联：** S7-STORY-003（Planned · 完整版待 Sprint 7 恢复）

---

# Sprint 7 Backlog · WeChat Article Experience & Style Richness

> **Sprint 7 目标：** 整篇文章像公众号文章；Style Gallery；样式丰富度；修正过度卡片化；**miaopian 协作/体验对齐见 alignment 文档**
> **Sprint 7 状态：** **In Progress**（2026-06-02 · DECISION-081~085 · **S7-STORY-002~006 Done** · **S7-STORY-007A In Review** · **S7-STORY-007 不做**）
> **Sprint 7 分支：** `sprint/s7-wechat-article-experience`（从 `release/1` 切出）
> **对齐文档：** [`docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md`](miaopian-alignment/s7-workflow-and-ux-gap.md)
> **Sprint 7 不做：** Sprint 8 Paste QA、关闭 Release 1、merge `main`

## Sprint 7 建议执行顺序

```text
S7-STORY-001 Sprint 7 启动 · miaopian 协作对齐与体验目标 — Done
S7-STORY-002 完整文章 fixture 与公众号文章样例集 — Done
S7-STORY-003 Style Gallery 与标题层级样式（合并原 003 + 004）— Done
S7-STORY-004 标题 / 分节标题 variant 丰富度 — Merged → S7-STORY-003
S7-STORY-005 重点高亮 / 列表 / 摘要 / CTA 样式优化 — Done
S7-STORY-006 整篇文章样式组合与过度卡片化修正 — Done
S7-STORY-007A R1 Style Fidelity Stabilization — In Review（当前）
S7-STORY-007 Sprint 7 手动视觉 QA 与关闭准备 — Deferred（用户确认不做，改 007A）
```

---

## S7-STORY-001 Sprint 7 启动 · miaopian 协作对齐与体验目标

**用户故事：** 作为产品负责人，我需要在 Sprint 7 启动时对齐 miaopian-demo 协作方式边界、交互流 gap 与「像公众号文章」体验目标。

**优先级：** P0 · **状态：** Done · **工作分支：** `docs/s7-start-miaopian-alignment`（本轮在 sprint 分支完成）

**对应 Product Backlog：** TECH-ARCH-023 · PB-R1 样式体验（Sprint 7 主责）

**目标：** 创建 sprint 分支；登记 DECISION-079；发布 miaopian alignment 文档；明确 S7-STORY-002~007 边界。

**实际产物：**

| 路径 | 说明 |
|------|------|
| `docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md` | 协作 adopt/不 adopt · 交互流 gap · Gallery 边界 |
| `docs/agile/decisions.md` | DECISION-078 · DECISION-079 |
| `sprint/s7-wechat-article-experience` | Sprint 7 分支 |

**验收标准：**

- [x] AC-1 从 `release/1` 创建 `sprint/s7-wechat-article-experience`
- [x] AC-2 [`s7-workflow-and-ux-gap.md`](miaopian-alignment/s7-workflow-and-ux-gap.md) 已登记（协作 4 · 交互 1 · 样式 2 边界）
- [x] AC-3 交互流无 P0 gap 已文档化；optional polish 不阻塞 Sprint 7
- [x] AC-4 Style Gallery / 样式 richness 明确归 S7-STORY-002~006
- [x] AC-5 未启动 Sprint 8；未关闭 Release 1
- [x] AC-6 Sprint 6 已关闭并 merge `release/1`（DECISION-078）

---

## S7-STORY-001（原） Sprint 7 启动与体验目标对齐

> **已合并至上方 S7-STORY-001 扩展版（DECISION-079）。** 下列 AC 仍有效：体验目标文档化 · 未启动 Sprint 8。

---

## S7-STORY-002 完整文章 fixture 与公众号文章样例集

**用户故事：** 作为 PO / 设计师，我需要在不调用 AI 的情况下，用 **8 套固定、可复现的完整公众号文章**，评审 Preview / Copy 在不同文章类型下的观感，并为 Gallery 与 Sprint 8 Paste 基线提供数据。

**优先级：** P0 · **状态：** **Done**（PO 签收 2026-06-02）· **工作分支：** `feature/s7-article-fixture-samples` · merged sprint @ `429ce30`

**对应 Product Backlog：** TECH-ARCH-023 · US-R1-012 / US-R1-013 前置数据

**目标：** 8 套常见类型完整 Article fixture + 注册表；驱动 Preview / Copy；接入 `/gallery` 样例选择器。

**8 套样例类型：**

| ID | 类型 |
|----|------|
| `sample-knowledge` | 知识科普 / 干货 |
| `sample-industry` | 行业趋势 / 观察 |
| `sample-product` | 产品 / 功能解读 |
| `sample-brand` | 品牌故事 / 价值 |
| `sample-event` | 活动招募 / 沙龙 |
| `sample-promo` | 促销 / 转化 |
| `sample-listicle` | 清单体 / N 个技巧 |
| `sample-seasonal` | 节点 / 复盘 / 里程碑 |

**In Scope：**

- [`src/fixtures/article-samples/`](../../src/fixtures/article-samples/) 注册表与 8 套 raw fixture
- 合并 [`src/fixtures/gallery-articles.ts`](../../src/fixtures/gallery-articles.ts) 重复维护（smoke fixture 保留）
- `/gallery` 样例下拉接入 8 套
- Preview + Copy 渲染 smoke 单测

**Out of Scope：** highlight/list/lead/cta 大改（S7-STORY-005）· 整篇 rhythm / 过度卡片化（S7-STORY-006）· Gallery + title/heading 丰富度（**合并版 S7-STORY-003** · DECISION-082）· Paste QA（Sprint 8）· AI 生成样例

**验收标准：**

- [x] AC-1 **8 套** fixture 登记且有稳定 id（上表）
- [x] AC-2 每套为完整文章：≥8 blocks、≥2 `heading`、有 `title`+`lead`，中文成稿
- [x] AC-3 **8 套合计**覆盖 Release 1 全部 11 block 类型
- [x] AC-4 每套 `parseArticle` PASS；Preview blocks 全 `ok`；Copy clipboard 可生成
- [x] AC-5 `/gallery` 可切换 8 套样例并即时 Preview
- [x] AC-6 单测：注册表 + representative 渲染 smoke（非全量 8×33 variant）

---

## S7-STORY-003 Style Gallery 与标题层级样式（合并原 003 + 004）

**用户故事：** 作为 PO / 设计师，我需要在 `/gallery` 上**浏览** 8 套样例文章的 Preview / Copy，并**肉眼确认** title 与 heading 在整篇中有清晰层次、不再「全都一样」。

**优先级：** P0 · **状态：** **Done**（PO 签收 2026-06-02）· **工作分支：** `feature/s7-gallery-heading-variants` → `feature/s7-rich-styles-title-heading` · merged sprint @ `517717e`

**对应：** TECH-ARCH-023 · US-R1-012 · US-R1-013（标题层次部分）· **DECISION-082**

**In Scope：**

- **Gallery UX（原 003）：** Copy 对照区 · title/heading 聚焦模式 · title/heading variant 侧栏切换（fixture 驱动，无 AI）
- **Title / Heading 样式丰富度（原 004）：** `preview-visual-styles.ts` + copy title/heading 6 variant 视觉 polish · 8 套样例有意识 assignment（[`gallery-title-heading.ts`](../../src/lib/gallery-title-heading.ts)）

**Out of Scope：** highlight/list/lead/cta（S7-STORY-005）· rhythm / 卡片化（S7-STORY-006）· Paste QA（Sprint 8）· 全量 33×8 自动化矩阵

**验收标准：**

- [x] AC-1 `/gallery` 可手测：8 套样例 + 风格/配色 + **Copy 对照区**
- [x] AC-2 Title/Heading **聚焦模式**可快速定位层级 block
- [x] AC-3 6 个 first-wave title/heading variant 在 Gallery 上**视觉可区分**
- [x] AC-4 8 套样例 title 与首个 heading **不**同为 plain_minimal 组合
- [x] AC-5 Preview 与 Copy 对 title/heading **同源 typography token**
- [x] AC-6 targeted 单测：Gallery render + title/heading variant 切换 smoke

**备注：** CHORE-VIS-002 已交付 `/gallery` 最小 fixture Preview（DECISION-080）；2026-06-02 第二轮 **6 风格 preset + 6 配色 + title/heading 富样式**；第三轮 **iconDecor / cardTitle** + R8 节奏族修复；第四轮 **DECISION-083** miaopian **6 preset + 6 theme**、**heading 13**（含 6 种 miaopian 对齐样式）、**其它 block 各 9 variant（registry 97）**、Gallery **全 block variant 切换** + **风格→默认配色联动**；第五轮 **同篇 heading 统一 variant** + **公众号字号**（`miaopian-typography.ts`）· **796 tests + build PASS** · **PO `/gallery` 签收 2026-06-02**。

---

## S7-STORY-004 标题 / 分节标题 variant 丰富度

**状态：** **Merged → S7-STORY-003**（2026-06-02 · DECISION-082 · 用户确认）

**说明：** 标题 / 分节标题 variant 丰富度并入 S7-STORY-003；不再单独开分支 `feature/s7-heading-variant-richness`。

## S7-STORY-005 重点高亮 / 列表 / 摘要 / CTA 样式优化

**优先级：** P0 · **状态：** **Done**（PO 签收 2026-06-02）· **工作分支：** `feature/s7-rich-styles-title-heading`（与 S7-STORY-003 同批 · DECISION-083）· merged sprint @ `517717e`

**目标：** 优化 highlight / list / lead / cta 等 block 在整篇文章中的组合观感。

**验收标准：**

- [x] AC-1 quote / highlight / paragraph / list / lead / divider / info_card / cta / image_placeholder 各具备 **9** 个 `release1_required` variant（registry 97）
- [x] AC-2 expansion layout maps + Preview / Copy renderer 分支覆盖新 variant
- [x] AC-3 Gallery 可 per-block 切换 variant（`gallery-block-variant-controls`）
- [x] AC-4 796 tests + `npm run build` PASS

**备注：** 2026-06-02 已随 DECISION-083 交付 expansion variant + layout maps + renderer；**title 仍 3 variant**。整篇 rhythm / 过度卡片化归 **S7-STORY-006**。Paste QA 矩阵见 Sprint 8 抽样策略（非 97×8 全量）。

---

## S7-STORY-006 整篇文章样式组合与过度卡片化修正

**优先级：** P0 · **状态：** **Done**（PO 签收 2026-06-02）· **工作分支：** `feature/s7-article-rhythm-card-fix` · **DECISION-084** · merged sprint @ `935640f`

**目标：** 修正过度卡片化；文章级 rhythm / variant 组合更接近公众号阅读体验。

**In Scope：**

- Orchestrator **R4**（iconDecor/cardTitle 连续≤2）+ **RCARD**（正文卡片化强调连续≤2）
- 生成 **plain-first** rotation + `balanceCardEmphasisInBlockHints`
- `warm` preset 默认减卡片叠层

**验收标准：**

- [x] AC-1 Orchestrator RCARD：连续 3 个 `paragraph_soft_card` → 第 3 个 fallback `paragraph_plain_body`
- [x] AC-2 Orchestrator R4：连续 3 个 title/heading cardTitle → 第 3 个 fallback 非 decor family
- [x] AC-3 生成 hints 在 orchestrator 前做 RCARD 平衡
- [x] AC-4 **802** tests + `npm run build` PASS
- [x] AC-5 PO `/gallery` + 真实生成目验收「非卡片墙」观感（PO 签收 2026-06-02）

**备注：** 不改动 Sprint 8 Paste QA 范围；不关闭 Sprint 7。

---

## S7-STORY-007A R1 Style Fidelity Stabilization（默认成稿 · 复制保真 · 整篇节奏）

**用户故事：** 作为 PO，我需要默认生成文章在 Preview 与微信公众号粘贴后视觉一致、整篇节奏自然，而不是继续堆 variant 或局部微调。

**优先级：** P0 · **状态：** **In Review**（代码 + 自动化 **Done** · 粘贴 QA **Not Run**）· **工作分支：** `feature/s7-story-007a-r1-style-fidelity` · **来源：** `sprint/s7-wechat-article-experience`

**不做：** 新增 variant 数量 · S7-STORY-007 原 close-readiness 文档流 · Visual Layer 旧方案 · 平行 Article/Renderer

**In Scope：**

- 审计 [`docs/agile/audits/r1-style-fidelity-stabilization-audit.md`](audits/r1-style-fidelity-stabilization-audit.md)
- 基准 [`docs/product/r1-style-quality-baseline.md`](../product/r1-style-quality-baseline.md)
- Golden fixtures：`tests/fixtures/articles/r1-golden-*.json`（loader `@/fixtures/r1-golden`）
- 默认 `business` preset 默认 variant + typography（16px / 1.75）
- Orchestrator **RLAYOUT**（整篇节奏 10 条）
- Copy 微信安全：title/heading copy-safe 样式；`copy-safe-html` 增 gradient/flex/shadow 检测
- `/dev/style-fidelity` 调试页
- 单测：golden copy snapshot · orchestrator layout · preview-copy token parity

**验收标准：**

- [x] AC-1 审计文档 + R1 baseline 文档
- [x] AC-2 3 套 golden fixture（合法 Article · `business` + `businessBlue`）
- [x] AC-3 默认路径 title/lead/heading/paragraph/info_card/highlight/quote/list/cta/divider/image 默认 variant 调整（preset bundles + typography）
- [x] AC-4 Copy HTML snapshot（`r1-golden-copy-snapshot`）无 class/style/var/gradient/flex/absolute
- [x] AC-5 Preview/Copy token parity 单测（golden default）
- [x] AC-6 RLAYOUT orchestrator 单测
- [x] AC-7 **809** tests + `npm run build` PASS
- [ ] AC-8 微信公众号粘贴 QA **PASS**（[`paste-qa/r1-golden-paste-qa.md`](paste-qa/r1-golden-paste-qa.md) · **Not Run**）

**备注：** 粘贴 QA 未跑前 Story 保持 **In Review**；FAIL 须登记 `bugs.md`。

---

## S7-STORY-007 Sprint 7 手动视觉 QA 与关闭准备

**优先级：** P0 · **状态：** **Deferred**（用户 2026-06-02 确认不做，由 **S7-STORY-007A** 承接 R1 样式保真）· **原工作分支：** `docs/s7-visual-qa-close-readiness`

**目标：** 手动视觉 QA 记录；close readiness audit；不关闭 Release 1。

---

# Sprint 8 Backlog · Copy Fidelity & Release 1 Closure

> **Sprint 8 目标：** Preview / Copy / 粘贴一致性；135 + 公众号后台 Paste QA；Release 1 关闭准备
> **Sprint 8 状态：** **Planned**（后续 · 未启动）
> **Sprint 8 分支（启动时）：** `sprint/s8-copy-fidelity-closure`（DECISION-070）
> **承接：** 原 Sprint 6-A/B 中 Fixture Triple / 33 variants Paste QA / PasteTestRecord 目标（方案 B 收口至 Sprint 8）
> **Sprint 8 不做：** 未满足 release-plan 关闭标准时 merge `main`

## Sprint 8 建议执行顺序

```text
S8-STORY-001 Sprint 8 启动与复制保真范围确认 — Planned
S8-STORY-002 Preview / Copy Renderer 一致性 QA — Planned
S8-STORY-003 Clipboard HTML / Plain Text 双格式 QA — Planned
S8-STORY-004 135 编辑器粘贴测试 — Planned
S8-STORY-005 微信公众号后台粘贴测试 — Planned
S8-STORY-006 fallback / unsupported block 降级策略 — Planned
S8-STORY-007 Release 1 手动验收记录与关闭准备 — Planned
```

---

## S8-STORY-001 Sprint 8 启动与复制保真范围确认

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-start-backlog-split`

**目标：** 启动 sprint；确认 Paste QA 范围（33 variants · 135 · 公众号后台 · PasteTestRecord）。

---

## S8-STORY-002 Preview / Copy Renderer 一致性 QA

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-preview-copy-consistency-qa`

**目标：** 系统性对比 Preview 与 Copy 输出；登记差异与 P1/P2。

---

## S8-STORY-003 Clipboard HTML / Plain Text 双格式 QA

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-clipboard-dual-format-qa`

**目标：** 验证 `text/html` + `text/plain` 双格式在微信编辑场景下的行为。

---

## S8-STORY-004 135 编辑器粘贴测试

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-135-editor-paste-qa`

**目标：** 135 编辑器最小 Paste QA；PasteTestRecord 记录。

---

## S8-STORY-005 微信公众号后台粘贴测试

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-wechat-backend-paste-qa`

**目标：** 公众号后台最小 Paste QA；承接 first-wave 33 variants 回归（原 6-B 目标）。

---

## S8-STORY-006 fallback / unsupported block 降级策略

**优先级：** P0 · **状态：** Planned · **工作分支：** `feature/s8-copy-fallback-strategy`

**目标：** 明确 balanced / preview_only / unsupported 的 fallback 与用户可见说明。

---

## S8-STORY-007 Release 1 手动验收记录与关闭准备

**优先级：** P0 · **状态：** Planned · **工作分支：** `docs/s8-release1-close-readiness`

**目标：** 对照 [`release-plan.md`](release-plan.md) 关闭标准完成手动验收记录；**不自行关闭 Release 1**；不 merge `main`（须用户确认）。

**验收标准：**

- [ ] AC-1 release-plan 关闭标准逐项核对
- [ ] AC-2 遗留问题写入 backlog / bugs.md
- [ ] AC-3 有 Paste QA 记录（Not Run 须明确标注，不得冒充通过）
- [ ] AC-4 未自行关闭 Release 1
- [ ] AC-5 未 merge `main`

---
