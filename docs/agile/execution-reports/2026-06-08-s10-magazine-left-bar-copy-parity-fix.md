# Execution Report：BUG-S10-COPY-FIDELITY-001 杂志竖线 Preview/Copy parity

## 1. 基本信息

- **日期：** 2026-06-08
- **当前分支：** `feature/s10-story-011-integration-readiness`
- **来源分支：** `sprint/s10-db-backed-style-admin-v1`（integration 分支延续）
- **目标合并分支：** `sprint/s10-db-backed-style-admin-v1`（未 merge）
- **Sprint：** Sprint 10
- **关联 Story / Bug：** BUG-S10-COPY-FIDELITY-001 · S10-STORY-011
- **执行者：** Cursor
- **状态：** Done（代码 + 用户验收 PASS · quality gate 重跑待确认）

## 2. 本轮目标

修复 `heading_magazine_left_bar` Preview 双竖线、Copy 仅标题侧单竖线且未顶到头的不一致。

## 3. 根因

- Preview：`renderTitleBlockPreview` → React 嵌套 `copySafeMagazineLeftBarLightRailStyle` + `AccentRailStyle`
- Copy：`renderPublishMagazineLeftBarCopy` 将 `border-left: 3px` 仅放在 `h3` 上，丢失外层 1px 浅线与全块高度

## 4. 修改文件

- `src/core/renderer/heading-publish-copy-html.ts` — Copy 双嵌套 section 竖线
- `src/core/renderer/heading-publish-decoration.ts` — copy contract 更新（1px+3px on section，禁止 h3 border-left）
- `docs/agile/bugs.md` — BUG-S10-COPY-FIDELITY-001 → Fixed
- `docs/agile/changelog.md`

## 5. 验收

- 用户人工验收：Preview/Copy 双竖线 parity PASS
- `tests/core/renderer/title-heading-renderer.test.ts` PASS

## 6. 未完成

- DB `qualityStatus=copy_fidelity_failed` 重跑 / `userSelectable` 恢复评估（若仍 gate 排除需单独 story）

## 7. commit hash

`947446a` — fix: align heading_magazine_left_bar copy with preview dual rails
