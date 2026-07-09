# Review / Acceptance 模板

> **文档角色：** ChatGPT Review 与 Product Owner Acceptance 标准输出结构（S12-STORY-006 · **DECISION-121**）。

---

## Part A — ChatGPT Review

### A.1 审查结论

**建议：** Accepted / Accepted with follow-ups / Not Accepted

> ChatGPT 建议 **不等于** PO 验收；仅作为 PO 决策输入。

### A.2 主要证据

- Execution Report 路径 · commit · 分支 · 修改文件摘要

### A.3 AC 覆盖情况

| AC   | 建议结果      | 说明 |
| ---- | ------------- | ---- |
| AC-1 | PASS/FAIL/N/A |      |

### A.4 范围边界

- 是否越界 · 是否修改禁止路径 · 是否启动下一 Story

### A.5 分支与 merge / push 状态

| 项    | 审查结果                    |
| ----- | --------------------------- |
| merge | 未授权执行 / 已授权并已执行 |
| push  | 未授权 / 已授权             |

### A.6 检查命令可信度

- report 中「待执行」 vs 终端证据 · 是否需 PO 补充确认

### A.7 风险与遗留

- 是否应进入 Backlog / Triage / Change Control

### A.8 是否建议 merge

- 是 / 否 · 目标分支 · `--no-ff` 建议

### A.9 对 Cursor 审查问题的回答

- ***

## Part B — Product Owner Acceptance

### B.1 验收记录

| 字段                 | 值                                                 |
| -------------------- | -------------------------------------------------- |
| Story ID             |                                                    |
| 验收状态             | Accepted / Accepted with follow-ups / Not Accepted |
| 验收日期             |                                                    |
| 主要成果 commit      |                                                    |
| 验收/状态同步 commit |                                                    |
| merge commit         |                                                    |
| 工作分支             |                                                    |
| 目标分支             |                                                    |
| working tree         | clean                                              |
| push 状态            | 未 push                                            |
| 是否启动下一 Story   | 否                                                 |

### B.2 授权

| 项              | PO 授权 |
| --------------- | ------- |
| 标记 Done       | 是 / 否 |
| merge 至 sprint | 是 / 否 |
| push            | 是 / 否 |
| 启动下一 Story  | 是 / 否 |

### B.3 遗留事项（Accepted with follow-ups）

| ID  | 描述 | Backlog 位置         | 优先级 | 状态 |
| --- | ---- | -------------------- | ------ | ---- |
|     |      | PBI/RBI/SBI/Bug/Debt |        | Open |

> 遗留项必须进入 Product Backlog、Release Backlog、Sprint Backlog 或明确记录处理位置。

### B.4 说明（可选）

- execution report 措辞 vs 实际检查 · report-only 不追加 commit 等

---

## 验收结论只允许

```text
Accepted
Accepted with follow-ups
Not Accepted
```
