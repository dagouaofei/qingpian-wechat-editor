# Generation 模块

> 状态：Sprint 5 进行中 · S5-STORY-002 / S5-STORY-003 Done

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

## 约束

- 支持主题、资料、草稿三类输入（`InputRequest` → `NormalizedInput`）
- 流式事件：`block.start` / `block.delta` / `block.complete` / `done.article` / `error` / `heartbeat`
- 生成结果必须进入统一 Article Schema（`done.article` 归一由 S5-STORY-004 负责）
- 不允许 `streamArticle` / `mockArticle` 成为独立文章结构

## 参考文档

- `docs/architecture/generation-pipeline.md`
