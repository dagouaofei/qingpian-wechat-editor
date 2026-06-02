# Sprint 7 · miaopian-demo 协作方式与 UX Gap 对齐

> **日期：** 2026-06-02  
> **关联：** DECISION-079 · S7-STORY-001  
> **范围：** 协作方式（4）· 页面/交互流 gap（1）· 成稿样式 / Gallery（2 → S7-STORY-002~006）  
> **约束：** DECISION-009 · 不复制 miaopian-demo 代码 · 不引入第二套 Schema / Renderer

## 1. 目的

Sprint 6 已交付用户可见真实 AI 主链路（DECISION-071~077）。Sprint 7 启动前，明确：

1. **哪些 miaopian-demo 工作方式 adopt**（协作 / 迭代节奏）  
2. **哪些不 adopt**（架构与命名边界）  
3. **交互流（1）还有哪些 gap** — 避免重复立项已 Done 能力  
4. **成稿样式 / Gallery（2）** — 由 S7-STORY-002~006 承接，本文仅划边界  

## 2. 协作方式对齐（Adopt / 不 Adopt）

### 2.1 Adopt（与 miaopian-demo 一致、与本项目 rules 兼容）

| 项 | 说明 | 本项目落地 |
|----|------|------------|
| UX 参考、非代码复制 | Landing / 流式预览 / 分析面板只看信息架构与交互 | DECISION-075、077；S6 Done |
| 单问题单分支 | 每个 Story / Bug 独立 `feature/` / `docs/` 分支 | `git-workflow.md` |
| 每轮 execution report | Cursor 执行后写 `docs/agile/execution-reports/` | DECISION-019 · collaboration-rules |
| ChatGPT 审查后再 merge | 工作分支 → sprint → release → main | collaboration-rules |
| 手测驱动验收 | 可见主链路 PO 验收后再关 Story / Sprint | S6 PO 2026-06-02 |
| 真实 SSE 主路径 | 生成中即时预览，非 batch 后假打字机 | DECISION-077 · `/api/generate/stream` |

### 2.2 不 Adopt（必须保持轻篇正式项目边界）

| 项 | 原因 |
|----|------|
| 整包复制 miaopian-demo 代码 | DECISION-009 |
| `demo` / `v2` / `clean-core` 等命名 | project-rules |
| 平行 streamArticle / 第二套 Renderer | architecture-overview |
| mock 主链路冒充验收 | DECISION-072 |
| 以 lint/test  alone 关闭 Release | DECISION-070 |
| 静默 deterministic fallback（用户主路径） | `requireRealProvider: true` on `/preview` |

### 2.3 Sprint 7 协作约定（在 Sprint 6 基础上延续）

1. Story 启动前：确认 sprint-backlog 状态 + 建议分支名  
2. Story 完成：execution report + 用户 / ChatGPT 审查 + merge sprint  
3. 样式 / Gallery 类 Story：**必须**可手测页面或可视化入口（DECISION-070）  
4. Paste 全量 QA **不在 Sprint 7**（Sprint 8）  

## 3. 页面 / 交互流 Gap 对照（1）

### 3.1 Sprint 6 已对齐（无需再开「对齐 miaopian 交互流」大 Story）

| 能力 | 轻篇 | 参考 |
|------|------|------|
| 首页 Landing 信息架构 | `/` · hero + 输入卡片 + 高级选项 | S6-STORY-006A |
| 点击生成 → 立即进入预览工作台 | `/preview` | S6-STORY-002~004 |
| 真实 SSE block-aware 流式 | `POST /api/generate/stream` | S6-STORY-005 · DECISION-077 |
| 成稿分析步骤 + 生成状态条 | `preview-analysis-panel` 等 | S6-STORY-005 |
| 预览滚动跟随 | `use-preview-stream-scroll` | S6-STORY-005 |
| Style 系统控件样式（非纯文本） | 流式 + 终态 Preview Renderer | S6-STORY-005 |
| 基础风格 / 配色切换 | 侧栏 2×2 | S6-STORY-006 |
| 复制到公众号 | Copy Renderer clipboard | S6-STORY-006 |

### 3.2 可选抛光 Backlog（仅当有 PO 反馈时再开 Story）

| ID | 描述 | 优先级 | 建议归属 |
|----|------|--------|----------|
| S7-UX-POLISH-01 | `/generate` 遗留页删除 · 主路径澄清 | P2 | **Done** · CHORE-VIS-001 |
| S7-UX-POLISH-02 | Playwright `generate-page` e2e 删除 | P2 | **Done** · 随 `/generate` 移除 |
| S7-UX-POLISH-03 | 135 编辑器粘贴手测 | P1 | **Sprint 8**（非 S7） |

**结论：** 交互流（1）**无 P0 gap**；Sprint 7 **不**单列「miaopian 交互流对齐」Epic，仅在 PO 提出具体差异时开小型 `feature/s7-ux-polish-*`。

## 4. 成稿样式 / Gallery（2）→ Sprint 7 主线

以下 ** deliberately 不在 Sprint 6**，为 Sprint 7 committed scope：

| 目标 | Story |
|------|-------|
| 2–3 套完整 Article 样例 | S7-STORY-002（**8 套** · DECISION-081） |
| Style Gallery 可浏览入口 + title/heading 层级样式 | S7-STORY-003（合并原 003 + 004 · DECISION-082） |
| highlight / list / lead / cta 组合优化 | S7-STORY-005 |
| 过度卡片化修正 · 整篇 rhythm | S7-STORY-006 |
| 手动视觉 QA + close readiness | S7-STORY-007 |

## 5. 与 Sprint 8 边界

- 全量 33 variant Paste QA · PasteTestRecord · Release 1 关闭准备 → **Sprint 8**  
- Sprint 7 **不得**因 Gallery / 样式改善而宣称 Release 1 关闭  
