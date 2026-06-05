# Style Library Promote to User-selectable

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-007** · Proposal-based promote review v0  
> **DECISION-101** · **关联：** [`style-library-preview-copy-validator-integration.md`](style-library-preview-copy-validator-integration.md) · [`style-library-lifecycle-management.md`](style-library-lifecycle-management.md)

---

## 1. 定位

S9-STORY-007 在 `/dev/style-library` 建立 **Promote Review** 闭环：运营人员可审查 ready candidate，查看 eligibility / evidence / validator / paste QA 状态，并生成 **user_selectable** 上线提案（proposal + inactive patch preview）。

| 是 | 不是 |
|----|------|
| user_selectable promote review | 直接写入 manifest |
| Promote Proposal + patch preview | 激活 registry patch |
| 运营可理解的 distribution / runtime 影响说明 | 自动进入 default preset |
| code-backed 变更准备材料 | runtime Gallery 默认路径修改 |

---

## 2. user_selectable 与 default_eligible

| 概念 | S9-STORY-007 行为 |
|------|-------------------|
| **user_selectable** | 本轮目标：生成 promote proposal / inactive patch preview |
| **default_eligible** | **不**自动设置；UI 明确需独立 PO 决策 |
| **default preset** | **不**修改 |
| **release1_required** | **不**修改 |
| **runtime registry** | **不**修改默认加载路径 |
| **Gallery / 用户侧选择池** | **不**接入真实 runtime（除非已有 isolated preview-only pool） |

---

## 3. Promote 流程（v0）

```text
candidate / paste_qa_pass
  → Preview / Copy / Validator ready (S9-STORY-006)
  → Promote Review (S9-STORY-007)
  → Promote Proposal (user_selectable)
  → Inactive / proposed registry patch preview
  → Copyable patch / review summary（供后续 code-backed 变更）
```

Workbench **不**在浏览器写 `STYLE_LIBRARY_MANIFEST` · **无** API 写 route · **不**自动激活 patch。

---

## 4. Eligibility 规则

候选样式进入 promote review 至少满足：

1. asset 存在于 Style Library manifest
2. asset 类型为 `variant`
3. lifecycle ≥ `paste_qa_pass`
4. `distribution.userSelectable === false`
5. `distribution.defaultEligible === false`
6. `distribution.release1Required === false`
7. inspection validator **不是 FAIL**
8. 无 blocking issue
9. 有 paste QA evidence
10. evidence refs 可追溯
11. 有明确 `runtimeVariantId`
12. 不属于 `deprecated`

### WARNING 处理

validator 为 **WARNING**、无 blocking issue、且有 Paste QA evidence 时：

- 可进入 promote review
- UI 显示风险提醒
- proposal 含 `COMPATIBILITY_WARNING`
- **不能**把 WARNING 当作完全 PASS

---

## 5. Promote Proposal 格式

核心类型：`PromoteProposal`（见 `src/core/style-library/promote-proposal.ts`）

| 字段 | 说明 |
|------|------|
| `proposalId` | 提案 ID |
| `assetId` / `runtimeVariantId` | 目标资产 |
| `fromLifecycle` | 当前 lifecycle |
| `toDistribution` | `{ userSelectable: true, defaultEligible: false, release1Required: false }` |
| `eligibilityStatus` | `ready` / `ready_with_warnings` / `blocked` |
| `warnings` / `blockedReasons` | 兼容性提醒 / 阻塞码 |
| `patchPreview` | inactive · `status: proposed` registry patch |
| `distributionImpact` | userSelectable false→true；其余保持 false |
| `runtimeImpact` | 明确 no runtime change |
| `defaultPresetImpact` | 不进入 default preset |
| `nextDecisionRequired` | default_eligible 需 PO 决策 |

---

## 6. Patch preview 规则

`createUserSelectablePatchProposal()` 生成：

- `operation: add_to_variant_pool`
- `active: false`
- `notes` 含 `S9-STORY-007 proposed patch · inactive`
- **不**写入 manifest · **不**激活

---

## 7. 为何不直接写 manifest

S9 v0 为 **file-backed / code-backed** 治理层：

- 浏览器不应直接写 TS manifest
- promote 是 **审查 + 提案** 阶段，真实变更需 code review / PR
- 与 lifecycle proposal（DECISION-099）一致

---

## 8. 与 S9-STORY-006 的关系

| S9-STORY-006 | S9-STORY-007 |
|--------------|--------------|
| Preview / Copy / Validator inspection | Promote eligibility + proposal |
| Promote readiness 运营结论 | 完整 promote review panel |
| 不 promote | 生成 user_selectable proposal（仍不写入） |

---

## 9. 与 S9-STORY-008 的关系

S9-STORY-008 承接 style / palette / rule 运营列表；**不**替代 promote review。promote 仅针对 **variant candidate** 进入 user pool。

---

## 10. 与 S10 批量扩展

S10 批量样式扩展依赖 S9 治理闭环。S9-STORY-007 确保 promote 路径可审查、可提案、边界清晰（user_selectable only），为 S10 批量入库提供标准 promote 模板。

---

## 11. 代码结构

```text
src/core/style-library/
  promote-rules.ts
  promote-proposal.ts
  promote.ts
src/app/dev/style-library/
  style-library-promote-view-model.ts
```

API：

- `checkPromoteEligibility(asset, manifest, inspectionSummary)`
- `createPromoteProposal(asset, manifest, inspectionSummary)`
- `validatePromoteProposal(proposal, manifest)`
- `createUserSelectablePatchProposal(proposal)`
- `getPromoteBlockedReasons(asset, manifest, inspectionSummary)`

---

## 12. 测试

- `tests/core/style-library/style-library-promote.test.ts`
- `tests/app/dev/style-library/style-library-promote-view-model.test.ts`

---

## 13. 参考

- **DECISION-101** · DECISION-100 · DECISION-099 · DECISION-097
- [`style-library-admin-shell.md`](style-library-admin-shell.md)
