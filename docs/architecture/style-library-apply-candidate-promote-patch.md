# Style Library · Apply Candidate Promote Patch (S9-STORY-007B)

## Purpose

Close the loop from **S9-STORY-005 HTML paste proposal** to **code-backed user_selectable asset** via Cursor-applied patch — not browser file writes.

```text
HTML paste (Workbench)
  → candidate proposal + Cursor patch summary (S9-STORY-005)
  → inspection / promote review (S9-STORY-006 / 007)
  → Cursor apply patch (S9-STORY-007B) ← this story
  → variant definition + style-library asset + evidence + manifest
  → Workbench shows user_selectable
```

## Cursor role

- Reads proposal / patch summary from operator
- Modifies code-backed files (`variants`, `style-library` assets, `manifest`, evidence docs)
- Runs lint / test / build
- Commits on feature branch
- Does **not** merge to sprint without user review

## E2E sample (S9-STORY-007B)

| Item | Value |
|------|-------|
| HTML sample | Teal section label heading (not 006D seeds) |
| variantId | `heading_teal_section_label_html_paste_candidate` |
| assetId | `variant-html-paste-teal-section-label` |
| evidence | `WX-HTML-PASTE-E2E-001` |
| fixture | `tests/fixtures/style-library/s9-story-007b-html-paste-e2e-sample.ts` |

## user_selectable without defaultEligible

- `distribution.userSelectable = true` — operators/users may select in future flows
- `distribution.defaultEligible = false` — not AI/default recommendation eligible
- **Does not** enter `miaopian-classic` or other default preset defaultVariantByBlockType
- Registry patch (if recorded) targets `style_library_inspection_v0` only, **inactive**

## Not release1_required

- Variant status `experimental`
- Not added to `createFirstWaveRequiredVariantRegistry()` / `RELEASE1_REQUIRED_VARIANTS`
- `distribution.release1Required = false`

## Relationship to other stories

| Story | Role |
|-------|------|
| S9-STORY-005 | Browser proposal + patch summary |
| S9-STORY-006 | Preview / Copy / Validator inspection |
| S9-STORY-007 | Promote proposal rules (metadata) |
| S9-STORY-007B | **Apply** code-backed patch |
| S9-STORY-009 | Sprint closeout / E2E audit |

## Matrix row

- **S9M-HTML-PASTE-001** — documents this E2E apply patch path in manifest evidence refs

---

## Runtime Boundary Audit（S9-STORY-007B-AUDIT-A · 2026-06-05）

### 初始实现问题

S9-STORY-007B 初版在 shared runtime 路径中注册了 html-paste candidate：

- `src/core/copy/title-block-copy.ts` — 新增 `heading_teal_section_label_html_paste_candidate` 分支
- `src/core/renderer/title-block-renderer.ts` — 将 variant 加入 `TITLE_BLOCK_SUPPORTED_VARIANT_IDS`

这使 **release1 first-wave copy/preview registry** 在技术上“认识”该 variant，尽管用户侧 registry / preset 仍无法选到它。

### AUDIT-A 修复

- **回退** shared `title-block-copy.ts` / `title-block-renderer.ts` 对 html-paste variant 的改动
- **新增** `src/core/style-library/inspection-render-adapter.ts` — 仅 style-library inspection 路径调用 `renderHtmlPasteTealSectionLabelHeadingCopy` / `renderTitleBlockPreview`
- **测试** `tests/core/style-library/style-library-runtime-boundary-audit-007b.test.ts`

### 结论

| 问题 | 结论 |
|------|------|
| 是否修改 shared renderer/copy（007B 初版） | 是（已回退 html-paste 部分） |
| 是否影响 release1_required 既有 Preview/Copy 输出 | **否** — 无既有 variant 代码路径变更 |
| 是否影响 default preset 渲染 | **否** |
| 是否影响 /preview · Gallery · 生成链路 | **否** — variant 不在 `createFirstWaveRequiredVariantRegistry()` |
| user_selectable variant 可见范围 | **仅** `style_library_inspection_v0` + `/dev/style-library` workbench |
| default preset | **不进入** |
| release1_required | **不进入** |
| Gallery 默认池 | **不进入** |

### 与 006D harvest candidate 的差异说明

006D harvest heading candidate **仍**通过 shared title-block allowlist（S8 既有决策）。S9-STORY-007B html-paste candidate **不再**扩展 shared allowlist；仅 inspection adapter 渲染。

---

## Tokenized render rules（S9-STORY-007C-FIX-B · 2026-06-05）

### 采集颜色不等于最终样式

- 来源 HTML 中的 `#0d9488` 仅保留在 evidence / fixture（`WX-HTML-PASTE-E2E-001` · `S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML`）
- **不得**作为 Preview / Copy 最终 `background-color` 写死

### 动态 section label

- `SECTION NN` 由文章内 heading 顺序生成（`resolveHeadingIndexLabel`）
- Preview / Copy 共用 `resolveHtmlPasteSectionLabelStyleTokens(context)`

### 动态 accent

- 最终 label 背景色 = 当前 `ResolvedBlockStyle` theme 的 `textAccent` token
- 用户切换预览配色后 section label 主色随之变化

### user preview path（007C）

- 用户于 `/preview` 手动选择后，经 `user-preview-render` adapter 调用同一 token 解析逻辑
- 仍不进入 `createFirstWaveRequiredVariantRegistry()` / Gallery / AI 默认路径
