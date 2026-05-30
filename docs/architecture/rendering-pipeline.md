# 渲染链路

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## 两种 Renderer

| Renderer | 用途 | 输出 |
|----------|------|------|
| Preview Renderer | 页面预览 | React 组件 / DOM |
| Copy Renderer | 复制到公众号 | 微信兼容 HTML |

## 核心约束

- Preview Renderer 和 Copy Renderer **可以分离**
- 但**必须共享同一套样式定义**
- **不允许**预览一套样式、复制一套样式

## 数据流

```
Article Schema
  → Style Assignment
  → Style Definition（共享）
  → Preview Renderer（页面展示）
  → Copy Renderer（HTML 输出）
```

## 禁止项

- 多套 renderer 各自维护样式
- 预览用 Tailwind/CSS-in-JS，复制用 inline style 且定义不一致
- 临时 mock render 链路

## 后续实现

- Preview：`src/core/renderer/`
- Copy：`src/core/copy/`
- 详见 Sprint 2 候选方向 C

## 相关文档

- [样式系统](style-system.md)
- [复制链路](copy-to-wechat-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
