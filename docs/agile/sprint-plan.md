# Sprint Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Sprint 周期

- **默认周期：** 1 人 / 1 周
- Sprint 目标必须可在 1 人 1 周内完成
- 不允许把 Release 1 的全部范围塞进单个 Sprint

## Sprint 1：项目初始化与产品架构地基

**目标：** 完成正式项目工程初始化、Cursor 规则、敏捷文档体系、产品文档体系、架构文档骨架，并沉淀旧项目历史经验参考清单。

**状态：** Done

**范围：**

- 项目工程初始化（Next.js、TypeScript、Tailwind、ESLint、Prettier、Vitest、Playwright、Zod）
- Cursor 规则体系
- docs/agile、docs/product、docs/architecture 文档体系
- Sprint 2 候选目标沉淀
- 旧一键成稿历史经验审计与迁移清单

**明确不做：** Article Schema 代码、Renderer、Copy Pipeline、AI 生成、SSE、样式 Gallery、业务临时代码。

---

## Sprint 2 候选方向

> Sprint 2 不应同时做 A / B / C 全部，应按 1 人 / 1 周工作量**选择一个主要目标**。

### 方向 A：Article / Block Schema 技术方案与代码实现

- 定义 Article Schema（Zod）
- 定义核心 Block 类型
- 建立 fixture 数据结构
- 不涉及 Renderer 和样式系统完整实现

### 方向 B：样式系统核心技术方案与第一批样式定义

- theme、preset、variant、registry、assignment 架构
- 第一批 block 样式定义
- Preview / Copy 共享样式定义的设计
- 不涉及完整生成链路和 Renderer 实现

### 方向 C：Preview / Copy Renderer 方案与最小实现

- Preview Renderer 最小实现
- Copy Renderer 最小实现
- 共享样式定义验证
- 人工粘贴测试清单建立
- 依赖 Article Schema 和基础样式定义（可能需要 Sprint 2 前期与 A 或 B 部分重叠）

## 选择建议

| 方向 | 适合场景 |
|------|----------|
| A | 优先建立数据模型地基，后续 Sprint 并行样式和渲染 |
| B | 样式系统是 Release 1 核心，优先验证样式架构和复制兼容性 |
| C | 已有 Schema 和样式草案，优先验证端到端预览复制闭环 |

最终 Sprint 2 方向需用户在 Sprint 1 验收后确认，并记录到 `decisions.md`。
