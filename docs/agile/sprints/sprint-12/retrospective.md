---
sprintId: sprint-12
documentType: retrospective
status: Draft
sprintStatus: Approved / In Progress
associatedStory: S12-STORY-009
---

# Sprint 12 Retrospective（草案）

> **状态：** **Draft** — Sprint 12 **未关闭**；本文档为复盘草案，非 Closeout 结论。

---

## 1. What went well

- **用户取舍式 Planning** 有效：PO 在 S12-STORY-008 确认 6 项产品取舍后，R2 候选规划可快速收敛
- **Story 顺序执行** 清晰：002→003→004→005→006→007→008 单 Story 分支 + 验收 + merge 节奏稳定
- **独立 Sprint / Release 目录** 减少全局文件膨胀：`sprints/sprint-12/` · `releases/release-2/` 职责清晰
- **Backlog 追踪字段**（005）与 **Operating Model**（006）为后续 R2 开发提供可复用闸门
- **Execution Report** 作为 ChatGPT 审查输入有效；PO 验收边界（commit/merge/push）执行一致

---

## 2. What did not go well

- **全局索引滞后**：`release-plan.md` · `sprint-plan.md` · `product-backlog.md` 顶部状态多次落后于 `sprints/sprint-12/`
- **双模板并存**：`execution-reports/_template.md` 与 `templates/execution-report-template.md` 需统一入口说明
- **`.cursor/rules/` 未同步** S12 新治理事实源（按设计留待本 Story 审计 follow-up）
- **历史正文干扰**：大文件（`sprint-backlog.md` · `product-backlog.md`）中历史段落易被误读为当前状态

---

## 3. Process improvements

1. Story 验收 merge 后，**同步更新 3 个全局索引**（`release-plan` · `sprint-backlog` 摘要 · `sprint-plan` 顶部）作为固定 checklist
2. Closeout 前强制跑 **consistency-audit**（本 Story 模式可复用）
3. 明确 **report-only commit** 不回填历史 execution report 的 PO 规则继续执行

---

## 4. Governance improvements

- Operating Model 应成为 `.cursor/rules/` 对齐的**单一上游**（待 PO-001 决策）
- Release 2 候选规划与 **R2 启动** 之间须保留显式 PO Approved 闸门
- PBI-QP-009 条件触发规则已在 DoR 模板固化；后续须防自动升 P0

---

## 5. Planning quality observations

- DECISION-116 Sprint Planning 范围合理；9 Story 拆分可逐个验收
- S12-STORY-001 前置审计降低后续返工
- R2 Must/Should/Could/Won't 在 008 一次性写全候选，避免 009 再扩产品范围

---

## 6. Cursor instruction quality observations

- 收敛版 DoR 字段（分支/HEAD/禁止项/停止条件）减少越界执行
- 验收轮与执行轮分离清晰
- 建议：Closeout Story 指令可引用 `consistency-audit.md` 结论模板

---

## 7. 事实源与文档结构经验

- **权威事实源优先级：** `sprints/sprint-12/` > 全局索引摘要 > 历史正文
- **不得**在兼容入口（`sprint12-product-governance-r2-planning.md`）复制完整 Story AC
- Release 1 历史 Epic/PB 与 S12 PBI-QP 群组**分层保留**策略正确

---

## 8. 后续 Sprint / Release Planning 建议

1. R2 启动前：PO 明确 **Release 2 Approved**（独立于候选规划）
2. R2-Sprint-01 须独立 Sprint Planning；不得直接执行 `releases/release-2/backlog.md` Must 项
3. Release 1 Closeout 与 Sprint 12 Closeout **分开决策**
4. `.cursor/rules/` 对齐可作为 Sprint 12 后首个 chore 或 R2 前治理 Story

---

## 9. 重点复盘结论（PO 确认经验）

1. **用户取舍式 Planning** 比一次性大方案更有效
2. **Sprint / Release 独立目录 + 全局索引** 须继续坚持并强化同步
3. **R2 候选规划 ≠ Release 2 启动** 须在每次索引更新中重复
4. **Story 验收 / merge / push / closeout 边界** 本轮执行良好，索引同步是主要改进点

---

## 相关文档

- [`review.md`](review.md)
- [`consistency-audit.md`](consistency-audit.md)
- [`closeout.md`](closeout.md)
