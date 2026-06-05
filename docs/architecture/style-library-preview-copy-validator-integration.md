# Style Library Preview / Copy / Validator Integration（S9-STORY-006）

> 轻篇公众号排版 · qingpian-wechat-editor  
> **Story：** S9-STORY-006 · **Decision：** DECISION-100  
> **路由：** `/dev/style-library`（Style Library Workbench）

---

## 1. 定位

S9-STORY-006 在 Style Library Workbench 中为 **候选样式（seed assets）** 提供 **inspection-only** 的 Preview / Copy / Validator 集成：

```text
候选样式
  → 样式预览（Preview Renderer）
  → Copy HTML（Copy Renderer）
  → validateWechatCopyHtml 校验
  → 运营可读结论
  → Promote readiness（是否可进入 S9-STORY-007 上线审核）
```

**不是：** 技术 renderer 测试页 · 第二套 renderer · runtime 分发 · manifest 写入 · promote 执行。

---

## 2. 为什么不接入 runtime registry

| 约束 | 说明 |
|------|------|
| 006D seed assets | `heading_purple_chapter_label_candidate` · `info_card_reading_path_candidate` 为 **candidate**，不在 `createFirstWaveRequiredVariantRegistry()` |
| Gallery / Preview / Copy 默认路径 | **不修改**；用户侧行为不变 |
| inspection-only registry | `createStyleLibraryInspectionStyleRegistry()` — preset `style_library_inspection_v0`，仅 Workbench 检查使用 |

Harvest candidate variants 已在 Copy / Preview renderer 中支持，但 **仅** 通过 inspection registry + blockOverrides 引用，不进入默认 preset。

---

## 3. 代码结构

```text
src/core/style-library/
  inspection-fixtures.ts    # inspection registry · preview fixture article
  inspection-result.ts      # PromoteReadiness · inspection result types
  inspection.ts             # preview / copy / validator / summary engine

src/app/dev/style-library/
  style-library-inspection-view-model.ts
  style-library-inspection-preview.tsx   # 复用 PreviewBlockView 展示 preview shell
```

### 导出 API

| 函数 | 职责 |
|------|------|
| `buildStyleLibraryInspectionTarget` | 构造检查对象（assetId · variantId · fixture） |
| `createCandidatePreviewFixture` | 生成 inspection-only Article fixture |
| `renderStyleLibraryCandidatePreview` | 调用 Preview Renderer |
| `renderStyleLibraryCandidateCopyHtml` | 调用 Copy Renderer |
| `validateStyleLibraryCandidateCopyHtml` | 调用 `validateWechatCopyHtml` |
| `getStyleLibraryInspectionSummary` | 聚合 preview + copy + validator + promote readiness |

---

## 4. Renderer / Validator 复用

| 层 | 复用 |
|----|------|
| Preview | `createRelease1FirstWavePreviewRendererRegistry()` + `renderBlock(mode: preview)` |
| Copy | `createRelease1FirstWaveCopyRendererRegistry()` + `renderBlock(mode: copy)` |
| Validator | `validateWechatCopyHtml({ html, blockType, variantId })` — Contract v1 |

不 fork renderer 逻辑；不修改 Contract v1 分级。

---

## 5. Promote readiness 规则

```ts
PromoteReadiness {
  candidateId,
  runtimeVariantId,
  validatorStatus,      // PASS | WARNING | FAIL
  hasPasteQaEvidence,
  hasBlockingIssues,
  readyForPromoteReview,
  blockedReasons,
  nextRequiredStory,
}
```

| 条件 | 结果 |
|------|------|
| validator FAIL | not ready |
| blocking issues（errors） | not ready |
| 无 paste QA evidence | needs paste QA |
| validator PASS/WARNING + paste_qa_pass lifecycle + paste QA evidence | **ready for S9-STORY-007 promote review** |
| seed ready | **仍不自动 promote** — 仅 Workbench 结论 |

006D seed assets 当前 lifecycle `paste_qa_pass`，含 `PASTE-QA-SESSION-006D` evidence；validator 通常为 WARNING（Yellow tag），仍显示 ready for promote review。

---

## 6. 与其他 Story 的关系

| Story | 关系 |
|-------|------|
| S9-STORY-003 Workbench | 在 Candidate Review Card 内嵌 Preview / Copy / Validator / Promote readiness 面板 |
| S9-STORY-004 Lifecycle | lifecycle `paste_qa_pass` 与 promote readiness 对齐；真实流转仍 proposal-only |
| S9-STORY-005 Harvest | 本轮不做 HTML harvest parser；inspection fixture 为运营可读样本 |
| S9-STORY-007 Promote | readiness 指向 S9-STORY-007；不执行 promote / 不写 manifest |

---

## 7. 为什么本轮不做 Paste QA 写入

- Paste QA Session 记录已在 S8-STORY-006D 完成并登记为 evidence ref
- S9 v0 无写 API / 无 DB / 无浏览器写 manifest
- Workbench 只 **读取** evidenceIds 与 lifecycle，不创建新 Session

---

## 8. UI 行为

- **Status Summary** 增加：自动校验通过 · 需要粘贴 QA · 可进入上线审核 · 阻塞候选样式
- **Candidate Review Card** 增加：Preview shell · Copy snippet · Validator 结论 · Promote readiness
- **Diagnostics / Advanced**：raw Copy HTML · raw validator issues（`<details>` 折叠）
- **双语：** 默认 zh · `?lang=en`（DECISION-098）

---

## 9. 参考

- [`style-library-admin-shell.md`](style-library-admin-shell.md)
- [`style-library-lifecycle-management.md`](style-library-lifecycle-management.md)
- [`style-library-storage.md`](style-library-storage.md)
- **DECISION-100** · DECISION-099 · DECISION-097
