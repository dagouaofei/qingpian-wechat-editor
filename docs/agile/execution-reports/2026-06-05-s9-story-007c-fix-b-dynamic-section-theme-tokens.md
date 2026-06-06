# Execution Report：S9-STORY-007C-FIX-B Dynamic Section Index and Theme-aware Color Tokens

## 1. 基本信息

- 日期：2026-06-05
- 当前分支：`feature/s9-story-007c-expose-user-selectable-preview-picker`
- 关联：S9-STORY-007C-FIX-B · DECISION-107
- 状态：In Review

## 2. 问题

1. Section label 数字固定（多 heading 同号）
2. 渲染色硬编码 `#0d9488`，不随文章配色变化

## 3. 修复

- `resolveHtmlPasteSectionLabelStyleTokens` — 动态 `SECTION NN` + theme `textAccent`
- `#0d9488` → `HTML_PASTE_SOURCE_REFERENCE_COLOR`（evidence only）
- Preview / Copy / UI 共用 helper
- 显示名：章节标签标题（HTML 采集 · 用户可选）
- 测试：`html-paste-section-label-fix-b.test.ts`

## 4. 验证

| 命令 | 结果 |
|------|------|
| lint | PASS |
| test | PASS |
| build | PASS |

## 5. Commit

- `fix: make html paste section label dynamic and theme-aware`
