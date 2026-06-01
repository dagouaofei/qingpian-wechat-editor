# Copy 模块

> 状态：Sprint 4-A · S4A-STORY-002 基础契约 + S4A-STORY-003 titleBlock + S4A-STORY-004 lead / paragraph + S4A-STORY-005 divider + S4A-STORY-006 copy output seed

## 职责

承载 **Copy-to-WeChat Pipeline** 基础契约；Copy 路径复用 `@/core/renderer` 共享输入与 registry。

## 入口

- `src/core/copy/wechat-profile-bridge.ts` — 文档字段 ↔ 代码 WeChatCompatibilityProfile 映射
- `src/core/copy/title-block-copy.ts` — title / heading Copy inline HTML
- `src/core/copy/text-block-copy.ts` — lead / paragraph Copy inline HTML
- `src/core/copy/divider-copy.ts` — divider Copy inline HTML
- `src/core/copy/inline-content-html.ts` — InlineContent marks Copy 映射
- `src/core/copy/copy-html-snapshot.ts` — text-first Copy HTML snapshot seed builder
- `src/core/copy/clipboard-payload.ts` — `text/html` + `text/plain` payload builder（不调用 Clipboard API）
- `src/core/copy/plain-text.ts` — text/plain fallback builder
- `src/core/copy/paste-qa-seed.ts` — Sprint 4-A 最小 Paste QA seed
- `src/core/copy/index.ts` — Copy 路径 re-export

## 约束

- 复制到微信公众号编辑器是一级核心能力
- 与 Preview Renderer 共享 ResolvedArticleStyle / ResolvedBlockStyle
- 已实现 title / heading / lead / paragraph / divider Copy inline HTML
- 已建立 Copy HTML snapshot / Clipboard payload / Paste QA seed；未实现真实 Clipboard API / 真实 Paste QA / structured blocks

## 参考文档

- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/wechat-copy-style-rules.md`
