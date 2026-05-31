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
| DECISION-034 | 2026-05-30 | Block 文本字段统一使用 text；paragraph / lead 的 InlineContent 字段不使用 body | 已确认 |
| DECISION-035 | 2026-05-30 | Sprint 2 启动前收口 audit P1/P2 风险；P1-001 与 P1-008 在 Sprint 1-B 解决，其余登记后续 Sprint | 已确认 |
| DECISION-036 | 2026-05-30 | 吸收秒篇 Component DSL 的 family / variant / slot / asset / orchestrator 思想，不迁移旧实现代码 | 已确认 |
| DECISION-037 | 2026-05-30 | title 与 heading 共享 titleBlock visual component，保持不同语义 block | 已确认 |
| DECISION-038 | 2026-05-30 | Sprint 3 增加 ComponentProtocol 与第一批 titleBlock variants 作为 Style System 前置范围 | 已确认 |
| DECISION-039 | 2026-05-30 | Release 1 第一批 variant 升级为 11 block × 各 3~5 默认 variant × 若干 VisualAssetRegistry assets | 已确认 |
| DECISION-040 | 2026-05-30 | Release 1 启用受控 AI 样式选择，AI 不得绕过 Style System | 已确认 |
| DECISION-041 | 2026-05-30 | titleBlock slot 必须绑定合法内容来源，Style System 不得生成正文语义 | 已确认 |
| DECISION-042 | 2026-05-30 | Release 1 titleBlock layoutMode 必须通过可执行 copy-safe 约束 | 已确认 |
| DECISION-043 | 2026-05-30 | Release 1 样式采用 first-wave 11×3 required 与 expansion 分阶段策略 | 已确认 |
| DECISION-044 | 2026-05-30 | magazine_left_bar_title 降为 release1CandidateVariants，不进入 first-wave required | 已确认 |
| DECISION-045 | 2026-05-30 | 正式拆分 Sprint 3/4/6 为 3-A/B/C、4-A/B、6-A/B | 已确认 |
| DECISION-051 | 2026-05-30 | 关闭 Sprint 1-B，并保持 Sprint 2 未启动 | 已确认 |
| DECISION-052 | 2026-05-31 | 建立 `release/1` 作为 Release 1 主干；Sprint 1-B merge 至 release/1；清理 Sprint 1-B story 工作分支 | 已确认 |
| DECISION-053 | 2026-05-31 | 正式启动 Sprint 2；范围 Article / Block Schema + InlineContent 代码契约；从 release/1 切 sprint/s2-article-block-schema | 已确认 |

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

- **状态：** 已确认

### DECISION-034 详情（Block 文本字段命名）

- **背景：** S1-STORY-022 audit 发现 `paragraph` / `lead` 使用 `content.body`，与其它 block 的 `content.text` 不一致，增加 Sprint 2 Zod/TS 实现复杂度。
- **决策：**
  1. Release 1 文本型 block 主文本字段统一为 `content.text`
  2. `paragraph` / `lead` 支持 `string | InlineContent`，实现阶段 normalize 为 InlineContent
  3. `info_card.content.body` 保留，因其语义是卡片正文，不属于普通文本型 block 主字段
- **影响范围：** block-schema.md、article-schema.md、architecture-overview.md、rendering-pipeline.md、Sprint 2 代码契约
- **状态：** 已确认

### DECISION-035 详情（Sprint 2 readiness 契约收口）

- **背景：** S1-STORY-022 audit 显示 P0=0，Sprint 2 有条件可启动；但仍有 P1/P2 需登记，且 rendering-pipeline 实现顺序易误导后续执行。
- **决策：**
  1. Sprint 1-B（S1-STORY-023）只修复影响 Sprint 2 代码契约的 P1-001（字段命名）与 P1-008（实现顺序）
  2. 其余 P1/P2 按 Sprint 3/4/6 或后续 Release 处理，登记于 sprint-plan.md
  3. Sprint 2 启动仍须用户确认 Sprint 1-B 收口；Sprint 1-B 保持 In Review
- **影响范围：** sprint-plan.md、product-backlog.md、rendering-pipeline.md §11
- **状态：** 已确认

### DECISION-036 ~ DECISION-038 详情（Component DSL 对齐）

- **DECISION-036：** 吸收 ComponentProtocol、titleBlock catalog、VisualAssetRegistry、StyleOrchestrator、AI Guardrails 至 Style System；不迁移旧 DSL 代码 / Visual Layer / Space Style
- **DECISION-037：** title / heading 共享 titleBlock visual component；映射属 Style System，不改 Block Schema
- **DECISION-038：** Sprint 3 纳入 ComponentProtocol、titleBlock 3~5 copy-safe variant、VisualAssetRegistry 最小 pool、StyleOrchestrator 最小去重；Sprint 2 仍只做 Article/Block/InlineContent
- **影响范围：** style-system §11、sprint-plan Sprint 3、TECH-ARCH-007~012
- **状态：** 已确认

### DECISION-039 ~ DECISION-042 详情（S1-STORY-025 Style System 实现前收口）

- **DECISION-039：** Release 1 required variant = 11 semantic block × each 3~5 release1RequiredVariants + VisualAssetRegistry assets；三层分类 required/candidate/experimental；全部 required 须 Preview+Copy+Paste QA
- **DECISION-040：** Release 1 启用受控 AI 样式选择；Generation 产出 StyleSelectionRequest/Patch；不得输出 HTML/CSS/inline style/未注册 variant/asset；须经完整 validation pipeline
- **DECISION-041：** SlotContentBinding；title→block.content.text；subtitle→metadata或disabled；badge→orchestrator presentation；icon/bgShape→assetRegistry；Style System 不得生成正文
- **DECISION-042：** TitleBlockLayoutCompatibility；layoutMode 须声明 allowedInCopy/fallbackLayoutMode/riskLevel；overlay/offset-bg 不得进入 release1RequiredVariants
- **影响范围：** style-system §10/§11、architecture-overview §4/§9.2、generation-pipeline §8.1、sprint-plan Sprint 3~6
- **状态：** 已确认

### DECISION-043 ~ DECISION-045 详情（S1-STORY-027 范围收口与 Sprint 拆分）

- **DECISION-043：** First wave = 11×3=33 release1RequiredVariants；expansion = 每 block 第 4/5 个；first-wave 须 Preview+Copy+Paste QA；expansion 不阻塞 Sprint 3-A/4-A
- **DECISION-044：** `magazine_left_bar_title` = candidate；不在 first wave；实现须真实 DOM left bar + text，禁止 absolute/pseudo/complex layout，单独 Paste QA
- **DECISION-045：** Sprint 3→3-A/B/C；Sprint 4→4-A/B；Sprint 6→6-A/B；Sprint 2/5 不变；拆分不降低最终 11×5 目标
- **影响范围：** style-system §10、sprint-plan、product-backlog TECH-ARCH-018~022
- **状态：** 已确认

### DECISION-051 详情（Sprint 1-B 正式关闭）

- **背景：** Sprint 1-B final audit 分级 B；P0=0；P1/P2 已登记；用户确认 Checklist #10（接受 B 级 audit）与 #11（关闭 Sprint 1-B）
- **决策：** Sprint 1-B 于 2026-05-30 正式关闭
- **约束：** 关闭 Sprint 1-B **不等于**启动 Sprint 2；Sprint 2 须在用户**单独确认**后启动
- **关联：** S1-STORY-029、architecture-overview §19、DECISION-051
- **状态：** 已确认

### DECISION-052 详情（Release 1 主干与 Sprint 1-B 分支清理）

- **背景：** Sprint 1-B 已关闭；用户从 `main` 创建 `release/1`，并将 `sprint/s1b-core-tech-governance` merge 至 `release/1`（`882a43d`）
- **决策：**
  1. `release/1` 代表 **Release 1 开发主干**；后续 Release 1 内 Sprint 从 `release/1` 切 sprint 分支，验收后 merge 回 `release/1`
  2. `main` 仅接收 Release 级合并（Release 1 整体验收后 merge `release/1` → `main`）
  3. Sprint 1-B 全部 15 个 `docs/s1b-*` story 工作分支已清理删除（含已 merge 与未 merge）
- **保留分支：** `main`、`release/1`、`sprint/s1b-core-tech-governance`（sprint 分支保留作历史快照，可后续归档）
- **影响范围：** git-workflow.md、Sprint 2+ 切分支来源改为 `release/1`
- **状态：** 已确认

### DECISION-053 详情（Sprint 2 正式启动）

- **背景：** Sprint 1-B 已关闭（DECISION-051）；Release 1 主干为 `release/1`（DECISION-052）；实现前契约与 P1-001 已收口；用户确认启动 Sprint 2
- **决策：**
  1. Sprint 2 **正式启动**，状态 **In Progress**
  2. 范围保持：**Article / Block Schema + InlineContent 代码契约**（DECISION-030）；**不做** Renderer、Style System、Generation、AI Style Selection
  3. 从 `release/1` 切出 **`sprint/s2-article-block-schema`**
  4. Sprint 2 Backlog 拆分为 S2-STORY-001~007（见 `sprint-backlog.md`）
- **约束：** Sprint 2 工作分支从 sprint 分支切出；验收 merge 至 sprint，再 merge 至 `release/1`（须用户确认）
- **关联：** S2-STORY-001、DECISION-030、DECISION-034
- **状态：** 已确认

## 决策模板

```
### DECISION-XXX：[标题]

- **日期：**
- **背景：**
- **决策：**
- **影响范围：**
- **状态：** 待确认 / 已确认 / 已废弃
```
