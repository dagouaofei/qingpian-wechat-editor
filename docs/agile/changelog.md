# Changelog

> 轻篇公众号排版 · qingpian-wechat-editor

## 记录格式

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|

---

## 2026-05-30 · Sprint 1-A

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-30 | Sprint 1-A | 初始化 qingpian-wechat-editor 正式项目（Next.js + TypeScript + Tailwind + ESLint + Prettier + Vitest + Playwright + Zod） | 工程 | S1-STORY-001 |
| 2026-05-30 | Sprint 1-A | 建立 `.cursor/rules/` 六类项目规则 | 开发约束 | S1-STORY-002, DECISION-003 |
| 2026-05-30 | Sprint 1-A | 建立 docs/agile 敏捷文档体系 | 项目管理 | S1-STORY-003 |
| 2026-05-30 | Sprint 1-A | 建立 docs/product 产品文档体系 | 产品 | S1-STORY-004, DECISION-004 |
| 2026-05-30 | Sprint 1-A | 建立 docs/architecture 架构文档骨架 | 架构 | S1-STORY-005, DECISION-005~006 |
| 2026-05-30 | Sprint 1-A | 沉淀 Sprint 2 候选目标（A/B/C 三方向） | 敏捷规划 | S1-STORY-006 |
| 2026-05-30 | Sprint 1-A | 沉淀旧一键成稿历史经验（prototype-lessons、migration-reference） | 架构 / 迁移 | S1-STORY-007, DECISION-009 |
| 2026-05-30 | Sprint 1-A | Git 初始化，Sprint 1-A commit 至 main 分支 | 工程治理 | S1-STORY-008 |

---

## 2026-05-30 · Sprint 1-B

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-30 | Sprint 1-B | Sprint 1 范围扩展，去除 1 人/1 周约束 | 敏捷 | DECISION-011~013 |
| 2026-05-30 | Sprint 1-B | 建立 Git 工作流文档与分支策略，完善 .gitignore | 工程治理 | S1-STORY-008, DECISION-016~017 |
| 2026-05-30 | Sprint 1-B | article-schema.md / block-schema.md 升级为正式技术方案 | 架构 | S1-STORY-009 |
| 2026-05-30 | Sprint 1-B | style-system.md 升级为正式技术方案（theme/preset/variant/registry/slot/density） | 架构 | S1-STORY-010, DECISION-014 |
| 2026-05-30 | Sprint 1-B | rendering-pipeline.md 升级为正式技术方案 | 架构 | S1-STORY-011 |
| 2026-05-30 | Sprint 1-B | copy-to-wechat-pipeline.md / wechat-copy-style-rules.md 升级为正式方案 | 架构 | S1-STORY-012 |
| 2026-05-30 | Sprint 1-B | generation-pipeline.md 升级为正式技术方案 | 架构 | S1-STORY-013 |
| 2026-05-30 | Sprint 1-B | 核心技术方案一致性审查，修正 architecture-overview 等文档 | 架构 | S1-STORY-014, DECISION-018 |
| 2026-05-30 | Sprint 1-B | 更新 sprint-plan / sprint-backlog / decisions / changelog | 敏捷 | S1-STORY-015 |

---

## 2026-05-30 · Sprint 1-B（进行中）

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-30 | Sprint 1-B | 建立 execution report 协作机制 | 协作 / 规则 | S1-STORY-016, DECISION-019 |
| 2026-05-30 | Sprint 1-B | 新增 execution-reports 目录与模板 | 敏捷 | S1-STORY-016 |
| 2026-05-30 | Sprint 1-B | 更新 Cursor 项目规则（agile-rules、collaboration-rules） | 开发约束 | S1-STORY-016 |
| 2026-05-30 | Sprint 1-B | 更新 chatgpt-cursor-docs-workflow.md 协作流 | 协作 | S1-STORY-016 |
| 2026-05-30 | Sprint 1-B | Sprint 1-B 整体状态调整为 In Review | 敏捷 | S1-STORY-016 |
| 2026-05-30 | Sprint 1-B | 建立 Sprint 分支与迭代内工作分支规则 | Git / 协作 | S1-STORY-017, DECISION-020 |
| 2026-05-30 | Sprint 1-B | 更新 git-workflow.md 分支模型与合并规则 | Git | S1-STORY-017 |
| 2026-05-30 | Sprint 1-B | 更新 Cursor 项目规则（project/agile/collaboration） | 开发约束 | S1-STORY-017 |
| 2026-05-30 | Sprint 1-B | 更新 chatgpt-cursor-docs-workflow.md | 协作 | S1-STORY-017 |
| 2026-05-30 | Sprint 1-B | Sprint 1-B 保持 In Review | 敏捷 | S1-STORY-017 |
| 2026-05-30 | Sprint 1-B | A/B 架构独立 audit | 架构 | architecture-ab-audit |
| 2026-05-30 | Sprint 1-B | Release 1 整体架构定稿（唯一 architecture-overview.md） | 架构 | S1-STORY-020, DECISION-023 |
| 2026-05-30 | Sprint 1-B | GenerationEvent 统一为 block.start/delta/complete | 架构 | DECISION-024 |
| 2026-05-30 | Sprint 1-B | StyleDefinition 最小模型与 Copy Fidelity DoD 定稿 | 架构 | DECISION-025~027 |
| 2026-05-30 | Sprint 1-B | Style Import Adapter 扩展点预留 | 架构 | DECISION-028 |
| 2026-05-30 | Sprint 1-B | 架构定稿合并前修复：纳入 prototype architecture lessons reference，明确 preview_only 不计入 Release 1 正式交付 | 架构 | S1-STORY-020 |
| 2026-05-30 | Sprint 1-B | Release 1 architecture overview finalized and merged into sprint governance branch | 架构 / Git | S1-STORY-020 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-021 实现前契约缺口修正；补充 InlineContent、Style 命名边界、slot copy-safe、WeChatCompatibilityProfile；调整 Sprint 2~6 计划 | 架构 / 敏捷 | S1-STORY-021, DECISION-029~033 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-022；基于 prototype-style-system-technical-lessons.md 对 S1-STORY-021 修正方案二次审计；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-022 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-023：Sprint 2 启动前契约收口；统一 paragraph / lead 文本字段为 content.text；登记 audit 剩余 P1/P2；修正 rendering-pipeline 实现顺序；新增 DECISION-034~035；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-023, DECISION-034~035 |
