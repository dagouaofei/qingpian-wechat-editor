# Sprint Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Sprint 周期原则

- 后续 Sprint 可按合理工作量拆分，避免单个 Sprint 塞入过多 Release 1 范围
- Sprint 1 不受「1 人 / 1 周」约束限制，需完成必要地基（见 DECISION-011）
- 不允许把 Release 1 的全部实现范围塞进单个 Sprint

---

## Sprint 1：正式项目启动、核心技术方案定稿与工程治理

**总目标：** 完成正式项目启动、核心技术方案定稿、Git 仓库治理。

### Sprint 1-A：项目初始化与文档骨架 — Done

- 项目工程初始化（Next.js、TypeScript、Tailwind、ESLint、Prettier、Vitest、Playwright、Zod）
- Cursor 规则体系
- docs/agile、docs/product、docs/architecture 文档骨架
- Sprint 2 候选目标沉淀
- 旧一键成稿历史经验审计与迁移清单

### Sprint 1-B：核心技术方案补齐与 Git 仓库治理 — Done

- Git 仓库治理与分支策略
- Article / Block Schema 正式技术方案
- Style System 正式技术方案
- Preview / Copy Renderer 正式技术方案
- Copy-to-WeChat 与复制一致性正式技术方案
- Generation / Streaming 正式技术方案
- 核心技术方案一致性审查
- Sprint 状态、决策记录与 Changelog 更新

**Sprint 1 明确不做：** 业务功能代码实现（Article Zod、Renderer、Copy Pipeline、AI 生成、SSE 实现、样式 Gallery）。

---

## Sprint 2 方向（待启动）

> 核心技术方案已在 Sprint 1-B 定稿。Sprint 2 进入**代码实现**，应按合理工作量选择主要目标。
> 业务功能实现必须在核心技术方案完成之后进入（DECISION-015）。

### 方向 A：Article / Block Schema 代码实现

- Zod Schema 定义
- TypeScript 类型
- Fixture 数据结构
- 单元测试

### 方向 B：样式系统代码实现与第一批样式

- theme / preset / variant / registry 代码
- Style Resolver
- classic-news preset 全部 variant 定义
- Copy adapter（inline style 映射）

### 方向 C：Preview / Copy Renderer 最小实现

- Preview Renderer（基于 fixture）
- Copy Renderer（基于 fixture）
- 共享 Style Definition 验证
- 人工粘贴测试清单

**建议顺序：** A → B → C（或 A + B 合并为一个 Sprint，C 单独一个 Sprint）。

最终 Sprint 2 方向需用户确认，并记录到 `decisions.md`。
