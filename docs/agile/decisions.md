# 决策记录

> 轻篇公众号排版 · qingpian-wechat-editor

| ID | 日期 | 决策 | 状态 |
|----|------|------|------|
| DECISION-001 | 2026-05-30 | 项目正式命名为 `qingpian-wechat-editor` | 已确认 |
| DECISION-002 | 2026-05-30 | 产品命名为「轻篇公众号排版」 | 已确认 |
| DECISION-003 | 2026-05-30 | 本项目不使用 clean-core / v2 / demo / prototype 命名 | 已确认 |
| DECISION-004 | 2026-05-30 | Release 1 聚焦公众号文章生成、样式排版、流式预览与复制一致性闭环 | 已确认 |
| DECISION-005 | 2026-05-30 | 样式系统属于 Release 1 核心范围 | 已确认 |
| DECISION-006 | 2026-05-30 | 公众号复制一致性是 Release 1 P0 质量标准 | 已确认 |
| DECISION-007 | 2026-05-30 | 后续 Sprint 按合理工作量拆分（Sprint 1 不受 1 人/1 周约束，见 DECISION-011） | 已确认 |
| DECISION-008 | 2026-05-30 | Sprint 1 不做业务功能实现，只做项目初始化、规则、文档与核心技术方案 | 已确认 |
| DECISION-009 | 2026-05-30 | 旧一键成稿项目只作为经验来源，不作为代码来源 | 已确认 |
| DECISION-010 | 2026-05-30 | ChatGPT + Cursor + docs 协作方式中，docs 是共享事实源 | 已确认 |
| DECISION-011 | 2026-05-30 | 去除 Sprint 1 的 1 人 / 1 周工作量约束 | 已确认 |
| DECISION-012 | 2026-05-30 | Sprint 1 范围从「项目初始化与文档骨架」扩展为「正式项目启动、核心技术方案定稿与工程治理」 | 已确认 |
| DECISION-013 | 2026-05-30 | Sprint 1-A 已完成项目初始化与文档骨架；Sprint 1-B 补齐 Git 仓库治理和核心技术方案 | 已确认 |
| DECISION-014 | 2026-05-30 | style-system.md 必须升级为正式技术方案，不得停留在概念骨架 | 已确认 |
| DECISION-015 | 2026-05-30 | 业务功能实现必须在核心技术方案完成后再进入后续 Sprint | 已确认 |
| DECISION-016 | 2026-05-30 | Git 主分支为 `main`，采用 feature/sprint/bugfix/docs 分支策略 | 已确认 |
| DECISION-017 | 2026-05-30 | Remote 仓库待配置，配置后 push 至 origin | 已确认 |
| DECISION-018 | 2026-05-30 | 核心技术方案一致性审查完成，9 份架构文档 + 产品/敏捷文档对齐 | 已确认 |
| DECISION-019 | 2026-05-30 | 建立 execution report 作为 ChatGPT + Cursor 协作交接机制 | 已确认 |
| DECISION-020 | 2026-05-30 | 建立 Sprint 分支与迭代内工作分支机制 | 已确认 |

### DECISION-019 详情

- **背景：** 旧一键成稿项目经验表明，ChatGPT 与 Cursor 协作需要结构化交接，避免每轮复制完整对话或在指令中重复要求报告。
- **决策：**
  1. 每轮 Cursor 执行后必须生成 execution report
  2. 存放于 `docs/agile/execution-reports/`
  3. execution report 是 ChatGPT 审查 Cursor 执行结果的主要输入
  4. Cursor 不应仅凭自己的总结关闭 Sprint / Story
  5. Sprint / Story 的最终关闭需要用户确认
- **影响范围：** `.cursor/rules/`、docs/agile/、协作流程
- **状态：** 已确认

### DECISION-020 详情

- **背景：** 需要清晰的分支边界，使 Sprint 内每项工作可独立审查、合并、回滚，避免在 main 上直接开发或多任务混分支。
- **决策：**
  1. 每个 Sprint 新建 `sprint/<sprint-slug>` 分支
  2. Sprint 内每个具体任务从当前 sprint 分支新建 `feature/` / `docs/` / `bugfix/` / `chore/` 分支
  3. 工作分支完成并经审查后合并回 sprint 分支
  4. Sprint 整体验收通过后，sprint 分支再合并回 main
  5. Cursor 不得未经用户确认直接关闭 Sprint 或合并 main
- **影响范围：** `docs/agile/git-workflow.md`、`.cursor/rules/`、协作流程
- **状态：** 已确认

## 待确认决策

- Sprint 2 主要方向（A / B / C 或组合）：待用户确认

## 决策模板

```
### DECISION-XXX：[标题]

- **日期：**
- **背景：**
- **决策：**
- **影响范围：**
- **状态：** 待确认 / 已确认 / 已废弃
```
