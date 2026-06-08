# Execution Report：html_paste heading 编号按章节递增

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：当前 sprint 分支（待用户确认）
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011
- 执行者：Cursor
- 状态：Done

## 2. 本轮目标

修复 `heading_html_paste_4933bb91_candidate` 与 `heading_html_paste_64e3b97a_candidate` 在多章节文章中编号不随 heading 顺序递增的问题。

## 3. 根因

- Fidelity tree 仅对 **title** 做 `applyFidelityTreeArticleSubstitution`，**number** 保留 source HTML 静态值（如 `01`）。
- `resolveHeadingIndexLabel` 已在 registry variant（如 teal section label、`heading_numbered_section`）使用，但 DSL fidelity 路径未接入。
- 运行时证据（修复前）：同一 article 三个 heading 均输出 `01`。

## 4. 修改文件

- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `src/core/dsl/decoder/decode-tree.ts`
- `src/core/dsl/decoder/decode-variant-dsl.ts`
- `src/core/dsl/decoder/decode-contract.ts`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`

## 5. 关键变更

- `applyFidelityTreeArticleSubstitution` 增加 `article` 参数；存在 `meta.semanticBindings.number` 时，用 `resolveHeadingIndexLabel(article, block.id, block.meta?.sourceIndex)` 替换 tree 中 number 文本。
- `decodeTreeToOutput` 将 `article` 传入 substitution。
- trace 增加 `substitutedNumber` / `numberSubstitutionTargetPath`。
- debug instrumentation 已移除（2026-06-08 用户确认）

## 6. 验收

| AC | 结果 |
|----|------|
| 多 heading 编号 01/02/03 递增 | Pass（tsx + vitest） |
| 单 heading 仍为 01 | Pass |
| title  substitution 不受影响 | Pass |
| 用户侧 UI 复测 | Pending |

## 7. 检查命令

```bash
npx vitest run tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts
```

## 8. commit hash

未提交 / not committed
