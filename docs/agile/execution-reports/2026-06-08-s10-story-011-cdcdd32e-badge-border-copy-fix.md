# Execution Report：cdcdd32e 圆形编号 badge 配色 + copy 横线丢失

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：`feature/s10-story-011-promote-user-selectable-final`（sprint 工作分支）
- Sprint：S10
- 关联 Story / Bug / Decision：S10 Story-011 html_paste fidelity theme tokens
- 执行者：Cursor
- 状态：Done（用户 UI 验收通过）

## 2. 本轮目标

修复 `heading_html_paste_cdcdd32e_candidate` 两类问题：
1. 左侧圆形编号 section 的 `background-color` 不随配色切换
2. Copy 后标题下横线消失（split `border-width` / `border-color` 被 WeChat allowlist 过滤）

## 3. 执行范围

- 在 decode-time theme remap 增加圆形 badge 检测与 `textAccent` 重映射
- 在 copy 序列化前将 bottom-only split border 合成 `border-bottom` shorthand
- 补充 E21 上传 HTML 结构回归测试
- 未改 admin inspection 路径；未改 encoder semanticBindings 检测

## 4. 修改文件

- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `src/core/dsl/decoder/render-style.ts`
- `tests/lib/html-paste-fidelity-theme-tokens.test.ts`

## 5. 新增文件

- 无（临时 `tests/lib/debug-cdcdd32e.test.ts` 已删除，覆盖合并入主测试）

## 6. 阅读但未修改的关键文件

- `src/core/wechat-compatibility/allowed-style-properties.ts`
- `tests/fixtures/dsl/e21-heading-html.ts`

## 7. 关键变更说明

### 根因（runtime log 证实）

| 假设 | 结论 | 证据 |
|------|------|------|
| H1：badge `backgroundColor` 不在 semanticBindings.number 节点 | **CONFIRMED** | bindings 仅含 title；preview 保留 `rgb(25, 82, 224)` |
| H2：copy 过滤 split border 属性 | **CONFIRMED** | pre-fix `copyHasBorderBottom:false`；post-fix `copyHasBorderBottom:true` |
| H3：isAccentBarNode 尺寸为 em 无法匹配 | **CONFIRMED** | 需独立 circular badge 检测 |

### 修复

1. **`applyCircularBadgeThemeTokens`**：`border-radius: 100%/50%/9999px` + `backgroundColor` 的节点，将 `backgroundColor`/`borderColor` remap 为 `palette.textAccent`（与 accent bar 相同 source-token 匹配策略）。
2. **`synthesizeBottomBorderForCopy`**：copy 路径在 allowlist 过滤前，将 `border-width: 0 0 Npx` + `border-color` + `border-style` 合成 `border-bottom: Npx solid {color}`。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| 切换配色后圆形编号背景跟随 accent | PASS（单测） | preview/copy 均为 `#2563eb` |
| Copy 后标题下横线可见 | PASS（单测） | copy HTML 含 `border-bottom: 1px solid #2563eb` |
| admin inspection 不受影响 | N/A | 未改 gate 条件 |
| 用户 UI 手工验收 | 待确认 | 需用户在编辑器复现 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm exec vitest run tests/lib/html-paste-fidelity-theme-tokens.test.ts` | PASS | 11 tests |
| pnpm lint | 未运行 | — |
| pnpm build | 未运行 | — |

## 10. 未完成事项

- 用户 UI 侧确认 cdcdd32e variant
- 标题 wrapper section 的 `color: rgb(25,82,224)` 仍未 remap（非本轮报告问题）

## 11. 风险与阻塞

- 无

## 12. 需要用户 / ChatGPT 审查的问题

- 圆形 badge remap 在无 `dsl.tokens.accentColor` 时默认全部 remap（与 accent bar 一致）；是否需更严格 source-color 匹配？

## 13. 建议下一步

1. 用户在编辑器切换配色并 Copy 验证 cdcdd32e
2. 通过后 commit 并 merge 回 sprint 分支

## 14. Commit

- Commit hash：未提交 / not committed
