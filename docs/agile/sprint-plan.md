# Sprint Plan

> 轻篇公众号排版 · qingpian-wechat-editor

## Sprint 周期原则

- 后续 Sprint 可按合理工作量拆分，避免单个 Sprint 塞入过多 Release 1 范围
- Sprint 1 不受「1 人 / 1 周」约束限制，需完成必要地基（见 DECISION-011）
- 不允许把 Release 1 的全部实现范围塞进单个 Sprint
- **Sprint 2 启动前须完成 S1-STORY-021 审查及 S1-STORY-023 契约收口**（DECISION-029、DECISION-034~035）

---

## Sprint 1：正式项目启动、核心技术方案定稿与工程治理

**总目标：** 完成正式项目启动、核心技术方案定稿、Git 仓库治理。

### Sprint 1-A：项目初始化与文档骨架 — Done

- 项目工程初始化（Next.js、TypeScript、Tailwind、ESLint、Prettier、Vitest、Playwright、Zod）
- Cursor 规则体系
- docs/agile、docs/product、docs/architecture 文档骨架
- Sprint 2 候选目标沉淀
- 旧一键成稿历史经验审计与迁移清单

### Sprint 1-B：核心技术方案补齐与 Git 仓库治理 — **Closed**

- Git 仓库治理与分支策略
- Article / Block Schema 正式技术方案
- Style System 正式技术方案
- Preview / Copy Renderer 正式技术方案
- Copy-to-WeChat 与复制一致性正式技术方案
- Generation / Streaming 正式技术方案
- 核心技术方案一致性审查
- Release 1 整体架构定稿（S1-STORY-020）— **Done**
- 实现前契约缺口修正（S1-STORY-021）— **Done**
- Sprint 2 启动前契约收口（S1-STORY-023）— **Done**
- Component DSL / Style System 收口（S1-STORY-024~027）— **Done**
- Sprint 1-B 总 Audit（S1-STORY-028）— **Done**
- 关闭前状态同步与正式关闭（S1-STORY-029）— **Done**（DECISION-051）

**Sprint 1 明确不做：** 业务功能代码实现（Article Zod、Renderer、Copy Pipeline、AI 生成、SSE 实现、样式 Gallery）。

---

## Sprint 1-B Closure Summary

| 项 | 内容 |
|----|------|
| **关闭日期** | 2026-05-30 |
| **关闭结论** | Final audit **B 级**通过 |
| **P0** | 0 |
| **P1 / P2** | 已登记至后续 Sprint / Product Backlog（见下方登记表） |
| **用户确认** | Checklist #10：已确认接受 B 级 final audit；Checklist #11：已确认可以关闭 Sprint 1-B |
| **Sprint 2** | **Closed**（2026-05-31；DECISION-054） |
| **Sprint 3-A** | **Closed**（2026-05-31；DECISION-057） |
| **Sprint 3-B** | **Closed**（2026-06-01；DECISION-059） |
| **Sprint 4-A** | **Closed**（2026-06-01；DECISION-061） |
| **Sprint 4-B** | **Closed**（2026-06-01；DECISION-063） |
| **Sprint 3-C** | **In Review / Close Readiness**（2026-06-01；DECISION-064；audit Grade A） |
| **Release 1 主干** | `release/1`（Sprint 4-A / 4-B 已 merge，DECISION-061、DECISION-063） |
| **Sprint 3-C 分支** | `sprint/s3c-style-assignment-validation`（从 `release/1` 切出） |
| **下一步** | **等待用户确认是否关闭 Sprint 3-C**；确认后可 merge sprint → `release/1` |

---

## Sprint 1-B Close Readiness Checklist

> 登记于 S1-STORY-029；Sprint 1-B 已于 2026-05-30 正式关闭（DECISION-051）。

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | final audit 已 merge 至 `sprint/s1b-core-tech-governance`（`25b9bad`） | ✅ |
| 2 | S1-STORY-021~028 状态已同步（Done + merge 标注） | ✅ |
| 3 | P0 = 0（见 `sprint1b-final-audit.md`） | ✅ |
| 4 | P1/P2 已登记 Product Backlog 或后续 Sprint | ✅ |
| 5 | Style Quality Gate 已登记 Product Backlog（TECH-ARCH-023） | ✅ |
| 6 | Sprint 2 范围明确：Article / Block Schema + InlineContent 代码契约 | ✅ |
| 7 | Sprint 3-A/B/C、4-A/B、5、6-A/B 拆分清晰 | ✅ |
| 8 | Release 1 first wave 11×3 + expansion 策略已确认（DECISION-043） | ✅ |
| 9 | 受控 AI Style Selection 边界已确认（DECISION-040） | ✅ |
| 10 | 用户确认接受 B 级 final audit | ✅ **已确认** |
| 11 | 用户确认可以关闭 Sprint 1-B | ✅ **已确认** |

---

## S1-STORY-022 / final audit 遗留 P1/P2 登记

> 登记于 S1-STORY-023、S1-STORY-028、S1-STORY-029；Sprint 1-B 已解决 P1-001、P1-008、P1-009、P1-012。

### P1（登记项 · 见 `sprint1b-final-audit.md` §10）

| ID | 问题 | 建议 Sprint | Sprint 1-B 处理 |
|----|------|-------------|-----------------|
| P1-001 | block 文本字段 `body` vs `text` 命名不一致 | Sprint 2 启动前 | **已解决**（DECISION-034） |
| P1-002 | InlineMark → copy-safe CSS 映射表缺失 | Sprint 3 / Sprint 4 | 登记 · TECH-ARCH-002 |
| P1-003 | StyleOrchestrator 文章级节奏代码未实现 | Sprint 3-C | 登记 · TECH-ARCH-011 |
| P1-004 | WeChatCompatibilityProfile 无 machine-readable fixture | Sprint 3-A | **已解决**（S3A-STORY-004） |
| P1-005 | list / info_card copy 结构保真规则未细化 | Sprint 4-B | 登记 |
| P1-006 | Clipboard text/html + text/plain 双格式未写清 | Sprint 4 | 登记 |
| P1-007 | requireTextNodeTypography 细则未展开 | Sprint 4 | 登记 |
| P1-008 | rendering-pipeline.md 实现顺序与 Sprint 2~6 不一致 | Sprint 1-B | **已解决**（S1-STORY-023） |
| P1-009 | sprint-backlog 021~024 状态滞后 | Sprint 1-B | **已解决**（S1-STORY-029） |
| P1-010 | architecture-overview §19 仍写 S1-STORY-021 In Review | Sprint 1-B 关闭 | **已解决**（S1-STORY-029 关闭轮） |
| P1-011 | 各 variant copySafety tier 未逐项登记 | Sprint 3-B | 登记 · TECH-ARCH-018 |
| P1-012 | Style Quality Gate 未登记 product-backlog | Backlog | **已解决**（TECH-ARCH-023） |

### P2（登记项）

| ID | 问题 | 建议 Sprint / 归属 |
|----|------|-------------------|
| P2-001 | quote / highlight / cta 未升级 InlineContent | Release 2 |
| P2-002 | classic-news slot 无 SlotRenderSpec 示例 | Sprint 3-B |
| P2-003 | semantic → visual 映射表未写 | Sprint 3 |
| P2-004 | article-schema InlineContent 说明重复 | **已解决**（S1-STORY-023） |
| P2-005 | Story 018/019 编号缺口 | 文档 chore |
| P2-006 | first wave 33 variants 视觉效果可能偏保守 | TECH-ARCH-023 / Sprint 4+ |
| P2-007 | expansion variants 未拆独立 Story | Release 1 expansion planning（TECH-ARCH-019） |

---

## Sprint 2 Close Readiness Checklist

> 登记于 S2-STORY-007；Sprint 2 已于 2026-05-31 正式关闭（DECISION-054）。

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | S2-STORY-002~007 全部 Done | ✅ |
| 2 | Contract audit A 级，P0=0（`sprint2-contract-audit.md`） | ✅ |
| 3 | Code audit A 级，P0=0（`sprint2-code-audit.md`） | ✅ |
| 4 | lint / test / build PASS | ✅ |
| 5 | Sprint 2 范围未越界 | ✅ |
| 6 | 用户确认接受 contract audit（A，P1=1，P2=3） | ✅ **已确认** |
| 7 | 用户确认接受 code audit（A，P1=3，P2=5） | ✅ **已确认** |
| 8 | 用户确认关闭 Sprint 2 | ✅ **已确认** |
| 9 | merge `sprint/s2-article-block-schema` → `release/1` | ✅ **已确认** |

### Sprint 2 audit P1/P2 登记（不阻塞关闭）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P1-S2-001 | 测试 fixture 与 `tests/fixtures/articles/` 重复维护 | Chore / Sprint 3-A 前 |
| P1-CODE-001 | streaming partial Article vs `blocks.min(1)` | Sprint 5 |
| P1-CODE-002 | InlineMark color token 未接 Style registry | Sprint 3-B / 4-A（P2-S3A-003） |
| P2-S2-001 ~ P2-CODE-005 | 见 `sprint2-contract-audit.md` / `sprint2-code-audit.md` §10 | Sprint 3~6 / Release 2 |

### Sprint 3-A Close Readiness Checklist

> 登记于 S3A-STORY-007；详见 `docs/architecture/audits/sprint3a-contract-audit.md` §11。

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | S3A-STORY-002~006 Done 且 merge 至 sprint | ✅ |
| 2 | Contract audit grade **A**，P0=0 | ✅ |
| 3 | lint / test / build PASS（221 tests） | ✅ |
| 4 | Sprint 3-A 范围未越界 | ✅ |
| 5 | layoutMode / copySafety 文档最小同步 | ✅ |
| 6 | **用户确认关闭 Sprint 3-A** | ✅ **已确认**（2026-05-31；DECISION-057） |
| 7 | merge sprint → `release/1` | ✅ **已确认**（2026-05-31；DECISION-057） |

### Sprint 3-A audit P1/P2 登记（不阻塞关闭）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P1-S3A-001 | §11.4 catalog layoutMode 与代码 enum 映射 | Sprint 3-B |
| P1-S3A-002 | wechat-copy-style-rules profile 字段与代码结构差异 | Sprint 3-B / 4-A |
| P1-S3A-003 | validateStyleRegistry 命名易混淆 | Sprint 3-B |
| P1-S3A-004 | ResolvedBlockStyle 未展开 componentProtocol | Sprint 4-A |
| P2-S3A-001 ~ P2-S3A-003 | 见 `sprint3a-contract-audit.md` §10 | Sprint 3-B~6 |

---

## Sprint 2 ~ 6 计划（Release 1 代码实现）

> **Sprint 3-A 状态：Closed**（2026-05-31；DECISION-057）
> **Sprint 3-B 状态：Closed**（2026-06-01；DECISION-059；contract audit **A**，P0=0；分支 `sprint/s3b-first-wave-variant-registry` 已 merge 至 `release/1`）
> **Sprint 4-A 状态：Closed**（2026-06-01；DECISION-061；contract audit **A**，P0=0；分支 `sprint/s4a-text-first-renderer` 已 merge 至 `release/1`）
> **Sprint 4-B 状态：Closed**（2026-06-01；DECISION-063；contract audit **A**，P0=0；分支 `sprint/s4b-structured-block-renderer` 已 merge 至 `release/1`）
> **Sprint 3-C 状态：In Progress**（2026-06-01；DECISION-064；Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry）
>
> 业务功能实现必须在核心技术方案 + 实现前契约完成之后进入（DECISION-015、DECISION-029~045、DECISION-051）。

### Sprint 2：Article / Block Schema + InlineContent 代码契约 — **Closed**（2026-05-31）

**分支：** `sprint/s2-article-block-schema`（已 merge 至 `release/1`） · **Release 1 主干：** `release/1`

**Stories：** S2-STORY-001（启动）~ S2-STORY-007（audit）— 见 `sprint-backlog.md`

**目标：**

- 实现 Article / Block TypeScript 类型
- 实现 Zod Schema
- 实现 InlineContent / InlineMark
- 实现基础 fixture
- 实现 schema 单元测试

**不做：** Renderer、Style System、Generation、**AI Style Selection**

### Sprint 3-A：Style System Contract & Registry Infrastructure — **Closed**（2026-05-31）

**分支：** `sprint/s3a-style-system-infra`（已 merge 至 `release/1`，DECISION-057） · **Audit：** `docs/architecture/audits/sprint3a-contract-audit.md`（grade **A**，P0=0，P1=4，P2=3）

**关闭结论：**

- Contract audit **A** 级；P0=0；P1=4 / P2=3 已登记
- lint / test / build PASS（221 tests）
- 未越界实现 33 variants / Preview / Copy / Paste QA
- 用户确认关闭（DECISION-057）

**Stories：** S3A-STORY-001（启动）~ S3A-STORY-007（audit + 关闭）— 见 `sprint-backlog.md`

**目标：**

- Theme / Preset / VariantDefinition / Registry **基础设施**
- StyleResolver → ResolvedBlockStyle / ResolvedArticleStyle
- WeChatCompatibilityProfile 基础校验
- StyleValidationResult / FallbackVariantPolicy / schemaVersion
- TitleBlockLayoutCompatibility 定义

**不做：** 全部 **33** first-wave required variants registry；Preview / Copy Renderer；AI Style Selection 生成；VisualAssetRegistry 全量 assets

### Sprint 3-B：First-wave Required Variant Registry — **Closed**（2026-06-01）

**分支：** `sprint/s3b-first-wave-variant-registry`（从 `release/1` 切出，DECISION-058；已 merge 至 `release/1`，DECISION-059）

**Stories：** S3B-STORY-001（启动）~ S3B-STORY-007（audit）— 见 `sprint-backlog.md`

> **Sprint 3-A 遗留须纳入（DECISION-058）：**
>
> - **P1-S3A-001（P0 前置）：** `style-system.md` §11.4 titleBlock catalog 历史 layoutMode → 代码 snake_case enum 映射（S3B-STORY-002）
> - **P2-S3A-002（P0 前置）：** slot 级 copySafety 尚未在 schema / registry 强制（S3B-STORY-002）
>
> **同步登记（不阻塞 S3B-STORY-001）：** P1-S3A-002、P1-S3A-003、P2-S3A-003

**目标：**

- **11 block × 3 = 33** first-wave release1_required variants registry definitions
- title / heading titleBlock ComponentProtocol
- titleBlock first-wave variants（不含 `magazine_left_bar_title` candidate）
- SlotContentBinding 规则落地到 registry
- first-wave registry validation / coverage 测试

**不做：**

- Preview / Copy Renderer
- Paste QA
- AI Style Selection 生成
- VisualAssetRegistry 全量 assets
- StyleOrchestrator
- Generation / Streaming

**关闭结论：**

- Contract audit **A** 级；P0=0；P1=5 / P2=3 已登记
- 33 first-wave variants coverage 完整（11 block × 3）
- lint / test / build PASS（286 tests）
- 未越界实现 Preview / Copy / Paste QA / AI / VisualAssetRegistry / StyleOrchestrator / Generation
- 用户已确认关闭 Sprint 3-B，并确认 merge sprint → `release/1`
- **Sprint 4-A 已启动**（DECISION-060）

### Sprint 3-B audit P1/P2 登记（不阻塞关闭）

| ID | 问题 | 建议 Sprint |
|----|------|-------------|
| P1-S3B-001 | 33 variants 尚未经过 Preview / Copy Renderer 实际保真验证 | Sprint 4-A / 4-B |
| P1-S3B-002 | `balanced` copySafety variants 需要 WeChat paste QA 验证 | Sprint 4 / 6-B |
| P1-S3B-003 | cta / image_placeholder 仍为占位契约 | Sprint 4-B / Release 2+ |
| P1-S3B-004 | 缺少 style quality gallery / 人工视觉验收入口 | Sprint 4 / 6 |
| P1-S3B-005 | optional slot 字段需 Renderer 明确 disabled/fallback 行为 | Sprint 4-B |
| P2-S3B-001 ~ P2-S3B-003 | 见 `sprint3b-contract-audit.md` §11 | Sprint 4~6 / Release 2 |

### Sprint 3-C：Style Assignment / Selection Validation + Orchestrator + VisualAssetRegistry — **In Review / Close Readiness**（2026-06-01）

**分支：** `sprint/s3c-style-assignment-validation` @ `d3db85b`（S3C-STORY-002~005 merged）

**Stories：** S3C-STORY-001~006 Done · audit `sprint3c-style-system-contract-audit.md` Grade **A** · P0=0

> **Close Readiness：** S3C-STORY-006 audit 完成；**须用户确认**后才可关闭 Sprint 3-C 或 merge 至 `release/1`；**不自动启动 Sprint 5 / Sprint 6-A**

> **启动时机：** Sprint 4-A / 4-B 已 Closed 并 merge 至 `release/1`（DECISION-061、DECISION-063）；first-wave 33 variants registry 与 Preview / Copy Renderer 最小闭环已完成，Sprint 3-C 承接 Style System **分配与校验**闭环，为 Sprint 5 Generation 样式建议提供 validation pipeline。

**Sprint Goal：**

- 完成 Style Assignment 输入输出契约代码化（`StyleSelectionRequest` / `StyleAssignmentPatch` / `ArticleStylePlan`）
- StyleOrchestrator 最小规则 **R1 / R2 / R8** 实现
- VisualAssetRegistry 最小 **15~30** 系统内置 assets 注册
- ComponentProtocol / BlockVisualProtocol / Registry / Profile **完整校验链**（Style Selection Validation Pipeline）
- Theme / Preset / Density / Slot 与 variant 组合边界落地
- Style Assignment fixture 与 validation snapshot seeds
- **expansion variants 规划文档**（不要求 expansion registry 全量实现）

**不做：**

- Preview / Copy Renderer 新实现或大范围修改
- Generation / Streaming / AI 样式建议**生成**（生成归 Sprint 5；Sprint 3-C 只做 validation 入口）
- 真实微信公众号 Paste QA、Style Gallery、业务 UI、样式市场
- expansion variants 全量 registry 实现
- merge 至 `main`

**Story 拆分调整（相对 sprint-plan 原叙事）：**

| 原 sprint-plan 项 | 纳入 Story |
|-------------------|------------|
| StyleSelectionRequest / Patch validation | S3C-STORY-002 / S3C-STORY-005 |
| StyleOrchestrator R1/R2/R8 | S3C-STORY-003 |
| VisualAssetRegistry 15~30 assets | S3C-STORY-004 |
| ComponentProtocol / BlockVisualProtocol 校验链 | S3C-STORY-004 / S3C-STORY-005 |
| expansion variants 规划 | S3C-STORY-006（规划文档，非 registry 实现） |

**登记 P1/P2：** P1-003（已收口）、TECH-ARCH-010~012 / TECH-ARCH-017（Done）、P1-S3B-004、P1-S3C-001~005 — 见 `sprint3c-style-system-contract-audit.md` §11

### Sprint 4-A：Preview / Copy Renderer for Text-first Blocks — **Closed**（2026-06-01）

**分支：** `sprint/s4a-text-first-renderer`（从 `release/1` 切出，DECISION-060；已 merge 至 `release/1`，DECISION-061）

**Stories：** S4A-STORY-001（启动）~ S4A-STORY-007（audit）— 见 `sprint-backlog.md`

**目标：**

- title / lead / heading / paragraph / divider 成对 Preview / Copy
- 使用 Sprint 3-B **first-wave** required variants
- 建立 Preview / Copy 成对 Renderer 实现边界
- 启动最小 Paste QA seed（非完整 33 variants QA）

**不做：**

- structured blocks（list / quote / highlight / info_card / cta / image_placeholder）
- AI Style Selection / Generation / Streaming
- VisualAssetRegistry 全量 assets / StyleOrchestrator
- 完整 33 variants Paste QA

**登记 P1/P2：** P1-S3B-001~002、P1-S3B-004、P2-S3B-002~003、P1-S3A-004、P1-CODE-002

**Audit / Close Readiness 摘要（S4A-STORY-007）：**

- Audit 文档：`docs/architecture/audits/sprint4a-renderer-contract-audit.md`
- Grade：**A**
- P0：0
- P1：4
- P2：1
- S4A-STORY-001~007：全部 Done 且 merge 至 `sprint/s4a-text-first-renderer`
- 验证：`corepack pnpm lint` / `test`（378 tests）/ `build` PASS

**关闭结论（DECISION-061）：**

- text-first Preview / Copy Renderer **最小闭环完成**
- title / heading / lead / paragraph / divider 已覆盖
- Copy HTML snapshot / Clipboard payload / Paste QA seed 已建立
- Paste QA seed 为 **Not Run**，不代表真实公众号粘贴通过
- Sprint 4-A 已关闭；`sprint/s4a-text-first-renderer` 已 merge 至 `release/1`（`b2efdb2`）
- 范围：未实现 structured blocks、业务页面、Clipboard API、真实 Paste QA、AI Style Selection、Generation / Streaming、Style Gallery
- 下一步：Sprint 4-B 已启动（DECISION-062）；S4B-STORY-002 起实现 structured blocks Renderer

### Sprint 4-A audit P1/P2 登记（不阻塞 Close Readiness）

| ID | 问题 | 建议 Sprint / 归属 |
|----|------|-------------------|
| P1-S4A-001 | 尚未执行真实微信公众号 Paste QA | Sprint 6-B / Paste QA 回归 |
| P1-S4A-002 | `balanced` copySafety variants 仍需粘贴细节验证 | Sprint 4-B / 6-B |
| P1-S4A-003 | Copy HTML snapshot seed 仅覆盖 6 个代表 variants，未覆盖全部 15 个已实现 text-first variants | Sprint 6-A / 6-B |
| P1-S4A-004 | InlineMark color 与 Style registry 完整 cross-registry 校验仍未完成 | Sprint 6 / Release 1 hardening |
| P2-S4A-001 | Style Gallery / 人工视觉验收入口仍缺失 | Sprint 6 / Release 2 |

### Sprint 4-B：Preview / Copy Renderer for Structured Blocks — **Closed**（2026-06-01；DECISION-063；audit Grade A；P0=0）

**分支：** `sprint/s4b-structured-block-renderer`（从 `release/1` 切出，DECISION-062）

**Stories：** S4B-STORY-001（启动）~ S4B-STORY-007（audit）— 见 `sprint-backlog.md`

**目标：**

- list / quote / highlight / info_card / cta / image_placeholder 成对 Preview / Copy
- 使用 Sprint 3-B **first-wave** required variants（18 structured block variants）
- 完成 first-wave **33 variants** 最小 Paste QA **计划**（S4B-STORY-006；状态 Not Run）
- cta / image_placeholder 仅 Release 1 **占位契约**渲染，不实现真实 QR / 外链 / 小程序 / 图片上传

**不做：**

- AI Style Selection / Generation / Streaming
- VisualAssetRegistry 全量 assets / StyleOrchestrator
- 真实微信公众号 Paste QA 全量执行
- 真实二维码生成、小程序卡片、图片上传 / 托管 / AI 生图
- Style Gallery / 业务页面

**登记 P1/P2：** P1-005、P1-S3B-003、P1-S3B-005、P1-S4A-002、P1-S4A-003、P2-S4A-001

**Sprint 4-B 前置遗留纳入 planning（S4B-STORY-001）：**

| ID | 问题 | 纳入 Story |
|----|------|------------|
| P1-005 | list / info_card copy 结构保真规则未细化 | S4B-STORY-002 / S4B-STORY-004 |
| P1-S3B-003 | cta / image_placeholder 占位契约，无真实 QR / 链接 / 小程序 / 图片能力 | S4B-STORY-005 |
| P1-S3B-005 | optional 字段需 renderer 明确 disabled / fallback 行为 | S4B-STORY-004 / S4B-STORY-005 |
| P1-S4A-002 | balanced copySafety 粘贴细节验证 | S4B-STORY-006 / 6-B |
| P1-S4A-003 | Copy HTML snapshot seed 覆盖不足 | S4B-STORY-006 |
| P2-S4A-001 | Style Gallery / 人工视觉验收入口缺失 | 登记 · 不要求 Sprint 4-B 实现 |

**Audit / Close Readiness 摘要（S4B-STORY-007）：**

- Audit 文档：`docs/architecture/audits/sprint4b-renderer-contract-audit.md`
- Grade：**A**
- P0：0
- P1：4
- P2：2
- S4B-STORY-001~006：全部 Done 且 merge 至 `sprint/s4b-structured-block-renderer`
- 验证：`corepack pnpm lint` / `test`（491 tests）/ `build` PASS

**关闭结论（DECISION-063）：**

- structured blocks Preview / Copy Renderer **最小闭环完成**
- list / quote / highlight / info_card / cta / image_placeholder 已覆盖 18 structured first-wave variants
- structured Copy HTML snapshot seed 已建立
- Release 1 first-wave 33 variants 最小 Paste QA plan 已建立
- Paste QA 状态全部为 **Not Run**，不代表真实公众号粘贴通过
- Sprint 4-B 已关闭；`sprint/s4b-structured-block-renderer` 已由用户确认 merge 至 `release/1`
- 范围：未执行真实 Paste QA、未 merge 至 `main`、未启动 Sprint 5 / Sprint 3-C / Sprint 6-A
- Sprint 6-A / 6-B 仍负责 fixture triple / first-wave Paste QA regression
- Sprint 3-C 仍未取消，但不在本轮自动启动
- Sprint 5 不在本轮自动启动

### Sprint 4-B audit P1/P2 登记（不阻塞 Close Readiness）

| ID | 问题 | 建议 Sprint / 归属 |
|----|------|-------------------|
| P1-S4B-001 | 33 variants 真实微信公众号 Paste QA 尚未执行 | Sprint 6-B |
| P1-S4B-002 | `balanced` copySafety variants 仍需真实粘贴细节验证 | Sprint 6-B |
| P1-S4B-003 | text-first snapshot 仍是 S4A 代表 seed，非全量 15 text-first variants snapshot | Sprint 6-A / 6-B |
| P1-S4B-004 | PasteTestRecord / fixture triple 体系尚未建立 | Sprint 6-A / 6-B |
| P2-S4B-001 | Style Gallery / 人工视觉验收入口仍缺失 | Sprint 6 / Release 2 |
| P2-S4B-002 | cta / image_placeholder 真实 QR / link / image 能力仍未实现 | Release 2+ |

### Sprint 5：Generation / Streaming + 受控 AI 样式选择最小闭环

**目标：**

- InputRequest / NormalizedInput、GenerationEvent、`done.article`
- **StyleSelectionRequest / StyleAssignmentPatch 生成**
- 所有样式建议必须走 Sprint 3-C validation pipeline
- 禁止 streamArticle；禁止绕过 Style System

**不变** — 与 S1-STORY-025 一致。

### Sprint 6-A：Fixture Triple Infrastructure

**目标：**

- Article JSON fixture
- Copy HTML snapshot schema
- Paste checklist / PasteTestRecord schema
- 复制一致性 Bug 录入流程

### Sprint 6-B：First-wave Required Variants Paste QA Regression

**目标：**

- **33** first-wave required variants 全量粘贴 QA
- PasteTestRecord 记录
- expansion variants 进入后续批次

**原则（DECISION-045）：**

- Sprint 2 / Sprint 5 **不变**
- 拆分保证可执行性，**不降低** Release 1 样式丰富度目标（最终 up to 11×5）
- First wave 先 11×3，expansion 分后续子 Sprint

---

## 原则

- 后续 Sprint 可按合理工作量继续拆分
- 不允许将 Release 1 全部实现塞进单个 Sprint
- Sprint 方向变更须记录到 `decisions.md`
