# 决策记录

> 轻篇公众号排版 · qingpian-wechat-editor

| ID | 日期 | 决策 | 状态 |
|----|------|------|------|
| DECISION-001 | 2026-05-30 | 项目正式命名为 `qingpian-wechat-editor` | 已确认 |
| DECISION-002 | 2026-05-30 | 产品命名为「轻篇公众号排版」 | 已确认 |
| DECISION-003 | 2026-05-30 | 本项目不使用 clean-core / v2 / demo / prototype 命名 | 已确认 |
| DECISION-004 | 2026-05-30 | Release 1 聚焦公众号文章生成、样式排版、流式预览与复制一致性闭环 | 已确认 |
| DECISION-005 | 2026-05-30 | 样式系统属于 Release 1 核心范围 | 已确认 |
| DECISION-006 | 2026-05-30 | 公众号复制一致性是 Release 1 P0 质量标准 | 已确认 |
| DECISION-007 | 2026-05-30 | 后续 Sprint 按合理工作量拆分（Sprint 1 不受 1 人/1 周约束，见 DECISION-011） | 已确认 |
| DECISION-008 | 2026-05-30 | Sprint 1 不做业务功能实现，只做项目初始化、规则、文档与核心技术方案 | 已确认 |
| DECISION-009 | 2026-05-30 | 旧一键成稿项目只作为经验来源，不作为代码来源 | 已确认 |
| DECISION-010 | 2026-05-30 | ChatGPT + Cursor + docs 协作方式中，docs 是共享事实源 | 已确认 |
| DECISION-011 | 2026-05-30 | 去除 Sprint 1 的 1 人 / 1 周工作量约束 | 已确认 |
| DECISION-012 | 2026-05-30 | Sprint 1 范围从「项目初始化与文档骨架」扩展为「正式项目启动、核心技术方案定稿与工程治理」 | 已确认 |
| DECISION-013 | 2026-05-30 | Sprint 1-A 已完成项目初始化与文档骨架；Sprint 1-B 补齐 Git 仓库治理和核心技术方案 | 已确认 |
| DECISION-014 | 2026-05-30 | style-system.md 必须升级为正式技术方案，不得停留在概念骨架 | 已确认 |
| DECISION-015 | 2026-05-30 | 业务功能实现必须在核心技术方案完成后再进入后续 Sprint | 已确认 |
| DECISION-016 | 2026-05-30 | Git 主分支为 `main`，采用 feature/sprint/bugfix/docs 分支策略 | 已确认 |
| DECISION-017 | 2026-05-30 | Remote 仓库待配置，配置后 push 至 origin | 已确认 |
| DECISION-018 | 2026-05-30 | 核心技术方案一致性审查完成，9 份架构文档 + 产品/敏捷文档对齐 | 已确认 |
| DECISION-019 | 2026-05-30 | 建立 execution report 作为 ChatGPT + Cursor 协作交接机制 | 已确认 |
| DECISION-020 | 2026-05-30 | 建立 Sprint 分支与迭代内工作分支机制 | 已确认 |
| DECISION-021 | 2026-05-30 | Release 1 整体技术架构 A 版（产品推导） | 已确认 |
| DECISION-022 | 2026-05-30 | 采用 A/B 架构设计比较方式 | 已确认 |
| DECISION-023 | 2026-05-30 | 定稿方式：A 为骨、B 风险层并入，形成唯一 architecture-overview | 已确认 |
| DECISION-024 | 2026-05-30 | GenerationEvent 统一为 block.start / block.delta / block.complete / done.article | 已确认 |
| DECISION-025 | 2026-05-30 | StyleDefinition 是 Preview / Copy 唯一共享样式来源 | 已确认 |
| DECISION-026 | 2026-05-30 | Release 1 第一批 11 种 semantic block（含 image_placeholder） | 已确认 |
| DECISION-027 | 2026-05-30 | Copy Fidelity DoD：Done（代码）与 Done（粘贴 QA）分离 | 已确认 |
| DECISION-028 | 2026-05-30 | Style Import Adapter 后置，StyleDefinition 预留 sourceType 等扩展点 | 已确认 |
| DECISION-029 | 2026-05-30 | 将 InlineContent、命名边界、slot copy-safe、WeChatCompatibilityProfile 纳入 Sprint 1-B 实现前契约 | 已确认 |
| DECISION-030 | 2026-05-30 | Sprint 2 = Article / Block Schema + InlineContent 代码契约 | 已确认 |
| DECISION-031 | 2026-05-30 | Sprint 3 = Style System 代码契约与第一批 StyleDefinition | 已确认 |
| DECISION-032 | 2026-05-30 | Sprint 4 = Preview / Copy 最小闭环并启动最小粘贴 QA | 已确认 |
| DECISION-033 | 2026-05-30 | Sprint 5 / 6 分别聚焦 Generation / Streaming 与 Fixture 三联 + Paste QA 回归 | 已确认 |

### DECISION-019 详情

- **背景：** 旧一键成稿项目经验表明，ChatGPT 与 Cursor 协作需要结构化交接，避免每轮复制完整对话或在指令中重复要求报告。
- **决策：**
  1. 每轮 Cursor 执行后必须生成 execution report
  2. 存放于 `docs/agile/execution-reports/`
  3. execution report 是 ChatGPT 审查 Cursor 执行结果的主要输入
  4. Cursor 不应仅凭自己的总结关闭 Sprint / Story
  5. Sprint / Story 的最终关闭需要用户确认
- **影响范围：** `.cursor/rules/`、docs/agile/、协作流程
- **状态：** 已确认

### DECISION-020 详情

- **背景：** 需要清晰的分支边界，使 Sprint 内每项工作可独立审查、合并、回滚，避免在 main 上直接开发或多任务混分支。
- **决策：**
  1. 每个 Sprint 新建 `sprint/<sprint-slug>` 分支
  2. Sprint 内每个具体任务从当前 sprint 分支新建 `feature/` / `docs/` / `bugfix/` / `chore/` 分支
  3. 工作分支完成并经审查后合并回 sprint 分支
  4. Sprint 整体验收通过后，sprint 分支再合并回 main
  5. Cursor 不得未经用户确认直接关闭 Sprint 或合并 main
- **影响范围：** `docs/agile/git-workflow.md`、`.cursor/rules/`、协作流程
- **状态：** 已确认

### DECISION-021 ~ DECISION-028 详情（架构定稿）

- **背景：** A/B 架构候选与 audit 完成后，需形成 Release 1 唯一整体架构主文档，并关闭 Sprint 2 前 P0 决策项。
- **决策摘要：**
  1. **DECISION-023：** 定稿版 `architecture-overview.md` 以 A 版为骨架，并入 B 版风险层（校验清单、排除项、Copy Fidelity DoD、fixture 三联），为唯一主文档
  2. **DECISION-024：** GenerationEvent 采用 `block.start` / `block.delta` / `block.complete` / `done.article`；废弃 `block.append`、`block.update` 及 underscore 命名
  3. **DECISION-025：** StyleDefinition（ResolvedBlockStyle）为 Preview / Copy 唯一共享样式来源；最小字段见 architecture-overview §7
  4. **DECISION-026：** Release 1 冻结 11 种 semantic block，不照搬旧项目 12 P0
  5. **DECISION-027：** variant 交付区分 Done（代码）与 Done（粘贴 QA）；Sprint 4 启动最小粘贴 QA
  6. **DECISION-028：** Style Import Adapter（135/秀米）Release 4+；Release 1 预留 sourceType / compatibility / importMeta
- **影响范围：** docs/architecture/、Sprint 2+ 启动条件
- **状态：** 已确认

### DECISION-029 ~ DECISION-033 详情（实现前契约与 Sprint 计划）

- **背景：** 技术方案审计发现 InlineContent、Style 命名边界、slot copy-safe、WeChatCompatibilityProfile 等缺口若留到 Sprint 2 实现将导致返工。
- **决策摘要：**
  1. **DECISION-029：** 上述四项纳入 Sprint 1-B 文档契约（S1-STORY-021），Sprint 2 启动前须审查
  2. **DECISION-030：** Sprint 2 聚焦 Article/Block + InlineContent 代码契约
  3. **DECISION-031：** Sprint 3 聚焦 Style System 代码契约与 classic-news variant
  4. **DECISION-032：** Sprint 4 聚焦 Preview/Copy 闭环 + 最小粘贴 QA
  5. **DECISION-033：** Sprint 5 Generation/Streaming；Sprint 6 Fixture 三联 + Paste QA 回归
- **影响范围：** docs/architecture/、sprint-plan.md、Sprint 2+ 启动条件
- **状态：** 已确认

## 待确认决策

## 决策模板

```
### DECISION-XXX：[标题]

- **日期：**
- **背景：**
- **决策：**
- **影响范围：**
- **状态：** 待确认 / 已确认 / 已废弃
```
