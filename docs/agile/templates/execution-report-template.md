# Execution Report 模板

> **文档角色：** Cursor 执行完成后标准 Execution Report 字段模板（S12-STORY-006 · **DECISION-121**）。
>
> **历史模板（保留）：** [`../execution-reports/_template.md`](../execution-reports/_template.md) — 旧 Story 仍有效；S12 起新 Story 优先使用本模板。

---

## 1. 基本信息

- 日期：
- Story：
- Sprint：
- Release：（如适用）
- 状态：**In Review**（默认；PO 验收前不得写 Done）
- 执行分支：
- 来源分支： @ HEAD
- 目标合并分支：（本轮未 merge 时注明）
- 关联 Decision：
- 执行者：Cursor

---

## 2. 本轮目标

---

## 3. 实际完成范围

---

## 4. 明确未做事项

- 未 merge · 未 push · 未标记 Done · 未启动下一 Story · …

---

## 5. 修改文件

-

## 6. 新增文件

-

## 7. 关键产品与治理决定

-

## 8. 验收标准完成情况

| AC   | 结果          | 说明 |
| ---- | ------------- | ---- |
| AC-1 | PASS/FAIL/N/A |      |

---

## 9. 检查命令与结果

| 命令             | 结果                        |
| ---------------- | --------------------------- |
| git diff --check |                             |
| git status       |                             |
| prettier         |                             |
| lint/test/build  | 未运行 / PASS / FAIL + 原因 |

---

## 10. 风险与遗留

-

## 11. 需要 ChatGPT 审查的问题

-

## 12. Commit 与 Git 状态

| 项                    | 值                      |
| --------------------- | ----------------------- |
| 主要实现 commit       |                         |
| 修正 commit           |                         |
| merge commit          | N/A 或 hash             |
| working tree          | clean / 其他            |
| merge 状态            | **未 merge** / 已 merge |
| push 状态             | **未 push** / 已 push   |
| 是否启动下一 Story    | 否                      |
| 是否修改产品代码      | 是 / 否                 |
| 是否决定 Release 范围 | 是 / 否                 |
| 是否标记 Story Done   | 否（默认）              |
| HEAD at review time   |                         |

**必须明确：** 未 merge。未 push。未启动下一 Story。未标记 Story Done（除非 PO 已验收且本轮为 acceptance 同步）。
