# Execution Report：<任务名称>

> 模板文件 · 复制后须替换全部占位内容 · **不得**将本模板直接作为最终报告提交
> 固定顺序见 `.cursor/rules/agile-rules.mdc` · 事实源边界见 **DECISION-115**

## 1. 基本信息

- 日期：
- 执行分支：
- 来源分支：
- 目标合并分支：
- HEAD at review time 所在分支：
- merge 后所在分支：（未 merge 时写 N/A）
- Sprint：
- 关联 Story / Bug / Decision：
- 执行者：Cursor
- 状态：Draft / In Progress / In Review / Blocked / Partial / Done

**状态说明：** `Done` 只能在 Product Owner 明确验收并允许标记 Done 后使用。Cursor 完成执行并提交报告时，默认应为 `In Review`，而不是 `Done`。

**分支说明：** 不得将「执行分支」与「merge 后所在分支」混为一谈。未 merge 时，`merge 后所在分支` 写 N/A。

## 2. 本轮目标

（简述本轮要解决的单一问题）

## 3. 执行范围

（本轮做了什么、没做什么）

## 4. 修改文件

-

## 5. 新增文件

-

## 6. 阅读但未修改的关键文件

-

## 7. 关键变更说明

（摘要说明关键改动及原因）

## 8. 验收标准完成情况

| AC   | 结果              | 说明 |
| ---- | ----------------- | ---- |
| AC-1 | PASS / FAIL / N/A |      |
| AC-2 | PASS / FAIL / N/A |      |

## 9. 运行检查

| 命令             | 结果                                     | 说明 |
| ---------------- | ---------------------------------------- | ---- |
| git diff --check | PASS / FAIL：具体原因 / 未运行：具体原因 |      |
| prettier         | PASS / FAIL：具体原因 / 未运行：具体原因 |      |
| pnpm lint        | PASS / FAIL：具体原因 / 未运行：具体原因 |      |
| pnpm build       | PASS / FAIL / 未运行                     |      |

## 10. 未完成事项

- （无则写「无」）

## 11. 风险与阻塞

- （无则写「无」）

## 12. 需要用户 / ChatGPT 审查的问题

-

## 13. 建议下一步

-

## 14. Commit

### 主要实现 commit

- `<hash>` — （说明）

### 影响实际成果的修正 commit（如有）

- `<hash>` — （说明；不含 report-only）

### 已授权 merge commit（如有）

- `<hash>` — merge 至 `<target-branch>`

### report-only commit

仅修改 execution report 自身；**不要求**写回本报告。

### merge / push / working tree

| 项                    | 状态                       |
| --------------------- | -------------------------- |
| merge 至 sprint       | 未执行 / 已执行 @ `<hash>` |
| merge 至 release/main | 未执行                     |
| push                  | 未 push / 已 push          |
| working tree          | clean / 有未提交变更       |

`HEAD at review time` 由 Cursor 最终回复报告，不要求写回本文件。不得为回填最新 HEAD 循环产生 report-only commit。
