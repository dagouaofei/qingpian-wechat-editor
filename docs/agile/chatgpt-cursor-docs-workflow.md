# ChatGPT + Cursor + docs 协作机制

> 轻篇公众号排版 · qingpian-wechat-editor

## 角色分工

### ChatGPT

- 产品规划与梳理
- 架构讨论与技术方案
- 敏捷拆分（Story、Epic、Sprint Plan）
- 生成 Cursor 执行指令（**每轮尽量一个单问题指令**）
- 审查 Cursor 执行结果（**主要输入：execution report**）
- 判断下一步（是否通过、是否合并、是否关闭 Story/Sprint）

### Cursor

- **新建本轮分支**
- 读取项目文件和 docs
- 执行代码和文档修改
- 运行 lint、test、build 等检查
- 维护 docs 与代码同步
- **生成 execution report**（每轮默认必须）
- 提交变更（需用户授权）
- **不自行关闭**存在争议的 Sprint / Story

### docs

- **共享事实源**
- 承接跨工具、跨会话、跨 Sprint 的上下文
- 产品、架构、敏捷决策的唯一权威来源

### execution report

- 每轮 Cursor 执行后的**交接文档**
- 存放于 `docs/agile/execution-reports/`
- 用户发给 ChatGPT 审查，无需复制完整对话

## 协作流程

```
1. ChatGPT 给出单问题 Cursor 指令
2. Cursor 新建本轮分支
3. Cursor 阅读相关 docs
4. Cursor 执行本轮任务
5. Cursor 更新相关 docs
6. Cursor 生成 execution report
7. 用户把 execution report 或摘要发给 ChatGPT
8. ChatGPT 审查是否通过
9. 用户决定是否合并、关闭 Story、进入下一步
```

**原则：以后每轮尽量一个问题、一个分支、一个 execution report。**

## 关键规则

1. **执行前读 docs** — Cursor 每轮执行前必须先阅读相关 docs，不依赖对话记忆
2. **执行后写 docs** — 代码变更必须同步更新对应文档
3. **执行后写 execution report** — 摘要必须沉淀到项目文件，见 `.cursor/rules/agile-rules.mdc`
4. **冲突以 docs 为准** — ChatGPT 指令、Cursor 理解、docs 内容冲突时，优先 docs，并在 `decisions.md` 记录待确认项
5. **Sprint/Story 关闭需用户确认** — Cursor 不自行宣布 Done；争议时标记 In Review
6. **旧经验先文档化** — 旧项目经验先进入 docs，再影响技术方案，不直接进入代码
7. **不允许文档与代码脱节** — 只改代码不改文档，或只改文档但与实际状态不一致，均不允许

## 用户复核方式

用户可以将以下内容发给 ChatGPT 复核（**推荐 execution report**）：

- **execution report 全文或路径**（首选）
- Cursor 变更摘要
- 变更文件列表
- 关键文档内容

## 文档索引

| 类型 | 路径 |
|------|------|
| 产品 | `docs/product/` |
| 敏捷 | `docs/agile/` |
| 架构 | `docs/architecture/` |
| Cursor 规则 | `.cursor/rules/` |
| Execution Reports | `docs/agile/execution-reports/` |

## 相关决策

- DECISION-010：docs 是 ChatGPT 与 Cursor 之间的共享事实源
- DECISION-019：建立 execution report 作为 ChatGPT + Cursor 协作交接机制
