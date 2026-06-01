# Execution Report：S4A-STORY-004 lead / paragraph InlineContent Preview + Copy Renderer

## 1. 基本信息

- 日期：2026-06-01
- 当前分支：`feature/s4a-inline-content-renderer`
- 来源分支：`sprint/s4a-text-first-renderer`
- 目标合并分支：`sprint/s4a-text-first-renderer`
- Sprint：Sprint 4-A（text-first Preview / Copy Renderer）
- 关联 Story / Bug / Decision：S4A-STORY-004；P2-S3B-003 / P1-CODE-002（InlineMark color ↔ ColorTokenRef 最小桥接）
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

实现 lead / paragraph 6 个 first-wave variants 的成对 Preview / Copy Renderer，打通 InlineContent / InlineMark 最小 Preview + 微信 copy-safe HTML 映射。

## 3. 执行范围

**已完成：**

- InlineContent renderer helper（Preview + Copy）
- InlineMark bold / italic / highlight / color / link 最小映射
- lead / paragraph Preview + Copy Renderer 与 registry 注册
- string | InlineContent normalize 渲染
- color token alias 桥接 + 不安全 color / href fallback + issue
- 单元测试（Preview / Copy / registry / escape / marks / fallback）

**明确未做：**

- divider Renderer（S4A-STORY-005）
- structured blocks（list / quote / cta 等）
- 业务页面 / Clipboard API / Paste QA
- merge 至 sprint / release / main

## 4. 修改文件

- `src/core/copy/html-escape.ts` — 新增 `escapeHtmlAttribute`
- `src/core/copy/index.ts` — 导出 text-block / inline-content Copy 模块
- `src/core/renderer/index.ts` — 导出 text-block / inline-content 模块
- `src/core/renderer/issues.ts` — `unsafe_inline_color` / `unsafe_link_href` severity
- `src/core/renderer/types.ts` — TextBlock Preview/Copy 输出与 PreviewInlineNode 类型
- `src/core/renderer/README.md`
- `src/core/copy/README.md`
- `docs/agile/sprint-backlog.md`

## 5. 新增文件

- `src/core/renderer/inline-content-marks.ts`
- `src/core/renderer/inline-content-preview.ts`
- `src/core/renderer/text-block-typography.ts`
- `src/core/renderer/text-block-preview.ts`
- `src/core/renderer/text-block-renderer.ts`
- `src/core/renderer/text-block-registry.ts`
- `src/core/copy/inline-content-html.ts`
- `src/core/copy/text-block-copy.ts`
- `tests/fixtures/renderer/lead-paragraph-articles.ts`
- `tests/core/renderer/lead-paragraph-renderer.test.ts`
- `tests/core/copy/inline-content-copy-renderer.test.ts`
- `tests/core/copy/lead-paragraph-copy-renderer.test.ts`

## 6. 阅读但未修改的关键文件

- `docs/architecture/rendering-pipeline.md`
- `docs/architecture/copy-to-wechat-pipeline.md`
- `docs/architecture/wechat-copy-style-rules.md`
- `docs/architecture/style-system.md`
- `src/core/renderer/title-block-renderer.ts`（S4A-STORY-003 模式参考）
- `src/core/copy/title-block-copy.ts`（html-escape / inline-style 复用）
- `src/core/article/inline-content.schema.ts`

## 7. 关键变更说明

- 复用 S4A-STORY-002 `renderBlock` + registry 模式，新增 `createTextBlockRendererRegistry()` 注册 lead / paragraph × preview / copy。
- Copy HTML 全部使用 inline `style`，经 `assertCopySafeHtml` 校验，不使用 className / Tailwind / `<style>` 标签。
- `resolveInlineMarkColor`：ColorTokenRef → theme token；Article semantic token（如 `brandPrimary`）→ alias 映射；safe hex 直出；否则 fallback 默认色 + `unsafe_inline_color` warning。
- `resolveInlineMarkLink`：禁止 `javascript:` / `data:` 等协议；非法 href strip 为纯文本 + `unsafe_link_href` warning。
- `content.text` 经 `normalizeInlineContent` 支持 string | InlineContent。

## 8. 验收标准完成情况

| AC | 结果 | 说明 |
|----|------|------|
| AC-1 Preview InlineContent | PASS | `renderTextBlockPreview` + `renderInlineContentPreviewNodes` |
| AC-2 Copy marks 映射 | PASS | bold / italic / highlight / color / link inline style |
| AC-3 color token fallback | PASS | alias 桥接 + `unsafe_inline_color`；完整 registry 校验留后续 |
| AC-4 copy-safe CSS | PASS | `assertCopySafeHtml`；无 class / style tag |
| AC-5 单元测试 | PASS | 24 cases 新增，348 total |
| AC-6 lint / test / build | PASS | 全部通过 |
| AC-7 execution report | PASS | 本文件 |
| AC-8 范围边界 | PASS | 未实现 divider / structured / 页面 / Clipboard |
| AC-9 未 merge | PASS | 待用户审查 |

## 9. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| corepack pnpm lint | PASS | 无 error / warning |
| corepack pnpm test | PASS | 348 tests |
| corepack pnpm build | PASS | Next.js build 成功 |

## 10. 未完成事项

- Article semantic color token 与 Style ColorTokenRef 完整 cross-registry 校验（P2-S3B-003 / P1-CODE-002 遗留）
- merge 至 `sprint/s4a-text-first-renderer`（待用户确认）
- Story 关闭（待 ChatGPT / 用户审查）

## 11. 风险与阻塞

- Article Schema 在 ingest 阶段拒绝非法 href / CSS color；Renderer 层 link/color fallback 为 defense-in-depth，integration 测试对非法 href 使用 Copy helper 直接注入场景。
- `lead_accent_band` / `paragraph_soft_card` 等 balanced copySafety variants 输出 copy_safety_warning，需 S4A-STORY-006 Paste QA 人工验证。

## 12. 需要用户 / ChatGPT 审查的问题

- `ARTICLE_SEMANTIC_COLOR_ALIASES`（如 `brandPrimary` → `brand.primary`）是否足够，或是否应在 Style registry 层统一？
- S4A-STORY-004 是否可标记 Done 并 merge 回 sprint？

## 13. 建议下一步

- 用户 / ChatGPT 审查通过后 merge `feature/s4a-inline-content-renderer` → `sprint/s4a-text-first-renderer`
- 启动 S4A-STORY-005（divider Preview + Copy Renderer）

## 14. Commit

- Commit hash：`1283adb`
