# Renderer 模块

> 状态：Sprint 4-A · S4A-STORY-002 基础契约 + S4A-STORY-003 titleBlock Preview / Copy

## 职责

承载 **Preview Renderer** 基础契约，用于页面预览路径。

## 入口

- `src/core/renderer/types.ts` — RenderMode / RenderTarget / RendererResult / RendererIssue
- `src/core/renderer/context.ts` — Article + ResolvedArticleStyle 输入校验与 BlockRenderContext
- `src/core/renderer/resolved-view.ts` — componentProtocol / slot fallback 视图
- `src/core/renderer/registry.ts` — block renderer registry
- `src/core/renderer/title-block-renderer.ts` — title / heading titleBlock Preview + Copy
- `src/core/renderer/title-block-registry.ts` — `createTitleBlockRendererRegistry()`

## 约束

- 与 Copy Renderer 共享同一套 ResolvedStyle 输入
- 不允许 previewArticle / mockArticle / streamArticle 等平行模型
- 本轮未实现具体 block HTML / React 输出

## 参考文档

- `docs/architecture/rendering-pipeline.md`
