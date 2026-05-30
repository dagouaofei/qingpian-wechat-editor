# Sprint Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Sprint 周期原则

- 后续 Sprint 可按合理工作量拆分，避免单个 Sprint 塞入过多 Release 1 范围
- Sprint 1 不受「1 人 / 1 周」约束限制，需完成必要地基（见 DECISION-011）
- 不允许把 Release 1 的全部实现范围塞进单个 Sprint
- **Sprint 2 启动前须完成 S1-STORY-021 审查**（DECISION-029）

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

**Sprint 1 明确不做：** 业务功能代码实现（Article Zod、Renderer、Copy Pipeline、AI 生成、SSE 实现、样式 Gallery）。

---

## Sprint 2 ~ 6 计划（Release 1 代码实现）

> 业务功能实现必须在核心技术方案 + 实现前契约完成之后进入（DECISION-015、DECISION-029~033）。

### Sprint 2：Article / Block Schema + InlineContent 代码契约

**目标：**

- 实现 Article / Block TypeScript 类型
- 实现 Zod Schema
- 实现 InlineContent / InlineMark
- 实现基础 fixture
- 实现 schema 单元测试

**不做：** Renderer、Style System、Generation

### Sprint 3：Style System 代码契约与第一批 StyleDefinition

**目标：**

- 实现 Theme / Preset / VariantDefinition / Registry
- 实现 StyleResolver → ResolvedBlockStyle / ResolvedArticleStyle
- 实现 SlotRenderSpec copy-safe 边界
- 实现 WeChatCompatibilityProfile 基础规则
- 定义 classic-news 第一批 11 block variant

**不做：** 完整 Preview / Copy Renderer

### Sprint 4：Preview / Copy Renderer 最小闭环 + 最小粘贴 QA

**目标：**

- 基于 fixture 渲染 Preview
- 基于同一 ResolvedArticleStyle 生成 Copy HTML
- Copy Renderer 使用 WeChatCompatibilityProfile
- InlineMark → 微信兼容 inline HTML
- 启动最小人工微信公众号粘贴 QA
- 区分 Done（代码）与 Done（粘贴 QA）

### Sprint 5：Generation / Streaming 最小闭环

**目标：**

- 实现 InputRequest / NormalizedInput
- 实现 batch / stream 统一输出 Article
- 实现 GenerationEvent：`status` / `metadata` / `block.start` / `block.delta` / `block.complete` / `done.article`
- 前端可逐步展示 partial Article
- 禁止 streamArticle 平行结构

### Sprint 6：Fixture 三联 + Paste QA 回归体系

**目标：**

- Article JSON fixture
- Copy HTML snapshot
- Paste checklist / PasteTestRecord
- 复制一致性 Bug 录入流程
- classic-news 全 variant 回归

---

## 原则

- 后续 Sprint 可按合理工作量继续拆分
- 不允许将 Release 1 全部实现塞进单个 Sprint
- Sprint 方向变更须记录到 `decisions.md`
