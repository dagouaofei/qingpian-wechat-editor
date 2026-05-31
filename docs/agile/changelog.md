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
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-024：Component DSL 能力对齐与 Style System 补强；…DECISION-036~038；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-024, DECISION-036~038 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-025：Style System 实现前收口；…DECISION-039~042；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-025, DECISION-039~042 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-026：S1-STORY-025 二次审计；…S1-STORY-025 分级 B 可 merge；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-026 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-027：Release 1 样式范围与 Sprint 拆分收口；first wave 11×3、expansion 11×5 target、magazine_left_bar_title 降为 candidate、Sprint 3-A/B/C & 4-A/B & 6-A/B；DECISION-043~045；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-027, DECISION-043~045 |
| 2026-05-30 | Sprint 1-B | Merge S1-STORY-025 → 026 → 027 文档链至 `sprint/s1b-core-tech-governance`；Sprint 1-B 保持 In Review | Git / 敏捷 | S1-STORY-025~027 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-028：Sprint 1-B 总 Audit；分级 B；P0=0 P1=9 P2=5；025~027 已在 sprint merge；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-028 |
| 2026-05-30 | Sprint 1-B | Merge S1-STORY-028 final audit 至 `sprint/s1b-core-tech-governance`（`25b9bad`） | Git / 敏捷 | S1-STORY-028 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-029：Sprint 1-B 关闭前状态同步；同步 S1-STORY-021~028 Done；登记 TECH-ARCH-023 Style Quality Gate；补充 Close Readiness Checklist；Sprint 1-B 保持 In Review | 敏捷 | S1-STORY-029, TECH-ARCH-023 |
| 2026-05-30 | Sprint 1-B | **关闭 Sprint 1-B**；修复 architecture-overview §19 P1-010；S1-STORY-029 Done；DECISION-051；Sprint 2 未启动 | 敏捷 / 架构 | S1-STORY-029, DECISION-051 |

---

## 2026-05-31 · Release 1 主干

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-31 | Release 1 | 建立 `release/1` 作为 Release 1 主干；`sprint/s1b-core-tech-governance` merge 至 release/1 | Git | DECISION-052 |
| 2026-05-31 | Release 1 | 清理 Sprint 1-B 全部 15 个 `docs/s1b-*` story 工作分支（含已 merge 与未 merge） | Git | DECISION-052 |
| 2026-05-31 | Release 1 | 更新 git-workflow.md：main ← release ← sprint ← work 四层分支模型 | Git / 协作 | DECISION-052 |

---

## 2026-05-31 · Sprint 2

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-31 | Sprint 2 | **正式启动 Sprint 2**；范围 Article / Block Schema + InlineContent 代码契约 | 敏捷 / 架构 | S2-STORY-001, DECISION-053 |
| 2026-05-31 | Sprint 2 | 从 `release/1` 建立 `sprint/s2-article-block-schema` | Git | DECISION-053 |
| 2026-05-31 | Sprint 2 | 新增 Sprint 2 Backlog S2-STORY-001~007 | 敏捷 | S2-STORY-001 |
| 2026-05-31 | Sprint 2 | 实现 InlineContent / InlineMark 代码契约（TS + Zod + normalize + 单测） | 代码 / 架构 | S2-STORY-002 |
| 2026-05-31 | Sprint 2 | S2-STORY-002 merge 至 sprint 分支（`ba149fe`）；状态 Done | Git / 敏捷 | S2-STORY-002 |
| 2026-05-31 | Sprint 2 | 实现 Block Schema 代码契约（11 block TS + Zod union + 单测） | 代码 / 架构 | S2-STORY-003 |
| 2026-05-31 | Sprint 2 | S2-STORY-003 merge 至 sprint 分支（`93c6526`）；状态 Done | Git / 敏捷 | S2-STORY-003 |
| 2026-05-31 | Sprint 2 | 实现 Article Schema 代码契约（Article TS + Zod + blockSchema 复用 + 单测） | 代码 / 架构 | S2-STORY-004 |
| 2026-05-31 | Sprint 2 | S2-STORY-004 merge 至 sprint 分支（`d68e503`）；状态 Done | Git / 敏捷 | S2-STORY-004 |
| 2026-05-31 | Sprint 2 | 实现 schema parse / validate / normalize helper（Article + Block + validation result） | 代码 / 架构 | S2-STORY-005 |
| 2026-05-31 | Sprint 2 | S2-STORY-005 merge 至 sprint 分支（`9a7d625`）；状态 Done | Git / 敏捷 | S2-STORY-005 |
| 2026-05-31 | Sprint 2 | 新增基础 Article fixtures 与 schema 回归测试（4 fixtures + invalid cases） | 测试 / 架构 | S2-STORY-006 |
