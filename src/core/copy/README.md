# Copy 模块

> 状态：占位 · Sprint 1 未实现业务代码

## 职责

承载 **Copy-to-WeChat Pipeline**，生成微信兼容 HTML。

## 约束

- 复制到微信公众号编辑器是一级核心能力
- 与 Preview Renderer 共享同一套样式定义
- 公众号复制一致性是 Release 1 P0 质量标准
- 涉及复制功能时必须进行人工粘贴测试

## 参考文档

- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/wechat-copy-style-rules.md`
