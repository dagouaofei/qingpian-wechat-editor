# Changelog

> 轻篇公众号排版 · qingpian-wechat-editor

## 记录格式

| 日期 | Sprint | 变更摘要 | 影响范围 | 关联 Story / Decision |
| ---- | ------ | -------- | -------- | --------------------- |

---

## 2026-05-30 · Sprint 1-A

| 日期       | Sprint     | 变更摘要                                                                                                                  | 影响范围    | 关联 Story / Decision          |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| 2026-05-30 | Sprint 1-A | 初始化 qingpian-wechat-editor 正式项目（Next.js + TypeScript + Tailwind + ESLint + Prettier + Vitest + Playwright + Zod） | 工程        | S1-STORY-001                   |
| 2026-05-30 | Sprint 1-A | 建立 `.cursor/rules/` 六类项目规则                                                                                        | 开发约束    | S1-STORY-002, DECISION-003     |
| 2026-05-30 | Sprint 1-A | 建立 docs/agile 敏捷文档体系                                                                                              | 项目管理    | S1-STORY-003                   |
| 2026-05-30 | Sprint 1-A | 建立 docs/product 产品文档体系                                                                                            | 产品        | S1-STORY-004, DECISION-004     |
| 2026-05-30 | Sprint 1-A | 建立 docs/architecture 架构文档骨架                                                                                       | 架构        | S1-STORY-005, DECISION-005~006 |
| 2026-05-30 | Sprint 1-A | 沉淀 Sprint 2 候选目标（A/B/C 三方向）                                                                                    | 敏捷规划    | S1-STORY-006                   |
| 2026-05-30 | Sprint 1-A | 沉淀旧一键成稿历史经验（prototype-lessons、migration-reference）                                                          | 架构 / 迁移 | S1-STORY-007, DECISION-009     |
| 2026-05-30 | Sprint 1-A | Git 初始化，Sprint 1-A commit 至 main 分支                                                                                | 工程治理    | S1-STORY-008                   |

---

## 2026-05-30 · Sprint 1-B

| 日期       | Sprint     | 变更摘要                                                                         | 影响范围 | 关联 Story / Decision          |
| ---------- | ---------- | -------------------------------------------------------------------------------- | -------- | ------------------------------ |
| 2026-05-30 | Sprint 1-B | Sprint 1 范围扩展，去除 1 人/1 周约束                                            | 敏捷     | DECISION-011~013               |
| 2026-05-30 | Sprint 1-B | 建立 Git 工作流文档与分支策略，完善 .gitignore                                   | 工程治理 | S1-STORY-008, DECISION-016~017 |
| 2026-05-30 | Sprint 1-B | article-schema.md / block-schema.md 升级为正式技术方案                           | 架构     | S1-STORY-009                   |
| 2026-05-30 | Sprint 1-B | style-system.md 升级为正式技术方案（theme/preset/variant/registry/slot/density） | 架构     | S1-STORY-010, DECISION-014     |
| 2026-05-30 | Sprint 1-B | rendering-pipeline.md 升级为正式技术方案                                         | 架构     | S1-STORY-011                   |
| 2026-05-30 | Sprint 1-B | copy-to-wechat-pipeline.md / wechat-copy-style-rules.md 升级为正式方案           | 架构     | S1-STORY-012                   |
| 2026-05-30 | Sprint 1-B | generation-pipeline.md 升级为正式技术方案                                        | 架构     | S1-STORY-013                   |
| 2026-05-30 | Sprint 1-B | 核心技术方案一致性审查，修正 architecture-overview 等文档                        | 架构     | S1-STORY-014, DECISION-018     |
| 2026-05-30 | Sprint 1-B | 更新 sprint-plan / sprint-backlog / decisions / changelog                        | 敏捷     | S1-STORY-015                   |

---

## 2026-05-30 · Sprint 1-B（进行中）

| 日期       | Sprint     | 变更摘要                                                                                                                                                                                                             | 影响范围    | 关联 Story / Decision          |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| 2026-05-30 | Sprint 1-B | 建立 execution report 协作机制                                                                                                                                                                                       | 协作 / 规则 | S1-STORY-016, DECISION-019     |
| 2026-05-30 | Sprint 1-B | 新增 execution-reports 目录与模板                                                                                                                                                                                    | 敏捷        | S1-STORY-016                   |
| 2026-05-30 | Sprint 1-B | 更新 Cursor 项目规则（agile-rules、collaboration-rules）                                                                                                                                                             | 开发约束    | S1-STORY-016                   |
| 2026-05-30 | Sprint 1-B | 更新 chatgpt-cursor-docs-workflow.md 协作流                                                                                                                                                                          | 协作        | S1-STORY-016                   |
| 2026-05-30 | Sprint 1-B | Sprint 1-B 整体状态调整为 In Review                                                                                                                                                                                  | 敏捷        | S1-STORY-016                   |
| 2026-05-30 | Sprint 1-B | 建立 Sprint 分支与迭代内工作分支规则                                                                                                                                                                                 | Git / 协作  | S1-STORY-017, DECISION-020     |
| 2026-05-30 | Sprint 1-B | 更新 git-workflow.md 分支模型与合并规则                                                                                                                                                                              | Git         | S1-STORY-017                   |
| 2026-05-30 | Sprint 1-B | 更新 Cursor 项目规则（project/agile/collaboration）                                                                                                                                                                  | 开发约束    | S1-STORY-017                   |
| 2026-05-30 | Sprint 1-B | 更新 chatgpt-cursor-docs-workflow.md                                                                                                                                                                                 | 协作        | S1-STORY-017                   |
| 2026-05-30 | Sprint 1-B | Sprint 1-B 保持 In Review                                                                                                                                                                                            | 敏捷        | S1-STORY-017                   |
| 2026-05-30 | Sprint 1-B | A/B 架构独立 audit                                                                                                                                                                                                   | 架构        | architecture-ab-audit          |
| 2026-05-30 | Sprint 1-B | Release 1 整体架构定稿（唯一 architecture-overview.md）                                                                                                                                                              | 架构        | S1-STORY-020, DECISION-023     |
| 2026-05-30 | Sprint 1-B | GenerationEvent 统一为 block.start/delta/complete                                                                                                                                                                    | 架构        | DECISION-024                   |
| 2026-05-30 | Sprint 1-B | StyleDefinition 最小模型与 Copy Fidelity DoD 定稿                                                                                                                                                                    | 架构        | DECISION-025~027               |
| 2026-05-30 | Sprint 1-B | Style Import Adapter 扩展点预留                                                                                                                                                                                      | 架构        | DECISION-028                   |
| 2026-05-30 | Sprint 1-B | 架构定稿合并前修复：纳入 prototype architecture lessons reference，明确 preview_only 不计入 Release 1 正式交付                                                                                                       | 架构        | S1-STORY-020                   |
| 2026-05-30 | Sprint 1-B | Release 1 architecture overview finalized and merged into sprint governance branch                                                                                                                                   | 架构 / Git  | S1-STORY-020                   |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-021 实现前契约缺口修正；补充 InlineContent、Style 命名边界、slot copy-safe、WeChatCompatibilityProfile；调整 Sprint 2~6 计划                                                                           | 架构 / 敏捷 | S1-STORY-021, DECISION-029~033 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-022；基于 prototype-style-system-technical-lessons.md 对 S1-STORY-021 修正方案二次审计；Sprint 1-B 保持 In Review                                                                                      | 架构 / 敏捷 | S1-STORY-022                   |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-024：Component DSL 能力对齐与 Style System 补强；…DECISION-036~038；Sprint 1-B 保持 In Review                                                                                                          | 架构 / 敏捷 | S1-STORY-024, DECISION-036~038 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-025：Style System 实现前收口；…DECISION-039~042；Sprint 1-B 保持 In Review                                                                                                                             | 架构 / 敏捷 | S1-STORY-025, DECISION-039~042 |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-026：S1-STORY-025 二次审计；…S1-STORY-025 分级 B 可 merge；Sprint 1-B 保持 In Review                                                                                                                   | 架构 / 敏捷 | S1-STORY-026                   |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-027：Release 1 样式范围与 Sprint 拆分收口；first wave 11×3、expansion 11×5 target、magazine_left_bar_title 降为 candidate、Sprint 3-A/B/C & 4-A/B & 6-A/B；DECISION-043~045；Sprint 1-B 保持 In Review | 架构 / 敏捷 | S1-STORY-027, DECISION-043~045 |
| 2026-05-30 | Sprint 1-B | Merge S1-STORY-025 → 026 → 027 文档链至 `sprint/s1b-core-tech-governance`；Sprint 1-B 保持 In Review                                                                                                                 | Git / 敏捷  | S1-STORY-025~027               |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-028：Sprint 1-B 总 Audit；分级 B；P0=0 P1=9 P2=5；025~027 已在 sprint merge；Sprint 1-B 保持 In Review                                                                                                 | 架构 / 敏捷 | S1-STORY-028                   |
| 2026-05-30 | Sprint 1-B | Merge S1-STORY-028 final audit 至 `sprint/s1b-core-tech-governance`（`25b9bad`）                                                                                                                                     | Git / 敏捷  | S1-STORY-028                   |
| 2026-05-30 | Sprint 1-B | 新增 S1-STORY-029：Sprint 1-B 关闭前状态同步；同步 S1-STORY-021~028 Done；登记 TECH-ARCH-023 Style Quality Gate；补充 Close Readiness Checklist；Sprint 1-B 保持 In Review                                           | 敏捷        | S1-STORY-029, TECH-ARCH-023    |
| 2026-05-30 | Sprint 1-B | **关闭 Sprint 1-B**；修复 architecture-overview §19 P1-010；S1-STORY-029 Done；DECISION-051；Sprint 2 未启动                                                                                                         | 敏捷 / 架构 | S1-STORY-029, DECISION-051     |

---

## 2026-05-31 · Release 1 主干

| 日期       | Sprint    | 变更摘要                                                                                   | 影响范围   | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------ | ---------- | --------------------- |
| 2026-05-31 | Release 1 | 建立 `release/1` 作为 Release 1 主干；`sprint/s1b-core-tech-governance` merge 至 release/1 | Git        | DECISION-052          |
| 2026-05-31 | Release 1 | 清理 Sprint 1-B 全部 15 个 `docs/s1b-*` story 工作分支（含已 merge 与未 merge）            | Git        | DECISION-052          |
| 2026-05-31 | Release 1 | 更新 git-workflow.md：main ← release ← sprint ← work 四层分支模型                          | Git / 协作 | DECISION-052          |

---

## 2026-05-31 · Sprint 2

| 日期       | Sprint    | 变更摘要                                                                               | 影响范围    | 关联 Story / Decision      |
| ---------- | --------- | -------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| 2026-05-31 | Sprint 2  | **正式启动 Sprint 2**；范围 Article / Block Schema + InlineContent 代码契约            | 敏捷 / 架构 | S2-STORY-001, DECISION-053 |
| 2026-05-31 | Sprint 2  | 从 `release/1` 建立 `sprint/s2-article-block-schema`                                   | Git         | DECISION-053               |
| 2026-05-31 | Sprint 2  | 新增 Sprint 2 Backlog S2-STORY-001~007                                                 | 敏捷        | S2-STORY-001               |
| 2026-05-31 | Sprint 2  | 实现 InlineContent / InlineMark 代码契约（TS + Zod + normalize + 单测）                | 代码 / 架构 | S2-STORY-002               |
| 2026-05-31 | Sprint 2  | S2-STORY-002 merge 至 sprint 分支（`ba149fe`）；状态 Done                              | Git / 敏捷  | S2-STORY-002               |
| 2026-05-31 | Sprint 2  | 实现 Block Schema 代码契约（11 block TS + Zod union + 单测）                           | 代码 / 架构 | S2-STORY-003               |
| 2026-05-31 | Sprint 2  | S2-STORY-003 merge 至 sprint 分支（`93c6526`）；状态 Done                              | Git / 敏捷  | S2-STORY-003               |
| 2026-05-31 | Sprint 2  | 实现 Article Schema 代码契约（Article TS + Zod + blockSchema 复用 + 单测）             | 代码 / 架构 | S2-STORY-004               |
| 2026-05-31 | Sprint 2  | S2-STORY-004 merge 至 sprint 分支（`d68e503`）；状态 Done                              | Git / 敏捷  | S2-STORY-004               |
| 2026-05-31 | Sprint 2  | 实现 schema parse / validate / normalize helper（Article + Block + validation result） | 代码 / 架构 | S2-STORY-005               |
| 2026-05-31 | Sprint 2  | S2-STORY-005 merge 至 sprint 分支（`9a7d625`）；状态 Done                              | Git / 敏捷  | S2-STORY-005               |
| 2026-05-31 | Sprint 2  | 新增基础 Article fixtures 与 schema 回归测试（4 fixtures + invalid cases）             | 测试 / 架构 | S2-STORY-006               |
| 2026-05-31 | Sprint 2  | S2-STORY-006 merge 至 sprint 分支（`049b427`）；状态 Done                              | Git / 敏捷  | S2-STORY-006               |
| 2026-05-31 | Sprint 2  | 完成 Sprint 2 contract audit（P0=0；grade A）；Sprint 2 进入 Close Readiness           | 架构 / 敏捷 | S2-STORY-007               |
| 2026-05-31 | Sprint 2  | 完成 Sprint 2 code audit（P0=0；grade A）                                              | 架构 / 敏捷 | S2-CODE-AUDIT-001          |
| 2026-05-31 | Sprint 2  | **正式关闭 Sprint 2**；用户确认 contract + code audit；DECISION-054                    | 敏捷        | S2-STORY-007               |
| 2026-05-31 | Release 1 | `sprint/s2-article-block-schema` merge 至 `release/1`                                  | Git         | DECISION-054               |

---

## 2026-05-31 · Sprint 3-A

| 日期       | Sprint     | 变更摘要                                                                                                   | 影响范围    | 关联 Story / Decision        |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| 2026-05-31 | Sprint 3-A | **正式启动 Sprint 3-A**；范围 Style System Contract & Registry Infrastructure                              | 敏捷 / 架构 | S3A-STORY-001, DECISION-055  |
| 2026-05-31 | Sprint 3-A | 从 `release/1` 建立 `sprint/s3a-style-system-infra`                                                        | Git         | DECISION-055                 |
| 2026-05-31 | Sprint 3-A | 新增 Sprint 3-A Backlog S3A-STORY-001~007                                                                  | 敏捷        | S3A-STORY-001                |
| 2026-05-31 | Sprint 3-A | 实现 Style System 基础类型与 schema 契约（Theme / Preset / Variant / Registry）                            | 代码 / 架构 | S3A-STORY-002                |
| 2026-05-31 | Sprint 3-A | 实现 ResolvedStyle 与 StyleResolver 最小实现（resolveArticleStyle / resolveBlockStyle + fallback）         | 代码 / 架构 | S3A-STORY-003                |
| 2026-05-31 | Sprint 3-A | S3A-STORY-002 标记 Done；用户确认 StyleResolver explicit→preset_default 语义（DECISION-056）               | 敏捷 / 架构 | S3A-STORY-002, DECISION-056  |
| 2026-05-31 | Sprint 3-A | S3A-STORY-003 merge 至 `sprint/s3a-style-system-infra`（`85ffcbd`）；状态 Done                             | Git / 敏捷  | S3A-STORY-003                |
| 2026-05-31 | Sprint 3-A | 实现 WeChatCompatibilityProfile 机器可读契约与 copy-safe validation helper                                 | 代码 / 架构 | S3A-STORY-004                |
| 2026-05-31 | Sprint 3-A | S3A-STORY-004 merge 至 `sprint/s3a-style-system-infra`（`11a3d11`）；状态 Done                             | Git / 敏捷  | S3A-STORY-004                |
| 2026-05-31 | Sprint 3-A | 实现 StyleValidationResult / FallbackVariantPolicy；copySafety 统一为 `strict \| balanced \| preview_only` | 代码 / 架构 | S3A-STORY-005                |
| 2026-05-31 | Sprint 3-A | S3A-STORY-005 merge 至 `sprint/s3a-style-system-infra`（`bcd6947`）；状态 Done；用户确认验收               | Git / 敏捷  | S3A-STORY-005                |
| 2026-05-31 | Sprint 3-A | S3A-STORY-005 merge 至 sprint（前置）；实现 TitleBlockLayoutCompatibility 契约                             | 代码 / 架构 | S3A-STORY-005, S3A-STORY-006 |
| 2026-05-31 | Sprint 3-A | S3A-STORY-006 merge 至 `sprint/s3a-style-system-infra`（`f44a131`）；状态 Done                             | Git / 敏捷  | S3A-STORY-006                |
| 2026-05-31 | Sprint 3-A | Sprint 3-A contract audit（grade A，P0=0）；Close Readiness                                                | 架构 / 敏捷 | S3A-STORY-007                |
| 2026-05-31 | Sprint 3-A | 用户确认接受 contract audit（A，P0=0，P1=4，P2=3）                                                         | 敏捷        | S3A-STORY-007                |
| 2026-05-31 | Sprint 3-A | **正式关闭 Sprint 3-A**；DECISION-057                                                                      | 敏捷        | S3A-STORY-007, DECISION-057  |
| 2026-05-31 | Release 1  | `sprint/s3a-style-system-infra` merge 至 `release/1`                                                       | Git         | DECISION-057                 |

---

## 2026-05-31 · Sprint 3-B

| 日期       | Sprint     | 变更摘要                                                                                                            | 影响范围    | 关联 Story / Decision       |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------- |
| 2026-05-31 | Sprint 3-B | **正式启动 Sprint 3-B**；范围 First-wave Required Variant Registry                                                  | 敏捷 / 架构 | S3B-STORY-001, DECISION-058 |
| 2026-05-31 | Sprint 3-B | 从 `release/1` 建立 `sprint/s3b-first-wave-variant-registry`                                                        | Git         | DECISION-058                |
| 2026-05-31 | Sprint 3-B | 新增 Sprint 3-B Backlog S3B-STORY-001~007                                                                           | 敏捷        | S3B-STORY-001               |
| 2026-05-31 | Sprint 3-B | P1-S3A-001 / P2-S3A-002 纳入 Sprint 3-B planning（S3B-STORY-002 前置）                                              | 架构 / 敏捷 | S3B-STORY-002               |
| 2026-05-31 | Sprint 3-B | titleBlock catalog layoutMode mapping + slot copySafety 收口                                                        | 代码 / 架构 | S3B-STORY-002               |
| 2026-05-31 | Sprint 3-B | merge `feature/s3b-titleblock-mapping-slot-copysafety` → sprint                                                     | Git         | S3B-STORY-002               |
| 2026-05-31 | Sprint 3-B | 实现 title / heading first-wave 6 variants registry                                                                 | 代码 / 架构 | S3B-STORY-003               |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-title-heading-variants` → sprint（`ba062ae`）                                                    | Git         | S3B-STORY-003               |
| 2026-06-01 | Sprint 3-B | 实现 lead / paragraph / divider / list first-wave 12 variants registry                                              | 代码 / 架构 | S3B-STORY-004               |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-text-first-variants` → sprint（`3350777`）                                                       | Git         | S3B-STORY-004               |
| 2026-06-01 | Sprint 3-B | 实现 quote / highlight / info_card / cta / image_placeholder first-wave 15 variants registry；形成 33 variants 聚合 | 代码 / 架构 | S3B-STORY-005               |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-structured-block-variants` → sprint（`f5771eb`）                                                 | Git         | S3B-STORY-005               |
| 2026-06-01 | Sprint 3-B | 建立 first-wave 33 variants coverage 与 registry validation gate                                                    | 测试 / 架构 | S3B-STORY-006               |
| 2026-06-01 | Sprint 3-B | merge `feature/s3b-first-wave-coverage` → sprint（`7837dce`）                                                       | Git         | S3B-STORY-006               |
| 2026-06-01 | Sprint 3-B | Sprint 3-B contract audit（grade A，P0=0）；Close Readiness                                                         | 架构 / 敏捷 | S3B-STORY-007               |
| 2026-06-01 | Sprint 3-B | 用户确认接受 Sprint 3-B contract audit（grade A，P0=0，P1=5，P2=3）；33 variants coverage 完整                      | 敏捷 / 架构 | S3B-STORY-007, DECISION-059 |
| 2026-06-01 | Sprint 3-B | Sprint 3-B 正式关闭；merge `sprint/s3b-first-wave-variant-registry` → `release/1`（`9040ef9`）                      | Git / 敏捷  | S3B-STORY-007, DECISION-059 |

---

## 2026-06-01 · Sprint 4-A

| 日期       | Sprint     | 变更摘要                                                                                                                                                        | 影响范围               | 关联 Story / Decision       |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------- |
| 2026-06-01 | Sprint 4-A | **正式启动 Sprint 4-A**；范围 Preview / Copy Renderer for Text-first Blocks                                                                                     | 敏捷 / 架构            | S4A-STORY-001, DECISION-060 |
| 2026-06-01 | Sprint 4-A | 从 `release/1` 建立 `sprint/s4a-text-first-renderer`                                                                                                            | Git                    | DECISION-060                |
| 2026-06-01 | Sprint 4-A | 新增 Sprint 4-A Backlog S4A-STORY-001~007                                                                                                                       | 敏捷                   | S4A-STORY-001               |
| 2026-06-01 | Sprint 4-A | 修正 Sprint 3-B 状态漂移；同步 sprint-plan / product-backlog                                                                                                    | 敏捷                   | S4A-STORY-001               |
| 2026-06-01 | Sprint 4-A | Sprint 3-B audit 遗留中与 4-A 相关项纳入 Sprint 4-A planning                                                                                                    | 架构 / 敏捷            | DECISION-060                |
| 2026-06-01 | Sprint 4-A | 明确 Sprint 3-C 未取消、仅延后（建议在 Sprint 5 前或 4-A/4-B 后启动）                                                                                           | 敏捷                   | DECISION-060                |
| 2026-06-01 | Sprint 4-A | 完成 text-first Preview / Copy Renderer 最小闭环（title / heading / lead / paragraph / divider）；Copy HTML snapshot / Clipboard payload / Paste QA seed 已建立 | Renderer / Copy / 测试 | S4A-STORY-002~006           |
| 2026-06-01 | Sprint 4-A | 完成 Sprint 4-A Renderer Contract Audit；Grade A，P0=0，P1=4，P2=1；Sprint 4-A 进入 Close Readiness，待用户确认关闭                                             | 架构 / 敏捷            | S4A-STORY-007               |
| 2026-06-01 | Sprint 4-A | 用户确认接受 Sprint 4-A renderer contract audit（grade A，P0=0，P1=4，P2=1）                                                                                    | 敏捷 / 架构            | S4A-STORY-007, DECISION-061 |
| 2026-06-01 | Sprint 4-A | Sprint 4-A 正式关闭；merge `sprint/s4a-text-first-renderer` → `release/1`（`b2efdb2`）                                                                          | Git / 敏捷             | S4A-STORY-007, DECISION-061 |

---

## 2026-06-01 · Sprint 4-B

| 日期       | Sprint     | 变更摘要                                                                                                                                                                                                                                                                                              | 影响范围               | 关联 Story / Decision       |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------- |
| 2026-06-01 | Sprint 4-B | **正式启动 Sprint 4-B**；范围 Preview / Copy Renderer for Structured Blocks                                                                                                                                                                                                                           | 敏捷 / 架构            | S4B-STORY-001, DECISION-062 |
| 2026-06-01 | Sprint 4-B | 从 `release/1` 建立 `sprint/s4b-structured-block-renderer`                                                                                                                                                                                                                                            | Git                    | DECISION-062                |
| 2026-06-01 | Sprint 4-B | 新增 Sprint 4-B Backlog S4B-STORY-001~007                                                                                                                                                                                                                                                             | 敏捷                   | S4B-STORY-001               |
| 2026-06-01 | Sprint 4-B | 同步 sprint-plan / product-backlog；Sprint 4-B 前置遗留纳入 planning                                                                                                                                                                                                                                  | 敏捷 / 架构            | S4B-STORY-001               |
| 2026-06-01 | Sprint 4-B | 明确 cta / image_placeholder 为 Release 1 占位契约；不实现真实 QR / 外链 / 图片能力                                                                                                                                                                                                                   | 架构 / Renderer        | DECISION-062                |
| 2026-06-01 | Sprint 4-B | Sprint 3-C 仍保持延后未取消                                                                                                                                                                                                                                                                           | 敏捷                   | DECISION-062                |
| 2026-06-01 | Sprint 4-B | 实现 list Preview / Copy Renderer，覆盖 `list_plain_bullets` / `list_numbered_steps` / `list_checklist_cards`；lint / test（397）/ build PASS                                                                                                                                                         | Renderer / Copy / 测试 | S4B-STORY-002               |
| 2026-06-01 | Sprint 4-B | S4B-STORY-002 审核通过；merge `feature/s4b-list-renderer` → `sprint/s4b-structured-block-renderer`（`611a2a1`）；随 merge 纳入 S4A story branch cleanup report                                                                                                                                        | Git / 敏捷             | S4B-STORY-002               |
| 2026-06-01 | Sprint 4-B | 实现 quote / highlight Preview + Copy Renderer，覆盖 6 variants；lint / test（424）/ build PASS                                                                                                                                                                                                       | Renderer / Copy / 测试 | S4B-STORY-003               |
| 2026-06-01 | Sprint 4-B | S4B-STORY-003 审核通过；merge `feature/s4b-quote-highlight-renderer` → `sprint/s4b-structured-block-renderer`（`4d3967e`）                                                                                                                                                                            | Git / 敏捷             | S4B-STORY-003               |
| 2026-06-01 | Sprint 4-B | 实现 info_card Preview + Copy Renderer，覆盖 3 variants；lint / test（443）/ build PASS                                                                                                                                                                                                               | Renderer / Copy / 测试 | S4B-STORY-004               |
| 2026-06-01 | Sprint 4-B | S4B-STORY-004 审核通过；merge `feature/s4b-info-card-renderer` → `sprint/s4b-structured-block-renderer`（`02492ec`）                                                                                                                                                                                  | Git / 敏捷             | S4B-STORY-004               |
| 2026-06-01 | Sprint 4-B | 实现 cta / image_placeholder Preview + Copy Renderer，覆盖 6 variants；明确 Release 1 占位契约边界（无真实 QR / 链接 / 小程序 / 图片能力）；lint / test（475）/ build PASS                                                                                                                            | Renderer / Copy / 测试 | S4B-STORY-005               |
| 2026-06-01 | Sprint 4-B | 建立 structured blocks Copy HTML snapshot seed（18 variants）与 first-wave 33 variants 最小 Paste QA plan；Paste QA 状态全部 Not Run；lint / test（491）/ build PASS                                                                                                                                  | Copy / QA Plan / 测试  | S4B-STORY-006               |
| 2026-06-01 | Sprint 4-B | S4B-STORY-006 审核通过；merge `feature/s4b-structured-copy-snapshot-paste-plan` → `sprint/s4b-structured-block-renderer`（`c13f0e1`）                                                                                                                                                                 | Git / 敏捷             | S4B-STORY-006               |
| 2026-06-01 | Sprint 4-B | 完成 Renderer Contract Audit；Grade A，P0=0 / P1=4 / P2=2；Sprint 4-B 进入 Close Readiness，待用户确认关闭；lint / test（491）/ build PASS                                                                                                                                                            | Audit / 敏捷 / 架构    | S4B-STORY-007               |
| 2026-06-01 | Sprint 4-B | **正式关闭 Sprint 4-B**；S4B-STORY-001~007 Done；structured blocks 18 variants Preview / Copy Renderer、structured snapshot seed、first-wave 33 variants Paste QA plan 完成；Paste QA 全部 Not Run；确认 merge `sprint/s4b-structured-block-renderer` → `release/1`；未 merge main，未启动后续 Sprint | 敏捷 / Git / Release   | DECISION-063                |

---

## 2026-06-01 · Sprint 3-C

| 日期       | Sprint     | 变更摘要                                                                                                                                                                | 影响范围     | 关联 Story / Decision        |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------- |
| 2026-06-01 | Sprint 3-C | **正式启动 Sprint 3-C**；范围 Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry                                                              | 敏捷 / 架构  | S3C-STORY-001, DECISION-064  |
| 2026-06-01 | Sprint 3-C | 从 `release/1` 建立 `sprint/s3c-style-assignment-validation`                                                                                                            | Git          | DECISION-064                 |
| 2026-06-01 | Sprint 3-C | 新增 Sprint 3-C Backlog S3C-STORY-001~006                                                                                                                               | 敏捷         | S3C-STORY-001                |
| 2026-06-01 | Sprint 3-C | 同步 sprint-plan / product-backlog / decisions；P1-003 与 TECH-ARCH-010~012 / TECH-ARCH-017 纳入 Sprint 3-C planning                                                    | 敏捷 / 架构  | S3C-STORY-001                |
| 2026-06-01 | Sprint 3-C | 明确 Sprint 3-C 不做 Renderer / Generation / Paste QA；expansion variants 仅规划不实现 registry                                                                         | 架构         | DECISION-064                 |
| 2026-06-01 | Sprint 3-C | Sprint 3-A / 3-B / 4-A / 4-B 保持 Closed；不自动启动 Sprint 5 / Sprint 6-A                                                                                              | 敏捷         | DECISION-064                 |
| 2026-06-01 | Sprint 3-C | 实现 Style Assignment Contract（StyleSelectionRequest / StyleAssignmentPatch / ArticleStylePlan + patch merge helper）；17 新测试；lint / test（508）/ build PASS       | 代码 / 架构  | S3C-STORY-002                |
| 2026-06-01 | Sprint 3-C | 实现 StyleOrchestrator 最小规则 R1/R2/R8 与 Block→Variant fallback；21 新测试；lint / test（529）/ build PASS                                                           | 代码 / 架构  | S3C-STORY-003                |
| 2026-06-01 | Sprint 3-C | 实现 VisualAssetRegistry（19 内置 assets）+ ComponentProtocol / BlockVisualProtocol / Theme·Preset·Density·Slot 组合边界校验；34 新测试；lint / test（563）/ build PASS | 代码 / 架构  | S3C-STORY-004, TECH-ARCH-010 |
| 2026-06-01 | Sprint 3-C | S3C-STORY-004 审核通过；merge `feature/s3c-visual-asset-protocol-validation` → `sprint/s3c-style-assignment-validation`（`3faddb4`）                                    | Git / 敏捷   | S3C-STORY-004                |
| 2026-06-01 | Sprint 3-C | 实现 Style Selection Validation Pipeline + 10 fixtures + validation snapshot seeds；29 新测试；lint / test（592）/ build PASS                                           | 代码 / 架构  | S3C-STORY-005, TECH-ARCH-017 |
| 2026-06-01 | Sprint 3-C | S3C-STORY-005 审核通过；merge `feature/s3c-style-selection-validation-fixtures` → `sprint/s3c-style-assignment-validation`（`8473235`）                                 | Git / 敏捷   | S3C-STORY-005                |
| 2026-06-01 | Sprint 3-C | 完成 Style System Contract Audit（Grade A；P0=0/P1=5/P2=4）；expansion variants 规划；Sprint 3-C 进入 Close Readiness                                                   | Audit / 敏捷 | S3C-STORY-006                |
| 2026-06-01 | Sprint 3-C | **正式关闭 Sprint 3-C**；用户确认 audit 结论；S3C-STORY-001~006 Done；DECISION-065                                                                                      | 敏捷         | DECISION-065                 |
| 2026-06-01 | Sprint 3-C | merge `sprint/s3c-style-assignment-validation` → `release/1`（`8ce4eed`）；audit Grade A · P0=0 · P1=5 · P2=4；592 tests PASS                                           | Git / 敏捷   | DECISION-065                 |

---

## 2026-06-02 · Sprint 5 计划变更

| 日期       | Sprint   | 变更摘要                                                                                                                                      | 影响范围    | 关联 Story / Decision       |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------- |
| 2026-06-02 | Sprint 5 | **Sprint 5 计划变更**：由「Generation / Streaming + 受控 AI 样式选择最小闭环」调整为「Generation / Streaming + Release 1 真实 UI 主流程闭环」 | 敏捷 / 架构 | DECISION-066                |
| 2026-06-02 | Sprint 5 | 新增 Release 1 真实 UI 主流程闭环要求：Sprint 5 结束时必须在真实页面手动跑通输入 → 生成 → 预览 → 复制                                         | 敏捷 / 产品 | DECISION-066, TECH-ARCH-024 |
| 2026-06-02 | Sprint 5 | 新增 Sprint 5 Backlog 草案 S5-STORY-001~007（Planned）；含 S5-STORY-006 真实 UI 页面集成、S5-STORY-007 smoke / e2e                            | 敏捷        | S5-STORY-001~007            |
| 2026-06-02 | Sprint 5 | 新增 DECISION-066；更新 product-backlog TECH-ARCH-024                                                                                         | 敏捷 / 架构 | DECISION-066, TECH-ARCH-024 |
| 2026-06-02 | Sprint 5 | Sprint 5 **未启动**；未创建 `sprint/s5-*` 分支；**等待用户确认启动 Sprint 5**                                                                 | 敏捷 / Git  | DECISION-066                |

---

## 2026-06-02 · S5-STORY-002 InputRequest 契约

| 日期       | Sprint   | 变更摘要                                                                     | 影响范围    | 关联 Story / Decision |
| ---------- | -------- | ---------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-02 | Sprint 5 | 实现 InputRequest / NormalizedInput 代码契约（parse / validate / normalize） | 代码 / 架构 | S5-STORY-002          |
| 2026-06-02 | Sprint 5 | 新增 `src/core/generation/` 与单元测试；S5-STORY-002 Done                    | 代码 / 测试 | S5-STORY-002          |
| 2026-06-02 | Sprint 5 | S5-STORY-003 启动前状态记录（后续已由 S5-STORY-003 完成覆盖）                | 敏捷        | S5-STORY-002          |

---

## 2026-06-02 · S5-STORY-003 GenerationEvent / SSE Runtime

| 日期       | Sprint   | 变更摘要                                                                                                                | 影响范围    | 关联 Story / Decision      |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| 2026-06-02 | Sprint 5 | 实现 GenerationEvent 契约与 Zod schema（block.start / block.delta / block.complete / done.article / error / heartbeat） | 代码 / 架构 | S5-STORY-003, DECISION-024 |
| 2026-06-02 | Sprint 5 | 实现 SSE encode/decode 与 stream runtime + deterministic test provider                                                  | 代码 / 测试 | S5-STORY-003               |
| 2026-06-02 | Sprint 5 | S5-STORY-003 Done；S5-STORY-004 仍 Planned；未实现 Article 归一 / UI 主流程                                             | 敏捷        | S5-STORY-003               |

---

## 2026-06-02 · Sprint 5 真实模型 Provider 计划调整

| 日期       | Sprint   | 变更摘要                                                                                                     | 影响范围    | 关联 Story / Decision                    |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------ | ----------- | ---------------------------------------- |
| 2026-06-02 | Sprint 5 | Sprint 5 后续计划调整：Sprint 5 关闭前必须接入真实模型 API                                                   | 敏捷 / 架构 | DECISION-068                             |
| 2026-06-02 | Sprint 5 | 新增 S5-STORY-005 真实模型 Provider 对接（Volcengine / Doubao）；原 S5-STORY-005~007 顺延为 S5-STORY-006~008 | 敏捷        | S5-STORY-005~008                         |
| 2026-06-02 | Sprint 5 | Volcengine / Doubao provider 纳入 Sprint 5 P0；deterministic provider 仅 dev fallback / test provider        | 架构        | TECH-ARCH-024, TECH-ARCH-025             |
| 2026-06-02 | Sprint 5 | Sprint 5 UI 主流程验收不再允许只依赖 deterministic provider                                                  | 敏捷 / 产品 | DECISION-068, S5-STORY-007, S5-STORY-008 |

---

## 2026-06-02 · S5-STORY-004 done.article 归一

| 日期       | Sprint   | 变更摘要                                                                       | 影响范围    | 关联 Story / Decision |
| ---------- | -------- | ------------------------------------------------------------------------------ | ----------- | --------------------- |
| 2026-06-02 | Sprint 5 | 实现 `done.article` 事件序列校验与 `finalizeGenerationEvents` Article 归一链路 | 代码 / 架构 | S5-STORY-004          |
| 2026-06-02 | Sprint 5 | 复用 `parseArticle` / `validateArticle` / `normalizeArticle`；新增 26 单元测试 | 代码 / 测试 | S5-STORY-004          |
| 2026-06-02 | Sprint 5 | S5-STORY-004 Done；S5-STORY-005 仍 Planned；未接入真实模型 / UI 主流程         | 敏捷        | S5-STORY-004          |

---

## 2026-06-02 · S5-STORY-005 Volcengine Model Provider

| 日期       | Sprint   | 变更摘要                                                                                    | 影响范围    | 关联 Story / Decision                     |
| ---------- | -------- | ------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| 2026-06-02 | Sprint 5 | 实现 Volcengine / Doubao model provider 契约、transport、prompt 与 GenerationEvent 输出     | 代码 / 架构 | S5-STORY-005, TECH-ARCH-025, DECISION-068 |
| 2026-06-02 | Sprint 5 | 新增 `.env.example`（`VOLCENGINE_*`）；mock transport 单测，无真实网络依赖                  | 配置 / 测试 | S5-STORY-005                              |
| 2026-06-02 | Sprint 5 | S5-STORY-005 Done；S5-STORY-006~008 仍 Planned；未实现 `/generate` UI / Sprint 5 主流程关闭 | 敏捷        | S5-STORY-005                              |

---

## 2026-06-02 · S5-STORY-005A Volcengine Real API Smoke

| 日期       | Sprint   | 变更摘要                                                                          | 影响范围    | 关联 Story / Decision       |
| ---------- | -------- | --------------------------------------------------------------------------------- | ----------- | --------------------------- |
| 2026-06-02 | Sprint 5 | 新增 dev-only `smoke:volcengine-provider` 真实 API smoke 脚本                     | 工具 / 架构 | S5-STORY-005A               |
| 2026-06-02 | Sprint 5 | S5-STORY-005 调整为 In Review；005A smoke script ready；真实 API 手动运行 pending | 敏捷        | S5-STORY-005, S5-STORY-005A |
| 2026-06-02 | Sprint 5 | 新增 `docs/agile/smoke/s5-volcengine-provider-smoke.md`                           | 文档        | S5-STORY-005A               |

---

## 2026-06-02 · S5-STORY-005B Model Article Candidate Enrichment

| 日期       | Sprint   | 变更摘要                                                                                                             | 影响范围    | 关联 Story / Decision                      |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| 2026-06-02 | Sprint 5 | 新增 `model-article-enrichment` 层：UUID / metadata / input / styleAssignment / block content deterministic repair   | 代码 / 架构 | S5-STORY-005B                              |
| 2026-06-02 | Sprint 5 | Volcengine provider 接入 enrichment；forbidden 字段剥离 + warning；smoke summary 增加 finalization / enrichment 字段 | 代码 / 工具 | S5-STORY-005B                              |
| 2026-06-02 | Sprint 5 | 真实 API smoke **PASSED**（eventCount 7；finalizationStatus passed；enrichmentWarningCount 0）                       | 验收        | S5-STORY-005, S5-STORY-005A, S5-STORY-005B |
| 2026-06-02 | Sprint 5 | S5-STORY-005 / 005A / 005B 已 merge 至 `sprint/s5-generation-ui-main-flow`（`7421089` / `d77d3d0` / `532f685`）      | 敏捷        | S5-STORY-005~005B                          |

---

## 2026-06-02 · S5-STORY-006 AI Style Selection Pipeline

| 日期       | Sprint   | 变更摘要                                                                                                                             | 影响范围    | 关联 Story / Decision |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- | --------------------- |
| 2026-06-02 | Sprint 5 | 新增 generation style selection 链路：StyleSelectionRequest / StyleAssignmentPatch → Sprint 3-C validation → Article.styleAssignment | 代码 / 架构 | S5-STORY-006          |
| 2026-06-02 | Sprint 5 | deterministic + model_assisted 模式；非法 variant / forbidden 字段 / invalid model output → safe preset fallback                     | 代码 / 测试 | S5-STORY-006          |
| 2026-06-02 | Sprint 5 | 新增 `/generate` 页面与 `/api/generate` 统一主链路 UI 集成                                                                           | 代码 / UI   | S5-STORY-007          |
| 2026-06-02 | Sprint 5 | `feature/s5-generate-ui-main-flow` merge 至 `sprint/s5-generation-ui-main-flow` @ `01318c4`（S5-STORY-007）                          | 敏捷        | S5-STORY-007          |
| 2026-06-02 | Sprint 5 | S5-STORY-007 用户确认关闭为 Done；记录 follow-up 测试 / provider / 样式 / Paste QA 留后续                                            | 敏捷        | S5-STORY-007          |
| 2026-06-02 | Sprint 5 | S5-STORY-008 Done；新增 Sprint 5 close readiness audit（P0=0）；Sprint 5 进入 Close Readiness                                        | 敏捷 / 架构 | S5-STORY-008          |

---

## 2026-06-02 · Sprint 5 关闭

| 日期       | Sprint   | 变更摘要                                                                                             | 影响范围        | 关联 Story / Decision      |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------- | --------------- | -------------------------- |
| 2026-06-02 | Sprint 5 | **关闭 Sprint 5**；用户确认 close readiness audit（Grade A- · P0=0）；DECISION-069                   | 敏捷            | S5-STORY-008, DECISION-069 |
| 2026-06-02 | Sprint 5 | `docs/s5-main-flow-e2e-close-readiness` merge 至 `sprint/s5-generation-ui-main-flow`（S5-STORY-008） | Git / 敏捷      | S5-STORY-008               |
| 2026-06-02 | Sprint 5 | `sprint/s5-generation-ui-main-flow` merge 至 `release/1`                                             | Git / Release 1 | DECISION-069               |
| 2026-06-02 | Sprint 5 | Paste QA 仍 **Not Run**（归 Sprint 8）；**不宣称** Release 1 完成；**不 merge `main`**               | 敏捷 / 架构     | DECISION-069               |

---

## 2026-06-02 · Release 1 尾声方案 B 重排

| 日期       | Sprint    | 变更摘要                                                                                                          | 影响范围    | 关联 Story / Decision      |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| 2026-06-02 | Release 1 | Sprint 5 关闭后，Release 1 后续从纯技术收口调整为 **用户可见主链路收口（方案 B）**                                | 敏捷 / 产品 | DECISION-070               |
| 2026-06-02 | Sprint 6  | 新增 **Sprint 6 Visible Main Flow**（S6-STORY-001~007）；**下一步最高优先级**                                     | 敏捷        | DECISION-070               |
| 2026-06-02 | Sprint 7  | 新增 **Sprint 7 WeChat Article Experience & Style Richness**（S7-STORY-001~007）；Planned                         | 敏捷        | DECISION-070               |
| 2026-06-02 | Sprint 8  | 新增 **Sprint 8 Copy Fidelity & Release 1 Closure**（S8-STORY-001~007）；Planned                                  | 敏捷        | DECISION-070               |
| 2026-06-02 | Release 1 | 新增 [`release-plan.md`](release-plan.md)；关闭标准从 lint/test/build 调整为 **可见主链路 + 样式体验 + 复制保真** | 敏捷 / 产品 | DECISION-070               |
| 2026-06-02 | Release 1 | 原 Sprint 6-A/B 尾声计划在 Release 1 剩余阶段由方案 B 取代                                                        | 敏捷        | DECISION-045, DECISION-070 |
| 2026-06-02 | Release 1 | 更新 `user-story-map.md` 主路径与 Sprint 6/7/8 分工                                                               | 产品        | DECISION-070               |
| 2026-06-02 | Release 1 | `docs/release1-replan-visible-main-flow` merge 至 `release/1` @ `14dc27b`                                         | Git / 敏捷  | DECISION-070               |

---

## 2026-06-02 · Sprint 6 启动

| 日期       | Sprint   | 变更摘要                                                                                                 | 影响范围    | 关联 Story / Decision      |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| 2026-06-02 | Sprint 6 | **开启 Sprint 6：** Release 1 Visible AI Main Flow；分支 `sprint/s6-visible-ai-main-flow`                | 敏捷 / Git  | DECISION-071, S6-STORY-001 |
| 2026-06-02 | Sprint 6 | 从 Product Backlog 选择 **PB-R1-01 ~ PB-R1-08** 作为 Sprint 6 主要范围来源                               | 产品 / 敏捷 | DECISION-071               |
| 2026-06-02 | Sprint 6 | Sprint Backlog 设置为 **S6-STORY-001 ~ S6-STORY-006**；S6-STORY-001 Done；002~006 To Do                  | 敏捷        | S6-STORY-001               |
| 2026-06-02 | Sprint 6 | 明确 Sprint 6 目标为**真实 AI 用户侧最小闭环**；**不是** mock demo，**不是**纯技术验证                   | 产品 / 敏捷 | DECISION-071               |
| 2026-06-02 | Sprint 6 | 更新 `user-story-map.md` 8 步闭环路径与 Sprint 6 排除范围                                                | 产品        | S6-STORY-001               |
| 2026-06-02 | Sprint 6 | 在 sprint-backlog 登记 Sprint 6 技术 / 产品 / 内容 / 样式 DoD                                            | 敏捷        | S6-STORY-001               |
| 2026-06-02 | Sprint 6 | 新增 **DECISION-071**；Sprint 6 状态 **In Progress**；**不关闭 Sprint 6**；**不 merge main / release/1** | 敏捷        | DECISION-071               |

---

## 2026-06-02 · Sprint 6 首页 → 预览真实 AI 主流程

| 日期       | Sprint   | 变更摘要                                                                                                           | 影响范围   | 关联 Story / Decision          |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------ |
| 2026-06-02 | Sprint 6 | **S6-STORY-002~004 Done**：首页 `/`、预览 `/preview`、真实 AI + Preview Renderer 闭环                              | 代码 / UI  | S6-STORY-002~004, DECISION-072 |
| 2026-06-02 | Sprint 6 | `requireRealProvider`：用户主流程禁止静默 deterministic mock                                                       | 代码 / API | DECISION-072                   |
| 2026-06-02 | Sprint 6 | 增强 Volcengine prompt：公众号长文结构与必需 block 类型                                                            | 代码       | S6-STORY-003                   |
| 2026-06-02 | Sprint 6 | S6-STORY-005~006 仍为 **To Do**（打字机 / 风格切换 / 复制专项）                                                    | 敏捷       | —                              |
| 2026-06-02 | Sprint 6 | 工作分支 `feature/s6-home-ai-preview-flow`；**不 merge release/1**                                                 | Git        | S6-STORY-002~004               |
| 2026-06-02 | Sprint 6 | `feature/s6-home-ai-preview-flow` merge 至 `sprint/s6-visible-ai-main-flow` @ `f38130a`；S6-STORY-002~004 **Done** | Git / 敏捷 | DECISION-072                   |

## 2026-06-02 · Sprint 6 SSE 流式预览 + UX Shell（S6-STORY-005 / 006A）

| 日期       | Sprint   | 变更摘要                                                                                                          | 影响范围   | 关联 Story / Decision       |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| 2026-06-02 | Sprint 6 | **S6-STORY-005 Done**：真实 SSE `POST /api/generate/stream`；block-aware 流式预览 + Style 系统控件样式 + 滚动跟随 | 代码 / UI  | S6-STORY-005, DECISION-077  |
| 2026-06-02 | Sprint 6 | **S6-STORY-006A Done**：miaopian 风格 UI Shell；预览页复制                                                        | 代码 / UI  | S6-STORY-006A, DECISION-075 |
| 2026-06-02 | Sprint 6 | DECISION-076 标记 **已废弃**（由 DECISION-077 取代）                                                              | 敏捷       | DECISION-076, DECISION-077  |
| 2026-06-02 | Sprint 6 | 流式预览接入 `generateDeterministicStyleSelection`；list structured block 就绪校验                                | 代码       | S6-STORY-005                |
| 2026-06-02 | Sprint 6 | PO 验收通过；`feature/s6-generation-feedback-typewriter` merge 至 `sprint/s6-visible-ai-main-flow` @ `ce967b1`    | 敏捷 / Git | S6-STORY-005, S6-STORY-006A |
| 2026-06-02 | Sprint 6 | **S6-STORY-006** 仍为 **To Do**（风格 / 配色切换 + Paste QA 专项）                                                | 敏捷       | S6-STORY-006                |

## 2026-06-02 · S6-STORY-006 风格 / 配色切换与复制（In Review）

| 日期       | Sprint   | 变更摘要                                                                                                    | 影响范围         | 关联 Story / Decision                      |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------ |
| 2026-06-02 | Sprint 6 | **S6-STORY-006 In Review**：预览侧栏风格 / 配色切换；客户端重渲染 Preview + Copy；最小粘贴 QA 清单          | 代码 / UI / 文档 | S6-STORY-006, PB-R1-05, PB-R1-07, PB-R1-08 |
| 2026-06-02 | Sprint 6 | 新增 `warm-editorial` theme、`renderArticlePreviewClient()`、`docs/agile/paste-qa/s6-minimal-paste-qa.md`   | 代码 / Style     | S6-STORY-006                               |
| 2026-06-02 | Sprint 6 | **Bugfix**：Copy Renderer 接入 theme palette tokens；暖色复制写入 inline hex（非 CSS 变量）                 | 代码 / Copy      | S6-STORY-006                               |
| 2026-06-02 | Sprint 6 | **S6-STORY-006 Done**：PO 手测通过（含暖色复制公众号）；待 merge sprint                                     | 敏捷             | S6-STORY-006                               |
| 2026-06-02 | Sprint 6 | PO 验收通过；`feature/s6-style-palette-copy-paste-qa` merge 至 `sprint/s6-visible-ai-main-flow` @ `e7391e5` | 敏捷 / Git       | S6-STORY-006                               |

## 2026-06-02 · Sprint 6 Close Readiness Audit

| 日期       | Sprint   | 变更摘要                                                                           | 影响范围  | 关联 Story / Decision |
| ---------- | -------- | ---------------------------------------------------------------------------------- | --------- | --------------------- |
| 2026-06-02 | Sprint 6 | Sprint 6 Close Readiness Audit（Grade A- · P0=0）                                  | 文档 / QA | S6-STORY-001~006      |
| 2026-06-02 | Sprint 6 | 修复 `home-preview-flow` e2e strict mode；`preview-visual-styles` 单测跟随 CSS var | 测试      | Sprint 6 close audit  |
| 2026-06-02 | Sprint 6 | Sprint 6 状态 → **Close Readiness**（**未关闭** · 待用户确认）                     | 敏捷      | DECISION-071          |

## 2026-06-02 · Sprint 6 关闭 + Sprint 7 启动

| 日期       | Sprint   | 变更摘要                                                                                  | 影响范围   | 关联 Story / Decision      |
| ---------- | -------- | ----------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| 2026-06-02 | Sprint 6 | **Sprint 6 Closed**（DECISION-078）；merge `sprint/s6-visible-ai-main-flow` → `release/1` | 敏捷 / Git | DECISION-078               |
| 2026-06-02 | Sprint 7 | **Sprint 7 启动**（DECISION-079）；`sprint/s7-wechat-article-experience`                  | 敏捷 / Git | DECISION-079, S7-STORY-001 |
| 2026-06-02 | Sprint 7 | 新增 `docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md`                            | 文档       | S7-STORY-001               |

## 2026-06-02 · Sprint 7 暂停 · Visible Progress Chore

| 日期       | Sprint   | 变更摘要                                                                                       | 影响范围    | 关联 Story / Decision        |
| ---------- | -------- | ---------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| 2026-06-02 | Sprint 7 | **Sprint 7 Paused**（DECISION-080）；Visible-first Cursor 轮次规则                             | 敏捷        | DECISION-080                 |
| 2026-06-02 | Chore    | `/gallery` fixture Preview 展台；删除 `/generate` 页面与 e2e                                   | 应用 / 导航 | CHORE-VIS-001, CHORE-VIS-002 |
| 2026-06-02 | Chore    | 删除 batch `POST /api/generate` 与 `run-generate-main-flow`                                    | 代码 / API  | CHORE-VIS-001                |
| 2026-06-02 | Chore    | **CHORE-VIS-001/002 Done**；`chore/visible-progress-gallery-legacy` merge → sprint @ `a5704d6` | 敏捷 / Git  | DECISION-080                 |

## 2026-06-02 · Sprint 7 恢复 · S7-STORY-002 八套 fixture

| 日期       | Sprint   | 变更摘要                                                   | 影响范围       | 关联 Story / Decision      |
| ---------- | -------- | ---------------------------------------------------------- | -------------- | -------------------------- |
| 2026-06-02 | Sprint 7 | **S7-STORY-002** 8 套 fixture + Gallery；merge @ `429ce30` | 代码 / Fixture | S7-STORY-002, DECISION-081 |

## 2026-06-02 · S7-STORY-003/004 合并 · Gallery + title/heading

| 日期       | Sprint   | 变更摘要                                                                                     | 影响范围                 | 关联 Story / Decision      |
| ---------- | -------- | -------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- |
| 2026-06-02 | Sprint 7 | **DECISION-082**：S7-STORY-003 与 004 合并；Gallery Copy/聚焦/variant + title/heading polish | 代码 / Docs / `/gallery` | S7-STORY-003, DECISION-082 |

## 2026-06-02 · S7-STORY-002/003/005 PO 签收

| 日期       | Sprint   | 变更摘要                                                                                                                                              | 影响范围                     | 关联 Story / Decision                    |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------- |
| 2026-06-02 | Sprint 7 | **S7-STORY-002 Done**（PO 签收）：8 套 fixture 已在 sprint @ `429ce30`                                                                                | Fixture / Gallery            | S7-STORY-002                             |
| 2026-06-02 | Sprint 7 | **DECISION-083**：miaopian 6 preset + 6 theme；registry **97**；heading **13**（含 6 miaopian 样式）；同篇 heading 统一；公众号字号                   | Style / Gallery / Generation | S7-STORY-003, S7-STORY-005, DECISION-083 |
| 2026-06-02 | Sprint 7 | **S7-STORY-003 / 005 Done**（PO 签收）；`feature/s7-rich-styles-title-heading` fast-forward merge → `sprint/s7-wechat-article-experience` @ `517717e` | 代码 / Git                   | S7-STORY-003, S7-STORY-005               |
| 2026-06-02 | Sprint 7 | **下一步 S7-STORY-006**（rhythm / 过度卡片化）；Sprint 7 **未关闭**；**不 merge `main`**                                                              | 敏捷                         | S7-STORY-006                             |

## 2026-06-02 · S7-STORY-006 PO 签收

| 日期       | Sprint   | 变更摘要                                                                                                       | 影响范围           | 关联 Story / Decision      |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------- |
| 2026-06-02 | Sprint 7 | **DECISION-084**：Orchestrator R4 + RCARD；plain-first 生成 rotation；`card-rhythm.ts`                         | Style / Generation | DECISION-084, S7-STORY-006 |
| 2026-06-02 | Sprint 7 | **S7-STORY-006 Done**（PO 签收）；`feature/s7-article-rhythm-card-fix` fast-forward merge → sprint @ `935640f` | 代码 / Git         | S7-STORY-006               |
| 2026-06-02 | Sprint 7 | **下一步 S7-STORY-007**（视觉 QA + close readiness）；Sprint 7 **未关闭**                                      | 敏捷               | S7-STORY-007               |

## 2026-06-03 · Sprint 7 收口 · S7-STORY-008

| 日期       | Sprint   | 变更摘要                                                                                                                         | 影响范围                 | 关联 Story / Decision      |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- |
| 2026-06-03 | Sprint 7 | **S7-STORY-008 Done**：heading publish 8 款；第六轮公众号粘贴 **8/8 PASS**；荧光笔 `h3`+`linear-gradient`（`7d8e38c`）           | Heading / Copy / Preview | S7-STORY-008, DECISION-087 |
| 2026-06-03 | Sprint 7 | **Sprint 7 Closed**（用户确认）；`feature/s7-story-007a-r1-style-fidelity` → `sprint/s7-wechat-article-experience` → `release/1` | 敏捷 / Git               | Sprint 7                   |
| 2026-06-03 | Sprint 7 | S7-STORY-007B（R1 golden 全文粘贴）移交 Sprint 8；不阻塞 S7 关闭                                                                 | 敏捷                     | S7-STORY-007B              |

## 2026-06-04 · Sprint 8 启动 · S8-STORY-001

| 日期       | Sprint       | 变更摘要                                                                                                                                                | 影响范围           | 关联 Story / Decision              |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| 2026-06-04 | Sprint 8     | **DECISION-088**：S8 重定义为 WeChat-safe CSS Contract & Fidelity Test System（8 stories）                                                              | 敏捷 / 架构        | DECISION-088                       |
| 2026-06-04 | Sprint 8     | 创建分支 `sprint/s8-wechat-safe-css-contract`、`docs/s8-story-001-compatibility-research`                                                               | Git                | S8-STORY-001                       |
| 2026-06-04 | Sprint 8     | 新增 `sprint8-wechat-safe-css-contract.md`、调研与 contract/失真诊断草案                                                                                | 敏捷 / 架构 / 调研 | S8-STORY-001                       |
| 2026-06-04 | Sprint 8     | 替换 sprint-backlog Sprint 8 章节（S8-STORY-001~008）；**未改业务代码**                                                                                 | 敏捷               | S8-STORY-001                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-001 Done**（用户确认 DECISION-088）；调研详表待补；merge → `sprint/s8-wechat-safe-css-contract`                                              | 敏捷 / Git         | S8-STORY-001, DECISION-088         |
| 2026-06-04 | Sprint 8     | **Contract v1 定稿**（`wechat-safe-contract-v1`）；HTML/CSS 分级 · waiver · fallback · DOM/inline；DECISION-089 待确认                                  | 架构 / 敏捷        | S8-STORY-002, DECISION-089         |
| 2026-06-04 | Sprint 8     | **DECISION-089 已确认**；**S8-STORY-002 Done**；Clipboard 禁 class（Copy 剥离）· gradient waiver 不外推；merge → sprint                                 | 架构 / 敏捷 / Git  | S8-STORY-002, DECISION-089         |
| 2026-06-04 | Sprint 8     | **S8-STORY-003**：`src/core/wechat-compat` · Contract v1 profile + waivers；DECISION-090                                                                | 代码 / 架构        | S8-STORY-003, DECISION-090         |
| 2026-06-04 | Sprint 8     | **S8-STORY-003 Done**：`profileId`=`wechat-mp-editor-v1` · `contractVersionId`=`wechat-safe-contract-v1`；merge → sprint                                | 代码 / Git         | S8-STORY-003                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-004**：Copy HTML Validator（`validateWechatCopyHtml` · Contract v1 · waiver 非全局）                                                         | 代码 / 架构        | S8-STORY-004, DECISION-090         |
| 2026-06-04 | Sprint 8     | **S8-STORY-004 Done**（用户审查通过）；merge `feature/s8-story-004-copy-html-validator` → sprint                                                        | 代码 / Git         | S8-STORY-004                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-005**：35 行 Fidelity Matrix + fixture/validator 流水线                                                                                      | 测试 / 文档        | S8-STORY-005                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-005 Done**；merge `feature/s8-story-005-fidelity-matrix` → sprint                                                                            | 测试 / Git         | S8-STORY-005                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-006 Done**：Paste QA · PO 19 行 Matrix/Drift 同步 · overlay · Drift 001–009                                                                  | 文档 / 测试        | S8-STORY-006                       |
| 2026-06-04 | Sprint 8     | **S8-STORY-006B**：结构化样式调研 · 文章采集 · Pattern Library v0.1 · Drift triage · DECISION-091                                                       | 文档 / 研究        | S8-STORY-006B                      |
| 2026-06-04 | Sprint 8     | **S8-STORY-006B Done**（用户确认）：结构化调研 · L0 HARVEST · Pattern v0.1 · Drift triage                                                               | 文档               | S8-STORY-006B                      |
| 2026-06-04 | Sprint 8     | **S8-STORY-006B-FIX-A**：harvest evidence L0–L4 · URL/HTML 输入模板 · AI extraction guide · HARVEST 标 L0                                               | 文档               | S8-STORY-006B-FIX-A                |
| 2026-06-04 | Sprint 8     | **S8-STORY-006B / 006B-FIX-A Done**（用户确认）：merge `docs/s8-story-006b-fix-harvest-extraction-workflow` → sprint；首条 L2 `WX-HARVEST-EVIDENCE-001` | 文档 / Git         | S8-STORY-006B, S8-STORY-006B-FIX-A |
| 2026-06-04 | Sprint 8     | **S8-STORY-006C**：copy-safe primitives · A/B/C Copy 修复 · harvest candidates · Matrix/Drift 更新                                                      | 代码 / 测试        | S8-STORY-006C                      |
| 2026-06-04 | Sprint 8     | **S8-STORY-006C Done**（用户确认）：merge `feature/s8-story-006c-harvest-pattern-candidate-fix` → sprint；paste 修复待 006D                             | 代码 / Git         | S8-STORY-006C                      |
| 2026-06-05 | Sprint 8     | **S8-STORY-006D**（Mode A）：006D QA pack · Session 模板 · Matrix 006D queue · overlay `20260605_006D` · 15 snapshots                                   | 文档 / 测试        | S8-STORY-006D                      |
| 2026-06-05 | Sprint 8     | **S8-STORY-006D Done**（Mode B）：PO 15 行 PASS · 8 Drift resolved · 2 harvest candidate-paste-pass · merge sprint                                      | 文档 / 测试 / Git  | S8-STORY-006D                      |
| 2026-06-05 | Sprint 8     | merge `docs/s8-story-006d-matrix-regression-paste-retest` → sprint @ `f6d8d06`                                                                          | Git                | S8-STORY-006D                      |
| 2026-06-05 | Sprint 8 / 9 | **S8-STORY-008 Done**：Sprint 9 Style Management System v0 重排 · S9-STORY-001~009 草案 · S10 方向 · DECISION-092                                       | 文档               | S8-STORY-008                       |
| 2026-06-05 | Sprint 8     | merge `docs/s8-story-008-s9-style-management-replanning` → sprint @ `301f73a`                                                                           | Git                | S8-STORY-008                       |
| 2026-06-05 | Sprint 8     | **S8-STORY-007 Done**：HEAD-002 validator false positive 审计 · no S8 code change                                                                       | 文档               | S8-STORY-007                       |
| 2026-06-05 | Sprint 8     | **S8-DRIFT-003 Done**：`title_plain_minimal` 产品澄清 · NOT renderer bug · NO S8 code change                                                            | 文档 / Matrix      | S8-DRIFT-003                       |
| 2026-06-05 | Sprint 8     | **S8-STORY-009 In Review**：Contract & Fidelity audit · Grade A- · P0=0 · S9 启动条件清单                                                               | 文档               | S8-STORY-009                       |
| 2026-06-05 | Sprint 8     | **Sprint 8 Closed**：merge `sprint/s8-wechat-safe-css-contract` → `release/1` @ `806fa47` · DECISION-093                                                | Git / 文档         | DECISION-093                       |

---

## 2026-06-05 · Sprint 9

| 日期       | Sprint   | 变更摘要                                                                                                                                                                                                      | 影响范围    | 关联 Story / Decision             |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------- |
| 2026-06-05 | Sprint 9 | **Sprint 9 启动**：从 `release/1` 创建 `sprint/s9-style-management-system-v0` · DECISION-094                                                                                                                  | Git / 文档  | DECISION-094                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-001 Done**：Style Management Domain Model · [`style-management-domain-model.md`](../architecture/style-management-domain-model.md)                                                                 | 文档 / 架构 | S9-STORY-001 · DECISION-094       |
| 2026-06-05 | Sprint 9 | merge `docs/s9-story-001-domain-model` → `sprint/s9-style-management-system-v0` @ `263227b`                                                                                                                   | Git         | S9-STORY-001                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-002 Done**：File-backed Style Library Storage · `src/core/style-library/` · DECISION-095                                                                                                           | 代码 / 文档 | S9-STORY-002 · DECISION-095       |
| 2026-06-05 | Sprint 9 | merge `feature/s9-story-002-file-backed-style-library-storage` → `sprint/s9-style-management-system-v0` @ `859c0ed`                                                                                           | Git         | S9-STORY-002                      |
| 2026-06-05 | Sprint 9 | 新增跨项目迁移指导 [`preview-copy-fidelity-implementation-guide.md`](../architecture/preview-copy-fidelity-implementation-guide.md)（Preview/Copy 一致性萃取）                                                | 文档 / 架构 | —                                 |
| 2026-06-05 | Sprint 9 | **S9-STORY-003 Done**：Style Library Admin Shell · `/dev/style-library` · DECISION-096                                                                                                                        | 代码 / 文档 | S9-STORY-003 · DECISION-096       |
| 2026-06-05 | Sprint 9 | **S9-PLANNING-REFRAME**：DECISION-097 operator-facing acceptance · 调整 S9 Story 004~009 验收口径                                                                                                             | 文档 / 敏捷 | DECISION-097 · S9-STORY-003-FIX-A |
| 2026-06-05 | Sprint 9 | **S9-STORY-003-FIX-A**：Style Library Workbench operator UX reframe · `/dev/style-library`                                                                                                                    | 代码 / 文档 | S9-STORY-003-FIX-A · DECISION-097 |
| 2026-06-05 | Sprint 9 | **S9-STORY-003-FIX-B**：Style Library Workbench zh/en i18n toggle · DECISION-098                                                                                                                              | 代码 / 文档 | S9-STORY-003-FIX-B · DECISION-098 |
| 2026-06-05 | Sprint 9 | merge `feature/s9-story-003-style-library-admin-shell` → `sprint/s9-style-management-system-v0` @ `35000ab` · 用户确认接受 S9-STORY-003 / FIX-A / FIX-B                                                       | Git         | S9-STORY-003                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-004 Done**：merge lifecycle management → sprint @ `7300b9f`                                                                                                                                        | Git         | S9-STORY-004                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-006-FIX-A**：WARNING readiness 运营文案 · blocked/warnings summary 计数 refinement                                                                                                                 | 代码 / 文档 | S9-STORY-006                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-007 In Review**：Promote to user_selectable · proposal-based review · DECISION-101 · [`style-library-promote-user-selectable.md`](../architecture/style-library-promote-user-selectable.md)        | 代码 / 文档 | S9-STORY-007 · DECISION-101       |
| 2026-06-05 | Sprint 9 | **S9-STORY-008 In Review**：Style / Palette / Rule Management v0 · DECISION-102                                                                                                                               | 代码 / 文档 | S9-STORY-008 · DECISION-102       |
| 2026-06-05 | Sprint 9 | merge S9-STORY-008 → sprint @ `e5f6db6`                                                                                                                                                                       | Git         | S9-STORY-008                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-007B In Review**：Apply Candidate Promote Patch · DECISION-105 · [`style-library-apply-candidate-promote-patch.md`](../architecture/style-library-apply-candidate-promote-patch.md)                | 代码 / 文档 | S9-STORY-007B · DECISION-105      |
| 2026-06-05 | Sprint 9 | merge S9-STORY-005 → sprint @ `a9a3a00`                                                                                                                                                                       | Git         | S9-STORY-005                      |
| 2026-06-05 | Sprint 9 | merge S9-STORY-007B → sprint @ `634709d`                                                                                                                                                                      | Git         | S9-STORY-007B                     |
| 2026-06-05 | Sprint 9 | merge S9-STORY-009 v2 audit → sprint @ `b906343`                                                                                                                                                              | Git         | S9-STORY-009                      |
| 2026-06-05 | Sprint 9 | **Sprint 9 Closed**：DECISION-106 已确认 · Grade **A-** · P0=0 · HTML→user preview picker E2E PASS · Preview/Copy parity PASS · default preset / release1_required 未污染 · **未 merge `release/1` / `main`** | 文档 / 敏捷 | DECISION-106 · S9-STORY-009       |
| 2026-06-05 | Sprint 9 | merge S9-STORY-007C + FIX-A/B → sprint @ `da5be1e`                                                                                                                                                            | Git         | S9-STORY-007C                     |
| 2026-06-05 | Sprint 9 | **S9-STORY-009 v2**：End-to-End Audit / Closeout · Grade A- · P0=0 · DECISION-106 v2 草案                                                                                                                     | 文档 / 测试 | S9-STORY-009 · DECISION-106       |
| 2026-06-05 | Sprint 9 | **S9-STORY-009 On Hold**：PO 要求 user-selectable 须进用户预览页选择器 · audit 分支暂不 merge                                                                                                                 | 文档 / 敏捷 | S9-STORY-009                      |
| 2026-06-05 | Sprint 9 | **S9-STORY-007C-FIX-B**：html paste section label 动态序号 + theme token 色 · 采集色仅作 source hint                                                                                                          | 代码 / 文档 | S9-STORY-007C                     |

---

## 2026-06-07 · Sprint 10 启动 · S10-STORY-001

| 日期       | Sprint               | 变更摘要                                                                                                                    | 影响范围    | 关联 Story / Decision        |
| ---------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| 2026-06-07 | Sprint 9 / Release 1 | **S9 merge `release/1`**：merge Sprint 9 Style Management System v0 @ `c96e869`                                             | Git         | DECISION-106                 |
| 2026-06-07 | Sprint 10            | **Sprint 10 启动**：从 `release/1` 创建 `sprint/s10-db-backed-style-admin-v1` · **DECISION-108**                            | Git / 文档  | DECISION-108                 |
| 2026-06-07 | Sprint 10            | **S10 重定义**：Database-backed Style Management Admin v1（取代 Style Expansion 主目标）                                    | 敏捷 / 架构 | DECISION-108                 |
| 2026-06-07 | Sprint 10            | **S10-STORY-001 Done**：架构与技术选型定稿 · [`style-management-admin-v1.md`](../architecture/style-management-admin-v1.md) | 文档 / 架构 | S10-STORY-001 · DECISION-108 |
| 2026-06-07 | Sprint 10            | S10-STORY-002~012 完整拆分至 sprint-backlog · 第一验收闭环与 HTML Harvest 分阶段                                            | 敏捷        | S10-STORY-001                |
| 2026-06-07 | Sprint 10            | 工作分支 `docs/s10-start-architecture-backlog` · **未实现业务代码** · **未 merge `main`**                                   | Git / 文档  | S10-STORY-001                |
| 2026-06-07 | Sprint 10            | **S10-STORY-001 Done**：merge `docs/s10-start-architecture-backlog` → `sprint/s10-db-backed-style-admin-v1` @ `54b2e15`     | Git / 文档  | S10-STORY-001 · DECISION-108 |

---

## 2026-06-07 · S10-STORY-002 Prisma + DB Schema + Repository

| 日期       | Sprint    | 变更摘要                                                                                                                   | 影响范围      | 关联 Story / Decision |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-002**：Prisma 6 + PostgreSQL schema · 12 核心表 · 初始 migration                                               | 代码 / 数据库 | S10-STORY-002         |
| 2026-06-07 | Sprint 10 | 新增 `src/server/style-admin/` repository 层 · pool 边界 mapper · audit 写入                                               | 代码 / 架构   | S10-STORY-002         |
| 2026-06-07 | Sprint 10 | `.env.example` 增加 `DATABASE_URL` 占位 · 无真实 secret                                                                    | 配置 / 文档   | S10-STORY-002         |
| 2026-06-07 | Sprint 10 | 工作分支 `feature/s10-story-002-prisma-db-schema` · **未导入 variant** · **未 merge `main`**                               | Git           | S10-STORY-002         |
| 2026-06-07 | Sprint 10 | **S10-STORY-002 Done**：merge `feature/s10-story-002-prisma-db-schema` → `sprint/s10-db-backed-style-admin-v1` @ `23d2180` | Git           | S10-STORY-002         |

---

## 2026-06-07 · S10-STORY-003 既有 Variant 全量导入

| 日期       | Sprint    | 变更摘要                                                                                                                                 | 影响范围      | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-003**：既有 variant collect / map / 幂等 import · dry-run CLI · import report                                                | 代码 / 数据库 | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | 新增 `src/server/style-admin/import/` · `scripts/style-admin/import-existing-variants.ts` · `pnpm style-admin:import-existing-variants*` | 代码 / 脚本   | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | 测试 `tests/server/style-admin/import/` · dry-run · checksum · collect 边界 · repeated import skip                                       | 测试          | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | dry-run：collected=100 · release1_required=92 · historical_33=33 · user_selectable=1 · deprecated=5                                      | 文档 / 报告   | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | 工作分支 `feature/s10-story-003-import-existing-variants` · **未 merge sprint** · **未连接生产 RDS**                                     | Git           | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | **S10-STORY-003 FIX-A**：registry `release1_required` → lifecycle `release1_required`（非 `default_eligible`）· Prisma enum migration    | 代码 / 数据库 | S10-STORY-003         |
| 2026-06-07 | Sprint 10 | **S10-STORY-003 Done**：merge `feature/s10-story-003-import-existing-variants` → `sprint/s10-db-backed-style-admin-v1` @ `daa1a0a`       | Git / 代码    | S10-STORY-003         |

---

## 2026-06-07 · S10-STORY-004 Admin Style Library Read UI

| 日期       | Sprint    | 变更摘要                                                                                                                                                              | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-004**：`/admin/style-library` 列表 + `[runtimeVariantId]` 详情 · DB read UI                                                                               | 代码 / UI   | S10-STORY-004         |
| 2026-06-07 | Sprint 10 | 新增 `StyleLibraryAdminQuery` · view model · filters · disabled governance actions                                                                                    | 代码 / 架构 | S10-STORY-004         |
| 2026-06-07 | Sprint 10 | DATABASE_URL 未配置 / DB 不可用安全 empty state · 不暴露 secret                                                                                                       | 安全 / UX   | S10-STORY-004         |
| 2026-06-07 | Sprint 10 | 工作分支 `feature/s10-story-004-admin-style-library` · **未 merge sprint**                                                                                            | Git         | S10-STORY-004         |
| 2026-06-07 | Sprint 10 | **S10-STORY-004 FIX-A**：补齐 `defaultEligible` / `hidden` URL filter presets                                                                                         | 代码 / UI   | S10-STORY-004         |
| 2026-06-07 | Sprint 10 | **S10-STORY-004 Done**：merge `feature/s10-story-004-admin-style-library` → `sprint/s10-db-backed-style-admin-v1` @ `6307925` · 本地 `/admin/style-library` 验收 PASS | Git / UI    | S10-STORY-004         |

---

## 2026-06-07 · S10-STORY-005 用户侧 Variant Pool DB 接入

| 日期       | Sprint    | 变更摘要                                                                                                                                                                     | 影响范围        | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-005**：`/preview` 小标题 picker 接入 DB user-selectable pool                                                                                                     | 代码 / UI       | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | 新增 `user-selectable-variant-pool` runtime · 120s 缓存 · code_fallback                                                                                                      | 代码 / 架构     | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | dev API `/api/dev/style-admin/user-selectable-pool`                                                                                                                          | 代码 / 开发工具 | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | 工作分支 `feature/s10-story-005-user-variant-pool-db` · 已 merge sprint @ `6de237d`                                                                                          | Git             | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | **FIX-B**：sourceType 收口 · sourceCohort · qualityStatus · Runtime Availability Gate                                                                                        | 代码 / 架构     | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | 6 release1 heading seed userSelectable · 2 copy_fidelity_failed 登记 BUG-001/002                                                                                             | 数据 / Bug      | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | Prisma migration `source_cohort` + `quality_status` + `ai_generated` sourceType                                                                                              | 数据库          | S10-STORY-005         |
| 2026-06-07 | Sprint 10 | **S10-STORY-005 Done**：merge `feature/s10-story-005-user-variant-pool-db` → `sprint/s10-db-backed-style-admin-v1` @ `6de237d` · 本地 `/preview` + admin + dev API 验收 PASS | Git / UI        | S10-STORY-005         |

---

## 2026-06-07 · S10-STORY-006 上下架 / 回滚 / 报警最小闭环

| 日期       | Sprint    | 变更摘要                                                                                                                                                            | 影响范围       | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-006**：distribution 写操作（hide / restore / deprecated / rollback）· reason 必填 · audit + rollback record                                             | 代码 / 后台    | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | 新增 `admin-write-guard.ts` · dev/test 默认可写 · production 须 `STYLE_ADMIN_WRITE_ENABLED=true`                                                                    | 安全 / 架构    | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | 写操作后 `invalidateUserSelectableVariantPoolCache` · 用户侧 pool 1–5 分钟刷新                                                                                      | 代码 / runtime | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | Alert：`admin_write_failed` · `variant_restore_blocked_by_quality` · actor=`local-admin`                                                                            | 代码 / 审计    | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | 详情页 governance UI · promote / defaultEligible / version rollback 仍 disabled                                                                                     | UI             | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | SLS / CloudMonitor 接入设计文档化（事件先入 DB · S10-STORY-007 实施）                                                                                               | 文档 / 架构    | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | FIX：governance form reset 崩溃（async 后保存 form 引用）                                                                                                           | UI / Bugfix    | S10-STORY-006         |
| 2026-06-07 | Sprint 10 | **S10 第一验收闭环 PASS**：hide / restore / rollback · quality block · pool cache 刷新                                                                              | 验收 / 架构    | S10-STORY-003~006     |
| 2026-06-07 | Sprint 10 | **S10-STORY-006 Done**：fast-forward merge `feature/s10-story-006-distribution-rollback-alerts` → `sprint/s10-db-backed-style-admin-v1` @ `1d309a0` · 本地 E2E PASS | Git / 后台     | S10-STORY-006         |

---

## 2026-06-08 · S10-STORY-011 FIX-C Fidelity DSL Refresh from sourceHtml

| 日期       | Sprint    | 变更摘要                                                                                                             | 影响范围                             | 关联 Story / Decision |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------- | ------------------- |
| 2026-06-08 | Sprint 10 | **011 FIX-C**：stale html_paste heading DSL 从 `rawHtml` server-side 预刷新 · `meta.semanticBindings.title` 替换     | runtime / Decoder                    | S10-STORY-011 FIX-C   |
| 2026-06-08 | Sprint 10 | 新增 `pick-inspection-html-source` · `resolve-runtime-pool-definition` · runtime pool `variantSourceMetaByVariantId` | 代码 / Admin / runtime               | S10-STORY-011 FIX-C   |
| 2026-06-08 | Sprint 10 | Admin inspection + 用户 `/preview` / copy 共用 `shouldRefreshVariantDslFromSourceHtml`                               | Inspection / preview                 | S10-STORY-011 FIX-C   |
| 2026-06-08 | Sprint 10 | copy target：`display:flex                                                                                           | grid`→`block` · 避免微信粘贴布局异常 | Copy / Decoder        | S10-STORY-011 FIX-C |
| 2026-06-08 | Sprint 10 | 用户验收 PASS：`heading_html_paste_4933bb91_candidate` preview + copy + variant 切换                                 | 验收                                 | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | commit `1a32f13` · 工作分支 `feature/s10-story-011-promote-user-selectable-final` · **未 merge sprint**              | Git                                  | S10-STORY-011 FIX-C   |

---

## 2026-06-07 · S10-STORY-011 Promote Gate + Inspection Preview（In Review）

| 日期       | Sprint    | 变更摘要                                                                                               | 影响范围             | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------ | -------------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-011**：恢复 stash · Promote to user-selectable · `validateVariantDslRuntimeReadiness` gate | 后台 / 治理          | S10-STORY-011         |
| 2026-06-07 | Sprint 10 | Candidate detail Promote 面板 + readiness · preview/copy/compatibility · runtimeSource                 | UI / Admin           | S10-STORY-011         |
| 2026-06-07 | Sprint 10 | Preview inspection：DSL meta slots 优先 · `chapter_overlay_heading` → 样式化 preview                   | Inspection / Decoder | S10-STORY-011         |
| 2026-06-07 | Sprint 10 | 1211 tests PASS · build PASS                                                                           | 测试                 | S10-STORY-011         |

---

## 2026-06-07 · S10-STORY-011A Done（merge sprint）

| 日期       | Sprint    | 变更摘要                                                                                             | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-011A Done**：本地 E2E A/B/C PASS · Harvest / Runtime Trace / `database_dsl` 单轨验收通过 | 验收 / 敏捷 | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | merge `feature/s10-story-011a-dsl-runtime-encoder-decoder` → `sprint/s10-db-backed-style-admin-v1`   | Git         | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 遗留：Candidate detail Preview inspection 无样式标题 · 不阻塞 011A · 011 promote gate 处理           | 后台 / 治理 | S10-STORY-011         |

---

## 2026-06-07 · S10-STORY-011A FIX-B Harvest Encoder Fidelity + Runtime Trace

| 日期       | Sprint    | 变更摘要                                                                                             | 影响范围          | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **FIX-B**：复杂 heading HTML 语义提取 → 浅层规范 Variant DSL（非原样 DOM 搬运）                      | Encoder / Harvest | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 新增 `heading-semantic-extractor` · `dsl-trace-types` · encoder/decoder/runtime trace 模块           | 代码 / 架构       | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | Harvest / Candidate detail / dev API 展示 extracted slots · lossReport · runtimeSource · decoderPath | UI / Admin / API  | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | `validateVariantDslRuntimeReadiness` 预备 Promote gate · invalid DSL 不 silent empty                 | runtime / 治理    | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 回归测试：heading semantic extractor · runtime trace · 1188 tests PASS · build PASS                  | 测试              | S10-STORY-011A        |

---

## 2026-06-07 · S10-STORY-011A Checkpoint（未 merge sprint）

| 日期       | Sprint    | 变更摘要                                                                                      | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | --------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **011A checkpoint commit**：DSL Runtime + Encoder/Decoder + FIX-A 双轨 + FIX-A Harvest no-500 | 代码 / 架构 | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | Story 保持 **In Review**；最终 HTML→Promote→用户侧 E2E 未完成；下一步 FIX-B                   | 敏捷        | S10-STORY-011A        |

---

## 2026-06-07 · S10-STORY-011A FIX-A Harvest Compatibility No 500

| 日期       | Sprint    | 变更摘要                                                                                                   | 影响范围          | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **011A FIX-A（Harvest）**：Detect / Preview Candidate 不因 WeChat Yellow/Red compatibility 抛错 500        | Harvest / Encoder | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | Encoder 仅 `no_extractable_text` blocking · compatibility issues 进入 `issues` / `lossReport` / `severity` | 代码 / Harvest    | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | Harvest UI 展示 compatibility issues · loss report · canCreateCandidate 引导文案                           | UI / Admin        | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 回归测试：用户复杂 heading HTML · script/onclick lossReport · blocking empty text · 1179 tests PASS        | 测试              | S10-STORY-011A        |

---

## 2026-06-07 · S10-STORY-011 Checkpoint Commit

| 日期       | Sprint    | 变更                                                                                                                                                 | 类型       | 关联          |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| 2026-06-07 | Sprint 10 | **011 checkpoint**（`feature/s10-story-011-promote-user-selectable-final`）：promote + FIX-A + harvest compat mode · **In Review · 未 merge sprint** | Git / 文档 | S10-STORY-011 |

---

## 2026-06-08 · html_paste inline 编号 theme textAccent

| 日期       | Sprint    | 变更摘要                                                                                                   | 影响范围               | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------- |
| 2026-06-08 | Sprint 10 | **49b0ec2b 修正**：inline accent 编号切换 theme 时 remap 为 `textAccent`（非保留 source 色 · 非 `bgBand`） | Decoder / theme tokens | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | 大号/描边/透明编号仍用 `bgBand` · admin_inspection 仍保留 source 色                                        | Decoder                | S10-STORY-011         |

---

## 2026-06-08 · Sprint 10 Closed · Sprint 11 启动（DECISION-111）

| 日期       | Sprint    | 变更摘要                                                                                                             | 影响范围    | 关联 Story / Decision            |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------- |
| 2026-06-08 | Sprint 10 | **Sprint 10 Closed**：范围 001~011 + CHORE-011B · 原 012~014 顺延 Sprint 12+                                         | 敏捷        | DECISION-111                     |
| 2026-06-08 | Sprint 11 | **Sprint 11 启动**：Production Ops Go-Live · staging→production 部署 · 监控报警                                      | 运维 / 敏捷 | DECISION-111 · S11-STORY-001~006 |
| 2026-06-08 | Sprint 11 | 新增 `sprint11-production-ops-go-live.md` · `docs/ops/environments/` · `deploy/` 示例                                | 文档        | S11                              |
| 2026-06-08 | Git       | **`sprint/s10-db-backed-style-admin-v1` merge → `release/1`** @ `6cd1dfc` · 新建 `sprint/s11-production-ops-go-live` | Git         | DECISION-111                     |

---

## 2026-06-11 · S11 staging 部署验收收口

| 日期       | Sprint    | 变更摘要                                                                                                                                              | 影响范围    | 关联 Story / Decision           |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| 2026-06-11 | Sprint 11 | **staging 爬虫防护**：Nginx `X-Robots-Tag: noindex,nofollow,noarchive,nosnippet` · `/robots.txt Disallow: /` · curl 验证 PASS · **production 不继承** | 运维 / SEO  | staging                         |
| 2026-06-11 | Sprint 11 | **staging 部署验收收口**：ECS/RDS/Nginx HTTPS/systemd · migrate/import/health PASS                                                                    | 运维 / 部署 | S11-STORY-001~003 **In Review** |
| 2026-06-11 | Sprint 11 | 回填 [`environments/staging.md`](../ops/environments/staging.md) · checklist staging 列 · execution report                                            | 文档        | S11                             |
| 2026-06-11 | Sprint 11 | staging admin · preview pool · Hide/Restore · Logout 验收 PASS                                                                                        | 验收        | S11-STORY-003                   |
| 2026-06-11 | Sprint 11 | **待办**：Volcengine AI 生成主链路 · CloudMonitor/SLS/OSS · production **未启动**                                                                     | 运维        | S11-STORY-004~005               |

---

## 2026-06-10 · S11-STORY-003A 启动（staging Volcengine · streaming · numbering）

| 日期       | Sprint    | 变更摘要                                                                                                                                         | 影响范围               | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | --------------------- |
| 2026-06-10 | Sprint 11 | **S11-STORY-003A 启动**：Volcengine staging provider · 首页生成主链路 · SSE 打字机回归 · HTML variant 章节编号回归                               | 运维 / 生成 / 样式     | S11-STORY-003A        |
| 2026-06-10 | Sprint 11 | SSE：`X-Accel-Buffering: no` · Nginx `/api/generate/stream` `proxy_buffering off`                                                                | 生成 / 部署            | streaming fix         |
| 2026-06-10 | Sprint 11 | DSL：`semanticBindings.number` stale path 回退 infer · user preview 传 variant meta                                                              | 样式 / Preview / Copy  | numbering fix         |
| 2026-06-10 | Sprint 11 | **preview heading picker 回归**：移除 release1 publish 与 DB userSelectable 混排 · canonical `row.label` / `runtimeVariantId`                    | 样式 / Preview         | S11-STORY-003A        |
| 2026-06-10 | Sprint 11 | **用户池权威**：`distribution.userSelectable` 唯一可见性 · 移除 static seed fallback · lifecycle 数据迁移                                        | 样式 / Admin / Preview | S11-STORY-003A        |
| 2026-06-11 | Sprint 11 | **S11-STORY-003A Done**：staging 验收通过 · sprint `--no-ff` merge `2ee03c5` · closeout `381e146`                                                | Git / 样式 / 生成      | S11-STORY-003A        |
| 2026-06-16 | Sprint 11 | **S11-STORY-004 Gate A 启动**：`/api/version` · ops 脚本 · production 模板 · 回滚演练计划                                                        | 运维                   | S11-STORY-004         |
| 2026-06-10 | Sprint 11 | **S11-STORY-004 Gate B 启动**：import lifecycle 规范化 · governance snapshot export/import                                                       | 运维 / Admin           | S11-STORY-004         |
| 2026-06-10 | Sprint 11 | **Gate B 代码冻结**：`qualityStatus` 契约 @ `d99aa1a` · production 100 variant · staging +2 不迁移 · governance apply 暂缓 · P1-S11-001 deferred | 运维 / 文档            | DECISION-112          |
| 2026-06-28 | Sprint 11 | **S11-STORY-004 Done**：Production Prelaunch @ `385422d` · https://paiban.aiqingpian.cn · 回滚 `2f09b0d` PASS · Basic Auth + noindex · 用户确认  | 运维                   | DECISION-113          |
| 2026-06-28 | Sprint 11 | **S11-STORY-005 启动**：`ops:observe` 监控脚本 · P0/P1/P2 · Prelaunch 24h/72h checklist · **In Review**                                          | 运维                   | S11-STORY-005         |
| 2026-06-11 | Sprint 11 | **003A merge sprint** @ `75fecb9` · **003B Gate A 修订**：分支 reset+cherry-pick · LP-008 降 P1 · inventory 补全                                 | Git / 架构             | S11-STORY-003A / 003B |
| 2026-06-11 | Sprint 11 | **S11-STORY-003B Gate A**：legacy/parallel/fallback 全仓审计 · P0 删除清单 · inventory 文档                                                      | 架构 / 敏捷            | S11-STORY-003B        |
| 2026-06-10 | Sprint 11 | **d26 inline 编号/主题色**：infer 覆盖 <36px accent number · theme 用 effective bindings · Preview/Copy parity                                   | Decoder / theme tokens | S11-STORY-003A        |
| 2026-06-10 | Git       | 工作分支 `feature/s11-story-003a-staging-volcengine-streaming-numbering` · **未 merge main** · **production 未启动**                             | Git                    | S11-STORY-003A        |
| 2026-06-11 | Sprint 11 | `STYLE_ADMIN_SESSION_SECRET` 曾配置错误已轮换（不记录值）· `STYLE_ADMIN_PUBLIC_ORIGIN` 已配置                                                    | 部署                   | staging env           |
| 2026-06-11 | Sprint 11 | full test 2 failures `wechat-paste-qa-pack` 既有 · 非本轮修复                                                                                    | 测试                   | —                     |
| 2026-06-11 | Sprint 11 | **admin session bugfix**：`POST /api/admin/login` + `303` · logout POST-only · 移除 GET logout 清 session                                        | Admin auth             | merge `7f218e5`       |
| 2026-06-11 | Sprint 11 | 修复 RSC prefetch `GET /admin/logout?_rsc=...` 自动清 cookie                                                                                     | Admin auth             | bugfix                |
| 2026-06-11 | Git       | **`bugfix/s11-staging-admin-session-cookie` merge → sprint** @ `7f218e5` · docs @ `7fb4d9e` · **未 merge main**                                  | Git                    | bugfix                |

---

## 2026-06-30 · Sprint 11 Review / Retrospective / Closeout Readiness

| 日期       | Sprint          | 变更摘要                                                                                   | 影响范围   | 关联 Story / Decision |
| ---------- | --------------- | ------------------------------------------------------------------------------------------ | ---------- | --------------------- |
| 2026-06-30 | Sprint 11       | **Review**：Partially Ready · Prelaunch 2026-06-28 有证据 · 005/006 未完成                 | 敏捷       | S11-STORY-006         |
| 2026-06-30 | Sprint 11       | **Closeout Readiness**：Not Ready · S11 **未** merge `release/1`（56 commits @ `653c70a`） | Git / 敏捷 | DECISION-111          |
| 2026-06-30 | Sprint 11       | 新增 `sprint11-review.md` · `sprint11-retrospective.md` · `sprint11-closeout.md`           | 文档       | Closeout Readiness    |
| 2026-06-30 | Product Backlog | Sprint 11 Carryover P1-S11-002~004 · P2-S11-001~003                                        | Backlog    | Sprint 11             |

---

## 2026-06-30 · S11-STORY-006 Closeout 准备

| 日期       | Sprint    | 变更摘要                                                                                            | 影响范围 | 关联               |
| ---------- | --------- | --------------------------------------------------------------------------------------------------- | -------- | ------------------ |
| 2026-06-30 | Sprint 11 | **S11-STORY-006 In Review**：Closeout checklist · 状态同步 · **Ready for PO Decision**              | 敏捷     | S11-STORY-006      |
| 2026-06-30 | Sprint 11 | Review 推荐 **Ready for Acceptance** · 建议 Sprint **Accepted with follow-ups**（**待 PO**）        | 敏捷     | Sprint 11 Closeout |
| 2026-06-30 | Git       | S11 @ `4596f7d` · origin @ `653c70a`（本地 +11）· `release/1` @ `6cd1dfc` · **67 ahead** · 未 merge | Git      | DECISION-111       |

---

## 2026-06-30 · Sprint 11 Closeout / Release Merge 授权

| 日期       | Sprint     | 变更摘要                                                                                          | 影响范围 | 关联         |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------- | -------- | ------------ |
| 2026-06-30 | Sprint 11  | **S11-STORY-006 Accepted / Done** · Sprint 11 **Accepted with follow-ups / Closed**               | 敏捷     | DECISION-114 |
| 2026-06-30 | Sprint 11  | Follow-ups 保持 **Open**：P1-S11-002 · P1-S11-004 · P2-S11-001～003；不自动纳入 Sprint 12         | Backlog  | Sprint 11    |
| 2026-06-30 | Git        | PO 授权 `--no-ff` merge S11 → `release/1`；**未授权 push** · **未授权 release/1 → main**          | Git      | DECISION-114 |
| 2026-06-30 | Production | Production 仍为 **Prelaunch** · Basic Auth / noindex / robots Disallow 保留；Release 1 **未关闭** | 运维     | DECISION-113 |

---

## 2026-06-30 · Sprint 11 Story Acceptance（PO 确认）

| 日期       | Sprint    | 变更摘要                                                                                                           | 影响范围   | 关联 Story / Backlog  |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------- |
| 2026-06-30 | Sprint 11 | **PO 验收**：001 **Accepted with follow-ups** · 002/003 **Accepted** · 005 **Accepted with follow-ups** · **Done** | 敏捷       | S11-STORY-001~003/005 |
| 2026-06-30 | Sprint 11 | Follow-ups 保留 Open：**P1-S11-002**（005 运行时）· **P1-S11-004**（OSS/SLS/CloudMonitor）                         | Backlog    | P1-S11-002/004        |
| 2026-06-30 | Sprint 11 | **P1-S11-003 Resolved**（001～003 PO 签收治理项已解决）                                                            | 治理       | P1-S11-003            |
| 2026-06-30 | Sprint 11 | Closeout Readiness **仍为 Not Ready** · Sprint **In Progress / Not Closed** · **006 未启动**                       | 敏捷       | S11-STORY-006         |
| 2026-06-30 | Sprint 11 | **S11 merge `release/1`** @ `3a8203b` · Sprint 11 **Accepted with follow-ups / Closed**                            | Git / 敏捷 | DECISION-114          |

---

## 2026-06-08 · S10-STORY-011 Done（merge sprint）

| 日期       | Sprint    | 变更摘要                                                                                                                                             | 影响范围               | 关联 Story / Decision        |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------- |
| 2026-06-08 | Sprint 10 | **S10-STORY-011 Done**：`feature/s10-story-011-integration-readiness` merge → `sprint/s10-db-backed-style-admin-v1` @ `4c301d0` · 用户确认关闭 Story | Git / 敏捷             | S10-STORY-011 · DECISION-109 |
| 2026-06-08 | Sprint 10 | Promote gate · FIX-A/C fidelity · Harvest compat · CHORE-011B · html_paste theme/ordinal · BUG-COPY-FIDELITY-001/002 个案                            | runtime / Admin / Copy | S10-STORY-011                |
| 2026-06-08 | Sprint 10 | Sprint 10 后半段 HTML Harvest 链路（009→010→011）**完成** · 下一步 **012~014**                                                                       | 敏捷                   | S10-STORY-012~014            |

---

## 2026-06-08 · BUG-S10-COPY-FIDELITY-002 卡片居中 Preview/Copy parity

| 日期       | Sprint    | 变更摘要                                                                                                                                | 影响范围        | 关联 Story / Decision                     |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------- |
| 2026-06-08 | Sprint 10 | **BUG-S10-COPY-FIDELITY-002 Fixed**：`heading_card_centered` Copy 移除 h3 多余 `border-top`/`border-bottom` 与 padding，与 Preview 一致 | Copy / Renderer | S10-STORY-011 · BUG-S10-COPY-FIDELITY-002 |

---

## 2026-06-08 · DEBT-DSL-RC Legacy renderContract 双轨渲染归档

| 日期       | Sprint    | 变更摘要                                                                                                                                 | 影响范围    | 关联 Story / Decision        |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| 2026-06-08 | Sprint 10 | 归档 **DEBT-DSL-RC-001~006**：Registry `title_block_v1` Preview/Copy 双轨（React vs `renderPublish*`）为过渡债务 · 目标 tree 统一 decode | 架构 / 文档 | DECISION-110 · S10-STORY-013 |

---

## 2026-06-08 · BUG-S10-COPY-FIDELITY-001 杂志竖线 Preview/Copy parity

| 日期       | Sprint    | 变更摘要                                                                                                                      | 影响范围        | 关联 Story / Decision                     |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------- |
| 2026-06-08 | Sprint 10 | **BUG-S10-COPY-FIDELITY-001 Fixed**：`heading_magazine_left_bar` Copy 改用双嵌套 `section` 竖线（1px + 3px），与 Preview 一致 | Copy / Renderer | S10-STORY-011 · BUG-S10-COPY-FIDELITY-001 |

---

## 2026-06-08 · S10-STORY-011 Integration Readiness

| 日期       | Sprint    | 变更摘要                                                                                                                                                     | 影响范围       | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | --------------------- |
| 2026-06-08 | Sprint 10 | **Integration 分支** `feature/s10-story-011-integration-readiness`：FF merge 31 commits（promote · theme tokens · compat off · border theme · aa555cbf fix） | Git / 011      | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | 修复 `fidelity-encoder.test.ts` ordinal 期望（decoder/runtime 01/02/03 vs raw encode 03）                                                                    | 测试           | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | 修复 `runtime-variant-dsl-pool.test.ts` mock 缺 `sources` 导致误 `code_fallback`                                                                             | 测试 / runtime | S10-STORY-011 · 011A  |
| 2026-06-08 | Sprint 10 | TS/build 收口（decoder theme tokens · harvest-form error branch · candidate-dsl-render）                                                                     | 代码           | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | 全量 **1293 tests PASS** · lint PASS · build PASS · **已 merge sprint** @ `4c301d0`                                                                          | 验收           | S10-STORY-011         |
| 2026-06-08 | Sprint 10 | 后续拆分：**012** Compat Recalibration · **013** Schema Cleanup · **014** Architecture Audit / Closeout                                                      | 敏捷           | S10-STORY-012~014     |

---

## 2026-06-08 · S10-CHORE-011B 全局 Compatibility Mode 默认 off

| 日期       | Sprint    | 变更                                                                                       | 类型        | 关联                          |
| ---------- | --------- | ------------------------------------------------------------------------------------------ | ----------- | ----------------------------- |
| 2026-06-08 | Sprint 10 | **全局 Compatibility Mode** 默认 off · DEBT-WC 归档 · gate validator/copy filter/copy-safe | 代码 / 文档 | DECISION-109 · S10-CHORE-011B |

---

## 2026-06-07 · S10-STORY-011 Harvest WeChat Compatibility Spec Mode

| 日期       | Sprint    | 变更                                                                                                                                | 类型           | 关联          |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| 2026-06-07 | Sprint 10 | **011 诊断开关**：`STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE` off/report/enforce · Harvest UI · trace · promote `compatibilityStatus` | 代码 / Harvest | S10-STORY-011 |

---

## 2026-06-07 · S10-STORY-011 FIX-A DSL Decode Source-Exact

| 日期       | Sprint    | 变更                                                                                                                              | 类型           | 关联                |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------- |
| 2026-06-07 | Sprint 10 | **011 FIX-A**：bordered heading encoder · `dsl_tree_html_preview` · empty=failed · source-exact trace · 禁止 DB DSL 语义 fallback | 代码 / runtime | S10-STORY-011 FIX-A |

---

## 2026-06-07 · S10-STORY-011A FIX-A Eliminate Runtime Dual Track

| 日期       | Sprint    | 变更摘要                                                                                                               | 影响范围       | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **011A FIX-A**：DB 可用时 `/preview` 用户侧 runtime 单轨 DSL Decoder · 移除 `user-preview-render` → `renderBlock` 回退 | 代码 / runtime | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 新增 `runtime-variant-dsl-pool` · `DslRuntimeSnapshot` · preview page 加载全量 runtime DSL                             | 代码 / 架构    | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | release1_required / first-wave variants 纳入 runtime DSL pool（非 userSelectable 过滤）                                | runtime        | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 测试 `dsl-runtime-single-track` · `runtime-variant-dsl-pool` · 1172 tests PASS                                         | 测试           | S10-STORY-011A        |

---

## 2026-06-07 · S10-STORY-011A DSL Runtime + Encoder / Decoder Core

| 日期       | Sprint    | 变更摘要                                                                                               | 影响范围         | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------ | ---------------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-011A**：Article / Variant DSL Runtime · WeChat Compatibility Spec · Encoder / Decoder Core | 代码 / 架构      | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 新增 `src/core/wechat-compatibility/` · `src/core/dsl/` · `src/lib/dsl-runtime/`                       | 代码             | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | `definitionJson` = Variant DSL · Harvest / Import 编码 DSL · 用户侧 / Admin 共用 Decoder               | 代码 / runtime   | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 修复 promoted html_paste heading 用户侧 Preview 空渲染（DSL 路径）                                     | Bugfix / runtime | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | 新增架构文档 `article-variant-dsl-runtime.md` · `wechat-compatibility-spec.md`                         | 文档             | S10-STORY-011A        |
| 2026-06-07 | Sprint 10 | **S10-STORY-011 暂停 merge**（WIP stash）· 须在 011A 之上重新收口 Promote                              | 敏捷 / Git       | S10-STORY-011         |
| 2026-06-07 | Sprint 10 | 工作分支 `feature/s10-story-011a-dsl-runtime-encoder-decoder` · **未 merge sprint** · **未 commit**    | Git              | S10-STORY-011A        |

---

## 2026-06-07 · S10-STORY-010 Candidate Preview / Copy / Validator / Evidence

| 日期       | Sprint    | 变更摘要                                                                                                                                             | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-010**：DB candidate detail 增加 Preview / Copy / Validator inspection 面板                                                               | 代码 / 后台 | S10-STORY-010         |
| 2026-06-07 | Sprint 10 | `src/server/style-admin/inspection/` — dry-run + persist · validation runs · qualityStatus 更新                                                      | 代码 / 架构 | S10-STORY-010         |
| 2026-06-07 | Sprint 10 | manual Paste QA evidence 入库 · `paste_qa_pass` 不自动 userSelectable                                                                                | 数据 / 治理 | S10-STORY-010         |
| 2026-06-07 | Sprint 10 | **S10-STORY-010 Done**：fast-forward merge `feature/s10-story-010-candidate-inspection-evidence` → `sprint/s10-db-backed-style-admin-v1` @ `d5a6af3` | Git / 后台  | S10-STORY-010         |

---

## 2026-06-07 · S10-STORY-009 HTML Harvest → Candidate Variant v1

| 日期       | Sprint    | 变更摘要                                                                                                                                      | 影响范围    | 关联 Story / Decision         |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-009**：`/admin/style-library/harvest` HTML 粘贴采集 · heading/info_card candidate 入库                                            | 代码 / 后台 | S10-STORY-009                 |
| 2026-06-07 | Sprint 10 | `src/server/style-admin/harvest/` — sanitize · blockType 检测 · candidate builder · 幂等 `createHtmlHarvestCandidate`                         | 代码 / 架构 | S10-STORY-009                 |
| 2026-06-07 | Sprint 10 | `sourceType=html_paste` · `sourceCohort=s10_html_harvest_v1` · `qualityStatus=not_checked` · distribution 全 false                            | 数据 / 治理 | S10-STORY-009                 |
| 2026-06-07 | Sprint 10 | 写操作 `create_html_harvest_candidate` audit · lifecycle event · 未登录 / write disabled 拒绝                                                 | 安全 / 审计 | S10-STORY-008 · S10-STORY-009 |
| 2026-06-07 | Sprint 10 | **S10-STORY-009 Done**：fast-forward merge `feature/s10-story-009-html-harvest-candidate` → `sprint/s10-db-backed-style-admin-v1` @ `147c2e7` | Git / 后台  | S10-STORY-009                 |

---

## 2026-06-07 · S10-STORY-008 单管理员登录与后台保护

| 日期       | Sprint    | 变更摘要                                                                                                                                                      | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-008**：单管理员登录 · `/admin/login` · session cookie · `(protected)` layout guard                                                                | 代码 / 安全 | S10-STORY-008         |
| 2026-06-07 | Sprint 10 | 写操作 `requireStyleAdmin()` · actor `admin:<username>` 替代 `local-admin`                                                                                    | 代码 / 审计 | S10-STORY-008         |
| 2026-06-07 | Sprint 10 | 新增 `style-admin:hash-password` CLI · `.env.example` STYLE*ADMIN*\* 占位                                                                                     | 工具 / 配置 | S10-STORY-008         |
| 2026-06-07 | Sprint 10 | **S10 后台保护完成**：login / logout / session guard · 写操作 actor `admin:<username>`                                                                        | 安全 / 验收 | S10-STORY-008         |
| 2026-06-07 | Sprint 10 | **S10-STORY-008 Done**：fast-forward merge `feature/s10-story-008-admin-login-protection` → `sprint/s10-db-backed-style-admin-v1` @ `71e7300` · 本地 E2E PASS | Git / 安全  | S10-STORY-008         |

---

## 2026-06-07 · S10-STORY-007 阿里云部署 Runbook

| 日期       | Sprint    | 变更摘要                                                                                                                                                 | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-07 | Sprint 10 | **S10-STORY-007**：新增 `docs/ops/` 部署 Runbook · 资源清单 · 环境变量 · 上线验收 · 故障回滚                                                             | 文档 / 运维 | S10-STORY-007         |
| 2026-06-07 | Sprint 10 | 新增 `GET /api/health` · `pnpm db:migrate:deploy` · `.env.example` pool/OSS 占位                                                                         | 代码 / 运维 | S10-STORY-007         |
| 2026-06-07 | Sprint 10 | 阿里云资源隔离：独立 ECS / RDS / OSS · 华北 2 · 不共用秒篇服务                                                                                           | 文档 / 架构 | S10-STORY-007         |
| 2026-06-07 | Sprint 10 | **S10-STORY-007 Done**：fast-forward merge `docs/s10-story-007-aliyun-deployment-runbook` → `sprint/s10-db-backed-style-admin-v1` @ `03ec49b` · 审查通过 | Git / 运维  | S10-STORY-007         |

---

## 2026-06-28 · Sprint 12 Product Governance Audit

| 日期       | Sprint    | 变更摘要                                                                                                                         | 影响范围                           | 关联 Story / Decision |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------- |
| 2026-06-28 | Sprint 12 | **S12-STORY-001 启动并进入审查**：现有项目管理与产品文档体系审计 · Product Governance & Release 2 Planning                       | 产品治理 / 敏捷                    | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | 新增 `docs/governance/s12-current-system-audit.md`、`product-governance-target-model.md`、`product-governance-migration-plan.md` | 文档 / 治理                        | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | 新增 `sprint12-product-governance-r2-planning.md`，并在 `sprint-backlog.md` 记录 Sprint 12 基线依赖与 S12 ID 冲突                | 敏捷 / Backlog                     | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | **S12-STORY-001 审查修正**：Sprint 12 恢复为 9 Story；Deferred Debt Replanning 移回 Product Backlog / Deferred Register 候选     | 产品治理 / 敏捷                    | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | 修正目标模型：Journey → Activity → Step → User Story；User Story 明确为 Product Backlog Item 类型之一                            | 产品治理                           | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | 旧 Release 2 规划标记为 Superseded / Pending Replanning；S12-STORY-008 重新制定正式 Release 2 Scope                              | Product Backlog / Release Planning | S12-STORY-001         |

---

## 2026-06-28 · S12-STORY-001 Cursor Governance Rule Sync

| 日期       | Sprint    | 变更摘要                                                                                                                       | 影响范围           | 关联 Story / Decision |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------------------- |
| 2026-06-28 | Sprint 12 | **S12-STORY-001 治理验收补充**：新增 `.cursor/rules/agile-governance.mdc`，固化 Sprint / Story 启动、DoR、范围、合并与停止闸门 | Cursor 规则 / 治理 | S12-STORY-001         |
| 2026-06-28 | Sprint 12 | `agile-rules.mdc`、`collaboration-rules.mdc` 最小引用更新，指向新治理闸门文件                                                  | Cursor 规则        | S12-STORY-001         |

---

## 2026-06-29 · S12-STORY-001 Sprint / Release 文档结构对齐

| 日期       | Sprint    | 变更摘要                                                                                                  | 影响范围    | 关联 Story / Decision        |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------- |
| 2026-06-29 | Sprint 12 | **DECISION-115**：Sprint / Release 独立平级目录与全局索引原则                                             | 治理 / 敏捷 | S12-STORY-001 · DECISION-115 |
| 2026-06-29 | Sprint 12 | 修正 `.cursor/rules/agile-rules.mdc` 等当前规范：全局文件仅索引，详细 Backlog 进 `sprints/` / `releases/` | Cursor 规则 | S12-STORY-001                |
| 2026-06-29 | Sprint 12 | `release-plan.md` / `sprint-backlog.md` / `sprint-plan.md` 增加索引角色说明；历史详细内容保留             | 敏捷文档    | S12-STORY-001                |

---

## 2026-06-29 · S12-STORY-001 Accepted / Done

| 日期       | Sprint    | 变更摘要                                                                                                                                                               | 影响范围    | 关联 Story / Decision |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 2026-06-29 | Sprint 12 | **S12-STORY-001 Accepted / Done**：Product Owner 验收通过；merge `docs/s12-story-001-sprint-release-structure-alignment` → `sprint/s12-product-governance-r2-planning` | 敏捷 / 治理 | S12-STORY-001         |
| 2026-06-29 | Sprint 12 | 领域规则时效性审计：`style-system-rules.mdc` · `wechat-copy-rules.mdc`；Execution Report commit 记录规则同步                                                           | Cursor 规则 | S12-STORY-001         |

---

## 2026-06-30 · S12 Planning Baseline Alignment

| 日期       | Sprint    | 变更摘要                                                                                                                                        | 影响范围   | 关联 Story / Decision |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| 2026-06-30 | Sprint 12 | **`release/1` @ `3a8203b` merge → `docs/s12-release1-baseline-alignment`** · 保留 S12-STORY-001 治理成果 · 纳入 Sprint 11 Closed / DECISION-114 | Git / 敏捷 | Baseline Alignment    |
| 2026-06-30 | Sprint 12 | **DECISION-115** 承接 Sprint / Release 目录结构（原 S12 DECISION-114 编号与 S11 Closeout DECISION-114 解冲突）                                  | 治理       | DECISION-115          |
| 2026-06-30 | Sprint 12 | Sprint 12 Plan **Not Approved** · S12-STORY-002 **Not Started** · 仅基线对齐，不代表 Sprint 12 产品开发启动                                     | 敏捷       | S12-STORY-002         |
