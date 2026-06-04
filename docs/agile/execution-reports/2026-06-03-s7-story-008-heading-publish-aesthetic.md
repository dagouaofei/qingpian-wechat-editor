# Execution Report · S7-STORY-008 Heading Publish 8 款审美实验

> **日期：** 2026-06-03

## 任务背景

在保证 Copy 一致性的前提下，将公众号小标题（`heading`）收敛为 8 款「能发」审美合格样式；废弃历史 13 款中的 5 款；抛光 Preview/Copy 同源视觉。

## 分支

| 项 | 值 |
|----|-----|
| 当前分支 | `feature/s7-story-007a-r1-style-fidelity`（延续未合并工作；计划名 `feature/s7-story-008-heading-publish-aesthetic`） |
| 来源分支 | `sprint/s7-wechat-article-experience` |
| 建议合并目标 | `sprint/s7-wechat-article-experience` |
| Commit | 未提交 / not committed |

## 关联

- **Story：** S7-STORY-008 · **Decision：** DECISION-087
- **Out of scope：** title 重做 · 第 9 款 heading · Release 1 关闭

## 本轮目标

- 8 款 `HEADING_PUBLISH` 发布池为唯一 heading registry 来源
- Preview/Copy 装饰同源（`heading-publish-visual` ↔ `title-heading-copy-styles`）
- 产品 catalog + 粘贴 QA 模板
- `/gallery` + `/preview` 可选 8 款

## 执行范围

- 新增/更新产品文档与 paste QA 模板
- 抛光 copy/preview 实现
- diversity / gallery 样例 / R8 fallback 策略
- 测试与 build 验证

## 修改文件（主要）

- `docs/product/heading-publish-catalog.md`（新）
- `docs/agile/paste-qa/heading-publish-8.md`（新）
- `docs/product/r1-style-quality-baseline.md`
- `docs/agile/decisions.md` · `docs/agile/sprint-backlog.md`
- `src/core/styles/variants/heading-publish-pool.ts`
- `src/core/renderer/heading-publish-visual.ts`
- `src/core/copy/title-heading-copy-styles.ts` · `title-block-copy.ts`
- `src/components/preview/title-heading-preview-block.tsx`
- `src/core/generation/style-selection-diversity.ts`
- `src/lib/gallery-title-heading.ts`
- `src/core/styles/style-orchestrator-rules.ts`（R8 `preferPlainRhythm`）
- 多项测试修复

## 验收标准

| AC | 状态 |
|----|------|
| AC-1 仅 8 款 heading | PASS |
| AC-2 catalog + paste 模板 | PASS |
| AC-3 gallery + preview 切换 | PASS |
| AC-4 parity 测试 + build | PASS |
| AC-5 PO catalog 审美 ≥6/8 | **Pending PO** |
| AC-6 PO 粘贴 ≥6/8 | **Pending PO** |

## 检查命令

```bash
npm run test   # 812 passed
npm run build  # PASS
```

## 未完成

- PO 填写 [`heading-publish-catalog.md`](../product/heading-publish-catalog.md) 审美表
- PO 填写 [`heading-publish-8.md`](../paste-qa/heading-publish-8.md) 粘贴表
- 建议独立 commit 后 merge sprint（需用户确认）

## 建议下一步

1. PO 在 `/gallery` 逐款验收 8 套样例 + Copy 对照区
2. 公众号粘贴填 `heading-publish-8.md`
3. 通过后 merge 工作分支 → `sprint/s7-wechat-article-experience`
