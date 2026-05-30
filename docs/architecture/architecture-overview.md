# 架构总览

> 轻篇公众号排版 · qingpian-wechat-editor

## 正式主链路

```
主题 / 资料 / 草稿输入
  → 输入标准化
  → 生成 / 结构化
  → Article Schema
  → Style Assignment
  → Preview Renderer
  → Copy Renderer
  → 微信公众号粘贴
```

## 核心原则

1. **唯一主链路** — 不允许多套主链路
2. **无临时 mock** — 不允许临时 mock 主链路
3. **无废弃链路** — 不允许旧项目废弃链路进入正式项目
4. **经验先文档化** — 可以参考旧一键成稿项目的经验，但必须先文档化，再进入新项目方案

## 模块职责

| 模块 | 路径 | 职责 |
|------|------|------|
| Article | `src/core/article` | 唯一文章主模型 |
| Blocks | `src/core/blocks` | Block 语义定义 |
| Styles | `src/core/styles` | 样式系统（preset、variant、registry 等） |
| Renderer | `src/core/renderer` | Preview Renderer |
| Copy | `src/core/copy` | Copy-to-WeChat Pipeline |
| Generation | `src/core/generation` | 多输入、生成链路、流式展示 |

## 禁止项

- 多套 Article Schema
- mockArticle / aiArticle / streamArticle / wechatArticle 平行结构
- 预览一套样式、复制一套样式
- 旁路兼容逻辑
- 从旧项目整包复制代码

## 相关文档

- [Article Schema](article-schema.md)
- [Block Schema](block-schema.md)
- [样式系统](style-system.md)
- [渲染链路](rendering-pipeline.md)
- [复制链路](copy-to-wechat-pipeline.md)
- [生成链路](generation-pipeline.md)
