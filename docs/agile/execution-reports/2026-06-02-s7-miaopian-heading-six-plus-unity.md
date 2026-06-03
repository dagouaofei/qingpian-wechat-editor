# Execution Report：miaopian 六种小标题 + 全文统一 + 公众号字号

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s7-rich-styles-title-heading`
- 目标合并分支：`sprint/s7-wechat-article-experience`
- 关联：S7-STORY-003 · DECISION-083
- 状态：**In Review**

## 2. 本轮目标

1. 新增与 miaopian-demo 对齐的 6 种 heading 样式（荧光笔 / 短线 / 图标前缀 / 极简数字 / 杂志竖线 / 杂志错位）
2. 同一篇文章内所有 `heading` 使用相同 variant
3. 调整 preset 级字号行高，更贴近公众号阅读习惯

## 3. 关键变更

- `src/core/styles/variants/miaopian-heading-variants.ts`：6 个新 variant（registry heading **13** 种，总计 **97** variants）
- `src/core/styles/style-orchestrator-heading-unify.ts` + orchestrator 在 rhythm 前统一 heading
- **禁用编排 R1**（相邻 heading 不得同 variant）以符合 miaopian 全文统一模型
- `src/config/miaopian-typography.ts`：`resolveTitleBlockTypography` / 正文 `text-block-typography` 按 preset 应用字号行高
- Preview / Copy：`highlight_marker`、`short_line`、`icon_prefix`、`minimal_number`、`magazine_left_bar`、`magazine_offset` 布局实现
- preset 默认 heading：`business→short_line`、`xiaohongshu→highlight_marker`、`magazine→offset`、`keynote→magazine_left_bar` 等

## 4. 验收

| 项 | 结果 |
|----|------|
| 6 种新 heading Gallery 可选 | PASS（`HEADING_POOL` 13 id） |
| 全文 heading 同 variant | PASS（orchestrator unify + 关闭 R1） |
| 公众号字号 | PASS（代码；待 PO 目视） |
| `npm run test` | **796 passed** |
| `npm run build` | PASS |

## 5. Commit

未提交 / not committed
