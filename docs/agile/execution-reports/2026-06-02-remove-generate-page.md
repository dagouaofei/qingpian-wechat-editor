# Execution Report：删除 `/generate` 与 batch `/api/generate`

> **合并说明：** 本报告为 `2026-06-02-visible-progress-gallery-legacy.md` 的补充切片；验收与 merge 以主报告为准。

## 1. 基本信息

- 日期：2026-06-02
- 关联：CHORE-VIS-001 · S7-UX-POLISH-01/02
- 状态：**Done**（用户验收 2026-06-02）

## 2. 删除范围

- `src/app/generate/*`（整目录）
- `src/app/api/generate/route.ts`（batch GET/POST）
- `src/server/generation/run-generate-main-flow.ts`
- `tests/e2e/generate-page.spec.ts`
- `tests/server/generation/run-generate-main-flow.test.ts`

## 3. 迁移

- `ArticlePreviewPanel` → `src/components/preview/article-preview-panel.tsx`
- API 类型 → `src/lib/generate-api-types.ts`

## 4. 保留

- `POST /api/generate/stream` + `run-generate-stream-flow.ts`

## 5. Commit

- 见主报告 `2026-06-02-visible-progress-gallery-legacy.md`
