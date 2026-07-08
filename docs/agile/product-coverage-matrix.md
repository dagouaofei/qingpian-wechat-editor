# Product Coverage Matrix

> **文档角色：** 轻篇用户活动、Story Map、产品模块、产品假设与 Product Backlog 覆盖关系的**当前生效事实源**（S12-STORY-005 · **DECISION-120**）。
>
> **配套文档：** [`backlog-tracking-model.md`](backlog-tracking-model.md) · [`product-backlog.md`](product-backlog.md)

---

## 1. 用途

本矩阵用于：

- 检查哪些**用户活动**没有 Backlog 支撑；
- 检查哪些**模块**没有真实用户任务来源；
- 检查哪些 **PBI** 没有产品假设或成功指标；
- 检查 **Release 2** 是否覆盖最小成功闭环（候选 · 非承诺）；
- 检查是否出现「技术上想做但产品上没有依据」的事项。

> **S12-STORY-005 不决定 Release 2 最终范围。** 候选 Release 列仅为规划输入。

---

## 2. 矩阵字段说明

| 字段            | 说明                                    |
| --------------- | --------------------------------------- |
| 用户活动        | A01–A11                                 |
| Story Map Slice | Slice 1–7                               |
| 产品模块        | M01–M11                                 |
| 功能目录项      | 见 product-feature-catalog.md（摘要级） |
| 产品假设        | H01–H10                                 |
| 成功指标        | 见 product-success-model.md             |
| 失败信号        | 见 product-success-model.md             |
| PBI ID          | PBI-QP-001 ~ PBI-QP-010                 |
| 候选 Release    | 非承诺                                  |
| 当前状态        | Candidate / Partial / R1-Done 等        |
| Evidence        | Decision / Sprint / Execution Report    |
| 备注            | 缺口与后续 Story 输入                   |

---

## 3. PBI 覆盖总表

| PBI ID     | 用户活动            | Slice   | 模块                | 假设        | 候选 Release | 当前状态                   | Evidence / 备注                         |
| ---------- | ------------------- | ------- | ------------------- | ----------- | ------------ | -------------------------- | --------------------------------------- |
| PBI-QP-001 | A01,A05,A06,A07,A08 | 2,5     | M01,M08,M10         | H02,H05,H07 | R2 候选      | Candidate                  | S12-STORY-002/003/004 · 无产品实现      |
| PBI-QP-002 | A02,A03             | 3,4,5   | M02,M03,M11         | H03,H09     | R2 候选      | Candidate                  | DECISION-119 · M11 优先级靠后           |
| PBI-QP-003 | A03,A04,A05,A11     | 3,5,7   | M03,M02,M09         | H03,H08,H10 | R2 候选      | Candidate                  | Slice 7 轻量复盘                        |
| PBI-QP-004 | A04,A10,A11         | 5,6,7   | M03,M04,M08,M09,M11 | H07,H08,H10 | R2+ 候选     | Candidate                  | 长期核心方向                            |
| PBI-QP-005 | A05,A06,A07         | 1,2,3,4 | M04,M05,M01,M02     | H02,H04,H09 | R1 部分/R2   | **Partial**                | R1-CAP-004/005 · S5–S7 · PB-R1-01/02/06 |
| PBI-QP-006 | A08,A09             | 1,2,3,5 | M06,M07             | H05,H06     | R1 部分/R2   | **Partial / Strongest R1** | R1-CAP-003/006 · S3–S8 · DECISION-093   |
| PBI-QP-007 | A10,A05,A06         | 5,6     | M08,M01,M09         | H07,H10     | R2/R3 候选   | Candidate                  | 无正式内容库                            |
| PBI-QP-008 | A11,A02,A03         | 7       | M09,M11,M02,M03     | H08         | R2 轻量      | Candidate                  | 手动复盘优先                            |
| PBI-QP-009 | A02,A03,A05,A06,A07 | 4       | M02,M04,M05,M08     | H09         | 条件触发     | Candidate                  | 洗稿/侵权风险须治理 · PO 优先级可变     |
| PBI-QP-010 | A06,A09,A10         | 5,6     | M07,M08,M04         | H07,H10     | R2+ 候选     | Candidate                  | 公众号优先 · 多平台后置                 |

---

## 4. 用户活动 A01–A11 覆盖

| 活动 | 名称                 | 支撑 PBI               | 当前状态  | 备注                          |
| ---- | -------------------- | ---------------------- | --------- | ----------------------------- |
| A01  | 建立品牌与内容基础   | PBI-QP-001             | **Gap**   | S12-STORY-007：R1 无 M01 实现 |
| A02  | 收集灵感与外部信号   | PBI-QP-002, PBI-QP-009 | Candidate | Slice 4 条件触发              |
| A03  | 形成选题与内容计划   | PBI-QP-002, PBI-QP-003 | Candidate |                               |
| A04  | 持续内容运营与系列化 | PBI-QP-003, PBI-QP-004 | Candidate | 轻篇差异化核心                |
| A05  | 准备单篇创作任务     | PBI-QP-001,003,005,009 | Partial   | R1 输入部分覆盖               |
| A06  | 生成内容初稿         | PBI-QP-001,005,009,010 | Partial   | R1 生成已部分验证             |
| A07  | 编辑与质量控制       | PBI-QP-001,005,009     | Candidate | 编辑器待增强                  |
| A08  | 排版与视觉优化       | PBI-QP-001,006         | Partial   | R1 样式系统                   |
| A09  | 平台适配与发布       | PBI-QP-006,010         | Partial   | 公众号复制主链路              |
| A10  | 沉淀内容资产         | PBI-QP-004,007,010     | Candidate |                               |
| A11  | 复盘与反馈迭代       | PBI-QP-003,004,008     | Candidate | M11 完整范围 · 优先级靠后     |

**覆盖结论：** A01–A11 均有 PBI 支撑；A05–A09 与 Release 1 有部分 Evidence；A01–A04、A10–A11 主要为 Candidate。

---

## 5. Story Map Slice 1–7 覆盖

| Slice | 名称               | 支撑 PBI               | R2 相关          |
| ----- | ------------------ | ---------------------- | ---------------- |
| 1     | 单篇公众号可用闭环 | PBI-QP-005,006         | 增强候选         |
| 2     | 品牌驱动内容生产   | PBI-QP-001,005,006     | **最小闭环候选** |
| 3     | 灵感到选题到成稿   | PBI-QP-002,003,005,006 | **核心候选**     |
| 4     | 高表现拆解与再创作 | PBI-QP-002,005,009     | 条件触发         |
| 5     | 持续内容运营       | PBI-QP-001~007,010     | 长期方向         |
| 6     | 内容资产复用       | PBI-QP-004,007,010     | R2/R3 候选       |
| 7     | 复盘反馈驱动下一轮 | PBI-QP-003,004,008     | 轻量候选         |

---

## 6. 产品模块 M01–M11 覆盖

| 模块 | 名称               | 支撑 PBI            | 用户任务来源 |
| ---- | ------------------ | ------------------- | ------------ |
| M01  | 品牌与知识中心     | 001,005,007,009     | A01,A05–A07  |
| M02  | 灵感中心           | 002,003,005,008,009 | A02,A03      |
| M03  | 内容计划           | 002,003,004,008     | A03,A04,A11  |
| M04  | 内容创作中心       | 004,005,010         | A04,A06      |
| M05  | 编辑与质量控制     | 005,009             | A07          |
| M06  | 排版与视觉中心     | 006                 | A08          |
| M07  | 平台适配发布分发   | 006,010             | A09          |
| M08  | 内容资产中心       | 001,004,007,009,010 | A10          |
| M09  | 数据分析与复盘     | 003,004,007,008     | A11          |
| M10  | 工作空间与协作     | 001                 | A01          |
| M11  | 受众洞察与互动运营 | 002,004,008         | A02,A04,A11  |

**覆盖结论：** M01–M11 均有 PBI 与用户活动来源；M06/M07 与 Release 1 有工程 Evidence。

---

## 7. 产品假设 H01–H10 覆盖

| 假设 | 摘要                    | 支撑 PBI         | 成功/失败指标来源 |
| ---- | ----------------------- | ---------------- | ----------------- |
| H01  | PO 自己愿意持续使用     | 全部 PBI（整体） | 使用频率          |
| H02  | 品牌资料提升贴合度      | 001,005          | 成稿质量          |
| H03  | 灵感→选题减少「写什么」 | 002,003          | 闭环完成          |
| H04  | AI+编辑省时             | 005              | 效率              |
| H05  | 排版达可发布标准        | 001,006          | 成稿质量          |
| H06  | Preview/Copy 是留存前提 | 006              | 复制稳定性        |
| H07  | 资产沉淀提升复用        | 001,004,007,010  | 资产复用          |
| H08  | 轻量复盘影响计划        | 003,004,008      | 复盘反馈          |
| H09  | 高表现拆解提高吸引力    | 002,005,009      | 商业潜力/风险控制 |
| H10  | 只做单篇长期价值不足    | 003,004,007,010  | 内容连续性        |

---

## 8. Release 2 最小成功闭环候选覆盖（非承诺）

最小闭环路径（来自 user-story-map.md）：

```text
品牌资料 → 灵感记录 → 选题 → 创作任务 → 文章生成 → 编辑优化
→ 公众号排版 → 复制发布 → 内容资产保存 → 手动复盘
```

| 闭环步骤  | 用户活动 | 主要 PBI       | R1 Evidence       | 缺口         |
| --------- | -------- | -------------- | ----------------- | ------------ |
| 品牌资料  | A01      | PBI-QP-001     | 无                | 待 R2 建设   |
| 灵感记录  | A02      | PBI-QP-002     | 无                | 待 R2 建设   |
| 选题/任务 | A03,A05  | PBI-QP-003     | 无                | 待 R2 建设   |
| 生成/编辑 | A06,A07  | PBI-QP-005     | 部分（S6 生成）   | 编辑增强     |
| 排版/复制 | A08,A09  | PBI-QP-006     | 部分（样式/Copy） | 品牌驱动增强 |
| 资产/复盘 | A10,A11  | PBI-QP-007,008 | 无                | 轻量版候选   |

> **S12-STORY-008** 已形成 Release 2 候选 Must/Should/Could/Won't — 见 [`releases/release-2/plan.md`](releases/release-2/plan.md)。Release 2 **尚未启动**。

---

## 9. 覆盖缺口与后续输入

| 缺口                        | 后续 Story                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| Release 1 能力 → PBI 映射   | **S12-STORY-007 Done** · [`release-1-capability-coverage.md`](release-1-capability-coverage.md) |
| DoR/DoD 与 Backlog 字段模板 | S12-STORY-006                                                                                   |
| Release 2 Must/Should 范围  | [`releases/release-2/plan.md`](releases/release-2/plan.md)（S12-STORY-008 · DECISION-123）      |
| PBI → 开发 Story 细拆       | 后续开发 Sprint · 非本 Story                                                                    |

---

## 10. Release 1 覆盖摘要（S12-STORY-007）

> 详细映射见 [`release-1-capability-coverage.md`](release-1-capability-coverage.md) · **DECISION-122**

**R1 最强覆盖：** PBI-QP-005（Partial）· PBI-QP-006（Partial / Strongest）

**R1 主要缺口：** PBI-QP-001~004、007~008（No/Gap）· PBI-QP-009（Candidate · 无 R1 Coverage）· PBI-QP-010（Minimal）

**用户活动：** A05–A09 Partial；A01–A04、A10–A11 Gap

**结论：** R1 不等于完整 AI 内容营销工作台；主要贡献为单篇公众号生成、排版、复制一致性、样式治理和上线基础。

---

## 相关文档

- [Backlog 追踪模型](backlog-tracking-model.md)
- [Product Backlog](product-backlog.md)
- [User Story Map](../product/user-story-map.md)
- [产品成功模型](../product/product-success-model.md)
