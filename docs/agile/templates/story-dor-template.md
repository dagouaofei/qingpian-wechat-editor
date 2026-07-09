# Story DoR 模板（Definition of Ready）

> **文档角色：** Story 启动前 **Definition of Ready** 标准模板（S12-STORY-006 · **DECISION-121**）。
>
> **Operating Model：** [`../agile-operating-model.md`](../agile-operating-model.md)

---

## 使用说明

- 每个 Story **启动前**必须完成本 DoR；
- DoR 不完整 → **Story Ready Gate 不通过** → 不得启动 Cursor 执行；
- Product / Governance / Operations / Hardening / Release Closeout 类型字段要求见 §4。

---

## 1. 基本信息

| 字段          | 填写                                                             |
| ------------- | ---------------------------------------------------------------- |
| Story ID      |                                                                  |
| Story 名称    |                                                                  |
| Story 类型    | Product / Governance / Operations / Hardening / Release Closeout |
| Sprint        |                                                                  |
| 关联 Decision |                                                                  |

---

## 2. 目标与价值

| 字段               | 填写 |
| ------------------ | ---- |
| Story 目标         |      |
| 用户价值或治理价值 |      |
| 验收方向           |      |

---

## 3. Backlog 追踪（Product Story 必填）

| 字段                      | 填写             |
| ------------------------- | ---------------- |
| 关联 Product Backlog Item | PBI ID           |
| 关联 Release Backlog Item | RBI ID（如适用） |
| 关联 Sprint Backlog Item  | SBI ID           |
| 关联用户活动 A01–A11      |                  |
| 关联 Story Map Slice      | Slice 1–7        |
| 关联产品模块 M01–M11      |                  |
| 关联产品假设 H01–H10      |                  |
| 关联成功指标              |                  |
| 关联失败信号              |                  |
| 关联功能目录项（如适用）  |                  |

> **缺少上述追踪字段的 Product Story 不得进入 Ready。**

---

## 4. Governance / Operations Story 例外

Governance / Operations Story 可将 **PBI / RBI / 用户活动 / Slice / Module / Hypothesis** 标为 **N/A**，但必须填写：

| 字段                | 填写 |
| ------------------- | ---- |
| 治理价值            |      |
| 影响范围            |      |
| 证据链              |      |
| 对后续 Story 的影响 |      |

---

## 5. PBI 条件触发（PBI-QP-009 等）

若关联 PBI 优先级为 **「条件触发」**（如 **PBI-QP-009** 高表现内容拆解与再创作），必须填写：

| 字段            | 填写    |
| --------------- | ------- |
| 条件触发说明    |         |
| 触发依据        |         |
| 触发人          |         |
| 触发场景        |         |
| PO 是否明确确认 | 是 / 否 |

> **PBI-QP-009 优先级不得自动升为 P0**；须 PO 根据自身运营需求明确确认。

---

## 6. 验收与边界

| 字段         | 填写   |
| ------------ | ------ |
| 验收标准 AC  | AC-1 … |
| 明确不做事项 |        |
| 依赖         |        |
| 风险         |        |

---

## 7. 分支与 Git

| 字段          | 填写 |
| ------------- | ---- |
| 来源分支      |      |
| 工作分支      |      |
| 目标合并分支  |      |
| 预期来源 HEAD |      |

---

## 8. 执行边界

| 字段                  | 填写                  |
| --------------------- | --------------------- |
| 允许修改范围          |                       |
| 禁止修改范围          |                       |
| 检查命令              |                       |
| commit 边界           | 允许 / 禁止           |
| merge 边界            | 默认禁止，PO 授权除外 |
| push 边界             | 默认禁止，PO 授权除外 |
| 停止条件              |                       |
| Execution Report 要求 | 路径与必填字段        |

---

## 9. DoR 签核

| 项                 | 状态        |
| ------------------ | ----------- |
| 字段完整           | ☐           |
| PO 启动授权        | ☐           |
| ChatGPT 指令已生成 | ☐（如适用） |

**DoR 完成日期：**  
**授权人：**
