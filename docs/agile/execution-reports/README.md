# Execution Reports

> 轻篇公众号排版 · qingpian-wechat-editor

## 目的

Execution report 是 **ChatGPT + Cursor + docs 协作机制中的交接凭证**。

它不是额外的形式主义文档，而是每轮 Cursor 执行完成后，在项目内留下的结构化执行记录，用于：

- 记录 Cursor 执行结果；
- 作为 ChatGPT 审查 Cursor 工作成果的主要输入；
- 帮助用户判断是否合并分支、关闭 Story、进入下一步；
- 作为 docs 共享事实源的一部分，承接跨会话、跨分支、跨 Sprint 的项目上下文。

**Cursor 完成任务后，不应只在聊天窗口中回复摘要；必须把摘要沉淀到 execution report 文件中。**

## 适用场景

- 每轮 Cursor 执行完成后（默认必须生成）；
- 涉及 docs、规则、架构、代码、测试的任何一轮任务；
- 用户需要将执行结果发给 ChatGPT 审查时；
- 需要追溯某轮做了什么、改了哪些文件、检查结果如何时。

## 存放位置

```text
docs/agile/execution-reports/
```

## 命名规则

```text
YYYY-MM-DD-<short-task-slug>.md
```

- 文件名**必须以日期开头**；
- `<short-task-slug>` 使用小写英文和连字符，简短描述本轮任务。

示例：

```text
2026-05-30-s1b-execution-report-workflow.md
2026-05-30-style-system-review.md
2026-05-31-article-schema-contract.md
```

## 什么时候必须生成

- **默认：每轮 Cursor 执行后必须生成一份 execution report**（已由 `.cursor/rules/agile-rules.mdc` 项目规则约束）；
- 无需在每条 Cursor 指令中重复要求；
- 仅当用户**明确要求本轮不生成** execution report 时，才可跳过，并在 Cursor 回复中说明原因。

## 谁来阅读

| 角色 | 用途 |
|------|------|
| **用户** | 判断是否合并、关闭 Story、进入下一步 |
| **ChatGPT** | 审查执行结果、验收 AC、给出下一步指令 |
| **Cursor（后续轮次）** | 读取历史 execution report，恢复上下文 |

## ChatGPT 如何用于审查

用户将 execution report 文件路径或全文发给 ChatGPT，ChatGPT 据此：

1. 核对本轮目标是否完成；
2. 检查 AC 完成情况；
3. 审查修改/新增文件列表是否合理；
4. 确认 lint/build 等检查结果；
5. 识别未完成事项、风险与阻塞；
6. 给出是否通过、是否关闭 Story/Sprint 的判断建议。

**ChatGPT 审查 execution report，而不是依赖复制完整 Cursor 对话。**

## 与其他文档的配合

| 文档 | 关系 |
|------|------|
| `sprint-backlog.md` | execution report 关联 Story；Story/Sprint 关闭需用户确认，Cursor 不自行宣布 Done |
| `decisions.md` | 本轮关键决策写入 execution report，并同步到 decisions.md（如适用） |
| `changelog.md` | 合并或 Sprint 关闭时，由用户/ChatGPT 决定是否写入 changelog |
| `chatgpt-cursor-docs-workflow.md` | 描述 execution report 在协作流中的位置 |

## 模板

复制 [`_template.md`](_template.md) 创建新的 execution report。

## 相关决策

- DECISION-019：建立 execution report 作为 ChatGPT + Cursor 协作交接机制
