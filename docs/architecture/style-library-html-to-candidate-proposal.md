# Style Library HTML to Candidate Proposal

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Sprint 9 · S9-STORY-005** · Proposal-first HTML paste workflow  
> **DECISION-104** · **关联：** [`style-library-preview-copy-validator-integration.md`](style-library-preview-copy-validator-integration.md)

---

## 1. 定位

S9-STORY-005 让运营人员在 `/dev/style-library` 粘贴公众号 HTML，生成 **candidate variant proposal**（不写 manifest · 不激活 runtime）。

```text
Paste HTML → blockType → style extraction → candidate proposal
  → proposal inspection (copy/validator)
  → evidence draft → Cursor patch summary → S9-STORY-007B apply
```

---

## 2. 最小 style extraction

`html-style-extractor.ts` 使用 regex 最小提取（非完整 HTML parser）：

- tagName
- inline style 属性
- color / backgroundColor / border / fontSize / fontWeight / padding / margin / textAlign / display / boxShadow
- forbidden / risky CSS 初筛
- operator-readable warnings（非 silent fail）

---

## 3. Proposal 数据结构

见 `HtmlCandidateProposal`（`html-candidate-proposal.ts`）：

- proposalId · sourceHtml · detectedBlockType · candidateVariantId
- label zh/en · extractedStyleFeatures
- suggestedStyleFamily · suggestedPaletteId · suggestedRuleIds
- copySafeRiskSummary · proposedLifecycle=candidate
- distribution 全 false
- evidenceDraft · cursorPatchSummary · inspection · nextSteps

---

## 4. Evidence draft

- sourceType: `pasted_html`
- sourceHtmlHash · sourceHtmlPreview
- pasteQaStatus: `not_tested`
- validator summary
- **不写正式 evidence 文件**

---

## 5. Cursor patch summary

可复制给 Cursor 的 markdown 摘要，说明：

- 新增 variant definition / style-library asset
- lifecycle candidate（不得无 Paste QA 直接 paste_qa_pass）
- distribution 边界
- 后续 **S9-STORY-007B** apply

---

## 6. 与 S9-STORY-006 inspection 的关系

- 006 针对 manifest seed assets + inspection registry
- 005 对 **pasted HTML** 直接跑 `validateWechatCopyHtml` 作为 proposal inspection
- Preview 需 variant 定义 — 提示需 007B apply 后再做 renderer preview

---

## 7. 与 S9-STORY-007B 的关系

- 005 只生成 proposal + patch summary
- 007B 负责 Cursor/code-backed apply patch
- 浏览器不写 TS 文件

---

## 8. 为什么不直接写 manifest

file-backed v0 治理层；运营粘贴仅产生审查材料，真实变更需 PR + Cursor workflow。

---

## 9. 为什么不直接进入 user_selectable

candidate proposal 初始 lifecycle=candidate · distribution 全 false · 需 inspection → Paste QA → promote 完整路径。

---

## 10. 代码结构

```text
src/core/style-library/html-style-extractor.ts
src/core/style-library/html-candidate-proposal.ts
src/app/dev/style-library/style-library-html-proposal-view-model.ts
src/app/dev/style-library/style-library-html-proposal-panel.tsx
```

---

## 11. 参考

- **DECISION-104** · DECISION-101 · DECISION-100 · DECISION-097
