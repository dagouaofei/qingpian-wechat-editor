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
| DECISION-054 | 2026-05-31 | 关闭 Sprint 2；contract audit A + code audit A；P0=0；merge sprint/s2-article-block-schema → release/1 | 已确认 |
| DECISION-055 | 2026-05-31 | 正式启动 Sprint 3-A；Style System Contract & Registry Infrastructure；从 release/1 切 sprint/s3a-style-system-infra | 已确认 |
| DECISION-056 | 2026-05-31 | StyleResolver：explicit variant 失败但 preset default 成功时 source=preset_default 并记录 variant_not_found issue；S3A-STORY-002 Done；merge feature/s3a-style-resolver → sprint | 已确认 |
| DECISION-057 | 2026-05-31 | 关闭 Sprint 3-A；contract audit A，P0=0；merge sprint/s3a-style-system-infra → release/1 | 已确认 |
| DECISION-058 | 2026-05-31 | 正式启动 Sprint 3-B；First-wave Required Variant Registry；从 release/1 切 sprint/s3b-first-wave-variant-registry | 已确认 |
| DECISION-059 | 2026-06-01 | 关闭 Sprint 3-B；contract audit A，P0=0；merge sprint/s3b-first-wave-variant-registry → release/1 | 已确认 |
| DECISION-060 | 2026-06-01 | 正式启动 Sprint 4-A；Preview / Copy Renderer for Text-first Blocks；从 release/1 切 sprint/s4a-text-first-renderer | 已确认 |
| DECISION-061 | 2026-06-01 | 关闭 Sprint 4-A；renderer contract audit A，P0=0；merge sprint/s4a-text-first-renderer → release/1 | 已确认 |
| DECISION-062 | 2026-06-01 | 正式启动 Sprint 4-B；Preview / Copy Renderer for Structured Blocks；从 release/1 切 sprint/s4b-structured-block-renderer | 已确认 |
| DECISION-063 | 2026-06-01 | 关闭 Sprint 4-B；renderer contract audit A，P0=0；merge sprint/s4b-structured-block-renderer → release/1 | 已确认 |
| DECISION-064 | 2026-06-01 | 正式启动 Sprint 3-C；Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry | 已确认 |
| DECISION-065 | 2026-06-01 | 关闭 Sprint 3-C；contract audit A，P0=0；merge sprint/s3c-style-assignment-validation → release/1 | 已确认 |
| DECISION-066 | 2026-06-02 | Sprint 5 范围调整为 Generation / Streaming + Release 1 真实 UI 主流程闭环 | 已确认 |
| DECISION-068 | 2026-06-02 | Sprint 5 必须纳入真实模型 API Provider 对接（Volcengine / Doubao） | 已确认 |
| DECISION-069 | 2026-06-02 | 关闭 Sprint 5；main-flow audit A-，P0=0；merge sprint/s5-generation-ui-main-flow → release/1 | 已确认 |
| DECISION-070 | 2026-06-02 | Release 1 尾声方案 B：Sprint 6 Visible Main Flow · Sprint 7 样式体验 · Sprint 8 复制保真与关闭 | 已确认 |
| DECISION-071 | 2026-06-02 | 正式启动 Sprint 6：Release 1 Visible AI Main Flow；PB-R1-01~08；真实 AI 用户侧最小闭环 | 已确认 |
| DECISION-072 | 2026-06-02 | Sprint 6 用户主流程：`/` + `/preview` + `requireRealProvider`；禁止静默 mock fallback | 已确认 |
| DECISION-075 | 2026-06-02 | Sprint 6 UX 参考 miaopian-demo Landing；UI Shell + 预览页复制（主路径后续升级为 SSE · DECISION-077） | 已确认 |
| DECISION-076 | 2026-06-02 | S6-STORY-005 客户端 batch 后 block/char 打字机；参考 miaopian 分析面板 UX；非 SSE token stream | **已废弃**（由 DECISION-077 取代） |
| DECISION-077 | 2026-06-02 | S6-STORY-005 真实 SSE block-aware stream + phase 事件 + 即时预览 UI | 已确认 |
| DECISION-078 | 2026-06-02 | 关闭 Sprint 6；visible main-flow audit A-，P0=0；merge sprint/s6-visible-ai-main-flow → release/1 | 已确认 |
| DECISION-079 | 2026-06-02 | 正式启动 Sprint 7；S7-STORY-001 含 miaopian 协作对齐 + UX gap 文档；样式/Gallery 归 S7-STORY-002~006 | 已确认 |
| DECISION-080 | 2026-06-02 | 暂停 Sprint 7 功能线；Visible-first Cursor 轮次规则；先行 `/gallery` 进展展台；`/generate` 页面已删除 | 已确认 |
| DECISION-081 | 2026-06-02 | 恢复 Sprint 7；S7-STORY-002 样例集扩至 **8 套**常见公众号文章类型 | 已确认 |
| DECISION-082 | 2026-06-02 | 合并 S7-STORY-003 与 S7-STORY-004 为单一 Story 003（Gallery UX + title/heading 丰富度）；004 标 Merged | 已确认 |
| DECISION-083 | 2026-06-02 | 成稿风格/配色对齐 miaopian-demo 6+6；PresetBundle（defaultVariant + variantPools + defaultTheme）；heading +4；其它 block 扩至 9 variant/类 | 已确认 |
| DECISION-084 | 2026-06-02 | S7 文章级卡片节奏：Orchestrator R4 + RCARD（连续卡片化≤2）；生成 plain-first rotation + hint 平衡 | 已确认 |
| DECISION-085 | 2026-06-02 | S7-STORY-007A：R1 默认成稿样式保真；golden fixture + RLAYOUT；Copy 微信安全；007 Deferred | 已确认 |
| DECISION-086 | 2026-06-02 | R1 默认 preset  canonical=`business`；`classic-news` 仅 legacy alias；golden/生成/fixture 对齐 | 已确认 |
| DECISION-087 | 2026-06-03 | Heading 仅保留 8 款发布池；审美优先；废弃 5 款旧 heading ID | 已确认 |
| DECISION-088 | 2026-06-04 | Sprint 8 重定义：WeChat-safe CSS Contract & Fidelity Test System（S8-STORY-001~008） | 已确认 |
| DECISION-089 | 2026-06-04 | WeChat-safe Contract v1（`wechat-safe-contract-v1`）为后续 Copy HTML 约束依据 | 已确认 |
| DECISION-090 | 2026-06-04 | Contract v1 代码化：`src/core/wechat-compat` 为默认 `WECHAT_MP_COMPATIBILITY_PROFILE` | 已确认 |
| DECISION-091 | 2026-06-04 | Copy-safe Pattern Library v0.1（文档）；Drift triage；006C/007/S9 路由；本轮不改 Contract/Renderer | 已确认 |
| DECISION-092 | 2026-06-05 | Style Management System v0 独立为 Sprint 9；主项目内 file-backed 子系统；采集入库仅为入口之一 | 已确认 |

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

### DECISION-054 详情（Sprint 2 正式关闭）

- **背景：** S2-STORY-002~007 全部完成；contract audit grade **A**（P0=0，P1=1，P2=3）；code audit grade **A**（P0=0，P1=3，P2=5）；lint/test/build PASS
- **决策：**
  1. Sprint 2 **正式关闭**，状态 **Closed**（2026-05-31）
  2. 用户确认接受 contract audit 与 code audit 结论
  3. **`sprint/s2-article-block-schema` merge 至 `release/1`**（`--no-ff`）
  4. P1/P2 登记至 sprint-plan Sprint 2 Close Readiness；不阻塞 Sprint 3-A 启动
- **约束：** Sprint 3 从 `release/1` 切 sprint 分支（git-workflow.md）
- **关联：** S2-STORY-007、S2-CODE-AUDIT-001、`sprint2-contract-audit.md`、`sprint2-code-audit.md`
- **状态：** 已确认

### DECISION-055 详情（Sprint 3-A 正式启动）

- **背景：** Sprint 2 已关闭并 merge 至 `release/1`（DECISION-054）；Article / Block / InlineContent 代码契约已在 release/1；用户确认启动 Sprint 3-A
- **决策：**
  1. Sprint 3-A **正式启动**，状态 **In Progress**
  2. 范围：**Style System Contract & Registry Infrastructure**（Theme / Preset / VariantDefinition / Registry、StyleResolver、WeChatCompatibilityProfile、StyleValidationResult、TitleBlockLayoutCompatibility）
  3. 从 `release/1` 切出 **`sprint/s3a-style-system-infra`**
  4. Sprint 3-A Backlog 拆分为 S3A-STORY-001~007（见 `sprint-backlog.md`）
- **约束：** Sprint 3-A **不做** 33 first-wave required variants 全量 registry、Preview / Copy Renderer、AI Style Selection 生成、VisualAssetRegistry 全量 assets；工作分支从 sprint 分支切出；验收 merge 至 sprint，再 merge 至 `release/1`（须用户确认）
- **关联：** S3A-STORY-001、DECISION-040~045、style-system.md
- **状态：** 已确认

### DECISION-056 详情（StyleResolver source 语义与 S3A-STORY-002/003 merge）

- **背景：** S3A-STORY-003 实现后审查：explicit variant 不存在时若 preset default 可用，`ResolvedBlockStyle.source` 为 `preset_default`（非 `fallback`），同时仍记录 `variant_not_found` issue；S3A-STORY-002 已 merge 至 sprint 但 backlog 仍为 In Review
- **决策：**
  1. **接受**上述 source 语义：`source` 反映最终生效路径；issue 记录 explicit 失败原因，二者不冲突
  2. **S3A-STORY-002 标记 Done**（merge commit `08bc500`）
  3. **`feature/s3a-style-resolver` merge 至 `sprint/s3a-style-system-infra`**；S3A-STORY-003 标记 Done
- **约束：** 不 merge 至 `release/1` 或 `main`（须 Sprint 3-A 关闭后用户确认）
- **关联：** S3A-STORY-002、S3A-STORY-003、style-system.md
- **状态：** 已确认

### DECISION-057 详情（关闭 Sprint 3-A）

- **背景：**
  - S3A-STORY-002~006 已完成并 merge 至 `sprint/s3a-style-system-infra`
  - S3A-STORY-007 contract audit 完成（`docs/architecture/audits/sprint3a-contract-audit.md`）
  - audit 结论 **A** 级，**P0=0**，P1=4，P2=3
- **决策：**
  1. 用户确认接受 Sprint 3-A contract audit
  2. Sprint 3-A **正式关闭**
  3. `sprint/s3a-style-system-infra` **merge 至 `release/1`**
  4. P1/P2 登记至 Sprint 3-B / 4-A / 6-B，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 3-B**
- **关联：** S3A-STORY-007、`sprint3a-contract-audit.md`
- **状态：** 已确认

### DECISION-058 详情（正式启动 Sprint 3-B）

- **背景：**
  - Sprint 3-A 已关闭并 merge 至 `release/1`（DECISION-057）
  - Style System Contract & Registry Infrastructure 已完成
  - 用户确认启动 Sprint 3-B
- **决策：**
  1. Sprint 3-B **正式启动**，状态 **In Progress**
  2. 范围：**First-wave Required Variant Registry**（11 block × 3 = 33 release1_required variants）
  3. 从 `release/1` 创建 **`sprint/s3b-first-wave-variant-registry`**
  4. **P1-S3A-001** / **P2-S3A-002** 必须在 Sprint 3-B 前置处理（S3B-STORY-002）
  5. Sprint 3-B **不做** Preview / Copy Renderer / Paste QA / AI Style Selection / VisualAssetRegistry 全量 / StyleOrchestrator
  6. **不 merge 至 `main`**；Sprint 关闭后 merge 至 `release/1` 须用户确认
- **关联：** S3B-STORY-001、DECISION-043~045、style-system.md、TECH-ARCH-018
- **状态：** 已确认

### DECISION-059 详情（关闭 Sprint 3-B）

- **日期：** 2026-06-01
- **背景：**
  - S3B-STORY-001~006 已完成并 merge 至 `sprint/s3b-first-wave-variant-registry`
  - S3B-STORY-007 contract audit 已完成（`docs/architecture/audits/sprint3b-contract-audit.md`）
  - audit 结论 **A** 级，**P0=0**，P1=5，P2=3
  - first-wave 33 variants coverage 完整（11 block × 3）
- **决策：**
  1. 用户确认接受 Sprint 3-B contract audit
  2. Sprint 3-B **正式关闭**
  3. `sprint/s3b-first-wave-variant-registry` **merge 至 `release/1`**
  4. P1/P2 登记至 Sprint 4-A / 4-B / 6-B / Release 2，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 4-A**
- **关联：** S3B-STORY-007、`sprint3b-contract-audit.md`
- **状态：** 已确认

### DECISION-060 详情（正式启动 Sprint 4-A）

- **日期：** 2026-06-01
- **背景：**
  - Sprint 3-B 已关闭并 merge 至 `release/1`（DECISION-059）
  - First-wave 33 variants registry 已完成（11 block × 3）
  - 用户确认启动 Sprint 4-A
- **决策：**
  1. Sprint 4-A **正式启动**，状态 **In Progress**
  2. 范围：**Preview / Copy Renderer for Text-first Blocks**（title / lead / heading / paragraph / divider）
  3. 从 `release/1` 创建 **`sprint/s4a-text-first-renderer`**
  4. 使用 Sprint 3-B 已完成的 first-wave required variants
  5. 建立 Preview / Copy 成对 Renderer 实现边界；启动最小 Paste QA seed
  6. Sprint 4-A **不做：** structured blocks（list / quote / highlight / info_card / cta / image_placeholder）、AI Style Selection、Generation / Streaming、完整 33 variants Paste QA、VisualAssetRegistry 全量 assets、StyleOrchestrator
  7. **Sprint 3-C 未取消**，仅延后；建议在 Sprint 5 前或 Sprint 4-A/4-B 后再启动
  8. **不 merge 至 `main`**；Sprint 关闭后 merge 至 `release/1` 须用户确认
- **关联：** S4A-STORY-001、DECISION-043~045、rendering-pipeline.md、TECH-ARCH-021、TECH-ARCH-023
- **状态：** 已确认

### DECISION-061 详情（关闭 Sprint 4-A）

- **日期：** 2026-06-01
- **背景：**
  - S4A-STORY-001~007 全部完成
  - Sprint 4-A Renderer Contract Audit 完成
  - audit 结论 Grade A，P0=0，P1=4，P2=1
  - `corepack pnpm lint` / `test`（378 tests）/ `build` PASS
- **决策：**
  1. 用户接受 Sprint 4-A audit 结论
  2. Sprint 4-A **正式关闭**
  3. `sprint/s4a-text-first-renderer` **merge 至 `release/1`**
  4. P1/P2 登记至 Sprint 4-B / 6-A / 6-B / Release 2，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 4-B**
- **关联：** S4A-STORY-007、`sprint4a-renderer-contract-audit.md`
- **状态：** 已确认

### DECISION-062 详情（正式启动 Sprint 4-B）

- **日期：** 2026-06-01
- **背景：**
  - Sprint 4-A 已关闭并 merge 至 `release/1`（DECISION-061）
  - text-first Preview / Copy Renderer 最小闭环已完成
  - 用户确认启动 Sprint 4-B
- **决策：**
  1. Sprint 4-B **正式启动**，状态 **In Progress**
  2. 从 `release/1` 创建 **`sprint/s4b-structured-block-renderer`**
  3. 范围：**Preview / Copy Renderer for Structured Blocks**
  4. 覆盖 block：**list / quote / highlight / info_card / cta / image_placeholder**
  5. 使用 Sprint 3-B **first-wave required variants**
  6. Sprint 4-B **不做：** AI Style Selection、Generation / Streaming、VisualAssetRegistry 全量 assets、StyleOrchestrator、真实微信公众号 Paste QA 全量执行
  7. **cta / image_placeholder** 在本 Sprint 仅实现 Release 1 **占位契约**渲染；不实现真实二维码生成、真实链接按钮、小程序卡片、图片上传或图片托管
  8. **不 merge 至 `main`**
  9. Sprint 关闭后 merge 至 `release/1` 须用户确认
- **关联：** S4B-STORY-001、DECISION-043~045、rendering-pipeline.md、TECH-ARCH-021、TECH-ARCH-023
- **状态：** 已确认

### DECISION-063 详情（关闭 Sprint 4-B）

- **日期：** 2026-06-01
- **背景：**
  - S4B-STORY-001~007 全部完成
  - Sprint 4-B Renderer Contract Audit 完成
  - audit 结论 Grade A，P0=0，P1=4，P2=2
  - `corepack pnpm lint` / `test`（491 tests）/ `build` PASS
  - structured blocks Preview / Copy Renderer 最小闭环完成
  - structured snapshot seed 覆盖 18 variants
  - first-wave 33 variants Paste QA plan 已建立
  - 真实微信公众号 Paste QA 仍为 Not Run，归 Sprint 6-B
- **决策：**
  1. 用户接受 Sprint 4-B audit 结论
  2. Sprint 4-B **正式关闭**
  3. `sprint/s4b-structured-block-renderer` **merge 至 `release/1`**
  4. P1/P2 登记至 Sprint 6-A / 6-B / Release 2+，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 5 / Sprint 3-C / Sprint 6-A**
- **关联：** S4B-STORY-007、`sprint4b-renderer-contract-audit.md`、TECH-ARCH-021、TECH-ARCH-022、TECH-ARCH-023
- **状态：** 已确认

### DECISION-064 详情（正式启动 Sprint 3-C）

- **日期：** 2026-06-01
- **背景：**
  - Sprint 3-A / 3-B 已 Closed 并 merge 至 `release/1`（DECISION-057、DECISION-059）
  - Sprint 4-A / 4-B 已 Closed 并 merge 至 `release/1`（DECISION-061、DECISION-063）
  - first-wave 33 variants registry 与 Preview / Copy Renderer 最小闭环已完成
  - Sprint 3-C 原定于 Sprint 4 后启动（DECISION-060）；用户确认现启动 Sprint 3-C
  - P1-003 StyleOrchestrator 未实现；TECH-ARCH-010~012 / TECH-ARCH-017 待 Sprint 3-C 交付
- **决策：**
  1. Sprint 3-C **正式启动**，状态 **In Progress**
  2. 从 `release/1` 创建 **`sprint/s3c-style-assignment-validation`**
  3. 范围：**Style Assignment / Style Selection validation 闭环** + StyleOrchestrator 最小规则 R1/R2/R8 + VisualAssetRegistry 最小 15~30 assets + validation pipeline + expansion variants **规划**（非 registry 全量实现）
  4. Sprint 3-C **不做：** Preview / Copy Renderer 新实现、Generation / Streaming、AI 样式建议生成、真实 Paste QA、Style Gallery / 业务 UI、expansion registry 全量实现
  5. Sprint 5 须复用 Sprint 3-C validation pipeline；不得绕过 Style System
  6. **不 merge 至 `main`**；Sprint 关闭后 merge 至 `release/1` 须用户确认
  7. **不自动启动 Sprint 5 / Sprint 6-A**
- **Story 拆分：** S3C-STORY-001~006（见 `sprint-backlog.md`）
- **关联：** S3C-STORY-001、TECH-ARCH-010~012、TECH-ARCH-017、TECH-ARCH-020、style-system.md §11.7~11.8
- **状态：** 已确认

### DECISION-065 详情（关闭 Sprint 3-C）

- **日期：** 2026-06-01
- **背景：**
  - S3C-STORY-001~006 全部完成
  - Sprint 3-C Style System Contract Audit 完成（`sprint3c-style-system-contract-audit.md`）
  - audit 结论 Grade A，P0=0，P1=5，P2=4
  - `corepack pnpm lint` / `test`（592 tests）/ `build` PASS
  - Style Assignment Contract、StyleOrchestrator R1/R2/R8、VisualAssetRegistry（19 assets）、Validation Pipeline + fixtures 完成
  - expansion variants 规划已输出（不实现 registry）
- **决策：**
  1. 用户接受 Sprint 3-C contract audit 结论
  2. Sprint 3-C **正式关闭**
  3. `sprint/s3c-style-assignment-validation` **merge 至 `release/1`**
  4. P1/P2（P1-S3C-001~005 等）登记后续 Sprint，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 5 / Sprint 6-A**
  7. Sprint 5 启动前须复用 `validateStyleSelectionPipeline`；须用户确认
- **关联：** S3C-STORY-006、`sprint3c-style-system-contract-audit.md`、TECH-ARCH-010~012、TECH-ARCH-017、DECISION-064
- **状态：** 已确认

### DECISION-066 详情（Sprint 5 计划变更）

- **日期：** 2026-06-02
- **背景：**
  - Release 1 目标要求跑通正式主链路：输入 → 生成 → 预览 → 复制
  - Sprint 4-A / 4-B 已完成 Preview / Copy Renderer，但明确未做业务页面
  - Sprint 3-C 已完成 Style Assignment validation，可供 Sprint 5 复用
  - 原 Sprint 5 规划偏向 core Generation / Streaming + 受控 AI 样式选择，不足以在 Sprint 5 结束时交付 Release 1 可手动验收的主流程
- **决策：**
  1. Sprint 5 **不再只是** core generation sprint
  2. Sprint 5 **必须新增**真实 UI 主流程集成 Story（S5-STORY-006）
  3. Sprint 5 结束后必须可在**真实页面**手动跑通输入 → 生成 → 预览 → 复制
  4. UI 必须复用 Article Schema、StyleResolver、StyleSelection validation pipeline、Preview Renderer、Copy Renderer
  5. **不允许**用静态 `mockArticle` 假装主流程跑通
  6. 真实微信公众号 Paste QA 仍归 **Sprint 6-B**
- **影响范围：** `sprint-plan.md`、`sprint-backlog.md`、`product-backlog.md`（TECH-ARCH-024）、S5-STORY-001~007
- **状态：** 已确认

### DECISION-068 详情（Sprint 5 真实模型 Provider 对接）

- **日期：** 2026-06-02
- **背景：**
  - S5-STORY-003 已完成 GenerationEvent / SSE streaming runtime，但明确未调用真实模型 API
  - 用户确认 Sprint 5 关闭前必须可通过真实 API 跑通 Release 1 主流程
  - deterministic test provider 仅适用于 dev / CI fallback，不能作为 Release 1 主链路验收替代
- **决策：**
  1. Volcengine / Doubao provider 纳入 Sprint 5 P0（S5-STORY-005）
  2. 优先参照旧一键成稿项目火山模型对接经验（DECISION-009：经验来源，非代码来源）
  3. deterministic provider 仅作为 dev fallback / test provider
  4. 真实 API 输出必须进入 GenerationEvent / `done.article` / Article Schema 校验链路
  5. 不允许模型输出绕过 Style System / Renderer / Copy pipeline
  6. API key / endpoint / model name 必须走环境变量，不得硬编码
- **影响范围：** `sprint-plan.md`、`sprint-backlog.md`、`product-backlog.md`（TECH-ARCH-024、TECH-ARCH-025）、S5-STORY-005~008
- **状态：** 已确认

### DECISION-069 详情（关闭 Sprint 5）

- **日期：** 2026-06-02
- **背景：**
  - S5-STORY-001~008 全部 Done
  - Sprint 5 Main Flow Close Readiness Audit 完成（`sprint5-main-flow-close-readiness-audit.md`）
  - audit 结论 Grade A-，P0=0，P1=4，P2=3
  - `corepack pnpm lint` / `test`（743 tests）/ `build` / e2e（3 tests）PASS
  - `/generate` 主链路（输入 → 真实模型生成 → 预览 → 复制）已在真实页面跑通
  - 真实 Volcengine provider dev smoke PASSED（S5-STORY-005A / 005B）
  - **Paste QA 未执行**（归 Sprint 6-B）；**不宣称** Release 1 完成
- **决策：**
  1. 用户接受 Sprint 5 close readiness audit 结论
  2. Sprint 5 **正式关闭**
  3. `sprint/s5-generation-ui-main-flow` **merge 至 `release/1`**
  4. P1/P2 登记后续 Sprint（Sprint 6-A / 6-B），不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不自动启动 Sprint 6-A / 6-B**
  7. Sprint 6 启动前须用户确认
- **关联：** S5-STORY-008、`sprint5-main-flow-close-readiness-audit.md`、TECH-ARCH-024、TECH-ARCH-025、DECISION-066、DECISION-068
- **状态：** 已确认

### DECISION-070 详情（Release 1 尾声方案 B 重排）

- **日期：** 2026-06-02
- **背景：**
  - Sprint 5 已关闭（DECISION-069）：Generation / Streaming 技术框架、Volcengine provider、`/generate` 初版主链路已 merge `release/1`
  - 用户反馈：Sprint 5 关闭后，**仍难以从 Release 1 验收角度**确认「用户能手动看到完整页面并完成主链路」
  - 原 Release 1 尾声计划偏向 **Sprint 6-A Fixture Triple + Sprint 6-B Paste QA**（DECISION-045），用户体验验收偏晚
  - Release 1 **不应**仅以 lint / test / build / renderer snapshot 关闭
- **决策：**
  1. Release 1 后续从「纯技术收口」调整为 **用户可见主链路收口（方案 B）**
  2. Release 1 剩余阶段拆为 **3 个 Sprint**：
     - **Sprint 6：Visible Main Flow** — 输入 → 生成过程 → 完整预览 → 复制；可先 mock/fixture
     - **Sprint 7：WeChat Article Experience & Style Richness** — Gallery、样式丰富度、整篇观感、过度卡片化修正
     - **Sprint 8：Copy Fidelity & Release 1 Closure** — Preview/Copy 一致性、135 + 公众号 Paste QA、Release 1 关闭准备
  3. **Sprint 6 为下一步最高优先级**；Sprint 7/8 Planned · 未启动
  4. **约束：** 后续每个 Sprint 必须至少交付 **一个可手测页面或可视化评审入口**
  5. Release 1 关闭标准见 [`release-plan.md`](release-plan.md)；**不自动 merge `main`**
  6. 原 Sprint 6-A/B 在 Release 1 **剩余阶段**由方案 B 取代（Fixture / Paste 能力分 Sprint 6/7/8 交付）
- **影响范围：** `release-plan.md`、`product-backlog.md`、`sprint-plan.md`、`sprint-backlog.md`、`user-story-map.md`、TECH-ARCH-022~026
- **关联：** DECISION-045（历史）、DECISION-069、S5-STORY-008
- **状态：** 已确认

### DECISION-071 详情（正式启动 Sprint 6 · Visible AI Main Flow）

- **日期：** 2026-06-02
- **背景：**
  - Story 5 已关闭（DECISION-069）；Sprint 5 交付 Generation 技术框架与 `/generate` 初版
  - Release 1 尾声已按方案 B 重排（DECISION-070），但 Sprint 6 尚未按敏捷 Sprint Planning 从 Product Backlog 选取 Story 正式启动
  - 建立敏捷项目管理和文档体系的目的，是增加确定性，避免 AI 对话想到哪做到哪
- **决策：**
  1. Sprint 6 按敏捷 Sprint Planning 方式开启，从 Product Backlog 中选择能够完成**用户侧最小闭环**的 Story 放入 Sprint Backlog
  2. Sprint 6 名称：**Release 1 Visible AI Main Flow**
  3. Sprint 6 分支：`sprint/s6-visible-ai-main-flow`（从 `release/1` 切出）
  4. Sprint 6 目标：首页输入 → **真实 AI** 生成 → 预览带样式公众号文章 → 基础生成反馈 → 风格 / 配色切换 → 复制到公众号编辑器
  5. Product Backlog **PB-R1-01 ~ PB-R1-08** 为 Sprint 6 主要范围来源；committed stories：**S6-STORY-001 ~ S6-STORY-006**
  6. Sprint 6 **不是** mock-only 主流程，**不是**纯技术 demo
- **约束：**
  - Sprint 6 的 Story 必须关联 Product Backlog item 与 User Story Map 阶段
  - Sprint 6 不做：完整富文本编辑器、样式市场、图片生成、用户登录、历史文章管理等 Release 1 之外能力
  - 每个后续 Story 启动前，须先确认其在 Sprint Backlog 中的状态与对应用户价值
  - **不关闭 Sprint 6**（本轮）；**不 merge `main` / `release/1`**（本轮）；**不启动 S6-STORY-002**（本轮）
- **影响范围：** `product-backlog.md`、`sprint-backlog.md`、`sprint-plan.md`、`release-plan.md`、`user-story-map.md`、`changelog.md`
- **关联：** DECISION-070、DECISION-069、S6-STORY-001、PB-R1-01~08
- **状态：** 已确认

### DECISION-072 详情（Sprint 6 首页 → 预览真实 AI 主流程）

- **日期：** 2026-06-02
- **背景：**
  - S6-STORY-002~004 需一次性打通用户可见主链路
  - Sprint 5 `/generate` 在缺少 API key 时会静默 fallback 到 deterministic provider，不符合 Sprint 6「真实 AI 用户主流程」验收
- **决策：**
  1. 用户主流程页面：**首页 `/`** → **预览 `/preview`**
  2. 预览页调用 `POST /api/generate` 时传 `requireRealProvider: true`
  3. 未配置 Volcengine 时返回 `provider_config`（HTTP 503），前端展示明确错误，**不**展示 mock 文章
  4. `/generate` 保留为开发者 harness，可不传 `requireRealProvider`（deterministic 仍可用于 CI / 单测）
  5. 复用 `runGenerateMainFlow`、Volcengine provider、Preview Renderer；增强 `model-prompt` 约束公众号长文结构
- **影响范围：** `src/app/`、`src/lib/home-input.ts`、`src/server/generation/`、`src/app/api/generate/`
- **关联：** S6-STORY-002~004、DECISION-071、PB-R1-01~04
- **状态：** 已确认

### DECISION-075 详情（Sprint 6 UX Shell 对齐 miaopian-demo · batch 主路径）

- **日期：** 2026-06-02
- **背景：**
  - 用户反馈 Sprint 6 首页 / 预览页 UI 过于简陋，难以对外演示
  - `miaopian-demo`（秒篇成稿）Landing 的信息架构与视觉密度已验证可用
  - S6-STORY-005 真实 SSE 流式方案复杂度高，影响主路径稳定性；需先 stabilise batch 主路径 + 复制
- **决策：**
  1. **UX 参考标准**：`miaopian-demo` Landing（信息架构、视觉密度、输入卡片、渐变 CTA）；**不复制旧项目代码**（DECISION-009）
  2. **范围**：`/` 与 `/preview` UI Shell；**不动 Article Schema**
  3. **主路径**：预览页使用 `POST /api/generate` batch generate（`requireRealProvider: true`）；SSE stream 不作为 Sprint 6 用户主路径阻塞项
  4. **复制**：预览页提供「复制到公众号」按钮，payload 来自 Copy Renderer（`text/html` + `text/plain`）
  5. **工作分支**：`feature/s6-ux-shell-miaopian-reference`（从 `sprint/s6-visible-ai-main-flow`）
- **影响范围：** `src/app/home-page-client.tsx`、`src/app/preview/preview-page-client.tsx`、`src/components/ui-shell/`、`src/lib/copy-clipboard-payload.ts`
- **关联：** DECISION-070、DECISION-072、S6-STORY-006（复制部分提前）、miaopian-demo UX 参考
- **状态：** 已确认 · **用户验收通过**（2026-06-02；S6-STORY-006A Done）

### DECISION-076 详情（S6-STORY-005 客户端打字机 · batch 主路径）

- **日期：** 2026-06-02
- **背景：**
  - S6-STORY-005 要求轻量打字机/分块渐显，且 AC-5 排除完整 block-aware token streaming
  - DECISION-075 已确认 batch `POST /api/generate` 为用户主路径
  - `miaopian-demo` 的 block-aware SSE 为真实流式方案；其 **LandingStreamAnalysisPanel / GeneratingStatus** UX 可借鉴
  - `miaopian-demo` 前端假 typewriter 分支 PO 未通过；本项目采用 **batch 完成后客户端 reveal**
- **决策：**
  1. 保持 batch generate；生成中展示 miaopian 风格 **成稿分析步骤** + **生成状态条**
  2. API 返回后进入 **revealing** 阶段：block 逐段出现 + 文本 block 字符打字机 + streaming caret
  3. revealing 完成后进入 **ready**，启用复制
  4. 不引入 `/api/generate/stream` 作为 Sprint 6 Story 005 验收路径
- **关联：** S6-STORY-005、DECISION-075、miaopian-demo UX 参考
- **状态：** 已废弃（由 DECISION-077 取代）

### DECISION-077 详情（S6-STORY-005 真实 SSE block-aware stream · 即时预览 UI）

- **日期：** 2026-06-02
- **背景：**
  - miaopian-demo 建议：第一时间显示生成界面、真实 SSE block-aware stream、页面跟随滚动、统一 Preview Renderer
  - DECISION-076 客户端假打字机已废弃
  - stash 中 `feature/s6-real-sse-block-aware-stream` 已实现 Volcengine JSONL → GenerationEvent → SSE 主链路
- **决策：**
  1. 预览主路径改为 `POST /api/generate/stream`（SSE）
  2. 扩展 GenerationEvent：保留 `block.start/delta/complete`；新增 `phase`（planning/writing/styling/finalizing）
  3. 点击生成后立即进入 connecting/planning UI：分析面板 + 文章容器占位 + 预览 scroll 区
  4. 流式 block 经 `renderStreamingPreviewBlocks` + `generateDeterministicStyleSelection` 走 **同一 Preview Renderer 与 Style 控件样式**；终态 `flow.complete` 交付 copy payload
  5. 自动滚动跟随当前 block；用户上滑暂停；「回到当前位置」恢复
  6. batch `/api/generate` 保留；**禁止**客户端 batch 后假打字机作为主方案
- **架构边界（未破坏）：** 单一 Article Schema 终态；无平行 streamArticle；Preview/Copy 共享 Style + Renderer 体系
- **关联：** S6-STORY-005、DECISION-075、miaopian-demo UX 参考
- **状态：** 已确认 · **用户验收通过**（2026-06-02；S6-STORY-005 Done）

### DECISION-078 详情（关闭 Sprint 6）

- **日期：** 2026-06-02
- **背景：**
  - S6-STORY-001~006 + S6-STORY-006A 全部 Done
  - Sprint 6 Close Readiness Audit 完成（`sprint6-visible-ai-main-flow-close-readiness-audit.md`）
  - Audit Grade **A-**，P0=0，P1=5，P2=4
  - 用户确认关闭 Sprint 6（承接「按方案做 Sprint 7 启动」指令）
  - PB-R1-01~08 Sprint 6 范围已交付；Sprint 8 全量 Paste QA **未**完成
- **决策：**
  1. 用户接受 Sprint 6 close readiness audit 结论
  2. Sprint 6 **正式关闭**
  3. `sprint/s6-visible-ai-main-flow` **merge 至 `release/1`**
  4. P1/P2 登记 Sprint 7 / Sprint 8，不阻塞关闭
  5. **不 merge 至 `main`**
  6. **不关闭 Release 1**
  7. 下一步启动 Sprint 7（DECISION-079）
- **关联：** S6-STORY-001~006、DECISION-071、DECISION-070、`sprint6-visible-ai-main-flow-close-readiness-audit.md`
- **状态：** 已确认

### DECISION-079 详情（正式启动 Sprint 7 · miaopian 协作与体验对齐）

- **日期：** 2026-06-02
- **背景：**
  - Sprint 6 已关闭（DECISION-078）
  - 用户希望工作方式向 miaopian-demo 靠拢，聚焦：**协作方式（4）· 交互流（1）· 成稿样式/Gallery（2）**
  - DECISION-070 已将样式 richness / Gallery 规划为 Sprint 7
  - 交互流主能力已在 Sprint 6 交付；协作方式需文档化 adopt / 不 adopt 边界
- **决策：**
  1. 从 `release/1` 创建 **`sprint/s7-wechat-article-experience`**
  2. Sprint 7 名称不变：**WeChat Article Experience & Style Richness**
  3. **S7-STORY-001** 扩展为：Sprint 7 启动 + [`s7-workflow-and-ux-gap.md`](miaopian-alignment/s7-workflow-and-ux-gap.md) + 体验目标对齐
  4. **成稿样式 / Style Gallery（2）** → S7-STORY-002~006（不变）
  5. **交互流（1）** 无 P0 gap；仅保留 optional polish backlog，不单独开 Sprint
  6. **协作方式（4）** 写入 alignment 文档；延续 execution report + 单 Story 分支，**不**复制 demo 代码
  7. Sprint 8 Paste QA / Release 1 关闭 **不在 Sprint 7 启动**
- **影响范围：** `sprint-backlog.md`、`sprint-plan.md`、`release-plan.md`、`product-backlog.md`、`changelog.md`
- **关联：** DECISION-070、DECISION-078、DECISION-075、DECISION-077、TECH-ARCH-023
- **状态：** 已确认

### DECISION-080 详情（暂停 Sprint 7 · Visible-first Cursor 轮次规则）

- **日期：** 2026-06-02
- **背景：**
  - Sprint 7 已启动（DECISION-079），但用户反馈 Cursor 轮次「文档 / 全量测试多、可见页面进展少」，与 miaopian-demo「Landing 即产品展台」体验差距大
  - 用户主路径已是 `/` → `/preview`（DECISION-075 / DECISION-077）；`/generate` 仍易让人误以为仍在 dev 页打转
  - S7-STORY-003 Style Gallery 可 partial pull-forward 为最小 fixture Preview 展台，无需等 Sprint 7 全套
- **决策：**
  1. **暂停 Sprint 7 功能 Story 线**（S7-STORY-002~007 暂缓；S7-STORY-001 保持 In Review）
  2. 开 **Chore 小目标**（不必称 Sprint 7 继续推进）：
     - **CHORE-VIS-001**（P2）：删除 `/generate` 页面与 batch `POST /api/generate`；主路径 `/` · `/preview` · `/gallery` + SSE stream
     - **CHORE-VIS-002**（P1）：`/gallery` fixture 驱动 Preview 展台（S7-STORY-003 最小版；不调用 AI）
  3. **Visible-first Cursor 轮次规则：**
     - 每轮优先交付**肉眼可见**的页面 / Renderer / Style 进展（Gallery、Preview、Copy 可视差异）
     - **禁止**每轮默认跑全量自动化测试（`npm test` / 全 e2e）；仅跑与改动相关的 targeted test + `pnpm build`（或 lint）
     - 全量测试保留给：Sprint close readiness、merge 至 `release/1` 前、用户明确要求
     - execution report 仍必填，但应突出「本轮肉眼可见变化」与 Gallery 验收路径
  4. Sprint 7 分支 **`sprint/s7-wechat-article-experience` 保留**；Chore 从 sprint 分支切 `chore/visible-progress-gallery-legacy`
- **影响范围：** `sprint-backlog.md`、`sprint-plan.md`、`release-plan.md`、`changelog.md`、导航与 `/gallery` 页面
- **关联：** DECISION-079、S7-STORY-003（最小版 pull-forward）、miaopian alignment
- **状态：** 已确认

### DECISION-081 详情（恢复 Sprint 7 · S7-STORY-002 八套文章 fixture）

- **日期：** 2026-06-02
- **背景：**
  - CHORE-VIS-001/002 已完成（DECISION-080）；用户验收 `/gallery` 与 legacy 路径清理
  - 原 S7-STORY-002 仅规划 2–3 套样例；用户确认扩至 **8 套**常见公众号文章类型
  - 8 套 fixture 是 Gallery 评审、S7-STORY-004~006 样式改动与 Sprint 8 Paste 基线的共同数据层
- **决策：**
  1. **恢复 Sprint 7 功能线**（Paused → In Progress）
  2. S7-STORY-001 标 **Done**；启动 **S7-STORY-002**（`feature/s7-article-fixture-samples`）
  3. S7-STORY-002 交付 **8 套**完整 Article fixture（见 sprint-backlog 类型表）+ `/gallery` 接入
  4. 继续遵守 DECISION-080 visible-first 验证规则（targeted test + build）
  5. 不启动 Sprint 8；不关闭 Release 1
- **影响范围：** `src/fixtures/article-samples/`、`/gallery`、sprint-backlog、execution report
- **关联：** DECISION-079、DECISION-080、TECH-ARCH-023、S7-STORY-003
- **状态：** 已确认

### DECISION-083 详情（miaopian 风格体系对齐 · variant 扩展）

- **日期：** 2026-06-02
- **背景：** PO 要求基础风格/配色与 miaopian-demo 一致；heading +4；其它 block 各 +6 variant；Gallery 全 block 可选手动 variant；风格应与默认配色及 variant 矩阵联动。
- **决策：**
  1. **正式 preset id：** `business` / `warm` / `magazine` / `keynote` / `xiaohongshu` / `dedao`（替换 `classic-news` 等旧 id；UI/生成 hint 保留 alias 过渡期）
  2. **正式 theme id：** `businessBlue` / `premiumBlackGold` / `creamOrange` / `techGrayBlue` / `knowledgePurple` / `healthGreen`
  3. **`PresetDefinition` 扩展：** `variantPoolsByBlockType`、`recommendedThemeIds`；默认配色见 `DEFAULT_THEME_FOR_PRESET`（[`src/config/miaopian-preset-bundles.ts`](../../src/config/miaopian-preset-bundles.ts)）
  4. **Variant 总量：** title×3 · heading×7 · 其它 9 类各×9 → **91** `release1_required`（超出原 11×3 first-wave；Paste QA 在 Sprint 8 按 preset 代表组合抽样）
  5. **title** 不扩至 12 个 miaopian titleBlock id；由 preset `defaultVariantByBlockType` + `variantPools` 表达差异
  6. **不复制** miaopian-demo 代码（DECISION-009）；单一 StyleRegistry + Renderer（DECISION-025）
- **影响范围：** `src/config/miaopian-preset-bundles.ts`、`preview-style-controls`、`preview-color-palette`、`variants/*`、`/gallery`、`style-selection-prompt`
- **关联：** DECISION-082、S7-STORY-003、S7-STORY-005
- **状态：** 已确认

### DECISION-084 详情（S7 文章级卡片节奏 · 过度卡片化修正）

- **日期：** 2026-06-02
- **背景：** DECISION-083 将各 block variant 扩至 9 个后，生成与 orchestrator 易连续选用 `*_card` / `info_card`，整篇观感偏 demo 卡片墙，不符合 US-R1-013「像公众号文章」。
- **决策：**
  1. **Orchestrator R4（实现）：** title/heading 上 `iconDecor` / `cardTitle` family 连续不超过 **2** 次，超出 fallback 至非 decor variant（如 `heading_numbered_section`）
  2. **Orchestrator RCARD（S7 扩展）：** 正文块（含 `info_card`）卡片化强调连续不超过 **2** 次，超出 fallback 至各类 plain variant（`paragraph_plain_body` 等）
  3. **生成路径：** `ARTICLE_VARIANT_ROTATION` 改为 plain-first；medium 密度下 card-prone 类型 index>0 强制 plain；`balanceCardEmphasisInBlockHints` 在 orchestrator 前对齐 hints
  4. **warm preset 默认：** 减少默认 `paragraph_soft_card` / `quote_soft_card` 叠卡
  5. **R1 仍禁用**（同篇 heading 统一 · DECISION-083）
- **影响范围：** `card-rhythm.ts`、`style-orchestrator-rules.ts`、`style-selection-diversity.ts`、`style-selection-card-rhythm.ts`、`miaopian-preset-bundles.ts`
- **关联：** S7-STORY-006、DECISION-083
- **状态：** 已确认（PO 签收 2026-06-02 · S7-STORY-006 Done）

### DECISION-082 详情（合并 S7-STORY-003 与 S7-STORY-004）

- **日期：** 2026-06-02
- **背景：**
  - 原 S7-STORY-003（Style Gallery UX）与 S7-STORY-004（title/heading variant 丰富度）共享同一验收入口（`/gallery` + 8 套 fixture）
  - 单独交付 Gallery 无 title/heading 视觉改进时仍显「全都一样」；单独交付 variant 丰富度无 Gallery 对照 UI 时 PO 难以系统验收
  - 符合 DECISION-080 visible-first 与 TECH-ARCH-023 Style Quality Gate
- **决策：**
  1. **扩写 S7-STORY-003** 为合并版：Gallery Copy 对照区 + title/heading 聚焦模式 + variant 切换 + 6 个 first-wave title/heading variant 视觉 polish + 8 套样例 assignment
  2. **S7-STORY-004 标 Merged → S7-STORY-003**；不再单独开 `feature/s7-heading-variant-richness`
  3. **S7-STORY-005~007 编号不变**
  4. 工作分支：`feature/s7-gallery-heading-variants`（从 `sprint/s7-wechat-article-experience` 切出）
  5. 分批交付：Batch A（Gallery Copy + 聚焦 + 2 套样例视觉差）→ Batch B（6 variant polish + 8 套 assignment + 单测）
- **影响范围：** `/gallery`、`preview-visual-styles.ts`、copy title/heading、`gallery-title-heading.ts`、sprint-backlog、alignment
- **关联：** DECISION-080、DECISION-081、TECH-ARCH-023、S7-STORY-002
- **状态：** 已确认

### DECISION-086 详情（R1 默认 preset id · business vs classic-news）

- **日期：** 2026-06-02
- **背景：** 架构文档仍写 `classic-news` 为默认 preset，而 DECISION-083 后代码、生成、`SAFE_STYLE_PRESET_ID`、golden fixture 均使用 **`business`**；分裂会导致粘贴 QA 与 PO 验收锚点不一致。
- **决策：**
  1. **Release 1 / Sprint 7 默认成稿 canonical preset id = `business`**（theme 默认 `businessBlue`）
  2. **`classic-news`、`classic`、`business-pro`、`news` 等** 仅作为 **legacy alias**（`LEGACY_PRESET_ID_ALIASES` → `business`），不单独维护第二套默认 variant
  3. **Golden fixtures**（`r1-golden-*`）、`/dev/style-fidelity`、空表单生成 fallback、streaming preview 空 style 均对齐 **`business`**
  4. 架构文档中 `classic-news` 表述逐步改为「legacy 名 / 等价 business」；**不**恢复独立 `classic-news` preset 定义
- **影响范围：** `miaopian-preset-bundles.ts`、`style-selection-prompt.ts`、`r1-golden-*.json`、`r1-style-quality-baseline.md`、paste-qa
- **关联：** DECISION-083、DECISION-085、S7-STORY-007B
- **状态：** 已确认

### DECISION-085 详情（S7-STORY-007A · R1 Style Fidelity Stabilization）

- **日期：** 2026-06-02
- **背景：**
  - 默认成稿 Preview、Copy 到公众号、整篇编排未达预期；继续加 variant 或局部微调无法收敛
  - 用户明确 **不做 S7-STORY-007**，改 **S7-STORY-007A**：审计先行 → golden baseline → 默认路径闭环
- **决策：**
  1. **S7-STORY-007 Deferred**；**S7-STORY-007A** 为 Sprint 7 当前主线的样式保真任务（`feature/s7-story-007a-r1-style-fidelity`）
  2. **不新增 variant 数量**；只修默认 `business` preset 实际使用的核心 variant + Copy 微信安全输出
  3. **Golden 锚点：** `tests/fixtures/articles/r1-golden-{default,structured,longform}-article.json` + 粘贴 QA [`paste-qa/r1-golden-paste-qa.md`](paste-qa/r1-golden-paste-qa.md)
  4. **Orchestrator RLAYOUT：** 强视觉块间距、卡片比例、CTA 尾部、divider 节制等（不改 Article 语义 blocks）
  5. **Done 分轨：** 代码 + 自动化 snapshot = 可标 In Review/Done（代码）；**粘贴 QA Not Run 不得标 Story Done**
  6. **开发调试：** `/dev/style-fidelity`（非 Gallery、非样式市场）
- **影响范围：** `miaopian-preset-bundles.ts`、`miaopian-typography.ts`、`title-block-copy.ts`、`style-orchestrator-article-layout.ts`、`copy-safe-html.ts`、`/dev/style-fidelity`、golden fixtures、audit/baseline docs
- **关联：** DECISION-083、DECISION-084、S7-STORY-006、Sprint 8 Paste QA（全量矩阵仍归 S8）
- **状态：** 已确认（代码轮 In Review · 待 PO 粘贴 QA）

### DECISION-087 详情（Heading Publish 8 · 审美实验）

- **日期：** 2026-06-03
- **背景：** 成稿小标题观感偏素、不像可直接发的公众号小节；registry 曾扩至 13 款 heading，粘贴 QA 未闭环且 Preview/Copy 漂移风险高。
- **决策：**
  1. **仅保留 8 款** `HEADING_PUBLISH_VARIANT_IDS`（见 [`heading-publish-catalog.md`](../product/heading-publish-catalog.md)）
  2. **废弃** `heading_plain_minimal`、`heading_underline_classic`、`heading_pill_topic`、`heading_editorial_plain`、`heading_keynote_strong`（不得再进入 registry / 生成池 / Gallery）
  3. **审美优先于 variant 数量**；heading Preview 装饰必须走 `heading-publish-visual` → `copySafe*` 同源
  4. **默认 flagship：** `business` preset → `heading_short_line`；同篇 heading 仍统一 variant
  5. **验收：** catalog 审美表 + [`heading-publish-8.md`](paste-qa/heading-publish-8.md) 粘贴表；≥6/8 合格方可关 Story
  6. **收口（2026-06-03）：** 第六轮公众号粘贴 **8/8 PASS**；`heading_highlight_marker` 使用 `h3`+`linear-gradient`（`7d8e38c`）；**S7-STORY-008 Done**；8 款进入 Release 1 **heading 发布池**；`warm` preset 默认 heading 仍为 `heading_highlight_marker`
- **影响范围：** `heading-publish-pool.ts`、`heading-publish-decoration.ts`、`heading-publish-copy-html.ts`、`miaopian-preset-bundles.ts`、`/gallery`、`/preview`
- **关联：** DECISION-085、DECISION-086、S7-STORY-008、Sprint 7 关闭
- **状态：** 已确认 · **Story 已关闭（2026-06-03 用户确认）**

### DECISION-088 详情（Sprint 8 · WeChat-safe CSS Contract & Fidelity Test System）

- **日期：** 2026-06-04
- **背景：**
  - Sprint 7 已完成样式丰富度与 heading 发布池（DECISION-087）；继续单点修样式无法建立可复制的公众号兼容体系
  - DECISION-070 原将 Sprint 8 规划为「Copy Fidelity & Release 1 Closure」，范围偏关闭验收，缺少 contract、Validator、多控件 Matrix 与失真诊断闭环
  - 用户要求 S8 为 S9 文章视觉升级打地基，而非视觉美化 Sprint
- **决策：**
  1. **Sprint 8 名称与目标重定义：** WeChat-safe CSS Contract & Fidelity Test System
  2. **Sprint 分支：** `sprint/s8-wechat-safe-css-contract`（从 `release/1` 切出）
  3. **Committed stories：** S8-STORY-001 ~ S8-STORY-008（见 `sprint-backlog.md`）
  4. **S8-STORY-005 约束：** 10 类控件 × 每类 **至少 2–4 个代表性 variant**；Matrix 状态 PASS/FAIL/WARNING/UNTESTED
  5. **文档交付：** `wechat-safe-html-css-contract.md`、`copy-drift-diagnostics.md`、`wechat-editor-compatibility-reference.md`；Matrix 在 STORY-005
  6. **Release 1 关闭** 仍独立；S8 不自动 merge `main`；S8 关闭须用户确认
  7. **S7-STORY-007B** 承接至 S8 Paste / Fidelity 体系
- **Sprint 8 不做：** 大规模视觉美化、UI 改版、streaming、配图/小程序、单 heading 反复修、复杂样式进默认池、仅用自动化替代实机粘贴 QA
- **影响范围：** `sprint8-wechat-safe-css-contract.md`、`release-plan.md`、`product-backlog.md`、`sprint-backlog.md`、`docs/architecture/`、`docs/research/`
- **关联：** DECISION-070、DECISION-006、DECISION-027、S7-STORY-007B
- **状态：** 已确认 · Sprint 8 **In Progress**（**S8-STORY-001 Done** · **002 In Review**）

### DECISION-089 详情（WeChat-safe Contract v1）

- **日期：** 2026-06-04
- **背景：**
  - S8-STORY-001 完成调研框架与 contract 草案（`contract-draft-0.1`）
  - 后续 Profile、Validator、Matrix 需要 **单一、可版本化** 的 HTML/CSS/DOM 约束，避免与 Sprint 1-B `wechat-copy-style-rules.md` 种子漂移
- **决策：**
  1. 定稿 [`wechat-safe-html-css-contract.md`](../architecture/wechat-safe-html-css-contract.md) 为 **`wechat-safe-contract-v1`**
  2. **Green / Yellow / Red** 三分法适用于 **HTML 标签** 与 **CSS 属性（含值级约束）**
  3. **Yellow** 必须绑定 **waiver + evidence**；无 evidence 时 Validator **warning**（S8-STORY-004）
  4. **Red** 不得进入 Copy HTML；Validator **fail**
  5. `border-radius`、`linear-gradient`、`box-decoration-break` 等 **非全局 Green**；`linear-gradient` 仅 per-variant evidence（如 `heading_highlight_marker` / DECISION-087）
  6. **后续工程以 Contract v1 为准**；`wechat-copy-style-rules.md` §1.3 Profile 在 **S8-STORY-003** 对齐，冲突以 Contract v1 为准
  7. Contract 调整须经 **Matrix / Drift / Decision** 闭环（Contract §9）
  8. **用户确认（2026-06-04）：** `border-radius` 维持全局 **Yellow**；**Clipboard** 禁止 `class`，Preview/dev/test DOM 不限，**Copy Renderer 出口须剥离 class**；`heading_highlight_marker` 的 `linear-gradient` waiver **不得外推**至其它 variant
- **影响范围：** `wechat-safe-html-css-contract.md`、`copy-drift-diagnostics.md`、`wechat-copy-style-rules.md`（引用段）、`sprint-backlog.md`
- **关联：** DECISION-088、DECISION-087、S8-STORY-002~007
- **状态：** **已确认**（2026-06-04 · 用户确认：`border-radius` 全局 Yellow · Clipboard 禁止 class（Preview/dev/test 除外 · Copy 须剥离）· `heading_highlight_marker` gradient waiver 不得外推）

### DECISION-090 详情（Compatibility Profile 代码 · Contract v1）

- **日期：** 2026-06-04
- **决策：**
  1. 新增 `src/core/wechat-compat/` 实现 Contract v1（`WECHAT_SAFE_CONTRACT_VERSION_ID`）
  2. `WECHAT_MP_COMPATIBILITY_PROFILE` 默认 = `WECHAT_SAFE_CONTRACT_V1_PROFILE`
  3. CSS 映射：green→allowed · yellow→risky · red→forbidden；`display:flex` 等升为 forbidden
  4. `WECHAT_CONTRACT_V1_YELLOW_WAIVERS` 含 `heading_highlight_marker`（`nonTransferable: true`）
  5. `validateCss*Compatibility` 支持 `waiverContext`；值级 Green（如 `display:inline-block`）在 declaration 路径优先于 property-only unknown
  6. **S8-STORY-004（2026-06-04）：** `validateWechatCopyHtml`；`nonTransferable` waiver 须精确 `blockType`+`variantId`
  7. **S8-STORY-006（2026-06-04）：** Paste QA 以公众号后台为终态裁判；Drift 编号 `DRIFT-S8-YYYYMMDD-###`；Matrix paste 仅 PO 回填
- **关联：** DECISION-089、S8-STORY-003、S8-STORY-004、S8-STORY-005、S8-STORY-006
- **状态：** 已确认

### DECISION-091 详情（Copy-safe Pattern Library v0.1 · Drift Triage）

- **日期：** 2026-06-04
- **背景：** S8-STORY-006 第一轮 Paste QA 暴露卡片/边框/左线/标题线等共性 Drift；须在修 renderer 前完成结构化调研与归类。
- **决策：**
  1. 新增 [`wechat-copy-safe-pattern-library.md`](../architecture/wechat-copy-safe-pattern-library.md) **v0.1**（8 个 patternId；仅文档规范）
  2. 新增结构化调研 [`wechat-style-structured-research.md`](../research/wechat-style-structured-research.md) 与文章采集 [`wechat-published-article-style-harvest.md`](../research/wechat-published-article-style-harvest.md)
  3. Drift 001–009 归入 A/B/C/D/E 类（[`s8-drift-triage-2026-06-04.md`](../agile/paste-qa/drift/s8-drift-triage-2026-06-04.md)）
  4. **P0 共性修复** 进入 **S8-STORY-006C**（card · left-border · title-divider）；**HEAD-002** 观察进 **007**；**DRIFT-003** 产品澄清前不进 006C
  5. **本轮不** 修改 renderer · Contract v1 分级 · Profile · Validator · 不新增 variant · **不启动** 006C/007 实现
  6. 视觉升级与非保真装饰 **延后 S9**
  7. **006B-FIX-A（2026-06-04）：** Published article harvest 须区分 **L0 hypothesis** 与 **L1–L4 evidence**；用户仅提供 **URL** 或 **URL+HTML**，DOM/CSS/pattern 由 AI/Cursor 按 extraction guide 提取；**不** 要求用户手填摘要；**不** 虚构 URL；HARVEST-001~015 无 URL 者标 L0
- **关联：** S8-STORY-006B、S8-STORY-006B-FIX-A、S8-STORY-006C（Done）、S8-STORY-006D（Done）、DECISION-088/089/090
- **状态：** 已确认

### DECISION-092 详情（Sprint 9 · Style Management System v0 Replanning）

- **日期：** 2026-06-05
- **背景：**
  - S8-STORY-006D 完成：006C copy-safe 修复经实机验证（8/8 re-test PASS）；harvest 2/2 candidate-paste-pass
  - 「采集样式入库 / 样式管理后台」若继续塞进 S8，会污染 WeChat Fidelity Reset 收口
  - 轻篇需要可持续的样式资产治理，而非一次性 harvest 脚本
- **决策：**
  1. **Style Management System v0** 独立成为 **Sprint 9**（中文：样式管理后台 v0），**不**继续作为 S8 story 扩展
  2. **主项目内独立子系统** — 同一仓库 `qingpian-wechat-editor`；**不**新建独立仓库；**不**独立部署项目
  3. **v0 存储：** file-backed / code-backed（Git 可审查）；**不上**数据库
  4. **产品定位：** **不是**临时 dev-only 工具；是正式样式管理后台的 **v0**
  5. **管理范围：** style / style family · palette · variant · preset · copy-safe rule · style selection rule · WeChat compatibility metadata · lifecycle · QA evidence · promote · rollback
  6. **真实公众号 HTML 采集** 仅为**新增 variant 的一种方式**，不是系统全部
  7. **S8 继续收口：** 007（HEAD-002）· DRIFT-003 澄清 · 009 audit/closeout · merge S8 → `release/1`；**不**在 S8 扩展后台
  8. **006D harvest candidates**（`heading_purple_chapter_label_candidate` · `info_card_reading_path_candidate`）保持 candidate-paste-pass；作为 **S9 seed assets**；**不**在本轮直接 user-selectable / default preset
  9. **Sprint 10（初步）：** Style Expansion & Visual Quality Upgrade — 基于 S9 批量扩展样式（本轮仅记方向）
- **影响范围：** `sprint9-style-management-system-v0.md`、`sprint-plan.md`、`product-backlog.md`、`sprint-backlog.md`、`release-plan.md`、`decisions.md`
- **关联：** S8-STORY-008、S8-STORY-006D、DECISION-088、DECISION-091、WX-HARVEST-EVIDENCE-001
- **状态：** **已确认**（2026-06-05 · S8-STORY-008）

