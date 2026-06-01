# Generation 模块

> 状态：Sprint 5 进行中 · S5-STORY-002 ~ S5-STORY-005B Done · S5-STORY-006~008 Planned

## 职责

承载多输入、生成链路、流式展示相关逻辑。

## 已实现

### S5-STORY-002 — InputRequest / NormalizedInput

| 路径 | 说明 |
|------|------|
| `input.ts` / `schemas.ts` / `input.parse.ts` / `input.normalize.ts` | 输入契约 |

### S5-STORY-003 — GenerationEvent / SSE Runtime

| 路径 | 说明 |
|------|------|
| `events.ts` | GenerationEvent 类型与 stream 抽象 |
| `event-schemas.ts` | Zod schema + parse |
| `sse.ts` | SSE encode / decode |
| `stream.ts` | stream runtime + sequence validation |
| `test-provider.ts` | deterministic provider（dev fallback / 测试） |

### S5-STORY-004 — done.article 归一与 Article Schema 校验

| 路径 | 说明 |
|------|------|
| `done-article.ts` | `done.article` 事件序列校验与提取 |
| `article-finalize.ts` | `finalizeGenerationEvents` → 正式 `Article` |

### S5-STORY-005 — Volcengine / Doubao Model Provider

| 路径 | 说明 |
|------|------|
| `model-provider.ts` | Provider / transport 契约 |
| `model-provider-config.ts` | 环境变量 config loader |
| `model-provider-errors.ts` | 稳定 error code 与 HTTP / network 映射 |
| `model-prompt.ts` | Article JSON prompt builder |
| `volcengine-transport.ts` | Ark chat completions transport（可 mock） |
| `volcengine-provider.ts` | 真实 model provider → GenerationEvent stream |

**Model Article Enrichment（S5-STORY-005B）：**

| 路径 | 说明 |
|------|------|
| `model-article-candidate.ts` | enrichment 输入 / 输出类型 |
| `model-article-enrichment.ts` | deterministic UUID / metadata / block content repair |

Provider 解析模型 JSON 后调用 `enrichModelArticleCandidate`，再输出 enriched `done.article`；禁止绕过 `finalizeGenerationEvents`。

**统一终态入口：** Provider 输出 `GenerationEvent` stream → `finalizeGenerationEvents(events)` → 正式 `Article`。

**环境变量：** 见仓库根目录 `.env.example`（`VOLCENGINE_*`）。

### S5-STORY-005A — Dev-only Real API Smoke

| 路径 | 说明 |
|------|------|
| `scripts/smoke/volcengine-provider-smoke.ts` | dev-only CLI |
| `volcengine-provider-smoke.ts` | smoke runner |
| `smoke-env.ts` | `.env.local` loader |

```bash
corepack pnpm smoke:volcengine-provider
```

详见 `docs/agile/smoke/s5-volcengine-provider-smoke.md`。不接入 `pnpm test` / CI。

**旧项目经验：** 当前仓库仅保留 SSE + `done.article` 归一经验（见 `docs/agile/migration-reference.md`）；旧一键成稿 Volcengine / `mapArkJsonToArticle` 源码不可访问，本轮按轻篇 Article Schema 实现 provider 契约，不复用旧 parallel 模型。

## 约束

- 支持主题、资料、草稿三类输入（`InputRequest` → `NormalizedInput`）
- 流式事件：`block.start` / `block.delta` / `block.complete` / `done.article` / `error` / `heartbeat`
- 生成结果必须进入统一 Article Schema（`parseArticle` / `normalizeArticle` / `validateArticle`）
- 不允许 `streamArticle` / `mockArticle` 成为独立文章结构
- deterministic provider 仅 dev fallback / test provider；真实 API 验收须启用 Volcengine provider
- 不得硬编码 API key；不得让缺少 key 导致 test / build 失败

## 参考文档

- `docs/architecture/generation-pipeline.md`
