# Execution Report：S10-STORY-011 e21d5346 border-bottom 配色 + copy 一致性（第二轮）

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 关联：`heading_html_paste_e21d5346_candidate`
- 状态：In Review（待用户 preview/copy 复验）

## 2. 问题（用户反馈）

1. 短横线未随配色变化
2. Copy 与 Preview 不一致：大号数字 `-webkit-text-stroke` 丢失；横线变全长

## 3. 运行时证据（debug session 437a1b）

| 假设 | 结论 | 证据 |
|------|------|------|
| H1 仅处理 `borderBottom`  shorthand，未处理 `borderWidth+borderColor` | **CONFIRMED** | upload 样本 `themedTreeBorderSnippet` 修复前不变；修复后 log L39 `borderColor:#2563eb` |
| H2 `border-bottom:2px solid` 因无 `tokens.accentColor` 且 section 无 lineHeight:0 被跳过 | **CONFIRMED** | preview_like 修复前 `borderBottom:#222cff` 未变；修复后 log L27 `2px solid #2563eb` |
| H3 `borderStyle:solid` 误判 bordered box | **REJECTED** | 根因是 split border 属性未处理 |
| H4 Copy 剥离 `-webkit-text-stroke` | **CONFIRMED** | diagnostic `previewHasTextStroke:true, copyHasTextStroke:false` |
| H5 Copy flex→block 导致 underline section 100% 宽 | **CONFIRMED** | copy 路径增加 thin border-bottom → `inline-block;width:auto` |

## 4. 修复

- [`fidelity-tree-theme-tokens.ts`](src/core/dsl/decoder/fidelity-tree-theme-tokens.ts)：识别 `border-bottom` 1–4px 短线 + `border-width:0 0 1px` 分写属性；remap 到 `textAccent`；number 节点 `-webkit-text-stroke` → `borderLight`
- [`allowed-style-properties.ts`](src/core/wechat-compatibility/allowed-style-properties.ts)：允许 `-webkit-text-stroke` 进入 copy
- [`render-style.ts`](src/core/dsl/decoder/render-style.ts)：copy 时 thin `border-bottom` 保持 `inline-block;width:auto`

## 5. 测试

- 新增 [`e21-heading-html.ts`](tests/fixtures/dsl/e21-heading-html.ts)（upload + preview_like）
- 扩展 `html-paste-fidelity-theme-tokens.test.ts`（11 项 PASS）

## 6. Commit

- Commit hash：`a7f272f` — fix: theme-remap e21 border-bottom lines and copy preview parity
- Merge：未 merge（待用户确认）
