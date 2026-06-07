# Execution Report：S10-STORY-011 Semantic Binding Decoder Fix

## 1. 基本信息

- 日期：2026-06-07
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`sprint/s10-db-backed-style-admin-v1`
- 目标合并分支：`sprint/s10-db-backed-style-admin-v1`
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011（In Review）
- 状态：In Review

## 2. 本轮目标

修复用户侧 Preview 将文章标题错误填入 number / decorative span 的问题；fidelity tree 按 `meta.semanticBindings.title` 精确替换标题。

## 3. 关键变更

- 新增 `fidelity-tree-substitution.ts`：clone tree + 仅替换 binding 路径文本
- `resolve-dsl-slots.ts`：fidelity/semantic 树不再用 extractedSlots 覆盖 article title
- `decode-tree.ts`：渲染前应用 substitution
- `render-dsl-block.ts` / `DslTreeHtmlPreviewBlock`：输出 trace（slotSubstitutionPath、decorativeSlotsPreserved、fallbackUsed）

## 4. 验收

| AC | 结果 |
|----|------|
| 保留 01，标题替换到 h2 | PASS |
| 不把文章标题放进 number span | PASS |
| 红色短横线保留 | PASS |
| semanticBindings.title 优先 | PASS |
| fallback 标记 fallbackUsed=true | PASS |
| bordered / chapter 回归 | PASS |

## 5. 测试

- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts` — 6 passed
- `tests/core/dsl/encoder/fidelity-encoder.test.ts` — 11 passed
- `tests/core/dsl/bordered-heading-fix-a.test.ts` — 8 passed
- `tests/lib/dsl-runtime-*` — passed
- `tests/server/style-admin/harvest/` — passed

## 6. Commit

- 待提交：`fix: substitute heading title via semantic binding`
