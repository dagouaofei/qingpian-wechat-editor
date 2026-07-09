# Story DoD 模板（Definition of Done）

> **文档角色：** Story 标记 **Accepted / Done** 前 **Definition of Done** 标准模板（S12-STORY-006 · **DECISION-121**）。

---

## 核心原则

- **Cursor 自称 Done 不等于 Story Done**；
- **ChatGPT 建议 Accepted 不等于 PO Accepted**；
- **只有 PO 明确验收后才能标记 Accepted / Done**。

---

## 1. 基本信息

| 字段       | 填写   |
| ---------- | ------ |
| Story ID   |        |
| Story 名称 |        |
| 工作分支   |        |
| 执行者     | Cursor |

---

## 2. 完成条件检查清单

| #   | 条件                                                    | 结果 PASS/FAIL/N/A |
| --- | ------------------------------------------------------- | ------------------ |
| 1   | 验收标准 AC 全部满足或 PO 明确 Accepted with follow-ups |                    |
| 2   | 实际修改范围未越界                                      |                    |
| 3   | 必要检查已执行并记录（lint/test/build/docs）            |                    |
| 4   | 未执行检查已说明原因                                    |                    |
| 5   | Execution Report 已提交且状态 In Review 或已验收        |                    |
| 6   | 主要实现 commit 已记录                                  |                    |
| 7   | working tree clean                                      |                    |
| 8   | merge 状态明确（未 merge / 已 merge + commit）          |                    |
| 9   | push 状态明确（默认未 push）                            |                    |
| 10  | **未**启动下一 Story                                    |                    |
| 11  | 必要文档与 Backlog 状态已同步                           |                    |
| 12  | ChatGPT Review 已完成                                   |                    |
| 13  | PO 已明确给出验收结论                                   |                    |

---

## 3. 证据记录

| 字段                     | 填写 |
| ------------------------ | ---- |
| 主要成果 commit          |      |
| 验收/状态同步 commit     |      |
| merge commit（如已授权） |      |
| Execution Report 路径    |      |
| HEAD at review time      |      |

---

## 4. PO 验收

| 字段       | 填写                                               |
| ---------- | -------------------------------------------------- |
| 验收结论   | Accepted / Accepted with follow-ups / Not Accepted |
| 验收日期   |                                                    |
| 遗留事项   |                                                    |
| merge 授权 | 是 / 否                                            |
| push 授权  | 是 / 否                                            |

---

## 5. Follow-up 处理（Accepted with follow-ups）

| 遗留 ID | 描述 | 进入 Backlog 位置            | 状态 |
| ------- | ---- | ---------------------------- | ---- |
|         |      | PBI / RBI / SBI / Bug / Debt |      |

> 遗留项**必须**进入 Product Backlog、Release Backlog、Sprint Backlog 或明确记录处理位置。
