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

### Sprint 1-B：核心技术方案补齐与 Git 仓库治理 — **Closed**

- Git 仓库治理与分支策略
- Article / Block Schema 正式技术方案
- Style System 正式技术方案
- Preview / Copy Renderer 正式技术方案
- Copy-to-WeChat 与复制一致性正式技术方案
- Generation / Streaming 正式技术方案
- 核心技术方案一致性审查
- Release 1 整体架构定稿（S1-STORY-020）— **Done**
- 实现前契约缺口修正（S1-STORY-021）— **Done**
- Sprint 2 启动前契约收口（S1-STORY-023）— **Done**
- Component DSL / Style System 收口（S1-STORY-024~027）— **Done**
- Sprint 1-B 总 Audit（S1-STORY-028）— **Done**
- 关闭前状态同步与正式关闭（S1-STORY-029）— **Done**（DECISION-051）

**Sprint 1 明确不做：** 业务功能代码实现（Article Zod、Renderer、Copy Pipeline、AI 生成、SSE 实现、样式 Gallery）。

---

## Sprint 1-B Closure Summary

| 项 | 内容 |
|----|------|
| **关闭日期** | 2026-05-30 |
| **关闭结论** | Final audit **B 级**通过 |
| **P0** | 0 |
| **P1 / P2** | 已登记至后续 Sprint / Product Backlog（见下方登记表） |
| **用户确认** | Checklist #10：已确认接受 B 级 final audit；Checklist #11：已确认可以关闭 Sprint 1-B |
| **Sprint 2** | **In Review**（待用户确认关闭；2026-05-31 contract audit） |
| **Release 1 主干** | `release/1`（`sprint/s1b-core-tech-governance` 已 merge，DECISION-052） |
| **Sprint 2 分支** | `sprint/s2-article-block-schema`（从 `release/1` 切出） |
| **下一步** | S2-STORY-002：InlineContent / InlineMark 代码契约 |

---

## Sprint 1-B Close Readiness Checklist

> 登记于 S1-STORY-029；Sprint 1-B 已于 2026-05-30 正式关闭（DECISION-051）。

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | final audit 已 merge 至 `sprint/s1b-core-tech-governance`（`25b9bad`） | ✅ |
| 2 | S1-STORY-021~028 状态已同步（Done + merge 标注） | ✅ |
| 3 | P0 = 0（见 `sprint1b-final-audit.md`） | ✅ |
| 4 | P1/P2 已登记 Product Backlog 或后续 Sprint | ✅ |
| 5 | Style Quality Gate 已登记 Product Backlog（TECH-ARCH-023） | ✅ |
| 6 | Sprint 2 范围明确：Article / Block Schema + InlineContent 代码契约 | ✅ |
| 7 | Sprint 3-A/B/C、4-A/B、5、6-A/B 拆分清晰 | ✅ |
| 8 | Release 1 first wave 11×3 + expansion 策略已确认（DECISION-043） | ✅ |
| 9 | 受控 AI Style Selection 边界已确认（DECISION-040） | ✅ |
| 10 | 用户确认接受 B 级 final audit | ✅ **已确认** |
| 11 | 用户确认可以关闭 Sprint 1-B | ✅ **已确认** |

---

## S1-STORY-022 / final audit 遗留 P1/P2 登记

> 登记于 S1-STORY-023、S1-STORY-028、S1-STORY-029；Sprint 1-B 已解决 P1-001、P1-008、P1-009、P1-012。

### P1（登记项 · 见 `sprint1b-final-audit.md` §10）

| ID | 问题 | 建议 Sprint | Sprint 1-B 处理 |
|----|------|-------------|-----------------|
| P1-001 | block 文本字段 `body` vs `text` 命名不一致 | Sprint 2 启动前 | **已解决**（DECISION-034） |
| P1-002 | InlineMark → copy-safe CSS 映射表缺失 | Sprint 3 / Sprint 4 | 登记 · TECH-ARCH-002 |
| P1-003 | StyleOrchestrator 文章级节奏代码未实现 | Sprint 3-C | 登记 · TECH-ARCH-011 |
| P1-004 | WeChatCompatibilityProfile 无 machine-readable fixture | Sprint 3-A | 登记 · TECH-ARCH-005 |
| P1-005 | list / info_card copy 结构保真规则未细化 | Sprint 4-B | 登记 |
| P1-006 | Clipboard text/html + text/plain 双格式未写清 | Sprint 4 | 登记 |
| P1-007 | requireTextNodeTypography 细则未展开 | Sprint 4 | 登记 |
| P1-008 | rendering-pipeline.md 实现顺序与 Sprint 2~6 不一致 | Sprint 1-B | **已解决**（S1-STORY-023） |
| P1-009 | sprint-backlog 021~024 状态滞后 | Sprint 1-B | **已解决**（S1-STORY-029） |
| P1-010 | architecture-overview §19 仍写 S1-STORY-021 In Review | Sprint 1-B 关闭 | **已解决**（S1-STORY-029 关闭轮） |
| P1-011 | 各 variant copySafety tier 未逐项登记 | Sprint 3-B | 登记 · TECH-ARCH-018 |
| P1-012 | Style Quality Gate 未登记 product-backlog | Backlog | **已解决**（TECH-ARCH-023） |

### P2（登记项）

| ID | 问题 | 建议 Sprint / 归属 |
|----|------|-------------------|
| P2-001 | quote / highlight / cta 未升级 InlineContent | Release 2 |
| P2-002 | classic-news slot 无 SlotRenderSpec 示例 | Sprint 3-B |
| P2-003 | semantic → visual 映射表未写 | Sprint 3 |
| P2-004 | article-schema InlineContent 说明重复 | **已解决**（S1-STORY-023） |
| P2-005 | Story 018/019 编号缺口 | 文档 chore |
| P2-006 | first wave 33 variants 视觉效果可能偏保守 | TECH-ARCH-023 / Sprint 4+ |
| P2-007 | expansion variants 未拆独立 Story | Release 1 expansion planning（TECH-ARCH-019） |

---

## Sprint 2 ~ 6 计划（Release 1 代码实现）

> **Sprint 2 状态：In Review**（DECISION-053，2026-05-31；分支 `sprint/s2-article-block-schema`；contract audit 见 `docs/architecture/audits/sprint2-contract-audit.md`；**待用户确认关闭**）
>
> 业务功能实现必须在核心技术方案 + 实现前契约完成之后进入（DECISION-015、DECISION-029~045、DECISION-051）。

### Sprint 2：Article / Block Schema + InlineContent 代码契约 — **In Review**（待用户确认关闭）

**分支：** `sprint/s2-article-block-schema` · **Release 1 主干：** `release/1`

**Stories：** S2-STORY-001（启动）~ S2-STORY-007（audit）— 见 `sprint-backlog.md`

**目标：**

- 实现 Article / Block TypeScript 类型
- 实现 Zod Schema
- 实现 InlineContent / InlineMark
- 实现基础 fixture
- 实现 schema 单元测试

**不做：** Renderer、Style System、Generation、**AI Style Selection**

### Sprint 3-A：Style System Contract & Registry Infrastructure

**目标：**

- Theme / Preset / VariantDefinition / Registry **基础设施**
- StyleResolver → ResolvedBlockStyle / ResolvedArticleStyle
- WeChatCompatibilityProfile 基础校验
- StyleValidationResult / FallbackVariantPolicy / schemaVersion
- TitleBlockLayoutCompatibility 定义

**不做：** 全部 33 variants registry；Preview / Copy

### Sprint 3-B：First-wave Required Variant Registry

**目标：**

- **11 block × 3 = 33** first-wave required variants registry definitions
- title / heading titleBlock ComponentProtocol
- titleBlock first-wave variants（不含 `magazine_left_bar_title` candidate）
- SlotContentBinding 规则落地到 registry

**不做：** VisualAssetRegistry 全量；AI 样式建议生成（Sprint 5）

### Sprint 3-C：VisualAssetRegistry + AI Style Selection Validation + Orchestrator

**目标：**

- VisualAssetRegistry 最小 **15~30** assets
- StyleSelectionRequest / StyleAssignmentPatch **validation 入口**
- ComponentProtocol / BlockVisualProtocol 完整校验链
- StyleOrchestrator 最小规则 R1 / R2 / R8
- **expansion variants 规划**（不要求全部实现）

### Sprint 4-A：Preview / Copy Renderer for Text-first Blocks

**目标：**

- title / lead / heading / paragraph / divider 成对 Preview / Copy
- 使用 **first-wave** required variants
- 启动最小 Paste QA

### Sprint 4-B：Preview / Copy Renderer for Structured Blocks

**目标：**

- list / quote / highlight / info_card / cta / image_placeholder 成对 Preview / Copy
- first-wave required variants
- 完成 first-wave **33 variants** 最小 Paste QA 计划

**登记 P1/P2：** P1-002、P1-005、P1-006、P1-007

### Sprint 5：Generation / Streaming + 受控 AI 样式选择最小闭环

**目标：**

- InputRequest / NormalizedInput、GenerationEvent、`done.article`
- **StyleSelectionRequest / StyleAssignmentPatch 生成**
- 所有样式建议必须走 Sprint 3-C validation pipeline
- 禁止 streamArticle；禁止绕过 Style System

**不变** — 与 S1-STORY-025 一致。

### Sprint 6-A：Fixture Triple Infrastructure

**目标：**

- Article JSON fixture
- Copy HTML snapshot schema
- Paste checklist / PasteTestRecord schema
- 复制一致性 Bug 录入流程

### Sprint 6-B：First-wave Required Variants Paste QA Regression

**目标：**

- **33** first-wave required variants 全量粘贴 QA
- PasteTestRecord 记录
- expansion variants 进入后续批次

**原则（DECISION-045）：**

- Sprint 2 / Sprint 5 **不变**
- 拆分保证可执行性，**不降低** Release 1 样式丰富度目标（最终 up to 11×5）
- First wave 先 11×3，expansion 分后续子 Sprint

---

## 原则

- 后续 Sprint 可按合理工作量继续拆分
- 不允许将 Release 1 全部实现塞进单个 Sprint
- Sprint 方向变更须记录到 `decisions.md`
