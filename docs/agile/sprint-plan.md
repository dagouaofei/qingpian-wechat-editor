# Sprint Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Sprint 周期原则

- 后续 Sprint 可按合理工作量拆分，避免单个 Sprint 塞入过多 Release 1 范围
- Sprint 1 不受「1 人 / 1 周」约束限制，需完成必要地基（见 DECISION-011）
- 不允许把 Release 1 的全部实现范围塞进单个 Sprint
- **Sprint 2 启动前须完成 S1-STORY-021 审查及 S1-STORY-023 契约收口**（DECISION-029、DECISION-034~035）

---

## Sprint 1：正式项目启动、核心技术方案定稿与工程治理

**总目标：** 完成正式项目启动、核心技术方案定稿、Git 仓库治理。

### Sprint 1-A：项目初始化与文档骨架 — Done

- 项目工程初始化（Next.js、TypeScript、Tailwind、ESLint、Prettier、Vitest、Playwright、Zod）
- Cursor 规则体系
- docs/agile、docs/product、docs/architecture 文档骨架
- Sprint 2 候选目标沉淀
- 旧一键成稿历史经验审计与迁移清单

### Sprint 1-B：核心技术方案补齐与 Git 仓库治理 — In Review

- Git 仓库治理与分支策略
- Article / Block Schema 正式技术方案
- Style System 正式技术方案
- Preview / Copy Renderer 正式技术方案
- Copy-to-WeChat 与复制一致性正式技术方案
- Generation / Streaming 正式技术方案
- 核心技术方案一致性审查
- Release 1 整体架构定稿（S1-STORY-020）
- **实现前契约缺口修正（S1-STORY-021）** — In Review
- **Sprint 2 启动前契约收口（S1-STORY-023）** — In Review

**Sprint 1 明确不做：** 业务功能代码实现（Article Zod、Renderer、Copy Pipeline、AI 生成、SSE 实现、样式 Gallery）。

---

## S1-STORY-022 审计遗留 P1/P2 登记

> 登记于 S1-STORY-023；Sprint 1-B 仅解决 P1-001、P1-008，其余按 Sprint 分配处理。

### P1（7 项）

| ID | 问题 | 建议 Sprint | Sprint 1-B 处理 |
|----|------|-------------|-----------------|
| P1-001 | block 文本字段 `body` vs `text` 命名不一致 | Sprint 2 启动前 | **已解决**（DECISION-034） |
| P1-002 | InlineMark → copy-safe CSS 映射表缺失 | Sprint 3 / Sprint 4 | 登记 |
| P1-003 | ArticleStylePlan / orchestrator 文章级节奏未定义 | Sprint 3 | 登记 |
| P1-004 | WeChatCompatibilityProfile 无 machine-readable fixture | Sprint 3 | 登记 |
| P1-005 | list / info_card copy 结构保真规则未细化 | Sprint 4 | 登记 |
| P1-006 | Clipboard text/html + text/plain 双格式未写清 | Sprint 4 | 登记 |
| P1-007 | card 内文字 requireTextNodeTypography 细则未展开 | Sprint 4 | 登记 |
| P1-008 | rendering-pipeline.md 实现顺序与 Sprint 2~6 不一致 | Sprint 1-B | **已解决**（S1-STORY-023） |

### P2（4 项）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P2-001 | quote / highlight / cta 未升级 InlineContent | Release 2 或 Sprint 5+ |
| P2-002 | classic-news slot 无具体 SlotRenderSpec 示例 | Sprint 3 |
| P2-003 | semantic block → visual 映射表未写 | Sprint 3 |
| P2-004 | article-schema InlineContent 说明重复 | 文档小修（S1-STORY-023 已去重） |

---

## Sprint 2 ~ 6 计划（Release 1 代码实现）

> 业务功能实现必须在核心技术方案 + 实现前契约完成之后进入（DECISION-015、DECISION-029~042）。

### Sprint 2：Article / Block Schema + InlineContent 代码契约

**目标：**

- 实现 Article / Block TypeScript 类型
- 实现 Zod Schema
- 实现 InlineContent / InlineMark
- 实现基础 fixture
- 实现 schema 单元测试

**不做：** Renderer、Style System、Generation、**AI Style Selection**

**登记 P1/P2：** 无（P1-001 已在 Sprint 1-B 解决）

### Sprint 3：Style System + ComponentProtocol + Release 1 Variant Registry + AI Style Selection Validation

**目标：**

- 实现 Theme / Preset / VariantDefinition / Registry
- 实现 **11 block × 各 3~5 release1RequiredVariants** registry contract
- 实现 StyleResolver → ResolvedBlockStyle / ResolvedArticleStyle
- 实现 ComponentProtocol / BlockVisualProtocol + SlotContentBinding
- 实现 title / heading → titleBlock + **TitleBlockLayoutCompatibility**
- 实现 VisualAssetRegistry 最小 **15~30** assets
- 实现 StyleOrchestrator 最小规则（R1、R2、R8）
- 实现 **StyleSelectionRequest / StyleAssignmentPatch validation 入口**
- 实现 StyleValidationResult / FallbackVariantPolicy / schemaVersion
- 实现 WeChatCompatibilityProfile 基础校验

**不做：** 完整 Preview / Copy；Generation 侧 AI 样式建议生成（Sprint 5）

**工作量提示：** 可按 block 类型拆分子 Sprint；**不得降低** release1RequiredVariants 范围

### Sprint 4：Preview / Copy 成对闭环 + release1RequiredVariants 粘贴 QA

**目标：**

- 基于 Sprint 3 registry 实现 Preview / Copy 成对 renderer
- WeChatCompatibilityProfile + TitleBlockLayoutCompatibility
- InlineMark → 微信兼容 inline HTML
- **每个 release1RequiredVariant** 进入粘贴 QA 计划
- 启动最小人工微信公众号粘贴 QA

**登记 P1/P2：** P1-002、P1-005、P1-006、P1-007

### Sprint 5：Generation / Streaming + 受控 AI 样式选择最小闭环

**目标：**

- InputRequest / NormalizedInput、GenerationEvent、`done.article`
- **StyleSelectionRequest / StyleAssignmentPatch 生成**
- 所有样式建议必须走 Sprint 3 validation pipeline
- 禁止 streamArticle；禁止绕过 Style System

### Sprint 6：Fixture 三联 + release1RequiredVariants Paste QA 回归

**目标：**

- Article JSON fixture + Copy HTML snapshot（required variants golden）
- Paste checklist / PasteTestRecord
- **release1RequiredVariants** 全量系统化回归

---

## 原则

- 后续 Sprint 可按合理工作量继续拆分
- 不允许将 Release 1 全部实现塞进单个 Sprint
- Sprint 方向变更须记录到 `decisions.md`
