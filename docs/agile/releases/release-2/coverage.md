---
releaseId: release-2
planningStatus: Candidate
releaseStatus: Planned / Not Started
associatedStory: S12-STORY-008
associatedDecision: DECISION-123
---

# Release 2 Coverage

> **文档角色：** Release 2 候选 Backlog → 产品治理体系覆盖映射**当前生效事实源**（S12-STORY-008 · **DECISION-123**）。
>
> **Plan：** [`plan.md`](plan.md) · **Backlog：** [`backlog.md`](backlog.md)

**覆盖原则：**

- R2 **重点覆盖** PBI-QP-001 ~ 008
- **PBI-QP-009** 条件触发（Could）
- **PBI-QP-010** 后置（Could）
- R2 **继承** R1 的 PBI-QP-005 / 006 能力
- R2 **补齐** R1 缺失的品牌、灵感、选题、资产、复盘闭环

---

## 1. R2 Backlog → 治理体系总表

| R2 Item       | PBI            | 用户活动    | Slice | 模块    | 假设    | R1 状态         | R2 动作      |
| ------------- | -------------- | ----------- | ----- | ------- | ------- | --------------- | ------------ |
| R2-MUST-001   | PBI-QP-005     | A05,A06     | 1     | M04     | H04     | R1 Partial      | 保留简单入口 |
| R2-MUST-002   | PBI-QP-001     | A01         | 2     | M01,M10 | H02     | R1 Gap          | 新建         |
| R2-MUST-003   | PBI-QP-001,005 | A01,A05,A06 | 2     | M01,M04 | H02,H04 | R1 Gap          | 增强生成     |
| R2-MUST-004   | PBI-QP-002     | A02         | 3     | M02     | H03     | R1 Gap          | 新建         |
| R2-MUST-005   | PBI-QP-003     | A03         | 3     | M03     | H03     | R1 Gap          | 新建         |
| R2-MUST-006   | PBI-QP-003,005 | A03,A05     | 3     | M03,M04 | H03,H04 | R1 Gap          | 新建         |
| R2-MUST-007   | PBI-QP-006     | A08,A09     | 1     | M06,M07 | H05,H06 | R1 Strongest    | 继承复用     |
| R2-MUST-008   | PBI-QP-007     | A10         | 6     | M08     | H07     | R1 Gap          | 新建         |
| R2-MUST-009   | PBI-QP-008     | A11         | 7     | M09     | H08     | R1 Gap          | 新建         |
| R2-MUST-010   | PBI-QP-005     | A05,A06     | 1,2   | M04     | H04     | R1 Partial      | 双入口       |
| R2-SHOULD-001 | PBI-QP-002,003 | A02,A03     | 3     | M02,M03 | H03     | —               | 增强         |
| R2-SHOULD-002 | PBI-QP-003,005 | A03,A06     | 3     | M03,M04 | H04     | —               | 增强         |
| R2-SHOULD-003 | PBI-QP-008,003 | A11,A03     | 7,3   | M09,M03 | H08     | —               | 增强         |
| R2-SHOULD-004 | PBI-QP-001,006 | A01,A08     | 2     | M01,M06 | H02,H05 | R1 Partial(M06) | 增强         |
| R2-COULD-001  | PBI-QP-009     | A02,A05     | 4     | M02,M04 | H09     | R1 No Coverage  | 条件触发实验 |
| R2-COULD-002  | PBI-QP-007     | A10         | 6     | M08     | H07     | —               | 增强         |
| R2-COULD-003  | PBI-QP-010     | A06,A09     | 5     | M07,M04 | H07     | R1 Minimal      | 雏形         |

---

## 2. PBI-QP-001 ~ 010 R2 覆盖

| PBI        | R2 覆盖   | 成功指标关联       | 失败信号关联  | R1 Evidence / 缺口         |
| ---------- | --------- | ------------------ | ------------- | -------------------------- |
| PBI-QP-001 | **Must**  | 成稿质量、品牌贴合 | 品牌不贴合    | R1 Gap → R2 品牌资料       |
| PBI-QP-002 | **Must**  | 闭环完成           | 不知道写什么  | R1 Gap → R2 灵感记录       |
| PBI-QP-003 | **Must**  | 闭环完成、连续性   | 无法持续规划  | R1 Gap → R2 选题池（轻量） |
| PBI-QP-004 | **后置**  | 内容连续性         | 只能单篇      | R1 Gap → R3+ 候选          |
| PBI-QP-005 | **Must**  | 效率、成稿质量     | 只能单篇生成  | R1 Partial → R2 增强       |
| PBI-QP-006 | **Must**  | 复制稳定性         | 复制失真      | R1 Strongest → 继承        |
| PBI-QP-007 | **Must**  | 资产复用           | 资产不能复用  | R1 Gap → R2 轻量资产库     |
| PBI-QP-008 | **Must**  | 复盘反馈           | 无复盘闭环    | R1 Gap → R2 手动复盘       |
| PBI-QP-009 | **Could** | 商业潜力、风险     | 洗稿/侵权风险 | 条件触发 · 不自动 P0       |
| PBI-QP-010 | **后置**  | 内容连续性         | —             | R1 Minimal → Could 雏形    |

---

## 3. 用户活动 A01–A11 R2 覆盖

| 活动 | 名称                 | R1      | R2 目标    | 主要 R2 Item              |
| ---- | -------------------- | ------- | ---------- | ------------------------- |
| A01  | 建立品牌与内容基础   | Gap     | **Must**   | R2-MUST-002,003,010       |
| A02  | 收集灵感与外部信号   | Gap     | **Must**   | R2-MUST-004               |
| A03  | 形成选题与内容计划   | Gap     | **Must**   | R2-MUST-005,006           |
| A04  | 持续内容运营与系列化 | Gap     | **后置**   | Won't / R3+               |
| A05  | 准备单篇创作任务     | Partial | **Must**   | R2-MUST-001,006,010       |
| A06  | 生成内容初稿         | Partial | **Must**   | R2-MUST-001,003           |
| A07  | 编辑与质量控制       | Partial | **Should** | 继承 R1 + 后续增强        |
| A08  | 排版与视觉优化       | Partial | **Must**   | R2-MUST-007（继承 R1）    |
| A09  | 平台适配与发布       | Partial | **Must**   | R2-MUST-007（公众号复制） |
| A10  | 沉淀内容资产         | Gap     | **Must**   | R2-MUST-008               |
| A11  | 复盘与反馈迭代       | Gap     | **Must**   | R2-MUST-009               |

---

## 4. Story Map Slice R2 覆盖

| Slice | 名称               | R1      | R2 目标                      |
| ----- | ------------------ | ------- | ---------------------------- |
| 1     | 单篇公众号可用闭环 | Partial | **Must** — 双入口 + 继承 R1  |
| 2     | 品牌驱动内容生产   | Gap     | **Must** — 品牌资料 + 上下文 |
| 3     | 灵感到选题到成稿   | Gap     | **Must** — 灵感/选题/任务    |
| 4     | 高表现拆解与再创作 | Gap     | **Could** — 条件触发         |
| 5     | 持续内容运营       | Gap     | **后置** — 不在 R2 Must      |
| 6     | 内容资产复用       | Gap     | **Must** — 轻量资产保存      |
| 7     | 复盘反馈驱动下一轮 | Gap     | **Must** — 手动复盘          |

---

## 5. 产品模块 M01–M11 R2 覆盖

| 模块 | 名称               | R1      | R2 目标    | 主要 R2 Item        |
| ---- | ------------------ | ------- | ---------- | ------------------- |
| M01  | 品牌与知识中心     | Gap     | **Must**   | R2-MUST-002,003     |
| M02  | 灵感中心           | Gap     | **Must**   | R2-MUST-004         |
| M03  | 内容计划           | Gap     | **Must**   | R2-MUST-005,006     |
| M04  | 内容创作中心       | Partial | **Must**   | R2-MUST-001,003,006 |
| M05  | 编辑与质量控制     | Partial | **Should** | 继承 R1             |
| M06  | 排版与视觉中心     | Strong  | **Must**   | R2-MUST-007 继承    |
| M07  | 平台适配发布分发   | Partial | **Must**   | R2-MUST-007 公众号  |
| M08  | 内容资产中心       | Gap     | **Must**   | R2-MUST-008         |
| M09  | 数据分析与复盘     | Gap     | **Must**   | R2-MUST-009         |
| M10  | 工作空间与协作     | Partial | **Must**   | 项目/品牌工作台     |
| M11  | 受众洞察与互动运营 | Gap     | **后置**   | Won't / R3+         |

---

## 6. 假设 H01–H10 R2 验证计划

| 假设 | R2 验证重点                                | 关联 R2 Item     |
| ---- | ------------------------------------------ | ---------------- |
| H01  | PO + 鲁老师 + 秒篇 AIPPT 是否持续使用      | 全 Must 闭环     |
| H02  | 品牌资料是否提升贴合度                     | R2-MUST-002,003  |
| H03  | 灵感→选题是否减少「不知道写什么」          | R2-MUST-004,005  |
| H04  | AI+编辑是否省时                            | R2-MUST-001,003  |
| H05  | 排版是否达可发布标准                       | R2-MUST-007 继承 |
| H06  | Preview/Copy 一致性是否保持                | R2-MUST-007 继承 |
| H07  | 资产沉淀是否提升复用                       | R2-MUST-008      |
| H08  | 手动复盘是否影响下一轮计划                 | R2-MUST-009      |
| H09  | 高表现拆解是否有吸引力（Could · 条件触发） | R2-COULD-001     |
| H10  | 最小闭环是否证明长期价值优于单篇           | 全 Must 闭环     |

---

## 7. R1 可复用 Evidence 与 R2 缺口对照

| R1 能力组   | R1 状态               | R2 策略              |
| ----------- | --------------------- | -------------------- |
| R1-CAP-001  | Foundation            | 继承 Schema          |
| R1-CAP-002  | Foundation            | 继承样式系统         |
| R1-CAP-003  | Partial Product       | 继承 Renderer        |
| R1-CAP-004  | Partial Product       | 增强品牌上下文       |
| R1-CAP-005  | Manual Flow           | 双入口 + 工作台      |
| R1-CAP-006  | Quality System        | 继续依赖 Paste QA    |
| R1-CAP-007  | Operations Foundation | 继承 Style Admin     |
| R1-CAP-008  | Done with follow-ups  | 继续 Prelaunch 环境  |
| **R2 缺口** | —                     | M01–M03,M08–M09 新建 |

详见 [`../../release-1-capability-coverage.md`](../../release-1-capability-coverage.md)。

---

## 相关文档

- [Release 2 Plan](plan.md)
- [Release 2 Backlog](backlog.md)
- [Product Coverage Matrix](../../product-coverage-matrix.md)
- [Release 1 Capability Coverage](../../release-1-capability-coverage.md)
