# Sprint 2 Contract Audit

> 审计日期：2026-05-31  
> 审计分支：`docs/s2-contract-audit-close-readiness`（基于 `sprint/s2-article-block-schema` @ `049b427`）  
> 审计对象：S2-STORY-002~006 代码契约、schema helpers、fixtures、单元测试  
> 方法：只读代码 + 文档对照审计；**不修改** schema 源码  
> 关联 Story：**S2-STORY-007**

---

## 1. Audit Summary

| 项 | 结论 |
|----|------|
| **Sprint** | Sprint 2 — Article / Block Schema + InlineContent 代码契约 |
| **Branch** | `sprint/s2-article-block-schema` @ `049b427` |
| **Scope** | TS 类型、Zod Schema、InlineContent、schema helpers、schema fixtures、单元测试 |
| **Audit date** | 2026-05-31 |
| **Overall grade** | **A** |
| **P0** | **0** |
| **P1** | **1** |
| **P2** | **3** |
| **Recommendation** | **有条件建议关闭 Sprint 2** — P0=0；须用户确认 Close Readiness Checklist 后关闭；须用户确认后方可 merge sprint → `release/1` |

**审计最终分级：A — Sprint 2 代码契约与架构文档一致；范围未越界；可进入 Sprint 3-A 准备（须用户确认 Sprint 2 关闭）。**

---

## 2. Audit Sources

### 2.1 敏捷文档

- `docs/agile/sprint-plan.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/changelog.md`
- `docs/agile/decisions.md`（DECISION-034、DECISION-053）
- `docs/agile/git-workflow.md`

### 2.2 架构文档

- `docs/architecture/article-schema.md`
- `docs/architecture/block-schema.md`
- `docs/architecture/architecture-overview.md`
- `docs/architecture/rendering-pipeline.md`
- `docs/architecture/generation-pipeline.md`
- `docs/architecture/copy-to-wechat-pipeline.md`

### 2.3 Sprint 2 代码

| 路径 | 文件数（TS） | 说明 |
|------|-------------|------|
| `src/core/article/` | 9 | InlineContent、Article Schema、parse/normalize |
| `src/core/blocks/` | 4 | 11 block discriminated union |
| `src/core/schema/` | 3 | ValidationResult、formatZodIssues |
| `tests/core/article/` | 4 test files | inline-content、article-schema、helpers、fixtures |
| `tests/core/blocks/` | 1 test file | block-schema |
| `tests/core/schema/` | 2 test files | validation-result、schema-fixtures |
| `tests/fixtures/articles/` | 6 files | 4 Article fixtures + shared + index |

### 2.4 Execution Reports

- `2026-05-31-s2-inline-content-contract.md`
- `2026-05-31-s2-block-schema-contract.md`
- `2026-05-31-s2-article-schema-contract.md`
- `2026-05-31-s2-schema-helpers.md`
- `2026-05-31-s2-schema-fixtures.md`
- `2026-05-31-s2-start-backlog-split.md`

### 2.5 Git 事实（Sprint 2 merge 链）

```text
sprint/s2-article-block-schema @ 049b427
  ← merge feature/s2-schema-fixtures      (S2-STORY-006)
  ← merge feature/s2-schema-helpers     (S2-STORY-005) @ 9a7d625
  ← merge feature/s2-article-schema-contract (S2-STORY-004) @ d68e503
  ← merge feature/s2-block-schema-contract   (S2-STORY-003) @ 93c6526
  ← merge feature/s2-inline-content-contract (S2-STORY-002) @ ba149fe
  ← merge docs/s2-start-backlog-split     (S2-STORY-001) @ 253f31a
```

---

## 3. InlineContent / InlineMark Audit

**审计代码：** `inline-content.types.ts`、`inline-content.schema.ts`、`inline-content.normalize.ts`、`tests/core/article/inline-content.test.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | InlineContent 为语义富文本协议（`InlineTextNode[]`） | **PASS** |
| 2 | InlineMark 为受控 union（bold / italic / highlight / color / link） | **PASS** |
| 3 | 拒绝 HTML / CSS / style / className 注入 | **PASS** — text 与 plainTextSchema refine |
| 4 | link href 校验 http(s) | **PASS** — `hrefSchema` + 单测 |
| 5 | color 使用 semantic token 名，非 CSS hex | **PASS** — `SEMANTIC_COLOR_PATTERN` |
| 6 | normalize / parse / validate 能力 | **PASS** — `normalizeInlineContent`、`parseInlineContent`、`parseInlineMark` |
| 7 | 无 Renderer / Copy / Style 依赖 | **PASS** |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | — | Sprint 3/4 补 InlineMark → HTML 映射表（文档已规划） |

---

## 4. Block Schema Audit

**审计代码：** `block.types.ts`、`block.schema.ts`、`block.parse.ts`、`tests/core/blocks/block-schema.test.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | 11 种 block 全部实现 | **PASS** — `BLOCK_TYPES` 与 `blockSchema` discriminated union |
| 2 | discriminated union | **PASS** — `z.discriminatedUnion("type", [...])` |
| 3 | paragraph / lead 使用 `content.text` | **PASS** — DECISION-034 |
| 4 | paragraph / lead 支持 `string \| InlineContent` | **PASS** — `inlineTextInputSchema` |
| 5 | 未重新引入 paragraph/lead `content.body` | **PASS** — 单测拒绝 body |
| 6 | `info_card.content.body` 独立语义 | **PASS** |
| 7 | 拒绝未知 block type | **PASS** |
| 8 | 拒绝 HTML / CSS / style / className | **PASS** — strict + plainTextSchema |
| 9 | 未引入 variant / theme / renderer output | **PASS** |

**11 种 block 覆盖清单：**

| block type | TS 类型 | Zod schema | fixture（fullBlocks） | 单测 |
|------------|---------|------------|----------------------|------|
| title | ✅ | ✅ | ✅ | ✅ |
| lead | ✅ | ✅ | ✅ | ✅ |
| heading | ✅ | ✅ | ✅ | ✅ |
| paragraph | ✅ | ✅ | ✅ | ✅ |
| divider | ✅ | ✅ | ✅ | ✅ |
| list | ✅ | ✅ | ✅ | ✅ |
| quote | ✅ | ✅ | ✅ | ✅ |
| highlight | ✅ | ✅ | ✅ | ✅ |
| info_card | ✅ | ✅ | ✅ | ✅ |
| cta | ✅ | ✅ | ✅ | ✅ |
| image_placeholder | ✅ | ✅ | ✅ | ✅ |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | P2 | list item 仍为 plain string（见 §10 P2-S2-001） |

---

## 5. Article Schema Audit

**审计代码：** `article.types.ts`、`article.schema.ts`、`tests/core/article/article-schema.test.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | Article 为唯一主模型 | **PASS** |
| 2 | 无 streamArticle / previewArticle / copyArticle | **PASS** — strict + 单测拒绝 |
| 3 | 复用 `blockSchema` | **PASS** — 直接 import `block.schema` |
| 4 | 含 version / metadata / input / styleAssignment / blocks / generation? | **PASS** — 与 article-schema.md 一致 |
| 5 | styleAssignment 为引用型数据结构 | **PASS** — themeId / presetId / blockOverrides |
| 6 | 未实现 StyleResolver / VariantDefinition / registry | **PASS** |
| 7 | 拒绝 HTML / CSS / style / className 注入 | **PASS** — `.strict()` + identifierSchema |
| 8 | 可被 Generation / Renderer / Copy 共同引用 | **PASS** — 单一 Article 导出 `@/core/article` |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | — | 无 |

---

## 6. Schema Helpers Audit

**审计代码：** `article.parse.ts`、`article.normalize.ts`、`block.parse.ts`、`validation-result.ts`、`zod-error.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | parseArticle / validateArticle / normalizeArticle | **PASS** |
| 2 | parseBlock / validateBlock | **PASS** — schema helper 层，无业务逻辑 |
| 3 | SchemaValidationResult 不暴露 ZodError 为主返回 | **PASS** |
| 4 | formatZodIssues 保留 path / message / code | **PASS** |
| 5 | normalizeArticle 仅 schema 层归一 | **PASS** — paragraph / lead text string → InlineContent |
| 6 | normalizeArticle 不自动生成内容 / 样式 / blocks | **PASS** — 单测覆盖 |
| 7 | 无 Renderer / Copy / Style / Generation helper | **PASS** |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | — | 无 |

---

## 7. Fixtures / Tests Audit

**审计代码：** `tests/fixtures/articles/*`、`article-fixtures.test.ts`、`schema-fixtures.test.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | minimal / full-blocks / inline-marks / normalizable fixtures | **PASS** |
| 2 | fullBlocksArticleFixture 覆盖 11 block | **PASS** |
| 3 | inlineMarksArticleFixture 覆盖 plain + 5 mark 类型 | **PASS** |
| 4 | normalizableArticleFixture string → InlineContent | **PASS** |
| 5 | invalid cases 覆盖 unknown block、body、注入、href、parallel model | **PASS** |
| 6 | fixtures 无 renderer / copy HTML / CSS / style object | **PASS** |
| 7 | 未实现 Sprint 6 Fixture Triple | **PASS** — 仅 TS schema fixtures |
| 8 | 测试总数明确 | **PASS** — 126 tests / 7 files（audit 日 `corepack pnpm test`） |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | P1 / P2 | 见 §10 — 部分旧单测未复用 fixtures |

---

## 8. Scope Boundary Audit

**检查范围：** `src/core/`、`tests/`、`app/`（抽样）

| # | 允许范围 | 结论 |
|---|----------|------|
| 1 | Article / Block TS + Zod | **PASS** |
| 2 | InlineContent / InlineMark | **PASS** |
| 3 | schema helpers | **PASS** |
| 4 | schema fixtures + unit tests | **PASS** |

| # | 禁止范围 | 结论 |
|---|----------|------|
| 1 | Renderer / Preview Renderer / Copy Renderer 实现 | **PASS** — 仅 `src/core/renderer/README.md` |
| 2 | Style System / StyleDefinition / StyleResolver | **PASS** — 仅 `src/core/styles/README.md` |
| 3 | Generation / Streaming / SSE | **PASS** — 仅 README + Article.generation 元数据字段 |
| 4 | Copy HTML snapshot / Paste checklist / PasteTestRecord | **PASS** — 未实现 |
| 5 | UI 页面 / API route / 数据库 | **PASS** — app 仍为占位 |

| 结论 | 风险等级 | 建议动作 |
|------|----------|----------|
| **PASS** | — | 无越界实现 |

---

## 9. Test Result

| 命令 | 结果 | 说明 |
|------|------|------|
| `corepack pnpm lint` | **PASS** | audit 日执行 |
| `corepack pnpm test` | **PASS** | 126/126，7 test files |
| `corepack pnpm build` | **PASS** | Next.js build + TS |

**测试文件分布：**

| 文件 | 约计 cases | 覆盖 |
|------|-----------|------|
| `inline-content.test.ts` | 22 | InlineContent / InlineMark |
| `block-schema.test.ts` | 26 | 11 block + 非法 |
| `article-schema.test.ts` | 23 | Article 顶层 |
| `article-helpers.test.ts` | 23 | parse / validate / normalize |
| `validation-result.test.ts` | 3 | SchemaValidationResult |
| `article-fixtures.test.ts` | 14 | 4 fixtures |
| `schema-fixtures.test.ts` | 15 | fixture 集成 + invalid |

---

## 10. P0 / P1 / P2 Findings

### P0（阻塞关闭）

**无。**

### P1

| ID | 描述 | 建议归属 |
|----|------|----------|
| **P1-S2-001** | `article-schema.test.ts`、`article-helpers.test.ts`、`block-schema.test.ts` 仍维护本地 `minimalArticle()` / `allElevenBlocks()` 构建器，与 `tests/fixtures/articles/` 部分重复，存在 fixture 漂移风险 | Sprint 3-A 启动前 **chore**：统一测试引用共享 fixtures（非阻塞 Sprint 2 关闭） |

### P2

| ID | 描述 | 建议归属 |
|----|------|----------|
| **P2-S2-001** | quote / highlight / cta / list item 仍为 plain string，未升级 InlineContent（与 S1 audit P2-001 一致） | Release 2 / Product Backlog |
| **P2-S2-002** | fixtures 为 TypeScript 对象，无独立 JSON 文件与 loader | Sprint 6-A（若需 Fixture Triple）或按需 chore |
| **P2-S2-003** | `normalizeArticle` 仅归一 paragraph / lead；list item string 不在 normalize 范围 | 文档已明确；若产品需要可后续 Story |

---

## 11. Close Readiness Checklist

> **说明：** 用户确认项本轮**未**标记为已完成；Sprint 2 **未**关闭。

| # | 检查项 | 状态 |
|---|--------|------|
| 1 | S2-STORY-002 Done | ✅ Done（merge `ba149fe`） |
| 2 | S2-STORY-003 Done | ✅ Done（merge `93c6526`） |
| 3 | S2-STORY-004 Done | ✅ Done（merge `d68e503`） |
| 4 | S2-STORY-005 Done | ✅ Done（merge `9a7d625`） |
| 5 | S2-STORY-006 Done | ✅ Done（merge `049b427`） |
| 6 | S2-STORY-007 In Review 或 Done | 🔄 In Review（本轮 audit） |
| 7 | `corepack pnpm lint` 通过 | ✅ PASS |
| 8 | `corepack pnpm test` 通过 | ✅ PASS（126/126） |
| 9 | `corepack pnpm build` 通过 | ✅ PASS |
| 10 | Sprint 2 范围未越界 | ✅ PASS（§8） |
| 11 | P0 = 0 | ✅ 0 |
| 12 | P1/P2 已登记 | ✅ §10 |
| 13 | Sprint 3-A readiness 明确 | ✅ 见 §13 |
| 14 | **用户确认后才可关闭 Sprint 2** | ⏳ **待用户确认** |
| 15 | **用户确认后才可 merge sprint → `release/1`** | ⏳ **待用户确认** |

---

## 12. Recommendation for Sprint 2 Closure

| 项 | 建议 |
|----|------|
| **是否建议关闭 Sprint 2** | **是（有条件）** — P0=0；代码契约完整；须用户确认 Checklist #14 |
| **是否建议 merge audit 分支** | **是** — merge `docs/s2-contract-audit-close-readiness` → `sprint/s2-article-block-schema` |
| **是否建议 merge sprint → release/1** | **否（本轮不执行）** — 须 Sprint 2 关闭 + 用户确认 Checklist #15 |
| **Sprint 2 关闭后** | 从 `release/1` 或 sprint 切 Sprint 3-A 分支 |

---

## 13. Next Sprint Readiness

### Sprint 3-A：Style System Contract & Registry Infrastructure

**前置条件（Sprint 2 已满足）：**

- [x] Article / Block / InlineContent 代码契约稳定
- [x] `parseArticle` / `validateArticle` / `normalizeArticle` 可用于后续模块
- [x] 基础 fixtures 可用于 StyleResolver 输入
- [x] 无平行 Article 模型

**建议 Sprint 3-A 首批工作：**

1. Theme / Preset / VariantDefinition 基础设施
2. StyleResolver → ResolvedBlockStyle / ResolvedArticleStyle
3. WeChatCompatibilityProfile 基础校验
4. chore：P1-S2-001 fixture 引用统一（可选，不阻塞）

**不做（仍属 Sprint 3 后续）：** 33 variants 全量 registry、Preview / Copy Renderer

---

## 14. Appendix

### A. Story 完成对照

| Story | 分支 | Merge commit | 状态 |
|-------|------|--------------|------|
| S2-STORY-001 | `docs/s2-start-backlog-split` | `253f31a` | Done |
| S2-STORY-002 | `feature/s2-inline-content-contract` | `ba149fe` | Done |
| S2-STORY-003 | `feature/s2-block-schema-contract` | `93c6526` | Done |
| S2-STORY-004 | `feature/s2-article-schema-contract` | `d68e503` | Done |
| S2-STORY-005 | `feature/s2-schema-helpers` | `9a7d625` | Done |
| S2-STORY-006 | `feature/s2-schema-fixtures` | `049b427` | Done |
| S2-STORY-007 | `docs/s2-contract-audit-close-readiness` | （本轮） | In Review |

### B. 核心导出入口

```text
@/core/article   — Article, articleSchema, parseArticle, validateArticle, normalizeArticle, InlineContent
@/core/blocks    — Block, blockSchema, parseBlock, validateBlock
@/core/schema    — SchemaValidationResult, formatZodIssues
tests/fixtures/articles — minimalArticleFixture, fullBlocksArticleFixture, ...
```

### C. 对照 DECISION-034 / DECISION-053

- **DECISION-034**（paragraph / lead `content.text`）：代码与文档 **一致**
- **DECISION-053**（Sprint 2 范围与分支）：实现 **未越界**
