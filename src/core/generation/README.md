# Generation 模块

> 状态：Sprint 5 进行中 · InputRequest / NormalizedInput 契约已实现（S5-STORY-002）

## 职责

承载多输入、生成链路、流式展示相关逻辑。

## 已实现（S5-STORY-002）

| 路径 | 说明 |
|------|------|
| `input.ts` | InputRequest / NormalizedInput 类型与 limits |
| `schemas.ts` | Zod schema（`.strict()`） |
| `input.parse.ts` | `parseInputRequest` / `validateInputRequest` / `isInputRequest` |
| `input.normalize.ts` | `normalizeInputRequest` / `parseAndNormalizeInputRequest` |

## 约束

- 支持主题、资料、草稿三类输入（`InputRequest.mode`）
- 生成结果必须进入统一 Article Schema
- 应用层：SSE + block 增量 + `done.article` 归一（S5-STORY-003+）
- 不允许 `streamArticle` / `mockArticle` 成为独立文章结构

## 参考文档

- `docs/architecture/generation-pipeline.md`
