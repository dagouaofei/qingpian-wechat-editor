# 轻篇敏捷 Operating Model

> **文档角色：** 轻篇从 Sprint 12 起向后生效的敏捷执行标准、事件、流程闸门与协作边界**当前生效事实源**（S12-STORY-006 · **DECISION-121**）。
>
> **标准模板：** [`templates/`](templates/) — DoR · DoD · Cursor 指令 · Execution Report · Review / Acceptance
>
> **上游：** [`backlog-tracking-model.md`](backlog-tracking-model.md)（S12-STORY-005 · DECISION-120）

---

## 1. Story 背景

**S12-STORY-006** 建立轻篇从 S12 起向后生效的敏捷执行标准，使 Sprint Planning、Backlog Refinement、Story 启动、Cursor 执行、Execution Report、ChatGPT 审查、Product Owner 验收、merge、Sprint Closeout、Release Closeout 都有统一模板和闸门。

### 1.1 本 Story 明确不做

- 不决定 Release 2 最终范围；
- 不修改产品代码；
- 不修改 `.cursor/rules/`（一致性审计留待 **S12-STORY-009**）；
- 不启动 S12-STORY-007；
- 不重写已关闭 Sprint / Release / Story 历史事实。

---

## 2. 敏捷执行总流程

```text
Product Backlog / Coverage Matrix
→ Backlog Refinement
→ Story DoR
→ Cursor 指令
→ Cursor 执行
→ Execution Report
→ ChatGPT Review
→ PO Acceptance
→ Merge Authorization
→ Evidence Sync
→ Next Story Ready Check
```

### 2.1 角色与权限边界

| 角色              | 可做什么                                  | 不可做什么（默认）                             |
| ----------------- | ----------------------------------------- | ---------------------------------------------- |
| **ChatGPT**       | 规划、拆分、生成 Cursor 指令、Review 建议 | 不等于 PO 批准；不等于 Story Done              |
| **Cursor**        | 执行单 Story 范围、提交 report、commit    | 自行 merge / push / 标记 Done / 启动下一 Story |
| **Product Owner** | 批准 Plan、验收 Story、授权 merge / push  | —                                              |

**必须明确：**

- ChatGPT 可以提出建议，但不等于 PO 批准；
- Cursor 可以完成实现，但不等于 Story Done；
- 测试通过不等于用户验收通过；
- merge 完成不等于 Sprint Closed；
- Sprint Closed 不等于 Release Closed。

---

## 3. 敏捷事件

### 3.1 Sprint Planning

Sprint Planning 至少包括：Sprint Goal · Committed Stories · Story 顺序 · 范围边界 · 明确非目标 · 依赖 · 风险 · 验收方式 · 容量或取舍 · Sprint 状态。

> **Sprint Plan 未 Approved 前，不得启动 Sprint 内产品开发 Story。**

### 3.2 Backlog Refinement

Backlog Refinement 用于整理 PBI、补齐追踪字段、拆分过大条目、识别依赖与风险、更新优先级建议、发现重复或过期条目。

**必须明确：**

- Backlog Refinement **不等于** Sprint Planning；
- Backlog Refinement **不等于** PO 已批准；
- Backlog Refinement **不得**直接把 Candidate 变成 Committed；
- Backlog Refinement **不得**自动决定 Release 2 范围；
- Backlog Refinement 只能形成**建议、候选拆分、风险和待 PO 决策项**。

**输出至少包括：** PBI 字段补齐情况 · 候选拆分建议 · 优先级建议 · 依赖与风险 · 需要 PO 决策的问题 · 是否影响 Release / Sprint Plan · 是否需要进入 Change Control。

### 3.3 Story Ready Check / DoR

每个 Story 启动前必须完成 DoR（见 [`templates/story-dor-template.md`](templates/story-dor-template.md)）。

### 3.4 Cursor Execution

Cursor 执行时必须遵守：

- 只做本 Story 范围；
- 不顺带启动下一个 Story；
- 不自行改变产品决策；
- 不自行 merge / push；
- 遇到范围外、事实冲突、检查失败、需要 PO 决策时**停止**。

### 3.5 Execution Report

Cursor 执行完成后必须提交 execution report（见 [`templates/execution-report-template.md`](templates/execution-report-template.md)）。

### 3.6 ChatGPT Review

ChatGPT Review 应审查：是否满足 AC · 是否越界 · 是否有未经授权 merge / push / next story · 是否有事实源冲突 · 检查结果是否可信 · 风险是否需要进入 Backlog · 是否建议 PO 验收。

**措辞与实质：**

- 不因 execution report 小型措辞问题阻塞验收；report-only 问题可记录，不循环追加 commit；
- 若检查证据、分支状态、事实源或范围边界存在**实质冲突**，必须指出并要求处理或由 PO 决策。

### 3.7 Product Owner Acceptance

验收结论只允许：**Accepted** · **Accepted with follow-ups** · **Not Accepted**。

> **Accepted with follow-ups** 的遗留项必须进入 Product Backlog、Release Backlog、Sprint Backlog 或明确记录处理位置。

### 3.8 Merge Gate

merge 必须由 PO 明确授权。默认：工作分支 → sprint 分支 · `--no-ff` · 不 push · 不 merge `release/1` · 不 merge `main`。

### 3.9 Sprint Review

检查：Sprint Goal · Committed Stories · 验收状态 · Outcome / 假设 / 成功指标 · 未完成项回流 · 用户或 PO 反馈 · Release 影响。

### 3.10 Sprint Retrospective

检查：协作流程 · Cursor 指令清晰度 · Review 是否过度或不足 · 范围漂移 · 检查与证据匹配 · 下个 Sprint 改进项。

### 3.11 Sprint Closeout

至少要求：Sprint Review · PO 验收或明确接受遗留 · Retrospective · 未完成项回流 Backlog · Sprint / Product / Release Backlog 同步 · Decision / Changelog / Evidence 同步 · working tree · 分支 · merge / push 状态检查。

### 3.12 Release Planning

从 Product Backlog / Coverage Matrix / Story Map / Product Success Model 中选择 Release 范围。

> Release Planning **不得**直接把完整 Story Map 全量纳入当前 Release；必须明确 Must / Should / Could / Won't；必须绑定 Outcome Goal、假设、成功指标和失败信号。

### 3.13 Release Review / Closeout

Release Closeout 前必须完成：Release Review · Release 验收 · Release Backlog 核对 · 未完成项重新规划 · 发布/回滚/运行证据 · 已知问题与债务登记 · 文档 / Decision / Changelog 同步 · 分支 / tag / working tree / 远程状态检查。

### 3.14 Change Control

当 Sprint 已 **Approved** 后，新增需求、范围变更、优先级变更、架构取舍变化、Story 插入或取消，**必须走 Change Control**。

**至少记录：** 变更原因 · 与 Sprint Goal / Release Outcome 的关系 · 影响范围 · 对容量的影响 · 替换/延期/移出工作 · 新增风险 · 需更新文档 · Decision 记录 · PO 是否明确批准。

> 不允许只增加工作而不调整容量或范围；技术便利性不是扩大产品范围的理由。

### 3.15 Bug / Debt / Follow-up Triage

验收、测试、上线观察、Review、Retrospective 中发现的问题，必须分类处理。

**分类：** 当前 Story 验收缺陷 · PBI · RBI · SBI · Bug · Debt · Research · Governance Follow-up · Deferred · Rejected。

**规则：**

- 影响当前 Story AC 的缺陷，可留在当前 Story 修复；
- 超出当前 AC 的问题，默认进入 Backlog；
- Release 级风险必须进入 Release Backlog 或 Release Review；
- 运维观察类问题必须记录 evidence 和责任位置；
- **不得**静默扩大当前 Story 范围。

### 3.16 Progress Check（轻量）

**不建立**完整 Daily Standup。允许轻量 Progress Check，用于长 Story 或多轮 Cursor 执行：

- 当前 Story 状态 · 已完成 · 阻塞点 · 是否偏离范围 · 下一步是否仍在当前 Story 内 · 是否需要 PO 决策。

Progress Check **不构成**验收，**不**授权 merge，**不**启动下一 Story。

---

## 4. 流程闸门清单

| Gate                        | 规则摘要                                                        |
| --------------------------- | --------------------------------------------------------------- |
| **Sprint Planning Gate**    | Plan Approved 前，不启动 Sprint 内产品开发 Story                |
| **Backlog Refinement Gate** | Refinement 只形成候选与建议，不自动 Committed                   |
| **Story Ready Gate**        | DoR 不完整，不启动 Story                                        |
| **Execution Stop Gate**     | 范围外/冲突/检查失败/需 PO 决策/未授权 merge 等则停止           |
| **Review Gate**             | Cursor 执行后，先 Review 再 Acceptance                          |
| **Acceptance Gate**         | 未经 PO 明确验收，不得标记 Accepted / Done                      |
| **Merge Gate**              | 未经 PO 明确授权，不得 merge                                    |
| **Push Gate**               | 未经 PO 明确授权，不得 push                                     |
| **Change Control Gate**     | Sprint Approved 后范围变更须记录影响与 PO 决策                  |
| **Triage Gate**             | 范围外问题默认进 Backlog，不静默扩大 Story                      |
| **Sprint Close Gate**       | Review + PO + Retro + 同步未完成，不得关闭 Sprint               |
| **Release Close Gate**      | Release Review + 验收 + 证据核对，不得关闭 Release / merge main |

---

## 5. Backlog 追踪字段与模板

S12-STORY-005 追踪字段须纳入 DoR / Cursor 指令 / Execution Report / Review 模板：

```text
PBI ID · RBI ID · SBI ID · 用户活动 · Story Map Slice · 产品模块
· 产品假设 · 成功指标 · 失败信号 · 验收方向 · Evidence
```

**规则：**

- Product Story 缺少上述字段（Ready 所需子集），**不得**进入 Ready；
- Governance / Operations Story 可将 PBI / RBI / 用户活动 / Slice / Module / Hypothesis 标为 **N/A**，但必须说明治理价值、证据链和影响范围。

### PBI-QP-009 条件触发

DoR 模板须包含：**条件触发说明** — 若 PBI 优先级为「条件触发」，必须说明触发依据、触发人、触发场景、是否由 PO 明确确认。

> **PBI-QP-009**（高表现内容拆解与再创作）的优先级**不得自动升为 P0**，必须由 PO 根据自身运营需求确认。

---

## 6. 与后续 Story 的关系

| Story             | 输入                                                        |
| ----------------- | ----------------------------------------------------------- |
| **S12-STORY-007** | 用本模板回看 R1：能力 → 活动 → 模块 → PBI → Evidence → 缺口 |
| **S12-STORY-008** | 用 Release Planning Gate 与 Backlog 追踪字段决定 R2 范围    |
| **S12-STORY-009** | 审计新模板与 `.cursor/rules/`、`docs/governance/` 等一致性  |

---

## 7. 历史记录

> **说明：** 早期协作机制见 [`chatgpt-cursor-docs-workflow.md`](chatgpt-cursor-docs-workflow.md) · Execution Report 历史模板见 [`execution-reports/_template.md`](execution-reports/_template.md)（**保留**，S12 起新 Story 优先使用 [`templates/execution-report-template.md`](templates/execution-report-template.md)）。

---

## 相关文档

- [Backlog 追踪模型](backlog-tracking-model.md)
- [Git 工作流](git-workflow.md)
- [Story DoR 模板](templates/story-dor-template.md)
- [Story DoD 模板](templates/story-dod-template.md)
