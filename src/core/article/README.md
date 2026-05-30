# Article 模块

> 状态：占位 · Sprint 1 未实现业务代码

## 职责

承载 **Article 唯一文章主模型** 及相关逻辑。

## 约束

- Article 是唯一文章主模型
- 不允许多套 Article Schema
- 所有输入和生成结果最终进入 Article
- Article 不直接承载具体 CSS

## 后续实现

- Article Schema 定义（Zod）
- Article 类型与工具函数
- fixture 数据结构

## 参考文档

- `docs/architecture/article-schema.md`
