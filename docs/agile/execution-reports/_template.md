# Execution Report：<任务名称>

> 模板文件 · 复制后须替换全部占位内容 · **不得**将本模板直接作为最终报告提交
> 固定顺序见 `.cursor/rules/agile-governance.mdc`

## 1. 基本信息

- 日期：
- 当前分支：
- 来源分支：
- 目标合并分支：
- Sprint：
- 关联 Story / Bug / Decision：
- 执行者：Cursor
- 状态：Done / In Review / Blocked / Partial

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

## 9. 运行检查

| 命令             | 结果                                     | 说明 |
| ---------------- | ---------------------------------------- | ---- |
| git diff --check | PASS / FAIL：具体原因 / 未运行：具体原因 |      |
| prettier         | PASS / FAIL：具体原因 / 未运行：具体原因 |      |
| pnpm lint        | PASS / FAIL：具体原因 / 未运行：具体原因 |      |

## 10. 未完成事项

- （无则写「无」）

## 11. 风险与阻塞

- （无则写「无」）

## 12. 需要用户 / ChatGPT 审查的问题

-

## 13. 建议下一步

-

## 14. merge / push / working tree

| 项                    | 状态                       |
| --------------------- | -------------------------- |
| merge 至 sprint       | 未执行 / 已执行 @ `<hash>` |
| merge 至 release/main | 未执行                     |
| push                  | 未执行                     |
| working tree          | clean / dirty（说明）      |

## Commit 分类

### 主要成果 commit

- 必须填写真实 hash 和 message

### 影响实际成果的修正 commit

- 无，或填写真实 hash 和 message

### Merge commit

- 未执行，或填写真实 merge commit

### Report-only commit

本报告的 report-only commit 不回填本文件；
最终 HEAD at review time 由 Cursor 最终回复报告。
