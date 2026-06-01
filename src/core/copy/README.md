# Copy 模块

> 状态：Sprint 4-A · S4A-STORY-002 基础契约已实现

## 职责

承载 **Copy-to-WeChat Pipeline** 基础契约；Copy 路径复用 `@/core/renderer` 共享输入与 registry。

## 入口

- `src/core/copy/wechat-profile-bridge.ts` — 文档字段 ↔ 代码 WeChatCompatibilityProfile 映射
- `src/core/copy/index.ts` — Copy 路径 re-export

## 约束

- 复制到微信公众号编辑器是一级核心能力
- 与 Preview Renderer 共享 ResolvedArticleStyle / ResolvedBlockStyle
- 本轮未生成真实微信 HTML / Clipboard 输出

## 参考文档

- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/wechat-copy-style-rules.md`
