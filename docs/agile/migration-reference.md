# 旧项目经验迁移参考

> 轻篇公众号排版 · qingpian-wechat-editor

## 原则

**参考历史经验，不复制旧代码。**

旧「一键成稿 / 秒篇成稿」项目只作为经验、原则、测试方法和规则的来源，不作为代码来源。

## 可继承经验

### 敏捷管理经验

- Sprint、Story、Bug、AC、Decision、Changelog 文档体系
- 固定 fixture 与人工粘贴测试记录
- 测试清单驱动的复制一致性验证

### 样式系统探索经验

- Component DSL 方向
- slot、density、variant、style registry 等概念
- theme、preset、assignment 分层思路
- 样式不能写死为页面 CSS，需可复用、可扩展

### 公众号复制一致性经验

- 网页预览与微信公众号粘贴不一致必须前置解决
- 135 编辑器与微信公众号编辑器表现可能不同，以微信公众号粘贴为准
- 标题样式丢失、字体字号变化、卡片样式变化是常见踩坑点
- 每个样式 variant 都应进入粘贴测试范围

### SSE / 流式生成经验

- 底层模型侧可能是 token/chunk streaming
- 应用层应沉淀为：SSE + JSONL/block 增量事件 + `done.article` 最终可信成稿
- 流式体验 + 结构化 block 增量 + 最终 Article 归一

### Fixture / 手动测试经验

- 固定 fixture 对回归测试至关重要
- 样式 gallery 可用于视觉对比（Release 1 不做完整 gallery，但 fixture 体系必需）
- 公众号粘贴测试记录必须保留

### JSONL / Block Streaming 经验

- 结构化 block 输出适合公众号文章预览
- 但最终必须进入统一 Article Schema
- 不允许 stream 中间态成为独立文章结构

### ChatGPT + Cursor + docs 协作经验

- ChatGPT 负责规划和审查，Cursor 负责执行
- docs 是跨工具、跨会话的共享事实源
- 旧项目经验先文档化，再进入方案

## 明确不迁移

| 类别 | 说明 |
|------|------|
| 旧项目整体代码 | 不整包复制 |
| Visual Layer | 废弃视觉层方案 |
| Space Style | 废弃样式方案 |
| 多套 JSONL | 不保留多套流式格式 |
| 多套 renderer | 不保留预览/复制分裂的 renderer |
| 旁路兼容逻辑 | 不保留兼容旧方案的临时代码 |
| 历史实验代码 | 不迁移实验性实现 |
| 废弃测试开关 | 不迁移 feature flag 式旁路 |
| 临时 mock generate 链路 | 不建立 mock 主链路 |

## 迁移原则

1. **参考经验，不复制代码**
2. **迁移原则，不迁移包袱**
3. **先文档化，再进入方案**
4. **先统一架构，再实现功能**
5. 避免旧项目中多方案并存、实验代码残留、预览复制分裂的问题

## 相关文档

- `docs/architecture/prototype-lessons.md`
- `docs/architecture/style-system.md`
- `docs/architecture/wechat-copy-style-rules.md`
- `docs/architecture/generation-pipeline.md`
