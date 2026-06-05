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
| 2026-06-01 | Sprint 3-C | 完成 Style System Contract Audit（Grade A；P0=0/P1=5/P2=4）；expansion variants 规划；Sprint 3-C 进入 Close Readiness | Audit / 敏捷 | S3C-STORY-006 |
| 2026-06-01 | Sprint 3-C | **正式关闭 Sprint 3-C**；用户确认 audit 结论；S3C-STORY-001~006 Done；DECISION-065 | 敏捷 | DECISION-065 |
| 2026-06-01 | Sprint 3-C | merge `sprint/s3c-style-assignment-validation` → `release/1`（`8ce4eed`）；audit Grade A · P0=0 · P1=5 · P2=4；592 tests PASS | Git / 敏捷 | DECISION-065 |

---

## 2026-06-02 · Sprint 5 计划变更

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | **Sprint 5 计划变更**：由「Generation / Streaming + 受控 AI 样式选择最小闭环」调整为「Generation / Streaming + Release 1 真实 UI 主流程闭环」 | 敏捷 / 架构 | DECISION-066 |
| 2026-06-02 | Sprint 5 | 新增 Release 1 真实 UI 主流程闭环要求：Sprint 5 结束时必须在真实页面手动跑通输入 → 生成 → 预览 → 复制 | 敏捷 / 产品 | DECISION-066, TECH-ARCH-024 |
| 2026-06-02 | Sprint 5 | 新增 Sprint 5 Backlog 草案 S5-STORY-001~007（Planned）；含 S5-STORY-006 真实 UI 页面集成、S5-STORY-007 smoke / e2e | 敏捷 | S5-STORY-001~007 |
| 2026-06-02 | Sprint 5 | 新增 DECISION-066；更新 product-backlog TECH-ARCH-024 | 敏捷 / 架构 | DECISION-066, TECH-ARCH-024 |
| 2026-06-02 | Sprint 5 | Sprint 5 **未启动**；未创建 `sprint/s5-*` 分支；**等待用户确认启动 Sprint 5** | 敏捷 / Git | DECISION-066 |

---

## 2026-06-02 · S5-STORY-002 InputRequest 契约

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 实现 InputRequest / NormalizedInput 代码契约（parse / validate / normalize） | 代码 / 架构 | S5-STORY-002 |
| 2026-06-02 | Sprint 5 | 新增 `src/core/generation/` 与单元测试；S5-STORY-002 Done | 代码 / 测试 | S5-STORY-002 |
| 2026-06-02 | Sprint 5 | S5-STORY-003 启动前状态记录（后续已由 S5-STORY-003 完成覆盖） | 敏捷 | S5-STORY-002 |

---

## 2026-06-02 · S5-STORY-003 GenerationEvent / SSE Runtime

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 实现 GenerationEvent 契约与 Zod schema（block.start / block.delta / block.complete / done.article / error / heartbeat） | 代码 / 架构 | S5-STORY-003, DECISION-024 |
| 2026-06-02 | Sprint 5 | 实现 SSE encode/decode 与 stream runtime + deterministic test provider | 代码 / 测试 | S5-STORY-003 |
| 2026-06-02 | Sprint 5 | S5-STORY-003 Done；S5-STORY-004 仍 Planned；未实现 Article 归一 / UI 主流程 | 敏捷 | S5-STORY-003 |

---

## 2026-06-02 · Sprint 5 真实模型 Provider 计划调整

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | Sprint 5 后续计划调整：Sprint 5 关闭前必须接入真实模型 API | 敏捷 / 架构 | DECISION-068 |
| 2026-06-02 | Sprint 5 | 新增 S5-STORY-005 真实模型 Provider 对接（Volcengine / Doubao）；原 S5-STORY-005~007 顺延为 S5-STORY-006~008 | 敏捷 | S5-STORY-005~008 |
| 2026-06-02 | Sprint 5 | Volcengine / Doubao provider 纳入 Sprint 5 P0；deterministic provider 仅 dev fallback / test provider | 架构 | TECH-ARCH-024, TECH-ARCH-025 |
| 2026-06-02 | Sprint 5 | Sprint 5 UI 主流程验收不再允许只依赖 deterministic provider | 敏捷 / 产品 | DECISION-068, S5-STORY-007, S5-STORY-008 |

---

## 2026-06-02 · S5-STORY-004 done.article 归一

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 实现 `done.article` 事件序列校验与 `finalizeGenerationEvents` Article 归一链路 | 代码 / 架构 | S5-STORY-004 |
| 2026-06-02 | Sprint 5 | 复用 `parseArticle` / `validateArticle` / `normalizeArticle`；新增 26 单元测试 | 代码 / 测试 | S5-STORY-004 |
| 2026-06-02 | Sprint 5 | S5-STORY-004 Done；S5-STORY-005 仍 Planned；未接入真实模型 / UI 主流程 | 敏捷 | S5-STORY-004 |

---

## 2026-06-02 · S5-STORY-005 Volcengine Model Provider

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 实现 Volcengine / Doubao model provider 契约、transport、prompt 与 GenerationEvent 输出 | 代码 / 架构 | S5-STORY-005, TECH-ARCH-025, DECISION-068 |
| 2026-06-02 | Sprint 5 | 新增 `.env.example`（`VOLCENGINE_*`）；mock transport 单测，无真实网络依赖 | 配置 / 测试 | S5-STORY-005 |
| 2026-06-02 | Sprint 5 | S5-STORY-005 Done；S5-STORY-006~008 仍 Planned；未实现 `/generate` UI / Sprint 5 主流程关闭 | 敏捷 | S5-STORY-005 |

---

## 2026-06-02 · S5-STORY-005A Volcengine Real API Smoke

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 新增 dev-only `smoke:volcengine-provider` 真实 API smoke 脚本 | 工具 / 架构 | S5-STORY-005A |
| 2026-06-02 | Sprint 5 | S5-STORY-005 调整为 In Review；005A smoke script ready；真实 API 手动运行 pending | 敏捷 | S5-STORY-005, S5-STORY-005A |
| 2026-06-02 | Sprint 5 | 新增 `docs/agile/smoke/s5-volcengine-provider-smoke.md` | 文档 | S5-STORY-005A |

---

## 2026-06-02 · S5-STORY-005B Model Article Candidate Enrichment

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 新增 `model-article-enrichment` 层：UUID / metadata / input / styleAssignment / block content deterministic repair | 代码 / 架构 | S5-STORY-005B |
| 2026-06-02 | Sprint 5 | Volcengine provider 接入 enrichment；forbidden 字段剥离 + warning；smoke summary 增加 finalization / enrichment 字段 | 代码 / 工具 | S5-STORY-005B |
| 2026-06-02 | Sprint 5 | 真实 API smoke **PASSED**（eventCount 7；finalizationStatus passed；enrichmentWarningCount 0） | 验收 | S5-STORY-005, S5-STORY-005A, S5-STORY-005B |
| 2026-06-02 | Sprint 5 | S5-STORY-005 / 005A / 005B 已 merge 至 `sprint/s5-generation-ui-main-flow`（`7421089` / `d77d3d0` / `532f685`） | 敏捷 | S5-STORY-005~005B |

---

## 2026-06-02 · S5-STORY-006 AI Style Selection Pipeline

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | 新增 generation style selection 链路：StyleSelectionRequest / StyleAssignmentPatch → Sprint 3-C validation → Article.styleAssignment | 代码 / 架构 | S5-STORY-006 |
| 2026-06-02 | Sprint 5 | deterministic + model_assisted 模式；非法 variant / forbidden 字段 / invalid model output → safe preset fallback | 代码 / 测试 | S5-STORY-006 |
| 2026-06-02 | Sprint 5 | 新增 `/generate` 页面与 `/api/generate` 统一主链路 UI 集成 | 代码 / UI | S5-STORY-007 |
| 2026-06-02 | Sprint 5 | `feature/s5-generate-ui-main-flow` merge 至 `sprint/s5-generation-ui-main-flow` @ `01318c4`（S5-STORY-007） | 敏捷 | S5-STORY-007 |
| 2026-06-02 | Sprint 5 | S5-STORY-007 用户确认关闭为 Done；记录 follow-up 测试 / provider / 样式 / Paste QA 留后续 | 敏捷 | S5-STORY-007 |
| 2026-06-02 | Sprint 5 | S5-STORY-008 Done；新增 Sprint 5 close readiness audit（P0=0）；Sprint 5 进入 Close Readiness | 敏捷 / 架构 | S5-STORY-008 |

---

## 2026-06-02 · Sprint 5 关闭

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 5 | **关闭 Sprint 5**；用户确认 close readiness audit（Grade A- · P0=0）；DECISION-069 | 敏捷 | S5-STORY-008, DECISION-069 |
| 2026-06-02 | Sprint 5 | `docs/s5-main-flow-e2e-close-readiness` merge 至 `sprint/s5-generation-ui-main-flow`（S5-STORY-008） | Git / 敏捷 | S5-STORY-008 |
| 2026-06-02 | Sprint 5 | `sprint/s5-generation-ui-main-flow` merge 至 `release/1` | Git / Release 1 | DECISION-069 |
| 2026-06-02 | Sprint 5 | Paste QA 仍 **Not Run**（归 Sprint 8）；**不宣称** Release 1 完成；**不 merge `main`** | 敏捷 / 架构 | DECISION-069 |

---

## 2026-06-02 · Release 1 尾声方案 B 重排

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Release 1 | Sprint 5 关闭后，Release 1 后续从纯技术收口调整为 **用户可见主链路收口（方案 B）** | 敏捷 / 产品 | DECISION-070 |
| 2026-06-02 | Sprint 6 | 新增 **Sprint 6 Visible Main Flow**（S6-STORY-001~007）；**下一步最高优先级** | 敏捷 | DECISION-070 |
| 2026-06-02 | Sprint 7 | 新增 **Sprint 7 WeChat Article Experience & Style Richness**（S7-STORY-001~007）；Planned | 敏捷 | DECISION-070 |
| 2026-06-02 | Sprint 8 | 新增 **Sprint 8 Copy Fidelity & Release 1 Closure**（S8-STORY-001~007）；Planned | 敏捷 | DECISION-070 |
| 2026-06-02 | Release 1 | 新增 [`release-plan.md`](release-plan.md)；关闭标准从 lint/test/build 调整为 **可见主链路 + 样式体验 + 复制保真** | 敏捷 / 产品 | DECISION-070 |
| 2026-06-02 | Release 1 | 原 Sprint 6-A/B 尾声计划在 Release 1 剩余阶段由方案 B 取代 | 敏捷 | DECISION-045, DECISION-070 |
| 2026-06-02 | Release 1 | 更新 `user-story-map.md` 主路径与 Sprint 6/7/8 分工 | 产品 | DECISION-070 |
| 2026-06-02 | Release 1 | `docs/release1-replan-visible-main-flow` merge 至 `release/1` @ `14dc27b` | Git / 敏捷 | DECISION-070 |

---

## 2026-06-02 · Sprint 6 启动

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | **开启 Sprint 6：** Release 1 Visible AI Main Flow；分支 `sprint/s6-visible-ai-main-flow` | 敏捷 / Git | DECISION-071, S6-STORY-001 |
| 2026-06-02 | Sprint 6 | 从 Product Backlog 选择 **PB-R1-01 ~ PB-R1-08** 作为 Sprint 6 主要范围来源 | 产品 / 敏捷 | DECISION-071 |
| 2026-06-02 | Sprint 6 | Sprint Backlog 设置为 **S6-STORY-001 ~ S6-STORY-006**；S6-STORY-001 Done；002~006 To Do | 敏捷 | S6-STORY-001 |
| 2026-06-02 | Sprint 6 | 明确 Sprint 6 目标为**真实 AI 用户侧最小闭环**；**不是** mock demo，**不是**纯技术验证 | 产品 / 敏捷 | DECISION-071 |
| 2026-06-02 | Sprint 6 | 更新 `user-story-map.md` 8 步闭环路径与 Sprint 6 排除范围 | 产品 | S6-STORY-001 |
| 2026-06-02 | Sprint 6 | 在 sprint-backlog 登记 Sprint 6 技术 / 产品 / 内容 / 样式 DoD | 敏捷 | S6-STORY-001 |
| 2026-06-02 | Sprint 6 | 新增 **DECISION-071**；Sprint 6 状态 **In Progress**；**不关闭 Sprint 6**；**不 merge main / release/1** | 敏捷 | DECISION-071 |

---

## 2026-06-02 · Sprint 6 首页 → 预览真实 AI 主流程

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | **S6-STORY-002~004 Done**：首页 `/`、预览 `/preview`、真实 AI + Preview Renderer 闭环 | 代码 / UI | S6-STORY-002~004, DECISION-072 |
| 2026-06-02 | Sprint 6 | `requireRealProvider`：用户主流程禁止静默 deterministic mock | 代码 / API | DECISION-072 |
| 2026-06-02 | Sprint 6 | 增强 Volcengine prompt：公众号长文结构与必需 block 类型 | 代码 | S6-STORY-003 |
| 2026-06-02 | Sprint 6 | S6-STORY-005~006 仍为 **To Do**（打字机 / 风格切换 / 复制专项） | 敏捷 | — |
| 2026-06-02 | Sprint 6 | 工作分支 `feature/s6-home-ai-preview-flow`；**不 merge release/1** | Git | S6-STORY-002~004 |
| 2026-06-02 | Sprint 6 | `feature/s6-home-ai-preview-flow` merge 至 `sprint/s6-visible-ai-main-flow` @ `f38130a`；S6-STORY-002~004 **Done** | Git / 敏捷 | DECISION-072 |

## 2026-06-02 · Sprint 6 SSE 流式预览 + UX Shell（S6-STORY-005 / 006A）

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | **S6-STORY-005 Done**：真实 SSE `POST /api/generate/stream`；block-aware 流式预览 + Style 系统控件样式 + 滚动跟随 | 代码 / UI | S6-STORY-005, DECISION-077 |
| 2026-06-02 | Sprint 6 | **S6-STORY-006A Done**：miaopian 风格 UI Shell；预览页复制 | 代码 / UI | S6-STORY-006A, DECISION-075 |
| 2026-06-02 | Sprint 6 | DECISION-076 标记 **已废弃**（由 DECISION-077 取代） | 敏捷 | DECISION-076, DECISION-077 |
| 2026-06-02 | Sprint 6 | 流式预览接入 `generateDeterministicStyleSelection`；list structured block 就绪校验 | 代码 | S6-STORY-005 |
| 2026-06-02 | Sprint 6 | PO 验收通过；`feature/s6-generation-feedback-typewriter` merge 至 `sprint/s6-visible-ai-main-flow` @ `ce967b1` | 敏捷 / Git | S6-STORY-005, S6-STORY-006A |
| 2026-06-02 | Sprint 6 | **S6-STORY-006** 仍为 **To Do**（风格 / 配色切换 + Paste QA 专项） | 敏捷 | S6-STORY-006 |

## 2026-06-02 · S6-STORY-006 风格 / 配色切换与复制（In Review）

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | **S6-STORY-006 In Review**：预览侧栏风格 / 配色切换；客户端重渲染 Preview + Copy；最小粘贴 QA 清单 | 代码 / UI / 文档 | S6-STORY-006, PB-R1-05, PB-R1-07, PB-R1-08 |
| 2026-06-02 | Sprint 6 | 新增 `warm-editorial` theme、`renderArticlePreviewClient()`、`docs/agile/paste-qa/s6-minimal-paste-qa.md` | 代码 / Style | S6-STORY-006 |
| 2026-06-02 | Sprint 6 | **Bugfix**：Copy Renderer 接入 theme palette tokens；暖色复制写入 inline hex（非 CSS 变量） | 代码 / Copy | S6-STORY-006 |
| 2026-06-02 | Sprint 6 | **S6-STORY-006 Done**：PO 手测通过（含暖色复制公众号）；待 merge sprint | 敏捷 | S6-STORY-006 |
| 2026-06-02 | Sprint 6 | PO 验收通过；`feature/s6-style-palette-copy-paste-qa` merge 至 `sprint/s6-visible-ai-main-flow` @ `e7391e5` | 敏捷 / Git | S6-STORY-006 |

## 2026-06-02 · Sprint 6 Close Readiness Audit

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | Sprint 6 Close Readiness Audit（Grade A- · P0=0） | 文档 / QA | S6-STORY-001~006 |
| 2026-06-02 | Sprint 6 | 修复 `home-preview-flow` e2e strict mode；`preview-visual-styles` 单测跟随 CSS var | 测试 | Sprint 6 close audit |
| 2026-06-02 | Sprint 6 | Sprint 6 状态 → **Close Readiness**（**未关闭** · 待用户确认） | 敏捷 | DECISION-071 |

## 2026-06-02 · Sprint 6 关闭 + Sprint 7 启动

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 6 | **Sprint 6 Closed**（DECISION-078）；merge `sprint/s6-visible-ai-main-flow` → `release/1` | 敏捷 / Git | DECISION-078 |
| 2026-06-02 | Sprint 7 | **Sprint 7 启动**（DECISION-079）；`sprint/s7-wechat-article-experience` | 敏捷 / Git | DECISION-079, S7-STORY-001 |
| 2026-06-02 | Sprint 7 | 新增 `docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md` | 文档 | S7-STORY-001 |

## 2026-06-02 · Sprint 7 暂停 · Visible Progress Chore

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 7 | **Sprint 7 Paused**（DECISION-080）；Visible-first Cursor 轮次规则 | 敏捷 | DECISION-080 |
| 2026-06-02 | Chore | `/gallery` fixture Preview 展台；删除 `/generate` 页面与 e2e | 应用 / 导航 | CHORE-VIS-001, CHORE-VIS-002 |
| 2026-06-02 | Chore | 删除 batch `POST /api/generate` 与 `run-generate-main-flow` | 代码 / API | CHORE-VIS-001 |
| 2026-06-02 | Chore | **CHORE-VIS-001/002 Done**；`chore/visible-progress-gallery-legacy` merge → sprint @ `a5704d6` | 敏捷 / Git | DECISION-080 |

## 2026-06-02 · Sprint 7 恢复 · S7-STORY-002 八套 fixture

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 7 | **S7-STORY-002** 8 套 fixture + Gallery；merge @ `429ce30` | 代码 / Fixture | S7-STORY-002, DECISION-081 |

## 2026-06-02 · S7-STORY-003/004 合并 · Gallery + title/heading

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 7 | **DECISION-082**：S7-STORY-003 与 004 合并；Gallery Copy/聚焦/variant + title/heading polish | 代码 / Docs / `/gallery` | S7-STORY-003, DECISION-082 |

## 2026-06-02 · S7-STORY-002/003/005 PO 签收

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 7 | **S7-STORY-002 Done**（PO 签收）：8 套 fixture 已在 sprint @ `429ce30` | Fixture / Gallery | S7-STORY-002 |
| 2026-06-02 | Sprint 7 | **DECISION-083**：miaopian 6 preset + 6 theme；registry **97**；heading **13**（含 6 miaopian 样式）；同篇 heading 统一；公众号字号 | Style / Gallery / Generation | S7-STORY-003, S7-STORY-005, DECISION-083 |
| 2026-06-02 | Sprint 7 | **S7-STORY-003 / 005 Done**（PO 签收）；`feature/s7-rich-styles-title-heading` fast-forward merge → `sprint/s7-wechat-article-experience` @ `517717e` | 代码 / Git | S7-STORY-003, S7-STORY-005 |
| 2026-06-02 | Sprint 7 | **下一步 S7-STORY-006**（rhythm / 过度卡片化）；Sprint 7 **未关闭**；**不 merge `main`** | 敏捷 | S7-STORY-006 |

## 2026-06-02 · S7-STORY-006 PO 签收

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-02 | Sprint 7 | **DECISION-084**：Orchestrator R4 + RCARD；plain-first 生成 rotation；`card-rhythm.ts` | Style / Generation | DECISION-084, S7-STORY-006 |
| 2026-06-02 | Sprint 7 | **S7-STORY-006 Done**（PO 签收）；`feature/s7-article-rhythm-card-fix` fast-forward merge → sprint @ `935640f` | 代码 / Git | S7-STORY-006 |
| 2026-06-02 | Sprint 7 | **下一步 S7-STORY-007**（视觉 QA + close readiness）；Sprint 7 **未关闭** | 敏捷 | S7-STORY-007 |

## 2026-06-03 · Sprint 7 收口 · S7-STORY-008

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-03 | Sprint 7 | **S7-STORY-008 Done**：heading publish 8 款；第六轮公众号粘贴 **8/8 PASS**；荧光笔 `h3`+`linear-gradient`（`7d8e38c`） | Heading / Copy / Preview | S7-STORY-008, DECISION-087 |
| 2026-06-03 | Sprint 7 | **Sprint 7 Closed**（用户确认）；`feature/s7-story-007a-r1-style-fidelity` → `sprint/s7-wechat-article-experience` → `release/1` | 敏捷 / Git | Sprint 7 |
| 2026-06-03 | Sprint 7 | S7-STORY-007B（R1 golden 全文粘贴）移交 Sprint 8；不阻塞 S7 关闭 | 敏捷 | S7-STORY-007B |

## 2026-06-04 · Sprint 8 启动 · S8-STORY-001

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-04 | Sprint 8 | **DECISION-088**：S8 重定义为 WeChat-safe CSS Contract & Fidelity Test System（8 stories） | 敏捷 / 架构 | DECISION-088 |
| 2026-06-04 | Sprint 8 | 创建分支 `sprint/s8-wechat-safe-css-contract`、`docs/s8-story-001-compatibility-research` | Git | S8-STORY-001 |
| 2026-06-04 | Sprint 8 | 新增 `sprint8-wechat-safe-css-contract.md`、调研与 contract/失真诊断草案 | 敏捷 / 架构 / 调研 | S8-STORY-001 |
| 2026-06-04 | Sprint 8 | 替换 sprint-backlog Sprint 8 章节（S8-STORY-001~008）；**未改业务代码** | 敏捷 | S8-STORY-001 |
| 2026-06-04 | Sprint 8 | **S8-STORY-001 Done**（用户确认 DECISION-088）；调研详表待补；merge → `sprint/s8-wechat-safe-css-contract` | 敏捷 / Git | S8-STORY-001, DECISION-088 |
| 2026-06-04 | Sprint 8 | **Contract v1 定稿**（`wechat-safe-contract-v1`）；HTML/CSS 分级 · waiver · fallback · DOM/inline；DECISION-089 待确认 | 架构 / 敏捷 | S8-STORY-002, DECISION-089 |
| 2026-06-04 | Sprint 8 | **DECISION-089 已确认**；**S8-STORY-002 Done**；Clipboard 禁 class（Copy 剥离）· gradient waiver 不外推；merge → sprint | 架构 / 敏捷 / Git | S8-STORY-002, DECISION-089 |
| 2026-06-04 | Sprint 8 | **S8-STORY-003**：`src/core/wechat-compat` · Contract v1 profile + waivers；DECISION-090 | 代码 / 架构 | S8-STORY-003, DECISION-090 |
| 2026-06-04 | Sprint 8 | **S8-STORY-003 Done**：`profileId`=`wechat-mp-editor-v1` · `contractVersionId`=`wechat-safe-contract-v1`；merge → sprint | 代码 / Git | S8-STORY-003 |
| 2026-06-04 | Sprint 8 | **S8-STORY-004**：Copy HTML Validator（`validateWechatCopyHtml` · Contract v1 · waiver 非全局） | 代码 / 架构 | S8-STORY-004, DECISION-090 |
| 2026-06-04 | Sprint 8 | **S8-STORY-004 Done**（用户审查通过）；merge `feature/s8-story-004-copy-html-validator` → sprint | 代码 / Git | S8-STORY-004 |
| 2026-06-04 | Sprint 8 | **S8-STORY-005**：35 行 Fidelity Matrix + fixture/validator 流水线 | 测试 / 文档 | S8-STORY-005 |
| 2026-06-04 | Sprint 8 | **S8-STORY-005 Done**；merge `feature/s8-story-005-fidelity-matrix` → sprint | 测试 / Git | S8-STORY-005 |
| 2026-06-04 | Sprint 8 | **S8-STORY-006 Done**：Paste QA · PO 19 行 Matrix/Drift 同步 · overlay · Drift 001–009 | 文档 / 测试 | S8-STORY-006 |
| 2026-06-04 | Sprint 8 | **S8-STORY-006B**：结构化样式调研 · 文章采集 · Pattern Library v0.1 · Drift triage · DECISION-091 | 文档 / 研究 | S8-STORY-006B |
| 2026-06-04 | Sprint 8 | **S8-STORY-006B Done**（用户确认）：结构化调研 · L0 HARVEST · Pattern v0.1 · Drift triage | 文档 | S8-STORY-006B |
| 2026-06-04 | Sprint 8 | **S8-STORY-006B-FIX-A**：harvest evidence L0–L4 · URL/HTML 输入模板 · AI extraction guide · HARVEST 标 L0 | 文档 | S8-STORY-006B-FIX-A |
| 2026-06-04 | Sprint 8 | **S8-STORY-006B / 006B-FIX-A Done**（用户确认）：merge `docs/s8-story-006b-fix-harvest-extraction-workflow` → sprint；首条 L2 `WX-HARVEST-EVIDENCE-001` | 文档 / Git | S8-STORY-006B, S8-STORY-006B-FIX-A |
| 2026-06-04 | Sprint 8 | **S8-STORY-006C**：copy-safe primitives · A/B/C Copy 修复 · harvest candidates · Matrix/Drift 更新 | 代码 / 测试 | S8-STORY-006C |
| 2026-06-04 | Sprint 8 | **S8-STORY-006C Done**（用户确认）：merge `feature/s8-story-006c-harvest-pattern-candidate-fix` → sprint；paste 修复待 006D | 代码 / Git | S8-STORY-006C |
| 2026-06-05 | Sprint 8 | **S8-STORY-006D**（Mode A）：006D QA pack · Session 模板 · Matrix 006D queue · overlay `20260605_006D` · 15 snapshots | 文档 / 测试 | S8-STORY-006D |
| 2026-06-05 | Sprint 8 | **S8-STORY-006D Done**（Mode B）：PO 15 行 PASS · 8 Drift resolved · 2 harvest candidate-paste-pass · merge sprint | 文档 / 测试 / Git | S8-STORY-006D |
| 2026-06-05 | Sprint 8 | merge `docs/s8-story-006d-matrix-regression-paste-retest` → sprint @ `f6d8d06` | Git | S8-STORY-006D |
| 2026-06-05 | Sprint 8 / 9 | **S8-STORY-008 Done**：Sprint 9 Style Management System v0 重排 · S9-STORY-001~009 草案 · S10 方向 · DECISION-092 | 文档 | S8-STORY-008 |
| 2026-06-05 | Sprint 8 | merge `docs/s8-story-008-s9-style-management-replanning` → sprint @ `301f73a` | Git | S8-STORY-008 |
| 2026-06-05 | Sprint 8 | **S8-STORY-007 Done**：HEAD-002 validator false positive 审计 · no S8 code change | 文档 | S8-STORY-007 |
| 2026-06-05 | Sprint 8 | **S8-DRIFT-003 Done**：`title_plain_minimal` 产品澄清 · NOT renderer bug · NO S8 code change | 文档 / Matrix | S8-DRIFT-003 |
| 2026-06-05 | Sprint 8 | **S8-STORY-009 In Review**：Contract & Fidelity audit · Grade A- · P0=0 · S9 启动条件清单 | 文档 | S8-STORY-009 |
| 2026-06-05 | Sprint 8 | **Sprint 8 Closed**：merge `sprint/s8-wechat-safe-css-contract` → `release/1` @ `806fa47` · DECISION-093 | Git / 文档 | DECISION-093 |

---

## 2026-06-05 · Sprint 9

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
|------|--------|----------|----------|----------------------|
| 2026-06-05 | Sprint 9 | **Sprint 9 启动**：从 `release/1` 创建 `sprint/s9-style-management-system-v0` · DECISION-094 | Git / 文档 | DECISION-094 |
| 2026-06-05 | Sprint 9 | **S9-STORY-001 Done**：Style Management Domain Model · [`style-management-domain-model.md`](../architecture/style-management-domain-model.md) | 文档 / 架构 | S9-STORY-001 · DECISION-094 |
| 2026-06-05 | Sprint 9 | merge `docs/s9-story-001-domain-model` → `sprint/s9-style-management-system-v0` @ `263227b` | Git | S9-STORY-001 |
| 2026-06-05 | Sprint 9 | **S9-STORY-002 Done**：File-backed Style Library Storage · `src/core/style-library/` · DECISION-095 | 代码 / 文档 | S9-STORY-002 · DECISION-095 |
| 2026-06-05 | Sprint 9 | merge `feature/s9-story-002-file-backed-style-library-storage` → `sprint/s9-style-management-system-v0` @ `859c0ed` | Git | S9-STORY-002 |
| 2026-06-05 | Sprint 9 | 新增跨项目迁移指导 [`preview-copy-fidelity-implementation-guide.md`](../architecture/preview-copy-fidelity-implementation-guide.md)（Preview/Copy 一致性萃取） | 文档 / 架构 | — |
| 2026-06-05 | Sprint 9 | **S9-STORY-003 Done**：Style Library Admin Shell · `/dev/style-library` · DECISION-096 | 代码 / 文档 | S9-STORY-003 · DECISION-096 |
| 2026-06-05 | Sprint 9 | **S9-PLANNING-REFRAME**：DECISION-097 operator-facing acceptance · 调整 S9 Story 004~009 验收口径 | 文档 / 敏捷 | DECISION-097 · S9-STORY-003-FIX-A |
| 2026-06-05 | Sprint 9 | **S9-STORY-003-FIX-A**：Style Library Workbench operator UX reframe · `/dev/style-library` | 代码 / 文档 | S9-STORY-003-FIX-A · DECISION-097 |
| 2026-06-05 | Sprint 9 | **S9-STORY-003-FIX-B**：Style Library Workbench zh/en i18n toggle · DECISION-098 | 代码 / 文档 | S9-STORY-003-FIX-B · DECISION-098 |
| 2026-06-05 | Sprint 9 | merge `feature/s9-story-003-style-library-admin-shell` → `sprint/s9-style-management-system-v0` @ `35000ab` · 用户确认接受 S9-STORY-003 / FIX-A / FIX-B | Git | S9-STORY-003 |
| 2026-06-05 | Sprint 9 | **S9-STORY-004 Done**：merge lifecycle management → sprint @ `7300b9f` | Git | S9-STORY-004 |
| 2026-06-05 | Sprint 9 | **S9-STORY-006-FIX-A**：WARNING readiness 运营文案 · blocked/warnings summary 计数 refinement | 代码 / 文档 | S9-STORY-006 |
| 2026-06-05 | Sprint 9 | **S9-STORY-007 In Review**：Promote to user_selectable · proposal-based review · DECISION-101 · [`style-library-promote-user-selectable.md`](../architecture/style-library-promote-user-selectable.md) | 代码 / 文档 | S9-STORY-007 · DECISION-101 |
| 2026-06-05 | Sprint 9 | **S9-STORY-008 In Review**：Style / Palette / Rule Management v0 · DECISION-102 · [`style-palette-rule-management-v0.md`](../architecture/style-palette-rule-management-v0.md) | 代码 / 文档 | S9-STORY-008 · DECISION-102 |
