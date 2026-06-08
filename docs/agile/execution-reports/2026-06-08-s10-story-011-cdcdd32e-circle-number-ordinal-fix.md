# Execution Report：cdcdd32e 圆形编号不随章节递增

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：`feature/s10-story-011-promote-user-selectable-final`
- Sprint：S10
- 关联 Story：S10-STORY-011
- 状态：Done（用户 UI 验收通过）

## 2. 问题与根因

**现象：** `heading_html_paste_cdcdd32e_candidate` 左侧圆形 badge 编号始终为上传 HTML 中的静态 `1`，不随文章 heading 顺序变为 01/02/03。

**为何「又出现这类问题」：**

| 轮次 | 修复内容 | 对 cdcdd32e 是否覆盖 |
|------|----------|---------------------|
| 上一轮（`7d4055c`） | decode 路径接入 `resolveHeadingIndexLabel`，**前提**存在 `meta.semanticBindings.number` | ❌ 未覆盖 |
| 配色轮（`41c1a8e`） | 圆形 badge `backgroundColor` / copy `border-bottom` | ❌ 与编号无关 |

cdcdd32e 的编号在 `<p>1</p>` 内、字号 12px；encoder 的 `classifyHeadingSlots` 只扫描 `strong|span|h1-h6`，且 number 候选要求 `fontSizePx >= 40`。因此 **encode 阶段从未产生 `slots.number` / `semanticBindings.number`**，decode 替换逻辑从未触发。

## 3. 运行时证据

| 假设 | 结论 | 日志 |
|------|------|------|
| H1：encoder 未识别 `<p>` 内小字号编号 | **CONFIRMED** | 修复前 bindings 仅含 title（见上轮 cdc 日志） |
| H2：number 候选 fontSize 阈值排除 12px | **CONFIRMED** | `classifyHeadingSlots` 逻辑 |
| H3：无 `semanticBindings.number` 导致 substitution 跳过 | **CONFIRMED** | 修复前大量 `number substitution skipped` |
| H4：DB stale definition | **REJECTED** | html_paste heading 会从 sourceHtml 重 encode |
| H5：replaceTextInSubtree 失败 | **REJECTED** | post-fix `replacedOk: true` |

**修复后（log line 80-82）：**
- `slots.number: "1"`, `hasNumberBinding: true`
- heading 1 → `label: "01"`, heading 2 → `label: "02"`, `replacedOk: true`

## 4. 修改文件

- `src/core/dsl/encoder/heading-semantic-extractor.ts` — `inferCircularBadgeNumberFromTree`
- `src/core/dsl/decoder/fidelity-tree-substitution.ts` — debug instrumentation 已移除（2026-06-08 用户确认）
- `tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts` — cdcdd32e 递增测试

## 5. 关键变更

encode 时若 `classifyHeadingSlots` 未找到 number，则从 fidelity tree 推断 `border-radius: 100%` + `background-color` 圆形 badge 内的纯数字文本，写入 `slots.number` 并生成 `semanticBindings.number`，使既有 decode 递增逻辑生效。

## 6. 验收

| AC | 结果 |
|----|------|
| 多 heading 圆形 badge 01/02/03 | PASS（vitest） |
| 单测不回归 4933bb91 | PASS |
| 用户 UI 复测 | Pending |

## 7. 检查命令

```bash
npm exec vitest run tests/lib/dsl-runtime-fidelity-heading-substitution.test.ts
```

## 8. Commit

- Commit hash：未提交 / not committed
