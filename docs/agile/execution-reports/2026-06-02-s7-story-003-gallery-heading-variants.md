# Execution Report：S7-STORY-003 Gallery + title/heading（合并 003/004）

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s7-gallery-heading-variants`
- 来源分支：`sprint/s7-wechat-article-experience`
- 目标合并分支：`sprint/s7-wechat-article-experience`
- Sprint：Sprint 7 WeChat Article Experience & Style Richness
- 关联 Story / Bug / Decision：S7-STORY-003 · S7-STORY-004（Merged）· DECISION-082 · DECISION-080 · TECH-ARCH-023
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

合并 S7-STORY-003 与 S7-STORY-004 为单一 Story 003：在 `/gallery` 交付 Copy 对照区、title/heading 聚焦模式、variant 切换，并完成 6 个 first-wave title/heading variant 视觉 polish 与 8 套样例 assignment。

## 3. 执行范围

**已完成：**

- 文档：DECISION-082；sprint-backlog 003 扩写 + 004 Merged；sprint-plan / alignment / changelog / S7-STORY-002 out-of-scope 同步
- Batch A：Gallery Copy 对照面板、title/heading 聚焦模式、侧栏 variant 选择器
- Batch B：`preview-visual-styles.ts` + copy + typography token 同步；8 套 assignment；targeted 单测
- build + 10 项 targeted vitest PASS

**未做：**

- 全量 33×8 variant 矩阵 e2e
- Paste QA（Sprint 8）
- merge `release/1` / `main`

## 4. 修改文件

- `docs/agile/decisions.md`
- `docs/agile/sprint-backlog.md`
- `docs/agile/sprint-plan.md`
- `docs/agile/changelog.md`
- `docs/agile/miaopian-alignment/s7-workflow-and-ux-gap.md`
- `src/app/gallery/gallery-page-client.tsx`
- `src/core/renderer/preview-visual-styles.ts`
- `src/core/renderer/text-style.ts`
- `src/core/copy/title-block-copy.ts`
- `src/lib/render-article-preview-client.ts`
- `src/lib/render-gallery-preview.ts`
- `tests/lib/render-gallery-preview.test.ts`

## 5. 新增文件

- `src/lib/gallery-title-heading.ts`
- `src/lib/gallery-style-controls.ts`
- `src/components/gallery/gallery-copy-preview-panel.tsx`
- `src/components/gallery/gallery-title-heading-controls.tsx`
- `tests/lib/gallery-title-heading.test.ts`

## 6. 阅读但未修改的关键文件

- `src/components/preview/preview-style-controls.tsx`
- `src/components/preview/article-preview-panel.tsx`
- `src/core/styles/variants/title-heading.ts`
- `src/fixtures/article-samples/`

## 7. 关键变更说明

1. **`gallery-title-heading.ts`**：8 套样例各有意识的 title/heading variant 组合（AC-4：无 title+heading 双 plain_minimal）；Gallery 侧栏可 override。
2. **`render-gallery-preview.ts`**：经 `postStyleSelectionPatch` 注入 blockOverrides；返回 `clipboard` + `displayBlocks`（聚焦模式）。
3. **Gallery UI**：Copy HTML 预览区、聚焦 checkbox、title/heading variant 下拉；Preview 用 `displayBlocks`。
4. **视觉 polish**：`preview-visual-styles.ts` + `text-style.ts` typography + `title-block-copy.ts` layout（left_bar accent、bottom_line 2px、top_badge 背景带）保持 Preview/Copy 同源 token。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 | PASS | `/gallery` 8 样例 + 风格控件 + Copy 对照区 |
| AC-2 | PASS | `focusTitleHeading` 过滤 title/heading blocks |
| AC-3 | PASS | 6 variant layout 差异（plain/left_bar/bottom_line/numbered/top_badge） |
| AC-4 | PASS | 8 套 assignment 无双 plain_minimal；单测覆盖 |
| AC-5 | PASS | typography 经 `resolveTitleBlockTypography`；copy layout 用 palette tokens |
| AC-6 | PASS | `gallery-title-heading.test.ts` + `render-gallery-preview.test.ts` |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test -- tests/lib/gallery-title-heading.test.ts tests/lib/render-gallery-preview.test.ts` | PASS | 10 tests |
| `npm run build` | PASS | TypeScript + Next.js build OK |
| `npm run lint` | 未运行 | 本轮未执行 |

## 10. 未完成事项

- PO 人工 `/gallery` 肉眼验收（2+ 样例辨认 title/heading 差异）
- S7-STORY-003 正式关闭需用户确认

## 11. 风险与阻塞

- Copy 对照区为 HTML 预览，非真实 Paste QA；Sprint 8 仍需全量 Paste 回归
- `renderLeftBarCopy` 用 `marginBlock === "28px"` 推断 title vs heading，与 variant token 耦合；后续可显式传 blockType

## 12. 需要用户 / ChatGPT 审查的问题

- S7-STORY-003 是否可标 Done（或保持 In Review 待 PO 手测）？
- 是否 merge `feature/s7-gallery-heading-variants` → `sprint/s7-wechat-article-experience`？

## 13. 建议下一步

- **S7-STORY-005**：highlight / list / lead / cta structured block 样式（在 Gallery 上继续 visible-first 验收）
- Sprint 8 前对 8 套样例做 Paste 基线采样

## 14. Commit

- Commit hash：`6e7be68`
