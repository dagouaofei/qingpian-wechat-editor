# Release 1 能力覆盖映射

> **文档角色：** Release 1 历史能力 → 当前产品治理体系的覆盖映射**当前生效事实源**（S12-STORY-007 · **DECISION-122**）。
>
> **配套文档：** [`product-coverage-matrix.md`](product-coverage-matrix.md) · [`backlog-tracking-model.md`](backlog-tracking-model.md) · [`product-backlog.md`](product-backlog.md)

**本文件：**

- **不关闭** Release 1；
- **不决定** Release 2 最终范围；
- **不重写**已关闭 Sprint / Story 历史事实；
- 仅建立 R1 → 当前治理体系的映射与 R2 规划输入。

---

## 1. 映射总流程

```text
Release 1 Evidence
→ Capability Group（R1-CAP-001 ~ 008）
→ User Activity（A01–A11）
→ Story Map Slice（1–7）
→ Product Module（M01–M11）
→ Product Backlog Item（PBI-QP-001 ~ 010）
→ Hypothesis / Success Metric / Failure Signal
→ Coverage Status
→ R2 Planning Input（供 S12-STORY-008）
```

---

## 2. Coverage Status 分级

| 状态                                     | 含义                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| **R1-Done / Foundation**                 | 底层契约或架构完成，不等于用户完整能力                       |
| **R1-Done / Partial Product Capability** | 用户能使用部分流程，仍缺品牌、灵感、计划、资产、复盘等上下游 |
| **R1-Done / Quality System**             | 质量保障体系完成，不等于新增用户功能                         |
| **R1-Done / Operations Foundation**      | 部署 / 后台 / 运维基础完成，不等于产品价值闭环               |
| **R1-Done with follow-ups**              | 已验收但遗留仍 Open                                          |
| **Candidate Gap**                        | 进入 S12-STORY-008 的候选缺口                                |
| **Deferred Debt**                        | 进入技术债或后续治理 Backlog                                 |

---

## 3. Release 1 能力组映射

### R1-CAP-001 Article / Block Schema 与结构化内容基础

| 字段                   | 内容                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **能力说明**           | Article Schema · Block Schema · InlineContent · 结构化文章数据归一                                                    |
| **历史来源**           | Sprint 2 Closed（**DECISION-054**）· EPIC-003 · TECH-ARCH-002/006                                                     |
| **Evidence**           | [`sprint-plan.md`](sprint-plan.md) Sprint 2 · [`product-backlog.md`](product-backlog.md) EPIC-003 · merge `release/1` |
| **用户活动**           | A05、A06、A07                                                                                                         |
| **Story Map Slice**    | 1、2、3（部分）                                                                                                       |
| **产品模块**           | M04 内容创作中心 · M05 编辑与质量控制                                                                                 |
| **PBI**                | **PBI-QP-005**（Partial）                                                                                             |
| **产品假设**           | H04（AI+编辑省时）                                                                                                    |
| **成功指标**           | 成稿质量 · 效率                                                                                                       |
| **失败信号**           | 只能单篇生成 · 编辑体验不足                                                                                           |
| **覆盖状态**           | **R1-Done / Foundation**                                                                                              |
| **可复用基础**         | 统一 Article / Block 契约；所有生成与渲染共享同一数据模型                                                             |
| **缺口 / 债务**        | 块级富编辑、拖拽、历史文章管理未建；A07 编辑器增强为 Candidate Gap                                                    |
| **S12-STORY-008 输入** | R2 可在 R1 Schema 上扩展编辑与质量控制，无需重建数据模型                                                              |

---

### R1-CAP-002 Style System、Variant Registry 与样式选择基础

| 字段                   | 内容                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **能力说明**           | StyleDefinition · Variant Registry · StyleResolver · StyleSelection Validation · StyleOrchestrator · VisualAssetRegistry |
| **历史来源**           | Sprint 3-A/B/C Closed（**DECISION-057/059/065**）· EPIC-004 · TECH-ARCH-003~011/017/018                                  |
| **Evidence**           | [`sprint-plan.md`](sprint-plan.md) Sprint 3 章节 · [`product-backlog.md`](product-backlog.md) TECH-ARCH-003~020          |
| **用户活动**           | A08                                                                                                                      |
| **Story Map Slice**    | 1、2（部分）                                                                                                             |
| **产品模块**           | M06 排版与视觉中心                                                                                                       |
| **PBI**                | **PBI-QP-006**（Partial）                                                                                                |
| **产品假设**           | H05、H06                                                                                                                 |
| **成功指标**           | 成稿质量 · 复制稳定性                                                                                                    |
| **失败信号**           | 样式不贴合品牌 · 复制失真                                                                                                |
| **覆盖状态**           | **R1-Done / Foundation**                                                                                                 |
| **可复用基础**         | theme / preset / variant / registry / assignment / orchestrator 全链路                                                   |
| **缺口 / 债务**        | 不等于品牌视觉系统（M01）；品牌驱动样式选择待 R2；Compat Recalibration 为 Deferred Debt（原 S10-012 顺延）               |
| **S12-STORY-008 输入** | R2 品牌资料 → 样式推荐需复用本底座，而非重建样式系统                                                                     |

---

### R1-CAP-003 Preview Renderer 与 Copy Renderer

| 字段                   | 内容                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **能力说明**           | Preview Renderer · Copy Renderer · structured block rendering · 微信兼容 HTML 输出              |
| **历史来源**           | Sprint 4-A/B Closed（**DECISION-061/063**）· EPIC-005/006 · PB-R1-03/04/05                      |
| **Evidence**           | [`product-backlog.md`](product-backlog.md) TECH-ARCH-021 · DECISION-061/063                     |
| **用户活动**           | A08、A09                                                                                        |
| **Story Map Slice**    | 1、2、3（部分）                                                                                 |
| **产品模块**           | M06 · M07 平台适配发布分发                                                                      |
| **PBI**                | **PBI-QP-006**（Partial / Strongest R1 Coverage）                                               |
| **产品假设**           | H05、H06                                                                                        |
| **成功指标**           | 复制稳定性 · 成稿质量                                                                           |
| **失败信号**           | 复制到公众号后样式丢失                                                                          |
| **覆盖状态**           | **R1-Done / Partial Product Capability**                                                        |
| **可复用基础**         | Preview / Copy 共享样式定义；text-first + structured blocks 双路径渲染                          |
| **缺口 / 债务**        | 不等于完整发布分发系统；多平台适配（PBI-QP-010）为 Candidate Gap；部分 block 视觉丰富度仍待增强 |
| **S12-STORY-008 输入** | R2 公众号闭环可复用 Renderer；多平台需新适配层                                                  |

---

### R1-CAP-004 AI Generation、真实模型与 SSE 主链路

| 字段                   | 内容                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **能力说明**           | Volcengine / Doubao provider · GenerationEvent · SSE block-aware stream · 输入 → 生成 → 预览                          |
| **历史来源**           | Sprint 5 Closed（**DECISION-069**）· Sprint 6（**DECISION-071/078**）· EPIC-002/007 · PB-R1-02/06 · TECH-ARCH-025/026 |
| **Evidence**           | [`product-backlog.md`](product-backlog.md) PB-R1-02/06 · DECISION-069/071/078 · S11-STORY-003A staging 验收           |
| **用户活动**           | A05、A06                                                                                                              |
| **Story Map Slice**    | 1、2、3（部分）                                                                                                       |
| **产品模块**           | M04 · M05                                                                                                             |
| **PBI**                | **PBI-QP-005**（Partial）                                                                                             |
| **产品假设**           | H04                                                                                                                   |
| **成功指标**           | 效率 · 成稿质量                                                                                                       |
| **失败信号**           | 生成质量不稳定 · 品牌不贴合（缺 M01 输入）                                                                            |
| **覆盖状态**           | **R1-Done / Partial Product Capability**                                                                              |
| **可复用基础**         | 真实 AI provider 集成 · SSE 流式展示 · 结构化输出归一 Article                                                         |
| **缺口 / 债务**        | 品牌资料驱动生成未建；块级重生成有限；不等于内容运营工作台                                                            |
| **S12-STORY-008 输入** | R2 生成链路可复用 provider + SSE；需叠加品牌 / 灵感 / 计划上下文                                                      |

---

### R1-CAP-005 用户可见主链路

| 字段                   | 内容                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **能力说明**           | 首页输入 · 预览页 · 生成反馈 · 风格 / 配色选择 · 复制到公众号                                                                        |
| **历史来源**           | Sprint 5/6/7 · PB-R1-01~08 · **DECISION-078**（Sprint 6 Closed）· Sprint 7 样式丰富度（**DECISION-081~087**）                        |
| **Evidence**           | [`release-1-scope.md`](../product/release-1-scope.md) 主链路 · [`product-backlog.md`](product-backlog.md) PB-R1-01~08 · DECISION-078 |
| **用户活动**           | A05、A06、A08、A09                                                                                                                   |
| **Story Map Slice**    | 1（最强）、2（部分）                                                                                                                 |
| **产品模块**           | M04、M05、M06、M07                                                                                                                   |
| **PBI**                | **PBI-QP-005**、**PBI-QP-006**                                                                                                       |
| **产品假设**           | H04、H05、H06                                                                                                                        |
| **成功指标**           | 闭环完成 · 效率 · 复制稳定性                                                                                                         |
| **失败信号**           | 只能单篇生成 · 无法持续规划                                                                                                          |
| **覆盖状态**           | **R1-Done / Manual Flow**（归类为 **R1-Done / Partial Product Capability**）                                                         |
| **可复用基础**         | `/` → 生成 → `/preview` → 风格切换 → 复制 手动闭环已跑通                                                                             |
| **缺口 / 债务**        | 无品牌中心、灵感中心、内容计划、资产库、复盘；单篇手动流程不等于工作台                                                               |
| **S12-STORY-008 输入** | R2 最小闭环候选：在 R1 手动流程上叠加 A01–A04、A10–A11 能力                                                                          |

**PB-R1 → PBI 关系：**

| PB-R1    | 名称摘要             | 对应 PBI   | Sprint 6 Evidence |
| -------- | -------------------- | ---------- | ----------------- |
| PB-R1-01 | 用户输入需求         | PBI-QP-005 | S6-STORY-002      |
| PB-R1-02 | 真实 AI 生成 Article | PBI-QP-005 | S6-STORY-003      |
| PB-R1-03 | 公众号预览           | PBI-QP-006 | S6-STORY-004      |
| PB-R1-04 | 样式应用到整篇       | PBI-QP-006 | S6-STORY-004      |
| PB-R1-05 | 复制到公众号         | PBI-QP-006 | S6-STORY-006      |
| PB-R1-06 | 生成过程反馈         | PBI-QP-005 | S6-STORY-005      |
| PB-R1-07 | 风格与配色切换       | PBI-QP-006 | S6-STORY-006      |
| PB-R1-08 | 粘贴保真最小 QA      | PBI-QP-006 | S6-STORY-006      |

**EPIC-001 ~ EPIC-010 与 PBI 关系：**

| Epic     | R1 交付状态 | 主要对应 PBI |
| -------- | ----------- | ------------ |
| EPIC-001 | Done        | PBI-QP-005   |
| EPIC-002 | Done        | PBI-QP-005   |
| EPIC-003 | Done        | PBI-QP-005   |
| EPIC-004 | Done        | PBI-QP-006   |
| EPIC-005 | Done        | PBI-QP-006   |
| EPIC-006 | Done        | PBI-QP-006   |
| EPIC-007 | Done        | PBI-QP-005   |
| EPIC-008 | Partial     | PBI-QP-005   |
| EPIC-009 | Partial     | PBI-QP-005   |
| EPIC-010 | Done        | PBI-QP-006   |

---

### R1-CAP-006 WeChat-safe CSS Contract 与 Paste QA 体系

| 字段                   | 内容                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **能力说明**           | WeChat-safe CSS Contract · Compatibility Profile · Copy Validator · Fidelity Matrix · Paste QA · Drift Diagnostics          |
| **历史来源**           | Sprint 8 Closed（**DECISION-093**）· **DECISION-089/090** · EPIC-006/010                                                    |
| **Evidence**           | [`sprint8-wechat-safe-css-contract.md`](sprint8-wechat-safe-css-contract.md) · DECISION-093 · merge `release/1` @ `806fa47` |
| **用户活动**           | A08、A09                                                                                                                    |
| **Story Map Slice**    | 1、2（部分）                                                                                                                |
| **产品模块**           | M06 · M07                                                                                                                   |
| **PBI**                | **PBI-QP-006**                                                                                                              |
| **产品假设**           | H05、H06                                                                                                                    |
| **成功指标**           | 复制稳定性                                                                                                                  |
| **失败信号**           | 复制到公众号后样式丢失                                                                                                      |
| **覆盖状态**           | **R1-Done / Quality System**                                                                                                |
| **可复用基础**         | Contract v1 · Validator · Fidelity 测试体系 · 已知债务登记                                                                  |
| **缺口 / 债务**        | Compat Spec Recalibration 顺延 Sprint 12+（Deferred Debt）；Yellow/Red 规则待重校准                                         |
| **S12-STORY-008 输入** | R2 复制一致性须继续依赖本质量体系；Compat 债务不阻塞 R2 规划但须登记                                                        |

---

### R1-CAP-007 Style Management System v0 / v1

| 字段                   | 内容                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **能力说明**           | Style Library v0 · Style Admin v1 · DB-backed style management · variant lifecycle · userSelectable · HTML Harvest · Promote / Rollback |
| **历史来源**           | Sprint 9 Closed（**DECISION-106**）· Sprint 10 Closed（**DECISION-108/111**）· EPIC-004 运营扩展                                        |
| **Evidence**           | [`sprint9-style-management-system-v0.md`](sprint9-style-management-system-v0.md) · [`release-plan.md`](release-plan.md) Sprint 10       |
| **用户活动**           | A08、A09（运营侧）                                                                                                                      |
| **Story Map Slice**    | 1、2（部分）                                                                                                                            |
| **产品模块**           | M06 · M07 · M10 工作空间与协作（运营后台）                                                                                              |
| **PBI**                | **PBI-QP-006**（运营支撑）                                                                                                              |
| **产品假设**           | H05、H06                                                                                                                                |
| **成功指标**           | 复制稳定性 · 样式可运营                                                                                                                 |
| **失败信号**           | 样式不可管理 · 用户侧样式池不足                                                                                                         |
| **覆盖状态**           | **R1-Done / Operations Foundation**                                                                                                     |
| **可复用基础**         | file-backed v0 → DB-backed v1 演进；Harvest / Promote / userSelectable 全链路                                                           |
| **缺口 / 债务**        | 不等于内容资产管理（M08）；HTML Harvest 不等于 PBI-QP-009 内容拆解再创作；DSL Runtime Cleanup 为 Deferred Debt                          |
| **S12-STORY-008 输入** | R2 样式运营可复用 Admin v1；内容拆解须单独规划并治理风险                                                                                |

---

### R1-CAP-008 Production Prelaunch / Ops 基础

| 字段                   | 内容                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **能力说明**           | staging · production prelaunch · ECS / Nginx / DB · Basic Auth / noindex · rollback · observe                               |
| **历史来源**           | Sprint 11 **Accepted with follow-ups / Closed**（**DECISION-114**）· production @ `paiban.aiqingpian.cn` Prelaunch          |
| **Evidence**           | [`sprint11-production-ops-go-live.md`](sprint11-production-ops-go-live.md) · [`sprint11-closeout.md`](sprint11-closeout.md) |
| **用户活动**           | N/A（治理 / 运维）                                                                                                          |
| **Story Map Slice**    | N/A                                                                                                                         |
| **产品模块**           | M10（运维支撑）· Operations                                                                                                 |
| **PBI**                | N/A（Governance / Operations）                                                                                              |
| **产品假设**           | H01 间接支撑（可用性前提）                                                                                                  |
| **成功指标**           | 使用频率（基础设施可用）                                                                                                    |
| **失败信号**           | 服务不可用阻碍 PO 使用                                                                                                      |
| **覆盖状态**           | **R1-Done with follow-ups**                                                                                                 |
| **可复用基础**         | staging / production 部署 runbook · 回滚 · 观测脚本 · admin 公网验收                                                        |
| **缺口 / 债务**        | OSS/SLS/CloudMonitor follow-ups（P1-S11-004 等）；**不等于 Release 1 关闭或公开上线**                                       |
| **S12-STORY-008 输入** | R2 开发须基于已部署环境；运维 follow-up 不进 R2 产品范围除非 PO 决策                                                        |

---

## 4. PBI 覆盖表

| PBI                                 | Release 1 覆盖判断                  | 说明                                                | Evidence 依据                                     |
| ----------------------------------- | ----------------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| PBI-QP-001 品牌与知识基础           | **No / Gap**                        | R1 基本未建设品牌知识中心                           | 无 M01 产品实现 · DECISION-117 后才有产品定义     |
| PBI-QP-002 灵感收集与外部信号       | **No / Gap**                        | R1 基本未建设灵感中心                               | 无 M02 产品实现                                   |
| PBI-QP-003 选题与内容计划           | **No / Gap**                        | R1 基本未建设内容计划                               | 无 M03 产品实现                                   |
| PBI-QP-004 持续内容运营与系列化生产 | **No / Gap**                        | R1 偏单篇链路，不支持持续运营                       | H10 失败信号仍成立                                |
| PBI-QP-005 单篇文章生成与编辑       | **Partial**                         | R1 有生成主链路，编辑与质量控制仍有限               | S5–S7 · PB-R1-01/02/06 · EPIC-001/002/007         |
| PBI-QP-006 公众号排版与复制一致性   | **Partial / Strongest R1 Coverage** | R1 最强覆盖项，仍有 Compat / 视觉 follow-ups        | S3–S8 · PB-R1-03~08 · DECISION-093                |
| PBI-QP-007 内容资产沉淀与复用       | **No / Gap**                        | R1 未形成正式内容资产中心                           | 无 M08 实现                                       |
| PBI-QP-008 轻量复盘与反馈迭代       | **No / Gap**                        | R1 未形成复盘闭环                                   | 无 M09 轻量复盘                                   |
| PBI-QP-009 高表现内容拆解与再创作   | **Candidate / No R1 Coverage**      | R1 有 HTML Harvest 与样式采集，但不是内容拆解再创作 | S9 HTML Harvest ≠ PBI-QP-009 · 条件触发须 PO 确认 |
| PBI-QP-010 多平台适配与改编         | **Minimal / Gap**                   | R1 聚焦公众号，非多平台                             | M07 仅公众号复制                                  |

---

## 5. 用户活动 A01–A11 覆盖摘要

| 活动 | 名称                 | R1 覆盖     | 主要 R1 Evidence              | R2 缺口输入       |
| ---- | -------------------- | ----------- | ----------------------------- | ----------------- |
| A01  | 建立品牌与内容基础   | **Gap**     | 无                            | Candidate Gap     |
| A02  | 收集灵感与外部信号   | **Gap**     | 无                            | Candidate Gap     |
| A03  | 形成选题与内容计划   | **Gap**     | 无                            | Candidate Gap     |
| A04  | 持续内容运营与系列化 | **Gap**     | 无                            | Candidate Gap     |
| A05  | 准备单篇创作任务     | **Partial** | PB-R1-01 · 主题/资料/草稿输入 | 需品牌/计划上下文 |
| A06  | 生成内容初稿         | **Partial** | PB-R1-02 · SSE 生成           | 需品牌驱动增强    |
| A07  | 编辑与质量控制       | **Partial** | Schema 有 · 编辑器有限        | Candidate Gap     |
| A08  | 排版与视觉优化       | **Partial** | S3–S7 样式系统 · PB-R1-04/07  | 需品牌视觉系统    |
| A09  | 平台适配与发布       | **Partial** | PB-R1-05 · Copy Renderer      | 公众号为主        |
| A10  | 沉淀内容资产         | **Gap**     | 无                            | Candidate Gap     |
| A11  | 复盘与反馈迭代       | **Gap**     | 无                            | Candidate Gap     |

---

## 6. Story Map Slice 覆盖摘要

| Slice | 名称               | R1 覆盖     | 说明                           |
| ----- | ------------------ | ----------- | ------------------------------ |
| 1     | 单篇公众号可用闭环 | **Partial** | R1 最强切片；手动流程可跑通    |
| 2     | 品牌驱动内容生产   | **Gap**     | 缺 M01 品牌资料输入            |
| 3     | 灵感到选题到成稿   | **Gap**     | 缺 M02/M03                     |
| 4     | 高表现拆解与再创作 | **Gap**     | Harvest ≠ 拆解再创作；条件触发 |
| 5     | 持续内容运营       | **Gap**     | 单篇链路不支持                 |
| 6     | 内容资产复用       | **Gap**     | 无 M08                         |
| 7     | 复盘反馈驱动下一轮 | **Gap**     | 无 M09 轻量复盘                |

---

## 7. 产品模块 M01–M11 覆盖摘要

| 模块 | 名称               | R1 覆盖     | 主要 Evidence              |
| ---- | ------------------ | ----------- | -------------------------- |
| M01  | 品牌与知识中心     | **Gap**     | 无产品实现                 |
| M02  | 灵感中心           | **Gap**     | 无产品实现                 |
| M03  | 内容计划           | **Gap**     | 无产品实现                 |
| M04  | 内容创作中心       | **Partial** | S5–S6 生成主链路           |
| M05  | 编辑与质量控制     | **Partial** | Schema 有 · 编辑器有限     |
| M06  | 排版与视觉中心     | **Strong**  | S3–S7 样式系统 · Renderer  |
| M07  | 平台适配发布分发   | **Partial** | Copy Renderer · 公众号复制 |
| M08  | 内容资产中心       | **Gap**     | 无正式内容库               |
| M09  | 数据分析与复盘     | **Gap**     | 无轻量复盘                 |
| M10  | 工作空间与协作     | **Partial** | Style Admin · Ops 后台     |
| M11  | 受众洞察与互动运营 | **Gap**     | 无实现                     |

---

## 8. 产品假设 H01–H10 与 R1 Evidence

| 假设 | R1 Evidence 程度   | 说明                                            |
| ---- | ------------------ | ----------------------------------------------- |
| H01  | **待验证**         | PO 持续使用待 R2 闭环验证                       |
| H02  | **无 R1 Evidence** | 缺品牌资料输入                                  |
| H03  | **无 R1 Evidence** | 缺灵感→选题闭环                                 |
| H04  | **部分验证**       | S6 真实 AI 生成省时 · 缺品牌上下文              |
| H05  | **部分验证**       | S7 样式丰富度 · 缺品牌驱动                      |
| H06  | **较强验证**       | S8 Paste QA · Copy Validator                    |
| H07  | **无 R1 Evidence** | 无资产沉淀                                      |
| H08  | **无 R1 Evidence** | 无复盘闭环                                      |
| H09  | **无 R1 Evidence** | Harvest 不等于拆解再创作                        |
| H10  | **R1 印证**        | 单篇链路完成但长期价值不足 — 支持 R2 工作台方向 |

---

## 9. 结论

### 9.1 Release 1 的实际产品重心

**Release 1 的主要贡献集中在「单篇公众号文章生成、排版、复制一致性、样式治理和上线基础」，而不是完整 AI 内容营销工作台。**

### 9.2 Release 1 最强可复用能力

- 结构化 Article / Block Schema
- AI 生成与 SSE 主链路（真实 provider）
- Preview / Copy Renderer
- WeChat-safe Contract / Validator / Paste QA
- Style Management Admin（v0 → v1）
- Production Prelaunch 运维基础

### 9.3 Release 2 的主要缺口输入（供 S12-STORY-008）

- 品牌与知识基础（M01 · PBI-QP-001）
- 灵感收集（M02 · PBI-QP-002）
- 选题与内容计划（M03 · PBI-QP-003）
- 持续内容运营（PBI-QP-004）
- 内容资产沉淀（M08 · PBI-QP-007）
- 轻量复盘（M09 · PBI-QP-008）
- 品牌驱动生成与排版（整合 R1 能力与新工作台体验）
- R1 能力与新工作台体验的整合

### 9.4 不应误判的内容

- R1 有文章生成，**不等于**有内容运营工作台；
- R1 有样式系统，**不等于**有品牌视觉系统；
- R1 有 Copy Fidelity，**不等于**有完整发布分发系统；
- R1 有 Style Admin，**不等于**有内容资产管理；
- R1 有 Production Prelaunch，**不等于** Release 1 已关闭或公开上线。

### 9.5 与 S12-STORY-008 的关系

```text
R1 已完成能力
→ 可复用基础
→ R2 缺口
→ R2 Must / Should / Could / Won't（由 S12-STORY-008 处理）
→ Release 2 Outcome Goal
→ R2 成功指标与失败信号
```

**S12-STORY-007 不直接做 Must / Should / Could / Won't；不决定 Release 2 最终范围。**

---

## 10. Sprint 历史 Evidence 索引

| Sprint   | 主题                       | 状态   | 关键 Decision        | 主要贡献能力组 |
| -------- | -------------------------- | ------ | -------------------- | -------------- |
| S2       | Article / Block Schema     | Closed | DECISION-054         | R1-CAP-001     |
| S3-A/B/C | Style System / Registry    | Closed | DECISION-057/059/065 | R1-CAP-002     |
| S4-A/B   | Preview / Copy Renderer    | Closed | DECISION-061/063     | R1-CAP-003     |
| S5       | Generation / UI Main Flow  | Closed | DECISION-069         | R1-CAP-004     |
| S6       | Visible AI Main Flow / SSE | Closed | DECISION-071/078     | R1-CAP-004/005 |
| S7       | WeChat Article Experience  | Closed | DECISION-081~087     | R1-CAP-002/005 |
| S8       | WeChat-safe CSS / Paste QA | Closed | DECISION-093         | R1-CAP-006     |
| S9       | Style Management v0        | Closed | DECISION-106         | R1-CAP-007     |
| S10      | DB-backed Style Admin v1   | Closed | DECISION-108/111     | R1-CAP-007     |
| S11      | Production Ops Go-Live     | Closed | DECISION-114         | R1-CAP-008     |

---

## 11. 遗留债务与 Follow-up 登记

| 类别                 | 描述                             | 状态           | 去向               |
| -------------------- | -------------------------------- | -------------- | ------------------ |
| Compat Recalibration | WeChat Compatibility Spec 重校准 | Deferred Debt  | Sprint 12+ 候选    |
| DSL Runtime Cleanup  | DSL 运行时清理                   | Deferred Debt  | Sprint 12+ 候选    |
| S11 follow-ups       | OSS/SLS/CloudMonitor · ECS cron  | Open follow-up | P1-S11-004 等      |
| 视觉丰富度           | 部分 block variant 待增强        | Candidate Gap  | S12-STORY-008 输入 |
| 编辑器增强           | 块级富编辑有限                   | Candidate Gap  | S12-STORY-008 输入 |

---

## 相关文档

- [Product Coverage Matrix](product-coverage-matrix.md)
- [Backlog 追踪模型](backlog-tracking-model.md)
- [Product Backlog](product-backlog.md)
- [Release 1 范围](../product/release-1-scope.md)
- [User Story Map](../product/user-story-map.md)
- [产品模块树](../product/product-module-tree.md)
- [产品成功模型](../product/product-success-model.md)
- [Release Plan](release-plan.md)
