# Cursor 指令模板

> **文档角色：** 正式 Cursor 单 Story 执行指令最低字段模板（S12-STORY-006 · **DECISION-121**）。

---

## 0. 执行身份与边界

（说明 Cursor 只执行 PO / ChatGPT 已批准的单 Story 范围。）

---

## 1. 分支信息

| 字段          | 填写                |
| ------------- | ------------------- |
| 当前分支      | sprint/…            |
| 来源分支      |                     |
| 预期来源 HEAD |                     |
| 工作分支      | docs/… 或 feature/… |
| 目标合并分支  | sprint/…            |

---

## 2. 本轮目标

（单一问题 · 可验收 · 可回滚。）

---

## 3. 执行范围

### 允许

- 新建工作分支 · 修改文档/代码（如指令授权）· Commit

### 默认禁止（除非 PO 明确授权）

- Merge · Push · 标记 Story Done · 关闭 Sprint / Release · 启动下一 Story

---

## 4. 文件边界

**允许修改：**

```text
（列出路径）
```

**禁止修改：**

```text
.cursor/rules/（除非指令明确授权）
src/ …（如本轮为纯文档 Story）
```

---

## 5. 明确不做

（列表。）

---

## 6. 验收标准

| AC   | 标准 |
| ---- | ---- |
| AC-1 |      |

---

## 7. Backlog 追踪（Product Story）

| 字段     | 值  |
| -------- | --- |
| PBI ID   |     |
| 用户活动 |     |
| Slice    |     |
| 模块     |     |
| 假设     |     |
| 成功指标 |     |
| 失败信号 |     |

---

## 8. 检查命令

```bash
git diff --check
git status --short
# prettier / lint / test / build 按 Story 类型
```

---

## 9. Commit / Merge / Push 边界

| 操作   | 是否允许 |
| ------ | -------- |
| Commit | 允许     |
| Merge  | 不允许   |
| Push   | 不允许   |

**建议 commit message：**

```text
docs(s12): …
```

---

## 10. Execution Report 要求

- 路径：`docs/agile/execution-reports/YYYY-MM-DD-<slug>.md`
- 模板：[`execution-report-template.md`](execution-report-template.md)
- 必须明确：未 merge · 未 push · 未启动下一 Story · 未标记 Done

---

## 11. 停止条件

遇到以下情况**立即停止并报告**：

- 分支/HEAD 与预期冲突 · working tree 不干净 · 范围外问题 · 事实源冲突 · 检查失败 · 需 PO 决策 · 需 merge/push/Done/下一 Story/Sprint 关闭

---

## 12. 最终回复格式

```text
Story:
工作分支:
来源分支:
目标分支:
主要修改文件:
主要 commit:
检查结果:
working tree:
merge 状态:
push 状态:
是否启动下一 Story:
```

**必须明确：** 已 commit，未 merge，未 push，未启动下一 Story（如适用）。
