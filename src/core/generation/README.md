# Generation 模块

> 状态：占位 · Sprint 1 未实现业务代码

## 职责

承载多输入、生成链路、流式展示相关逻辑。

## 约束

- 支持主题、资料、草稿三类输入
- 生成结果必须进入统一 Article Schema
- 应用层：SSE + block 增量 + `done.article` 归一
- 不允许 streamArticle 成为独立文章结构

## 参考文档

- `docs/architecture/generation-pipeline.md`
