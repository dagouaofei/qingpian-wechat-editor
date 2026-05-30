# Release 1 范围

> 轻篇公众号排版 · qingpian-wechat-editor

## Release 名称

**公众号文章生成、样式排版、流式预览与复制一致性闭环**

## 主链路

```
主题 / 资料 / 草稿输入
  → 生成结构化公众号文章
  → 自动套用正式样式系统
  → 流式预览 / 打字机式展示
  → 一键复制微信兼容 HTML
  → 粘贴到微信公众号编辑器后基础样式一致
```

## Release 1 必须包含

| 能力 | 说明 |
|------|------|
| 多输入方式 | 主题、资料、草稿 |
| 统一 Article Schema | 所有输入和生成结果归一 |
| 核心 Block | title、lead、heading、paragraph、list、quote、highlight、info_card、cta、divider、image_placeholder |
| 样式系统基础架构 | theme、preset、variant、registry、assignment、slot、density 等方向 |
| Preview Renderer | 页面预览，与 Copy 共享样式定义 |
| Copy Renderer | 微信兼容 HTML 输出 |
| 公众号复制一致性 | P0 质量标准 |
| 基础流式 / 打字机式展示 | SSE + block 增量 + Article 归一 |
| image_placeholder | 配图位置语义 |
| fixture 和人工粘贴测试体系 | 质量保障 |

## Release 1 不包含

- 完整样式市场
- 样式后台
- 135 / 秀米完整导入
- AI 生图
- 图库搜索
- 图片上传
- 文件上传
- 链接读取
- 联网搜索
- 自动发布
- 团队协作
- CMS

## Epic 映射

详见 [Product Backlog](../agile/product-backlog.md) 中 EPIC-001 ~ EPIC-010。

## 相关文档

- [架构总览](../architecture/architecture-overview.md)
- [样式系统](../architecture/style-system.md)
- [公众号复制样式规则](../architecture/wechat-copy-style-rules.md)
