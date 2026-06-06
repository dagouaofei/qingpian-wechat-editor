# Style Library Lifecycle Management

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-004** · Variant Lifecycle Management v0  
> **关联：** [`style-library-admin-shell.md`](style-library-admin-shell.md) · [`style-management-domain-model.md`](style-management-domain-model.md) · **DECISION-099**

---

## 1. 定位

S9-STORY-004 在 `/dev/style-library` 运营工作台中提供 **lifecycle transition engine** 与 **Lifecycle Change Proposal** 预览。

| 是 | 不是 |
|----|------|
| 运营可见 lifecycle pipeline + 流转说明 | 纯技术状态机 debug 页 |
| proposal-based 模拟预览 | 浏览器 直接写 TS manifest |
| 只读 / 模拟 | runtime patch 激活 · promote 执行 |

**DECISION-099：** lifecycle v0 采用 proposal-based transition — 运营可见、可模拟、可审查；不做 code-backed manifest 持久化写入，不修改 runtime。真实 promote 与 runtime 分发留给 **S9-STORY-007**。

---

## 2. Lifecycle 状态

```text
draft
→ candidate
→ validator_pass
→ paste_qa_pass
→ user_selectable
→ default_eligible
→ deprecated
```

| 状态 | 运营含义 |
|------|----------|
| draft | 草稿，未进入候选审查 |
| candidate | 候选池，等待校验 |
| validator_pass | 校验通过 |
| paste_qa_pass | 粘贴 QA 通过，可进入上线审核 |
| user_selectable | 用户可选池 |
| default_eligible | 可进默认推荐（独立于 user_selectable） |
| deprecated | 已废弃 |

006D seed assets 当前为 **paste_qa_pass**；distribution flags 仍为 false。

---

## 3. Transition 规则（v0）

| Transition | v0 行为 |
|------------|---------|
| candidate → validator_pass | 需 validator / harvest / matrix 证据；否则 blocked |
| validator_pass → paste_qa_pass | 需 paste_qa 证据；否则 blocked |
| paste_qa_pass → user_selectable | **blocked** · 需 S9-STORY-007 promote review；seed 尤其禁止 |
| user_selectable → default_eligible | **blocked** · 需独立 PO 决策 · S9-STORY-007 |
| active → deprecated | 可生成 proposal · **必须**提供 deprecation reason |

---

## 4. Lifecycle Change Proposal

```typescript
type LifecycleChangeProposal = {
  proposalId: string;
  assetId: string;
  runtimeVariantId: string | null;
  fromLifecycle: StyleLibraryLifecycleState;
  toLifecycle: StyleLibraryLifecycleState;
  allowed: boolean;
  blockedReasons: string[];
  requiredEvidenceIds: string[];
  requiredStory: string | null;
  distributionImpact: { userSelectable; defaultEligible; release1Required; summary };
  runtimeImpact: { affectsRuntime: false; ... };
  notes: string[];
};
```

- **distributionImpact：** S9-STORY-004 不修改 flags；仅描述 preview 不变
- **runtimeImpact：** 明确无 Gallery / Preview / Copy / default preset / registry patch 影响

---

## 5. 代码结构

```text
src/core/style-library/
  lifecycle.ts           # transition engine + proposal
  lifecycle-rules.ts     # forward path + story constants

src/app/dev/style-library/
  style-library-lifecycle-view-model.ts
```

导出 API：

- `getAllowedLifecycleTransitions`
- `getBlockedLifecycleTransitions`
- `canTransitionLifecycle`
- `createLifecycleChangeProposal`
- `validateLifecycleTransition`

---

## 6. 与 Workbench 的关系（S9-STORY-003）

| 区块 | S9-STORY-004 增强 |
|------|-------------------|
| Lifecycle Pipeline | 列头增加业务含义 · 下一步动作 |
| Candidate Review | 每卡增加 Lifecycle Management panel |
| Lifecycle Management | 允许 / 受阻流转 + proposal preview |

双语：默认中文 · `?lang=en` · 技术 ID 不翻译。

---

## 7. 后续 Story 承接

| Story | 关系 |
|-------|------|
| **S9-STORY-005** | Harvest 新 candidate 进入 pipeline |
| **S9-STORY-006** | validator / paste QA 证据面板与真实结果 |
| **S9-STORY-007** | promote review · user_selectable · default_eligible 执行 |

---

## 8. 本轮不做

- 不写 `STYLE_LIBRARY_MANIFEST`
- 不激活 registry patch
- 不进入 user_selectable / default_eligible pool
- 不修改 StyleRegistry / Gallery / Preview / Copy

---

## 9. 测试

- `tests/core/style-library/style-library-lifecycle.test.ts`
- `tests/app/dev/style-library/style-library-lifecycle-view-model.test.ts`

---

## 10. 参考

- **DECISION-099** · DECISION-097 · DECISION-096
- [`style-library-storage.md`](style-library-storage.md)
