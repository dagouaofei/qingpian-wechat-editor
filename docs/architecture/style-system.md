# 样式系统

> 轻篇公众号排版 · qingpian-wechat-editor

> 状态：文档骨架 · Sprint 1 未实现代码

## Release 1 定位

- **样式系统属于 Release 1 核心范围**，不是后置预留
- 完整样式市场后置，但**样式系统架构前置**
- Release 1 必须按正式样式系统实现第一批样式

## 架构组成

| 概念 | 说明 |
|------|------|
| theme | 全局主题（色彩、字体基调） |
| style preset | 预设风格包 |
| style variant | 同一 block 的不同视觉变体 |
| block style registry | block 类型与可用样式的注册表 |
| style assignment | 将样式分配给 article / block |

## 扩展方向

样式方案必须前置考虑：

- **slot** — 样式插槽，支持局部替换
- **density** — 紧凑 / 标准 / 宽松
- **layout** — 布局方式
- **spacing** — 间距体系
- **typography** — 字体、字号、行高
- **decoration** — 装饰元素（边框、背景、阴影）

## 扩展目标

样式系统要支持未来「样式千变万化」的扩展目标，不得把样式写死为不可复用的页面样式。

## 渲染共享

- Preview Renderer 和 Copy Renderer **必须共享样式定义**
- 涉及样式必须考虑**微信公众号复制兼容**

## 旧项目经验参考

可参考旧一键成稿项目中的：

- Component DSL
- slot、density、variant、registry 探索

**不得照搬：**

- Visual Layer
- Space Style
- 旧项目混杂方案

详见 [prototype-lessons.md](prototype-lessons.md) 和 [migration-reference.md](../agile/migration-reference.md)。

## 后续实现

- 代码位置：`src/core/styles/`
- 详见 Sprint 2 候选方向 B

## 相关文档

- [渲染链路](rendering-pipeline.md)
- [公众号复制样式规则](wechat-copy-style-rules.md)
