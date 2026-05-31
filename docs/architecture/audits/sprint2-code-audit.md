# Sprint 2 Code Audit

> 审计日期：2026-05-31  
> 审计分支：`docs/s2-code-audit`（基于 `sprint/s2-article-block-schema` @ `5eda6cd`）  
> 审计对象：Sprint 2 实际源码与测试（人工级代码审计）  
> 方法：逐文件阅读 + 全项目 grep + lint/test/build 验证；**不修改**业务代码  
> 关联任务：**S2-CODE-AUDIT-001**（补充 `sprint2-contract-audit.md` 的代码层审计）

---

## 1. Audit Summary

| 项 | 结论 |
|----|------|
| **Sprint** | Sprint 2 — Article / Block Schema + InlineContent 代码契约 |
| **Branch** | `sprint/s2-article-block-schema` @ `5eda6cd` |
| **Audit branch** | `docs/s2-code-audit` |
| **Audit date** | 2026-05-31 |
| **Code scope** | `src/core/article/`、`src/core/blocks/`、`src/core/schema/` + 对应 tests/fixtures |
| **Overall grade** | **A** |
| **P0** | **0** |
| **P1** | **3** |
| **P2** | **5** |
| **Recommendation** | **有条件建议关闭 Sprint 2** — 无 P0；代码实现与 Sprint 2 文档/范围一致；P1 均指向 Sprint 3~5 前置收口，不阻塞 Sprint 2 代码交付 |

**与 contract audit 关系：** contract audit（grade A，P0=0，P1=1，P2=3）基于文档与 merge 事实；本 audit 基于**实际源码**复核，结论一致且 P1 略增 2 项（streaming validation、color token registry）。

---

## 2. Audit Sources

### 2.1 架构与敏捷文档

- `docs/architecture/architecture-overview.md`
- `docs/architecture/article-schema.md`
- `docs/architecture/block-schema.md`
- `docs/architecture/generation-pipeline.md`
- `docs/architecture/rendering-pipeline.md`
- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/style-system.md`
- `docs/architecture/audits/sprint2-contract-audit.md`
- `docs/agile/sprint-plan.md`、`sprint-backlog.md`、`decisions.md`、`changelog.md`

### 2.2 源码（15 TS 文件）

```text
src/core/article/
  article.types.ts, article.schema.ts, article.parse.ts, article.normalize.ts
  inline-content.types.ts, inline-content.schema.ts, inline-content.normalize.ts
  index.ts

src/core/blocks/
  block.types.ts, block.schema.ts, block.parse.ts, index.ts

src/core/schema/
  validation-result.ts, zod-error.ts, index.ts
```

### 2.3 测试与 fixtures

- 7 test files，126 cases
- `tests/fixtures/articles/` — 4 Article fixtures + shared + index

---

## 3. InlineContent / InlineMark Code Audit

**审计文件：** `inline-content.types.ts`、`inline-content.schema.ts`、`inline-content.normalize.ts`、`inline-content.test.ts`

| # | 检查项 | 代码证据 | 结论 |
|---|--------|----------|------|
| 1 | InlineContent = `InlineTextNode[]` | `inline-content.types.ts:52` | **PASS** |
| 2 | InlineMark 受控 union | `z.discriminatedUnion("type", [...])` | **PASS** |
| 3 | 仅 bold/italic/highlight/color/link | `inlineMarkTypeSchema` enum | **PASS** |
| 4 | color 为 semantic token 名 | `SEMANTIC_COLOR_PATTERN` + refine | **PASS** — `#hex` 会被拒绝 |
| 5 | link 仅 http(s) | `hrefSchema` + URL 协议检查 | **PASS** |
| 6 | `.strict()` 拒绝未知字段 | 各 mark schema + text node `.strict()` | **PASS** |
| 7 | 拒绝 className/style/html/css | text refine + mark strict + 单测 | **PASS** |
| 8 | normalizeInlineContent 只做结构归一 | merge adjacent、sort marks | **PASS** |
| 9 | normalize 不生成 HTML/CSS | 无 HTML 输出路径 | **PASS** |
| 10 | legacyEmphasisToMarks 为迁移 helper | 独立函数，schema 不接受 emphasis | **PASS** |

**代码片段（color token 约束）：**

```28:34:src/core/article/inline-content.schema.ts
const semanticColorSchema = z
  .string()
  .min(1)
  .refine(
    (value) => SEMANTIC_COLOR_PATTERN.test(value),
    "color must be a semantic token name, not CSS",
  );
```

| 结论 | 风险 |
|------|------|
| **PASS** | P1：token 名未与 Style System registry 交叉校验（见 P1-CODE-002） |

---

## 4. Block Schema Code Audit

**审计文件：** `block.types.ts`、`block.schema.ts`、`block-schema.test.ts`

### 4.1 11 种 block 实现清单

| block | TS 类型 | Zod schema | discriminated union |
|-------|---------|------------|---------------------|
| title | ✅ | `titleBlockSchema` | ✅ |
| lead | ✅ | `leadBlockSchema` | ✅ |
| heading | ✅ | `headingBlockSchema` | ✅ |
| paragraph | ✅ | `paragraphBlockSchema` | ✅ |
| divider | ✅ | `dividerBlockSchema` | ✅ |
| list | ✅ | `listBlockSchema` | ✅ |
| quote | ✅ | `quoteBlockSchema` | ✅ |
| highlight | ✅ | `highlightBlockSchema` | ✅ |
| info_card | ✅ | `infoCardBlockSchema` | ✅ |
| cta | ✅ | `ctaBlockSchema` | ✅ |
| image_placeholder | ✅ | `imagePlaceholderBlockSchema` | ✅ |

### 4.2 检查项

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | discriminated union | **PASS** — `blockSchema` @ `block.schema.ts:204` |
| 2 | 拒绝未知 block type | **PASS** — enum + union |
| 3 | paragraph/lead `content.text` | **PASS** — `inlineTextInputSchema` |
| 4 | 拒绝 paragraph/lead `content.body` | **PASS** — 单测 + strict |
| 5 | info_card.content.body 独立 | **PASS** |
| 6 | 无 variantId/themeId/resolvedStyle on block | **PASS** |
| 7 | 无 `z.any()` | **PASS** — 全项目 grep 无匹配 |
| 8 | divider `content.style` 为语义 enum | **PASS** — `"line"|"space"|"dot"`，非 CSS |

| 结论 | 风险 |
|------|------|
| **PASS** | P2：list/quote/highlight/cta 仍为 plain string（文档一致） |

---

## 5. Article Schema Code Audit

**审计文件：** `article.types.ts`、`article.schema.ts`、`article-schema.test.ts`

| # | 检查项 | 代码证据 | 结论 |
|---|--------|----------|------|
| 1 | 顶层字段完整 | `articleSchema` object keys | **PASS** |
| 2 | version literal 1 | `articleVersionSchema = z.literal(1)` | **PASS** |
| 3 | 复用 blockSchema | import from `@/core/blocks/block.schema` | **PASS** |
| 4 | blocks: Block[] | `z.array(blockSchema).min(1)` | **PASS**（见 P1 streaming 冲突） |
| 5 | styleAssignment 引用型 | themeId/presetId/blockOverrides | **PASS** |
| 6 | styleAssignment 无 CSS object | `.strict()` + 单测 | **PASS** |
| 7 | input = InputSource | `inputSourceSchema` | **PASS** |
| 8 | metadata 非正文 | plainText 字段，无 blocks | **PASS** |
| 9 | 拒绝未知字段 | `.strict()` | **PASS** |
| 10 | 拒绝 parallel model | stream/preview/copy 单测 | **PASS** |
| 11 | 无 Renderer runtime 字段 | grep 无匹配 | **PASS** |
| 12 | import 无循环依赖 | blocks → `inline-content.schema`；article → `block.schema` 直接路径 | **PASS** |

**Streaming 潜在冲突（P1）：**

```118:118:src/core/article/article.schema.ts
    blocks: z.array(blockSchema).min(1),
```

`generation-pipeline.md` §6.1 描述 `started` 阶段 `blocks = []`，§6.2 又称 stream 中 UI Article「仍是 Article Schema」。当前 `articleSchema` **强制 min(1)**，且 `article-schema.test.ts` 明确拒绝 `blocks: []`。Sprint 5 实现 Generation 前需引入 **partial / lenient validation mode** 或文档收口 streaming 中间态校验策略。

| 结论 | 风险 |
|------|------|
| **PASS**（Sprint 2 完成态 Article） | **P1** streaming partial Article（见 P1-CODE-001） |

---

## 6. Schema Helpers Code Audit

**审计文件：** `article.parse.ts`、`article.normalize.ts`、`block.parse.ts`、`validation-result.ts`、`zod-error.ts`

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | parseArticle → articleSchema.parse | **PASS** |
| 2 | validateArticle → safeParse，不 throw | **PASS** |
| 3 | normalizeArticle 仅 schema 归一 | **PASS** — 仅 paragraph/lead text |
| 4 | normalize 不改 id / block id / type | **PASS** — 单测 |
| 5 | normalize 末行 re-parse | `articleSchema.parse(normalized)` | **PASS** — 不掩盖非法结构 |
| 6 | SchemaValidationIssue 含 path/message/code | **PASS** |
| 7 | formatZodIssues 保留三字段 | **PASS** |
| 8 | parseBlock/validateBlock 在 schema 层 | **PASS** |
| 9 | 无 Renderer/Copy/Style/Generation helper | **PASS** |

| 结论 | 风险 |
|------|------|
| **PASS** | — |

---

## 7. Fixtures / Tests Code Audit

| # | 检查项 | 结论 |
|---|--------|------|
| 1 | 4 类 fixture 齐全 | **PASS** |
| 2 | fullBlocks 覆盖 11 block | **PASS** — `FULL_BLOCK_TYPES` |
| 3 | inlineMarks 覆盖 6 类 mark | **PASS** |
| 4 | normalizable string → InlineContent | **PASS** |
| 5 | fixtures 无 HTML/CSS/style/className | **PASS** — JSON.stringify 断言 + 人工审阅 |
| 6 | 无 `as any` | **PASS** — 仅 `as const` |
| 7 | 合法 parse 覆盖 | **PASS** |
| 8 | 非法 case 覆盖 | **PASS** — unknown block、body、注入、href、parallel model |
| 9 | validateArticle 非法不 throw | **PASS** |

**测试分布：** 126 tests / 7 files（inline 22 + block 26 + article-schema 23 + helpers 23 + validation 3 + fixtures 14 + schema-fixtures 15）

| 结论 | 风险 |
|------|------|
| **PASS** | P1：部分旧单测未复用 fixtures；P2：mockArticle/aiArticle 无具名拒绝用例 |

---

## 8. Scope Boundary Audit

**全项目 grep（`src/core` + tests）：**

| 禁止项 | 代码现状 |
|--------|----------|
| Renderer / Copy Renderer 实现 | 仅 `src/core/renderer/README.md`、`copy/README.md` |
| Style System 实现 | 仅 `src/core/styles/README.md` |
| Generation 实现 | 仅 `src/core/generation/README.md` |
| `z.any` / passthrough / `as any` | **未发现**（tests 中 "passthrough" 仅为测试描述文案） |
| parallel Article 类型定义 | **未发现** |
| Copy HTML / Paste QA | **未发现** |

`app/page.tsx` 含 Tailwind `className` — 属 Sprint 1 占位 UI，**不在 Sprint 2 schema 范围**，不计为越界。

| 结论 | 风险 |
|------|------|
| **PASS** | P2：placeholder README 目录可保留至 Sprint 3+ |

---

## 9. Test Result

| 命令 | 结果 |
|------|------|
| `corepack pnpm lint` | **PASS** |
| `corepack pnpm test` | **PASS** — 126/126 |
| `corepack pnpm build` | **PASS** |

---

## 10. Findings

### P0

**无。**

### P1

| ID | 描述 | 代码/文档证据 | 建议归属 |
|----|------|---------------|----------|
| **P1-CODE-001** | **Streaming partial Article 与 completed Article validation 冲突**：`articleSchema.blocks.min(1)` + 单测拒绝 `blocks: []`，与 `generation-pipeline.md` §6.1 `started` 阶段 `blocks=[]` 及 §6.2「partial 仍是 Article Schema」表述不一致 | `article.schema.ts:118`；`article-schema.test.ts` rejects empty blocks；`generation-pipeline.md:162,179` | **Sprint 5**（Generation 实现前）：引入 `validateArticlePartial` / lenient schema / 或明确 UI 层在 started 阶段不调用 strict parse |
| **P1-CODE-002** | **InlineMark color token 未与 Style System ThemeToken registry 对齐**：当前仅 regex `^[a-zA-Z][a-zA-Z0-9_-]*$`，fixture 使用 `brandPrimary` 无法验证是否为合法 theme token | `inline-content.schema.ts:semanticColorSchema`；`inline-marks-article.ts` | **Sprint 3-A**：Style System registry 建立后增加 token 交叉校验或 documented allowlist |
| **P1-CODE-003** | **测试 fixture 重复维护**：`article-schema.test.ts`、`article-helpers.test.ts` 内联 `minimalArticleBase()` / `allElevenBlocks()` 与 `tests/fixtures/articles/` 重复 | 多文件 parallel builders | **Chore / Sprint 3-A 前**：统一测试引用共享 fixtures |

### P2

| ID | 描述 | 建议归属 |
|----|------|----------|
| **P2-CODE-001** | quote / highlight / cta / list item 仍为 plain string，未支持 InlineContent | Release 2（P2-001 延续） |
| **P2-CODE-002** | `article-schema.md` 描述 JSON fixture 文件，代码为 TS fixture | Sprint 6-A 或按需 JSON export chore |
| **P2-CODE-003** | `mockArticle` / `aiArticle` 无具名拒绝单测（`.strict()` 已拒绝，覆盖可加强） | 可选 test chore |
| **P2-CODE-004** | `normalizeInlineContent("")` → `[]`，但 paragraph parse 要求 min(1) text — 边界行为仅 normalize 路径可见 | 文档注释即可 |
| **P2-CODE-005** | `src/core/{renderer,copy,styles,generation}/` 仅 README 占位 | Sprint 3+ 按 plan 填充 |

---

## 11. Closure Recommendation

| 项 | 建议 |
|----|------|
| **是否存在阻塞 Sprint 2 关闭的问题** | **否** — P0=0 |
| **是否建议关闭 Sprint 2** | **是（有条件）** — 用户确认 contract audit + 本 code audit 后可关闭 |
| **是否建议开 bugfix 分支** | **否** — 无 P0；P1 为 Sprint 3~5 前置设计项，非 Sprint 2 实现缺陷 |
| **是否建议 merge 本 audit 分支** | **是** — merge `docs/s2-code-audit` → `sprint/s2-article-block-schema` |

**关闭条件（须用户确认）：**

1. 接受 grade **A**，P0=0，P1=3，P2=5
2. P1-CODE-001 登记至 Sprint 5 前置，不阻塞 Sprint 2
3. Sprint 2 Close Readiness Checklist（`sprint2-contract-audit.md` §11）用户确认项完成

---

## 12. Suggested Follow-up Backlog

| 优先级 | 项 | 目标 Sprint |
|--------|-----|-------------|
| P1 | Partial vs completed Article validation mode | Sprint 5 |
| P1 | InlineMark color ↔ ThemeToken registry | Sprint 3-A |
| P1 | 统一测试引用 `tests/fixtures/articles/` | Chore / Sprint 3-A 前 |
| P2 | quote/highlight/cta InlineContent 升级 | Release 2 |
| P2 | JSON fixture export / loader | Sprint 6-A |

---

## 13. Appendix: Commands / Grep Results

### 13.1 自检命令

```bash
corepack pnpm lint    # PASS
corepack pnpm test    # PASS — 126/126
corepack pnpm build   # PASS
```

### 13.2 Grep 辅助搜索（2026-05-31）

```bash
# z.any / passthrough / as any
# 结果：无 z.any、无 as any；tests 中 "passthrough" 仅为测试用例描述

# streamArticle | previewArticle | copyArticle | mockArticle | aiArticle
# 结果：仅 tests 中 stream/preview/copy 作为非法输入；src 无 parallel model 定义

# className / html in src/core
# 结果：inline-content.schema.ts 含检测 pattern；无 schema 字段允许 className/html

# renderer | StyleResolver | StyleDefinition in src/core/{article,blocks,schema}
# 结果：仅 article.normalize.ts 注释提及 renderer；无实现
```

### 13.3 核心导出入口（代码事实）

```text
@/core/article  — Article, articleSchema, parseArticle, validateArticle, normalizeArticle, InlineContent
@/core/blocks   — Block, blockSchema, parseBlock, validateBlock, BLOCK_TYPES
@/core/schema   — SchemaValidationResult, formatZodIssues
```

### 13.4 与 contract audit 差异

| 项 | contract audit | code audit |
|----|----------------|------------|
| P0 | 0 | 0 |
| P1 | 1 | 3（+streaming validation、+color token registry） |
| P2 | 3 | 5（+mockArticle 测试覆盖、+normalize 空串边界） |
| Grade | A | A |
