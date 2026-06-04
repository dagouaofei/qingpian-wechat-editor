# Execution Report：荧光笔强调 miaopian 渐变方案

## 1. 基本信息

- 日期：2026-06-03
- 当前分支：`feature/s7-story-007a-r1-style-fidelity`
- 来源分支：`sprint/7`
- 目标合并分支：`sprint/7`
- Sprint：Sprint 7 · S7-STORY-008
- 状态：In Review（待 PO 微信公众号粘贴）

## 2. 本轮目标

PO 手测 7/8 PASS 后先 commit；将 `heading_highlight_marker` 改为 miaopian 式纵向 `linear-gradient` + `h3{display:inline}`，Preview/Copy 同源，删除 table 双行等历史方案。

## 3. 关键实现

- **结构：** `section`（margin / font-family / text-align:left）→ `h3`（inline + gradient + box-decoration-break:clone）→ 可选 `subtitle` `p`
- **渐变：** `accent#14`（≈8%）、`accent#22`（≈13%），`buildHighlightMarkerGradient()`
- **copy-safe：** 仅本品经 `HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS` 豁免 `linear-gradient`；`copy-html-snapshot` 按 variantId 传参

## 4. 修改文件（摘要）

- `heading-publish-decoration.ts` / `heading-publish-copy-html.ts` / `heading-publish-visual.ts`
- `title-heading-preview-block.tsx`、`title-heading-visual.ts`、`title-block-copy.ts`
- `copy-safe-html.ts`、`copy-html-snapshot.ts`
- `title-heading-copy-styles.ts`（恢复 title 通用 helpers）
- `heading-publish-parity.test.ts`、catalog/contract docs

## 5. 检查

| 命令 | 结果 |
|------|------|
| `npm run test` | 814 passed |
| `npm run build` | PASS |

## 6. Commit

- 上一轮（7/8）：`9fb9552`
- 本轮：`7d8e38c`（含渐变 alpha 20/33 微调，同 commit）

## 7. 建议下一步

PO 对 `heading_highlight_marker` 再跑一轮公众号粘贴；若 gradient 被剥离，记录实机 HTML 并迭代。
