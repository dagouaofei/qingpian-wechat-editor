# ChatGPT + Cursor + docs 协作机制

> 轻篇公众号排版 · qingpian-wechat-editor

## 角色分工

### ChatGPT

- 产品规划与梳理
- 架构讨论与技术方案
- 敏捷拆分（Story、Epic、Sprint Plan）
- 生成 Cursor 执行指令（**每轮尽量一个单问题指令，建议任务分支名**）
- 审查 Cursor 执行结果（**主要输入：execution report**）
- 判断下一步（是否通过、是否 merge 回 sprint、是否关闭 Story/Sprint）

### Cursor

- **确认当前 sprint 分支**，新建本轮工作分支
- 读取项目文件和 docs
- 执行代码和文档修改
- 运行 lint、test、build 等检查
- 维护 docs 与代码同步
- **生成 execution report**（每轮默认必须）
- 提交变更（需用户授权）
- **不自行 merge** 至 sprint 或 main
- **不自行关闭**存在争议的 Sprint / Story

### docs

- **共享事实源**
- 承接跨工具、跨会话、跨 Sprint 的上下文
- 产品、架构、敏捷决策的唯一权威来源

### execution report

- 每轮 Cursor 执行后的**交接文档**
- 存放于 `docs/agile/execution-reports/`
- 用户发给 ChatGPT 审查，无需复制完整对话
- 须记录：当前分支、来源分支、目标合并分支

## 协作流程

```
1. 一个问题一轮任务
2. 每轮任务先确定当前 Sprint 分支（sprint/<sprint-slug>）
3. 从 Sprint 分支新建具体工作分支（feature/docs/bugfix/chore）
4. Cursor 只在该工作分支解决本轮问题
5. Cursor 执行后生成 execution report
6. 用户把 execution report 或摘要发给 ChatGPT
7. ChatGPT 判断是否通过、是否需要返工、是否建议合并回 Sprint 分支
8. 用户确认后再 merge（工作分支 → sprint 分支）
9. Sprint 内多个工作分支逐步合并回 Sprint 分支
10. Sprint 整体验收通过后，再合并回 main（用户确认）
```

**原则：**

- 每轮尽量**一个问题、一个工作分支、一个 execution report**
- 实际是否 merge，由**用户确认**；Cursor 不自动 merge sprint → main

## 关键规则

1. **执行前读 docs** — 含 `git-workflow.md`、`release-plan.md`、`sprint-backlog.md`（全局索引）及对应 `docs/agile/sprints/` / `docs/agile/releases/` 目录
2. **执行后写 docs** — 代码变更必须同步更新对应文档
3. **执行后写 execution report** — 见 `.cursor/rules/agile-rules.mdc`
4. **冲突以 docs 为准** — 记录到 `decisions.md` 待用户确认
5. **Sprint/Story 关闭需用户确认** — Cursor 不自行宣布 Done
6. **旧经验先文档化** — 不直接进入代码
7. **不允许文档与代码脱节**
8. **不在 main 上直接开发具体任务** — 见 `git-workflow.md`

## 用户复核方式

用户可以将以下内容发给 ChatGPT 复核（**推荐 execution report**）：

- **execution report 全文或路径**（首选）
- Cursor 变更摘要（含分支、merge 状态）
- 变更文件列表

## 文档索引

| 类型                      | 路径                                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| 产品                      | `docs/product/`                                                         |
| 敏捷                      | `docs/agile/`                                                           |
| 敏捷全局索引              | `docs/agile/release-plan.md` · `docs/agile/sprint-backlog.md`           |
| Sprint / Release 独立目录 | `docs/agile/sprints/` · `docs/agile/releases/`（平级；见 DECISION-114） |
| 架构                      | `docs/architecture/`                                                    |
| Git 工作流                | `docs/agile/git-workflow.md`                                            |
| 治理目标模型              | `docs/governance/product-governance-target-model.md`                    |
| Cursor 规则               | `.cursor/rules/`                                                        |
| Execution Reports         | `docs/agile/execution-reports/`                                         |

## 相关决策

- DECISION-010：docs 是 ChatGPT 与 Cursor 之间的共享事实源
- DECISION-019：建立 execution report 作为协作交接机制
- DECISION-114：Sprint / Release 独立平级目录与全局索引原则
