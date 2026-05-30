# Article Schema

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## 核心约束

- **Article 是唯一文章主模型**
- 所有输入和生成结果最终进入 Article
- **不允许多套 Article Schema**

## Article 不承载 CSS

- Article 定义内容结构和 Block 列表
- 具体视觉样式由 Style Assignment / Style Definition 处理
- Article 不直接承载具体 CSS

## 输入归一

以下所有来源最终都必须进入同一 Article Schema：

| 来源 | 说明 |
|------|------|
| 主题输入 | 用户输入主题生成 |
| 资料输入 | 用户粘贴资料生成 |
| 草稿输入 | 用户粘贴草稿优化 |
| fixture | 测试固定数据 |
| AI batch generate | 批量生成 |
| AI stream generate | 流式生成，最终 `done.article` 归一 |

## 禁止项

- `mockArticle`、`aiArticle`、`streamArticle`、`wechatArticle` 等平行结构
- stream 中间态作为独立文章结构持久化

## 后续实现

- 使用 Zod 定义 Article Schema
- 代码位置：`src/core/article/`
- 详见 Sprint 2 候选方向 A

## 相关文档

- [Block Schema](block-schema.md)
- [生成链路](generation-pipeline.md)
