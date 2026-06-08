# Execution Report：S10-STORY-011 html_paste heading eyebrow 动态序号

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-promote-user-selectable-final`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：当前 sprint 分支（待用户确认）
- Sprint：Sprint 10
- 关联 Story：S10-STORY-011
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

扩展 fidelity tree decode substitution：对 `semanticBindings.eyebrow` 内 1–3 位数字按 heading ordinal 动态替换（如 `CHAPTER 03` → `CHAPTER 01/02/03`），encoder 不改全局数字扫描。

## 3. 执行范围

**做了：**

- `applyOrdinalToEyebrowLabel` 工具函数（`\b\d{1,3}\b`，避免误改四位年份）
- `substituteEyebrowOrdinalInTree` + trace 字段 `substitutedEyebrow` / `eyebrowSubstitutionTargetPath`
- 多 heading chapter overlay 测试 + inspection 期望更新

**没做：**

- encoder / upload 流程改动
- subtitle / title 数字替换
- merge sprint 分支

## 4. 修改文件

- `src/core/renderer/heading-ordinal.ts`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts`
- `tests/core/renderer/heading-ordinal.test.ts`
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts`
- `tests/server/style-admin/inspection/candidate-inspection-dsl-preview.test.ts`

## 5. 新增文件

- `docs/agile/execution-reports/2026-06-08-s10-story-011-heading-eyebrow-ordinal-fix.md`

## 6. 阅读但未修改的关键文件

- `src/core/dsl/encoder/heading-semantic-extractor.ts`
- `src/core/dsl/encoder/fidelity-html-tree.ts`

## 7. 关键变更说明

1. Decode 阶段在 number substitution 之后、title substitution 之前，对 eyebrow binding path 写入 ordinal 化文本。
2. 源文本来自 `semanticBindings.eyebrow.text` 或 `meta.extractedSlots.eyebrow`。
3. `preserveTexts`（title fallback）仍用 encode 时原始 extractedSlots，不受替换影响。
4. 当第 3 个 heading ordinal 为 `03` 且 source 为 `CHAPTER 03` 时，仍 trace 为已替换（文本相同但语义正确）。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 4933bb91 无 eyebrow，行为不变 | PASS | 现有 background number 测试仍通过 |
| chapter overlay 多 heading eyebrow/number 递增 | PASS | 01/02/03 + CHAPTER 01/02/03 |
| subtitle 保持静态 | PASS | HOW TO 断言保留 |
| inspection 单 heading 显示 CHAPTER 01 | PASS | 由 CHAPTER 03 更新期望 |
| vitest 相关套件 | PASS | 12 tests |

## 9. 运行检查

| 命令 | 结果 |
|------|------|
| `npx vitest run tests/core/renderer/heading-ordinal.test.ts tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts tests/server/style-admin/inspection/candidate-inspection-dsl-preview.test.ts` | PASS (12) |

## 10. 未完成事项

- 用户侧 `/preview` 人工复测 chapter overlay variant
- commit / merge（待用户指示）

## 11. commit hash

未提交 / not committed
