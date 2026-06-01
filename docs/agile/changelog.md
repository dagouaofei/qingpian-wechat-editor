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
| 2026-05-31 | Sprint 2 | S2-STORY-006 merge 至 sprint 分支（`049b427`）；状态 Done | Git / 敏捷 | S2-STORY-006 |
| 2026-05-31 | Sprint 2 | 完成 Sprint 2 contract audit（P0=0；grade A）；Sprint 2 进入 Close Readiness | 架构 / 敏捷 | S2-STORY-007 |
| 2026-05-31 | Sprint 2 | 完成 Sprint 2 code audit（P0=0；grade A） | 架构 / 敏捷 | S2-CODE-AUDIT-001 |
| 2026-05-31 | Sprint 2 | **正式关闭 Sprint 2**；用户确认 contract + code audit；DECISION-054 | 敏捷 | S2-STORY-007 |
| 2026-05-31 | Release 1 | `sprint/s2-article-block-schema` merge 至 `release/1` | Git | DECISION-054 |

---

## 2026-05-31 · Sprint 3-A

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-31 | Sprint 3-A | **正式启动 Sprint 3-A**；范围 Style System Contract & Registry Infrastructure | 敏捷 / 架构 | S3A-STORY-001, DECISION-055 |
| 2026-05-31 | Sprint 3-A | 从 `release/1` 建立 `sprint/s3a-style-system-infra` | Git | DECISION-055 |
| 2026-05-31 | Sprint 3-A | 新增 Sprint 3-A Backlog S3A-STORY-001~007 | 敏捷 | S3A-STORY-001 |
| 2026-05-31 | Sprint 3-A | 实现 Style System 基础类型与 schema 契约（Theme / Preset / Variant / Registry） | 代码 / 架构 | S3A-STORY-002 |
| 2026-05-31 | Sprint 3-A | 实现 ResolvedStyle 与 StyleResolver 最小实现（resolveArticleStyle / resolveBlockStyle + fallback） | 代码 / 架构 | S3A-STORY-003 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-002 标记 Done；用户确认 StyleResolver explicit→preset_default 语义（DECISION-056） | 敏捷 / 架构 | S3A-STORY-002, DECISION-056 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-003 merge 至 `sprint/s3a-style-system-infra`（`85ffcbd`）；状态 Done | Git / 敏捷 | S3A-STORY-003 |
| 2026-05-31 | Sprint 3-A | 实现 WeChatCompatibilityProfile 机器可读契约与 copy-safe validation helper | 代码 / 架构 | S3A-STORY-004 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-004 merge 至 `sprint/s3a-style-system-infra`（`11a3d11`）；状态 Done | Git / 敏捷 | S3A-STORY-004 |
| 2026-05-31 | Sprint 3-A | 实现 StyleValidationResult / FallbackVariantPolicy；copySafety 统一为 `strict \| balanced \| preview_only` | 代码 / 架构 | S3A-STORY-005 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-005 merge 至 `sprint/s3a-style-system-infra`（`bcd6947`）；状态 Done；用户确认验收 | Git / 敏捷 | S3A-STORY-005 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-005 merge 至 sprint（前置）；实现 TitleBlockLayoutCompatibility 契约 | 代码 / 架构 | S3A-STORY-005, S3A-STORY-006 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-006 merge 至 `sprint/s3a-style-system-infra`（`f44a131`）；状态 Done | Git / 敏捷 | S3A-STORY-006 |
| 2026-05-31 | Sprint 3-A | Sprint 3-A contract audit（grade A，P0=0）；Close Readiness | 架构 / 敏捷 | S3A-STORY-007 |
| 2026-05-31 | Sprint 3-A | 用户确认接受 contract audit（A，P0=0，P1=4，P2=3） | 敏捷 | S3A-STORY-007 |
| 2026-05-31 | Sprint 3-A | **正式关闭 Sprint 3-A**；DECISION-057 | 敏捷 | S3A-STORY-007, DECISION-057 |
| 2026-05-31 | Release 1 | `sprint/s3a-style-system-infra` merge 至 `release/1` | Git | DECISION-057 |

---

## 2026-05-31 · Sprint 3-B

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-05-31 | Sprint 3-B | **正式启动 Sprint 3-B**；范围 First-wave Required Variant Registry | 敏捷 / 架构 | S3B-STORY-001, DECISION-058 |
| 2026-05-31 | Sprint 3-B | 从 `release/1` 建立 `sprint/s3b-first-wave-variant-registry` | Git | DECISION-058 |
| 2026-05-31 | Sprint 3-B | 新增 Sprint 3-B Backlog S3B-STORY-001~007 | 敏捷 | S3B-STORY-001 |
| 2026-05-31 | Sprint 3-B | P1-S3A-001 / P2-S3A-002 纳入 Sprint 3-B planning（S3B-STORY-002 前置） | 架构 / 敏捷 | S3B-STORY-002 |
| 2026-05-31 | Sprint 3-B | titleBlock catalog layoutMode mapping + slot copySafety 收口 | 代码 / 架构 | S3B-STORY-002 |
| 2026-05-31 | Sprint 3-B | merge `feature/s3b-titleblock-mapping-slot-copysafety` → sprint | Git | S3B-STORY-002 |
| 2026-05-31 | Sprint 3-B | 实现 title / heading first-wave 6 variants registry | 代码 / 架构 | S3B-STORY-003 |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-title-heading-variants` → sprint（`ba062ae`） | Git | S3B-STORY-003 |
| 2026-06-01 | Sprint 3-B | 实现 lead / paragraph / divider / list first-wave 12 variants registry | 代码 / 架构 | S3B-STORY-004 |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-text-first-variants` → sprint（`3350777`） | Git | S3B-STORY-004 |
| 2026-06-01 | Sprint 3-B | 实现 quote / highlight / info_card / cta / image_placeholder first-wave 15 variants registry；形成 33 variants 聚合 | 代码 / 架构 | S3B-STORY-005 |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-structured-block-variants` → sprint（`f5771eb`） | Git | S3B-STORY-005 |
| 2026-06-01 | Sprint 3-B | 建立 first-wave 33 variants coverage 与 registry validation gate | 测试 / 架构 | S3B-STORY-006 |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-first-wave-coverage` → sprint（`7837dce`） | Git | S3B-STORY-006 |
| 2026-06-01 | Sprint 3-B | Sprint 3-B contract audit（grade A，P0=0）；Close Readiness | 架构 / 敏捷 | S3B-STORY-007 |
| 2026-06-01 | Sprint 3-B | 用户确认接受 Sprint 3-B contract audit（grade A，P0=0，P1=5，P2=3）；33 variants coverage 完整 | 敏捷 / 架构 | S3B-STORY-007, DECISION-059 |
| 2026-06-01 | Sprint 3-B | Sprint 3-B 正式关闭；merge `sprint/s3b-first-wave-variant-registry` → `release/1`（`9040ef9`） | Git / 敏捷 | S3B-STORY-007, DECISION-059 |

---

## 2026-06-01 · Sprint 4-A

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-01 | Sprint 4-A | **正式启动 Sprint 4-A**；范围 Preview / Copy Renderer for Text-first Blocks | 敏捷 / 架构 | S4A-STORY-001, DECISION-060 |
| 2026-06-01 | Sprint 4-A | 从 `release/1` 建立 `sprint/s4a-text-first-renderer` | Git | DECISION-060 |
| 2026-06-01 | Sprint 4-A | 新增 Sprint 4-A Backlog S4A-STORY-001~007 | 敏捷 | S4A-STORY-001 |
| 2026-06-01 | Sprint 4-A | 修正 Sprint 3-B 状态漂移；同步 sprint-plan / product-backlog | 敏捷 | S4A-STORY-001 |
| 2026-06-01 | Sprint 4-A | Sprint 3-B audit 遗留中与 4-A 相关项纳入 Sprint 4-A planning | 架构 / 敏捷 | DECISION-060 |
| 2026-06-01 | Sprint 4-A | 明确 Sprint 3-C 未取消、仅延后（建议在 Sprint 5 前或 4-A/4-B 后启动） | 敏捷 | DECISION-060 |
| 2026-06-01 | Sprint 4-A | 完成 text-first Preview / Copy Renderer 最小闭环（title / heading / lead / paragraph / divider）；Copy HTML snapshot / Clipboard payload / Paste QA seed 已建立 | Renderer / Copy / 测试 | S4A-STORY-002~006 |
| 2026-06-01 | Sprint 4-A | 完成 Sprint 4-A Renderer Contract Audit；Grade A，P0=0，P1=4，P2=1；Sprint 4-A 进入 Close Readiness，待用户确认关闭 | 架构 / 敏捷 | S4A-STORY-007 |
| 2026-06-01 | Sprint 4-A | 用户确认接受 Sprint 4-A renderer contract audit（grade A，P0=0，P1=4，P2=1） | 敏捷 / 架构 | S4A-STORY-007, DECISION-061 |
| 2026-06-01 | Sprint 4-A | Sprint 4-A 正式关闭；merge `sprint/s4a-text-first-renderer` → `release/1`（`b2efdb2`） | Git / 敏捷 | S4A-STORY-007, DECISION-061 |

---

## 2026-06-01 · Sprint 4-B

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-01 | Sprint 4-B | **正式启动 Sprint 4-B**；范围 Preview / Copy Renderer for Structured Blocks | 敏捷 / 架构 | S4B-STORY-001, DECISION-062 |
| 2026-06-01 | Sprint 4-B | 从 `release/1` 建立 `sprint/s4b-structured-block-renderer` | Git | DECISION-062 |
| 2026-06-01 | Sprint 4-B | 新增 Sprint 4-B Backlog S4B-STORY-001~007 | 敏捷 | S4B-STORY-001 |
| 2026-06-01 | Sprint 4-B | 同步 sprint-plan / product-backlog；Sprint 4-B 前置遗留纳入 planning | 敏捷 / 架构 | S4B-STORY-001 |
| 2026-06-01 | Sprint 4-B | 明确 cta / image_placeholder 为 Release 1 占位契约；不实现真实 QR / 外链 / 图片能力 | 架构 / Renderer | DECISION-062 |
| 2026-06-01 | Sprint 4-B | Sprint 3-C 仍保持延后未取消 | 敏捷 | DECISION-062 |
| 2026-06-01 | Sprint 4-B | 实现 list Preview / Copy Renderer，覆盖 `list_plain_bullets` / `list_numbered_steps` / `list_checklist_cards`；lint / test（397）/ build PASS | Renderer / Copy / 测试 | S4B-STORY-002 |
| 2026-06-01 | Sprint 4-B | S4B-STORY-002 审核通过；merge `feature/s4b-list-renderer` → `sprint/s4b-structured-block-renderer`（`611a2a1`）；随 merge 纳入 S4A story branch cleanup report | Git / 敏捷 | S4B-STORY-002 |
| 2026-06-01 | Sprint 4-B | 实现 quote / highlight Preview + Copy Renderer，覆盖 6 variants；lint / test（424）/ build PASS | Renderer / Copy / 测试 | S4B-STORY-003 |
| 2026-06-01 | Sprint 4-B | S4B-STORY-003 审核通过；merge `feature/s4b-quote-highlight-renderer` → `sprint/s4b-structured-block-renderer`（`4d3967e`） | Git / 敏捷 | S4B-STORY-003 |
| 2026-06-01 | Sprint 4-B | 实现 info_card Preview + Copy Renderer，覆盖 3 variants；lint / test（443）/ build PASS | Renderer / Copy / 测试 | S4B-STORY-004 |
| 2026-06-01 | Sprint 4-B | S4B-STORY-004 审核通过；merge `feature/s4b-info-card-renderer` → `sprint/s4b-structured-block-renderer`（`02492ec`） | Git / 敏捷 | S4B-STORY-004 |
| 2026-06-01 | Sprint 4-B | 实现 cta / image_placeholder Preview + Copy Renderer，覆盖 6 variants；明确 Release 1 占位契约边界（无真实 QR / 链接 / 小程序 / 图片能力）；lint / test（475）/ build PASS | Renderer / Copy / 测试 | S4B-STORY-005 |
| 2026-06-01 | Sprint 4-B | 建立 structured blocks Copy HTML snapshot seed（18 variants）与 first-wave 33 variants 最小 Paste QA plan；Paste QA 状态全部 Not Run；lint / test（491）/ build PASS | Copy / QA Plan / 测试 | S4B-STORY-006 |
| 2026-06-01 | Sprint 4-B | S4B-STORY-006 审核通过；merge `feature/s4b-structured-copy-snapshot-paste-plan` → `sprint/s4b-structured-block-renderer`（`c13f0e1`） | Git / 敏捷 | S4B-STORY-006 |
| 2026-06-01 | Sprint 4-B | 完成 Renderer Contract Audit；Grade A，P0=0 / P1=4 / P2=2；Sprint 4-B 进入 Close Readiness，待用户确认关闭；lint / test（491）/ build PASS | Audit / 敏捷 / 架构 | S4B-STORY-007 |
| 2026-06-01 | Sprint 4-B | **正式关闭 Sprint 4-B**；S4B-STORY-001~007 Done；structured blocks 18 variants Preview / Copy Renderer、structured snapshot seed、first-wave 33 variants Paste QA plan 完成；Paste QA 全部 Not Run；确认 merge `sprint/s4b-structured-block-renderer` → `release/1`；未 merge main，未启动后续 Sprint | 敏捷 / Git / Release | DECISION-063 |

---

## 2026-06-01 · Sprint 3-C

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-01 | Sprint 3-C | **正式启动 Sprint 3-C**；范围 Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry | 敏捷 / 架构 | S3C-STORY-001, DECISION-064 |
| 2026-06-01 | Sprint 3-C | 从 `release/1` 建立 `sprint/s3c-style-assignment-validation` | Git | DECISION-064 |
| 2026-06-01 | Sprint 3-C | 新增 Sprint 3-C Backlog S3C-STORY-001~006 | 敏捷 | S3C-STORY-001 |
| 2026-06-01 | Sprint 3-C | 同步 sprint-plan / product-backlog / decisions；P1-003 与 TECH-ARCH-010~012 / TECH-ARCH-017 纳入 Sprint 3-C planning | 敏捷 / 架构 | S3C-STORY-001 |
| 2026-06-01 | Sprint 3-C | 明确 Sprint 3-C 不做 Renderer / Generation / Paste QA；expansion variants 仅规划不实现 registry | 架构 | DECISION-064 |
| 2026-06-01 | Sprint 3-C | Sprint 3-A / 3-B / 4-A / 4-B 保持 Closed；不自动启动 Sprint 5 / Sprint 6-A | 敏捷 | DECISION-064 |
| 2026-06-01 | Sprint 3-C | 实现 Style Assignment Contract（StyleSelectionRequest / StyleAssignmentPatch / ArticleStylePlan + patch merge helper）；17 新测试；lint / test（508）/ build PASS | 代码 / 架构 | S3C-STORY-002 |
| 2026-06-01 | Sprint 3-C | 实现 StyleOrchestrator 最小规则 R1/R2/R8 与 Block→Variant fallback；21 新测试；lint / test（529）/ build PASS | 代码 / 架构 | S3C-STORY-003 |
| 2026-06-01 | Sprint 3-C | 实现 VisualAssetRegistry（19 内置 assets）+ ComponentProtocol / BlockVisualProtocol / Theme·Preset·Density·Slot 组合边界校验；34 新测试；lint / test（563）/ build PASS | 代码 / 架构 | S3C-STORY-004, TECH-ARCH-010 |
| 2026-06-01 | Sprint 3-C | S3C-STORY-004 审核通过；merge `feature/s3c-visual-asset-protocol-validation` → `sprint/s3c-style-assignment-validation`（`3faddb4`） | Git / 敏捷 | S3C-STORY-004 |
| 2026-06-01 | Sprint 3-C | 实现 Style Selection Validation Pipeline + 10 fixtures + validation snapshot seeds；29 新测试；lint / test（592）/ build PASS | 代码 / 架构 | S3C-STORY-005, TECH-ARCH-017 |
| 2026-06-01 | Sprint 3-C | S3C-STORY-005 审核通过；merge `feature/s3c-style-selection-validation-fixtures` → `sprint/s3c-style-assignment-validation`（`8473235`） | Git / 敏捷 | S3C-STORY-005 |
