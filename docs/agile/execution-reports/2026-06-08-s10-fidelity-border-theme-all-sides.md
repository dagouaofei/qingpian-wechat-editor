# Execution Report：S10-STORY-011 四边 border 跟随 preview 配色

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-fidelity-border-theme-all-sides`
- 来源分支：`feature/s10-wechat-compatibility-global-off-default`（Part 1 commit `e1a026e` 后切出）
- 目标合并分支：`feature/s10-wechat-compatibility-global-off-default` 或 Sprint 10 当前工作线（待用户确认）
- Sprint：Sprint 10
- 关联 Story / Bug / Decision：S10-STORY-011 · html_paste fidelity theme tokens 扩展
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

1. **Part 1（已完成 commit）**：commit `49b0ec2b` inline 编号色修复，避免 preview 将实心小编号 remap 为 `bgBand`。
2. **Part 2（本分支未 commit）**：扩展 fidelity-tree theme remapping，使 `border-left` / `border-right` / `border-top` 与既有 `border-bottom` 一样在 preview / copy decode 时跟随 `palette.textAccent`；`admin_inspection` 仍保持源色。

## 3. 执行范围

**做了：**

- Part 1：`shouldRemapNumberRoleColor` + 回归测试 · commit `e1a026e`
- Part 2：抽象四边 decorative border 检测与 remap；卡片型 `border` / `borderLeft` 等同色 token 匹配 remap；`shouldApplyFidelityThemeTokens` 支持 `meta.styleTokens`（无 semanticBindings 的 bordered heading）；`applyDecorativeLineThemeTokens` 遍历 `slot` 节点（h3 边框所在节点类型）
- 扩展 `html-paste-fidelity-theme-tokens` 测试：left-bar、border-top divider、bordered card

**未做（按计划排除）：**

- `render-style.ts` 的 `synthesizeBottomBorderForCopy` 四边扩展
- wechat-compat 债务合并、Variant schema 变更
- merge / push

## 4. 修改文件

- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `tests/lib/html-paste-fidelity-theme-tokens.test.ts`

## 5. 新增文件

- `tests/lib/heading-49b0ec2b-inline-number-color.test.ts`（Part 1 · 已 commit）
- `docs/agile/execution-reports/2026-06-08-s10-fidelity-border-theme-all-sides.md`

## 6. 阅读但未修改的关键文件

- `tests/fixtures/dsl/bordered-heading-html.ts`
- `tests/fixtures/dsl/complex-heading-html.ts`
- `tests/fixtures/dsl/short-line-heading-html.ts`
- `src/core/dsl/decoder/render-style.ts`
- `docs/agile/execution-reports/2026-06-08-s10-story-011-fidelity-border-bottom-theme.md`

## 7. 关键变更说明

### Part 1 — inline 编号色（commit `e1a026e`）

`shouldRemapNumberRoleColor`：小实心 inline 编号（非 stroke、非 ≥40px、非 rgba 透明）跳过 `palette.bgBand` remap，保留源 accent 色；装饰性大编号 / stroke 编号仍 remap。

### Part 2 — 四边 border theme

| 模块 | 变更 |
|------|------|
| `isDecorativeBorderSide` | 统一 top/right/bottom/left 检测；bottom 在 `isFullCardBorder`（带 radius 的完整卡片）时跳过，避免误判 card 底边 |
| `remapDecorativeBorderAccents` | 对匹配 side 调用 `replaceBorderSolidColor` |
| `remapTokenMatchedBorderColors` | 遍历 `border` / `borderLeft` 等，源色命中 `dsl.tokens` 或 `meta.styleTokens` 时 remap |
| `hasThemeRemappableMetadata` | 除 `semanticBindings` 外，有 `meta.styleTokens` 也允许 apply theme（bordered heading 场景） |
| `readSourceTokenColors` | 从 `meta.styleTokens` 提取 border / 颜色值 |
| `applyDecorativeLineThemeTokens` | 同时处理 `element` 与 **`slot`** 节点（bordered heading 的 h3 为 slot） |

**根因（bordered card 测试最初失败）：** encode 后 h3 为 `slot` 类型，原 walk 仅处理 `element`，边框 remap 被跳过。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| border-bottom 回归不变 | PASS | 现有 short-line / e21 / upload 用例通过 |
| border-left 随 palette 切换 | PASS | left-bar fixture `#2563eb` ↔ `#ea580c` |
| border-top divider 随 palette 切换 | PASS | complex chapter overlay |
| bordered card border + borderLeft 随 palette | PASS | `BORDERED_HEADING_HTML` |
| admin_inspection 不 apply theme | PASS | 既有 preserve-source 用例未回归 |
| inline 编号色保留源 accent | PASS | `heading-49b0ec2b-inline-number-color.test.ts` |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `npm run test -- tests/lib/html-paste-fidelity-theme-tokens.test.ts tests/lib/heading-49b0ec2b-inline-number-color.test.ts` | PASS | 15 tests |
| `pnpm lint` | 未运行 | 本轮仅改 decoder + 测试 |
| `pnpm build` | 未运行 | 建议 merge 前跑全量 |

## 10. 人工验收路径

1. Admin Inspection：打开带 left-bar / top-line / bordered card 的 `heading_html_paste_*` variant，记录 harvest 源色。
2. 用户 Preview：切换 businessBlue ↔ creamOrange，确认四边 accent 线同步变化。
3. Inspection HTML 仍保持 harvest 源色（`admin_inspection` target 不 apply theme）。

## 11. 未完成事项

- Part 2 代码**未 commit**（用户仅要求 Part 1 commit）
- 未 merge 至 sprint / 父 feature 分支
- copy 路径四边 split-border 合成（`synthesizeBottomBorderForCopy`）留 follow-up

## 12. 风险与阻塞

- 低：`styleTokens`-only DSL 会启用 theme apply，需确认无其它 family 误触发（当前仍限 `htmlPaste` / `htmlPasteCandidate`）
- 低：left accent bar 宽度上限 6px，极宽 left bar 可能不 remap

## 13. 需要用户 / ChatGPT 审查的问题

1. Part 2 是否 approve commit + merge 至 `feature/s10-wechat-compatibility-global-off-default`？
2. `styleTokens` 作为 theme gate 条件是否足够，还是应显式标记 bordered-heading decorator？

## 14. 建议下一步

1. 用户确认后 commit Part 2（建议 message：`feat: remap html_paste decorative borders on all sides for theme palette`）
2. merge 工作分支至 Sprint 10 当前 feature 线
3. 人工验收 left-bar / bordered card / complex top-line variants
4. 若 copy clipboard 四边 split-border 不一致，单开 follow-up

## 15. Commit

- Part 1：`e1a026e` — `fix: preserve inline html_paste number accent color in preview`（在 `feature/s10-wechat-compatibility-global-off-default`）
- Part 2：`ce91b1c` — `feat: remap html_paste decorative borders on all sides for theme palette`（`feature/s10-story-011-fidelity-border-theme-all-sides`）
