# ChatGPT + Cursor + docs 协作机制

> 轻篇公众号排版 · qingpian-wechat-editor

## 角色分工

### ChatGPT

- 产品规划与梳理
- 架构讨论与技术方案
- 敏捷拆分（Story、Epic、Sprint Plan）
- 生成 Cursor 执行指令
- 审查 Cursor 执行结果

### Cursor

- 读取项目文件和 docs
- 执行代码和文档修改
- 运行 lint、test、build 等检查
- 维护 docs 与代码同步
- 提交变更（需用户授权）

### docs

- **共享事实源**
- 承接跨工具、跨会话、跨 Sprint 的上下文
- 产品、架构、敏捷决策的唯一权威来源

## 执行流程

```
用户意图
  → ChatGPT 梳理需求、生成 Cursor 指令
  → Cursor 执行前：阅读相关 docs
  → Cursor 执行：修改代码 / 文档 / 运行检查
  → Cursor 执行后：同步更新相关 docs
  → 用户将变更摘要发给 ChatGPT 复核
  → ChatGPT 审查并给出下一步指令
```

## 关键规则

1. **执行前读 docs** — Cursor 每轮执行前必须先阅读相关 docs，不依赖对话记忆
2. **执行后写 docs** — 代码变更必须同步更新对应文档
3. **冲突以 docs 为准** — ChatGPT 指令、Cursor 理解、docs 内容冲突时，优先 docs，并在 `decisions.md` 记录待确认项
4. **旧经验先文档化** — 旧项目经验先进入 docs，再影响技术方案，不直接进入代码
5. **不允许文档与代码脱节** — 只改代码不改文档，或只改文档但与实际状态不一致，均不允许

## 用户复核方式

用户可以将以下内容发给 ChatGPT 复核：

- Cursor 变更摘要
- 变更文件列表
- 关键文档内容（如 sprint-backlog、decisions、architecture 文档）

## 文档索引

| 类型 | 路径 |
|------|------|
| 产品 | `docs/product/` |
| 敏捷 | `docs/agile/` |
| 架构 | `docs/architecture/` |
| Cursor 规则 | `.cursor/rules/` |

## 相关决策

- DECISION-010：docs 是 ChatGPT 与 Cursor 之间的共享事实源
