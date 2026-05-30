# 复制到公众号链路

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## 定位

**复制到微信公众号编辑器是一级核心能力。**

## 链路

```
Article Schema
  → Style Assignment
  → Copy Renderer
  → 微信兼容 HTML
  → 用户复制
  → 粘贴到微信公众号编辑器
```

## 核心要求

- Copy Renderer 输出**微信兼容 HTML**
- 样式需要面向**微信粘贴兼容**设计
- 与 Preview Renderer **共享同一套样式定义**

## 质量保障

- 后续涉及复制功能时**必须进行人工粘贴测试**
- 建立粘贴测试清单和测试记录
- 每个样式 variant 都应进入粘贴测试范围

## 历史教训

旧一键成稿项目中「网页预览与微信公众号粘贴不一致」是高频问题。新项目必须：

- 前置解决复制一致性，而非事后修补
- 以微信公众号编辑器粘贴效果为最终标准
- 135 编辑器表现仅作参考，不作最终标准

详见 [wechat-copy-style-rules.md](wechat-copy-style-rules.md) 和 [prototype-lessons.md](prototype-lessons.md)。

## 后续实现

- 代码位置：`src/core/copy/`
- 详见 Sprint 2 候选方向 C

## 相关文档

- [渲染链路](rendering-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
