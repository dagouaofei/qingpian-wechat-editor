# 架构总览

> 轻篇公众号排版 · qingpian-wechat-editor
>
> 状态：正式技术方案 · Sprint 1-B 定稿

## 正式主链路

```
主题 / 资料 / 草稿输入
  → 输入标准化（InputNormalizer）
  → 生成 / 结构化（GenerationEngine）
  → Article Schema（唯一文章主模型）
  → Style Assignment → Style Definition（样式系统）
  → Preview Renderer（页面预览）
  → Copy Renderer（微信兼容 HTML）
  → 微信公众号粘贴（P0 验收）
```

## 核心原则

1. **唯一主链路** — 不允许多套主链路
2. **唯一 Article Schema** — 所有输入、生成、fixture、流式终态归一
3. **内容与样式分离** — Block 是语义，Style System 是视觉
4. **Preview / Copy 共享样式** — 同一 Style Definition，不同输出适配
5. **复制一致性 P0** — 不是后期补 Bug
6. **无临时 mock** — 不允许 mock 主链路
7. **经验先文档化** — 旧项目经验参考，不复制代码

## 模块职责

| 模块 | 路径 | 职责 | 方案文档 |
|------|------|------|----------|
| Article | `src/core/article` | 唯一文章主模型 | [article-schema.md](article-schema.md) |
| Blocks | `src/core/blocks` | Block 语义定义 | [block-schema.md](block-schema.md) |
| Styles | `src/core/styles` | 样式系统 | [style-system.md](style-system.md) |
| Renderer | `src/core/renderer` | Preview Renderer | [rendering-pipeline.md](rendering-pipeline.md) |
| Copy | `src/core/copy` | Copy-to-WeChat | [copy-to-wechat-pipeline.md](copy-to-wechat-pipeline.md) |
| Generation | `src/core/generation` | 多输入、生成、流式 | [generation-pipeline.md](generation-pipeline.md) |

## 数据流总览

```
┌──────────┐     ┌────────────┐     ┌─────────┐
│  Input   │────→│ Generation │────→│ Article │
│ topic/   │     │  Engine    │     │ Schema  │
│ material/│     └────────────┘     └────┬────┘
│ draft/   │                             │
│ fixture  │                             │
└──────────┘                             │
                                         ▼
                              ┌──────────────────┐
                              │  Style System     │
                              │  resolveStyle()   │
                              └────────┬─────────┘
                                       │
                          ┌────────────┴────────────┐
                          ▼                         ▼
                   Preview Renderer          Copy Renderer
                   (React DOM)               (inline HTML)
                          │                         │
                          ▼                         ▼
                     页面预览                  微信公众号粘贴
```

## Release 1 核心范围（架构视角）

| 能力 | 架构组件 | 状态 |
|------|----------|------|
| 多输入 | Generation + InputSource | 方案定稿 |
| Article / Block Schema | article + blocks | 方案定稿 |
| 样式系统 | styles (theme/preset/variant/registry) | 方案定稿 |
| Preview 渲染 | renderer | 方案定稿 |
| Copy 渲染 | copy | 方案定稿 |
| 复制一致性 P0 | copy + style-system | 方案定稿 |
| 流式生成 | generation (SSE + block + done.article) | 方案定稿 |
| image_placeholder | block type | 方案定稿 |

**下一步（Sprint 2+）：** 按方案实现代码，业务功能实现必须在核心技术方案完成之后进入。

## 禁止项

- 多套 Article Schema
- mockArticle / aiArticle / streamArticle / wechatArticle 平行结构
- 预览一套样式、复制一套样式
- 旁路兼容逻辑
- 从旧项目整包复制代码
- Visual Layer / Space Style 等废弃方案

## 方案文档索引

| 文档 | 内容 |
|------|------|
| [article-schema.md](article-schema.md) | Article 字段、metadata、input、fixture |
| [block-schema.md](block-schema.md) | 11 种 Block 语义与字段 |
| [style-system.md](style-system.md) | theme/preset/variant/registry/slot/density |
| [rendering-pipeline.md](rendering-pipeline.md) | Preview / Copy Renderer 分离与共享 |
| [copy-to-wechat-pipeline.md](copy-to-wechat-pipeline.md) | Copy 链路、粘贴测试 |
| [wechat-copy-style-rules.md](wechat-copy-style-rules.md) | 复制一致性 P0 规则 |
| [generation-pipeline.md](generation-pipeline.md) | 多输入、SSE、Article 归一 |
| [prototype-lessons.md](prototype-lessons.md) | 旧项目经验 |
