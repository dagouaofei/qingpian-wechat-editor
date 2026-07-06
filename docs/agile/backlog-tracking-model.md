# Backlog 追踪模型

> **文档角色：** 轻篇 Product Backlog → Release Backlog → Sprint Backlog → Execution Evidence 追踪链路的**当前生效事实源**（S12-STORY-005 · **DECISION-120**）。
>
> **配套文档：**
>
> - [`product-backlog.md`](product-backlog.md) — 产品级 PBI 群组
> - [`product-coverage-matrix.md`](product-coverage-matrix.md) — 覆盖矩阵
> - [`../product/product-success-model.md`](../product/product-success-model.md) — Outcome Goal 与假设 H01–H10

---

## 1. Story 背景与目标

**S12-STORY-005** 的目标是建立轻篇产品治理中的 Backlog 追踪体系，使产品愿景、用户旅程、Story Map、产品模块、功能目录、产品假设、成功指标、Release Backlog、Sprint Backlog 与 Execution Evidence 形成可追踪链路。

### 1.1 追踪链路

```text
产品目标
→ 用户活动 / Story Map Slice
→ 产品模块 / 功能目录
→ 产品假设 / 成功指标 / 失败信号
→ Product Backlog Item
→ Release Backlog Item
→ Sprint Backlog Item
→ Story / Task / Bug / Enabler
→ Execution Evidence
```

### 1.2 本 Story 明确不做

- 不决定 Release 2 最终范围；
- 不生成全部未来开发 Story；
- 不细化全部功能目录为开发任务；
- 不承诺所有 Product Backlog Item 都会进入 Release 2；
- 不启动 S12-STORY-006；
- 不开发代码；
- 不关闭 Sprint 12；
- 不重写已关闭 Sprint / Release 的历史事实。

> **Release 2 的最终范围由 S12-STORY-008 决定。**

---

## 2. 四层 Backlog 与 Evidence 的关系

```text
Product Backlog Item
→ Release Backlog Item
→ Sprint Backlog Item
→ Story / Task / Bug / Enabler
→ Execution Evidence
```

| 层级                   | 角色                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| **Product Backlog**    | 产品级需求和机会池；描述「产品应有什么能力或应解决什么问题」         |
| **Release Backlog**    | 从 Product Backlog 中为某个 Release **选取**的验证范围；不另建事实源 |
| **Sprint Backlog**     | 从 Product / Release 层拆入某个 Sprint 的**执行单元**                |
| **Execution Evidence** | 执行、测试、验收、Decision 与 Execution Report 证据                  |

**规则：**

- Governance / Operations 类事项可以没有具体 Release，但仍须说明治理价值和证据链；
- **不允许**没有用户活动、模块、假设或成功指标来源的事项直接进入 Release committed scope；
- Release Backlog **不应**重新创造一套独立事实源，而应从 Product Backlog 选取。

---

## 3. Product Backlog Item 字段

每个 PBI 至少包含：

| 字段                    | 说明                                                   |
| ----------------------- | ------------------------------------------------------ |
| PBI ID                  | 例如 `PBI-QP-001`                                      |
| 名称                    | 产品级群组名称                                         |
| 类型                    | Feature / Enabler / Bug / Debt / Research / Governance |
| 状态                    | 见 §3.1                                                |
| 优先级                  | 见 §3.2                                                |
| 用户价值                | 为什么需要                                             |
| 目标用户                | 对应 users-and-scenarios                               |
| 关联用户活动            | A01–A11                                                |
| 关联 Story Map Slice    | Slice 1–7                                              |
| 关联产品模块            | M01–M11                                                |
| 关联功能目录项          | 见 product-feature-catalog.md                          |
| 关联产品假设            | H01–H10                                                |
| 关联成功指标            | 见 product-success-model.md                            |
| 关联失败信号            | 见 product-success-model.md                            |
| 候选 Release            | 非承诺                                                 |
| 依赖                    | PBI / 技术 / 治理依赖                                  |
| 风险                    | 产品、合规、技术风险                                   |
| 验收方向                | Release / Sprint 验收时如何判断价值                    |
| 关联 Decision           | DECISION-xxx                                           |
| 关联 Execution Evidence | Report / changelog / test evidence                     |

### 3.1 状态建议

```text
Candidate
Ready for Release Planning
Planned
In Progress
Done
Deferred
Rejected
```

### 3.2 优先级建议

| 优先级 | 含义                   |
| ------ | ---------------------- |
| **P0** | 当前最小成功闭环关键项 |
| **P1** | 重要增强项             |
| **P2** | 后续增强或条件触发项   |
| **P3** | 长期方向或观察项       |

---

## 4. Release Backlog Item 字段

| 字段                    | 说明                                    |
| ----------------------- | --------------------------------------- |
| Release Backlog Item ID | 例如 `RBI-R2-001`                       |
| 来源 PBI ID             | 必填                                    |
| 目标 Release            | Release 1 / Release 2 / Governance 等   |
| Release Outcome Goal    | 本 Release 要验证的结果                 |
| MoSCoW                  | Must / Should / Could / Won't           |
| 覆盖 Story Map Slice    | Slice 1–7                               |
| 覆盖产品假设            | H01–H10                                 |
| 成功指标                | 可度量                                  |
| 失败信号                | 触发调整的条件                          |
| 依赖                    | PBI / RBI / 技术                        |
| 风险                    |                                         |
| 状态                    | Candidate / Committed / Done / Deferred |
| 关联 Sprint / Story     | S12-STORY-xxx 等                        |
| 关联 Evidence           |                                         |

> **S12-STORY-005 只定义结构，不填死 Release 2 范围。**

---

## 5. Sprint Backlog Item 字段

Sprint Backlog **必须**能追溯到 Product / Release 层。

| 字段                         | 说明                                 |
| ---------------------------- | ------------------------------------ |
| Sprint Backlog Item ID       | 例如 `SBI-S12-005`                   |
| 来源 PBI ID                  | 必填（治理 Story 可标注 N/A 并说明） |
| 来源 Release Backlog Item ID | 如适用                               |
| Story ID                     | S12-STORY-005 等                     |
| Story 类型                   | Story / Task / Bug / Enabler         |
| Story 目标                   | 本轮要完成的单一问题                 |
| 用户价值或治理价值           |                                      |
| 验收标准                     | AC 列表                              |
| 明确不做事项                 |                                      |
| 来源分支                     | sprint 分支                          |
| 工作分支                     | feature/docs 分支                    |
| 目标合并分支                 | sprint 分支                          |
| 检查命令                     | lint / test / docs check             |
| 状态                         | Not Started / In Review / Done       |
| Execution Report             | 路径                                 |
| 验收结论                     | Accepted / Not Accepted 等           |

---

## 6. Outcome / 假设 / 指标进入 Backlog 的规则

每个进入 **Release Planning** 的 PBI 必须至少关联：

1. 1 个用户活动（A01–A11）；
2. 1 个 Story Map Slice（Slice 1–7）；
3. 1 个产品模块（M01–M11）；
4. 1 个产品假设（H01–H10）；
5. 1 个成功指标；
6. 1 个失败信号；
7. 1 个验收方向。

> **缺少上述追踪字段的 PBI 只能保持 Candidate，不应进入 Release Committed Scope。**

Outcome Goal 来自 [`product-success-model.md`](../product/product-success-model.md)；进入 Release Backlog 时须显式绑定 Release Outcome Goal。

---

## 7. Backlog 调整机制

```text
真实使用记录
→ 成功指标 / 失败信号
→ 假设是否成立
→ PBI 优先级调整
→ Release Backlog 调整
→ Sprint Backlog 调整
```

**示例：**

```text
如果 Product Owner 自己没有每周使用轻篇生产内容
→ H01 失败信号触发
→ 检查是输入资料、生成质量、排版、复制、复盘哪一步卡住
→ 对应 PBI 提升优先级或拆出 Bug / Enabler
```

调整记录在 Changelog、Execution Report、Sprint Review 与 Decision Log 中沉淀，不口头变更 committed scope。

---

## 8. 与后续 Story 的关系

### 给 S12-STORY-006 的输入

DoR 模板 · DoD 模板 · Story 启动检查 · Execution Report 模板 · Review / Acceptance 模板

### 给 S12-STORY-007 的输入

Release 1 已完成能力 → 对应用户活动 → 对应模块 → 对应 PBI → 已有 Evidence → 缺口与债务

### 给 S12-STORY-008 的输入

最小成功闭环 → 必须做 PBI → 可以做 PBI → 明确不做 PBI → Release Outcome Goal → 成功指标 → 失败信号

---

## 相关文档

- [Product Backlog](product-backlog.md)
- [Product Coverage Matrix](product-coverage-matrix.md)
- [User Story Map](../product/user-story-map.md)
- [产品模块树](../product/product-module-tree.md)
- [产品成功模型](../product/product-success-model.md)
