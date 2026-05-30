# 生成链路

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## Release 1 输入

支持三类输入：

| 输入类型 | 说明 |
|----------|------|
| 主题 | 用户输入主题，系统生成文章 |
| 资料 | 用户粘贴参考资料，系统整理生成 |
| 草稿 | 用户粘贴初稿，系统优化排版 |

## 核心约束

- 生成链路**不能写死**为 topic → article
- 生成结果**必须进入统一 Article Schema**
- 基础流式 / 打字机式展示属于 Release 1 范围
- **不允许 `streamArticle` 成为独立文章结构**

## 流式生成架构（吸收旧项目经验）

### 底层 vs 应用层

| 层级 | 说明 |
|------|------|
| 底层（模型侧） | 可能是 token/chunk streaming |
| 应用层（产品侧） | SSE + JSONL/block 增量事件 + `done.article` 最终可信成稿 |

### 应用层事件模型（目标）

```
SSE 连接
  → block 增量事件（JSONL / structured block）
  → 流式预览更新
  → done.article（最终 Article 归一）
```

### 关键原则

- **流式体验 + 结构化 block 增量 + 最终 Article 归一**
- 不得让原始 token 流成为独立文章结构
- 流式中间态仅用于 UI 展示，终态必须是完整 Article Schema

## 禁止项

- streamArticle 平行结构
- 多套 JSONL 格式
- 临时 mock generate 链路
- token 流直接作为文章持久化

## 旧项目经验

旧一键成稿项目验证了：

- 结构化 block 输出适合公众号文章预览
- SSE + block 增量 + done 事件的模式可行
- 但最终必须归一到统一 Article

详见 [prototype-lessons.md](prototype-lessons.md)。

## 后续实现

- 代码位置：`src/core/generation/`
- 详见 Release 1 EPIC-002、EPIC-007

## 相关文档

- [Article Schema](article-schema.md)
- [Block Schema](block-schema.md)
