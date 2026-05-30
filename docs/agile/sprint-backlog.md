# Sprint 1 Backlog

> Sprint 1：项目初始化与产品架构地基
> 周期：1 人 / 1 周
> 状态：Done

---

## S1-STORY-001 初始化正式项目工程

**用户故事：** 作为开发者，我需要初始化轻篇公众号排版正式项目工程，以便后续 Sprint 在统一技术栈上开发。

**优先级：** P0

**工作内容：**

- 使用 Next.js App Router + TypeScript + Tailwind CSS 初始化项目
- 配置 ESLint、Prettier、Vitest、Playwright、Zod
- 建立 src 目录结构
- 编写 README.md

**验收标准：**

- [x] 项目名为 qingpian-wechat-editor
- [x] 项目可以正常安装依赖并启动
- [x] 包含 Next.js、TypeScript、Tailwind、ESLint、Prettier 基础配置
- [x] README.md 明确项目定位
- [x] 不出现 clean-core / v2 / demo / prototype 命名

**状态：** Done

---

## S1-STORY-002 建立 Cursor 全局规则和项目约束

**用户故事：** 作为团队成员，我需要 Cursor 规则约束开发和命名，以避免重复旧项目错误。

**优先级：** P0

**工作内容：**

- 建立 `.cursor/rules/` 目录
- 编写 project、agile、architecture、style-system、wechat-copy、collaboration 规则

**验收标准：**

- [x] `.cursor/rules` 目录存在
- [x] 已建立 6 类规则文件
- [x] 规则明确禁止临时链路、多套方案、旁路逻辑和旧原型废弃代码
- [x] 规则明确样式系统和复制一致性是 Release 1 核心范围

**状态：** Done

---

## S1-STORY-003 建立敏捷项目管理文档体系

**用户故事：** 作为产品负责人，我需要敏捷文档体系来管理 Backlog、Sprint 和决策。

**优先级：** P0

**工作内容：**

- 建立 `docs/agile/` 目录及全部敏捷文档

**验收标准：**

- [x] `docs/agile` 目录存在
- [x] product-backlog、sprint-plan、sprint-backlog、bugs、decisions、changelog、migration-reference、chatgpt-cursor-docs-workflow 均已建立
- [x] sprint-plan 明确 1 人 / 1 周约束
- [x] decisions.md 写入初始关键决策

**状态：** Done

---

## S1-STORY-004 建立产品文档体系

**用户故事：** 作为产品负责人，我需要产品文档明确愿景、范围和 Release 1 边界。

**优先级：** P0

**工作内容：**

- 建立 `docs/product/` 目录及全部产品文档

**验收标准：**

- [x] `docs/product` 目录存在
- [x] product-vision、product-scope、user-story-map、release-1-scope 均已建立
- [x] Release 1 范围包含样式系统、复制一致性、多输入、基础流式展示、image_placeholder

**状态：** Done

---

## S1-STORY-005 建立架构文档骨架

**用户故事：** 作为架构师，我需要架构文档骨架明确主链路和核心约束，以便后续 Sprint 按统一架构实现。

**优先级：** P0

**工作内容：**

- 建立 `docs/architecture/` 目录及全部架构文档骨架

**验收标准：**

- [x] `docs/architecture` 目录存在
- [x] 9 份架构文档均已建立
- [x] style-system.md 明确样式系统前置
- [x] generation-pipeline.md 正确表述 SSE / token / block streaming 历史经验
- [x] wechat-copy-style-rules.md 明确公众号复制一致性是 P0

**状态：** Done

---

## S1-STORY-006 沉淀 Sprint 2 候选目标

**用户故事：** 作为产品负责人，我需要 Sprint 2 候选方向，以便在 Sprint 1 验收后选择下一个 Sprint 目标。

**优先级：** P1

**工作内容：**

- 在 sprint-plan.md 中写入 Sprint 2 三个候选方向及选择约束

**验收标准：**

- [x] sprint-plan.md 包含 Sprint 2 候选方向
- [x] Sprint 2 候选方向按 1 人 / 1 周工作量控制
- [x] 不把 Article Schema、样式系统、Renderer、Copy Pipeline 全部塞进一个 Sprint

**状态：** Done

---

## S1-STORY-007 沉淀一键成稿历史经验参考清单

**用户故事：** 作为团队成员，我需要旧项目经验清单，以便继承有效经验、避免重复踩坑和不迁移废弃方案。

**优先级：** P0

**工作内容：**

- 建立 prototype-lessons.md 和 migration-reference.md
- 将经验反向补充到相关架构和敏捷文档

**验收标准：**

- [x] docs/architecture/prototype-lessons.md 已建立
- [x] docs/agile/migration-reference.md 已建立
- [x] 经验总结覆盖敏捷管理、样式系统、复制一致性、SSE / 流式生成、fixture / 手动测试、JSONL / block streaming、ChatGPT + Cursor + docs 协作方式
- [x] 明确旧项目只作为经验来源，不作为代码来源
- [x] 明确不迁移 Visual Layer、Space Style、多套 JSONL、多套 renderer、旁路逻辑和历史实验代码
- [x] 相关经验已反向补充到 style-system.md、wechat-copy-style-rules.md、generation-pipeline.md、sprint-plan.md 或 product-backlog.md 中

**状态：** Done
