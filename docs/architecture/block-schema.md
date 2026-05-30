# Block Schema

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## 核心原则

**Block 是内容语义，不等于视觉样式。**

- Block 描述「这是什么内容」（标题、段落、列表等）
- 样式描述「这内容长什么样」（颜色、间距、边框等）
- Block 不应绑定具体样式

## Release 1 核心 Block 范围

| Block 类型 | 说明 |
|------------|------|
| title | 文章标题 |
| lead | 导语 / 摘要 |
| heading | 小标题 |
| paragraph | 正文段落 |
| list | 列表 |
| quote | 引用 |
| highlight | 重点内容 |
| info_card | 信息卡片 |
| cta | 行动号召 |
| divider | 分隔线 |
| image_placeholder | 配图位置占位 |

## 样式处理

- 后续样式由 **Style Assignment / Style Definition** 处理
- 同一 Block 类型可以有不同的 style variant
- Block 本身只携带内容数据和语义类型

## 后续实现

- 使用 Zod 定义 Block Schema
- 代码位置：`src/core/blocks/`
- 详见 Sprint 2 候选方向 A

## 相关文档

- [Article Schema](article-schema.md)
- [样式系统](style-system.md)
