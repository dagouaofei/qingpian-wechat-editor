# Variant DSL Legacy renderContract 双轨渲染债务

> 轻篇公众号排版 · qingpian-wechat-editor  
> **状态：** Deferred（历史债务 · 已归档 · **本轮不修复**）  
> **关联：** [`article-variant-dsl-runtime.md`](article-variant-dsl-runtime.md) · **DECISION-110** · [`decisions.md`](../agile/decisions.md) · S10-STORY-013

---

## 1. 背景

S10 引入 **Variant DSL + DB `definitionJson` + 统一 Decoder Core** 后，目标形态是：

```text
definitionJson（含 tree 或等价结构化描述）
  → decodeVariantDsl（preview / copy_wechat / admin_inspection 同源）
  → 同一 fidelity tree / 同一 inline HTML 规则
```

但在 **Registry import / code seed** 路径上，`encodeRegistryVariantToDsl` 仍产出 **`renderContract` 形态、无 `tree`** 的 DSL。Decoder 对此走 `decodeRenderContract`，内部 **复用 Sprint 7 之前的 block renderer 双轨**：

| Target | 实现 | 输出形态 |
|--------|------|----------|
| `preview` | `renderTitleBlockPreview` | React `title_block_preview` → `TitleHeadingPreviewBlock` |
| `copy_wechat` | `renderTitleBlockCopyHtml` | 字符串 HTML → `renderPublish*` / layout 专用 Copy builder |

这与 **html_paste / Harvest 的 `tree` 单轨 decode** 并存，构成 **Preview / Copy 不同源** 的历史架构。  
**该路径为过渡实现，当前已视为废弃方向；新 variant 不得再依赖此模式。**

---

## 2. 债务清单

| ID | 债务 | 影响 | 状态 |
|----|------|------|------|
| DEBT-DSL-RC-001 | Registry 编码 DSL 无 `tree`，仅 `renderContract: title_block_v1` | DB 中大量 release1 variant 仍走 legacy decode | Deferred |
| DEBT-DSL-RC-002 | Preview 用 React 组件、Copy 用独立 HTML builder（`heading-publish-copy-html.ts` 等） | Preview/Copy 结构易漂移；须逐 variant 手工对齐 | Deferred |
| DEBT-DSL-RC-003 | `renderPublish*` 与 `TitleHeadingPreviewBlock` 两套 layout 实现 | 修一个 variant 常只修 Copy 或只修 Preview | Mitigated（个案 patch，如 BUG-S10-COPY-FIDELITY-001） |
| DEBT-DSL-RC-004 | `title-block-copy.ts` 内非 publish 与 publish 分支 + table 旧 Copy 路径并存 | 维护面大、行为不一致 | Deferred |
| DEBT-DSL-RC-005 | `info_card_v1` 无 tree 时 registry renderer + fallback tree 混合 | 与 title 同类过渡 | Deferred |
| DEBT-DSL-RC-006 | 其他 blockType 的 `renderContract`（text/divider/list…）仍映射旧 context renderer | 非 title/heading 亦未 tree 化 | Deferred |

---

## 3. 受影响范围（release1 · registry 路径）

### 3.1 `title_block_v1` · 无 tree（**高风险 Preview/Copy 双轨**）

**Title（3）：**

- `title_plain_minimal`
- `title_left_bar_classic`
- `title_bottom_line_editorial`

**Heading publish pool（8）：**

- `heading_short_line`
- `heading_highlight_marker`
- `heading_icon_prefix`
- `heading_minimal_number`
- `heading_magazine_left_bar`
- `heading_magazine_offset`
- `heading_numbered_section`
- `heading_card_centered`

**Copy 侧 publish 专用 builder（`src/core/renderer/heading-publish-copy-html.ts`）：**

- `renderPublishHighlightMarkerCopy`
- `renderPublishShortLineCopy`
- `renderPublishNumberedSectionCopy`
- `renderPublishMinimalNumberCopy`
- `renderPublishCardCenteredCopy`
- `renderPublishIconPrefixCopy`
- `renderPublishMagazineLeftBarCopy`
- `renderPublishMagazineOffsetCopy`

**入口：** `decodeRenderContract` → `renderTitleBlockCopyHtml` / `renderTitleBlockPreview`（`src/core/dsl/decoder/decode-contract.ts`）。

### 3.2 已走 tree 单轨（**目标形态 · 非本债务主范围**）

- HTML Harvest / html_paste candidate：`definitionJson.tree` → `decodeTreeToOutput` · preview/copy 同源 fidelity tree
- 用户侧 FIX-C fidelity refresh · theme token remap · ordinal substitution（S10-STORY-011）

### 3.3 已知 Copy Fidelity 个案

| Bug | Variant | 说明 |
|-----|---------|------|
| BUG-S10-COPY-FIDELITY-001 | `heading_magazine_left_bar` | **Fixed**（2026-06-08 · Copy 双嵌套 section 竖线）；根因即 DEBT-DSL-RC-002 |
| BUG-S10-COPY-FIDELITY-002 | `heading_card_centered` | **Fixed**（2026-06-08 · Copy 移除 h3 横线/padding）；根因即 DEBT-DSL-RC-002 |

---

## 4. 代码锚点（便于审计）

```text
encodeRegistryVariantToDsl     → renderContract，无 tree
decodeVariantDsl               → 无 tree 则 decodeRenderContract
decodeRenderContract           → title_block_v1 分叉 preview/copy renderer
renderTitleBlockPreview        → React TitleHeadingPreviewBlock
renderTitleBlockCopyHtml       → layoutMode switch → renderPublish* / legacy copy
title-block-renderer.ts        → 旧 renderBlock 直连（用户侧已禁止，见 FIX-A）
user-preview-render.ts         → 仅经 DSL Decoder；但 DB DSL 仍为 renderContract 时会落入本债务
```

---

## 5. 目标收口形态（未来 · 不在当前 Sprint 实现）

1. **Registry import 重编码**：release1 title/heading 写入带 `tree`（或等价结构化 layout）的 `definitionJson`，弃用 `title_block_v1` 双轨。
2. **Preview / Copy / admin_inspection** 全部 `decodeTreeToOutput` + 同一 `renderDslTreeToHtml` target 差异（仅 copy-safe 变换）。
3. **废弃** `heading-publish-copy-html.ts` publish 专用 builder 与 `TitleHeadingPreviewBlock` 中重复 layout（或 Preview 也改为 tree HTML）。
4. **quality gate**：`copy_fidelity_failed` variant 在 tree 迁移后批量重跑。

**建议归属 Story：** S10-STORY-013 DSL Runtime Schema Cleanup（或 Sprint 11 独立 Epic）。

---

## 6. 本轮明确不做

- 批量将 11 个 first-wave title/heading registry variant 迁移为 tree DSL
- 删除 `renderPublish*` / `TitleHeadingPreviewBlock` legacy 路径
- 除已登记 bug 外的逐 variant Copy 散修
- 修改 import 脚本默认编码策略（除非单独 Story）

---

## 7. 参考

- [`preview-copy-fidelity-implementation-guide.md`](preview-copy-fidelity-implementation-guide.md)
- [`heading-publish-copy-contract.md`](heading-publish-copy-contract.md)
- [`bugs.md`](../agile/bugs.md) · BUG-S10-COPY-FIDELITY-001/002
