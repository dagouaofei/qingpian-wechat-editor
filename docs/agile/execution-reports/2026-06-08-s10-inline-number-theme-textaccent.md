# Execution Report：49b0ec2b inline 编号 theme textAccent

## 1. 基本信息

- **日期：** 2026-06-08
- **当前分支：** `feature/s10-story-011-integration-readiness`
- **关联 Story：** S10-STORY-011 · html_paste theme tokens
- **Variant：** `heading_html_paste_49b0ec2b_candidate`
- **状态：** Done（用户验收 PASS）

## 2. 问题

切换 preview 配色（如 businessBlue ↔ creamOrange）时，inline 编号文字仍固定为 harvest source 色 `rgb(41,50,225)`，未随 theme 变化。

## 3. 根因

`shouldRemapNumberRoleColor` 对 `<40px` 实心 inline 编号返回 `false`，`applyRoleColorAtPath` 跳过 number 角色 remap（Part 1 `e1a026e` 为避免误用 `bgBand` 作文字色而引入）。

## 4. 修复

- 拆分 token 策略：`resolveNumberRoleColorToken`
  - inline accent 编号 → **`textAccent`**
  - 大号/`-webkit-text-stroke`/透明编号 → **`bgBand`**
- admin_inspection 仍不应用 theme（source 色保留）

## 5. 修改文件

- `src/core/dsl/decoder/fidelity-tree-theme-tokens.ts`
- `tests/lib/heading-49b0ec2b-inline-number-color.test.ts`
- `docs/architecture/article-variant-dsl-runtime.md`
- `docs/agile/changelog.md`

## 6. 验收

- `heading-49b0ec2b-inline-number-color.test.ts` 2/2 PASS
- 用户人工验收 PASS

## 7. commit hash

未提交 / not committed（提交后更新）
