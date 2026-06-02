# Renderer 模块

> 状态：Sprint 4-A · S4A-STORY-002 基础契约 + S4A-STORY-003 titleBlock + S4A-STORY-004 lead / paragraph + S4A-STORY-005 divider

## 职责

承载 **Preview Renderer** 基础契约，用于页面预览路径。

## 入口

- `src/core/renderer/types.ts` — RenderMode / RenderTarget / RendererResult / RendererIssue
- `src/core/renderer/context.ts` — Article + ResolvedArticleStyle 输入校验与 BlockRenderContext
- `src/core/renderer/resolved-view.ts` — componentProtocol / slot fallback 视图
- `src/core/renderer/registry.ts` — block renderer registry
- `src/core/renderer/title-block-renderer.ts` — title / heading titleBlock Preview + Copy
- `src/core/renderer/title-block-registry.ts` — `createTitleBlockRendererRegistry()`
- `src/core/renderer/text-block-renderer.ts` — lead / paragraph InlineContent Preview + Copy
- `src/core/renderer/text-block-registry.ts` — `createTextBlockRendererRegistry()`
- `src/core/renderer/divider-renderer.ts` — divider Preview + Copy
- `src/core/renderer/divider-registry.ts` — `createDividerRendererRegistry()`

## 约束

- 与 Copy Renderer 共享同一套 ResolvedStyle 输入
- Preview UI 适配层：`preview-visual-styles.ts` 将 layout / layoutMode 映射为页面样式（与 Copy 默认 token 对齐）
- 不允许 previewArticle / mockArticle / streamArticle 等平行模型
- 已实现 title / heading / lead / paragraph / divider text-first Preview；未实现 structured blocks

## 参考文档

- `docs/architecture/rendering-pipeline.md`
