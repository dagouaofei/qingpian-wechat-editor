# Execution Report：S10-STORY-011 e21d5346 border-bottom 小横线配色跟随

## 1. 基本信息

- 日期：2026-06-08
- 当前分支：`feature/s10-story-011-html-paste-fidelity-theme-tokens`
- 来源分支：`feature/s10-story-011-promote-user-selectable-final`
- 目标合并分支：`feature/s10-story-011-promote-user-selectable-final`（待用户确认）
- Sprint：S10
- 关联 Story / Bug：S10-STORY-011 · `heading_html_paste_e21d5346_candidate`
- 执行者：Cursor
- 状态：In Review

## 2. 任务背景

`heading_html_paste_e21d5346_candidate` 为标题下方 `border-bottom` 短线结构。上一轮 fidelity theme remap 仅覆盖语义 `color` 与 `backgroundColor` accent bar，未处理 `border-bottom` 装饰线，切换配色时小横线仍为源 HTML 色（如 `#E60012`）。

## 3. 本轮目标

扩展 decode 阶段 theme remap，使 decorative `border-bottom` 映射到 `textAccent`，与 registry `heading_short_line` 行为对齐。

## 4. 执行范围

**做了：**

- `fidelity-tree-theme-tokens.ts` 增加 border-bottom 装饰线识别与 remap
- 新增 e21d5346 类 fixture 与 palette 切换单测
- 修复 `border: none` 被误判为 bordered box 导致跳过 remap 的问题

**未做：**

- eyebrow 行 `border-top`（`top_line` decorator）
- merge / commit（待用户确认）

## 5. 修改文件

- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `tests/lib/html-paste-fidelity-theme-tokens.test.ts`

## 6. 新增文件

- `tests/fixtures/dsl/short-line-heading-html.ts`

## 7. 关键决策

1. Decorative border-bottom 映射到 `textAccent`（对齐 `copySafeShortLineUnderlineStyle`）
2. 识别规则：`borderBottom` 含 solid/dashed，且（`lineHeight`/`fontSize` 为 0 **或** 颜色匹配 `tokens.accentColor`），并排除 meaningful 全边框卡片（`borderLeft` / `borderRadius` / 非 `none` 的 `border`）
3. `border: none` 不计入 bordered box，避免误伤 short-line `p` 节点

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| e21d5346 切换配色后 border-bottom 变色 | PASS | businessBlue `#2563eb` / creamOrange `#ea580c` |
| Preview 与 Copy 一致 | PASS | 单测断言 clipboard |
| 4933bb91 / complex heading 不退化 | PASS | 既有 16 项 vitest PASS |
| Admin / 无 themePalette 保留源色 | PASS | 新增 + 既有对照单测 PASS |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| npm run lint | PASS | 0 errors |
| vitest（html-paste-fidelity + fidelity-substitution） | PASS | 16/16 |

## 10. 未完成事项

- 用户 `/preview` 人工复验 e21d5346 variant
- commit（待用户请求）
- merge 到 sprint（待用户确认）

## 11. 风险与阻塞

- 无

## 12. 建议下一步

1. 人工验收 `/preview` 切换商务蓝 / 奶油橙
2. 审查通过后 commit + merge 工作分支

## 13. Commit

- Commit hash：未提交 / not committed
